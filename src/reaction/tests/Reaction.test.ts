import config from '@/shared/infra/orm/mikro-orm-test.config'
import { testAddingReactions } from './AddingReactionts.test.helpers'
import { getOrm } from '@/createOrm'
import { PostRepository } from '@/post/infra/orm/repositories/PostRepository'
import { ReactionRepository } from '../infra/orm/repositories/ReactionRepository'
import { wipeDb } from '@/shared/infra/orm/initDBStateForTest'
import { MockPostRepository } from '@/post/repositories/mock/MockPostRepository'
import { MockReactionRepository } from '../repositories/mock/MockReactionRepository'

const orm = await getOrm(config)

const em = orm.em.fork()
const ormPostRepository = new PostRepository(em)
const ormReactionRepository = new ReactionRepository(em)

describe('adding reactions', () => {
  describe('on mock repo', () => {
    testAddingReactions(new MockPostRepository(), new MockReactionRepository())
  })

  describe('on orm repo', () => {
    it('repo inited', () => {
      expect(orm).not.toBeFalsy()
      expect(ormPostRepository).not.toBeFalsy()
      expect(ormReactionRepository).not.toBeFalsy()
    })

    beforeAll(async () => {
      await wipeDb()
    })

    testAddingReactions(ormPostRepository, ormReactionRepository)

    afterAll(async () => {
      await wipeDb()
      await (await getOrm(config)).close()
    })
  })
})
