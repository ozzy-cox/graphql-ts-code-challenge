import { Context } from '@/context'
import { mockContext } from '@/mockContext'
import { resolvers } from '@/post/infra/graphql/resolvers'
import { Post } from '@/post/infra/orm/models/Post'

describe('creating a comment using the resolver', () => {
  let context: Context
  let post: Post | undefined

  beforeAll(async () => {
    context = await mockContext()
    post = await context.postService.createPost('Post content')
  })

  test('should create a comment', async () => {
    const args = {
      content: 'Always be trying something new.',
      postId: post && post.id
    }

    const comment = resolvers.Mutation?.post instanceof Function && (await resolvers.Mutation.post({}, args, context))

    expect(comment && comment.id).toBeDefined()
    expect(comment && comment.content).toEqual(args.content)
    expect(comment && comment.post && comment.post.id).toEqual(post && post.id)
  })
})
