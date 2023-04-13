export interface Repository<T> {
  add(partialEntity: Omit<T, 'id' | 'createdAt'>): Promise<T>
  list(offset: number, take: number): Promise<T[]>
}
