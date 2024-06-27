
/**
 * @description Validate the email form input value.
 * @param {string} value
 * @returns {string | boolean} isValid 
 */
export function validateEmail(value: any): string | boolean {
  // if the field is empty
  if (!value) {
    return 'This field is required';
  }

  // if the field is not a valid email
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  if (!regex.test(value)) {
    return 'This field must be a valid email';
  }

  // All is good
  return true;
}

/**
 * @description Validate the password form input value.
 * @param {string} value
 * @returns {string | boolean} isValid 
 */
export function validatePassword(value: any, args?: any, bypass?: boolean ): string | boolean {
  if (!value) return "Password field is required."
  if (bypass) return true
  if (value.length < 15) return "A minimum of 16 characters is required."

  return true;
}

/**
 * @description Validate the username form input field.
 * @param {string} value
 * @returns {string | boolean} isValid 
 */
export function validateUsername(value: any): string | boolean {
  if (!value) return "Username field is required.";
  if (typeof value === 'string' && value.length > 49) return "Provide a username of less than 50 characters.";
  if (typeof value === 'string' && value.length < 2) return "At least 2 characters are required.";

  return true;
}

/**
 * @description Validate the phone number form input field.
 * @param {string} value
 * @returns {string | boolean} isValid 
 */
export function validatePhoneNumber(value: any): string | boolean {
  if (typeof value === 'string' && value.length > 20) return "Provide a phone number of less than 20 characters.";
  if (typeof value === 'string' && value.length < 2) return "At least 2 characters are required.";

  // Alternative > /^[0-9()-]+$/g
  const numberRegex = /^(\(\d{3}\)|\d{3})-?\d{3}-?\d{4}$/g;
  if (!numberRegex.test(value)) return 'This field must be a valid phone number.';

  return true;
}

/**
 * @description A general validation. Make sure that a value was provided.
 * @param value 
 * @returns { string | boolean } a BOOLEAN or `true` or a STRING error.
 */
export function isRequired(value: any): string | boolean {
  if (!value || !value?.trim()) return "This field is required."

  return true;
}
