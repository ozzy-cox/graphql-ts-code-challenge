import { IPost } from '../entities/IPost'

export interface IPostRepository {
  create(post: Partial<Omit<IPost, 'id' | 'createdAt'>>): Promise<IPost | undefined>
  findById(ids: readonly number[]): Promise<IPost[]>
  findByParentId(id: IPost['id']): Promise<IPost[]>
  findNextNPostIdsAfter(limit: number, cursor?: IPost['id']): Promise<IPost['id'][]>
  countByParentId(id: IPost['id']): Promise<number>
}
