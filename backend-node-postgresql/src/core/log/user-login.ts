import fs from "fs";
import * as fsPromise from "fs/promises"
import { LoggedIn } from "../../shared/models/account.model.js";
import { logger } from "./winston-logger.js";

const loginFileName = "login.log";
const loginFilepath = "public/logs/";
const filepath = loginFilepath + loginFileName;

function createLoginFile() {
  let createStream = fs.createWriteStream(filepath);
  return createStream.end();
}

/**
 * @description Read `/login.log`
 * @returns 
 */
export function readLoginFile(): Promise<string> {
  return fsPromise.readFile(filepath, 'utf8');
}

/**
 * @description ...
 * @param email 
 * @param token 
 * 
 * @see {@link https://nodejs.org/api/fs.html#fsaccesspath-mode-callback}
 */
export async function updateLoginFile(email: string, token: string) {
  // Find out if file exists
  fs.open(filepath, async (error, fd) => {
    if (error) {
      logger.error(`LOGIN CODE: ${error.code} NAME: ${error.name} MESSAGE: ${error.message}`);
      if (error.code === 'ENOENT') {        
        createLoginFile()
        await writeToLoginFile(email, token, undefined);
        return;
      }

      if (error.code === 'EEXIST') {
        await readLoginFile()
          .then((file: string) => {
            writeToLoginFile(email, token, file);
          })
          .catch((error: Error) => {
            logger.error(`LOGIN NAME: ${error.name} MESSAGE: ${error.message}`);
          })

        return;
      }
    }

    try {
      // read or write to file
      await readLoginFile()
        .then((file: string) => {
          logger.info(`LOGIN file created`);
          // readFile = file;
          writeToLoginFile(email, token, file);
        })
        .catch((error: Error) => {
          logger.error(`LOGIN NAME: ${error.name} MESSAGE: ${error.message}`);
        })

    } finally {
      fs.close(fd, (err) => {
        if (err) throw new Error(err.message);
      });
    }
  });
}

/**
 * @description Write provided email and token to `/login.log`
 * @param email 
 * @param token 
 * @param existingContent 
 */
export async function writeToLoginFile(email: string, token: string, existingContent?: string) {
  let loginInformation: any[] | undefined = undefined;
  let logContent = {
    email,
    token,
    timestamp: new Date()
  };

  if (!existingContent) {
    logger.error(`LOGIN MESSAGE: file content is undefined`);
    loginInformation = [
      logContent
    ]
  }


  if (existingContent && !loginInformation) {
    loginInformation = JSON.parse(existingContent);

    const existingUser = loginInformation?.find((log) => {
      if (log.email === email) {
        return log
      }
    })

    // Look for if login user already exists
    if (!existingUser) {
      // Append new login
      loginInformation?.push(logContent);
    }
  }

  writeLoginContent(JSON.stringify(loginInformation))
}

/**
 * @description Write content to `/login.log`
 * @param content 
 * @returns 
 */
function writeLoginContent(content: string) {
  const writeStream = fs.createWriteStream(filepath);
  writeStream.write(content, (error: Error | undefined | null) => {
    if (error) {
      logger.error(`WRITESTREAM NAME: ${error.name} MESSAGE: ${error.message}`)
      throw new Error(error.message);
    }
  });
  return writeStream.end();
}

/**
 * @description Remove provided user information from login logs.
 * @param email 
 * @param token 
 */
export async function signUserOut(email: string, token: string) {
  // Find out if file exists
  fs.open(filepath, async (error, fd) => {
    if (error) {
      if (error.code === 'ENOENT') {
        console.error('file does not exist');
        logger.error(`LOG-OUT CODE: ${error.code} NAME: ${error.name} MESSAGE: ${error.message}`);
        return;
      }

      logger.error(`LOG-OUT CODE: ${error.code} NAME: ${error.name} MESSAGE: ${error.message}`);
    }

    try {
      await readLoginFile()
        .then((file: string) => {
          removeLogin(email, token, file);
        })
        .catch((error: Error) => {
          logger.error(`LOG-OUT NAME: ${error.name} MESSAGE: ${error.message}`);
        })
    } finally {
      fs.close(fd, (err) => {
        if (err) throw new Error(err.message);
      });
    }
  });
};

/**
 * @description Remove email from `content` provided.
 * @param email 
 * @param token 
 * @param content 
 */
function removeLogin(email: string, token: string, content: string) {
  let loginInformation: any[] = JSON.parse(content);
  loginInformation = loginInformation.filter((log) => log.email !== email);
  writeLoginContent(JSON.stringify(loginInformation))
}

/**
 * @description Find a email/token within the known list of logged in users.
 * @param email 
 * @param token 
 * @returns 
 */
export async function findLogin(email: string, token: string): Promise<LoggedIn | undefined | null> {
  let foundLogin: LoggedIn | undefined = undefined
  await readLoginFile()
  .then((file) => {
    foundLogin = JSON.parse(file).find((log: LoggedIn) => log.email === email);
  })
  .catch((error: Error) => {
    logger.error(`LOG-OUT NAME: ${error.name} MESSAGE: ${error.message}`);
  })

  return foundLogin
} 