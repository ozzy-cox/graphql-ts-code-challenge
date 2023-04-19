import { MikroORM } from '@mikro-orm/core'
import config from '@/mikro-orm.config'
export const orm = MikroORM.init(config)

export const getEntityManager = async () => {
  return (await orm).em.fork()
}

export const getOrm = async () => {
  return await orm
}
