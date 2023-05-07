import { postRepoTest } from './RepoOperations.test.helpers'
import { MockPostRepository } from '../repositories/mock/MockPostRepository'

const repoHook = () => () => new MockPostRepository()

describe('testing mock repo operations', () => {
  postRepoTest(repoHook)
})
