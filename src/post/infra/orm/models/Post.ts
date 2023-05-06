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
  comments? = new Collection<Post>(this)

  @OneToMany(() => Reaction, (reaction) => reaction.post)
  reactions? = new Collection<Reaction>(this)

  constructor(post: Omit<Post, 'id' | 'createdAt'>) {
    super()
    this.content = post.content
    this.post = post.post
  }
}
