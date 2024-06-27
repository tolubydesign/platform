<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import { useAuthenticationStore } from '@/stores/auth';
import { getLoginInformation } from '@/helpers/auth/login-auth';
import FileItem from '@/components/shared/file-item/FileItem.vue';
import { useFileStore } from '@/stores/files';
import { storeToRefs } from 'pinia';
import { useRoute } from "vue-router";
import IconLoading from '@/components/icons/IconLoading.vue';

const { email } = getLoginInformation();
const headerClassName = "mb-4 text-left text-xl md:text-3xl font-medium leading-none text-indigo-600 dark:text-indigo-200 ";

// Store
const authenticationStore = useAuthenticationStore()
const { fetchAccountDetails } = authenticationStore;
// Store (Files)
const fileStore = useFileStore()
const { selectedProjectPack, projectErrorResp, projectLoader, selectedProjectPackFiles } = storeToRefs(fileStore);
const { fetchProjectPack } = fileStore;

const route = useRoute();
const pageRoute: Ref<string> = ref("");

onMounted(() => {
  if (
    route?.params?.id &&
    typeof route.params.id === 'string'
  ) pageRoute.value = route.params.id

  fetchCredentials();
  fetchProjectPack(email, pageRoute.value)
})

function fetchCredentials() {
  return fetchAccountDetails(email)
}

</script>

<template>
  <main data-component="Files View" class="flex justify-center items-center w-full">
    <div class="flex flex-col w-full">
      <h3 :class="headerClassName">Project Pack: {{ selectedProjectPack?.project_name }}</h3>

      <div class="w-full flex flex-col"
        v-if="selectedProjectPackFiles && selectedProjectPackFiles && !projectErrorResp">
        <div class="mb-4">
          <FileItem :files="selectedProjectPackFiles" :restrictedHeight="false" />
        </div>
      </div>

      <div v-if="projectErrorResp">
        <p class="text-sm text-red-300 font-semibold text-center">{{ projectErrorResp }}</p>
      </div>

      <div v-if="projectLoader" class="flex justify-center items-center">
        <IconLoading class="w-8 h-8" />
      </div>

    </div>
  </main>
</template>

<style lang="scss">

</style>
