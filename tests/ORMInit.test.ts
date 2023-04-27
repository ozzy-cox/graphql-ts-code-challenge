import { MikroORM } from '@mikro-orm/sqlite' // or any other driver package
import config from '../src/mikro-orm-test.config'

describe('using persistent mikroorm repo impl', () => {
  test('should initialize ORM instance', async () => {
    const orm = await MikroORM.init(config)
    expect(orm.em).not.toBeNull()
    await orm.close()
  })
})
