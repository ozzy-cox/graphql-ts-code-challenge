import { Options } from '@mikro-orm/core'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { Base } from './lib/orm/models/Base'
import { Post } from './lib/orm/models/Post'
import { Reaction } from './lib/orm/models/Reaction'

export default {
  metadataProvider: TsMorphMetadataProvider,
  entities: [Base, Post, Reaction], // no need for `entitiesTs` this way
  dynamicImportProvider: (id) => import(id),
  dbName: 'test.db',
  type: 'sqlite' // one of `mongo` | `mysql` | `mariadb` | `postgresql` | `sqlite`,
} as Options
