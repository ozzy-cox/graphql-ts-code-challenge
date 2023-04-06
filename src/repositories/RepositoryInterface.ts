export interface RepositoryInterface<T> {
  create(partialEntity: Partial<T>): Promise<T>
}
