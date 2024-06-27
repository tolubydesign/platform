import type { CreateAccountDetail } from "@/models/account.model";
import type { QueryReturn } from "@/models/graphql.model";

// ACCOUNT
export const verifyUserRequest = (email: string): QueryReturn => {
  return {
    operationName: "verifyUser",
    query: `query verifyUser($email: String!) {
      verifyUser(email: $email) {
        verified
        username
        email
        account_type
      }
    }`,
    variables: {
      "email": email
    }
  }
}

export const getAccountDetailQuery = ({ accountEmail }: { accountEmail: string }): QueryReturn => {
  return {
    operationName: "getAccountDetail",
    query: `
      query getAccountDetail($email: String!) {
        getAccountDetail(email: $email) {
          username
          account_type
          user_group
          email
          phone
        }
      }
    `,
    variables: {
      "email": accountEmail,
    }
  };
}

export const updateAccountDetailMutation = ({
  accountEmail, accountUsername, accountNumber, accountGroup
}: {
  accountEmail: string, accountUsername: string, accountNumber: string, accountGroup: string
}): QueryReturn => {
  return {
    operationName: "updateAccountDetail",
    query: `
      mutation updateAccountDetail($email: String, $username: String, $phone: String, $user_group: String) {
        updateAccountDetail(email: $email, username: $username, phone: $phone, user_group: $user_group) {
          code
          success
          message
        }
      }
    `,
    variables: {
      "email": accountEmail,
      "username": accountUsername,
      "phone": accountNumber,
      "user_group": accountGroup
    }
  }
};

export const generateNewUserTokenQuery = ({ accountEmail }: { accountEmail: string }): QueryReturn => {
  return {
    operationName: "generateNewUserToken",
    query: `
      query generateNewUserToken($email: String!) {
        generateNewUserToken(email: $email) {
          token
          username
          email
          account_type
          user_group
          phone
          user_id
        }
      }
    `,
    variables: {
      "email": accountEmail,
    }
  };
}

export const updateAccountPasswordMutation = (
  { accountEmail, currentPassword, newPassword }: { accountEmail: string, currentPassword: string, newPassword: string }
): QueryReturn => {
  return {
    operationName: "updateAccountPassword",
    query: `
      mutation updateAccountPassword($email: String, $currentPassword: String, $newPassword: String) {
        updateAccountPassword(email: $email, currentPassword: $currentPassword, newPassword: $newPassword) {
          code
          success
          message
        }
      }
    `,
    variables: {
      "email": accountEmail,
      "currentPassword": currentPassword,
      "newPassword": newPassword
    }
  };
}

export const addAccountMutation = (
  { creatorEmail, account }: { creatorEmail: string, account: CreateAccountDetail }
): QueryReturn => {
  return {
    operationName: "addAccount",
    query: `
      mutation addAccount($email: String!, $account: AccountCreation!) {
        addAccount(email: $email, account: $account) {
          success
          code
          message
        }
      }
    `,
    variables: {
      "email": creatorEmail,
      "account": {
        "account_type": account.account_type,
        "email": account.email,
        "phone": account.phone,
        "user_group": "",
        "username": account.username,
        "password": account.password
      },
    }
  };
}

export const getAllUserAccountsQuery = (
  { email }: { email: string }
): QueryReturn => {
  return {
    operationName: "getAllUserAccounts",
    query: `
      query getAllUserAccounts($email: String!) {
        getAllUserAccounts(email: $email) {
          username
          account_type
          email
        }
      }
    `,
    variables: {
      "email": email,
    }
  };
}

export const userSignInQuery = (
  { email, password }: { email: string, password: string }
): QueryReturn => {
  return {
    operationName: "userSignIn",
    query: `query userSignIn($password: String!, $email: String!) {
        userSignIn(password: $password, email: $email) {
          token
          email
          username
          account_type
        }
      }
    `,
    "variables": {
      "email": email,
      "password": password
    }
  };
}

// ****************************
// MESSAGES
export const fetchChannelMessagesQuery = (
  { pageRoute }: { pageRoute: string }
): QueryReturn => {
  return {
    operationName: "fetchChannelMessages",
    query: `
      query fetchChannelMessages($channelName: String!) {
        fetchChannelMessages(channelName: $channelName) {
          id
          username
          createdAt
          user_email
          channel_id
          message
        }
      }
    `,
    variables: {
      "channelName": pageRoute
    }
  };
}

export const createMessageMutation = (
  { username, channelId, message, email }: { username: string, channelId: number, message: string, email: string }
): QueryReturn => {
  return {
    operationName: "createMessage",
    query: `
      mutation createMessage($username: String!, $channelId: Int!, $message: String!, $email: String!) {
        createMessage(username: $username, channel_id: $channelId, message: $message, user_email: $email) {
          code
          success
          message
        }
      }
    `,
    variables: {
      "username": username,
      "channelId": channelId,
      "message": message,
      "email": email,
    }
  };
}

// ****************************
// FILES
export const listProjectPacksQuery = ({ email }: { email: string }): QueryReturn => {
  return {
    operationName: "listProjectPacks",
    query: `
      query listProjectPacks($email: String!) {
        listProjectPacks(email: $email) {
          id
          project_name
          creator_email
          createdAt
          participants
          files {
            serverFileName
            uploadedFileName
            mimetype
            encoding
            uploadedAt
            project_id
            creator
          }
        }
      }
      `,
    variables: {
      "email": email,
    }
  }
}

export const createProjectPackMutation = ({
  email, projectName, participants
}: {
  email: string,
  projectName: string,
  participants: string[]
}): QueryReturn => {
  return {
    operationName: "createProjectPack",
    query: `
      mutation createProjectPack($email: String!, $projectName: String!, $participants: [String]) {
        createProjectPack(email: $email, projectName: $projectName, participants: $participants) {
          code
          success
          message
        }
      }
    `,
    variables: {
      "email": email,
      "projectName": projectName,
      "participants": participants
    }
  };
}

export const getProjectFilesQuery = ({ email, packName }: { email: string, packName: string }): QueryReturn => {
  return {
    operationName: "getProjectFiles",
    query: `
      query getProjectFiles($packName: String!, $email: String!) {
        getProjectFiles(packName: $packName, email: $email) {
          serverFileName
          encoding
          uploadedFileName
          mimetype
          uploadedAt
          creator
          project_id
        }
      }
    `,
    variables: {
      "email": email,
      "packName": packName,
    }
  };
}

export const fetchProjectPackQuery = ({ email, packName }: { email: string, packName: string }): QueryReturn => {
  return {
    operationName: "getProject",
    query: `
      query getProject($packName: String!, $email: String) {
        getProject(packName: $packName, email: $email) {
          id
          project_name
          creator_email
          createdAt
          participants
          files {
            serverFileName
            uploadedFileName
            mimetype
            encoding
            uploadedAt
            project_id
            creator
          }
        }
      }
    `,
    variables: {
      "email": email,
      "packName": packName,
    }
  };
}

export const fetchAllFilesQuery = ({email}: {email: string}): QueryReturn => {
  return {
    operationName: "getAllFiles",
    query: `
      query getAllFiles($email: String!) {
        getAllFiles(email: $email) {
          serverFileName
          uploadedFileName
          mimetype
          encoding
          project_id
          uploadedAt
          creator
        }
      }
    `,
    variables: {
      "email": email,
    }
  };
}

export const getRecentFilesQuery = ({email}: {email: string}): QueryReturn => {
  return {
    operationName: "getRecentFiles",
    query: `
      query getRecentFiles($email: String!) {
        getRecentFiles(email: $email) {
          serverFileName
          uploadedFileName
          mimetype
          uploadedAt
          encoding
          project_id
          creator
        }
      }
    `,
    variables: {
      "email": email,
    }
  }
}

// ****************************
// CHAT
export const getAllChatChannelsQuery: QueryReturn = {
  operationName: "getAllChatChannels",
  query: `query getAllChatChannels {
    getAllChatChannels {
      id
      name
      creator_id
    }
  }
  `,
  variables: {}
};

export const getChatChannelQuery = ({channelName}: {channelName: string}): QueryReturn => {
  return {
    operationName: "getChatChannel",
    query: `query GetChatChannel($channelName: String!) {
        getChatChannel(channelName: $channelName) {
          id
          name
          creator_id
        }
      }
    `,
    variables: {
      "channelName": channelName,
    }
  };
}

export const createChatChannelMutation = ({ channelName, creatorEmail }: { channelName: string, creatorEmail: string }): QueryReturn => {
  return {
    operationName: "createChatChannel",
    query: `
      mutation createChatChannel($channelName: String!, $creatorEmail: String!) {
        createChatChannel(channelName: $channelName, creatorEmail: $creatorEmail) {
          code
          success
          message
        }
      }
    `,
    variables: {
      "channelName": channelName,
      "creatorEmail": creatorEmail
    }
  };
}

export const getRecentChatChannelsQuery: QueryReturn = {
  operationName: "getRecentChatChannels",
  query: `query getRecentChatChannels { getRecentChatChannels { id name creator_id} }`,
  variables: {}
};

export const findAccountByIdQuery = ({ id, email }: { id: string, email: string }): QueryReturn => {
  return {
    operationName: "findAccountById",
    query: `
      query findAccountById($email: String!, $searchingId: String!) {
        findAccountById(email: $email, searchingId: $searchingId) {
          email
          username
        }
      }
    `,
    variables: {
      "email": email,
      "searchingId": id
    }
  };
}
