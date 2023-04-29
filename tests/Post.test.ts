import { IPostRepository, Post, PostController } from '@/entities/Post'
import { getOrm } from '@/lib/orm/orm'
import { PostRepository } from '@/repositories/PostRepository'
import config from '@/mikro-orm-test.config'
import { wipeDb } from '@/initDBStateForTest'
import { MockListableRepository } from '@/repositories/mock/InMemoryRepo'

export const testCreatingPosts = (postRepository: IPostRepository) => {
  describe('creating posts', () => {
    const postController = new PostController(postRepository)
    test('without content', () => {
      expect(async () => {
        await postController.createPost()
      }).rejects.toThrow('Content cannot be empty')
    })

    test('has content property', async () => {
      const content = 'Lorem ipsum'
      const post = await postController.createPost(content)
      expect(post).toHaveProperty('content')
    })

    test('has content set correctly when passed in', async () => {
      const content = 'Lorem ipsum'
      const post = await postController.createPost(content)
      expect(post && post.content).toEqual(content)
    })

    const createPostWithMoreThan280Chars = async () => {
      const content =
        'Duis voluptate labore est irure occaecat elit consectetur reprehenderit excepteur tempor cupidatat nulla quis. Voluptate ex qui labore ipsum eu sunt duis commodo labore non. Qui in officia anim elit dolor deserunt elit. Tempor elit labore eu irure sit ipsum non velit irure. Sit eiusmod cillum tempor sit ipsum ex ullamco est labore.'
      return await postController.createPost(content)
    }

    const createPostWithLessThanOrEqualTo280Chars = async () => {
      const content =
        'Duis voluptate labore est irure occaecat elit consectetur reprehenderit excepteur tempor cupidatat nulla quis. Voluptate ex qui labore ipsum eu sunt duis commodo labore non. Qui in officia anim elit dolor deserunt elit. Tempor elit labore eu irure sit ipsum non velit irure.'
      return await postController.createPost(content)
    }

    test('creating content with more than 280 characters', () => {
      expect(createPostWithMoreThan280Chars).rejects.toThrow(
        'You cannot send a post which has more than 280 characters'
      )
    })

    test('creating content with less than or equal to 280 characters', () => {
      expect(createPostWithLessThanOrEqualTo280Chars).not.toThrow(
        'You cannot send a post which has more than 280 characters'
      )
    })

    test('should have id', async () => {
      const postOne = await postController.createPost('Have a nice day')
      const postTwo = await postController.createPost('Thank you')

      expect(postOne).toHaveProperty('id')

      expect(postOne && postOne.id).not.toEqual(postTwo && postTwo.id)
    })
  })
}

export const testListingPosts = (postRepository: IPostRepository) => {
  describe('listing posts', () => {
    const postController = new PostController(postRepository)
    test('should throw an error when inputs are not integers', () => {
      expect(async () => {
        await postController.listPosts(0.5, 11)
      }).rejects.toThrow('Inputs must be integers')

      expect(async () => {
        await postController.listPosts(0.5, 0.2)
      }).rejects.toThrow('Inputs must be integers')
    })

    test('should list one post when one post is created', async () => {
      await postController.createPost('Have a nice day')
      const posts = await postController.listPosts(0, 5)

      expect(posts.length).toBe(1)
    })
  })
}

export const testCreatingComments = (postRepository: IPostRepository) => {
  describe('creating comments', () => {
    let post: Post | undefined
    const postController = new PostController(postRepository)

    beforeEach(async () => {
      post = await postController.createPost('Lorem ipsum dolor sit amet')
    })

    test('should create a comment on a post', async () => {
      const commentContent = 'I fully agree with that statement'

      // There should be a post
      const comment = post && (await postController.createPost(commentContent, post))
      expect(post).not.toBeNull()
      expect(post && post.id).toEqual(1)
      expect(comment).not.toBeNull()
      expect(comment).toHaveProperty('content')
      expect(comment && comment.content).toEqual(commentContent)
      expect(comment && comment.post).toBe(post)
    })

    test('should create a comment on a comment', async () => {
      const commentContent = "That's a lovely idea."
      const postController = new PostController(postRepository)

      const comment = post && (await postController.createPost(commentContent, post))

      const commentTwoContent = "I don't think that's such a great idea"

      const commentOnComment = comment && (await postController.createPost(commentTwoContent, comment))

      expect(comment).not.toBeNull()
      expect(comment).toHaveProperty('content')
      expect(comment && comment.content).toEqual(commentContent)

      expect(commentOnComment).not.toBeNull()
      expect(commentOnComment).toHaveProperty('content')
      expect(commentOnComment && commentOnComment.content).toEqual(commentTwoContent)

      expect(commentOnComment && commentOnComment.post).toBe(comment)
    })
  })
}
const orm = await getOrm(config)
const em = orm.em.fork()
const ormRepo = new PostRepository(em)

describe('post operations', () => {
  // TODO Below are the real unit tests, should be moved out of this file
  describe('on in memory repo', () => {
    testCreatingPosts(new MockListableRepository<Post>())
    testListingPosts(new MockListableRepository<Post>())
    testCreatingComments(new MockListableRepository<Post>())
  })

  // TODO These connect to the db
  describe('on orm repo', () => {
    it('repo inited', () => {
      expect(orm).not.toBeFalsy()
      expect(ormRepo).not.toBeFalsy()
    })

    beforeEach(async () => {
      await wipeDb()
    })

    testCreatingPosts(ormRepo)
    testListingPosts(ormRepo as unknown as IPostRepository)
    testCreatingComments(ormRepo)

    afterAll(async () => {
      await wipeDb()
      await (await getOrm(config)).close()
    })
  })
})
