<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthenticationStore } from '@/stores/auth';
import SettingForm from '@/components/pages/settings/SettingForm.vue';
import PasswordResetForm from '@/components/pages/settings/PasswordResetForm.vue';
import { getLoginInformation } from '@/helpers/auth/login-auth';
import CreateAccountForm from '@/components/pages/settings/CreateAccountForm.vue';

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
  <main data-component="Settings View" class="flex justify-center items-center w-full">

    <div class="flex flex-col">
      <SettingForm></SettingForm>
      <PasswordResetForm />
      <CreateAccountForm />
    </div>
  </main>
</template>

<style lang="scss">

</style>
