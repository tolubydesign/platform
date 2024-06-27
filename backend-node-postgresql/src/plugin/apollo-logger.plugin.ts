import { ApolloServerPlugin } from "@apollo/server";
import { logger } from "../core/log/winston-logger.js"
import { removeSpacing } from "../helpers/utils/variable-modification.js"
import * as dotenv from 'dotenv'
dotenv.config()

const serverOrigin = process.env.SERVER_ORIGIN
interface PluginContext {
  token: string;
  uuid: string;
}

/**
 * @description Apollo Server Plugin for server logging. Utilises Winston 
 * @param options 
 * @returns 
 * 
 * @see {@link https://www.apollographql.com/docs/apollo-server/integrations/plugins/}
 * @see {@link https://www.apollographql.com/docs/apollo-server/integrations/plugins-event-reference}
 */
export default function (options: { logMessage: boolean }): ApolloServerPlugin<PluginContext> {
  return {
    async serverWillStart() {
      logger.info("Apollo server started.");

      return {
        async serverWillStop() {
          logger.info("Apollo server stopped.");
        },
      };
    },

    async requestDidStart(requestContext) {
      const origin = requestContext.request.http?.headers.get('origin');
      const requestQuery = removeSpacing(requestContext.request.query);
      let operation = requestContext.request.operationName;
      const requestID = requestContext.contextValue.uuid
      const logObj = {
        queries: requestQuery,
        variables: requestContext.request.variables,
        origin: origin,
      };

      // Make sure request from apollo server are not stored
      if (origin && origin !== serverOrigin) {
        logger.info(`REQUEST ID: ${requestID} QUERIES: ${operation} VARIABLES: ${JSON.stringify(requestContext.request.variables)} ORIGIN: ${origin} `)
      }

      if (!origin) logger.warn(`REQUEST ID: ${requestID} QUERIES: ${operation} VARIABLES: ${JSON.stringify(requestContext.request.variables)} ORIGIN: ${origin}`)

      return {
        async parsingDidStart({ contextValue, request }) {
          return async (err: Error | undefined) => {
            if (err) {
              logger.error(`PARSING ID: ${requestID} ERROR: ${JSON.stringify(err)}`)
            }
          };
        },

        async didResolveOperation({ contextValue, request, errors }) {
          if (errors) {
            logger.error(`OPERATION-RESOLVE ID: ${requestID} ERROR: ${JSON.stringify(errors)}`);
          }
        },

        // Fires whenever Apollo Server will validate a
        // request's document AST against your GraphQL schema.
        async validationDidStart({ contextValue, request }) {
          // This end hook is unique in that it can receive an array of errors,
          // which will contain every validation error that occurred.
          return async (errors) => {
            if (errors) {
              logger.error(`VALIDATION ID: ${requestID} ERROR: ${JSON.stringify(errors)}`)
              errors.forEach((err) => console.error(err));
            }
          };
        },

        async didEncounterErrors({ errors, schema }) {
          if (errors) logger.error(`ENCOUNTERED-ERRORS ID: ${requestID} ERROR: ${JSON.stringify(errors)}`)
        },

        async executionDidStart() {
          return {
            async executionDidEnd(err) {
              if (err) {
                console.error(err);
              }
            },
          };
        },
      };
    },
  };
}
