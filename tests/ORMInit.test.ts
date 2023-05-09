import { ORM } from '@/orm'

describe('using persistent mikroorm repo impl', () => {
  test('should initialize ORM instance', async () => {
    const orm = await ORM.getInstance()
    expect(orm.em).not.toBeNull()
    await orm.close()
  })
})
