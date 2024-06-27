<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useAuthenticationStore } from '@/stores/auth';
import { isRequired } from "@/helpers/form/validation";
import { storeToRefs } from 'pinia';
import { getLoginInformation } from '@/helpers/auth/login-auth';
import { useChatStore } from "@/stores/chat";
import type { AxiosResponse } from 'axios';

const panelOpen: Ref<boolean> = ref(false);

// Store (Authentication)
const authenticationStore = useAuthenticationStore()
const { authLoader, accountDetail } = storeToRefs(authenticationStore)
// Store (Chat)
const chatStore = useChatStore();
const { channelCreationErrorRes, channelCreationLoader } = storeToRefs(chatStore)
const { createChatChannel } = chatStore
const creatorAccount: Ref<any> = ref(accountDetail)

// Store
const { fetchAccountDetails } = authenticationStore;
const { email } = getLoginInformation();

// Class Names 
const formInputClassName = "mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-base px-3 py-1";
const actionButtonClassName = `
  inline-flex justify-center 
  text-sm text-white font-medium
  rounded-md shadow-sm
  py-2 px-4 mx-3
  border border-transparent
  bg-indigo-600 hover:bg-indigo-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2  
`;
const errorResponseClassName = "block w-full text-red-400 text- sm:text-sm mt-2";
const formLabelClassName = "block text-sm font-medium text-gray-700";

onMounted(() => {
  fetchAccountDetails(email);
})

/**
 * @description Submit form, password change, to back-end.
 * @param { SubmissionHandler<GenericFormValues | FormFields, unknown> | undefined } values
 * @returns { Promise<AxiosResponse<any, any>> } axios 
 */
async function onSubmit(values: any | { channel: string }, args: { resetForm: any }): Promise<AxiosResponse<any, any>> {
  return createChatChannel(values.channel, email)
    .then((response: any) => {
      if (!response?.data?.errors) {
        args.resetForm()
        panelOpen.value = false;
      };

      return response
    });
}

/**
 * @description Show or hide the panel, based on the parameter provided.
 * @param { boolean } state 
 */
function setPanelState(state: boolean) {
  panelOpen.value = state;
}

</script>

<template>
  <div data-component="Create Channel Component" class="flex flex-col my-6"
    v-if="creatorAccount?.account_type === 'admin'">
    <div v-if="panelOpen" class="shadow-md sm:rounded-md bg-white px-4 py-5 sm:p-6 w-full">

      <div class="px-4 py-3 text-right sm:px-6 mt-6">
        <button :class="actionButtonClassName" @click="setPanelState(false)">
          Cancel
        </button>
      </div>

      <Form v-slot="{ meta }" @submit="onSubmit" class="">
        <div class="grid gap-6">

          <div class="col-span-1">
            <label for="channel" :class="formLabelClassName">Channel Name</label>
            <Field label="text" :class="`${formInputClassName}`" name="channel" type="text" :rules="isRequired"
              aria-placeholder="Channel Name" aria-autocomplete="off" autocomplete="off" :validateOnChange="true"
              :validateOnInput="true" />
            <ErrorMessage name="channel" :class="errorResponseClassName" />
          </div>

        </div>

        <div v-if="channelCreationErrorRes" class="my-3">
          <p class="text-sm text-red-300 font-semibold">{{ channelCreationErrorRes }}</p>
        </div>

        <div class="bg-gray-50 px-4 py-3 text-right sm:px-6 mt-6">
          <button type="submit" :class="`${actionButtonClassName} disabled:bg-gray-600 bg-indigo-600`"
            :disabled="authLoader || channelCreationLoader || !meta.valid && meta.touched">
            {{ (authLoader || channelCreationLoader) ? "loading" : "Create" }}
          </button>
        </div>
      </Form>
    </div>

    <div v-else class="">
      <button :class="`${actionButtonClassName}`" @click="setPanelState(true)">
        Create Chat Channel
      </button>
    </div>
  </div>
</template>

<style lang="scss">

</style>
