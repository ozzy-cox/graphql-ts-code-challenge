import { Node } from './Node'
import { Base } from './Base'
import { Post } from './Post'
import { Repository } from '@/interfaces/Repository'

export enum ReactionType {
  THUMBSUP = 'THUMBSUP',
  THUMBSDOWN = 'THUMBSDOWN',
  ROCKET = 'ROCKET',
  HEART = 'HEART'
}

export interface Reaction extends Base, Node {
  post: Post
  type: ReactionType
}

export type IReactionRepository = Repository<Reaction>

export class ReactionController {
  reactionRepository: IReactionRepository
  constructor(reactionRepository: IReactionRepository) {
    this.reactionRepository = reactionRepository
  }

  createReaction = (type: ReactionType, post: Post): Promise<Reaction | undefined> => {
    return this.reactionRepository.add({ type, post })
  }
}
