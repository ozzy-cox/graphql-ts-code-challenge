import { Post } from '@/post/infra/orm/models/Post'
import { mockContext } from '@/mockContext'
import { ReactionType } from '@/reaction/entities/IReaction'
import { resolvers } from '@/post/infra/graphql/resolvers'
import { Context } from '@/context'
import { MutationReactArgs } from '@/generated/graphql'
import assert from 'assert'

describe('adding reactions via resolver', () => {
  let context: Context
  let post: Post | undefined

  beforeAll(async () => {
    context = await mockContext()
    post = await context.postService.createPost('Post content')
  })

  test('should create a reaction on a post', async () => {
    assert(post)
    const args: MutationReactArgs = {
      type: ReactionType.HEART,
      postId: post.id
    }

    const reaction =
      resolvers.Mutation?.react instanceof Function && (await resolvers.Mutation?.react?.({}, args, context))
    assert(reaction)

    assert(reaction)
    expect(reaction.post).toBe(post)
    expect(await context.reactionService.getReactionCounts(post, ReactionType.HEART)).toEqual(1)
    expect(await context.reactionService.getReactionCounts(post, ReactionType.THUMBSUP)).toEqual(0)
  })
})
