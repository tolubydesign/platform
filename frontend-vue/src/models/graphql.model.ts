import axios, { type AxiosResponse, type AxiosError, type AxiosStatic, type AxiosInstance } from "axios";
import type { RawAxiosRequestHeaders, AxiosHeaders } from 'axios';
export const endpoint = import.meta.env.VITE_GRAPHQL_API_ENDPOINT;
import { v4 as uuidv4 } from 'uuid';

type GraphQLRequestResponse = Promise<AxiosResponse<any, any> | AxiosError<any, any>>;

type HeaderType = ""
type RequestHeaders = RawAxiosRequestHeaders | AxiosHeaders;

type ApolloInstanceRequirements = {
  headers: RequestHeaders,
  endpoint: string,
  graphql?: any
}

export type Query = {
  query: string,
  variables?: any
}

export type Mutation = {
  mutation: string,
  variables?: string
}

export type QueryReturn = {
  operationName: string,
  query: any,
  variables: {
    [key: string]: any
  }
};

/**
 * @description Basic Axios POST request base.
 * @param headers 
 * @param baseUrl 
 * @returns 
 */
export function post({
  headers,
  endpoint,
  graphql
}: ApolloInstanceRequirements) {
  return axios({
    method: 'POST',
    url: endpoint,
    headers: headers,
    data: graphql,
  })
}

/**
 * @description GraphQL request Header
 * @param authToken
 * @param type
 * @returns HTTP Header
 */
export function Headers(authToken?: string, type?: HeaderType): RequestHeaders {

  if (authToken) {
    return {
      "content-type": "application/json",
      "Authorization": `${authToken}`,
      "uuid": uuidv4()
    };
  }

  return {
    "content-type": "application/json",
    "uuid": uuidv4()
  };
}

