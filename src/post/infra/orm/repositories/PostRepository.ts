import { SqlEntityRepository } from '@mikro-orm/sqlite'
import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core'
import { IPostRepository } from '@/post/repositories/IPostRepository'
import { Post } from '../models/Post'

export class PostRepository implements IPostRepository {
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
    return this.repository.find({ id: { $in: ids } })
  }

  async findByParentId(id: Post['id']) {
    return this.repository.find({ post: { id: id } })
  }

  async findNextNPostIdsAfter(limit: number, id?: Post['id']) {
    let ids = []
    if (id) {
      const post = (await this.repository.find({ id }))[0]
      ids = await this.repository.find(
        { id: { $gt: id }, post: undefined, createdAt: { $gte: post.createdAt } },
        { fields: [], limit }
      )
    } else {
      ids = await this.repository.find({ post: undefined }, { fields: [], limit, orderBy: { createdAt: 'ASC' } })
    }

    return ids.map((post) => post.id)
  }
  async countByParentId(id: number) {
    return this.repository.count({ post: { id: id } })
  }
}
