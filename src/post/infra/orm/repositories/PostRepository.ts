import { SqlEntityRepository } from '@mikro-orm/sqlite'
import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core'
import { IPostRepository } from '@/post/repositories/IPostRepository'
import { Post } from '../models/Post'

export class PostRepository implements IPostRepository {
  private repository: SqlEntityRepository<Post>
  constructor(em: EntityManager<IDatabaseDriver<Connection>>) {
    this.repository = em.getRepository(Post)
  }

  async create(post: Pick<Post, 'content' | 'post'>) {
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

  async findNextPagePostIds({
    parentId,
    first,
    after
  }: {
    parentId?: Post['id']
    first?: number
    after?: Post['id']
  }): Promise<Post['id'][]> {
    let ids = []
    // TODO remove duplication
    if (after) {
      const post = (await this.repository.find({ id: after }))[0]
      ids = await this.repository.find(
        { post: { id: parentId }, createdAt: { $gt: post.createdAt } },
        { fields: [], limit: first, orderBy: { createdAt: 'ASC' } }
      )
    } else {
      ids = await this.repository.find(
        { post: { id: parentId } },
        { fields: [], limit: first, orderBy: { createdAt: 'ASC' } }
      )
    }

    return ids.map((post) => post.id)
  }

  async findNextPostIdsAfter(first: number, id?: Post['id']) {
    let ids = []
    // TODO remove duplication
    if (id) {
      const post = (await this.repository.find({ id }))[0]
      ids = await this.repository.find(
        { post: undefined, createdAt: { $gt: post.createdAt } },
        { fields: [], limit: first, orderBy: { createdAt: 'ASC' } }
      )
    } else {
      ids = await this.repository.find({ post: undefined }, { fields: [], limit: first, orderBy: { createdAt: 'ASC' } })
    }

    return ids.map((post) => post.id)
  }
  async countByParentId(id: Post['id']) {
    return this.repository.count({ post: { id: id } })
  }
}
