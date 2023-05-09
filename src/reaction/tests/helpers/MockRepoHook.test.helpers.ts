import { MockReactionRepository } from '@/reaction/infra/mock/MockReactionRepository'

export const mockRepoTestHook = () => () => new MockReactionRepository()
