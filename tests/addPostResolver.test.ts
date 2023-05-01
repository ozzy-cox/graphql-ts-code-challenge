import { Context } from '@/lib/gql/context'
import { resolvers } from '@/lib/gql/resolvers/post'
import { mockContext } from '@/repositories/mock/mockContext'
import { IFieldResolver } from '@graphql-tools/utils'
import { GraphQLResolveInfo } from 'graphql'

describe('creating a post using the resolver', () => {
  test('should create a post', async () => {
    const context = await mockContext()
    const args = {
      content: 'Always be trying something new.'
    }

    const post = await (resolvers.Mutation.post as IFieldResolver<any, Context, any>)(
      undefined,
      args,
      context,
      undefined as unknown as GraphQLResolveInfo
    )

    expect(post.id).toBeDefined()
    expect(post.content).toEqual(args.content)
  })
})
