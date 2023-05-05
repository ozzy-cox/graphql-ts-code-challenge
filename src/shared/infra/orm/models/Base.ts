import { IBase } from '@/shared/entities/IBase'
import { PrimaryKey, Property } from '@mikro-orm/core'

export abstract class Base implements IBase {
  @PrimaryKey({ autoincrement: true })
  id!: number

  @Property()
  createdAt = new Date()
}
