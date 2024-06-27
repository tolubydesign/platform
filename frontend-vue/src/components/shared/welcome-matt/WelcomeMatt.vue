<script setup lang="ts">
defineProps<{
  username: string
}>()

</script>

<template>
  <div data-component="Welcome Matt Component" class="">
    <h1 class="text-2xl tracking-tight text-gray-900 sm:text-3xl text-left font-normal">
      Welcome
      <br />
      <strong class="tracking-normal font-extrabold text-indigo-600 text-5xl sm:text-6xl">{{ username }}</strong>
    </h1>
  </div>
</template>

<style scoped>

</style>