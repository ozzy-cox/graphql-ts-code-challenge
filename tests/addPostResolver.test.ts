import { Context } from '@/context'
import { mockContext } from '@/mockContext'
import { resolvers } from '@/post/infra/graphql/resolvers'

describe('creating a post using the resolver', () => {
  let context: Context
  beforeAll(async () => {
    context = await mockContext()
  })

  test('should create a post', async () => {
    const args = {
      content: 'Always be trying something new.'
    }

    const post = await resolvers.Mutation.post(undefined, args, context)
    expect(post && post.id).toBeDefined()
    expect(post && post.content).toEqual(args.content)
  })
})
