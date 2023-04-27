import { PrimaryKey, Property } from '@mikro-orm/core'
import { Base as IBase } from '@/entities/Base'

export abstract class Base implements IBase {
  @PrimaryKey({ autoincrement: true })
  id!: number

  @Property()
  createdAt = new Date()
}
