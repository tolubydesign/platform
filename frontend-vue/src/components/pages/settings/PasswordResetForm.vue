<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useAuthenticationStore } from '@/stores/auth';
import { validatePassword, validateEmail } from "@/helpers/form/validation";
import { storeToRefs } from 'pinia';

const updatingPassword: Ref<boolean> = ref(false)

// Store
const authenticationStore = useAuthenticationStore()
const { passLoader, passErrorResp, accountDetail } = storeToRefs(authenticationStore)
const { updateAccountPassword } = authenticationStore;
const initialFormValues: Ref<any> = ref(accountDetail)

// Class Names 
const formInputClassName = "mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-base px-3 py-1";
const actionButtonClassName = `
  inline-flex justify-center 
  text-sm text-white font-medium
  rounded-md shadow-sm
  py-2 px-4 mx-3
  border border-transparent
  bg-indigo-600 hover:bg-indigo-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2  
`;
const errorResponseClassName = "block w-full text-red-400 text- sm:text-sm mt-2";
const formLabelClassName = "block text-sm font-medium text-gray-700";

/**
 * @description Submit form, password change, to back-end.
 * @param { SubmissionHandler<GenericFormValues | FormFields, unknown> | undefined } values
 * @returns { Promise<void> } axios 
 */
async function onSubmit(values: any | { "current-password": string, "new-password": string }, args: { resetForm: any }): Promise<void> {
  return updateAccountPassword(initialFormValues.value.email, values["current-password"], values["new-password"])
    .then((response: any) => {
      args.resetForm();
      updatingPassword.value = false;
    })
    .catch((error: any) => {
      args.resetForm()
    });
}

/**
 * @description Show or hide the password change panel, based on the parameter provided.
 * @param {boolean} state 
 */
function setPasswordPanelState(state: boolean) {
  updatingPassword.value = state;
}

</script>

<template>
  <div data-component="Password Reset Form Settings View"
    class="flex flex-col justify-center items-center w-full my-6">
    <div v-if="updatingPassword" class="shadow-md sm:rounded-md bg-white px-4 py-5 sm:p-6 w-full">

      <div class="px-4 py-3 text-right sm:px-6 mt-6">
        <button :class="actionButtonClassName" @click="setPasswordPanelState(false)">
          Cancel
        </button>
      </div>

      <Form v-slot="{ meta }" @submit="onSubmit" class="" :initial-values="initialFormValues">
        <div class="grid gap-6">

          <div class="col-span-1">
            <label for="email" :class="formLabelClassName">Email</label>
            <Field label="Email" :class="`${formInputClassName}`" name="email" type="email" :rules="validateEmail"
              aria-placeholder="Email" :disabled="true" />
            <ErrorMessage name="email" :class="errorResponseClassName" />
          </div>


          <div class="col-span-1">
            <label for="current-password" :class="formLabelClassName">Current Password</label>
            <Field label="current-password" :oninput="validatePassword" :rules="validatePassword"
              :class="`${formInputClassName}`" name="current-password" type="password" placeholder="Password"
              aria-placeholder="Password" id="current-password" autocomplete="off" :validateOnInput="true" />
            <ErrorMessage name="current-password" :class="errorResponseClassName" />
          </div>

          <div class="col-span-1">
            <label for="new-password" :class="formLabelClassName">New Password</label>
            <Field label="new-password" :oninput="validatePassword" :rules="validatePassword"
              :class="`${formInputClassName}`" name="new-password" type="password" placeholder="Password"
              aria-placeholder="Password" id="new-password" autocomplete="off" :validateOnInput="true" />
            <ErrorMessage name="new-password" :class="errorResponseClassName" />
          </div>

        </div>

        <div class="bg-gray-50 px-4 py-3 text-right sm:px-6 mt-6">
          <button type="submit" :class="`${actionButtonClassName} disabled:bg-gray-600 bg-indigo-600`"
            :disabled="!meta.valid && meta.touched">
            {{ passLoader? "loading": "Update" }}
          </button>
        </div>

        <div v-if="passErrorResp" class="">
          <p class="text-sm text-red-300 font-semibold">{{ passErrorResp }}</p>
        </div>
      </Form>
    </div>

    <div v-else class="">
      <button :class="`${actionButtonClassName}`" @click="setPasswordPanelState(true)">
        Update Password
      </button>
    </div>
  </div>
</template>

<style lang="scss">

</style>
