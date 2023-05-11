import { ORM } from '@/orm'
import { wipeDb } from '@/shared/infra/orm/initDBStateForTest'
import { IPostRepository } from '@/post/repositories/IPostRepository'
import { PostRepository } from '@/post/infra/orm/repositories/PostRepository'

const orm = await ORM.getInstance()
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
    await (await ORM.getInstance()).close()
  })
  return () => postRepository
}
