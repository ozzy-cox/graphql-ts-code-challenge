import { IReactionRepository } from '@/reaction/repositories/IReactionRepository'
import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core'
import { SqlEntityRepository } from '@mikro-orm/sqlite'
import { Reaction } from '../models/Reaction'
import { IReaction, ReactionType } from '@/reaction/entities/IReaction'
import { IPost } from '@/post/entities/IPost'

export class ReactionRepository implements IReactionRepository {
  repository: SqlEntityRepository<Reaction>
  constructor(private em: EntityManager<IDatabaseDriver<Connection>>) {
    this.repository = em.getRepository(Reaction)
  }

  async create(reaction: Omit<IReaction, 'id' | 'createdAt'>) {
    const reactionEntity = new Reaction(reaction)
    await this.repository.persistAndFlush(reactionEntity)
    return reactionEntity as Reaction
  }

  async getCountsByType(postId: IPost['id'], type: ReactionType): Promise<number> {
    return await this.repository.count({ post: { id: postId }, type })
  }
}
