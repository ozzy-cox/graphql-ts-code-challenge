export interface Repository<T> {
  add(partialEntity: Omit<T, 'id' | 'createdAt'>): Promise<T>
}

export interface ListableRepository<T> extends Repository<T> {
  list(offset: number, limit: number): Promise<T[]>
}
