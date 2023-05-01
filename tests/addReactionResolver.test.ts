import { Reaction, ReactionType } from '@/entities/Reaction'
import { resolvers } from '@/lib/gql/resolvers/post'
import { mockContext } from '@/repositories/mock/mockContext'
import { GraphQLResolveInfo } from 'graphql'
import { IFieldResolver } from '@graphql-tools/utils'
import { Context } from '@/lib/gql/context'

describe('adding reactions via resolver', () => {
  test('should create a reaction on a post', async () => {
    const context = mockContext()
    const post = await context.postController.createPost('Post content')
    const args = {
      type: ReactionType.HEART,
      postId: post && post.id
    }

    const reaction: Reaction = await (resolvers.Mutation.react as IFieldResolver<any, Context, any>)(
      undefined,
      args,
      context,
      undefined as unknown as GraphQLResolveInfo
    )

    expect(reaction.post).toBe(post)
    expect(post && (await context.reactionController.getReactionCounts(post, ReactionType.HEART))).toEqual(1)
    expect(post && (await context.reactionController.getReactionCounts(post, ReactionType.THUMBSUP))).toEqual(0)
  })
})
