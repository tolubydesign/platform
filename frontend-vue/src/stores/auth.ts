import { ref, type Ref, } from 'vue'
import { defineStore } from 'pinia'
import axios, { AxiosError, type AxiosResponse } from 'axios';
import { getLoginInformation, setLoginInformation } from '@/helpers/auth/login-auth';
import { endpoint, Headers } from '@/models/graphql.model';
import type { AccountDetail, CreateAccountDetail } from '@/models/account.model';
import { addAccountMutation, generateNewUserTokenQuery, getAccountDetailQuery, getAllUserAccountsQuery, updateAccountDetailMutation, updateAccountPasswordMutation } from '@/helpers/http/graphql-request';

export const useAuthenticationStore = defineStore('auth', () => {
  const { token } = getLoginInformation();
  // Authentication and log in 
  const authErrorResp: Ref<string | undefined> = ref(undefined);
  const authLoader: Ref<boolean> = ref(false);

  // Password related
  const passErrorResp: Ref<string | undefined> = ref(undefined);
  const passLoader: Ref<boolean> = ref(false);

  // Account related
  const accountLoader: Ref<boolean> = ref(false);
  const accountErrorResp: Ref<string | undefined> = ref(undefined);
  const accountDetail: Ref<AccountDetail | undefined> = ref(undefined);

  // Username related 
  const usersLoader: Ref<boolean> = ref(false);
  const usersErrorResp: Ref<string | undefined> = ref(undefined);
  const usersList: Ref<AccountDetail[] | undefined> = ref([]);

  /**
   * @description Get user information. Like username, account type etc
   * @param { string } accountEmail 
   * @returns {Promise<AxiosResponse<any, any>>} axios
   * @example
   * import { useAuthenticationStore } from '@/stores/auth'
   * const authenticationStore = useAuthenticationStore()
   * const { fetchAccountDetails } = authenticationStore;
   * fetchAccountDetails()
   */
  async function fetchAccountDetails(accountEmail: string): Promise<AxiosResponse<any, any> | AxiosError<any, any>> {
    const { token } = getLoginInformation();
    authLoader.value = true
    authErrorResp.value = "";

    const graphqlQuery = getAccountDetailQuery({ accountEmail });

    return axios({
      url: endpoint,
      method: 'POST',
      headers: Headers(token),
      data: graphqlQuery
    })
      .then((response: AxiosResponse<any, any>) => {
        if (
          response.data.data &&
          response.data.data[graphqlQuery.operationName]
        ) {
          accountDetail.value = response.data.data[graphqlQuery.operationName];
        }

        if (response.data.errors) {
          console.error(response.data.errors[0].message)
          authErrorResp.value = response.data.errors[0].message
        }

        return response;
      })
      .catch((error: AxiosError<any, any>) => {
        authErrorResp.value = error.message
        return error;
      }).finally(() => {
        authLoader.value = false
      });
  };

  /**
   * @description Update account details. This will only update `username`, `phone`, `user_group`
   * @param {string} accountEmail
   * @param {string} accountUsername
   * @param {string} accountNumber
   * @param {string} accountGroup
   * @returns { Promise<AxiosResponse<any, any>> } axios
   */
  async function updateAccountDetail(accountEmail: string, accountUsername: string, accountNumber: string, accountGroup: string): Promise<AxiosResponse<any, any> | AxiosError<any, any>> {
    authLoader.value = true;
    authErrorResp.value = "";

    const graphqlQuery = updateAccountDetailMutation({
      accountEmail, accountUsername, accountNumber, accountGroup
    })

    return axios({
      url: endpoint,
      method: 'POST',
      headers: Headers(token),
      data: graphqlQuery
    })
      .then((response: AxiosResponse<any, any>) => {
        fetchAccountDetails(accountEmail);
        fetchUserCredentials(accountEmail);

        if (response.data.errors) {
          authErrorResp.value = response.data.errors[0].message
        }

        return response;
      })
      .catch((error: AxiosError<any, any>) => {
        authErrorResp.value = error.message;
        return error
      }).finally(() => {
        authLoader.value = false
      });
  }

  async function fetchUserCredentials(accountEmail: string) {
    authLoader.value = true;
    authErrorResp.value = "";

    const graphqlQuery = generateNewUserTokenQuery({ accountEmail })

    return axios({
      url: endpoint,
      method: 'POST',
      headers: Headers(token),
      data: graphqlQuery
    })
      .then((response: AxiosResponse<any, any>) => {
        const user = response.data.data[graphqlQuery.operationName];

        if (response.data.errors) {
          passErrorResp.value = response.data.errors[0].message
        }

        setLoginInformation(user)
        return response;
      })
      .catch((error: AxiosError<any, any>) => {
        passErrorResp.value = error.message
        return error
      }).finally(() => {
        authLoader.value = false
      });
  }


  /**
   * @description Update user password
   * @returns { Promise<AxiosResponse<any, any>> } axios
   */
  async function updateAccountPassword(accountEmail: string, currentPassword: string, newPassword: string): Promise<AxiosResponse<any, any> | AxiosError<any, any>> {
    passLoader.value = true
    passErrorResp.value = "";

    const graphqlQuery = updateAccountPasswordMutation({ accountEmail, currentPassword, newPassword })

    return axios({
      url: endpoint,
      method: 'POST',
      headers: Headers(token),
      data: graphqlQuery
    })
      .then((response: AxiosResponse<any, any>) => {
        if (response?.data?.errors && response.data.errors[0]) {
          passErrorResp.value = response.data.errors[0].message
        }
        return response;
      })
      .catch((error: AxiosError<any, any>) => {
        passErrorResp.value = error.message
        return error
      }).finally(() => {
        passLoader.value = false
      });
  }

  async function createAccount(creatorEmail: string, account: CreateAccountDetail) {
    accountLoader.value = true;
    accountErrorResp.value = undefined;

    const graphqlQuery = addAccountMutation({ creatorEmail, account })

    return axios({
      url: endpoint,
      method: 'POST',
      headers: Headers(token),
      data: graphqlQuery
    })
      .then((response: AxiosResponse<any, any>) => {
        if (response.data.errors) {
          accountErrorResp.value = response.data.errors[0].message
        }

        return response;
      })
      .catch((error: AxiosError<any, any>) => {
        accountErrorResp.value = error.message;
        return error
      }).finally(() => {
        accountLoader.value = false
      });
  }

  /**
   * @description Fetch a full list of user. Utilise this list to select a individual users.
   * @param email 
   * @returns 
   */
  async function getListOfUsers(email: string): Promise<AxiosResponse<any, any> | AxiosError<any, any>> {
    usersLoader.value = true;
    usersErrorResp.value = undefined;

    const graphqlQuery = getAllUserAccountsQuery({ email });

    return axios({
      url: endpoint,
      method: 'POST',
      headers: Headers(token),
      data: graphqlQuery
    })
      .then((response: AxiosResponse<any, any>) => {
        if (response.data.errors) {
          usersErrorResp.value = response.data.errors[0].message
        }

        if (response?.data?.data?.[graphqlQuery.operationName]) usersList.value = response.data.data[graphqlQuery.operationName];
        return response;
      })
      .catch((error: AxiosError<any, any>) => {
        usersErrorResp.value = error.message;
        return error
      }).finally(() => {
        usersLoader.value = false
      });
  }


  return {
    fetchAccountDetails,
    updateAccountPassword,
    updateAccountDetail,
    createAccount,
    getListOfUsers,

    authErrorResp,
    authLoader,
    accountDetail,

    passErrorResp,
    passLoader,

    accountLoader,
    accountErrorResp,

    usersLoader,
    usersErrorResp,
    usersList,
  }
})
