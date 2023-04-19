import { initServer } from '@/lib/gql/init'

describe('initializing gql', () => {
  test('should initialize apollo server', async () => {
    const server = await initServer()
    expect(server).not.toBeNull()
  })
})
