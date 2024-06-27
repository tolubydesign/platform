<script setup lang="ts">
import { getLoginInformation } from '@/helpers/auth/login-auth';
import { endpoint } from '@/models/graphql.model';
import axios from 'axios';
import { Field, Form } from 'vee-validate';
import { onMounted, ref, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthenticationStore } from '@/stores/auth';
import { useFileStore } from '@/stores/files';
import { v4 as uuidv4 } from 'uuid';

const { token, email } = getLoginInformation()
const file: Ref<string | Blob | undefined> = ref(undefined)
const inputRef: Ref = ref(undefined);

const inputFieldClassName = "file-upload--button block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400";
const inputFieldLabelClassName = "block mb-2 text-sm font-medium text-gray-900 dark:text-white";
const inputFieldSelectorClassName = "mt-2 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
const formSubmitButtonClassName = "whitespace-nowrap rounded-md border border-transparent bg-indigo-600 px-5 py-1 text-base font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-gray-400 w-full md:w-auto"
// response handling for file upload
const filesErrorMessage: Ref<string | undefined> = ref(undefined);
const fileUploadLoading: Ref<boolean> = ref(false);
const fileSuccessMessage: Ref<string | undefined> = ref(undefined);

// Store (Authentication)
const authenticationStore = useAuthenticationStore()
const { accountDetail } = storeToRefs(authenticationStore);
const { fetchAccountDetails } = authenticationStore;
const account: Ref<any> = ref(accountDetail)
// Store (Files)
const fileStore = useFileStore();
const { projectPacksList, projectErrorResp } = storeToRefs(fileStore);
const { fetchProjects } = fileStore;

onMounted(() => {
  if (!account || !account.value) fetchAccountDetails(email);
  fetchProjects(email);
})

/**
 * @description Upload [single] file to database.
 * @param values 
 * @param args 
 */
function submitFile(values: any | { project: number }, args: { resetForm: any }) {
  setErrorMessage(undefined);
  fileSuccessMessage.value = undefined

  console.log(email, file.value, values);
  let projectId = 0;
  if (values.project) projectId = values.project

  if (!token) {
    setErrorMessage("Access token can not be found. Please login again to retrieve it.");
    return
  }

  if (!inputRef.value.files) {
    setErrorMessage("No file has been provided.");
    return;
  }

  if (!file || !file.value) {
    setErrorMessage("File could not be captured. Please try again.");
    return
  }

  fileUploadLoading.value = true
  const formData = new FormData();
  // Example of Operations request 
  // `{ "query": "mutation ($file: Upload!) { singleUpload(file: $file) { id } }", "variables": { "file": null } }`
  formData.append('operations',
    `{
      "query": "mutation ($file: Upload!, $email: String!, $projectId: Int) { uploadFile(file: $file, email: $email, projectId: $projectId) { code success message } }", 
      "variables": { "file": null, "email": "${email}", "projectId": ${projectId} } 
    }`
  );
  formData.append('map', `{ "file": ["variables.file"] }`);
  formData.append('file', file.value);

  const headers = {
    'Content-Type': 'multipart/form-data', // 'application/json',
    "x-apollo-operation-name": "*",
    "Authorization": token,
    "enctype": "multipart/form-data",
    "uuid": uuidv4()
  };

  axios.post(
    endpoint,
    formData,
    { headers }
  ).then((res) => {
    console.log("response", res);

    if (res.data.errors) {
      console.error(res.data.errors[0].message)
      setErrorMessage(res.data.errors[0].message)
    }

    if (
      res.data.data &&
      res.data.data.uploadFile &&
      res.data.data.uploadFile.success
    ) {
      // Success!! We got the user's status
      res.data.files; // binary representation of the file
      res.status; // HTTP status
      fileUploadLoading.value = false;
      fileSuccessMessage.value = "File successfully uploaded";
    }

  }).catch((error: Error) => {
    setErrorMessage(error.message);
    fileUploadLoading.value = false;
  });
}

/**
 * @description Set reference value to file variable. 
 */
function setFile() {
  // const inputField = document.getElementById("file-upload-input-field");
  file.value = inputRef.value.files[0]
}

/**
 * @description Set component Error message.
 * @param message 
 */
function setErrorMessage(message: string | undefined) {
  return filesErrorMessage.value = message;
}

</script>

<template>
  <div data-component="File Selection Component" class="mb-4" v-if="account?.account_type === 'admin'">

    <div class="flex flex-row justify-start items-end w-full">
      <Form v-slot="{ meta }" @submit="submitFile" class="grid gap-3 flex flex-col justify-center items-start"
        enctype=”multipart/form-date”>
        <div class="">
          <label for="file" :class="inputFieldLabelClassName">Select a File to Upload</label>
          <input label="file" enctype="multipart/form-data" :class="inputFieldClassName" name="channel" type="file"
            ref="inputRef" @change="setFile()" aria-placeholder="Upload a File" id="file-upload-input-field" />
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG GIF or PDF</p>
        </div>

        <div class="w-full">
          <label for="project" :class="inputFieldLabelClassName">Select A Project</label>
          <Field single name="project" as="select" :class="inputFieldSelectorClassName">
            <option :value="0"></option>
            <template v-for="projects in projectPacksList">
              <option :value="projects.id">{{ projects.project_name }}</option>
            </template>
          </Field>
        </div>

        <button type="submit" :disabled="!file" :class="formSubmitButtonClassName">
          {{ fileUploadLoading ? "loading" : "Upload!" }}
        </button>
      </Form>

    </div>

    <div class="flex ">
      <div v-if="filesErrorMessage">
        <p class="text-sm text-left font-semibold py-3 text-red-400">{{ filesErrorMessage }}</p>
      </div>
      <div v-if="fileSuccessMessage">
        <p class="text-sm text-left font-semibold py-3 text-teal-400">{{ fileSuccessMessage }}</p>
      </div>

      <div v-if="projectErrorResp">
        <p class="text-sm text-left font-semibold py-3 text-red-400">{{ projectErrorResp }}</p>
      </div>
    </div>

</div>
</template>

<style scoped lang="scss">
input#file-upload-button {
  background-color: aqua;
  color: white;
  padding: 12px 4px;
}

.file-upload--button {

  &::-webkit-file-upload-button,
  &::file-selector-button {
    border-radius: 6px;
    border-style: none;
    border-width: 0;

    background-color: brown;
    padding: 2px 12px;
    box-shadow: 0px 3px 5px #888888;
    color: white;
    font-weight: 600;

    margin: {
      right: 14px
    }
  }
}
</style>