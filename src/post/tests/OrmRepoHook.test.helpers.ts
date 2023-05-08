import { IPostRepository } from '../repositories/IPostRepository'
import { PostRepository } from '../infra/orm/repositories/PostRepository'
import { getOrm } from '@/createOrm'
import config from '@/shared/infra/orm/mikro-orm-test.config'
import { wipeDb } from '@/shared/infra/orm/initDBStateForTest'

const orm = await getOrm(config)
export const repoHook = () => {
  let postRepository: IPostRepository
  beforeAll(() => {
    postRepository = new PostRepository(orm.em.fork())
  })

  beforeEach(async () => {
    await wipeDb()
  })

  afterAll(async () => {
    await wipeDb()
    await (await getOrm(config)).close()
  })
  return () => postRepository
}
