
type ErrorType = "unauthorized" | "not found" | "bad request" | "";

type SetErrors = { 
  [key in ErrorType]: { code: number, name: string, message: string} 
}

const errorTypes: SetErrors = {
  unauthorized: {
    code: 401,
    name: "Unauthorized",
    message: "Unauthorised action requested. Please provide a valid authentication.",
  },
  "not found": {
    code: 404,
    name: "Not Found",
    message: "The requested resource could not be found",
  },
  "bad request": {
    code: 400,
    name: "Bad Request",
    message: "The server cannot or will not process the request due to an apparent client error.",
  },
  "": {
    code: 0,
    name: "",
    message: "",
  },
}

/**
 * @description Error handler to get error codes and message responses based on the error type you wish to push. 
 * @param errorName 
 * @param errorMessage 
 * @returns 
 * 
 * @see {@link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes}
 * @see {@link https://bobbyhadz.com/blog/typescript-index-signature-parameter-cannot-be-union-type}
 */
export function ErrorHandler(errorName: ErrorType, errorMessage?: string) {
  if (errorMessage) return {
    code: errorTypes[errorName].code,
    message: errorMessage,
    name: errorTypes[errorName].name,
  }

  return {
    code: errorTypes[errorName].code,
    message: errorTypes[errorName].message,
    name: errorTypes[errorName].name,
  }
}