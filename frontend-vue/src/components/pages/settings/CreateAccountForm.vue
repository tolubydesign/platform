<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useAuthenticationStore } from '@/stores/auth';
import { validatePassword, validateEmail, validateUsername, validatePhoneNumber, isRequired } from "@/helpers/form/validation";
import { storeToRefs } from 'pinia';
import type { AxiosResponse } from 'axios';

const panelOpen: Ref<boolean> = ref(false);

// Store
const authenticationStore = useAuthenticationStore()
const { accountErrorResp, accountLoader, accountDetail } = storeToRefs(authenticationStore)
const { createAccount } = authenticationStore;
const creatorAccount: Ref<any> = ref(accountDetail)

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
 * @description Submit form creating an account to back-end.
 * @param { SubmissionHandler<GenericFormValues | FormFields, unknown> | undefined } values
 * @returns { Promise<AxiosResponse<any, any>> } axios 
 */
async function onSubmit(values: any, args: { resetForm: any }): Promise<AxiosResponse<any, any>> {
  return createAccount(creatorAccount.value.email, values)
    .then((response: any) => {
      // If no errors rest form
      if (!response?.data?.errors) args.resetForm();
      return response;
    })
    .catch(() => {

    })
}

/**
 * @description Show or hide the panel, based on the parameter provided.
 * @param {boolean} state 
 */
function setPanelState(state: boolean) {
  panelOpen.value = state;
}

</script>

<template>
  <div data-component="Create Account Panel" class="flex flex-col justify-center items-center w-full my-6"
    v-if="creatorAccount?.account_type === 'admin'">
    <div v-if="panelOpen" class="shadow-md sm:rounded-md bg-white px-4 py-5 sm:p-6 w-full">

      <div class="px-4 py-3 text-right sm:px-6 mt-6">
        <button :class="actionButtonClassName" @click="setPanelState(false)">
          Cancel
        </button>
      </div>

      <Form v-slot="{ meta }" @submit="onSubmit" class="">
        <div class="grid gap-6">

          <div class="col-span-1">
            <label for="username" :class="formLabelClassName">Username</label>
            <Field label="Username" :class="`${formInputClassName}`" name="username" type="text"
              :rules="validateUsername" :validateOnChange="true" :validateOnInput="true"
              aria-placeholder="Account Username" />
            <ErrorMessage name="username" :class="errorResponseClassName" />
          </div>

          <div class="col-span-1">
            <label for="email" :class="formLabelClassName">Email</label>
            <Field label="Email" :class="`${formInputClassName}`" name="email" type="email" :oninput="validateEmail"
              :rules="validateEmail" :validateOnChange="true" :validateOnInput="true" aria-placeholder="Email"
              autocomplete="on" />
            <ErrorMessage name="email" :class="errorResponseClassName" />
          </div>

          <div class="col-span-1">
            <label for="phone" :class="formLabelClassName">Phone Number</label>
            <Field label="Phone Number" :class="formInputClassName" name="phone" type="tel" :rules="validatePhoneNumber"
              :validateOnChange="true" :validateOnInput="true" aria-placeholder="Phone Number" autocomplete="on" />
            <ErrorMessage name="phone" :class="errorResponseClassName" />
          </div>

          <div class="col-span-1">
            <label for="password" :class="formLabelClassName">Password</label>
            <Field label="Password" :validateOnChange="true" :validateOnInput="true" :rules="validatePassword"
              :class="formInputClassName" name="password" type="password" placeholder="Password"
              aria-placeholder="Password" id="password" autocomplete="off" />
            <ErrorMessage name="password" :class="errorResponseClassName" />
          </div>

          <div class="col-span-1">
            <label for="account_type" :class="formLabelClassName">Account Type</label>
            <Field v-slot="{ value }" single name="account_type" as="select" :rules="isRequired"
              :class="'mt-2 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'">
              <option value="user">user</option>
              <option value="admin">admin</option>
            </Field>
            <ErrorMessage name="account_type" :class="errorResponseClassName" />
          </div>

        </div>

        <!-- TODO: Add successfully request response -->
        <div v-if="accountErrorResp" class="my-3">
          <p class="text-sm text-red-400 font-medium text-center">{{ accountErrorResp }}</p>
        </div>

        <div class="bg-gray-50 px-4 py-3 text-right sm:px-6 mt-6">
          <button type="submit" :class="`${actionButtonClassName} disabled:bg-gray-600 bg-indigo-600`"
            :disabled="accountLoader && !meta.valid && meta.touched">
            {{ accountLoader? "loading": "Create Account" }}
          </button>
        </div>

      </Form>
    </div>

    <div v-else class="">
      <button :class="`${actionButtonClassName}`" @click="setPanelState(true)">
        Create an Account
      </button>
    </div>
  </div>
</template>

<style lang="scss">

</style>
