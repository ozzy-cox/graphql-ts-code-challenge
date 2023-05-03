import { isInteger } from 'lodash-es'
import { Node } from './Node'
import { Base } from './Base'
import { ListableRepository } from '@/interfaces/Repository'
import { Reaction } from './Reaction'
import DataLoader from 'dataloader'

export interface Post extends Base, Node {
  post?: Post
  content: string
  get comments(): Post[]
  get reactions(): Reaction[]
  get comment_count(): number
  // TODO Consider reaction counts in this interface ?
}

export type IPostRepository = ListableRepository<Post>

export class PostController {
  postRepository: IPostRepository
  postLoader: DataLoader<number, Post>
  constructor(postRepository: IPostRepository) {
    this.postRepository = postRepository

    this.postLoader = new DataLoader<number, Post>(async (keys: readonly number[]) => {
      const posts = await postRepository.findByPropertyIn('id', keys)
      return keys.map((key) => {
        return posts.find((post) => post.id === key) || new Error('asdf')
      })
    })
  }

  createPost = (content?: string, post?: Post): Promise<Post | undefined> => {
    if (!content) throw new Error('Content cannot be empty')
    if (content && content.length > 280) throw new Error('You cannot send a post which has more than 280 characters')

    return this.postRepository.add({ content, post })
  }

  getPostById = async (postId: number) => {
    return await this.postLoader.load(postId)
  }

  getComments = async (post: Post) => {
    const commentIds = (await this.postRepository.findByPropertyIn('post', [post])).map((post) => post.id)
    return await this.postLoader.loadMany(commentIds)
  }

  listPosts = (offset?: number, limit?: number): Promise<Post[]> => {
    if (!isInteger(offset) || !isInteger(limit)) {
      throw new Error('Inputs must be integers')
    }

    if (offset === undefined || limit === undefined) throw new Error('Inputs must be defined')

    return this.postRepository.list(offset, limit)
  }

  getCommentCounts = (post: Post): Promise<number> => {
    return this.postRepository.count({ post })
  }
}
