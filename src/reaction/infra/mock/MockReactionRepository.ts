import { BaseMockRepo } from '@/shared/repositories/mock/BaseMock'
import { IReaction, ReactionType } from '@/reaction/entities/IReaction'
import { IPost } from '@/post/entities/IPost'
import { IReactionRepository } from '@/reaction/repositories/IReactionRepository'

export class MockReactionRepository extends BaseMockRepo<IReaction> implements IReactionRepository {
  async create(reaction: Omit<IReaction, 'id' | 'createdAt'>) {
    const createdAt = new Date()
    const createdReaction = {
      ...reaction,
      id: this.generateId(),
      createdAt
    }
    this.entities.push(createdReaction)
    return createdReaction
  }

  async getCountsByType(postId: IPost['id'], type: ReactionType): Promise<number> {
    return this.entities.filter((reaction) => reaction.post.id === postId && reaction.type === type).length
  }
}
