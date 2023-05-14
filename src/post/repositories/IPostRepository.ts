import { IPost } from '../entities/IPost'

export interface IPostRepository {
  create(post: Pick<IPost, 'content' | 'post'>): Promise<IPost | undefined>
  findById(ids: IPost['id'][]): Promise<IPost[]>
  findByParentId(id: IPost['id']): Promise<IPost[]>
  findNextPagePostIds({
    parentId,
    first,
    after
  }: {
    parentId?: IPost['id']
    first?: number
    after?: IPost['id']
  }): Promise<IPost['id'][]>
  countByParentId(id: IPost['id']): Promise<number>
}
