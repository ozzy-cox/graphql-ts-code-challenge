import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { Post as IPost, Node as INode } from '@/entities/Post'

export abstract class Node implements INode {
  @PrimaryKey()
  id!: string

  @Property()
  createdAt = new Date()
}

@Entity()
export class Post extends Node implements IPost {
  @Property()
  content!: string
}
