export interface INodeService<T> {
  findById(id: string): Promise<T | null>
}
