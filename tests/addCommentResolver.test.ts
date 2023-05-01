import { Context } from '@/lib/gql/context'
import { resolvers } from '@/lib/gql/resolvers/post'
import { IFieldResolver } from '@graphql-tools/utils'
import { GraphQLResolveInfo } from 'graphql'
import { mockContext } from '../src/repositories/mock/mockContext'

describe('creating a comment using the resolver', () => {
  test('should create a comment', async () => {
    const context = mockContext()
    const post = await context.postController.createPost('Post content')

    const args = {
      content: 'Always be trying something new.',
      postId: post && post.id
    }

    const comment = await (resolvers.Mutation.post as IFieldResolver<any, Context, any>)(
      undefined,
      args,
      context,
      undefined as unknown as GraphQLResolveInfo
    )

    expect(comment.id).toBeDefined()
    expect(comment.content).toEqual(args.content)
    expect(comment.post.id).toEqual(post && post.id)
  })
})
