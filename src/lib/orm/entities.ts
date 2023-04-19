import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { Post as IPost, Node as INode } from '../../entities/Post'

export abstract class Node implements INode {
  @PrimaryKey({ autoincrement: true })
  id!: string

  @Property()
  createdAt = new Date()
}

@Entity()
export class Post extends Node implements IPost {
  @Property()
  content!: string

  constructor(post: Omit<IPost, 'id' | 'createdAt'>) {
    super()
    this.content = post.content
  }
}
