<script setup lang="ts">
import { onMounted, ref, type Ref, onBeforeUnmount, watch } from 'vue';
import { useRoute } from "vue-router";
import { Form, Field } from 'vee-validate';
import { useChatStore } from '@/stores/chat';
import { useMessageStore } from '@/stores/message';
import { storeToRefs } from 'pinia';
import type { AxiosResponse } from 'axios';

// Store
const chatStore = useChatStore();
const messageStore = useMessageStore()
const { currentChannel } = storeToRefs(chatStore);
const { messages, messageErrorResp, messageLoader } = storeToRefs(messageStore)
const { fetchSingleChannel } = chatStore;
const { fetchMessages, sendMessage } = messageStore;

const messageTimer: Ref<number | undefined> = ref(undefined)

const route = useRoute();
const pageRoute: Ref<string> = ref("");
const messageGroup: Ref<HTMLDivElement | undefined> = ref(undefined);
const initialMountedScroll: Ref<boolean> = ref(false);

onMounted(() => {
  if (
    route?.params?.id &&
    typeof route.params.id === 'string'
  ) pageRoute.value = route.params.id

  checkCurrentChannel();
  requestMessages();
  messageTimer.value = window.setInterval(() => {
    requestMessages();
  }, 5000);


});

onBeforeUnmount(() => {
  (messageTimer?.value) ? clearTimeout(messageTimer.value) : messageTimer.value = undefined;
})

/**
 * @description Convert ECMAScript epoch and timestamps into Date String
 * @param date 
 */
function formatDate(date: string) {
  return new Date(Number(date)).toUTCString();
}

/**
 * @description Check what channel properties. Channel properties are necessary to send messages to channel
 * @returns
 */
function checkCurrentChannel() {
  if (!currentChannel?.value && typeof route?.params?.id === 'string') fetchSingleChannel(route.params.id);
}

/**
 * @description Request HTTP request to fetch relevant messages. A function intended to be reused.  
 */
async function requestMessages() {
  return fetchMessages(pageRoute.value).then((response: AxiosResponse<any, any> | void) => {
    if (
      !response?.data?.errors &&
      initialMountedScroll.value === false
    ) {
      if (messageGroup && messageGroup.value?.scrollHeight) {
        autoScroll(messageGroup.value.scrollHeight);
        initialMountedScroll.value = true;
      }
    }
  });
}

/**
 * @description Handle message post request.
 * @param values 
 * @param param1 
 */
function sendTextMessage(values: { text: string } | any, { resetForm }: { resetForm: any }) {
  if (!currentChannel || !currentChannel.value) return  
  sendMessage(pageRoute.value, values.text, currentChannel.value)
    .then(() => resetForm())
    .catch((error) => console.warn(error))
}

/**
 * @description Make sure that there are character values in input field before sending it to the back-end
 * @param value 
 * @returns {string | boolean}
 */
function validateText(value: any): string | boolean {
  return (value && typeof value === "string" && value.trim()) ? true : "Text is required";
}


function autoScroll(scrollHeight: number) {
  if (!messageGroup || !messageGroup.value) return;
  const target = messageGroup.value
  target.scrollTop = scrollHeight + target.scrollTop;
}

watch(messageGroup, (current, previous, clean) => {
  const height: number = JSON.parse(JSON.stringify(current?.scrollHeight));
  autoScroll(height * 3);
})
</script>

<template>
  <main data-component="Chat Channel View" class="block">
    <h6 class="text-3xl font-bold text-[#119da4]">
      Chat Title: {{ $route.params.id }}
    </h6>

    <div v-show="messageLoader">
      <p>loading...</p>
    </div>

    <div class="my-4">
      <div v-show="!messageLoader" ref="messageGroup"
        class="grid grid-cols gap-4 max-h-[calc(100vh-(9rem+100px))] overflow-y-scroll">
        <div v-for="message in messages">
          <div class="w-[90%] sm:w-[70%] overflow-hidden rounded-md shadow">
            <div class="bg-neutral-100 px-6 py-2">
              <p class="text-base">{{ message.message }}</p>
            </div>
            <div class="bg-neutral-600 px-6 py-2">
              <p class="text-sm text-slate-100">{{ message.username }}: at {{ formatDate(message.createdAt) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="fixed bottom-[10px] left-[10px] w-[calc(100vw-20px)] z-[2]">
        <Form v-slot="{ meta }" @submit="sendTextMessage" class="w-full flex flex-row">
          <Field label="text" :oninput="validateText" name="text" type="text" :rules="validateText"
            aria-placeholder="Text Message" placeholder="Text Message" aria-autocomplete="none" autocomplete="off"
            class="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />

          <button type="submit"
            class="inline-block rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700 ml-4">
            Send
          </button>
        </form>
      </div>
      <div v-if="messageErrorResp">
        <p class="text-sm text-red-400">{{ messageErrorResp }}</p>
      </div>
    </div>
  </main>
</template>

<style lang="scss">

</style>
