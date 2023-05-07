import { _PostRepository } from '../infra/orm/repositories/PostRepository'
import { getOrm } from '@/createOrm'
import config from '@/shared/infra/orm/mikro-orm-test.config'
import { wipeDb } from '@/shared/infra/orm/initDBStateForTest'
import { postRepoTest } from './RepoOperations.test.helpers'
import { _IPostRepository } from '../repositories/IPostRepository'
import { set } from 'lodash'

const orm = await getOrm(config)

const repoHook = () => {
  let postRepository: _IPostRepository
  beforeAll(() => {
    postRepository = new _PostRepository(orm.em.fork())
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

describe('using orm repo to create a post', () => {
  describe('on orm repo', () => {
    postRepoTest(repoHook)
  })
})
