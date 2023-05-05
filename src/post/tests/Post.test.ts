import { getOrm } from '@/createOrm'
import { MockListableRepository } from '@/repositories/mock/InMemoryRepo'
import config from '@/shared/infra/orm/mikro-orm-test.config'
import { PostRepository } from '../infra/orm/repositories/PostRepository'
import { testCreatingPosts } from './CreatingPosts.test.helpers'
import { testListingPosts } from './ListingPosts.test.helpers'
import { testCreatingComments } from './CreatingComments.test.helpers'
import { IPost } from '../entities/IPost'
import { wipeDb } from '@/shared/infra/orm/initDBStateForTest'
import { IPostRepository } from '../repositories/IPostRepository'

const orm = await getOrm(config)
const em = orm.em.fork()
const ormRepo = new PostRepository(em)

describe('post operations', () => {
  describe('on in memory repo', () => {
    testCreatingPosts(new MockListableRepository<IPost>())
    testListingPosts(new MockListableRepository<IPost>())
    testCreatingComments(new MockListableRepository<IPost>())
  })

  describe('on orm repo', () => {
    it('repo inited', () => {
      expect(orm).not.toBeFalsy()
      expect(ormRepo).not.toBeFalsy()
    })

    beforeEach(async () => {
      await wipeDb()
    })

    testCreatingPosts(ormRepo)
    testListingPosts(ormRepo as unknown as IPostRepository)
    testCreatingComments(ormRepo)

    afterAll(async () => {
      await wipeDb()
      await (await getOrm(config)).close()
    })
  })
})
