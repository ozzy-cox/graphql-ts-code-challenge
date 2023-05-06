import { IReactionRepository } from '@/reaction/repositories/IReactionRepository'
import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core'
import { SqlEntityRepository } from '@mikro-orm/sqlite'
import { Reaction } from '../models/Reaction'

export class ReactionRepository implements IReactionRepository {
  repository: SqlEntityRepository<Reaction>
  constructor(private em: EntityManager<IDatabaseDriver<Connection>>) {
    this.repository = em.getRepository(Reaction)
  }

  async add(reaction: Omit<Reaction, 'id' | 'createdAt'>) {
    const reactionEntity = new Reaction(reaction)
    await this.repository.persistAndFlush(reactionEntity)
    return reactionEntity as Reaction
  }

  async findBy(where: { [key: string]: unknown }) {
    return this.repository.find(where)
  }

  async count(where: { [key: string]: unknown }) {
    return this.repository.count(where)
  }

  async findByPropertyIn(property: string, _in: readonly unknown[]) {
    return this.repository.find({ [property]: { $in: _in } })
  }
}