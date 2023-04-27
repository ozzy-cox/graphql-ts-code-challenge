import { Entity, Property, ManyToOne, OneToMany, Collection } from '@mikro-orm/core'
import { Base } from './Base'
import { Post as IPost } from '@/entities/Post'
import { Reaction } from './Reaction'

@Entity()
export class Post extends Base implements IPost {
  @Property()
  content!: string

  @ManyToOne(() => Post)
  parent?: Post

  @OneToMany(() => Post, (post) => post.parent)
  comments? = new Collection<Post>(this)

  @OneToMany(() => Reaction, (reaction) => reaction.post)
  reaction? = new Collection<Reaction>(this)

  constructor(post: Omit<IPost, 'id' | 'createdAt'>) {
    super()
    this.content = post.content
    this.parent = post.parent
  }
}
