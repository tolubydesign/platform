<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import Toast from "./components/shared/toast/Toast.vue";
import { useToastStore } from "@/stores/toast";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { getLoginInformation } from "./helpers/auth/login-auth";
import { verifyUserAuthentication } from "./service/auth/auth.service";
import type { AxiosResponse } from "axios";

// Store (Toast)
const toastStore = useToastStore();
const { toastActive, toastMessage } = storeToRefs(toastStore);
const { closeToast, openToast } = toastStore;

onMounted(() => {
  checkUserVerification();
});

async function checkUserVerification() {
  const { token, email } = getLoginInformation();
  console.log('check user verification');
  const isVerified = await verifyUserAuthentication(token, email)
    .then((res: any) => {
      console.log('check user authentication res', res);

      if (res.data.errors) {
        // Error handling
        openToast(res.data.errors[0].message);
      }
      return res;
    })
    .catch((error) => {
      console.warn(error.message);
      openToast(error.message);
    });
}

function close() {
  closeToast();
}
</script>

<template>
  <RouterView name="NavigationalHeader" class="z-[1]" />
  <RouterView class="px-10 py-4 md:px-12 md:py-8 z-[0]" />
  <Toast v-show="toastActive" :message="toastMessage" @closeToast="close" />
</template>

<style scoped>
nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
