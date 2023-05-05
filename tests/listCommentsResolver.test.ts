import { Context } from '@/context'
import { mockContext } from '@/mockContext'
import { resolvers } from '@/post/infra/graphql/resolvers'
import { Post } from '@/post/infra/orm/models/Post'

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

    expect(
      comments &&
        comments.map((post) => !(post instanceof Error) && post.id).every((id) => id && commentIds.includes(id))
    ).toBeTruthy()
  })
})
