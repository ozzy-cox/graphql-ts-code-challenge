import { Options } from '@mikro-orm/core'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { Base } from './models/Base'
import { Post } from '../../../post/infra/orm/models/Post'
import { Reaction } from '../../../reaction/infra/orm/models/Reaction'

export default {
  metadataProvider: TsMorphMetadataProvider,
  entities: [Base, Post, Reaction], // no need for `entitiesTs` this way
  dynamicImportProvider: (id) => import(id),
  dbName: 'test.db',
  type: 'sqlite' // one of `mongo` | `mysql` | `mariadb` | `postgresql` | `sqlite`,
} as Options
