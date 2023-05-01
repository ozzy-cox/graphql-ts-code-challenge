import { Context } from '@/lib/gql/context'
import { resolvers } from '@/lib/gql/resolvers/post'
import { mockContext } from '@/repositories/mock/mockContext'
import { IFieldResolver } from '@graphql-tools/utils'
import { GraphQLResolveInfo } from 'graphql'

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
