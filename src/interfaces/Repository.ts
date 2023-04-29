export interface Repository<T> {
  add(partialEntity: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<T>
  findBy(where: { [key: string]: unknown }): Promise<T[]>
}

export interface ListableRepository<T> extends Repository<T> {
  list(offset: number, limit: number): Promise<T[]>
}
