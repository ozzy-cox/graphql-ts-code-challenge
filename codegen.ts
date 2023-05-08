import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: './schema.graphql',
  generates: {
    'src/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: '@/context#Context',
        useIndexSignature: true,
        enumValues: {
          ReactionType: '@/reaction/entities/IReaction#ReactionType'
        },
        mappers: {
          Post: '@/post/entities/IPost#IPost',
          Reaction: '@/reaction/entities/IReaction#IReaction'
        },
        useTypeImports: true,
        optionalInfoArgument: true,
        resolverTypeWrapperSignature: 'T'
      }
    },
    './graphql.schema.json': {
      plugins: ['introspection']
    }
  }
}

export default config
