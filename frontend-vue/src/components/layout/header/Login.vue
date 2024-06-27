<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink, RouterView, useRouter, useRoute } from "vue-router";
import { removeLoginInformation } from "@helpers/auth/login-auth"

const router = useRouter()
const loggedIn = ref(false);
const logoutButtonClassName = "whitespace-nowrap rounded-md border border-transparent bg-indigo-600 px-5 py-1 text-base font-medium text-white shadow-sm hover:bg-indigo-700 w-full md:w-auto"

onMounted(() => {
  checkUserToken()
})

function checkUserToken() {
  const token = localStorage.getItem('user');
  loggedIn.value = !!token;
}

function Logout() {
  removeLoginInformation()
  router.push("/");
  return
}

</script>

<template>

  <div data-component="Login Element" class="items-center justify-end block md:flex md:flex-1 lg:w-0 mx-auto">
    <button @click="Logout()" :class=" loggedIn ? logoutButtonClassName : '' ">Logout</button>
  </div>

</template>

<style scoped>

</style>