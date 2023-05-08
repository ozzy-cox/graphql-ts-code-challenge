import { INode } from '@/shared/entities/INode'
import { v4 } from 'uuid'

export class BaseMockRepo<T extends INode> {
  entities: T[] = []

  generateId() {
    return v4()
  }
}
