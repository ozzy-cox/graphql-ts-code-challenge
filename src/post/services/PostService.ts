import { IPostRepository } from '../repositories/IPostRepository'
import DataLoader from 'dataloader'
import { IPost } from '@/post/entities/IPost'
import { isInteger } from 'lodash-es'

export class PostService {
  postRepository: IPostRepository
  postLoader: DataLoader<number, IPost>

  constructor(postRepository: IPostRepository) {
    this.postRepository = postRepository
    this.postLoader = new DataLoader<number, IPost>(async (keys: readonly number[]) => {
      const posts = await this.postRepository.findById(keys)
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

  getPostById = async (postId: number) => {
    return await this.postLoader.load(postId)
  }

  getComments = async (post: IPost) => {
    const commentIds = (await this.postRepository.findByParentId(post.id)).map((post) => post.id)
    return await this.postLoader.loadMany(commentIds)
  }

  listPosts = async (limit?: number, cursor?: IPost['id']) => {
    if (!isInteger(limit)) {
      throw new Error('Inputs must be integers')
    }

    if (limit === undefined) throw new Error('Limit must be defined')

    const postIds = await this.postRepository.findNextNPostIdsAfter(limit, cursor)
    return await this.postLoader.loadMany(postIds)
  }

  getCommentCounts = (post: IPost): Promise<number> => {
    return this.postRepository.countByParentId(post.id)
  }
}
