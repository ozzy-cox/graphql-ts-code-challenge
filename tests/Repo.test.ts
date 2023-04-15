import { Repository } from '@/repositories/RepositoryInterface'

import { MikroORM, SqliteDriver } from '@mikro-orm/sqlite' // or any other driver package

describe('using persistent mikroorm repo impl', () => {
  test('should instantiate a post repository', async () => {
    const orm = await MikroORM.init<SqliteDriver>({
      entities: ['./dist/entities'], // path to our JS entities (dist), relative to `baseDir`
      entitiesTs: ['./src/entities'], // path to our TS entities (src), relative to `baseDir`
      dbName: 'sqlite',
      type: 'sqlite'
    })
    console.log(orm.em) // access EntityManager via `em` property
    // const postRepo: Repository = new PostRepository()
  })
})
