import { initServer } from '@/createServer'

describe('initializing gql', () => {
  test('should initialize apollo server', async () => {
    const server = await initServer()
    expect(server).not.toBeNull()
    await server.stop()
  })
})
