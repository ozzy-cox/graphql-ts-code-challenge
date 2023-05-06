import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Date: any
}

export type Commentable = {
  comments: Array<Post>
}

export type Mutation = {
  __typename?: 'Mutation'
  post?: Maybe<Post>
  react?: Maybe<Post>
}

export type MutationPostArgs = {
  content: Scalars['String']
  postId?: InputMaybe<Scalars['ID']>
}

export type MutationReactArgs = {
  postId: Scalars['ID']
  type: ReactionType
}

export type Node = {
  id: Scalars['ID']
}

export type Post = Commentable &
  Node &
  Reactable & {
    __typename?: 'Post'
    comment_count: Scalars['Int']
    comments: Array<Post>
    content: Scalars['String']
    createdAt: Scalars['Date']
    id: Scalars['ID']
    reaction_counts: Array<ReactionCount>
    reactions: Array<Reaction>
  }

export type PostCommentsArgs = {
  flat?: InputMaybe<Scalars['Boolean']>
}

export type Query = {
  __typename?: 'Query'
  node?: Maybe<Node>
  posts?: Maybe<Array<Post>>
}

export type QueryNodeArgs = {
  id: Scalars['ID']
}

export type QueryPostsArgs = {
  cursor: Scalars['ID']
  limit?: InputMaybe<Scalars['Int']>
}

export type Reactable = {
  reactions: Array<Reaction>
}

export type Reaction = {
  __typename?: 'Reaction'
  type: ReactionType
}

export type ReactionCount = {
  __typename?: 'ReactionCount'
  count?: Maybe<Scalars['Int']>
  type: ReactionType
}

export enum ReactionType {
  Heart = 'HEART',
  Rocket = 'ROCKET',
  Thumbsdown = 'THUMBSDOWN',
  Thumbsup = 'THUMBSUP'
}

export type ResolverTypeWrapper<T> = Promise<T> | T

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  Commentable: ResolversTypes['Post']
  Date: ResolverTypeWrapper<Scalars['Date']>
  ID: ResolverTypeWrapper<Scalars['ID']>
  Int: ResolverTypeWrapper<Scalars['Int']>
  Mutation: ResolverTypeWrapper<{}>
  Node: ResolversTypes['Post']
  Post: ResolverTypeWrapper<Post>
  Query: ResolverTypeWrapper<{}>
  Reactable: ResolversTypes['Post']
  Reaction: ResolverTypeWrapper<Reaction>
  ReactionCount: ResolverTypeWrapper<ReactionCount>
  ReactionType: ReactionType
  String: ResolverTypeWrapper<Scalars['String']>
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']
  Commentable: ResolversParentTypes['Post']
  Date: Scalars['Date']
  ID: Scalars['ID']
  Int: Scalars['Int']
  Mutation: {}
  Node: ResolversParentTypes['Post']
  Post: Post
  Query: {}
  Reactable: ResolversParentTypes['Post']
  Reaction: Reaction
  ReactionCount: ReactionCount
  String: Scalars['String']
}

export type CommentableResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Commentable'] = ResolversParentTypes['Commentable']
> = {
  __resolveType: TypeResolveFn<'Post', ParentType, ContextType>
  comments?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType>
}

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date'
}

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
  post?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<MutationPostArgs, 'content'>>
  react?: Resolver<
    Maybe<ResolversTypes['Post']>,
    ParentType,
    ContextType,
    RequireFields<MutationReactArgs, 'postId' | 'type'>
  >
}

export type NodeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']
> = {
  __resolveType: TypeResolveFn<'Post', ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
}

export type PostResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']
> = {
  comment_count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  comments?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType, Partial<PostCommentsArgs>>
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  reaction_counts?: Resolver<Array<ResolversTypes['ReactionCount']>, ParentType, ContextType>
  reactions?: Resolver<Array<ResolversTypes['Reaction']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryNodeArgs, 'id'>>;
  posts?: Resolver<Maybe<Array<ResolversTypes['Post']>>, ParentType, ContextType, RequireFields<QueryPostsArgs, 'cursor'>>;
};

export type ReactableResolvers<ContextType = any, ParentType extends ResolversParentTypes['Reactable'] = ResolversParentTypes['Reactable']> = {
  __resolveType: TypeResolveFn<'Post', ParentType, ContextType>;
  reactions?: Resolver<Array<ResolversTypes['Reaction']>, ParentType, ContextType>;
};

export type ReactionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Reaction'] = ResolversParentTypes['Reaction']> = {
  type?: Resolver<ResolversTypes['ReactionType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReactionCountResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReactionCount'] = ResolversParentTypes['ReactionCount']> = {
  count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ReactionType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Commentable?: CommentableResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Reactable?: ReactableResolvers<ContextType>;
  Reaction?: ReactionResolvers<ContextType>;
  ReactionCount?: ReactionCountResolvers<ContextType>;
};

