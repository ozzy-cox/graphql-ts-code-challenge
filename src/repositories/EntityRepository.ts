import { Post } from '../entities/Post'
import { Repository } from './RepositoryInterface'

export class InMemoryPostRepository implements Repository<Post> {
  lastId = 0
  posts: Post[] = []

  add(partialEntity: Omit<Post, 'id' | 'createdAt'>): Promise<Post> {
    return new Promise((resolve, reject) => {
      const post = {
        ...partialEntity,
        id: this.lastId,
        createdAt: new Date()
      }
      this.posts.push(post)
      this.lastId += 1
      resolve(post)
      /**   */
    })
  }

  list(offset: number, take: number): Promise<Post[]> {
    return new Promise((resolve) => {
      resolve(this.posts.slice(offset, offset + take))
    })
  }
}
