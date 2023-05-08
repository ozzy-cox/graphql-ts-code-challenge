import { getOrm } from '@/createOrm'
import config from '@/shared/infra/orm/mikro-orm-test.config'
import { PostRepository } from '../infra/orm/repositories/PostRepository'
import { testCreatingPosts } from './CreatingPosts.test.helpers'
import { testListingPosts } from './ListingPosts.test.helpers'
import { testCreatingComments } from './CreatingComments.test.helpers'
import { MockPostRepository } from '../repositories/mock/MockPostRepository'
import { repoHook } from './OrmRepoHook.test.helpers'

const mockRepoHook = () => () => new MockPostRepository()
describe('post operations', () => {
  describe('on mock repo', () => {
    testCreatingPosts(mockRepoHook)
    testListingPosts(mockRepoHook)
    testCreatingComments(mockRepoHook)
  })

  describe('on orm repo', () => {
    testCreatingPosts(repoHook)
    testListingPosts(repoHook)
    testCreatingComments(repoHook)
  })
})
