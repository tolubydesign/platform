import express, { Application } from 'express';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import { resolvers } from './postgres/resolvers.js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { Middleware } from './middleware/middleware.js';
import { downloadRouter } from "./routes/download-route.js"
import { DownloadMiddleware } from './middleware/download.middleware.js';
import ApolloLogger from './plugin/apollo-logger.plugin.js';
dotenv.config()

const app = express();
const port = process.env.PORT;
const serverPath = "/api";
const httpServer = http.createServer(app)

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = readFileSync('./src/shared/schema/schema.graphql', { encoding: 'utf-8' });
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server: ApolloServer<any> = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    ApolloLogger({
      logMessage: true
    })
  ],
  formatError: error => {
    return error
  },
});

// Ensure we wait for our server to start
await server.start();

app.use(
  "/download",
  DownloadMiddleware(server, app),
  downloadRouter,
);
// Specify the path where we'd like to mount our server
app.use(
  serverPath,
  Middleware(server),
);

// Modified server startup
await new Promise<void>((resolve) => {
  console.log(`Sever up. On port: http://localhost:${port}${serverPath}`)
  return httpServer.listen({ port: Number(port) }, resolve)
});
// Alternatives:
// await new Promise<void>((r) => app.listen({ port: 4000 }, r));
// OR
// app.listen(Number(port), function () {
//   console.log(`Example app listening on port http://localhost:${port}${serverPath}`);
// });
