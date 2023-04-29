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
    return await this.repository.find({}, { offset, limit })
  }

  async add(post: Omit<IPost, 'id' | 'createdAt'>) {
    const postEntity = new Post(post)
    await this.repository.persistAndFlush(postEntity)
    return postEntity as Post
  }

  // Culpa
  async findBy(where: { [key: string]: unknown }) {
    return this.repository.find(where)
  }
}
