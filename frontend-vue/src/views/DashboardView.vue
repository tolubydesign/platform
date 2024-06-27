<script setup lang="ts">
import { getLoginInformation } from '@helpers/auth/login-auth';
import WelcomeMatt from '@components/shared/welcome-matt/WelcomeMatt.vue';
import { onMounted, ref, type Ref } from 'vue';
import ChatSelection from '@/components/pages/main/ChatSelection.vue';
import FileUpload from '@/components/pages/file/FileUpload.vue';
import { RouterLink } from 'vue-router';

const name: Ref<string | undefined> = ref(undefined)
onMounted(() => {
  getUser()
})

function getUser() {
  const { username } = getLoginInformation();
  name.value = username;
}

</script>

<template>
  <main data-component="Dashboard View" class="flex flex-col">
    <WelcomeMatt v-if="name" :username="name" />
    <FileUpload />

    <div class="mt-3" data-element="Direct to Projects Page">
      <RouterLink
        class="whitespace-nowrap rounded-md border border-transparent bg-indigo-600 px-5 py-1 text-base font-medium text-white shadow-sm hover:bg-indigo-700 w-full md:w-auto"
        to="/project">
        Projects Page
      </RouterLink>
    </div>
    <hr class="h-px my-5 bg-gray-200 border-0 dark:bg-gray-700">

    <ChatSelection />
  </main>
</template>

<style lang="scss">

</style>
