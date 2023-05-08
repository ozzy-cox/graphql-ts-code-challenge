import { IBase } from '@/shared/entities/IBase'
import { PrimaryKey, Property } from '@mikro-orm/core'
import { v4 as uuidv4 } from 'uuid'

export abstract class Base implements IBase {
  @PrimaryKey()
  id: string = uuidv4()

  @Property()
  createdAt = new Date()
}
