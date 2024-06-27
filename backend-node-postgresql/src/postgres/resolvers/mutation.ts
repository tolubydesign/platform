import { JWTVerification, verifyAccountOnServers, verifyAdminUser } from "../../helpers/utils/authentication.js";
import { GraphQLError } from 'graphql';
import { prisma } from '../../prisma/client.js';
import { validPassword } from '../../helpers/utils/validation.js';
import { AccountCreation } from "../../shared/models/account.model.js";
import { handleFileUpload } from '../../shared/models/file.model.js';
import { IncomingMessage } from 'http';

// Resource captured from: https://dev.to/nditah/how-to-build-a-graphql-api-with-apollo-server-and-prisma-1bfj
export const Mutation = {
  createAccount: (parent: any, args: any) => {
    // testing purposes only
    return prisma.account.create({
      data: {
        email: args.email,
        username: args.username,
        password: args.password,
        phone: args.phone,
        user_group: args.user_group,
        account_type: args.account_type
      }
    })
  },
  addAccount: async (parent: undefined, args: { email: string, account: AccountCreation }, context: any, info: any) => {
    if (!context.token) {
      throw new GraphQLError("Authentication token required.", {
        extensions: {
          code: 'UNAUTHORISED',
        },
      });
    }

    const user: any = JWTVerification(context.token);
    const serverUser = await prisma.account.findUnique({
      where: {
        email: args.email
      }
    })

    if (!serverUser || !user) throw new GraphQLError("Account could not be found.", {
      extensions: {
        code: 'BAD_USER_INPUT',
      },
    });

    // Confirm on the server that the user is an admin. For security reasons.
    if (serverUser.account_type !== "admin") throw new GraphQLError("This account is not authorised to make this request.", {
      extensions: {
        code: 'UNAUTHORISED',
      },
    });

    // the server will handle the user_id
    await prisma.account.create({
      data: {
        email: args.account.email,
        username: args.account.username,
        password: args.account.password,
        phone: args.account.phone,
        user_group: args.account.user_group,
        account_type: args.account.account_type
      }
    });

    return {
      code: "200",
      success: true,
      message: "Account created successfully."
    }
  },
  deleteAccount: async (parent: any, args: { email: string, selectedEmail: string }, context: { token: string }) => {
    const invalid = await verifyAdminUser(context?.token, args.email)
    if (invalid.error) throw new GraphQLError(invalid.errorMessage, {
      extensions: {
        code: invalid.codeName,
      },
    });

    return prisma.account.delete({
      where: {
        email: args.selectedEmail
      }
    })
  },
  updateAccountDetail: async (parent: any, args: { email: string, username: string, phone: string, user_group: string }, context: { token: string }) => {
    const invalid = await verifyAccountOnServers(context?.token, args.email)
    if (invalid.error) throw new GraphQLError(invalid.errorMessage, {
      extensions: {
        code: invalid.codeName,
      },
    });

    // Update account detail.
    // Update email within another function.
    await prisma.account.update({
      where: {
        email: args.email
      },
      data: {
        user_group: args.user_group,
        username: args.username,
        phone: args.phone,
      }
    })

    return {
      code: "200",
      success: true,
      message: "Account updated successfully."
    }
  },
  updateAccountPassword: async (parent: any, args: { email: string, currentPassword: string, newPassword: string }, context: { token: string }) => {
    const invalid = await verifyAccountOnServers(context?.token, args.email)
    if (invalid.error) throw new GraphQLError(invalid.errorMessage, {
      extensions: {
        code: invalid.codeName,
      },
    });

    if (!args.currentPassword || !args.newPassword)
      throw new GraphQLError("Incorrect password provided.", {
        extensions: {
          code: 'UNAUTHORISED',
        },
      });

    // Check that passwords match
    if (!validPassword(invalid?.password, args.currentPassword))
      throw new GraphQLError("Password provided does not match the server.", {
        extensions: {
          code: 'UNAUTHORISED',
        },
      });

    // Update password
    await prisma.account.update({
      where: {
        email: args.email
      },
      data: {
        password: args.newPassword,
      }
    });

    return {
      code: "200",
      success: true,
      message: "Password updated."
    }
  },
  adminUpdateAccount: async (parent: any, args: { email: string, accountEmail: string, account_type: "admin" | 'user', phone: string, username: string, password: string, user_group: string }, context: { token: string }) => {
    const invalid = await verifyAccountOnServers(context?.token, args.email)
    if (invalid.error) throw new GraphQLError(invalid.errorMessage, {
      extensions: {
        code: invalid.codeName,
      },
    });

    // Admins can update anyone's update
    // Add user validation requirements 
    return prisma.account.update({
      where: {
        email: args.accountEmail,
      },
      data: {
        email: args.accountEmail,
        account_type: args.account_type,
        phone: args.phone,
        username: args.username,
        password: args.password,
        user_group: args.user_group,
      },
    })
  },
  userUpdateAccount: async (parent: any, args: { email: string, account_type: "admin" | 'user', phone: string, username: string, password: string, user_group: string }, context: { token: string }) => {
    const invalid = await verifyAdminUser(context?.token, args.email)
    if (invalid.error) throw new GraphQLError(invalid.errorMessage, {
      extensions: {
        code: invalid.codeName,
      },
    });

    // If the user id matches their id
    // Add user validation requirements 
    return prisma.account.update({
      where: {
        email: args.email,
      },
      data: {
        email: args.email,
        account_type: args.account_type,
        phone: args.phone,
        username: args.username,
        user_group: args.user_group,
      },
    })
  },
  /** Chat Channel */
  createChatChannel: async (parent: undefined, args: { creatorEmail: string, channelName: string }, context: any, info: any) => {
    const invalid = await verifyAdminUser(context?.token, args.creatorEmail)
    if (invalid.error) throw new GraphQLError(invalid.errorMessage, {
      extensions: {
        code: invalid.codeName,
      },
    });

    await prisma.channel.create({
      data: {
        creator_id: invalid.user_id,
        name: args.channelName,
      },
    })

    return {
      code: "200",
      success: true,
      message: `Chat channel '${args.channelName}' was successfully created.`
    }
  },
  createMessage: async (parent: undefined, args: { username: string, channel_id: number, message: string, user_email: string}, context: {token: string}, info: any) => {
    const invalid = await verifyAccountOnServers(context?.token, args.user_email)
    if (invalid.error) throw new GraphQLError(invalid.errorMessage, {
      extensions: {
        code: invalid.codeName,
      },
    });

    await prisma.message.create({
      data: {
        username: args.username,
        channel_id: args.channel_id,
        message: args.message,
        user_email: args.user_email,
      }
    });

    return {
      code: "200",
      success: true,
      message: "Message sent successfully."
    }
  },

  // Upload File
  uploadFile: async (parent: undefined, args: { email: string, file: any, projectId: number }, context: { token: string, req: IncomingMessage }, info: any) => {
    // Confirm that user is actual user
    // Confirm that user is registered to server.
    // Hash file.
    // Add references, of file, to database.
    // Upload file to /public
    // -
    let project = null
    const invalid = await verifyAdminUser(context?.token, args.email)
    if (invalid.error) throw new GraphQLError(invalid.errorMessage, {
      extensions: {
        code: invalid.codeName,
      },
    });

    if (args.projectId > 0) {
      project = args.projectId;
    }

    // Initial attempts at uploading files
    const { encoding, filename, mimetype } = await handleFileUpload(args.email, args.file, context.req, project)
    
    return {
      code: "200",
      success: true,
      message: "File uploaded successfully."
    }
  },

  // Project Pack
  createProjectPack: async (parent: undefined, args: { email: string, projectName: string, participants: string[] }, context: { token: string, req: IncomingMessage }, info: any) => {
    const invalid = await verifyAdminUser(context.token, args.email)
    if (invalid.error) throw new GraphQLError(invalid.errorMessage, {
      extensions: {
        code: invalid.codeName,
      },
    });

    await prisma.project.create({
      data: {
        project_name: args.projectName,
        creator_email: args.email,
        participants: args.participants,
      }
    });

    return {
      code: "200",
      success: true,
      message: "Project created successfully."
    }
  },

  addParticipantToProjectPack: async (parent: undefined, args: { email: string, projectId: number, participant: string }, context: { token: string | undefined, req: IncomingMessage }, info: any) => {
    const invalid = await verifyAccountOnServers(context?.token, args.email)
    if (!invalid.error) throw new GraphQLError(invalid.errorMessage, {
      extensions: {
        code: invalid.codeName,
      },
    });

    const project = await prisma.project.findUnique({
      where: {
        id: args.projectId
      }
    })

    // Check that user doesn't already exist in the project
    if (project?.participants.includes(args.participant)) throw new GraphQLError(`${args.email} is already a participant of Project ${project.project_name}`, {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });

    await prisma.project.update({
      where: {
        id: args.projectId
      },
      data: {
        participants: {
          push: args.participant
        }
      }
    })

    return {
      code: "200",
      success: true,
      message: `Participant added to Project ${project?.project_name} successfully.`
    }
  },

  // deleteProjectPack: async (parent: undefined, args: { email: string, projectName: string, participants: string[] }, context: { token: string | undefined, req: IncomingMessage }, info: any) => {
  // },
};