import { BaseMockRepo } from '@/shared/repositories/mock/BaseMock'
import { IReactionRepository } from '../IReactionRepository'
import { IReaction, ReactionType } from '@/reaction/entities/IReaction'

export class MockReactionRepository extends BaseMockRepo<IReaction> implements IReactionRepository {
  async create(reaction: Omit<IReaction, 'id' | 'createdAt'>) {
    const createdAt = new Date()
    const createdReaction = {
      ...reaction,
      id: this.lastId,
      createdAt
    }
    this.entities.push(createdReaction)
    this.lastId += 1
    return createdReaction
  }

  async getCountsByType(postId: number, type: ReactionType): Promise<number> {
    return this.entities.filter((reaction) => reaction.post.id === postId && reaction.type === type).length
  }
}
