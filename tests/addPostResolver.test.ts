import { Context } from '@/context'
import { mockContext } from '@/mockContext'
import { resolvers } from '@/schema'
import assert from 'assert'

describe('creating a post using the resolver', () => {
  let context: Context
  beforeAll(async () => {
    context = await mockContext()
  })

  test('should create a post', async () => {
    const args = {
      content: 'Always be trying something new.'
    }

    const post = resolvers.Mutation?.post instanceof Function && (await resolvers.Mutation.post({}, args, context))
    assert(post)
    expect(post.id).toBeDefined()
    expect(post.content).toEqual(args.content)
  })
})
