import { postRepoTest } from './RepoOperations.test.helpers'
import { repoHook } from './OrmRepoHook.test.helpers'

describe('using orm repo to create a post', () => {
  describe('on orm repo', () => {
    postRepoTest(repoHook)
  })
})
