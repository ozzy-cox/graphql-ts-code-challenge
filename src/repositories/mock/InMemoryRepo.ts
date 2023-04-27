import { Repository, ListableRepository } from '../../interfaces/Repository'

class BaseMockRepo<T> {
  lastId = 1 // fake autoincrement id
  entities: T[] = []
}

export class MockRepository<T> extends BaseMockRepo<T> implements Repository<T> {
  add(partialEntity: Omit<T, 'id' | 'createdAt'>): Promise<T> {
    return new Promise((resolve) => {
      const entity = {
        ...partialEntity,
        id: this.lastId,
        createdAt: new Date()
      } as T
      this.entities.push(entity)
      this.lastId += 1
      resolve(entity)
    })
  }
}

export class MockListableRepository<T> extends MockRepository<T> implements ListableRepository<T> {
  list(offset: number, limit: number): Promise<T[]> {
    return new Promise((resolve) => {
      resolve(this.entities.slice(offset, offset + limit))
    })
  }
}
