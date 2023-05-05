import { IPostRepository } from '../repositories/IPostRepository'
import DataLoader from 'dataloader'
import { IPost } from '@/post/entities/IPost'
import { isInteger } from 'lodash-es'

export class PostController {
  postRepository: IPostRepository
  postLoader: DataLoader<number, IPost>
  constructor(postRepository: IPostRepository) {
    this.postRepository = postRepository

    this.postLoader = new DataLoader<number, IPost>(async (keys: readonly number[]) => {
      const posts = await postRepository.findByPropertyIn('id', keys)
      return keys.map((key) => {
        return posts.find((post) => post.id === key) || new Error('asdf')
      })
    })
  }

  createPost = (content?: string, post?: IPost): Promise<IPost | undefined> => {
    if (!content) throw new Error('Content cannot be empty')
    if (content && content.length > 280) throw new Error('You cannot send a post which has more than 280 characters')

    return this.postRepository.add({ content, post })
  }

  getPostById = async (postId: number) => {
    return await this.postLoader.load(postId)
  }

  getComments = async (post: IPost) => {
    const commentIds = (await this.postRepository.findByPropertyIn('post', [post])).map((post) => post.id)
    return await this.postLoader.loadMany(commentIds)
  }

  listPosts = async (cursor?: number, limit?: number) => {
    if (!isInteger(cursor) || !isInteger(limit)) {
      throw new Error('Inputs must be integers')
    }

    if (cursor === undefined || limit === undefined) throw new Error('Inputs must be defined')

    const postIds = await this.postRepository.findByIdAndLimitIds(cursor, limit)
    return await this.postLoader.loadMany(postIds)
  }

  getCommentCounts = (post: IPost): Promise<number> => {
    return this.postRepository.count({ post })
  }
}
