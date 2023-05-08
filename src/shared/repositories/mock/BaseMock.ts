export class BaseMockRepo<T extends { id: number }> {
  lastId = 1 // fake autoincrement id
  entities: T[] = []
}
