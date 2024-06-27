import { prisma } from "../../prisma/client.js";
import {
  fetchVerifiedAccount,
  JWTGeneration,
  verifyAccountOnServers,
} from "../../helpers/utils/authentication.js";
import { validPassword } from "../../helpers/utils/validation.js";
import { GraphQLError } from "graphql";
import { BasicAccountLoginArgs } from "../../shared/models/account.model.js";
import { ServerResponse } from "http";
import { createDownloadFileStream } from "../../shared/modules/stream.js";
import { Account } from "@prisma/client";
import {
  findLogin,
  signUserOut,
  updateLoginFile,
} from "../../core/log/user-login.js";

/**
 * @see {@link [Apollo GraphQL Error Handling](https://www.apollographql.com/docs/react/data/error-handling/)} - resource
 * @see {@link https://www.apollographql.com/docs/apollo-server/data/errors/} - resource
 * @see {@link https://stackoverflow.com/questions/67830070/graphql-apollo-server-resolvers-arguments-types} - resource
 */
export const Query = {
  accounts: () => prisma.account.findMany(),
  getAccount: async (
    parent: undefined,
    args: BasicAccountLoginArgs,
    contextValue: any,
    info: any
  ) => {
    const response = await prisma.account.findUnique({
      where: {
        email: args.email,
      },
    });

    return response;
  },
  getAllUserAccounts: async (
    _parent: undefined,
    args: { email: string },
    context: { token: string; res: ServerResponse }
  ) => {
    const invalid = await verifyAccountOnServers(context.token, args.email);
    if (invalid.error)
      throw new GraphQLError(invalid.errorMessage, {
        extensions: {
          code: invalid.codeName,
        },
      });

    // Get user. Confirm they are admin
    const serverUser = await prisma.account.findUnique({
      where: {
        email: args.email,
      },
    });

    // Return all project packs
    if (serverUser?.account_type !== "admin")
      throw new GraphQLError("Only Admin users can perform this action.", {
        extensions: {
          code: "UNAUTHORISED",
        },
      });

    return await prisma.account.findMany();
  },
  getAccountDetail: (
    parent: undefined,
    args: BasicAccountLoginArgs,
    context: { token: string },
    info: any
  ) => {
    return prisma.account.findUnique({
      where: {
        email: args.email,
      },
    });
  },
  findAccountById: async (
    _parent: undefined,
    args: { email: string; searchingId: string },
    context: { token: string }
  ) => {
    const invalid = await verifyAccountOnServers(context?.token, args.email);
    if (invalid.error)
      throw new GraphQLError(invalid.errorMessage, {
        extensions: {
          code: invalid.codeName,
        },
      });

    return prisma.account.findUnique({
      where: {
        user_id: args.searchingId,
      },
    });
  },
  generateNewUserToken: async (
    parent: undefined,
    args: BasicAccountLoginArgs,
    context: any,
    info: any
  ) => {
    const response: Account | null = await prisma.account.findFirst({
      where: {
        email: args.email,
      },
    });

    const returningResp: Partial<Account> = JSON.parse(
      JSON.stringify(response)
    );
    if (returningResp.password) delete returningResp.password;

    const resp = {
      token: JWTGeneration(returningResp),
      ...returningResp,
    };

    return resp;
  },
  userSignIn: async (_parent: undefined, args: BasicAccountLoginArgs) => {
    // NOTE: we can restrict we send back further.
    // the .then() function allows you to further restrict what information the user receives. From the response.
    const response = await prisma.account.findFirst({
      where: {
        email: args.email,
      },
    });

    if (
      response?.password &&
      args?.password &&
      !validPassword(response.password, args.password)
    ) {
      throw new GraphQLError("The email or password provide is incorrect.", {
        extensions: {
          code: "UNAUTHORISED",
        },
      });
    }

    // Deep Copy to allow for the removal of the password key/value.
    const returningResp: Partial<Account> = JSON.parse(
      JSON.stringify(response)
    );
    // Remove password from response.
    if (returningResp?.password) delete returningResp.password;
    const generatedToken = JWTGeneration(returningResp);

    // Check logs. Is user currently signed in?
    updateLoginFile(args.email, generatedToken);

    const resp = {
      token: generatedToken,
      ...returningResp,
    };

    return resp;
  },
  userSignOut: async (
    _parent: undefined,
    args: BasicAccountLoginArgs,
    context: { token: string },
    info: any
  ) => {
    // Check logs. Is user currently signed in?
    signUserOut(args.email, context.token);

    return {
      code: "200",
      success: true,
      message: "User signed out successfully.",
    };
  },
  verifyUser: async (
    _parent: undefined,
    args: BasicAccountLoginArgs,
    context: { token: string }
  ) => {
    const invalid = await verifyAccountOnServers(context?.token, args.email);
    if (invalid.error)
      throw new GraphQLError(invalid.errorMessage, {
        extensions: {
          code: invalid.codeName,
        },
      });

    // Check database to see if user should be logged in
    const loggedIn = await findLogin(args.email, context.token);

    if (!loggedIn) {
      // For if you want to create additional security.
      console.log("user is not a known logged in user");
    }

    return {
      verified: true,
      username: invalid.username,
      email: invalid.email,
      account_type: invalid.account_type,
    };
  },
  // Chat
  getAllChatChannels: () => prisma.channel.findMany(),
  getRecentChatChannels: () =>
    prisma.channel.findMany({
      take: 3,
    }),
  getChatChannel: async (
    _parent: undefined,
    args: { channelName: string },
    context: { token: string }
  ) => {
    return prisma.channel.findUnique({
      where: {
        name: args.channelName,
      },
    });
  },
  fetchChannelMessages: async (
    _parent: undefined,
    args: { channelName: string },
    context: { token: string }
  ) => {
    // Get channel id.
    const channel = await prisma.channel.findUnique({
      where: {
        name: args.channelName,
      },
    });

    if (!channel || !channel.id)
      throw new GraphQLError(
        `Channel - ${args.channelName} requested could not be found`,
        {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        }
      );

    const response = await prisma.message.findMany({
      where: {
        channel_id: channel.id,
      },
    });

    return response;
  },

  // Files
  getAllFiles: async (
    _parent: undefined,
    args: { email: string },
    context: { token: string; res: ServerResponse }
  ) => {
    const invalid = await verifyAccountOnServers(context.token, args.email);
    if (invalid.error)
      throw new GraphQLError(invalid.errorMessage, {
        extensions: {
          code: invalid.codeName,
        },
      });

    const files = await prisma.file.findMany();
    return files;
  },

  getRecentFiles: async (
    _parent: undefined,
    args: { email: string },
    context: { token: string; res: ServerResponse }
  ) => {
    const invalid = await verifyAccountOnServers(context.token, args.email);
    if (invalid.error)
      throw new GraphQLError(invalid.errorMessage, {
        extensions: {
          code: invalid.codeName,
        },
      });

    return await prisma.file.findMany({
      take: 3,
      orderBy: {
        uploadedAt: "desc",
      },
    });
  },

  downloadFile: async (
    _parent: undefined,
    args: { email: string; filePath: string; mimetype: string },
    context: { token: string; res: ServerResponse }
  ) => {
    // Make sure request is being made by an actual user.
    const invalid = await verifyAccountOnServers(context.token, args.email);
    if (invalid.error)
      throw new GraphQLError(invalid.errorMessage, {
        extensions: {
          code: invalid.codeName,
        },
      });

    const download = await (
      await createDownloadFileStream("icons8-settings.svg")
    ).promise;
    const body = JSON.parse(JSON.stringify(download?.Body));
    const buffered = Buffer.from(body).toString("utf8");
    // CHANGE THIS IF THE IMAGE YOU ARE WORKING WITH IS .jpg OR WHATEVER
    const mimeType = "image/png"; // e.g., image/png

    return {
      ...download,
      // Body: JSON.stringify(Buffer.from(body).toString('utf8')),
      BodyStringify: JSON.stringify(download),
      BufferStringify: JSON.stringify(buffered),
      filename: args.filePath,
    };
  },

  // Project Pack
  // Get the list of project packs assigned to user. If admin, show all project packs
  listProjectPacks: async (
    _parent: undefined,
    args: { email: string },
    context: { token: string; res: ServerResponse }
  ) => {
    const invalid = await verifyAccountOnServers(context?.token, args.email);
    if (invalid.error)
      throw new GraphQLError(invalid.errorMessage, {
        extensions: {
          code: invalid.codeName,
        },
      });

    // Return all project packs
    if (invalid?.account_type === "admin")
      return await prisma.project.findMany();

    // Return projects packs related to user
    return await prisma.project.findMany({
      where: {
        participants: {
          has: args.email,
        },
      },
    });
  },
  getProject: async (
    _parent: undefined,
    args: { email: string; packName: string },
    context: { token: string; res: ServerResponse }
  ) => {
    const user = await fetchVerifiedAccount(context.token, args.email);
    if (!user)
      throw new GraphQLError(
        "Invalid authentication token or email provided.",
        {
          extensions: {
            code: "UNAUTHORISED",
          },
        }
      );

    // Confirm that user is allowed to see this
    const requestedProject = await prisma.project.findUnique({
      where: {
        project_name: args.packName,
      },
    });

    // Make sure user is part of the project Pack
    if (
      user?.account_type !== "admin" &&
      !requestedProject?.participants.includes(args.email)
    )
      throw new GraphQLError(
        `User does not have access to Project ${requestedProject?.project_name}`,
        {
          extensions: {
            code: "UNAUTHORISED",
          },
        }
      );

    if (user?.account_type === "admin") return requestedProject;

    return requestedProject;
  },

  getProjectFiles: async (
    _parent: undefined,
    args: { email: string; packName: string },
    context: { token: string }
  ) => {
    const user = await fetchVerifiedAccount(context.token, args.email);
    if (!user)
      throw new GraphQLError(
        "Invalid authentication token or email provided.",
        {
          extensions: {
            code: "UNAUTHORISED",
          },
        }
      );

    // Confirm that user is allowed to see this
    const requestedProject = await prisma.project.findUnique({
      where: {
        project_name: args.packName,
      },
    });

    if (!requestedProject || !requestedProject.id) {
      throw new GraphQLError(
        `Projet Pack - ${requestedProject?.project_name} could not be found.`,
        {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        }
      );
    }

    // Make sure user is part of the project Pack
    if (
      user?.account_type !== "admin" &&
      !requestedProject?.participants.includes(args.email)
    )
      throw new GraphQLError(
        `User does not have access to Project ${requestedProject?.project_name}`,
        {
          extensions: {
            code: "UNAUTHORISED",
          },
        }
      );

    const files = await prisma.file.findMany({
      where: {
        project_id: requestedProject.id,
      },
    });

    return files;
  },
};
