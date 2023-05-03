import { Post } from '@/lib/orm/models/Post'
import { IPostRepository, Post as IPost } from '../entities/Post'
import { SqlEntityRepository } from '@mikro-orm/sqlite'
import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core'

export class PostRepository implements IPostRepository {
  repository: SqlEntityRepository<Post>
  constructor(private em: EntityManager<IDatabaseDriver<Connection>>) {
    this.repository = em.getRepository(Post)
  }

  async list(offset: number, limit: number): Promise<IPost[]> {
    return await this.repository.find({ post: undefined }, { offset, limit })
  }

  async add(post: Omit<IPost, 'id' | 'createdAt'>) {
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

  async findByIdAndSelectIds(id: number, limit: number) {
    return (await this.repository.find({ id: { $gt: id } }, { fields: [], limit })).map((post) => post.id)
  }
}
