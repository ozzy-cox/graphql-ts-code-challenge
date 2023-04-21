import { PostController } from '@/entities/Post'
import { Post } from '@/lib/orm/entities'
import { getOrm } from '@/lib/orm/orm'
import config from '@/mikro-orm-test.config'
import { ORMPostRepository } from '@/repositories/EntityRepository'

export const initDBStateForTest = async () => {
  const orm = await getOrm(config)
  await orm.schema.refreshDatabase()

  const postController = new PostController(new ORMPostRepository(orm.em.fork()))

  postController.createPost('Have a nice day!')
  postController.createPost('Lorem ipsum')
  postController.createPost('Coding is fun!')
  postController.createPost("Can't wait for friday.")
  postController.createPost('I cant find original content')
}
