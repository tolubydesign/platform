<script setup lang="ts">
import { Form, Field, ErrorMessage } from 'vee-validate';
import { setLoginInformation } from "@helpers/auth/login-auth";
import { validatePassword, validateEmail } from "@/helpers/form/validation";
import { useLoginStore } from "@/stores/login";
import { storeToRefs } from 'pinia';
import type { LoginUserInformation } from "@/models/form.model";
import IconLoading from '@/components/icons/IconLoading.vue';
import IconLock from '@/components/icons/IconLock.vue';
import { useRouter } from "vue-router";


const formInputClassName = "relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm";

const router = useRouter()
const loginStore = useLoginStore();
const { loginErrorRes, loginLoader, } = storeToRefs(loginStore); // values
const { userLogin } = loginStore; // functions

/**
 * @description Send user login request to backend, for validation/confirmation.
 * @param {SubmissionHandler<GenericFormValues | FormFields, unknown> | undefined} values 
 */
async function onSubmit(values: { email: string, password: string }) {
  await userLogin(values.email, values.password)
    .then((response: any) => {
      console.log('on submit, user login, response', response);
      if (!response?.data?.errors && response?.data?.data?.userSignIn) {
        login(response.data.data.userSignIn)
      };
    })
}

/**
 * @description Save user credentials to localStorage and redirect valid user to account-dashboard.
 * @param {LoginUserInformation} loginInfo
 */
function login(loginInfo: LoginUserInformation) {
  setLoginInformation(loginInfo);
  router.push("/dashboard");
}

</script>

<template>
  <div data-component="Login Component" class="overflow-hidden bg-white shadow sm:rounded-lg">

    <div class="px-10 py-6">
      <div data-element="Login Component Form"
        class="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">

        <div class="w-full max-w-md space-y-4">
          <div>
            <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
          </div>

          <Form v-slot="{ meta }" @submit="onSubmit">
            <div class="-space-y-px rounded-md shadow-sm mb-4">
              <div>
                <Field label="Email" :class="`${formInputClassName} rounded-t-md`" name="email" type="email"
                  :rules="validateEmail" aria-placeholder="Email" placeholder="name@emaildomain.com" />
                <ErrorMessage name="email" />
              </div>

              <div>
                <Field label="Password" :oninput="validatePassword" :class="`${formInputClassName} rounded-b-md`"
                  name="password" type="password" :rules="(value, args) => validatePassword(value, args, true)"
                  aria-placeholder="Password" placeholder="secretpasswordbutnotthisone" :validateOnChange="true" />
                <ErrorMessage name="password" />
              </div>
            </div>

            <button type="submit" :disabled="loginLoader || !meta.valid"
              class="group relative flex w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white bg-indigo-600 disabled:bg-gray-400 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <span v-if="!meta.valid" class="absolute inset-y-0 left-0 flex items-center pl-3">
                <IconLock />
              </span>
              {{ loginLoader? IconLoading: 'Sign in' }}
            </button>

            <div v-if="loginErrorRes" class="mt-2 w-full">
              <p class="text-center text-sm text-[#a04f4f]">{{ loginErrorRes }}</p>
            </div>
          </Form>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}
</style>
