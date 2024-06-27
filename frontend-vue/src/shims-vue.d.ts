/// <reference types="vite/client" />

// declare module '*.vue';
declare module '*.vue' {
  // import Vue from 'vue'
  // export default Vue
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}