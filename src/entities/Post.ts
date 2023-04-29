import { isInteger } from 'lodash-es'
import { Node } from './Node'
import { Base } from './Base'
import { ListableRepository } from '@/interfaces/Repository'
import { Reaction } from './Reaction'

export interface Post extends Base, Node {
  post?: Post
  content: string
  get comments(): Post[]
  get reactions(): Reaction[]
}

export type IPostRepository = ListableRepository<Post>

export class PostController {
  postRepository: IPostRepository
  constructor(postRepository: IPostRepository) {
    this.postRepository = postRepository
  }

  createPost = (content?: string, post?: Post): Promise<Post | undefined> => {
    if (!content) throw new Error('Content cannot be empty')
    if (content && content.length > 280) throw new Error('You cannot send a post which has more than 280 characters')

    return this.postRepository.add({ content, post })
  }

  getComments = (post: Post): Promise<Post[]> => {
    return this.postRepository.findBy({ post })
  }

  listPosts = (offset?: number, limit?: number): Promise<Post[]> => {
    if (!isInteger(offset) || !isInteger(limit)) {
      throw new Error('Inputs must be integers')
    }

    if (offset === undefined || limit === undefined) throw new Error('Inputs must be defined')

    return this.postRepository.list(offset, limit)
  }
}
