import { Entity, Property, ManyToOne, OneToMany, Collection } from '@mikro-orm/core'
import { IPost } from '@/post/entities/IPost'
import { Reaction } from '@/reaction/infra/orm/models/Reaction'
import { Base } from '@/shared/infra/orm/models/Base'

@Entity()
export class Post extends Base implements IPost {
  @Property()
  content!: string

  @ManyToOne(() => Post)
  post?: Post

  @OneToMany(() => Post, (post) => post.post)
  _comments? = new Collection<Post>(this)

  @OneToMany(() => Reaction, (reaction) => reaction.post)
  _reactions? = new Collection<Reaction>(this)

  @Property({ hidden: true })
  get comments() {
    return this._comments?.getItems() || []
  }

  @Property({ hidden: true })
  get reactions() {
    return this._reactions?.getItems() || []
  }

  constructor(post: Pick<Post, 'content' | 'post'>) {
    super()
    this.content = post.content
    this.post = post.post
  }
}
