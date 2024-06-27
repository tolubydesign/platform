import { ref, type Ref, } from 'vue'
import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', () => {
  const toastMessage: Ref<string|null> = ref(null);
  const toastActive: Ref<boolean> = ref(false);
  const timeout: Ref<string | number | NodeJS.Timeout | undefined> = ref(undefined)

  function closeToast() {
    toastMessage.value = null;
    toastActive.value = false
    
    clearTimeout(timeout.value);
  }

  function openToast(message: string) {
    toastMessage.value = message;
    toastActive.value = true;

    // set timeout to auto close
    timeout.value = setTimeout(() => {
      closeToast();
    }, 10000)
  }

  return {
    closeToast,
    openToast,

    toastMessage,
    toastActive,
  }
})
