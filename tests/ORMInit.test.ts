import { MikroORM } from '@mikro-orm/sqlite' // or any other driver package
import config from '../src/mikro-orm.config'

describe('using persistent mikroorm repo impl', () => {
  test('should instantiate a post repository', async () => {
    const orm = await MikroORM.init(config)
    expect(orm.em).not.toBeNull()
  })
})
