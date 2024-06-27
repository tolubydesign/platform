import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import axios, { AxiosError, type AxiosResponse } from 'axios';
import { getLoginInformation } from '@/helpers/auth/login-auth';
import { endpoint, Headers } from '@/models/graphql.model';
import { createChatChannelMutation, findAccountByIdQuery, getAllChatChannelsQuery, getChatChannelQuery, getRecentChatChannelsQuery } from '@/helpers/http/graphql-request.js';


export type ChannelResponse = {
  creator_id: string,
  id: number,
  name: string
}

export const useChatStore = defineStore('chats', () => {

  const chatChannels: Ref<ChannelResponse[]> = ref([]);
  const loading: Ref<boolean> = ref(true);
  const channelErrorRes: Ref<string | undefined> = ref(undefined);
  const currentChannel: Ref<ChannelResponse | undefined> = ref(undefined);

  // Recent chats
  const recentChatsLoader: Ref<boolean> = ref(false);
  const recentChatsErrorRes: Ref<string | undefined> = ref(undefined);
  const recentChats: Ref<ChannelResponse[]> = ref([]);

  // Loader isn't called on initialisation of component
  const channelCreationLoader: Ref<boolean> = ref(false);
  const channelCreationErrorRes: Ref<string | undefined> = ref(undefined);

  const { token } = getLoginInformation()

  /**
   * @description Fetch all Chat Channels
   * @returns {Promise<AxiosResponse<any, any>>} axios
   */
  async function fetchChannels(): Promise<AxiosResponse<any, any> | AxiosError<any, any>> {
    channelErrorRes.value = undefined;
    loading.value = true;

    const graphqlQuery = getAllChatChannelsQuery

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
          chatChannels.value = response.data.data[graphqlQuery.operationName];
        }

        if (response.data.errors) {
          console.error(response.data.errors[0].message)
          channelErrorRes.value = response.data.errors[0].message
        }

        return response;
      })
      .catch((error: AxiosError<any, any>) => {
        channelErrorRes.value = error.message
        return error;
      }).finally(() => {
        loading.value = false;
      });
  }

  /**
   * @description Getting information on a single chat channel/group
   * @param {string} channelName 
   * @returns { Promise<AxiosResponse<any, any> | AxiosError<any, any>> } axios
   */
  async function fetchSingleChannel(channelName: string): Promise<AxiosResponse<any, any> | AxiosError<any, any>> {
    channelErrorRes.value = undefined;
    loading.value = true;

    const graphqlQuery = getChatChannelQuery({ channelName });

    return axios({
      url: endpoint,
      method: 'POST',
      headers: Headers(token),
      data: graphqlQuery
    })
      .then((response: AxiosResponse<any, any>) => {

        if (response.data?.errors) {
          channelErrorRes.value = response.data.errors[0]
          return response
        }

        currentChannel.value = response?.data?.data?.[graphqlQuery.operationName];
        return response;
      })
      .catch((error: AxiosError<any, any>) => {
        channelErrorRes.value = error.message
        return error;
      }).finally(() => {
        loading.value = false;
      });
  }

  /**
   * @description Request for creating a chat channel. Only admin users can do this
   * @param channelName 
   * @param creatorEmail
   * @returns {Promise<AxiosResponse<any, any> | AxiosError<any, any>>} axios
   */
  async function createChatChannel(channelName: string, creatorEmail: string): Promise<AxiosResponse<any, any> | AxiosError<any, any>> {
    channelCreationErrorRes.value = undefined;
    channelCreationLoader.value = true;

    const graphqlQuery = createChatChannelMutation({
      channelName, creatorEmail
    })

    return axios({
      url: endpoint,
      method: 'POST',
      headers: Headers(token),
      data: graphqlQuery
    })
      .then((response: AxiosResponse<any, any>) => {
        if (response.data?.errors) channelCreationErrorRes.value = response.data.errors[0]
        fetchChannels()
        return response;
      })
      .catch((error: AxiosError<any, any>) => {
        channelCreationErrorRes.value = error.message;
        return error;
      }).finally(() => {
        channelCreationLoader.value = false;
      });
  }

  /**
   * @description Fetch 3 recent chats channels.
   */
  async function getRecentChatChannels() {
    recentChatsLoader.value = true
    recentChatsErrorRes.value = undefined;
    const { token } = getLoginInformation()

    const graphqlQuery = getRecentChatChannelsQuery

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
          recentChats.value = response.data.data[graphqlQuery.operationName];
        }

        if (response.data.errors) {
          console.error(response.data.errors[0].message)
          recentChatsErrorRes.value = response.data.errors[0].message
        }

        return response
      })
      .catch((error: AxiosError<any, any>) => {
        recentChatsErrorRes.value = error.message
        return error
      }).finally(() => {
        recentChatsLoader.value = false
      });
  }

  /**
   * @description Get the channel creator's account information 
   * @param id 
   * @returns 
   */
  async function getChatCreator(id: string) {
    const { token, email } = getLoginInformation();

    const graphqlQuery = findAccountByIdQuery({ email, id })

    return axios({
      url: endpoint,
      method: 'POST',
      headers: Headers(token),
      data: graphqlQuery
    })
  }

  return {
    fetchChannels,
    fetchSingleChannel,
    createChatChannel,
    getRecentChatChannels,
    getChatCreator,

    loading,
    chatChannels,
    channelErrorRes,
    currentChannel,
    channelCreationErrorRes,
    channelCreationLoader,

    recentChatsLoader,
    recentChats,
    recentChatsErrorRes
  }
})
