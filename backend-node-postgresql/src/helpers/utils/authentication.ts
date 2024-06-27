import { prisma } from "../../prisma/client.js";
import bcrypt from "bcryptjs";
import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { ValidUser, ValidAdminUser } from "../../shared/models/account.model.js"
import * as dotenv from 'dotenv'
import { Account } from "@prisma/client";
dotenv.config()

const issuer = process.env.JWT_ISSUER;
const subject = process.env.JWT_SUBJECT;
const audience = process.env.JWT_AUDIENCE;
const expiration = '2d'
const basicJWTOption = {
  issuer: issuer,
  subject: subject,
  audience: audience,
}

const secret: string = process.env.JWT_SECRET ? process.env.JWT_SECRET : "";

// TODO: implement salting and hashing of password
const saltRounds = 10
const salt = bcrypt.genSaltSync(saltRounds)

/**
 * @description Verify that the provided JWT token is authentic.
 * @param { string } token 
 * @returns { string | jwt.Jwt | jwt.JwtPayload } isValid
 */
export function JWTVerification(token: string): string | jwt.Jwt | jwt.JwtPayload {
  const verifyOptions: VerifyOptions = {
    ...basicJWTOption,
    algorithms: ['HS256'],
    maxAge: expiration,
  }
  return jwt.verify(token, secret, verifyOptions);
}

/**
 * @description Generate JWT token. For request authentication purposes
 * @param {any} databaseResponse
 * @returns { string } token
 */
export function JWTGeneration(databaseResponse: Partial<Account>): string {
  const signOptions: SignOptions = {
    ...basicJWTOption,
    algorithm: 'HS256',
    expiresIn: expiration,
  }
  const token = jwt.sign(databaseResponse, secret, signOptions)
  return token
};

/**
 * @description Check whether the provided credentials, sent by user, are valid.
 * @param token 
 * @param email 
 * @returns TUserValidationResponse
 */
export async function verifyAccountOnServers(token: string | undefined, email: string): Promise<ValidUser> {
  if (!token) return {
    error: true,
    errorMessage: "Authentication token required.",
    codeName: "UNAUTHORISED"
  }

  const tokenResponse: any = JWTVerification(token);

  if (!tokenResponse) return {
    error: true,
    errorMessage: "Authentication token not valid.",
    codeName: "UNAUTHORISED"
  }

  const serverUser = await prisma.account.findUnique({
    where: {
      email: email
    }
  });

  if (!serverUser) return {
    error: true,
    errorMessage: "Account could not be found.",
    codeName: "BAD_USER_INPUT"
  }

  if (
    email !== serverUser.email ||
    tokenResponse.email !== serverUser.email || 
    tokenResponse.email !== email
  ) return {
    error: true,
    errorMessage: "Account credentials do not match what is on the server.",
    codeName: "BAD_USER_INPUT"
  }


  return {
    error: false,
    errorMessage: "Account verification successful",
    codeName: "AUTHORISED",
    ...serverUser
  }
};

/**
 * @description Get a server known account details.
 * @param token 
 * @param email 
 * @returns 
 */
export async function fetchVerifiedAccount(token: string | undefined, email: string): Promise<Account | null> {
  if (!token) return null;
  const verification: any = JWTVerification(token);
  if (!verification) return null;

  let serverUser = await prisma.account.findUnique({
    where: {
      email: email,
    }
  });

  if (verification?.email === email && verification?.email === serverUser?.email) {
    return serverUser
  } 

  return null
}

/**
 * @description More complex method of checking that a user is a known user on the server. Will return user account if successful
 * @param token 
 * @param email 
 * @returns ValidAdminUser 
 */
export async function verifyAdminUser(token: string | undefined, email: string): Promise<ValidAdminUser> {
  if (!token) return {
    error: true,
    errorMessage: "Authentication token required.",
    codeName: "UNAUTHORISED"
  }

  const response: any = JWTVerification(token);

  if (!response) return {
    error: true,
    errorMessage: "Authentication token not valid.",
    codeName: "UNAUTHORISED"
  }

  const serverUser = await prisma.account.findUnique({
    where: {
      email: email
    }
  });

  if (!serverUser) return {
    error: true,
    errorMessage: "Account could not be found.",
    codeName: "BAD_USER_INPUT"
  }

  if (
    email !== serverUser.email ||
    response.email !== serverUser.email || 
    response.email !== email
  ) return {
    error: true,
    errorMessage: "Account credentials do not match what is on the server.",
    // Alternative > GRAPHQL_VALIDATION_FAILED
    codeName: "BAD_USER_INPUT"
  }

  if (serverUser.account_type.toLowerCase() !== "admin") return {
    error: true,
    errorMessage: "Account is not an admin user.",
    codeName: "UNAUTHORISED"
  }

  return {
    error: false,
    errorMessage: "Account verified as admin user successful.",
    codeName: "AUTHORISED",
    ...serverUser
  }
}
