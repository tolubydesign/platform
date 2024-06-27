/**
 * @description Verify that provided password matches server known password.
 * @param dbPassword 
 * @param password 
 * @returns 
 * 
 * @see {@link https://github.com/firebase007/JWT_VUE_APP/blob/c32f4423a35ba5958ff94188b873479b0ca749fb/app/helpers/validation.js#L83}
 */
export function validPassword(dbPassword?: string, password?: string): boolean {
  if (!dbPassword || !password) return false
  return (password === dbPassword) ? true : false;
}

/**
 * @description List the graphql queries and mutations that are exempt from token validation.
 * @param queries 
 * @param mutations 
 */
export function registerTokenExemptRequests(queries: string[], mutations: string[]): string[] {
  const exemptRequests: string[] = [];
  const allowed = [
    "verifyUser",
    "SignIn",
    "getAccount",
    "accounts",
    "userSignIn",
    "IntrospectionQuery",
  ]

  // An Apollo Sandbox request.
  exemptRequests.push("IntrospectionQuery");

  queries.forEach((query: string) => {
    if (allowed.includes(query)) {
      exemptRequests.push(query)
    }
  });

  mutations.forEach((query: string) => {
    if (allowed.includes(query)) {
      exemptRequests.push(query)
    }
  });


  return exemptRequests
}
