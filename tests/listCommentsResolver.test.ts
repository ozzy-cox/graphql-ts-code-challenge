import { PostController, Post as IPost } from '@/entities/Post'
import { initDBStateForTest, wipeDb } from '@/initDBStateForTest'
import { Context } from '@/lib/gql/context'
import { resolvers } from '@/lib/gql/resolvers'
import { typeDefs } from '@/lib/gql/typeDefs'
import { getOrm } from '@/lib/orm/orm'
import { ApolloServer } from '@apollo/server'
import { EntityRepository } from '@mikro-orm/core'
import config from '@/mikro-orm-test.config'
import { PostRepository } from '@/repositories/PostRepository'
import assert from 'assert'
import { MockListableRepository, MockRepository } from '@/repositories/mock/InMemoryRepo'
import { Post } from '@/lib/orm/models/Post'
import { toGlobalId } from 'graphql-relay'
import { Resolved } from '@/types'
import { ReactionController, ReactionType } from '@/entities/Reaction'
import { Reaction } from '@/lib/orm/models/Reaction'
import { mockContext } from '@/repositories/mock/mockContext'

describe('listing posts using the resolver', () => {
  let post: Post | undefined
  let context: Context

  const commentIds: number[] = []
  beforeAll(async () => {
    context = await mockContext()
    post = await context.postController.createPost('We deployed the latest feature to prod!')
    const comment1 = await context.postController.createPost('Hold my beer!', post)
    const comment2 = await context.postController.createPost('Mine too!', comment1)
    const comment3 = await context.postController.createPost('+1', comment1)
    const comment4 = await context.postController.createPost('Or maybe my Raki? :)', comment1)

    const comment5 = await context.postController.createPost('We have to celebrate this one!', post)
    const comment6 = await context.postController.createPost('Where is the party?', comment5)
    const comment7 = await context.postController.createPost('At the office of course!!', comment6)

    commentIds.push(
      ...([comment1, comment2, comment3, comment4, comment5, comment6, comment7] as Post[]).map((comment) => comment.id)
    )
  })

  test('should list all comments recursively', async () => {
    const args = {
      flat: true
    }

    const comments = post && (await resolvers.Post.comments(post, args, context))

    expect(comments && comments.map((post) => post.id).every((id) => commentIds.includes(id))).toBeTruthy()
  })
})
