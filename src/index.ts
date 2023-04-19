import { Post } from './lib/orm/entities'
import { getEntityManager } from './lib/orm/orm'

const em = await getEntityManager()
const postRepo = em.getRepository(Post)
const post = new Post({ content: 'What a nice day!' })
postRepo.persistAndFlush([post])
