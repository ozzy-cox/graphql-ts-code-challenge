import { MikroORM } from '@mikro-orm/core'
import { config } from 'mikro-orm.config.js'
export const orm = await MikroORM.init(config)
