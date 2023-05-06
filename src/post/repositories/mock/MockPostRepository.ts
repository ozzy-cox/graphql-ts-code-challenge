import { Post } from '@/post/infra/orm/models/Post'
import { MockRepository } from '@/repositories/mock/InMemoryRepo'
import { _IPostRepository } from '../IPostRepository'

export class MockPostRepository extends MockRepository<Post> implements _IPostRepository {
  async create(post: Omit<Post, 'id' | 'createdAt'>) {
    const entity = {
      ...post,
      id: this.lastId,
      createdAt: new Date()
    }
    this.entities.push(entity)
    this.lastId += 1
    return entity
  }
}
