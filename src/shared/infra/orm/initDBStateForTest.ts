import { MikroORM, IDatabaseDriver, Connection } from '@mikro-orm/core'
import { PostRepository } from '../../../post/infra/orm/repositories/PostRepository'
import { ORM } from '@/orm'
import { PostService } from '@/post/services/PostService'

export const wipeDb = async () => {
  const orm = await ORM.getInstance()
  await orm.getSchemaGenerator().refreshDatabase()
}

// TODO Should be removed
export const initDBStateForTest = async (orm: MikroORM<IDatabaseDriver<Connection>>) => {
  const postService = new PostService(new PostRepository(orm.em.fork()))

  await postService.createPost('Have a nice day!')
  await postService.createPost('Lorem ipsum')
  await postService.createPost('Coding is fun!')
  await postService.createPost("Can't wait for friday.")
  await postService.createPost('I cant find original content')
}
