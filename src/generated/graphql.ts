import type { ReactionType } from '@/reaction/entities/IReaction';
import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import type { IPost } from '@/post/entities/IPost';
import type { IReaction } from '@/reaction/entities/IReaction';
import type { Context } from '@/context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
export type EnumResolverSignature<T, AllowedValues = any> = { [key in keyof T]?: AllowedValues };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: string;
  PostCursor: string;
};

export type CommentConnection = {
  __typename?: 'CommentConnection';
  commentCount: Scalars['Int'];
  edges?: Maybe<Array<Maybe<CommentEdge>>>;
  pageInfo: PageInfo;
};

export type CommentEdge = {
  __typename?: 'CommentEdge';
  cursor: Scalars['PostCursor'];
  node?: Maybe<Post>;
};

export type Commentable = {
  commentsConnection?: Maybe<CommentConnection>;
};


export type CommentableCommentsConnectionArgs = {
  after?: InputMaybe<Scalars['PostCursor']>;
  first?: InputMaybe<Scalars['Int']>;
  flat?: InputMaybe<Scalars['Boolean']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  post?: Maybe<Post>;
  react?: Maybe<Post>;
};


export type MutationPostArgs = {
  content: Scalars['String'];
  postId?: InputMaybe<Scalars['ID']>;
};


export type MutationReactArgs = {
  postId: Scalars['ID'];
  type: ReactionType;
};

export type Node = {
  id: Scalars['ID'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['PostCursor']>;
  hasNextPage: Scalars['Boolean'];
};

export type Post = Commentable & Node & Reactable & {
  __typename?: 'Post';
  commentsConnection?: Maybe<CommentConnection>;
  content: Scalars['String'];
  createdAt: Scalars['Date'];
  id: Scalars['ID'];
  reactionCounts: Array<Maybe<ReactionCount>>;
};


export type PostCommentsConnectionArgs = {
  after?: InputMaybe<Scalars['PostCursor']>;
  first?: InputMaybe<Scalars['Int']>;
  flat?: InputMaybe<Scalars['Boolean']>;
};

export type Query = {
  __typename?: 'Query';
  node?: Maybe<Node>;
  posts: Array<Maybe<Post>>;
};


export type QueryNodeArgs = {
  id: Scalars['ID'];
};


export type QueryPostsArgs = {
  after?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
};

export type Reactable = {
  reactionCounts: Array<Maybe<ReactionCount>>;
};

export type ReactionCount = {
  __typename?: 'ReactionCount';
  count: Scalars['Int'];
  type: ReactionType;
};

export { ReactionType };

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info?: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info?: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info?: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info?: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info?: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info?: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CommentConnection: ResolverTypeWrapper<Omit<CommentConnection, 'edges'> & { edges?: Maybe<Array<Maybe<ResolversTypes['CommentEdge']>>> }>;
  CommentEdge: ResolverTypeWrapper<Omit<CommentEdge, 'node'> & { node?: Maybe<ResolversTypes['Post']> }>;
  Commentable: ResolversTypes['Post'];
  Date: ResolverTypeWrapper<Scalars['Date']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  Node: ResolversTypes['Post'];
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Post: ResolverTypeWrapper<IPost>;
  PostCursor: ResolverTypeWrapper<Scalars['PostCursor']>;
  Query: ResolverTypeWrapper<{}>;
  Reactable: ResolversTypes['Post'];
  ReactionCount: ResolverTypeWrapper<ReactionCount>;
  ReactionType: ReactionType;
  String: ResolverTypeWrapper<Scalars['String']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean'];
  CommentConnection: Omit<CommentConnection, 'edges'> & { edges?: Maybe<Array<Maybe<ResolversParentTypes['CommentEdge']>>> };
  CommentEdge: Omit<CommentEdge, 'node'> & { node?: Maybe<ResolversParentTypes['Post']> };
  Commentable: ResolversParentTypes['Post'];
  Date: Scalars['Date'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Mutation: {};
  Node: ResolversParentTypes['Post'];
  PageInfo: PageInfo;
  Post: IPost;
  PostCursor: Scalars['PostCursor'];
  Query: {};
  Reactable: ResolversParentTypes['Post'];
  ReactionCount: ReactionCount;
  String: Scalars['String'];
}>;

export type CommentConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CommentConnection'] = ResolversParentTypes['CommentConnection']> = ResolversObject<{
  commentCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  edges?: Resolver<Maybe<Array<Maybe<ResolversTypes['CommentEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommentEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CommentEdge'] = ResolversParentTypes['CommentEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['PostCursor'], ParentType, ContextType>;
  node?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommentableResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Commentable'] = ResolversParentTypes['Commentable']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Post', ParentType, ContextType>;
  commentsConnection?: Resolver<Maybe<ResolversTypes['CommentConnection']>, ParentType, ContextType, Partial<CommentableCommentsConnectionArgs>>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  post?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<MutationPostArgs, 'content'>>;
  react?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<MutationReactArgs, 'postId' | 'type'>>;
}>;

export type NodeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Post', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
}>;

export type PageInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
  endCursor?: Resolver<Maybe<ResolversTypes['PostCursor']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = ResolversObject<{
  commentsConnection?: Resolver<Maybe<ResolversTypes['CommentConnection']>, ParentType, ContextType, Partial<PostCommentsConnectionArgs>>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  reactionCounts?: Resolver<Array<Maybe<ResolversTypes['ReactionCount']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface PostCursorScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['PostCursor'], any> {
  name: 'PostCursor';
}

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryNodeArgs, 'id'>>;
  posts?: Resolver<Array<Maybe<ResolversTypes['Post']>>, ParentType, ContextType, Partial<QueryPostsArgs>>;
}>;

export type ReactableResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Reactable'] = ResolversParentTypes['Reactable']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Post', ParentType, ContextType>;
  reactionCounts?: Resolver<Array<Maybe<ResolversTypes['ReactionCount']>>, ParentType, ContextType>;
}>;

export type ReactionCountResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ReactionCount'] = ResolversParentTypes['ReactionCount']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ReactionType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ReactionTypeResolvers = EnumResolverSignature<{ HEART?: any, ROCKET?: any, THUMBSDOWN?: any, THUMBSUP?: any }, ResolversTypes['ReactionType']>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  CommentConnection?: CommentConnectionResolvers<ContextType>;
  CommentEdge?: CommentEdgeResolvers<ContextType>;
  Commentable?: CommentableResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  PostCursor?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  Reactable?: ReactableResolvers<ContextType>;
  ReactionCount?: ReactionCountResolvers<ContextType>;
  ReactionType?: ReactionTypeResolvers;
}>;

