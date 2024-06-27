import type { LoginInformation } from "@/models/account.model";

const localStorageNames = {
  user: "user",
  username: "username",
  email: "email",
  account_type: "account_type"
}

/**
 * @description Set user information to localStorage
 * @param {LoginInformation} user 
 * @returns 
 */
export function setLoginInformation(user: LoginInformation) {
  localStorage.setItem(localStorageNames.user, user.token);
  localStorage.setItem(localStorageNames.username, user.username)
  localStorage.setItem(localStorageNames.email, user.email)
  localStorage.setItem(localStorageNames.account_type, user.account_type)
}

/**
 * @description Remove previously set user localStorage information.
 * @returns 
 */
export function removeLoginInformation() {
  localStorage.removeItem(localStorageNames.user);
  localStorage.removeItem(localStorageNames.username);
  localStorage.removeItem(localStorageNames.email);
  localStorage.removeItem(localStorageNames.account_type);
  return
}

/**
 * @description Get user account information. Stored in local Storage.
 * @returns { LoginInformation } login information
 */
export function getLoginInformation(): LoginInformation {
  const token = localStorage.getItem(localStorageNames.user);
  const username = localStorage.getItem(localStorageNames.username);
  const email = localStorage.getItem(localStorageNames.email);
  const account_type = localStorage.getItem(localStorageNames.account_type);

  return {
    token: token ? token : "",
    username: username ? username : "",
    email: email ? email : "",
    account_type: account_type ? account_type : "",
  }
}