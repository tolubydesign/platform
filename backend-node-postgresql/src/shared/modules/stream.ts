import { GraphQLError } from "graphql";
import { logger } from "../../core/log/winston-logger.js";
import stream from "stream";
import { bucket, s3 } from "./aws-bucket.js";

/**
 * @description Upload file to S3 like bucket. Utilising AWS S3 SDK
 * @param key File name
 * @returns 
 */
export function createFileUploadStream(key: string) {
  const pass = new stream.PassThrough();
  const writeStream = {
    writeStream: pass,
    promise: s3.upload({
      Bucket: bucket,
      Key: key,
      Body: pass,
    }, (error: Error, data: any) => {
      if (error) {
        logger.error(`S3-WRITESTREAM NAME: ${error.name} MESSAGE: ${error.message}`);
      } else {
        // successful response
        logger.info(`S3-WRITESTREAM data: ${JSON.stringify(data)}`);
        return data
      }
    }).promise(),
  }

  return writeStream;
};

/**
 * @description Utilising AWS S3. Create a promise and read stream for the specified file, `key`.
 * @param key 
 * @param response 
 * @returns 
 */
export async function createDownloadFileStream(key: string, response?: any) {
  const awsS3Config = {
    Bucket: bucket,
    Key: key, // filename
  }

  const downloadStream = {
    promise: s3.getObject(
      awsS3Config,
      async (error: Error, data: any) => {
        if (error) {
          logger.error(`S3-DOWNLOAD-STREAM NAME: ${error.name} MESSAGE: ${error.message}`);
        } else {
          // successful response
          logger.info(`S3-DOWNLOAD-STREAM key: ${key}`);
          return data
        }
      }
    ).promise(),
    readStream: s3.getObject(
      awsS3Config,
      async (error: Error, data: any) => {
        if (error) {
          logger.error(`S3-DOWNLOAD-READSTREAM NAME: ${error.name} MESSAGE: ${error.message}`);
        } else {
          // successful response
          logger.info(`S3-DOWNLOAD-READSTREAM key: ${key}`);
          return data
        }
      }
    ).createReadStream()
  }

  return downloadStream;
}