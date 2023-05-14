import { IPostRepository } from '../repositories/IPostRepository'
import DataLoader from 'dataloader'
import { IPost } from '@/post/entities/IPost'
import { isInteger } from 'lodash-es'
import { filterOutErrors, filterTruthy } from '@/shared/helpers/utils'
import { INodeService } from '@/shared/services/INodeService'
import { Writeable } from '@/types'

export class PostService implements INodeService<IPost> {
  postRepository: IPostRepository
  postLoader: DataLoader<IPost['id'], IPost | null>

  constructor(postRepository: IPostRepository) {
    this.postRepository = postRepository
    this.postLoader = new DataLoader<IPost['id'], IPost>(async (keys) => {
      const posts = await this.postRepository.findById(keys as Writeable<typeof keys>)
      return keys.map((key) => {
        return posts.find((post) => post.id === key) || new Error('asdf')
      })
    })
  }

  createPost = (content?: string, post?: IPost): Promise<IPost | undefined> => {
    if (!content) throw new Error('Content cannot be empty')
    if (content && content.length > 280) throw new Error('You cannot send a post which has more than 280 characters')

    return this.postRepository.create({ content, post })
  }

  getPostById = async (postId: IPost['id']) => {
    return await this.postLoader.load(postId)
  }

  getPosts = async ({ parentId, first, after }: { parentId?: IPost['id']; first?: number; after?: IPost['id'] }) => {
    const postIds = await this.postRepository.findNextPagePostIds({ parentId, first, after })
    return filterTruthy(filterOutErrors(await this.postLoader.loadMany(postIds)))
  }

  getAllComments = async (post: IPost) => {
    return filterTruthy(filterOutErrors(await this.getAllCommentsRecursive(post)))
  }

  listPosts = async (first?: number, after?: IPost['id']) => {
    if (!isInteger(first)) {
      throw new Error('Inputs must be integers')
    }

    if (first === undefined) throw new Error('Limit must be defined')

    const postIds = await this.postRepository.findNextPagePostIds({ first, after })
    const posts = await this.postLoader.loadMany(postIds)
    return filterTruthy(filterOutErrors(posts))
  }

  getCommentCount = (parentId: IPost['id']): Promise<number> => {
    return this.postRepository.countByParentId(parentId)
  }

  private getAllCommentsRecursive = async (post: IPost | null) => {
    const accumulator: (IPost | null)[] = []
    if (post) {
      const comments = await this.getPosts({ parentId: post.id })
      if (comments.length > 0) {
        accumulator.push(...comments)
        await Promise.all(
          comments.map(async (comment) => {
            if (!(comment instanceof Error)) accumulator.push(...(await this.getAllCommentsRecursive(comment)))
          })
        )
      }
    }
    return accumulator
  }

  findById = async (id: string): Promise<IPost | null> => {
    return await this.postLoader.load(id)
  }
}
