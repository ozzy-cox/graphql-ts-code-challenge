import { Node, Post } from './src/lib/orm/entities'
import { Options } from '@mikro-orm/core'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'

export default {
  metadataProvider: TsMorphMetadataProvider,
  entities: [Post, Node], // no need for `entitiesTs` this way
  dbName: 'test.db',
  type: 'sqlite' // one of `mongo` | `mysql` | `mariadb` | `postgresql` | `sqlite`
} as Options
