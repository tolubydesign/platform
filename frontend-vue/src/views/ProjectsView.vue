<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthenticationStore } from '@/stores/auth';
import { getLoginInformation } from '@/helpers/auth/login-auth';
import FileUpload from '@/components/pages/file/FileUpload.vue';
import FileList from '@/components/pages/file/FileList.vue';
import ProjectsList from '@/components/pages/file/ProjectsList.vue';

// Store
const authenticationStore = useAuthenticationStore()
const { fetchAccountDetails } = authenticationStore;

onMounted(() => {
  fetchCredentials();
})

function fetchCredentials() {
  const { email } = getLoginInformation();
  return fetchAccountDetails(email)
}

</script>

<template>
  <main data-component="Projects View" class="flex justify-center items-center w-full">
    <div class="flex flex-col w-full">
      <FileUpload />
      <FileList />
      <ProjectsList />
    </div>
  </main>
</template>

<style lang="scss">

</style>
