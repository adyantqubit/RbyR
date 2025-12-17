/**
 * Created by - Ashish Dewangan on 22-05-2024
 * Reason - To have different validation methods
 */
 
export const checkIsEmailInvalid = (value) => {
  const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]/;
  if (pattern.test(value)) return false;

  return true;
};
 
export const checkIsNotADigit = (value) => {
  if (isNaN(value)) return true;
  return false;
};

export const checkIsEmpty = (value) => {
  if (value && value.toString().trim().length > 0) return false;
  return true;
};

export const checkIfGreaterThanMaxLength = (value, length) => {
  if (value && value.toString().trim().length > length) return true;
  return false;
};

export const checkIfSmallerThanMinLength = (value, length) => {
  if (value && value.toString().trim().length < length) return true;
  return false;
};

export const checkIfGreaterThanMaxValue = (value, maximum) => {
  if (value && maximum && value >= maximum) return true;
  return false;
};
export const checkIfMinimumThanMinValue = (value, minimum) => {
  if (value && minimum && value <= minimum) return true;
  return false;
};
/**Added by Unnati Bajaj on 27-05-2024
 * Reason - To check phone number format and if password and confirm password should match 
 */
export const checkIsPhoneNoInvalid = (value) => {
  const pattern= /^[6-9]\d{9}$/;
  if(pattern.test(value)) return true;
  return false;
};
export const checkIfPasswordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};
/**End of code addition by Unnati Bajaj on 27-05-2024
 * Reason - To check phone number format and if password and confirm password should match 
 */
/**Code commented by Unnati on 30-10-2024
 * Reason-This code is not in use
 */
// export const checkIsPasswordInvalid = (value) => {
//   const pattern =
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
//   return !pattern.test(value); // Returns true if invalid
// };
/**End of code addition by Unnati on 30-10-2024
 * Reason-This code is not in use
 */
/**Code added by Unnati on 30-10-2024
 * Reason-To check password is valid or not
 */
export const checkIsPasswordValid = (value) => {
  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
  return pattern.test(value); 
};
/*End of code addition by Unnati on 30-10-2024
 * Reason-To check password is valid or not
 */
