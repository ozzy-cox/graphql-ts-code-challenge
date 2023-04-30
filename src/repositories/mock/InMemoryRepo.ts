import { every, filter, get, has } from 'lodash-es'
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

  findBy(where: { [key: string]: unknown }): Promise<T[]> {
    return new Promise((resolve) => {
      const filteredEntities = this.entities.filter((entity) => {
        return every(Object.keys(where), (key) => has(entity, key) && get(entity, key, false) === where[key])
      })
      resolve(filteredEntities)
    })
  }

  count(where: { [key: string]: unknown }): Promise<number> {
    return new Promise((resolve, reject) => {
      this.findBy(where).then((entities) => {
        resolve(entities.length)
      })
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
