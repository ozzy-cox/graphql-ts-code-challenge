import { ListableRepository } from '@/interfaces/Repository'
import { IPost } from '../entities/IPost'
import { Post } from '../infra/orm/models/Post'

export type IPostRepository = ListableRepository<IPost>

export interface _IPostRepository {
  create(post: Partial<Omit<Post, 'id' | 'createdAt'>>): Promise<Post | undefined>
}
