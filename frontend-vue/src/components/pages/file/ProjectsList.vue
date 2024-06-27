<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthenticationStore } from '@/stores/auth';
import { useFileStore } from '@/stores/files';
import { getLoginInformation } from '@/helpers/auth/login-auth';
import { RouterLink } from 'vue-router';
import type { AccountDetail } from '@/models/account.model';
import { ErrorMessage, Field, Form } from 'vee-validate';
import { isRequired } from '@/helpers/form/validation';
import IconLoading from '@/components/icons/IconLoading.vue';

// Store (Authentication)
const authenticationStore = useAuthenticationStore()
const { accountDetail, usersLoader, usersErrorResp, usersList } = storeToRefs(authenticationStore);
const { fetchAccountDetails, getListOfUsers } = authenticationStore;
const account: Ref<AccountDetail | undefined> = ref(accountDetail)
// Store (Files)
const fileStore = useFileStore();
const { projectPacksList, projectErrorResp, projectLoader } = storeToRefs(fileStore);
const { fetchProjects, createProjectPack } = fileStore;

const { email } = getLoginInformation();
const headerClassName = "mb-4 text-left text-xl md:text-3xl font-medium leading-none text-indigo-600 dark:text-indigo-200 ";
const tableDivClassName = "px-6 py-4";
const tableHeadClassName = "px-6 py-3"
const actionButtonClassName = `
  inline-flex justify-center 
  text-sm text-white font-medium
  rounded-md shadow-sm
  py-2 px-4 mx-3
  border border-transparent
  bg-indigo-600 hover:bg-indigo-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2  
`;
const errorResponseClassName = "block w-full text-red-400 text- sm:text-sm mt-2";
const formInputClassName = "mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-base px-3 py-1";
const formLabelClassName = "block text-sm font-medium text-gray-700";

const showProjectCreatorPanel: Ref<boolean> = ref(false);

/**
 * @description Show or hide the creator panel, based on user input.
 * @param state 
 */
function setProjectCreatorPanel(state: boolean) {
  showProjectCreatorPanel.value = state;
}

/**
 * @description Make request to create a Project Pack
 * @param values 
 * @param args 
 */
function handleProjectCreation(values: any | { name: string, participants: string[] }, args: { resetForm: any }) {
  createProjectPack(email, values.name, values.participants).then((response) => {
    if (!response?.data?.errors) {
      args.resetForm();
    }
  })
}

onMounted(() => {
  if (!account) fetchAccountDetails(email);
  // Get list of project packs associated with user
  fetchProjects(email);
  getListOfUsers(email)
})
</script>

<template>
  <div data-component="Projects Listings Component" class="mb-4 md:mb-6">
    <h3 :class="headerClassName">Projects</h3>

    <div class="relative shadow-md sm:rounded-lg mb-4 ">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" :class="tableHeadClassName">
              Project Name
            </th>
            <th scope="col" :class="tableHeadClassName">
              Creator
            </th>
            <th scope="col" :class="tableHeadClassName">
              Link
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="project in projectPacksList" class="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {{ project.project_name }}
            </th>
            <td :class="tableDivClassName">
              {{ project.creator_email }}
            </td>
            <td :class="tableDivClassName">
              <RouterLink :to="`/project/${project.project_name}`"
                class="font-medium text-blue-600 dark:text-blue-500 hover:underline bg-none hover:bg-transparent">
                Direct to {{ project.project_name }}
              </RouterLink>
            </td>
          </tr>

        </tbody>
      </table>
    </div>

    <div class="flex w-full" v-if="account?.account_type === 'admin'">
      <button v-show="!showProjectCreatorPanel" @click="setProjectCreatorPanel(true)"
        class="whitespace-nowrap rounded-md border border-transparent bg-indigo-600 px-5 py-1 text-base font-medium text-white shadow-sm hover:bg-indigo-7 disabled:bg-gray-400 w-full md:w-auto mx-auto">
        Create Project Pack
      </button>


      <div v-show="showProjectCreatorPanel" class="flex flex-col w-full max-w-[600px] drop-shadow-lg bg-white mx-auto">
        <div class="px-4 py-3 sm:px-6 text-right">
          <button :class="actionButtonClassName" @click="setProjectCreatorPanel(false)">
            Cancel
          </button>
        </div>

        <Form v-slot="{ meta }" @submit="handleProjectCreation" class="">
          <div class="grid grid-cols md:grid-cols-2 gap-4 px-4 py-2">

            <div class="flex-1">
              <label for="name" :class="formLabelClassName">Project Name</label>
              <Field label="name" :class="`${formInputClassName}`" name="name" type="text" :rules="isRequired"
                aria-placeholder="Project Name" />
              <ErrorMessage name="email" :class="errorResponseClassName" />
            </div>

            <div class="flex-1">
              <div v-if="!usersLoader" class="overflow-y-scroll max-h-[200px] w-full max-w-[280px]">
                <p :class="formLabelClassName">Choose the Participants:</p>
                <div v-for="user in usersList" class="flex flex-row items-center justify-start px-1">
                  <div v-if="user.email !== account.email">
                    <Field name="participants" :value="user.email" type="checkbox"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                    </Field>
                    <label for="participants" class="ml-2 text-sm font-medium text-gray-400 dark:text-gray-500">
                      {{ user.email }}
                    </label>
                  </div>
                </div>
              </div>

              <div v-if="usersLoader">
                <IconLoading class="w-8 h-8" />
              </div>
              <div v-if="usersErrorResp">
                <p class="text-sm text-red-300 font-semibold text-center">{{ usersErrorResp }}</p>
              </div>
            </div>


          </div>

          <div class="bg-gray-50 px-4 py-3 text-right sm:px-6 mt-6">
            <button type="submit" :class="`${actionButtonClassName} disabled:bg-gray-600 bg-indigo-600`"
              :disabled="!meta.valid || !meta.touched || projectLoader">
              {{ projectLoader? "loading": "Create Project" }}
            </button>
          </div>

          <div v-if="projectErrorResp" class="">
            <p class="text-sm text-red-300 font-semibold text-center">{{ projectErrorResp }}</p>
          </div>
        </Form>
      </div>
    </div>

  </div>
</template>

<style scoped>

</style>