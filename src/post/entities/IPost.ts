import { IBase } from '@/shared/entities/IBase'
import { IReaction } from '../../reaction/entities/IReaction'
import { INode } from '@/shared/entities/INode'

export interface IPost extends IBase, INode {
  post?: IPost
  content: string
  comments: IPost[]
  reactions: IReaction[]
  // readonly comment_count?: unknown
  // TODO Consider reaction counts in this interface ?
}
