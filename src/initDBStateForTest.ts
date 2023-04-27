import { PostController } from '@/entities/Post'
import { getOrm } from '@/lib/orm/orm'
import config from '@/mikro-orm-test.config'
import { MikroORM, IDatabaseDriver, Connection } from '@mikro-orm/core'
import { PostRepository } from './repositories/PostRepository'

export const wipeDb = async () => {
  const orm = await getOrm(config)
  await orm.getSchemaGenerator().refreshDatabase()
  await orm.close()
}

export const initDBStateForTest = async (orm: MikroORM<IDatabaseDriver<Connection>>) => {
  const postController = new PostController(new PostRepository(orm.em.fork()))

  await postController.createPost('Have a nice day!')
  await postController.createPost('Lorem ipsum')
  await postController.createPost('Coding is fun!')
  await postController.createPost("Can't wait for friday.")
  await postController.createPost('I cant find original content')
}
