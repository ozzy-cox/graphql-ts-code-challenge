import { ORM } from '@/orm'

export const wipeDb = async () => {
  const orm = await ORM.getInstance()
  await orm.getSchemaGenerator().refreshDatabase()
}
