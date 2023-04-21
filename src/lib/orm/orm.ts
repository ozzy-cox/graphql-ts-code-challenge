import { MikroORM, Options } from '@mikro-orm/core'
export const getOrm = async (config: Options) => {
  return await MikroORM.init(config)
}
