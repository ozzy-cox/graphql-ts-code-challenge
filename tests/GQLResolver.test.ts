import { resolvers } from '@/lib/gql/resolvers/post'

describe('querying server', () => {
  test('list first three posts', async () => {
    const posts = await resolvers.Query.posts(undefined, {}, {}, {})

    expect(posts).toHaveLength(3)
    expect
  })
})
