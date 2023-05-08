import { IPost } from '@/post/entities/IPost'
import { IReaction, ReactionType } from '../entities/IReaction'

export interface IReactionRepository {
  create(reaction: Partial<Omit<IReaction, 'id' | 'createdAt'>>): Promise<IReaction | undefined>
  getCountsByType(postId: IPost['id'], type: ReactionType): Promise<number>
}
