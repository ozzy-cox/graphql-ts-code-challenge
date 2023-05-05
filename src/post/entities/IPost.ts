import { IBase } from '@/shared/entities/IBase'
import { IReaction } from '../../reaction/entities/IReaction'
import { INode } from '@/shared/entities/INode'

export interface IPost extends IBase, INode {
  post?: IPost
  content: string
  get comments(): IPost[]
  get reactions(): IReaction[]
  get comment_count(): number
  // TODO Consider reaction counts in this interface ?
}
