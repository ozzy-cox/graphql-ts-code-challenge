import { Post } from '@/lib/orm/models/Post'
import { Base } from '@/lib/orm/models/Base'
import { Options } from '@mikro-orm/core'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'

export default {
  metadataProvider: TsMorphMetadataProvider,
  entities: [Post, Base], // no need for `entitiesTs` this way
  dbName: 'test.db',
  type: 'sqlite' // one of `mongo` | `mysql` | `mariadb` | `postgresql` | `sqlite`
} as Options
