<script setup lang="ts">
import { onMounted } from 'vue';
import { useFileStore } from '@/stores/files';
import IconLoading from "@/components/icons/IconLoading.vue"
import { storeToRefs } from 'pinia';
import { getLoginInformation } from '@/helpers/auth/login-auth';
import FileItem from '@/components/shared/file-item/FileItem.vue';

const { email } = getLoginInformation();
const headerClassName = "mb-4 text-left text-xl md:text-3xl font-medium leading-none text-indigo-600 dark:text-indigo-200 ";

// Store (Files)
const fileStore = useFileStore()
const { filesErrorResp, filesList, filesLoader, } = storeToRefs(fileStore);
const { fetchRecentFiles, fetchAllFiles } = fileStore;

onMounted(() => {
  fetchRecentFiles(email)
})

</script>

<template>
  <div data-component="File List Component" class="mb-4 md:mb-6">
    <h3 :class="headerClassName">Files</h3>

    <div>
      <div class="w-full flex flex-col" v-if="filesList && filesList.length > 0 && !filesErrorResp">
        <div class="mb-4">
          <FileItem :files="filesList" :restrictedHeight="true" />
        </div>

        <button
          class="whitespace-nowrap rounded-md border border-transparent bg-indigo-600 px-5 py-1 text-base font-medium text-white shadow-sm hover:bg-indigo-7 disabled:bg-gray-400 w-full md:w-auto mx-auto"
          @click="fetchAllFiles(email)">
          Fetch all Files
        </button>
      </div>

      <div v-if="filesErrorResp">
        <p class="text-sm text-red-300 font-semibold text-center">{{ filesErrorResp }}</p>
      </div>

      <div v-if="filesLoader" class="flex justify-center items-center">
        <IconLoading class="w-8 h-8" />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>