import { SqlEntityRepository } from '@mikro-orm/sqlite'
import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core'
import { IPostRepository, _IPostRepository } from '@/post/repositories/IPostRepository'
import { Post } from '../models/Post'
import { IPost } from '@/post/entities/IPost'

// TODO Make NOT generic
export class PostRepository implements IPostRepository {
  repository: SqlEntityRepository<Post>
  constructor(private em: EntityManager<IDatabaseDriver<Connection>>) {
    this.repository = em.getRepository(Post)
  }

  async list(offset: number, limit: number): Promise<Post[]> {
    return await this.repository.find({ post: undefined }, { offset, limit })
  }

  async add(post: Omit<Post, 'id' | 'createdAt'>) {
    const postEntity = new Post(post)
    await this.repository.persistAndFlush(postEntity)
    return postEntity as Post
  }

  async findBy(where: { [key: string]: unknown }) {
    return this.repository.find(where)
  }

  async count(where: { [key: string]: unknown }) {
    return this.repository.count(where)
  }

  async findByIdAndLimitIds(id: number, limit: number) {
    return (await this.repository.find({ id: { $gte: id }, post: undefined }, { fields: [], limit })).map(
      (post) => post.id
    )
  }

  async findByPropertyIn(property: string, _in: unknown[]) {
    return await this.repository.find({ [property]: { $in: _in } })
  }
}

export class _PostRepository implements _IPostRepository {
  private repository: SqlEntityRepository<Post>
  constructor(em: EntityManager<IDatabaseDriver<Connection>>) {
    this.repository = em.getRepository(Post)
  }

  async create(post: Omit<Post, 'id' | 'createdAt'>) {
    const postEntity = new Post(post)
    await this.repository.persistAndFlush(postEntity)
    return postEntity as Post
  }

  async findById(ids: Post['id'][]) {
    return await this.repository.find({ id: { $in: ids } })
  }

  async findByParentId(id: Post['id']) {
    return await this.repository.find({ post: { id: id } })
  }

  async findNextNPostIdsAfter(id: Post['id'], limit: number) {
    const post = (await this.repository.find({ id }))[0]
    return (
      await this.repository.find(
        { id: { $gte: id }, post: undefined, createdAt: { $gte: post.createdAt } },
        { fields: [], limit, orderBy: { createdAt: 'DESC' } }
      )
    ).map((post) => post.id)
  }
  async countByParentId(id: number) {
    return await this.repository.count({ post: { id: id } })
  }
}
