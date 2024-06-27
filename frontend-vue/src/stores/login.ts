import { ref, type Ref } from "vue";
import { defineStore } from "pinia";
import axios, { AxiosError, type AxiosResponse } from "axios";
import { endpoint, Headers } from "@/models/graphql.model";
import { userSignInQuery } from "@/helpers/http/graphql-request";

export const useLoginStore = defineStore("login", () => {
  const loginErrorRes: Ref<string | undefined> = ref(undefined);
  const loginLoader: Ref<boolean> = ref(false);

  /**
   * @description Submit form to back-end
   * @param {string} email
   * @param {string} password
   */
  async function userLogin(
    email: string,
    password: string
  ): Promise<AxiosResponse<any, any> | AxiosError<any, any>> {
    loginErrorRes.value = undefined;
    loginLoader.value = true;

    const graphqlQuery = userSignInQuery({ email, password });
    console.log('user login fn, graphqlQuery', graphqlQuery);
    console.log('user login fn, endpoint', endpoint);
    // Make request to database
    return axios({
      url: endpoint,
      method: "POST",
      headers: Headers(),
      data: graphqlQuery,
    })
      .then((response: AxiosResponse<any, any>) => {
        if (response.data.errors)
          loginErrorRes.value = response.data.errors[0].message;

        return response;
      })
      .catch((error: AxiosError<any, any>) => {
        loginErrorRes.value = error.message;
        return error;
      })
      .finally(() => {
        loginLoader.value = false;
      });
  }

  return {
    userLogin,

    loginErrorRes,
    loginLoader,
  };
});
