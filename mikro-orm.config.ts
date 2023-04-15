import { Node, Post } from '@/lib/orm/entities'
import { Options } from '@mikro-orm/core'

export default {
  entities: [Post, Node], // no need for `entitiesTs` this way
  dbName: 'test.db',
  type: 'sqlite' // one of `mongo` | `mysql` | `mariadb` | `postgresql` | `sqlite`
} as Options
