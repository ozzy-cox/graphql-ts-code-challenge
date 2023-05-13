import { IPost } from '@/post/entities/IPost'
import { IPostRepository } from '@/post/repositories/IPostRepository'
import { BaseMockRepo } from '@/shared/repositories/mock/BaseMock'
import assert from 'assert'
import { prependListener } from 'process'

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

  async findNextPagePostIds({
    parentId,
    first,
    after
  }: {
    parentId?: IPost['id']
    first?: number
    after?: IPost['id']
  }): Promise<IPost['id'][]> {
    let entities = [...this.entities]
    if (parentId) {
      entities = [...this.entities].filter((post) => post.post?.id === parentId)
    }
    entities = entities.sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime()
    })

    if (after && first) {
      const post = this.entities.find((post) => post.id === after)
      assert(post)
      const indexOfPost = entities.indexOf(post)
      return entities.slice(indexOfPost, indexOfPost + first).map((post) => post.id)
    } else {
      return entities.slice(0, first).map((post) => post.id)
    }
  }

  async findNextPostIdsAfter(first: number, id?: IPost['id']) {
    const sortedEntities = [...this.entities].sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime()
    })
    if (id) {
      const post = this.entities.find((post) => post.id === id)
      assert(post)
      const indexOfPost = sortedEntities.indexOf(post)
      return sortedEntities.slice(indexOfPost, indexOfPost + first).map((post) => post.id)
    } else {
      return sortedEntities.slice(0, first).map((post) => post.id)
    }
  }

  async countByParentId(id: IPost['id']) {
    return this.entities.filter((post) => post.post?.id === id).length
  }
}
