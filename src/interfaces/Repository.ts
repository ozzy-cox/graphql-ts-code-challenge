// TODO Deprecate in favor of more specialized repository.
export interface Repository<T> {
  add(partialEntity: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<T>
  findBy(where: { [key: string]: unknown }): Promise<T[]>
  count(where: { [key: string]: unknown }): Promise<number>
  findByPropertyIn(property: string, _in: readonly unknown[]): Promise<T[]>
}

export interface ListableRepository<T> extends Repository<T> {
  list(cursor: number, limit: number): Promise<T[]>
  findByIdAndLimitIds(id: number, limit: number): Promise<number[]>
}
