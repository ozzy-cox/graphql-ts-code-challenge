import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core'
import config from '@/shared/infra/orm/mikro-orm.config'

export class ORM {
  private static instance?: MikroORM<IDatabaseDriver<Connection>>

  public static getInstance = async () => {
    if (!ORM.instance) {
      ORM.instance = await MikroORM.init(config)
    } else if (!(await ORM.instance.isConnected())) {
      await ORM.instance.connect()
    }
    return ORM.instance
  }
}
