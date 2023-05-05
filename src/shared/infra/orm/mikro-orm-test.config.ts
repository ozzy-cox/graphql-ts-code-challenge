import { Post } from '@/post/infra/orm/models/Post'
import { Options } from '@mikro-orm/core'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { Base } from './models/Base'

export default {
  metadataProvider: TsMorphMetadataProvider,
  entities: [Post, Base], // no need for `entitiesTs` this way
  dbName: 'test.db',
  type: 'sqlite' // one of `mongo` | `mysql` | `mariadb` | `postgresql` | `sqlite`
} as Options
