import { Reaction, ReactionType } from '@/entities/Reaction'
import { mockContext } from '@/repositories/mock/mockContext'
import { GraphQLResolveInfo } from 'graphql'
import { IFieldResolver } from '@graphql-tools/utils'
import { Context } from '@/lib/gql/context'
import { Post } from '@/entities/Post'
import { resolvers } from '@/lib/gql/resolvers'

describe('adding reactions via resolver', () => {
  let context: Context
  let post: Post | undefined

  beforeAll(async () => {
    context = await mockContext()
    post = await context.postController.createPost('Post content')
  })

  test('should create a reaction on a post', async () => {
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
