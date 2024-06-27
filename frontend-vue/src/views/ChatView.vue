<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import ChannelCard from '@/components/shared/channel-card/ChannelCard.vue';
import { useChatStore } from "@/stores/chat";
import CreateChannel from '@/components/pages/chat/CreateChannel.vue';

// Store
const chatStore = useChatStore();
const { loading, channelErrorRes, chatChannels } = storeToRefs(chatStore)
// Actions, store functions, can be extracted like such.
const { fetchChannels } = chatStore;

onMounted(() => {
  fetchChannels();
})

</script>

<template>
  <main data-component="Chat View" class="block ">
    <h3 class="text-xl">All Chat Channels</h3>

    <div v-if="loading">
      <p>loading...</p>
    </div>

    <div class="my-4">
      <div v-if="!loading && !channelErrorRes" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        <div v-for="channel in chatChannels">
          <ChannelCard :channel="channel"></ChannelCard>
        </div>
      </div>

      <CreateChannel></CreateChannel>
      <div v-if="channelErrorRes">
        <p class="text-sm text-red-400">{{ channelErrorRes }}</p>
      </div>
    </div>


  </main>
</template>

<style lang="scss">

</style>
