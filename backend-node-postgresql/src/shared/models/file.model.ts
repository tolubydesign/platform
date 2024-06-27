import path from 'path';
import { finished } from 'stream/promises';
import { IncomingMessage } from 'http';
import os from "os";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from 'url';
import { v4 as uuid } from 'uuid';
import { prisma } from '../../prisma/client.js';
import { createFileUploadStream } from "../../shared/modules/stream.js";
import { GraphQLError } from 'graphql';

type FileContent = {
  encoding: string, filename: string, mimetype: string
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = "public/upload/"

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadDir)
  },
  filename: function (req, file, callback) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    callback(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage, dest: os.tmpdir() })

/**
 * @description Add file information to PostgreSQL database.
 * @param email 
 * @param file 
 * @param request 
 * @returns 
 * 
 * @see {@link https://nodejs.org/api/stream.html#stream_readable_streams}
 */
export async function handleFileUpload(email: string, file: any, request: IncomingMessage, project_id: number | null): Promise<FileContent> {
  const oneGigLimit: number = 1000000000
  const { createReadStream, filename, mimetype, encoding } = await file;
  const stream = createReadStream();

  // Check that folder exists.
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  await checkFileSize(createReadStream, oneGigLimit)
  // generate a scrubbed unique filename
  const uniqueFilename = generateFilename(filename)

  let result;

  try {
    const uploadStream = createFileUploadStream(filename);
    stream.pipe(uploadStream.writeStream);
    result = await uploadStream.promise;

    // console.log("File upload result", result);

    // Add to database
    await prisma.file.create({
      data: {
        dir: uploadDir,
        encoding: encoding,
        mimetype: mimetype,
        uploadedFileName: filename,
        serverFileName: uniqueFilename,
        creator: email,
        project_id: project_id,
      }
    })
  } catch (error: any) {
    console.log(
      `[Error]: Message: ${error.message}, Stack: ${error.stack}`
    );
    throw new GraphQLError(error.message, {
      extensions: {
        code: 'BAD_USER_INPUT',
      },
    });
  }

  return { filename, mimetype, encoding };
}

/**
 * @description Write file to server, public/ folder.
 * @param stream 
 * @param filePath 
 */
async function writeFileToServer(stream: any, filePath: string) {
  // This is purely for demonstration purposes and will overwrite the
  // local-file-output.txt in the current working directory on EACH upload.
  const out = fs.createWriteStream(filePath);
  stream.pipe(out);
  await finished(out);
}

/**
 * @description Determine the size of the file provided
 * @param createReadStream function which is unique to a file that allows us to open up a stream and get the size of this file
 * @param maxSize the maximum size of the file. We'll use this shortly to throw an error if the size is too big 
 * @returns { Promise<> } 
 */
export function checkFileSize(createReadStream: any, maxSize: number): Promise<number> {
  return new Promise((resolves, rejects) => {
    let filesize = 0;
    let stream = createReadStream();

    stream.on('data', (chunk: Buffer) => {
      filesize += chunk.length;
      if (filesize > maxSize) {
        rejects(filesize)
      }
    });
    stream.on('end', () =>
      resolves(filesize)
    );
    stream.on('error', rejects);
  });
}

/**
 * @description Generate an unique uuid string and append it to file name.
 * @param { string } filename 
 * @returns { string }
 */
export function generateFilename(filename: string): string {
  // step 1 - scrub filenname to remove spaces
  // step 2 - ensure filename is unique by appending a UUID
  // step 3 - return the unique filename
  const trimmedFilename = filename.replace(/\s+/g, `-`);
  const unique = uuid();
  return `${unique}-${trimmedFilename}`
}
