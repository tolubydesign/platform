<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useChatStore } from "@/stores/chat";
import { useRouter } from 'vue-router';
import { onMounted, ref, type Ref } from 'vue';
import type { AccountDetail } from '@/models/account.model';
import IconLoading from '@/components/icons/IconLoading.vue';

type TChannel = { creator_id: string, id: number, name: string }

const props = defineProps<{
  channel: TChannel
}>()

const router = useRouter();
// Store
const chatStore = useChatStore();
const { currentChannel } = storeToRefs(chatStore);
const { getChatCreator } = chatStore;
const creatorDetail: Ref<Partial<AccountDetail> | undefined> = ref(undefined)

onMounted(() => {
  fetchCreator()
})

/**
 * @description Redirect users to selected Chat Channel Page. ie Messaging channel/group
 * @param {TChannel} channel 
 */
function redirect(channel: { creator_id: string, id: number, name: string }) {
  currentChannel.value = channel;
  return router.push(`/chat/${channel.name}`)
}

async function fetchCreator(): Promise<void> {
  return getChatCreator(props.channel.creator_id).then((res) => {
      if (res.data?.data?.findAccountById) {
        creatorDetail.value = res.data.data.findAccountById; 
      }
  }).catch((error) => console.error(error))
}

</script>

<template>
  <div data-element="Channel Card" class="flex flex-col rounded-md shadow">
    <div class="py-6">
      <p class="text-center text-lg text-slate-400 font-semibold ">{{ channel.name }}</p>

      <div class="mt-3">
        <div v-show="creatorDetail">
          <p class="text-center text-md text-slate-600 font-medium">Created By</p>
          <p class="text-center text-sm text-slate-500 font-normal">{{ creatorDetail?.username }}</p>
          <p class="text-center text-sm text-slate-500 font-normal">{{ creatorDetail?.email }}</p>
        </div>

        <div v-show="!creatorDetail" class="flex justify-center items-center">
          <IconLoading class="w-5 h-5" />
        </div>
      </div>
    </div>

    <div class="flex justify-center items-center border-t-2 border-slate-200   border-indigo-600 py-4">
      <button class="text-sm text-slate-800 bg-transparent hover:bg-transparent hover:text-slate-400 font-medium "
        @click="redirect(channel)">
        View {{ channel.name }}
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>