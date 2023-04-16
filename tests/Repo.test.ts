import { MikroORM } from '@mikro-orm/sqlite' // or any other driver package
import config from '../mikro-orm.config'
import { testCreatingPosts } from './Post.test'

describe('using persistent mikroorm repo impl', () => {
  test('should instantiate a post repository', async () => {
    const orm = await MikroORM.init(config)
    expect(orm.em).not.toBeNull()
  })
})

// testCreatingPosts(new ORMRepo())
