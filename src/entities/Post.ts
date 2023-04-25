import { isInteger } from 'lodash-es'
import { Repository } from '@/repositories/RepositoryInterface'

export type Node = {
  id: number
}

export interface Post extends Node {
  parentId?: number
  content: string
  createdAt: Date
}

export class PostController {
  postRepository: Repository<Post>
  constructor(postRepository: Repository<Post>) {
    this.postRepository = postRepository
  }

  createPost = (content?: string, parentId?: number): Promise<Post | undefined> => {
    if (!content) throw new Error('Content cannot be empty')
    if (content && content.length > 280) throw new Error('You cannot send a post which has more than 280 characters')

    return this.postRepository.add({ content, parentId })
  }

  listPosts = (offset?: number, limit?: number): Promise<Post[]> => {
    if (!isInteger(offset) || !isInteger(limit)) {
      throw new Error('Inputs must be integers')
    }

    if (offset === undefined || limit === undefined) throw new Error('Inputs must be defined')

    return this.postRepository.list(offset, limit)
  }
}
