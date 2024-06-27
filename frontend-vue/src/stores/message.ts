import { ref, type Ref, } from 'vue'
import { defineStore } from 'pinia'
import { getLoginInformation } from '@/helpers/auth/login-auth';
import { endpoint, Headers } from '@/models/graphql.model';
import axios, { AxiosError, type AxiosResponse } from 'axios';
import type { ChannelResponse } from './chat';
import { createMessageMutation, fetchChannelMessagesQuery } from '@/helpers/http/graphql-request';

type ChatMessage = { id: number, username: string, createdAt: string, user_email: string, channel_id: number, message: string }

export const useMessageStore = defineStore('message', () => {
  const messageErrorResp: Ref<string | undefined> = ref(undefined);
  const messageLoader: Ref<boolean> = ref(true);
  const messages: Ref<ChatMessage[]> = ref([])
  const { token, username, email } = getLoginInformation();

  /**
   * @description Fetch all messages related to the selected Chat Channel.
   * @returns {Promise<AxiosResponse<any, any>>} axios
   */
  async function fetchMessages(pageRoute: string): Promise<AxiosResponse<any, any> | void> {
    messageLoader.value = false
    messageErrorResp.value = "";

    const graphqlQuery = fetchChannelMessagesQuery({ pageRoute })

    return axios({
      url: endpoint,
      method: 'POST',
      headers: Headers(token),
      data: graphqlQuery
    })
      .then((response: AxiosResponse<any, any>) => {
        messages.value = response.data?.data?.fetchChannelMessages

        if (response?.data?.errors && response.data.errors[0]) {
          messageErrorResp.value = response.data.errors[0].message
        }
        return response;
      })
      .catch((error: AxiosError<any, any>) => {
        messageErrorResp.value = error.message;
      }).finally(() => {
        messageLoader.value = false
      });
  }

  /**
   * @description Send message to back-end
   * @param { string } pageRoute 
   * @param { string } message 
   * @param currentChannel 
   * @returns {Promise<AxiosResponse<any, any> | AxiosError>} axios
   */
  async function sendMessage(pageRoute: string, message: string, currentChannel: ChannelResponse): Promise<AxiosResponse | AxiosError> {
    messageLoader.value = true
    messageErrorResp.value = "";

    const graphqlQuery = createMessageMutation({
      channelId: currentChannel.id,
      email,
      message,
      username
    })

    return axios({
      url: endpoint,
      method: 'POST',
      headers: Headers(token),
      data: graphqlQuery
    })
      .then((response: AxiosResponse<any, any>) => {
        if (response.data.errors) {
          console.error(response.data.errors[0].message)
          messageErrorResp.value = response.data.errors[0].message
        }

        fetchMessages(pageRoute);
        return response
      })
      .catch((error: AxiosError<any, any>) => {
        messageErrorResp.value = error.message
        return error;
      }).finally(() => {
        messageLoader.value = false
      });
  }

  return {
    fetchMessages,
    sendMessage,
    messageErrorResp,
    messageLoader,
    messages,
  }
})
