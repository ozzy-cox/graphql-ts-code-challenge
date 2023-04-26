import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core'
import { Post as IPost, Node as INode } from '../../entities/Post'

// TODO should be renamed to base entity
export abstract class Node implements INode {
  @PrimaryKey({ autoincrement: true })
  id!: number
}

@Entity()
export class Post extends Node implements IPost {
  @Property()
  content!: string

  @ManyToOne(() => Post)
  parent?: Post

  @Property()
  createdAt = new Date()

  @OneToMany(() => Post, (post) => post.parent)
  comments? = new Collection<Post>(this)

  constructor(post: Omit<IPost, 'id' | 'createdAt'>) {
    super()
    this.content = post.content
    this.parent = post.parent
  }
}
