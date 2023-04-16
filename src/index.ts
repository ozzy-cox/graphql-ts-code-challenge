import { MikroORM } from '@mikro-orm/core'
import config from '../mikro-orm.config'
import { Post } from './lib/orm/entities'
;(async () => {
  const orm = await MikroORM.init(config)
  const postRepo = orm.em.getRepository(Post)
  const post = new Post('What a nice day!')
  console.log(post)
  console.log(postRepo)
  orm.em.fork().persistAndFlush([post])
})()

