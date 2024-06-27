import { Account } from "@prisma/client";

export type AccountCreation = {
  email: string,
  username: string,
  password: string,
  phone: string,
  user_group: string,
  account_type: "user" | "admin"
}

export type BasicAccountLoginArgs = {
  email: string;
  password?: string;
};

// NOTE: To to happy about how I named this. Any suggestions or improvements would be appreciated. 
export interface ValidUser extends Partial<Account> { 
  error: boolean;
  errorMessage: string; 
  codeName: string;
}

export type InvalidUserResponse = {
  error: boolean
}

export interface ValidAdminUser extends Partial<Account> {
  error: boolean;
  errorMessage: string;
  codeName: string;
}

export type LoggedIn = {
  email: string,
  token: string,
  timestamp: Date
}
