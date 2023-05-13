import { Context } from '@/context'
import { mockContext } from '@/mockContext'
import { IPost } from '@/post/entities/IPost'
import { resolvers } from '@/schema'
import { Post } from '@/post/infra/orm/models/Post'
import { filterOutErrors } from '@/shared/helpers/utils'
import assert from 'assert'

describe('listing posts using the resolver', () => {
  let post: Post | undefined
  let context: Context

  const commentIds: Post['id'][] = []

  beforeAll(async () => {
    context = await mockContext()
    post = await context.postService.createPost('We deployed the latest feature to prod!')
    const comment1 = await context.postService.createPost('Hold my beer!', post)
    const comment2 = await context.postService.createPost('Mine too!', comment1)
    const comment3 = await context.postService.createPost('+1', comment1)
    const comment4 = await context.postService.createPost('Or maybe my Raki? :)', comment1)

    const comment5 = await context.postService.createPost('We have to celebrate this one!', post)
    const comment6 = await context.postService.createPost('Where is the party?', comment5)
    const comment7 = await context.postService.createPost('At the office of course!!', comment6)

    commentIds.push(
      ...filterOutErrors([comment1, comment2, comment3, comment4, comment5, comment6, comment7])
        .filter((comment): comment is IPost => !!comment)
        .map((comment) => comment.id)
    )
  })

  test('should list all comments recursively', async () => {
    const args = {
      flat: true
    }

    assert(post)
    const comments =
      resolvers.Post?.commentsConnection instanceof Function &&
      (await resolvers.Post.commentsConnection(post, args, context))?.edges?.map((edge) => edge?.node)

    assert(comments)
    expect(
      comments.map((post) => !(post instanceof Error) && post && post?.id).every((id) => id && commentIds.includes(id))
    ).toBeTruthy()
  })
})
