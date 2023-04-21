import { isInteger, isUndefined } from 'lodash-es'
import { Repository } from '@/repositories/RepositoryInterface'
import { isUint16Array } from 'util/types'

export type Node = {
  id: string
  createdAt: Date
}

export interface Post extends Node {
  content: string
}

export class PostController {
  postRepository: Repository<Post>
  constructor(postRepository: Repository<Post>) {
    this.postRepository = postRepository
  }

  createPost = (content?: string): Promise<Post | undefined> => {
    if (!content) throw new Error('Content cannot be empty')
    if (content && content.length > 280) throw new Error('You cannot send a post which has more than 280 characters')

    return this.postRepository.add({ content })
  }

  listPosts = (offset?: number, limit?: number): Promise<Post[]> => {
    if (!isInteger(offset) || !isInteger(limit)) {
      throw new Error('Inputs must be integers')
    }

    if (offset === undefined || limit === undefined) throw new Error('Inputs must be defined')

    return this.postRepository.list(offset, limit)
  }
}
