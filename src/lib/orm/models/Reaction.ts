import { Reaction as IReaction, ReactionType } from '@/entities/Reaction'
import { Base } from './Base'
import { Entity, Enum, ManyToOne } from '@mikro-orm/core'
import { Post } from '@/entities/Post'

@Entity()
export class Reaction extends Base implements IReaction {
  @Enum(() => ReactionType)
  type!: ReactionType

  @ManyToOne('Post')
  post!: Post

  constructor(reaction: Omit<IReaction, 'id' | 'createdAt'>) {
    super()
    this.post = reaction.post
    this.type = reaction.type
  }
}
