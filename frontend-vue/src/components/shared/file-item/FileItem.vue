<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useChatStore } from "@/stores/chat";
import type { TFile } from '@/models/file.model';
import IconDownload from "@/components/icons/IconDownload.vue"
import { getLoginInformation } from '@/helpers/auth/login-auth';
import axios from 'axios';
import { Buffer } from 'buffer';
import { v4 as uuidv4 } from 'uuid';

const props = defineProps<{
  files: TFile[],
  restrictedHeight: boolean
}>()

// Store (Chats)
const chatStore = useChatStore();
const { } = storeToRefs(chatStore);
const tableDivClassName = "px-6 py-4";

/**
 * @description Convert ECMAScript epoch and timestamps into Date String
 * @param date 
 */
function formatDate(date: string) {
  return new Date(Number(date)).toLocaleString();
}

/**
 * @description Request selected file, to be saved in download file.
 * @param file 
 * 
 * @see {@link https://javascript.info/blob}
 */
function downloadFile(file: TFile) {
  const { token } = getLoginInformation()
  console.log(file);
  const filename = file.uploadedFileName;
  const saveName = file.serverFileName

  const key = "?key=" + filename;

  return axios({
    url: 'http://localhost:5000/download' + key,
    method: 'GET',
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
      "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
      "x-apollo-operation-name": "*",
      "enctype": "multipart/form-data",
      "Authorization": token,
      "uuid": uuidv4(),
    },
  })
    .then((response: any) => {
      console.log(response);

      const buffer = Buffer.from(response.data.Body.data);
      const fileBase64 = buffer.toString("base64");
      const contentType: string = response.headers["content-type"];

      saveFile(contentType, fileBase64, saveName);
    })
    .catch((error: any) => {
      console.warn(error);
    });
}

function saveFile(filetype: string, base64: string, filename: string) {
  const linkSource = `data:${filetype};base64,${base64}`;
  const downloadLink = document.createElement("a");
  const fileName = filename;
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
  downloadLink.remove();
}

</script>

<template>
  <div data-component="File Item Component. Table Group" :class="`relative shadow-md sm:rounded-lg 
      ${restrictedHeight ? `overflow-y-scroll overflow-x-hidden max-h-[300px]` : ``}`">
    <div class="w-full">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">
              File name
            </th>
            <th scope="col" class="px-6 py-3">
              Format
            </th>
            <th scope="col" class="px-6 py-3">
              Uploader
            </th>
            <th scope="col" class="px-6 py-3">
              Date
            </th>
            <th scope="col" class="px-6 py-3">
              Download
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="file in files" class="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {{ file.uploadedFileName }}
            </th>
            <td :class="tableDivClassName">
              {{ file.mimetype }}
            </td>
            <td :class="tableDivClassName">
              {{ file.creator }}
            </td>
            <td :class="tableDivClassName">
              {{ formatDate(file.uploadedAt) }}
            </td>
            <td :class="tableDivClassName">
              <button @click="downloadFile(file)"
                class="bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 p-2">
                <IconDownload />
              </button>
            </td>
          </tr>

        </tbody>
      </table>
    </div>
</div>
</template>

<style scoped></style>