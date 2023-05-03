import { every, filter, get, has } from 'lodash-es'
import { Repository, ListableRepository } from '../../interfaces/Repository'

class BaseMockRepo<T extends { id: number }> {
  lastId = 1 // fake autoincrement id
  entities: T[] = []
}

export class MockRepository<T extends { id: number; createdAt: Date }>
  extends BaseMockRepo<T>
  implements Repository<T>
{
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

  findByPropertyIn(property: string, _in: unknown[]): Promise<T[]> {
    return new Promise((resolve) => {
      const filteredEntities = this.entities.filter((entity) => {
        return _in.includes(get(entity, property))
      })
      resolve(filteredEntities)
    })
  }
}
export class MockListableRepository<T extends { id: number; createdAt: Date }>
  extends MockRepository<T>
  implements ListableRepository<T>
{
  list(offset: number, limit: number): Promise<T[]> {
    return new Promise((resolve) => {
      resolve(this.entities.slice(offset, offset + limit))
    })
  }

  findByIdAndLimitIds(id: number, limit: number): Promise<number[]> {
    return new Promise((resolve, reject) => {
      const first = this.entities.find((entity) => entity.id === id)
      if (first) {
        const firstIndex = this.entities.indexOf(first)
        const ids = this.entities.slice(firstIndex, firstIndex + limit).map((entity) => entity.id)
        return ids
      } else {
        reject('Error')
      }
    })
  }
}
