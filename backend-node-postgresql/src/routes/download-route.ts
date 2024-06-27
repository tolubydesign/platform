import express, { Request, Response } from 'express';
const downloadRouter = express.Router()
import bodyParser from 'body-parser';
import { createDownloadFileStream } from '../shared/modules/stream.js';
import { JWTVerification } from '../helpers/utils/authentication.js';
import { ErrorHandler } from '../helpers/utils/express-error-handling.js';
import { logger } from "../core/log/winston-logger.js";

var urlencodedParser = bodyParser.urlencoded({ extended: false })

downloadRouter.get('/', urlencodedParser, async (req: Request<any>, res: Response, next) => {
  const { authorization, uuid } = req.headers;
  const { key } = req.query

  if (typeof key !== "string") {
    const { code, message } = ErrorHandler('bad request', "Query KEY is not of type string");
    logger.error(`DOWNLOAD ID: ${uuid} CODE: ${code} ERROR: ${message}`);
    return res.status(code).send({
      error: message,
      code,
    });
    // throw Error("Query KEY is not of type string");
  }

  if (!authorization) {
    const { code, message, name } = ErrorHandler('unauthorized', "Authentication token is required.");
    logger.error(`DOWNLOAD ID: ${uuid} CODE: ${code} MESSAGE: ${message}`);
    return res.status(code).send({
      error: message,
      code,
    });
  }

  const token = JWTVerification(authorization);

  if (!token) {
    const { code, message, name } = ErrorHandler('unauthorized', "Invalid authentication token provided.");
    logger.error(`DOWNLOAD ID: ${uuid} CODE: ${code} MESSAGE: ${message}`);
    return res.status(code).send({
      error: message,
      code,
    });
  }

  const filename = key;
  const filePromise = await (await createDownloadFileStream(key)).promise;
  // const fileStream = await (await createDownloadFileStream(key)).readStream;

  logger.info(`DOWNLOAD ID: ${uuid} KEY: ${key} HEADERS: ${JSON.stringify(req.headers)}`)
  res.attachment(filename);
  res.header('title', filename);

  res.send(filePromise);
  res.end();
});

downloadRouter.post('/', urlencodedParser, (req: Request, res: Response, next) => {
  const { key } = req.params
  res.send('POST route on things.');
});

export {
  downloadRouter
}