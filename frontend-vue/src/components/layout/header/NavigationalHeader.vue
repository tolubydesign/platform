<script setup lang="ts">
import IconSetting from "@/components/icons/IconSetting.vue";
import Login from "@/components/layout/header/Login.vue";
import { RouterLink } from 'vue-router';

const linkClassName = "text-base font-medium text-gray-500 hover:text-gray-900"
</script>

<template>
  <div data-component="Navigational Header Component" class="relative bg-white w-full">

    <div data-element="Navigational Header Component Desktop Navigation" class="mx-auto w-full">
      <div class="flex items-center justify-between border-b-2 border-gray-100 py-6 md:justify-start px-6 md:space-x-4">
        <div class="flex justify-start lg:w-0 lg:flex-1">
          <a href="#">
            <span class="sr-only">Your Company</span>
            <img class="h-8 w-auto sm:h-10" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="">
          </a>
        </div>

        <nav class="space-x-10 flex flex-row flex-wrap justify-center items-center">
          <RouterLink :class="linkClassName" to="/dashboard">Dashboard</RouterLink>
          <RouterLink :class="linkClassName" to="/chat">Chats</RouterLink>
          <RouterLink :class="linkClassName" to="/project">Project</RouterLink>
        </nav>

        <div class="flex justify-start items-center lg:w-0 lg:flex-1 space-x-4">
          <Login />
          <RouterLink to="/settings" class="hover">
            <IconSetting />
          </RouterLink>
        </div>
      </div>
    </div>

  </div>

</template>

<style scoped>

</style>