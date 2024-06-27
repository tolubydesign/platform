<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useAuthenticationStore } from '@/stores/auth';
import { validateEmail, validateUsername, validatePhoneNumber } from "@/helpers/form/validation";
import { storeToRefs } from 'pinia';

// Store
const authenticationStore = useAuthenticationStore()
const { authErrorResp, authLoader, accountDetail } = storeToRefs(authenticationStore)
const { updateAccountDetail } = authenticationStore;

const editMode: Ref<boolean> = ref(false);
// Class Names 
const formInputClassName = "mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-base px-3 py-1";
const saveButtonClassName = `
  inline-flex justify-center 
  text-sm text-white font-medium
  rounded-md shadow-sm
  py-2 px-4 mx-3
  border border-transparent
  hover:bg-indigo-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2  
`;
const errorResponseClassName = "block w-full text-red-400 text- sm:text-sm mt-2";
const formLabelClassName = "block text-sm font-medium text-gray-700";

const initialFormValues: Ref<any> = ref(accountDetail);

/**
 * @description Submit form to back-end
 * @param {SubmissionHandler<GenericFormValues | FormFields, unknown> | undefined} values 
 */
function onSubmit(values: any, args: any) {
  if (!editMode) return;

  updateAccountDetail(values.email, values.username, values.phone, "").then(() => {
    // Reset form and edit mode.
    args.resetForm();
    editMode.value = false
  }).catch((error) => {
    console.warn(error)
    return error;
  });
}

/**
 * @description Enable editing
 */
function requestEditMode(): void {
  editMode.value = !editMode.value;
}

</script>

<template>
  <main data-component="Settings View" class="flex flex-col justify-center items-center w-full">
    <div class="mb-4 mr-auto">
      <h4 class="text-gray-800 text-2xl md:text-4xl font-medium text-left">Account Details</h4>
    </div>


    <div class="shadow-md sm:rounded-md bg-white px-4 py-5 sm:p-6 mt-4">
      <div class="px-4 py-3 text-right sm:px-6 mt-6">
        <button :class="`${saveButtonClassName} ${editMode ? 'bg-gray-600' : 'bg-indigo-400'}`"
          @click="requestEditMode()">{{
            editMode? "Cancel": "Edit"
          }}</button>
      </div>

      <Form v-slot="{ meta }" @submit="onSubmit" :initial-values="initialFormValues" class="">
        <div class="grid grid-cols-6 gap-6">

          <div class="col-span-6 sm:col-span-3">
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <Field label="Username" :oninput="validateUsername" :rules="validateUsername"
              :class="`${formInputClassName}`" name="username" type="text" placeholder="Username"
              aria-placeholder="Username" id="first-name" autocomplete="given-name" :disabled="!editMode" />
            <ErrorMessage name="username" :class="errorResponseClassName" />
          </div>

          <div class="col-span-6 sm:col-span-3">
            <label for="email" :class="formLabelClassName">Email</label>
            <Field label="Email" :class="`${formInputClassName}`" name="email" type="email" :rules="validateEmail"
              aria-placeholder="Email" :disabled="true" />
            <ErrorMessage name="email" :class="errorResponseClassName" />
          </div>

          <div class="col-span-6 sm:col-span-3">
            <label for="phone" :class="formLabelClassName">Contact Number</label>
            <Field label="Phone Number" :oninput="validatePhoneNumber" :class="`${formInputClassName}`"
              name="phone" type="tel" :rules="validatePhoneNumber" aria-placeholder="Phone Number"
              :disabled="!editMode" />
            <ErrorMessage name="phone" :class="errorResponseClassName" />
          </div>

          <div class="col-span-6 sm:col-span-3">
            <label for="account_type" :class="formLabelClassName">Account Type</label>
            <Field v-slot="{ value }" single name="account_type" as="select"
              :disabled="true || !editMode && initialFormValues?.value?.account_type.toLowerCase() !== 'admin'"
              class="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
              <option value="user">user</option>
              <option value="admin">admin</option>
            </Field>
            <ErrorMessage name="account_type" :class="errorResponseClassName" />
          </div>

        </div>

        <div class="bg-gray-50 px-4 py-3 text-right sm:px-6 mt-6">
          <button type="submit" :class="`${saveButtonClassName} bg-indigo-600 disabled:bg-gray-600`"
            :disabled="(!editMode && meta.dirty && meta.valid) && authLoader">
            {{ authLoader ? "loading" : "Save" }}
          </button>
        </div>

        <div v-if="authErrorResp" class="w-full mt-2">
          <p class="text-sm text-center text-red-300 font-semibold">{{ authErrorResp }}</p>
        </div>
      </Form>
    </div>
  </main>
</template>

<style lang="scss">

</style>
