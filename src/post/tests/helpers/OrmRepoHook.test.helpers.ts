import { getOrm } from '@/createOrm'
import config from '@/shared/infra/orm/mikro-orm-test.config'
import { wipeDb } from '@/shared/infra/orm/initDBStateForTest'
import { IPostRepository } from '@/post/repositories/IPostRepository'
import { PostRepository } from '@/post/infra/orm/repositories/PostRepository'

const orm = await getOrm(config)
export const ormRepoTestHook = () => {
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
