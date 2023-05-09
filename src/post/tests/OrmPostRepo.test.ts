import { ormRepoTestHook } from './helpers/OrmRepoHook.test.helpers'
import { postRepoTest } from './helpers/RepoOperations.test.helpers'

describe('using orm repo to create a post', () => {
  describe('on orm repo', () => {
    postRepoTest(ormRepoTestHook)
  })
})
