/**Code added by Unnati on 26-05-2024
 * Reason -To have forgot password page
 */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import forgotStyle from "./ForgotPassword.module.css";
import {
  sendOtpApi,
  verifyOtpApi,
  updatePasswordApi,
} from "../../Api/services";
import notificationObject from "../../components/Widgets/Notification/Notification";
import { useNavigate } from "react-router-dom";
import { checkIsPasswordValid } from "../../utils/validations";
const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailErrors, setEmailErrors] = useState([]);
  const [otpErrors, setOtpErrors] = useState([]);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [confirmPasswordErrors, setConfirmPasswordErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  /**Code added by Unnati on 26-05-2024
   * Reason to validate email
   */
  function validateEmail(text) {
    const errors = [];
    if (!text) {
      errors.push("Please enter Email");
    } else if (
      !text.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      errors.push(
        "Please enter Email in the correct format (example@gmail.com)"
      );
    }
    return errors;
  }

  /**End of code addition by Unnati on 26-05-2024
   * Reason to validate email
   */

  /**Code added by Unnati on 26-05-2024
   * Reason to validate password
   */
  function validateOtp(text) {
    const errors = [];
    if (!text) {
      errors.push("Please enter OTP");
    } else if (text.length < 4) {
      errors.push("OTP should not be less than 4 digits");
    }
    return errors;
  }

  /**End of code addition by Unnati on 26-05-2024
   * Reason to validate password
   */

  /**Code added by Unnati on 26-05-2024
   * Reason to validate password
   */
  function validatePassword(text) {
    const errors = [];
    if (!text) {
      errors.push("Please enter a new password");
    }
    /**Code added by Unnati on 30-10-2024
     * Reason-Added validation for password
     */
    // else if ((text.length < 8) &&   checkIsPasswordInvalid(text)) {
    //   // errors.push("Password must be at least 8 characters long");
    //   errors.push("Password must contain atleast one number and one uppercase and lowercase letter and atleast 8 or more characters")
    // }
    else if (!checkIsPasswordValid(text)) {
      /**Code added by Unnati on 18-11-2024
       * Reason-Modified error message
       */
      errors.push(
        "Password must include at least one number, one uppercase letter, one lowercase letter, one special character, and be at least 8 characters long."
      );
      /**End of code addition by Unnati on 18-11-2024
       * Reason-Modified error message
       */
    }
    /*End of code addition by Unnati on 30-10-2024
     * Reason-Added validation for password
     */
    return errors;
  }

  /**End of code addition by Unnati on 26-05-2024
   * Reason to validate password
   */

  /**Code added by Unnati on 26-05-2024
   * Reason to validate password
   */
  function validateConfirmPassword(text) {
    const errors = [];
    if (!text) {
      errors.push("Please confirm your password");
    } else if (text !== newPassword) {
      errors.push("Password and confirm password should be the same");
    }
    return errors;
  }
  /**End of code addition by Unnati on 26-05-2024
   * Reason to validate password
   */
  async function handleEmailSubmit(e) {
    e.preventDefault();

    // Commented by Jhamman on 14-10-2024
    // Reason - adding it below
    // Added by jhamman 0n 13-10-2024
    // Reason - disacled button after click on send otp
    // setButtonDisabled(true);
    // setSuccessMessage("Sending OTP...")
    // End of addition by jhamman 0n 13-10-2024
    // Reason - disacled button after click on send otp
    // End of commentation by Jhamman on 14-10-2024
    // Reason - adding it below
    const formData = new FormData(e.currentTarget);
    const inputEmail = formData.get("email");
    const emailValidationErrors = validateEmail(inputEmail);

    setEmailErrors(emailValidationErrors);
    if (emailValidationErrors.length === 0) {
      // Added by jhamman 0n 14-10-2024
      // Reason - disacled button after click on send otp
      // setButtonDisabled(true);
      /**Code added by Unnati on 22-11-2024
       * Reason-Added loader
       */
      setIsLoading(true); 
      /**End of code addition by Unnati on 22-11-2024
       * Reason-Added loader
       */
      // setSuccessMessage("Sending OTP...");
      // End of addition by jhamman 0n 14-10-2024
      // Reason - disacled button after click on send otp
      try {
        const res = await sendOtpApi({ email: inputEmail });

        if (res.msg) {
          setSuccessMessage(
            // Modified by jhamman 0n 13-10-2024
            // Reason - message displaying very late
            // res.msg
            "OTP sent successfully"
            // End of modification by jhamman 0n 13-10-2024
            // Reason - message displaying very late
          );
          notificationObject.success("OTP sent successfully");
          setEmail(inputEmail);
          setErrorMessage("");
          setStep(2);
          // Added by jhamman 0n 13-10-2024
          // Reason - Show button after otp send successfully
          setButtonDisabled(false);
          // End of addition by jhamman 0n 13-10-2024
          // Reason - Show button after otp send successfully
        } else {
          /* Modified by jhamman on 11-10-2024
          Reason - previous message is wrong*/
          // setErrorMessage(res.error || "Please enter the valid OTP");
          setErrorMessage(res.error || "Email id is not registered");
          /* End of modification by jhamman on 11-10-2024
          Reason - previous message is wrong*/
          setSuccessMessage("");
        }
      } catch (err) {
        /* Modified by jhamman on 11-10-2024
          Reason - previous message is wrong*/
        // setErrorMessage("Please enter the valid OTP");
        setButtonDisabled(false);
        setErrorMessage("Email id is not registered");
        /* End of modification by jhamman on 11-10-2024
          Reason - previous message is wrong*/
        setSuccessMessage("");
      }
      /**Code added by Unnati on 22-11-2024
       * Reason-Added loader
       */
      finally {
        setIsLoading(false);
        
      }
      /**End of code addition by Unnati on 22-11-2024
       * Reason-Added loader
       */
    }
  }
  /**Code added by Unnati on 26-05-2024
   * Reason -To handle otp submit
   */
  async function handleOtpSubmit(e) {
    e.preventDefault();
    setSuccessMessage("");

    /* Added by Jhamman on 13-10-2024
    Reason - to disable button after click*/
    // setIsSubmitButtonDisabled(true);
    /*End of addition by Jhamman on 13-10-2024
    Reason - to disable button after click*/

    const formData = new FormData(e.currentTarget);
    const inputOtp = formData.get("otp");
    const otpValidationErrors = validateOtp(inputOtp);

    setOtpErrors(otpValidationErrors);
    if (otpValidationErrors.length === 0) {
      try {
        const res = await verifyOtpApi({ email: email, otp: inputOtp });
        if (res.msg) {
          setSuccessMessage(res.msg);
          setOtp(inputOtp);
          setErrorMessage("");
          setStep(3);
        } else {
          setErrorMessage(res.error || "Invalid OTP. Please try again.");
          setSuccessMessage("");
        }
      } catch (err) {
        setErrorMessage("Please enter valid OTP");
        setSuccessMessage("");
      }
    }
  }

  /**End of code addition by Unnati on 26-05-2024
   * Reason -To handle otp submit
   */
  /**Code added by Unnati on 26-05-2024
   * Reason -To handle password submit
   */
  async function handlePasswordSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const inputPassword = formData.get("newPassword");
    const inputConfirmPassword = formData.get("confirmPassword");
    const passwordValidationErrors = validatePassword(inputPassword);
    const confirmPasswordValidationErrors =
      validateConfirmPassword(inputConfirmPassword);

    setPasswordErrors(passwordValidationErrors);
    setConfirmPasswordErrors(confirmPasswordValidationErrors);

    if (
      passwordValidationErrors.length === 0 &&
      confirmPasswordValidationErrors.length === 0
    ) {
      try {
        const res = await updatePasswordApi({
          email,
          password: inputPassword,
        });
        /**Code added by Unnati on 26-05-2024
         * Reason -To show error or success message
         */
        if (res.msg) {
          setSuccessMessage(res.msg);
          setErrorMessage("");
          setStep(4);
          // Added by - Ashlekh on 26-11-2024
          // Reason - If password is updated then to show notification message
          notificationObject.success("Password is updated successfully");
          // End of code - Ashlekh on 26-11-2024
          // Reason - If password is updated then to show notification message
        } else {
          setErrorMessage(
            res.error || "Something went wrong! Please try again later."
          );
          setSuccessMessage("");
        }
      } catch (err) {
        setErrorMessage("Something went wrong! Please try again later.");
        setSuccessMessage("");
      }
    }
    /**End of code addition by Unnati on 26-05-2024
     * Reason -To show error or success message
     */
  }

  async function handleNavigateLogin(e) {
    navigate("/login");
  }

  /**End of code addition by Unnati on 26-05-2024
   * Reason -To handle password submit
   */
  return (
    <div className={forgotStyle.pageFrame}>
      <div className={forgotStyle.pageContainer}>
        <div className={forgotStyle.formContainer}>
          <form
            onSubmit={
              step === 1
                ? handleEmailSubmit
                : step === 2
                ? handleOtpSubmit
                : step === 3
                ? handlePasswordSubmit
                : handleNavigateLogin
            }
          >
            <div className={forgotStyle.forgotPasswordTitle}>
              <h2>
                {step === 1
                  ? "Forgot Your Password?"
                  : step === 2
                  ? "Verify OTP"
                  : "Reset Password"}
              </h2>
            </div>
            {step === 1 && (
              <div className={forgotStyle.formInputContainer}>
                <div
                  className={forgotStyle.labelField}
                  // Commented by jhamman on 24-10-2024
                  // Reason - added css externally
                  // style={{ display: "flex", width: "40%" }}
                  // End of commentation by jhamman on 24-10-2024
                  // Reason - added css externally
                >
                  <div className={forgotStyle.mandatoryLabel}>
                    <span className={forgotStyle.mandatoryField}>* </span>
                    {/**Code added by Unnati on 08-08-2024
                     *Reason-To subtitle color classname */}
                    <label className={forgotStyle.subTitleColor}>Email</label>
                  </div>
                  {/**End of code addition by Unnati on 08-08-2024
                   *Reason-To subtitle color classname */}
                  <label className={forgotStyle.colon}>:</label>
                </div>
                <div className={forgotStyle.InputError}>
                  <input
                    className={forgotStyle.formInput}
                    type="text"
                    name="email"
                    maxLength={50}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailErrors([]);
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    /* Added by jhamman on 19-10-2024
                    Reason - disable input box when otp sending*/
                    disabled={successMessage}
                    /* End of addition by jhamman on 19-10-2024
                    Reason - disable input box when otp sending*/
                  />
                  <div className={forgotStyle.formInputError}>
                    {emailErrors.join(", ")}
                  </div>
                  {/* Added by Jhamman on 18-10-2024
            Reason - firstly it added below after requirment it added above*/}
                  <div className={forgotStyle.formInputSuccess}>
                    {errorMessage && (
                      <div className={forgotStyle.errorMessage}>
                        {errorMessage}
                      </div>
                    )}
                    {successMessage && (
                      <div className={forgotStyle.successMessage}>
                        {successMessage}
                      </div>
                    )}
                  </div>
                  {/* End of addition by Jhamman on 18-10-2024
            Reason - firstly it added below after requirment it added above*/}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className={forgotStyle.formInputContainer}>
                <div
                  className={forgotStyle.labelField}
                  style={{ display: "flex", width: "40%" }}
                >
                  <div className={forgotStyle.mandatoryLabel}>
                    <span className={forgotStyle.mandatoryField}>* </span>
                    {/**Code added by Unnati on 08-08-2024
                     *Reason-To subtitle color classname */}
                    <label className={forgotStyle.subTitleColor}>OTP</label>
                    {/**End of code addition by Unnati on 08-08-2024
                     *Reason-To subtitle color classname */}
                  </div>
                  <label className={forgotStyle.colon}>:</label>
                </div>
                <div className={forgotStyle.InputError}>
                  <input
                    className={forgotStyle.formInput}
                    // Code changed by - Ashlekh on 02-12-2024
                    // Reason - To change input from text to number
                    // type="text"
                    type="number"
                    // End of code - Ashlekh on 02-12-2024
                    // Reason - To change input from text to number
                    name="otp"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      // Code changed by - Ashlekh on 02-12-2024
                      // Reason - To apply maxlength of 6 digits
                      const value = e.target.value;
                      if (value?.length<=6){
                        setOtp(value);
                      }
                      // setOtp(e.target.value);
                      // End of code - Ashlekh on 02-12-2024
                      // Reason - To apply maxlength of 6 digits
                      setOtpErrors([]);
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                  />
                  <div className={forgotStyle.formInputError}>
                    {otpErrors.join(", ")}
                  </div>
                  {/* Added by Jhamman on 18-10-2024
            Reason - firstly it added below after requirment it added above*/}
                  <div className={forgotStyle.formInputSuccess}>
                    {errorMessage && (
                      <div className={forgotStyle.errorMessage}>
                        {errorMessage}
                      </div>
                    )}
                    {successMessage && (
                      <div className={forgotStyle.successMessage}>
                        {successMessage}
                      </div>
                    )}
                  </div>
                  {/* End of addition by Jhamman on 18-10-2024
            Reason - firstly it added below after requirment it added above*/}
                </div>
              </div>
            )}

            {step === 3 && (
              <>
                <div className={forgotStyle.formInputContainer}>
                  <div
                    className={forgotStyle.labelField}
                    style={{ display: "flex", width: "40%" }}
                  >
                    <div className={forgotStyle.mandatoryLabel}>
                      <span className={forgotStyle.mandatoryField}>* </span>
                      {/**Code added by Unnati on 08-08-2024
                       *Reason-To subtitle color classname */}
                      <label className={forgotStyle.subTitleColor}>
                        New Password
                      </label>
                      {/**End of code addition by Unnati on 08-08-2024
                       *Reason-To subtitle color classname */}
                    </div>
                    <label className={forgotStyle.colon}>:</label>
                  </div>
                  <div className={forgotStyle.InputError}>
                    <input
                      className={forgotStyle.formInput}
                      type="password"
                      name="newPassword"
                      maxLength={50}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setPasswordErrors([]);
                        setErrorMessage("");
                        setSuccessMessage("");
                      }}
                    />
                    <div className={forgotStyle.formInputError}>
                      {passwordErrors.join(", ")}
                    </div>
                  </div>
                </div>
                <div className={forgotStyle.formInputContainer}>
                  <div
                    className={forgotStyle.labelField}
                    style={{ display: "flex", width: "40%" }}
                  >
                    <div className={forgotStyle.mandatoryLabel}>
                      <span className={forgotStyle.mandatoryField}>* </span>
                      {/**Code added by Unnati on 08-08-2024
                       *Reason-To subtitle color classname */}
                      <label className={forgotStyle.subTitleColor}>
                        Confirm Password
                      </label>
                      {/**End of code addition by Unnati on 08-08-2024
                       *Reason-To subtitle color classname */}
                    </div>
                    <label className={forgotStyle.colon}>:</label>
                  </div>
                  <div className={forgotStyle.InputError}>
                    <input
                      className={forgotStyle.formInput}
                      type="password"
                      name="confirmPassword"
                      maxLength={50}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setConfirmPasswordErrors([]);
                        setErrorMessage("");
                        setSuccessMessage("");
                      }}
                    />
                    <div className={forgotStyle.formInputError}>
                      {confirmPasswordErrors.join(", ")}
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className={forgotStyle.formActions}>
              {/* {step !== 4 && ( */}
              <button
                className={forgotStyle.submitButton}
                type="submit"
                style={buttonDisabled ? { display: "none" } : {}}
              >
              {/**Code addition by Unnati on 22-11-2024
              *Reason-Added isLoading condition */}
                {isLoading ? (
                  <span className={forgotStyle.loader}></span> 
                ) : step === 1 ? (
                  "Send OTP"
                ) : step === 2 ? (
                  "Verify OTP"
                ) : step === 3 ? (
                  "Update Password"
                ) : (
                  "Go to login"
                )}
                {/**End of code addition by Unnati on 22-11-2024
              *Reason-Added isLoading condition */}
              </button>
              {/* )} */}
            </div>

            {/* Commented by Jhamman on 11-10-2024
            Reason - Added it above*/}
            {/* {errorMessage && (
              <div className={forgotStyle.errorMessage}>{errorMessage}</div>
            )}
            {successMessage && (
              <div className={forgotStyle.successMessage}>{successMessage}</div>
            )} */}
            {/* End of commentation by Jhamman on 11-10-2024
            Reason - Added it above*/}
          </form>
          {/* <div className={forgotStyle.linkContainer}>
            {step === 4 ? (
              <Link to="/login" className={forgotStyle.backToLoginLink}>
                Back to Login
              </Link>
            ) : (
              <Link to="/login" className={forgotStyle.loginLink}>
                Login
              </Link>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
/**End of code addition by Unnati on 26-05-2024
 * Reason -To have forgot password page
 */
