import { IPost } from '@/post/entities/IPost'
import { IPostRepository } from '@/post/repositories/IPostRepository'
import { BaseMockRepo } from '@/shared/repositories/mock/BaseMock'
import assert from 'assert'

export class MockPostRepository extends BaseMockRepo<IPost> implements IPostRepository {
  async create(post: Omit<IPost, 'id' | 'createdAt'>) {
    const createdAt = new Date()
    const createdPost = {
      ...post,
      id: this.generateId(),
      createdAt
    }
    this.entities.push(createdPost)
    return createdPost
  }

  async findById(ids: IPost['id'][]) {
    return this.entities.filter((post) => ids.includes(post.id))
  }

  async findByParentId(id: IPost['id']) {
    return this.entities.filter((post) => post.post?.id === id)
  }

  async findNextNPostIdsAfter(limit: number, id?: IPost['id']) {
    const sortedEntities = [...this.entities].sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime()
    })
    if (id) {
      const post = this.entities.find((post) => post.id === id)
      assert(post)
      const indexOfPost = sortedEntities.indexOf(post)
      return sortedEntities.slice(indexOfPost, indexOfPost + limit).map((post) => post.id)
    } else {
      return sortedEntities.slice(0, limit).map((post) => post.id)
    }
  }

  async countByParentId(id: IPost['id']) {
    return this.entities.filter((post) => post.post?.id === id).length
  }
}