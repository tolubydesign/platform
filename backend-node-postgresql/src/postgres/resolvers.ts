import { ApolloServerOptions, ApolloServerOptionsWithTypeDefs, BaseContext, } from '@apollo/server';
import { Mutation } from './resolvers/mutation.js';
import { Query } from './resolvers/query.js';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import type { IExecutableSchemaDefinition } from '@graphql-tools/schema';

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
export const resolvers: IExecutableSchemaDefinition<any>['resolvers'] = {
  Query,
  Mutation,
  Upload: GraphQLUpload,
};