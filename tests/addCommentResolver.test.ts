import { Context } from '@/context'
import { mockContext } from '@/mockContext'
import { Post } from '@/post/infra/orm/models/Post'
import { resolvers } from '@/schema'
import assert from 'assert'

describe('creating a comment using the resolver', () => {
  let context: Context
  let post: Post | undefined

  beforeAll(async () => {
    context = await mockContext()
    post = await context.postService.createPost('Post content')
  })

  test('should create a comment', async () => {
    assert(post)
    const args = {
      content: 'Always be trying something new.',
      postId: post.id
    }

    const comment = resolvers.Mutation?.post instanceof Function && (await resolvers.Mutation.post({}, args, context))

    assert(comment)
    expect(comment.id).toBeDefined()
    expect(comment.content).toEqual(args.content)
    assert(comment.post)
    expect(comment.post.id).toEqual(post.id)
  })
})
