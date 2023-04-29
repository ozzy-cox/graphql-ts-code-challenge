export type Resolved<T extends { id: number }> = Omit<T, 'id'> & { id: string }
