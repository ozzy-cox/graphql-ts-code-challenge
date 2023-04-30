export interface Repository<T> {
  add(partialEntity: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<T>
  findBy(where: { [key: string]: unknown }): Promise<T[]>
  count(where: { [key: string]: unknown }): Promise<number>
}

export interface ListableRepository<T> extends Repository<T> {
  list(offset: number, limit: number): Promise<T[]>
}
