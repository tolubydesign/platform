import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import bodyParser from "body-parser";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";
import express from "express";
import { JWTVerification } from "../helpers/utils/authentication.js";
import { ErrorHandler } from "../helpers/utils/express-error-handling.js";
import { Query } from "../postgres/resolvers/query.js";
import { Mutation } from "../postgres/resolvers/mutation.js";
import { registerTokenExemptRequests } from "../helpers/utils/validation.js";
import * as dotenv from "dotenv";

dotenv.config();
const serverOrigin = process.env.SERVER_ORIGIN;
const queries = Object.keys(Query);
const mutations = Object.keys(Mutation);
const tokenExemptRequests: string[] = registerTokenExemptRequests(
  queries,
  mutations
);

/**
 * @description Express Apollo-Server middleware.
 * @param server
 * @returns
 *
 * @see {@link https://snyk.io/advisor/npm-package/graphql-upload/example}
 */
export function Middleware(server: any) {
  console.info("Middleware called.");
  return [
    cors<cors.CorsRequest>(),
    express.static("public"),
    graphqlUploadExpress(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({
        req,
        res,
      }: {
        req: express.Request;
        res: express.Response;
      }) => {
        let token: string | string[] =
          req.headers["x-access-token"] || req.headers.authorization || "";
        let uuid: string | string[] | undefined = req.headers["uuid"];
        const origin = req.headers.origin;
        // A select number of request don't need an access token
        const query = req.body?.query;

        // TODO: question function below.
        // If the request is coming from the server do nothing
        if (origin === serverOrigin) {
          // PASS
          return { token, req, res, uuid };
        }

        // Line below will stop loop once a value has been found
        const tokenExempt = tokenExemptRequests.find((requestName: string) => {
          return query.includes(requestName);
        });

        // access token not needed
        if (tokenExempt) {
          // PASS
          return { token, req, res, uuid };
        }

        // token value must be a string. Must be validated by JWT
        if (typeof token !== "string") {
          const { code, message, name } = ErrorHandler(
            "unauthorized",
            "Invalid access token."
          );
          res.status(code).send({ error: message, code: code });
          return { undefined };
        }

        // make sure that the request uuid was provided
        if (!uuid || typeof uuid !== "string") {
          const { code, message } = ErrorHandler(
            "bad request",
            "Invalid request ID. Please provide a valid request ID."
          );
          res.status(code).send({ error: message, code: code });
          return { undefined };
        }

        const validToken = JWTVerification(token);

        // Token is valid and request was not exempt from validation
        if (validToken) {
          return { token, req, res, uuid };
        }

        const { code, message, name } = ErrorHandler(
          "unauthorized",
          "Valid authentication token required."
        );
        res.status(code).send({ error: message, code: code });
        return { undefined };
      },
    }),
  ];
}
