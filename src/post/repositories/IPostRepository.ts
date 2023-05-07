import { ListableRepository } from '@/interfaces/Repository'
import { IPost } from '../entities/IPost'

export type IPostRepository = ListableRepository<IPost>

export interface _IPostRepository {
  create(post: Partial<Omit<IPost, 'id' | 'createdAt'>>): Promise<IPost | undefined>
  findById(ids: number[]): Promise<IPost[]>
  findByParentId(id: IPost['id']): Promise<IPost[]>
  findNextNPostIdsAfter(id: IPost['id'], limit: number): Promise<IPost['id'][]>
  countByParentId(id: IPost['id']): Promise<number>
}
