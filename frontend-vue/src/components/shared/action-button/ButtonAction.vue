<script setup lang="ts">
defineProps<{
  callToAction: string
}>()
</script>

<template>
  <button data-component="Action Component"
    class="text-2xl tracking-tight text-gray-900 sm:text-3xl text-left font-normal">
    {{ callToAction }}
  </button>
</template>

<style scoped>

</style>