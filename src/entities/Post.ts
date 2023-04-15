import { isInteger } from 'lodash'
import { Repository } from '@/repositories/RepositoryInterface'

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

  createPost = async (content?: string): Promise<Post | undefined> => {
    if (!content) throw new Error('Content cannot be empty')
    if (content && content.length > 280) throw new Error('You cannot send a post which has more than 280 characters')

    return this.postRepository.add({ content })
  }

  listPosts = (offset: number, take: number): Promise<Post[]> => {
    if (!isInteger(offset) || !isInteger(take)) {
      throw new Error('Inputs must be integers')
    }

    return this.postRepository.list(offset, take)
  }
}
