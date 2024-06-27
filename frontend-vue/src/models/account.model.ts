export type AccountDetail = {
  username: string,
  account_type: string,
  user_group: string,
  email: string,
  phone: string
}

export type CreateAccountDetail = {
  username: string,
  account_type: string,
  user_group: string,
  email: string,
  phone: string
  password: string,
}

export type LoginInformation = {
  token: string,
  username: string,
  email: string,
  account_type: string
}
