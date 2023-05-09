import { MockPostRepository } from '@/post/infra/mock/MockPostRepository'

export const mockRepoTestHook = () => () => new MockPostRepository()
