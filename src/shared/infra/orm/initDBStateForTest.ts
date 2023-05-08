import config from '@/shared/infra/orm/mikro-orm-test.config'
import { MikroORM, IDatabaseDriver, Connection } from '@mikro-orm/core'
import { PostRepository } from '../../../post/infra/orm/repositories/PostRepository'
import { getOrm } from '@/createOrm'
import { PostService } from '@/post/services/PostService'

export const wipeDb = async () => {
  const orm = await getOrm(config)
  await orm.getSchemaGenerator().refreshDatabase()
  await orm.close()
}

export const initDBStateForTest = async (orm: MikroORM<IDatabaseDriver<Connection>>) => {
  const postService = new PostService(new PostRepository(orm.em.fork()))

  await postService.createPost('Have a nice day!')
  await postService.createPost('Lorem ipsum')
  await postService.createPost('Coding is fun!')
  await postService.createPost("Can't wait for friday.")
  await postService.createPost('I cant find original content')
}
