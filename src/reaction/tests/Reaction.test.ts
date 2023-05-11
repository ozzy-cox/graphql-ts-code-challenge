import { testAddingReactions } from './helpers/AddingReactionts.test.helpers'
import { ORM } from '@/orm'
import { PostRepository } from '@/post/infra/orm/repositories/PostRepository'
import { ReactionRepository } from '../infra/orm/repositories/ReactionRepository'
import { wipeDb } from '@/shared/infra/orm/initDBStateForTest'
import { MockPostRepository } from '@/post/infra/mock/MockPostRepository'
import { MockReactionRepository } from '../infra/mock/MockReactionRepository'

const orm = await ORM.getInstance()

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
      await (await ORM.getInstance()).close()
    })
  })
})
