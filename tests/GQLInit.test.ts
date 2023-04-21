import { initServer } from '@/lib/gql/server'

describe('initializing gql', () => {
  test('should initialize apollo server', async () => {
    const server = await initServer()
    expect(server).not.toBeNull()
  })
})
