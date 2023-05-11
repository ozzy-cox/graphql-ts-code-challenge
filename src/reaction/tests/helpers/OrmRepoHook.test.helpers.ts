import { ORM } from '@/orm'
import { wipeDb } from '@/shared/infra/orm/initDBStateForTest'
import { IReactionRepository } from '@/reaction/repositories/IReactionRepository'
import { ReactionRepository } from '@/reaction/infra/orm/repositories/ReactionRepository'

const orm = await ORM.getInstance()
export const ormRepoTestHook = () => {
  let postRepository: IReactionRepository
  beforeAll(() => {
    postRepository = new ReactionRepository(orm.em.fork())
  })

  beforeEach(async () => {
    await wipeDb()
  })

  afterAll(async () => {
    await wipeDb()
    await (await ORM.getInstance()).close()
  })
  return () => postRepository
}
