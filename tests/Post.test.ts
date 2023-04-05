import { createPost } from '../src/entities/post'

describe('creating a post', () => {
  test('without content', () => {
    expect(() => {
      createPost()
    }).toThrow('Content cannot be empty')
  })
})

describe('creating a post with content', () => {
  const content = 'Lorem ipsum'
  const post = createPost(content)

  test('has content property', () => {
    expect(post).toHaveProperty('content')
  })

  test('has content set correctly when passed in', () => {
    expect(post && post.content).toEqual(content)
  })
})

describe('creating post with different length of content', () => {
  const createPostWithMoreThan280Chars = () => {
    const content =
      'Duis voluptate labore est irure occaecat elit consectetur reprehenderit excepteur tempor cupidatat nulla quis. Voluptate ex qui labore ipsum eu sunt duis commodo labore non. Qui in officia anim elit dolor deserunt elit. Tempor elit labore eu irure sit ipsum non velit irure. Sit eiusmod cillum tempor sit ipsum ex ullamco est labore.'
    return createPost(content)
  }

  const createPostWithLessThanOrEqualTo280Chars = () => {
    const content =
      'Duis voluptate labore est irure occaecat elit consectetur reprehenderit excepteur tempor cupidatat nulla quis. Voluptate ex qui labore ipsum eu sunt duis commodo labore non. Qui in officia anim elit dolor deserunt elit. Tempor elit labore eu irure sit ipsum non velit irure.'
    return createPost(content)
  }

  test('creating content with more than 280 characters', () => {
    expect(createPostWithMoreThan280Chars).toThrow('You cannot send a post which has more than 280 characters')
  })

  test('creating content with less than or equal to 280 characters', () => {
    expect(createPostWithLessThanOrEqualTo280Chars).not.toThrow(
      'You cannot send a post which has more than 280 characters'
    )
  })
})

describe('creating multiple posts', () => {
  const postOne = createPost('Have a nice day')
  const postTwo = createPost('Thank you')

  test('to have id', () => {
    expect(postOne).toHaveProperty('id')
  })

  test('to have valid id', () => {
    expect(postOne && typeof postOne.id).toBe('number')
  })

  test('to have different ids', () => {
    expect(postOne && postOne.id).not.toEqual(postTwo && postTwo.id)
  })
})
