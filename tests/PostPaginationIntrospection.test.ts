import { mockContext } from '@/mockContext'
import { resolvers, typeDefs } from '@/schema'
import { ApolloServer } from '@apollo/server'
import assert from 'assert'
import { Context } from 'vm'

describe('server compliance with relay spec', () => {
  let testServer: ApolloServer<Context>
  let context: Context

  beforeAll(async () => {
    testServer = new ApolloServer<Context>({
      typeDefs,
      resolvers
    })

    context = await mockContext()
  })

  test('should introspect the commentConnection', async () => {
    const query = `#graphql
        query IntrospectConnection{
            __type(name: "CommentConnection") {
                fields {
                    name
                    type {
                        name
                        kind
                        ofType {
                            name
                            kind
                        }
                    }
                }
            }
        }
    `

    const expectedResponse = {
      data: {
        __type: {
          fields: [
            // May contain other items
            {
              name: 'pageInfo',
              type: {
                name: null,
                kind: 'NON_NULL',
                ofType: {
                  name: 'PageInfo',
                  kind: 'OBJECT'
                }
              }
            },
            {
              name: 'edges',
              type: {
                name: null,
                kind: 'LIST',
                ofType: {
                  name: 'CommentEdge',
                  kind: 'OBJECT'
                }
              }
            }
          ]
        }
      }
    }

    const response = await testServer.executeOperation(
      {
        query
      },
      {
        contextValue: context
      }
    )

    assert(response.body.kind === 'single')
    expect(response.body.singleResult.errors).toBeUndefined()
    const data = response.body.singleResult

    expect(data).toEqual(expectedResponse)
  })

  test('should introspect the commentEdge', async () => {
    const query = `#graphql
       query IntrospectEdge{
            __type(name: "CommentEdge") {
                fields {
                    name
                    type {
                        name
                        kind
                        ofType {
                            name
                            kind
                        }
                    }
                }
            }
        }
    `

    const response = await testServer.executeOperation(
      {
        query
      },
      {
        contextValue: context
      }
    )

    const expectedResponse = {
      data: {
        __type: {
          fields: [
            {
              name: 'node',
              type: {
                name: 'Post',
                kind: 'OBJECT',
                ofType: null
              }
            },
            {
              name: 'cursor',
              type: {
                name: null,
                kind: 'NON_NULL',
                ofType: {
                  name: 'String',
                  kind: 'SCALAR'
                }
              }
            }
          ]
        }
      }
    }

    assert(response.body.kind === 'single')
    expect(response.body.singleResult.errors).toBeUndefined()
    const data = response.body.singleResult

    expect(data).toEqual(expectedResponse)
  })

  test('should introspect the PageInfo', async () => {
    const query = `#graphql
        query IntrospectPageInfo{
            __type(name: "PageInfo") {
                fields {
                    name
                    type {
                        name
                        kind
                        ofType {
                            name
                            kind
                        }
                    }
                }
            }
        }
    `

    const response = await testServer.executeOperation(
      {
        query
      },
      {
        contextValue: context
      }
    )

    const expectedResponse = {
      data: {
        __type: {
          fields: [
            // May contain other fields.
            {
              name: 'hasNextPage',
              type: {
                name: null,
                kind: 'NON_NULL',
                ofType: {
                  name: 'Boolean',
                  kind: 'SCALAR'
                }
              }
            },
            {
              name: 'startCursor',
              type: {
                name: 'String',
                kind: 'SCALAR',
                ofType: null
              }
            }
          ]
        }
      }
    }

    assert(response.body.kind === 'single')
    expect(response.body.singleResult.errors).toBeUndefined()
    const data = response.body.singleResult

    expect(data).toEqual(expectedResponse)
  })
})
