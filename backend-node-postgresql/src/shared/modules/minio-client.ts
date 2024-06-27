import Minio from "minio";
import * as dotenv from 'dotenv'
dotenv.config()

// Instantiate the minio client with the endpoint
// and access keys as shown below.
export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT ? process.env.MINIO_ENDPOINT : "",
  port: 9000,
  useSSL: true,
  accessKey: process.env.MINIO_ACCESS_KEY ? process.env.MINIO_ACCESS_KEY : "",
  secretKey: process.env.MINIO_SECRET_KEY ? process.env.MINIO_SECRET_KEY : "",
});