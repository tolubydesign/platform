import AWS from "aws-sdk";

export const bucket = "dev-gql-s3-bucket";

// https://bostjan-cigan.medium.com/graphql-patterns-file-upload-and-download-b391b860ced1
// https://dev.to/franciscomendes10866/upload-files-to-s3-object-storage-or-minio-with-apollo-server-4m46
export const s3 = new AWS.S3({
  endpoint: "http://localhost:9000",
  accessKeyId: process.env.MINIO_ACCESS_KEY ? process.env.MINIO_ACCESS_KEY : "",
  secretAccessKey: process.env.MINIO_SECRET_KEY ? process.env.MINIO_SECRET_KEY : "",
  sslEnabled: false,
  s3ForcePathStyle: true,
});
