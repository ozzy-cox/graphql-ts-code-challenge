import { IPost } from '@/post/entities/IPost'
import { IReaction, ReactionType } from '../entities/IReaction'
import { IReactionRepository } from '../repositories/IReactionRepository'

export class ReactionService {
  reactionRepository: IReactionRepository
  constructor(reactionRepository: IReactionRepository) {
    this.reactionRepository = reactionRepository
  }

  createReaction = (type: ReactionType, post: IPost): Promise<IReaction | undefined> => {
    return this.reactionRepository.create({ type, post })
  }

  getReactionCounts = async (post: IPost, type: ReactionType): Promise<number> => {
    return this.reactionRepository.getCountsByType(post.id, type)
  }
}
