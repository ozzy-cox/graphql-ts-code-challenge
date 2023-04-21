import { Post, PostController } from '@/entities/Post'
import { getOrm } from '@/lib/orm/orm'
import { InMemoryPostRepository, ORMPostRepository } from '@/repositories/EntityRepository'
import { Repository } from '@/repositories/RepositoryInterface'
import config from '@/mikro-orm-test.config'

export const testCreatingPosts = (postRepository: Repository<Post>) => {
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

export const testListingPosts = (postRepository: Repository<Post>) => {
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

const orm = await getOrm(config)
const em = orm.em.fork()
const ormRepo = new ORMPostRepository(em)

describe('post operations', () => {
  describe('on in memory repo', () => {
    testCreatingPosts(new InMemoryPostRepository())
    testListingPosts(new InMemoryPostRepository())
  })

  describe('on orm repo', () => {
    it('repo inited', () => {
      expect(orm).not.toBeFalsy()
      expect(ormRepo).not.toBeFalsy()
    })
    beforeEach(async () => {
      const schemaGenerator = orm.getSchemaGenerator()
      await schemaGenerator.refreshDatabase()
    })

    testCreatingPosts(ormRepo)
    testListingPosts(ormRepo as unknown as Repository<Post>)
  })
})
