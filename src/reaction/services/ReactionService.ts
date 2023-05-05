import { IPost } from '@/post/entities/IPost'
import { IReaction, ReactionType } from '../entities/IReaction'
import { IReactionRepository } from '../repositories/IReactionRepository'

export class ReactionController {
  reactionRepository: IReactionRepository
  constructor(reactionRepository: IReactionRepository) {
    this.reactionRepository = reactionRepository
  }

  createReaction = (type: ReactionType, post: IPost): Promise<IReaction | undefined> => {
    return this.reactionRepository.add({ type, post })
  }

  getReactionCounts = async (post: IPost, type: ReactionType): Promise<number> => {
    return this.reactionRepository.count({ post, type })
  }
}
