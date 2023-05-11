import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchema } from '@graphql-tools/load'
import { mergeResolvers } from '@graphql-tools/merge'
import { resolvers as postResolvers } from '@/post/graphql/resolvers'
import { resolvers as reactionResolvers } from '@/reaction/graphql/resolvers'
import { resolvers as sharedResolvers } from '@/shared/graphql/resolvers'
import { Resolvers } from './generated/graphql'

export const typeDefs: any = await loadSchema('./**/*.graphql', {
  loaders: [new GraphQLFileLoader()]
})

export const resolvers = mergeResolvers([postResolvers, reactionResolvers, sharedResolvers]) as Resolvers
