<script setup lang="ts">
import { onMounted } from 'vue';
import ChannelCard from '@/components/shared/channel-card/ChannelCard.vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useChatStore } from "@/stores/chat";
import IconLoading from '@/components/icons/IconLoading.vue';

const chatStore = useChatStore();
const { recentChatsLoader, recentChats, recentChatsErrorRes } = storeToRefs(chatStore)
const { getRecentChatChannels } = chatStore

onMounted(() => {
  fetchRecentChats()
})

/**
 * @description Fetch 3 recent chats channels.
 */
function fetchRecentChats(): void {
  getRecentChatChannels()
}

</script>

<template>
  <div data-component="Chat Selection Component" class="">
    <div v-if="recentChats">
      <div class="grid grid-cols sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div v-for="channel in recentChats">
          <ChannelCard :channel="channel"></ChannelCard>
        </div>
      </div>

      <RouterLink
        class="whitespace-nowrap rounded-md border border-transparent bg-indigo-600 px-5 py-1 mt-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 w-full md:w-auto"
        to="/chat">
        Chats Page
      </RouterLink>
    </div>

    <div v-show="recentChatsLoader">
      <IconLoading class="w-8 h-8" />
    </div>

    <div v-if="recentChatsErrorRes" class="text-sm text-left font-semibold py-3 text-red-400">
      {{ recentChatsErrorRes }}
    </div>
  </div>
</template>

<style scoped>

</style>