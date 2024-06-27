
/**
 * @description 
 * @param error 
 * @returns 
 */
export function handleAxiosError(error: Error) {  
  return new Error(error.message)
}  