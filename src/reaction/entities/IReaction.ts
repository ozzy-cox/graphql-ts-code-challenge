import { IPost } from '@/post/entities/IPost'
import { IBase } from '@/shared/entities/IBase'
import { INode } from '@/shared/entities/INode'

export enum ReactionType {
  THUMBSUP = 'THUMBSUP',
  THUMBSDOWN = 'THUMBSDOWN',
  ROCKET = 'ROCKET',
  HEART = 'HEART'
}

export interface IReaction extends IBase, INode {
  post: IPost
  type: ReactionType
}
