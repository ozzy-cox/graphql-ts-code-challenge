import { postRepoTest } from './RepoCreatingPosts.test.helpers'
import { MockPostRepository } from '../repositories/mock/MockPostRepository'

const repoHook = () => () => new MockPostRepository()

describe('using mock post repo to create a post', () => {
  postRepoTest(repoHook)
})
