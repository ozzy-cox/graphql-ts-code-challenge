import { mockRepoTestHook } from './helpers/MockRepoHook.test.helpers'
import { postRepoTest } from './helpers/RepoOperations.test.helpers'

describe('testing mock repo operations', () => {
  postRepoTest(mockRepoTestHook)
})
