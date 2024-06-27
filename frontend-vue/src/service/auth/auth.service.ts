import { verifyUserRequest } from "@/helpers/http/graphql-request";
import { Headers } from "@/models/graphql.model";
import type { AxiosResponse, AxiosError } from "axios";
import axios from "axios";
const ENVEndpoint = import.meta.env.VITE_GRAPHQL_API_ENDPOINT;

/**
 * @description Verify that user has a valid authentication token.
 * @param token 
 * @returns 
 */
export async function verifyUserAuthentication(token: string, email: string): Promise<AxiosResponse | AxiosError> {
  const endpoint = ENVEndpoint ?? "";
  const graphqlQuery = verifyUserRequest(email);

  return axios({
    url: endpoint,
    method: 'POST',
    headers: Headers(token),
    data: graphqlQuery
  }).then((response: AxiosResponse) => {
    if (
      response.data.data &&
      response.data.data.verifyUser
    ) {
      // Success!! We got the user's status
      console.info('Account verification successful.');
    }

    if (
      !response.data.data.verifyUser ||
      !response.data.data.verifyUser?.verified
    ) console.error("Validation Error: User not verified.");

    if (response.data.errors) {
      // Error handling
      console.error(response.data.errors[0].message);
    }

    return response;
  })
    .catch((error: AxiosError) => {
      return error;
    });
}
