import { testCreatingPosts } from './helpers/CreatingPosts.test.helpers'
import { testListingPosts } from './helpers/ListingPosts.test.helpers'
import { testCreatingComments } from './helpers/CreatingComments.test.helpers'
import { ormRepoTestHook } from './helpers/OrmRepoHook.test.helpers'
import { mockRepoTestHook } from './helpers/MockRepoHook.test.helpers'

describe('post operations', () => {
  describe('on mock repo', () => {
    testCreatingPosts(mockRepoTestHook)
    testListingPosts(mockRepoTestHook)
    testCreatingComments(mockRepoTestHook)
  })

  describe('on orm repo', () => {
    testCreatingPosts(ormRepoTestHook)
    testListingPosts(ormRepoTestHook)
    testCreatingComments(ormRepoTestHook)
  })
})
