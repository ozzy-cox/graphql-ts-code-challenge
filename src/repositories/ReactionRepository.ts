import { IReactionRepository, Reaction as IReaction } from '@/entities/Reaction'
import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core'
import { SqlEntityRepository } from '@mikro-orm/sqlite'
import { Reaction } from '@/lib/orm/models/Reaction'

export class ReactionRepository implements IReactionRepository {
  repository: SqlEntityRepository<Reaction>
  constructor(private em: EntityManager<IDatabaseDriver<Connection>>) {
    this.repository = em.getRepository(Reaction)
  }

  async add(reaction: Omit<IReaction, 'id' | 'createdAt'>) {
    const reactionEntity = new Reaction(reaction)
    await this.repository.persistAndFlush(reactionEntity)
    return reactionEntity as IReaction
  }
}