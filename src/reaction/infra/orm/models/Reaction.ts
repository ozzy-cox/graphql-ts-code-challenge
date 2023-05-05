import { IReaction, ReactionType } from '@/reaction/entities/IReaction'
import { Base } from '../../../../shared/infra/orm/models/Base'
import { Entity, Enum, ManyToOne } from '@mikro-orm/core'
import { IPost } from '@/post/entities/IPost'

@Entity()
export class Reaction extends Base implements IReaction {
  @Enum(() => ReactionType)
  type!: ReactionType

  @ManyToOne('Post')
  // This has to be IPost type in order to prevent circular dependency`
  post!: IPost

  constructor(reaction: Omit<IReaction, 'id' | 'createdAt'>) {
    super()
    this.post = reaction.post
    this.type = reaction.type
  }
}
