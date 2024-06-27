import { ref, type Ref, } from 'vue'
import { defineStore } from 'pinia'
import axios, { AxiosError, type AxiosResponse } from 'axios';
import { getLoginInformation } from '@/helpers/auth/login-auth';
import { endpoint, Headers } from '@/models/graphql.model';
import type { TFile, TProject } from '@/models/file.model';
import { createProjectPackMutation, fetchAllFilesQuery, fetchProjectPackQuery, getRecentFilesQuery, getProjectFilesQuery, listProjectPacksQuery } from '@/helpers/http/graphql-request';

export const useFileStore = defineStore('file', () => {
  const { token } = getLoginInformation();

  const filesList: Ref<TFile[]> = ref([]);
  const projectPacksList: Ref<TProject[]> = ref([]);
  const selectedProjectPack: Ref<TProject | undefined> = ref(undefined);
  const selectedProjectPackFiles: Ref<TFile[]> = ref([]);

  // Requests
  // Files
  const filesErrorResp: Ref<string | undefined> = ref(undefined);
  const filesLoader: Ref<boolean> = ref(false);
  // Projects
  const projectErrorResp: Ref<string | undefined> = ref(undefined);
  const projectLoader: Ref<boolean> = ref(false);

  /**
   * @description Get a collection of files. 
   * @param { string } email 
   * @returns {Promise<AxiosResponse<any, any>>} axios
   * @example
   * import { useFileStore } from '@/stores/auth'
   * const fileStore = useFileStore()
   * const { fetchRecentFiles } = fileStore;
   * fetchRecentFiles()
   */
  async function fetchRecentFiles(email: string): Promise<AxiosResponse<any, any> | AxiosError<any, any>> {
    filesLoader.value = true
    filesErrorResp.value = "";

    const graphqlQuery = getRecentFilesQuery({email})

    return axios({
      url: endpoint,
      method: 'POST',
      headers: Headers(token),
      data: graphqlQuery
    })
      .then((response: AxiosResponse<any, any>) => {
        filesList.value = response?.data?.data?.[graphqlQuery.operationName];

        if (response?.data?.errors && response.data.errors[0]) {
          filesErrorResp.value = response.data.errors[0].message
        }

        return response;
      })
      .catch((error: AxiosError<any, any>) => {
        filesErrorResp.value = error.message
        return error;
      })
      .finally(() => filesLoader.value = false);
  };

  /**
   * @description Get All files. 
   * @param { string } email 
   * @returns {Promise<AxiosResponse<any, any>>} axios
   */
  async function fetchAllFiles(email: string): Promise<AxiosResponse<any, any> | AxiosError<any, any>> {
    filesLoader.value = true
    filesErrorResp.value = "";

    const graphqlQuery = fetchAllFilesQuery({ email })

    return axios({
      url: endpoint,
      method: 'POST',
      headers: Headers(token),
      data: graphqlQuery
    })
      .then((response: AxiosResponse<any, any>) => {
        if (response.data.errors) {
          console.error(response.data.errors[0].message)
          filesErrorResp.value = response.data.errors[0].message;
        };

        if (response?.data?.data?.[graphqlQuery.operationName]) filesList.value = response.data.data[graphqlQuery.operationName];

        return response;
      })
      .catch((error: AxiosError<any, any>) => {
        filesErrorResp.value = error.message
        return error;
      })
      .finally(() => filesLoader.value = false);
  }

  // Project Related 

  /**
   * @description Fetch a basic list of Project Packs 
   * @param email 
   * @returns 
   */
  async function fetchProjects(email: string): Promise<AxiosResponse<any, any> | AxiosError<any, any> | Error> {
    projectLoader.value = true
    projectErrorResp.value = undefined;

    const graphqlQuery = listProjectPacksQuery({ email });

    return axios({
      url: endpoint,
      method: 'POST',
      headers: Headers(token),
      data: graphqlQuery
    })
      .then((response: AxiosResponse<any, any>) => {
        if (response.data.errors) {
          console.error(response.data.errors[0].message)
          projectErrorResp.value = response.data.errors[0].message;
        };

        if (response?.data?.data?.[graphqlQuery.operationName]) projectPacksList.value = response.data.data[graphqlQuery.operationName];

        return response;
      })
      .catch((error: AxiosError<any, any>) => {
        projectErrorResp.value = error.message
        console.error(error.message);
        return error;
      })
      .finally(() => projectLoader.value = false);
  }

  /**
   * @description Find the relevant Project Pack
   * @param email 
   * @param packName 
   * @returns 
   */
  async function fetchProjectPack(email: string, packName: string): Promise<AxiosResponse<any, any> | AxiosError<any, any>> {
    projectLoader.value = true
    projectErrorResp.value = undefined;

    const graphqlQuery = fetchProjectPackQuery({ email, packName })

    return axios({
      url: endpoint,
      method: 'POST',
      headers: Headers(token),
      data: graphqlQuery
    })
      .then((response: AxiosResponse<any, any>) => {
        if (
          response.data &&
          response.data.data?.[graphqlQuery.operationName]
        ) {
          selectedProjectPack.value = response.data.data[graphqlQuery.operationName];
          fetchRelatedProjectFiles(email, packName);
        }

        if (response.data.errors) {
          console.error(response.data.errors[0].message)
          projectErrorResp.value = response.data.errors[0].message;
        }

        return response;
      })
      .catch((error: AxiosError<any, any>) => {
        projectErrorResp.value = error.message
        return error;
      })
      .finally(() => projectLoader.value = false);
  }

  /**
   * @description Fetch files related to a specified Project Pack {packName}
   * @param email 
   * @param packName 
   * @returns 
   */
  async function fetchRelatedProjectFiles(email: string, packName: string): Promise<AxiosResponse<any, any> | AxiosError<any, any>> {
    projectLoader.value = true
    projectErrorResp.value = undefined;

    const graphqlQuery = getProjectFilesQuery({ email, packName })

    return axios({
      url: endpoint,
      method: 'POST',
      headers: Headers(token),
      data: graphqlQuery
    })
      .then((response: AxiosResponse<any, any>) => {

        if (
          response.data &&
          response.data.data?.[graphqlQuery.operationName]
        ) {
          selectedProjectPackFiles.value = response.data.data[graphqlQuery.operationName];
        }

        if (response.data.errors) {
          console.error(response.data.errors[0].message)
          projectErrorResp.value = response.data.errors[0].message;
        }

        return response;
      })
      .catch((error: AxiosError<any, any>) => {
        projectErrorResp.value = error.message
        return error;
      })
      .finally(() => projectLoader.value = false);
  }

  async function createProjectPack(email: string, projectName: string, participants: string[]) {
    projectLoader.value = true
    projectErrorResp.value = undefined;
    // Append creator to participants
    // NOTE: implantation should be questioned.
    participants.push(email)

    const graphqlQuery = createProjectPackMutation({ email, projectName, participants })

    return axios({
      url: endpoint,
      method: 'POST',
      headers: Headers(token),
      data: graphqlQuery
    })
      .then((response: AxiosResponse<any, any>) => {
        if (response.data.errors) {
          console.error(response.data.errors[0].message)
          projectErrorResp.value = response.data.errors[0].message
        }

        fetchProjects(email);
        return response;
      })
      .catch((error: AxiosError<any, any>) => {
        filesErrorResp.value = error.message
        return error;
      })
      .finally(() => projectLoader.value = false);
  }

  return {
    fetchRecentFiles,
    fetchAllFiles,
    fetchProjects,
    fetchProjectPack,
    createProjectPack,
    filesList,
    filesErrorResp,
    filesLoader,
    projectPacksList,
    selectedProjectPack,
    selectedProjectPackFiles,
    projectErrorResp,
    projectLoader,
  }
})
