import { Post } from '@/lib/orm/entities'
import { Post as IPost } from '../entities/Post'
import { Repository } from './RepositoryInterface'
import { SqlEntityRepository } from '@mikro-orm/sqlite'
import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core'

export class InMemoryPostRepository implements Repository<IPost> {
  lastId = 1 // fake autoincrement id
  posts: IPost[] = []

  add(partialEntity: Omit<IPost, 'id' | 'createdAt'>): Promise<IPost> {
    return new Promise((resolve, reject) => {
      const post = {
        ...partialEntity,
        id: this.lastId,
        createdAt: new Date()
      }
      this.posts.push(post)
      this.lastId += 1
      resolve(post)
    })
  }

  list(offset: number, limit: number): Promise<IPost[]> {
    return new Promise((resolve) => {
      resolve(this.posts.slice(offset, offset + limit))
    })
  }
}

export class ORMPostRepository implements Repository<IPost> {
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
}
