/**Code added by Unnati Bajaj on 24-05-2024
 * Reason- To have Signup page
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import signupStyle from "./Signup.module.css";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  checkIfMinimumThanMinValue,
  checkIsEmailInvalid,
  checkIsEmpty,
  checkIsNotADigit,
  checkIfSmallerThanMinLength,
  checkIfPasswordsMatch,
  checkIsPasswordValid,
} from "../../utils/validations";
import { signup } from "../../Api/services";
import notificationObject from "../../components/Widgets/Notification/Notification";

const Signup = () => {
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [contactNumberError, setContactNumberError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  /**Code added by Unnati on 12-06-2024
   * Reason -To show password when user clicks on eye icon
   */
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };
  /**End of code addition by Unnati on 12-06-2024
   * Reason -To show password when user clicks on eye icon
   */

  /**Code added by Unnati Bajaj on 12-06-2024
   * Reason -Spaces will not be taken as password
   */
  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value.replace(/\s/g, "");
    setConfirmPassword(newConfirmPassword);
    setConfirmPasswordError("");
  };
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value.replace(/\s/g, "");
    setPassword(newPassword);
    setPasswordError("");
  };
  /**End of code addition by Unnati Bajaj on 12-06-2024
   * Reason -Spaces will not be taken as password
   */

  /* Added by jhamman on 18-10-2024
  Reason - added check button for gender*/

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
  };
  /* End of addition by jhamman on 18-10-2024
  Reason - added check button for gender*/

  /**
   * Added by - Unnati Bajaj on 24-05-2024
   * Reason - To navigate to home page if token does not exist
   */
  useEffect(() => {
    if (localStorage.getItem("access")) {
      navigate("/");
    }
  }, [navigate]);
  /**
   * End of addition by - Ashish Dewangan on 24-05-2024
   * Reason - To navigate to home page if token does not exist
   */

  /**
   * Added by - Unnati Bajaj on 24-05-2024
   * Reason - To validate input on blur
   */
  const isValidOnBlur = (input, value) => {
    if (input === "email") {
      if (checkIsEmpty(value)) {
        setEmailError("Please enter email address");
        return false;
      } else {
        if (checkIsEmailInvalid(value)) {
          setEmailError("Please enter valid email");
          return false;
        }
      }
    }
    if (input === "password") {
      if (checkIsEmpty(value)) {
        setPasswordError("Please enter password");
        return false;
      } else {
        if (
          (checkIfMinimumThanMinValue(value, 8) ||
            checkIfSmallerThanMinLength(value, 8)) 
            /**Code added by Unnati on 30-10-2024
             * Reason-Added validation
             */
            &&
          !checkIsPasswordValid(value)
          /*End of code addition by Unnati on 30-10-2024
             * Reason-Added validation
             */
        ) {
          /**Code modified by Unnati on 30-10-2024
           * Reason-changed the message
           */
          // setPasswordError("Password must contain 8 characters");
          /**Code added by Unnati on 18-11-2024
           * Reason-Modified error message
           */
          setPasswordError(
            "Password must include at least one number, one uppercase letter, one lowercase letter, one special character, and be at least 8 characters long."
          );
          /**End of code modification by Unnati on 18-11-2024
           * Reason-Modified error message
           */
          /**End of code modification by Unnati on 30-10-2024
           * Reason-changed the message
           */
        }
      }
    }
    if (input === "confirm_password") {
      if (checkIsEmpty(value)) {
        setConfirmPasswordError("Please enter password again");
        return false;
      } else {
        /**Code commented by Unnati on 30-10-2024
         * *Reason-This code is not in use
         */
        // if (
        //   (checkIfMinimumThanMinValue(value, 8) ||
        //   checkIfSmallerThanMinLength(value, 8)) 
        // ) {
        //   setPasswordError(
        //     "Password must contain atleast one number and one uppercase and lowercase letter and atleast 8 or more characters"
        //   );
        //   return false;
        // }
        /**End of code additionby Unnati on 30-10-2024
         * *Reason-This code is not in use
         */
        if (
          !checkIfPasswordsMatch(
            document.getElementById("password").value,
            value
          )
        ) {
          /**Code added by Unnati on 12-10-2024
           * Reason-To change the validation message
           */
          setConfirmPasswordError("Password is not matching");
          /*End of code addition by Unnati on 12-10-2024
           * Reason-To change the validation message
           */
          return false;
        }
      }
    }
    if (input === "first_name") {
      if (checkIsEmpty(value)) {
        setFirstNameError("Please enter first name");
        return false;
      }
    }

    /* Uncommented by jhamman on 18-10-2024
    Reason - have to send mobile number*/
    if (input === "contact_number") {
      if (checkIsEmpty(value)) {
        setContactNumberError("Please enter contact number");
        return false;
      }
      // commentation by jhamman on 20-10-2024
      // Reason - dont want to validate because no. can have bracket
      //   else {
      //     if (!checkIsPhoneNoInvalid(value)) {
      //       setContactNumberError("Please enter a valid contact number");
      //     }
      //   }
      // End of commentation by jhamman on 20-10-2024
      // Reason - dont want to validate because no. can have bracket
    }
    /* End of uncommentation Uncommented by jhamman on 18-10-2024
    Reason - have to send mobile number*/
  };
  /**
   * End of code addition by - Unnati Bajaj on 24-05-2024
   * Reason - To validate input on blur
   */
  const isValidOnSubmit = (data) => {
    let isValid = true;

    if (checkIsEmpty(data.email)) {
      setEmailError("Please enter email address");
      isValid = false;
    } else {
      if (checkIsEmailInvalid(data.email)) {
        setEmailError("Please enter valid email");
        isValid = false;
      }
    }

    if (checkIsEmpty(data.password)) {
      setPasswordError("Please enter password");
      isValid = false;
    } else {
      if (
       
        !checkIsPasswordValid(data.password)
      ) {
        /**Code commented by Unnati on 28-10-2024
         * Reason-Changed validation message
         */
        // setPasswordError("Password must contain 8 characters");
        setPasswordError(
          "Password must contain atleast one number and one uppercase and lowercase letter and atleast 8 or more characters"
        );
        isValid = false;
        // } else {
        /**Code added by Unnati on 13-10-2024
         * Reason-Added validation for alphanumeric data
         */
        // if (checkIsPasswordInvalid(data.password)) {
        //   setPasswordError(
        //     "Password must include at least one special character and one alphanumeric character"
        //   );
        //   isValid = false;
        // }
        /**End of code commented by Unnati on 28-10-2024
         * Reason-Changed validation message
         */
        /**End of code addition by Unnati on 13-10-2024
         * Reason-Added validation for alphanumeric data
         */
      }
    }

    if (
      checkIsEmpty(data.confirm_password) 
    ) {
      setConfirmPasswordError(
        "Please enter password again"
      );
      isValid = false;
    }
    // } else {
    //   if (checkIfMinimumThanMinValue(data.confirm_password, 8)) {
    //     setPasswordError("Password must contain 8 characters");
    //     isValid = false;
    //   }
    // }

    if (checkIsEmpty(data.first_name)) {
      setFirstNameError("Please enter first name");
      isValid = false;
    } else {
      if (!checkIsNotADigit(data.first_name)) {
        setFirstNameError("Please enter a valid first name");
        isValid = false;
      }
    }

    /* uncommentation Uncommented by jhamman on 18-10-2024
    Reason - have to send mobile number*/
    if (checkIsEmpty(data.contact_number)) {
      setContactNumberError("Please enter contact number");
      isValid = false;
    }

    //Commented by jhamman on 20-10-2024
    // Reason - dont want to validate because no. can have bracket
    // else {
    //   if (!checkIsPhoneNoInvalid(data.contact_number)) {
    //     setContactNumberError("Please enter a valid contact number");
    //     isValid = false;
    //   }
    // }
    // End of commentation by jhamman on 20-10-2024
    // Reason - dont want to validate because no. can have bracket
    /* End of uncommentation Uncommented by jhamman on 18-10-2024
    Reason - have to send mobile number*/

    return isValid;
  };

  /**
   * Added by - Unnati Bajaj on 24-05-2024
   * Reason - To post signup details when user submits the form
   */
  const postSignupDetails = async (e) => {
    /* Added by jhamman on 11-10-2024
    Reason - check boh password are same or not*/
    if (e.target.password.value != e.target.confirm_password.value) {
      return;
    } else {
      /* End of addition by jhamman on 11-10-2024
    Reason - check boh password are same or not*/
      const data = {
        email: e.target.email.value,
        password: e.target.password.value,
        confirm_password: e.target.confirm_password.value,
        first_name: e.target.first_name.value,
        last_name: e.target.last_name.value,
        /* Uncommented by jhamman on 18-10-2024
        Reason - have to send mobile number*/
        /**Code commented by Unnati on 08-08-2024
         * Reason-Contact number is not in use currently
         */
        contact_number: e.target.contact_number.value,
        /* End of uncommentation Uncommented by jhamman on 18-10-2024
        Reason - have to send mobile number*/
        /**End of code commented by Unnati on 08-08-2024
         * Reason-Contact number is not in use currently
         */
        gender: selectedGender,
      };
      if (isValidOnSubmit(data)) {
        const response = await signup(data);
        /**Code added by Unnati on 13-06-2024
         * Reason -To display notification of success and error
         */
        if (response.success) {
          notificationObject.success(response.success);
          navigate("/login");
        } 
        // Added by - Ashlekh on 14-02-2025
        // Reason - If email is already registered then to show message
        else if (response.error == "Email already registered") {
          // notificationObject.success("An account with this email is already registered")
          notificationObject.open({
            type: 'warning',
            message: "An account with this email is already registered"
          });
        }
        // End of code - Ashlekh on 14-02-2025
        // Reason - If email is already registered then to show message
        else {
          /**Code added by Unnati on 13-10-2024
           * Reason-changed notification
           */
          notificationObject.error("Something went wrong");
          /**End of code addition by Unnati on 13-10-2024
           * Reason-changed notification
           */
        }
        /**End of code  addition by Unnati on 13-06-2024
         * Reason -To display notification of success and error
         */

        /**Code added by Unnati on 13-06-2024
         * Reason -To avoid repetative notification
         */
        // setTimeout(() => {
        //   setIsSubmitting(false);
        // }, 5000);
        /**End of code addition by Unnati on 13-06-2024
         * Reason -To avoid repetative notification
         */

        /**End of code  addition by Unnati on 13-06-2024
         * Reason -To display notification of success and error
         */
      }
    }
  };
  // }
  /**
   * End of code addition by - Unnati Bajaj on 24-05-2024
   * Reason - To post signup details when user submits the form
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // setIsSubmitting(true);
    await postSignupDetails(e);
  };

  return (
    <div className={`${signupStyle.pageFrame}`}>
      <div className={`${signupStyle.pageContainer}`}>
        {/**Code added by Unnati on 08-08-2024
         *Reason-Added page title */}
        <div className={`${signupStyle.loginTitle}`}>
          <h2>Create New Customer Account</h2>
        </div>
        {/*End of code addition by Unnati on 08-08-2024
         *Reason-Added page title */}
        <form onSubmit={handleSubmit}>
          <div className={`${signupStyle.signupContainer}`}>
            <div className={`${signupStyle.formContainer}`}>
              {/**Code added by Unnati on 08-08-2024
               *Reason-Added subtitle */}
              <div className={`${signupStyle.subTitleColor}`}>
                Personal Information
              </div>
              {/**End of code addition by Unnati on 08-08-2024
               *Reason-Added subtitle */}
              <div className={`${signupStyle.InputContainer}`}>
                <div className={`${signupStyle.formInputContainer}`}>
                  <div
                    className={`${signupStyle.labelField}`}
                    style={{ display: "flex" }}>
                    <div className={`${signupStyle.mandatoryLabel}`}>
                      <label className={`${signupStyle.subTitleColor}`}>
                        First Name
                      </label>
                      <span className={`${signupStyle.mandatoryField}`}>
                        *{" "}
                      </span>
                    </div>
                    {/* <label className={`${signupStyle.colon}`}> :</label> */}
                  </div>
                  <div className={`${signupStyle.InputError}`}>
                    <input
                      className={`${signupStyle.formInput}`}
                      type="text"
                      name="first_name"
                      placeholder="First Name"
                      maxLength={50}
                      onChange={(e) => setFirstNameError("")}
                      onBlur={(e) =>
                        isValidOnBlur("first_name", e.target.value)
                      }
                    />
                    <div className={`${signupStyle.formInputError}`}>
                      {firstNameError}
                    </div>
                  </div>
                </div>
                <div className={`${signupStyle.formInputContainer}`}>
                  <div
                    className={`${signupStyle.labelField}`}
                    style={{ display: "flex" }}>
                    {/**Code added by Unnati on 08-08-2024
                     *Reason-Added subtitle color */}
                    <label className={`${signupStyle.subTitleColor}`}>
                      Last Name
                    </label>
                    {/**End of code addition by Unnati on 08-08-2024
                     *Reason-Added subtitle color */}
                    <span
                      className={`${signupStyle.mandatoryField}`}
                      style={{ visibility: "hidden" }}>
                      *
                    </span>
                    {/* <label className={`${signupStyle.colon}`}>:</label> */}
                  </div>
                  <div className={`${signupStyle.InputError}`}>
                    <input
                      className={`${signupStyle.formInput}`}
                      type="text"
                      name="last_name"
                      maxLength={50}
                      placeholder="Last Name"
                      onChange={(e) => setLastNameError("")}
                      onBlur={(e) => isValidOnBlur("last_name", e.target.value)}
                    />
                    <div className={`${signupStyle.formInputError}`}>
                      {lastNameError}
                    </div>
                  </div>
                </div>
              </div>
              {/* Added by jhamman on 18-10-2024
                Reason - Added field for mobile number*/}
              <div className={`${signupStyle.InputContainer}`}>
                <div className={`${signupStyle.formInputContainer}`}>
                  <div
                    className={`${signupStyle.labelField}`}
                    style={{ display: "flex" }}>
                    <label className={`${signupStyle.subTitleColor}`}>
                      Contact Number
                    </label>
                    <span className={`${signupStyle.mandatoryField}`}>*</span>
                  </div>
                  <div className={`${signupStyle.InputError}`}>
                    <input
                      className={`${signupStyle.formInput}`}
                      type="text"
                      name="contact_number"
                      maxLength={50}
                      placeholder="Contact Number"
                      onChange={(e) => setContactNumberError("")}
                      onBlur={(e) =>
                        isValidOnBlur("contact_number", e.target.value)
                      }
                    />
                    <div className={`${signupStyle.formInputError}`}>
                      {contactNumberError}
                    </div>
                  </div>
                </div>
                <div className={`${signupStyle.formInputContainer}`}>
                  <div
                    className={`${signupStyle.labelField}`}
                    style={{ display: "flex" }}>
                    <label className={`${signupStyle.subTitleColor}`}>
                      Gender
                    </label>
                    <span
                      className={`${signupStyle.mandatoryField}`}
                      style={{ visibility: "hidden" }}>
                      *
                    </span>
                  </div>
                  <div className={`${signupStyle.InputError}`}>
                    {/* <input
                      className={`${signupStyle.formInput}`}
                      type="text"
                      name="last_name"
                      maxLength={50}
                      placeholder="Last Name"
                      onChange={(e) => setLastNameError("")}
                      onBlur={(e) => isValidOnBlur("last_name", e.target.value)}
                    /> */}
                    <div className={signupStyle.genderOptionsContainer}>
                      <div className={`${signupStyle.genderLabelAndInput}`}>
                        <input
                          type="radio"
                          id="male"
                          name="gender"
                          // Code changed by - Ashlekh on 10-02-2025
                          // Reason - To keep first letter in upper case
                          // value="male"
                          // checked={selectedGender === "male"}
                          value="Male"
                          checked={selectedGender === "Male"}
                          // End of code - Ashlekh on 10-02-2025
                          // Reason - To keep first letter in upper case
                          onChange={handleGenderChange}
                          // Added by - Ashlekh on 15-02-2025
                          // Reason - Added class name
                          className={`${signupStyle.genderRadioButton}`}
                          // End of code - Ashlekh on 15-02-2025
                          // Reason - Added class name
                        />
                        <label
                        // Added by - Ashlekh on 10-12-2024
                        // Reason - To select gender if user clicks on text 
                        htmlFor="male"
                        // End of code - Ashlekh on 10-12-2024
                        // Reason - To select gender if user clicks on text
                        className={`${signupStyle.genderOption}`}>
                          Male
                        </label>
                      </div>
                      <div className={`${signupStyle.genderLabelAndInput}`}>
                        <input
                          type="radio"
                          id="female"
                          name="gender"
                          // Code changed by - Ashlekh on 10-02-2025
                          // Reason - To keep first letter in upper case
                          // value="female"
                          // checked={selectedGender === "female"}
                          value="Female"
                          checked={selectedGender === "Female"}
                          // End of code - Ashlekh on 10-02-2025
                          // Reason - To keep first letter in upper case
                          onChange={handleGenderChange}
                          // Added by - Ashlekh on 15-02-2025
                          // Reason - Added class name
                          className={`${signupStyle.genderRadioButton}`}
                          // End of code - Ashlekh on 15-02-2025
                          // Reason - Added class name
                        />
                        <label
                        // Added by - Ashlekh on 10-12-2024
                        // Reason - To select gender if user clicks on text 
                        htmlFor="female" 
                        // End of code - Ashlekh on 10-12-2024
                        // Reason - To select gender if user clicks on text
                        className={`${signupStyle.genderOption}`}>
                          Female
                        </label>
                      </div>
                      <div className={`${signupStyle.genderLabelAndInput}`}>
                        <input
                          type="radio"
                          id="other"
                          name="gender"
                          // Code changed by - Ashlekh on 10-02-2025
                          // Reason - To keep first letter in upper case
                          // value="other"
                          // checked={selectedGender === "other"}
                          value="others"
                          checked={selectedGender === "others"}
                          // End of code - Ashlekh on 10-02-2025
                          // Reason - To keep first letter in upper case
                          onChange={handleGenderChange}
                          // Added by - Ashlekh on 15-02-2025
                          // Reason - Added class name
                          className={`${signupStyle.genderRadioButton}`}
                          // End of code - Ashlekh on 15-02-2025
                          // Reason - Added class name
                        />
                        <label
                        // Added by - Ashlekh on 10-12-2024
                        // Reason - To select gender if user clicks on text 
                        htmlFor="other" 
                        // End of code - Ashlekh on 10-12-2024
                        // Reason - To select gender if user clicks on text
                        className={`${signupStyle.genderOption}`}>
                          Other
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* End of addition by jhamman on 18-10-2024
                Reason - Added field for mobile number*/}
              {/**Code commented by Unnati on 08-08-2024
               *Reason-This code is not in use */}
              {/* <div className={`${signupStyle.formInputContainer}`}>
              <div
                className={`${signupStyle.labelField}`}
                style={{ display: "flex", width: "40%" }}
              >
                <span className={`${signupStyle.mandatoryField}`}>*</span>
                <label className={`${signupStyle.labels}`}>
                  Contact Number
                </label>
                <label className={`${signupStyle.colon}`}>:</label>
              </div>
              <div className={`${signupStyle.InputError}`}>
                <input
                  className={`${signupStyle.formInput}`}
                  type="text"
                  name="contact_number"
                  maxLength={50}
                  onChange={(e) => setContactNumberError("")}
                  onBlur={(e) =>
                    isValidOnBlur("contact_number", e.target.value)
                  }
                />
                <div className={`${signupStyle.formInputError}`}>
                  {contactNumberError}
                </div>
              </div>
            </div> */}
              {/**End of code commented by Unnati on 08-08-2024
               *Reason-This code is not in use */}
              {/**Code added by Unnati on 08-08-2024
               *Reason-Added login link */}
              <div className={`${signupStyle.forgotPassword}`}>
                <p style={{ color: "black" }}>Already have an account?</p>
                <Link
                  /* Modified by jhamman on 19-10-2024
                Reason - Added a design to link*/
                  // style={{ fontSize: "15px", paddingBottom: "100px" }}
                  /* End of modification by jhamman on 19-10-2024
                Reason - Added a design to link*/
                className={signupStyle.forgetPasswordLink}
                  to="/login">
                  Login
                </Link>
                {/* <p className={`${signupStyle.socialLink}`}><CiFacebook size={30}/><FaInstagram size={30} /><FaGoogle size={28}/></p> */}
              </div>
              {/**End of code addition by Unnati on 08-08-2024
               *Reason-Added login link */}
            </div>
            {/**Code added by Unnati on 08-08-2024
             *Reason-Created a container that will have sign in information */}
            <div className={`${signupStyle.signinInformation}`}>
              <div className={`${signupStyle.subTitleColor}`}>
                Sign-in Information
              </div>
              <div className={`${signupStyle.signinInformationContainer}`}>
                <div className={`${signupStyle.formInputContainer}`}>
                  <div
                    className={`${signupStyle.labelField}`}
                    style={{ display: "flex" }}>
                    <label className={`${signupStyle.subTitleColor}`}>
                      Email
                    </label>
                    <span className={`${signupStyle.mandatoryField}`}>*</span>
                  </div>
                  <div className={`${signupStyle.InputError}`}>
                    <input
                      className={`${signupStyle.formInput}`}
                      type="text"
                      name="email"
                      placeholder="Email"
                      maxLength={50}
                      onChange={(e) => setEmailError("")}
                      onBlur={(e) => isValidOnBlur("email", e.target.value)}
                    />
                    <div className={`${signupStyle.formInputError}`}>
                      {emailError}
                    </div>
                  </div>
                </div>
                <div className={`${signupStyle.formInputContainer}`}>
                  <div
                    className={`${signupStyle.labelField}`}
                    style={{ display: "flex" }}>
                    <label className={`${signupStyle.subTitleColor}`}>
                      Password
                    </label>
                    <span className={`${signupStyle.mandatoryField}`}>*</span>
                  </div>
                  {/**Code added by Unnati on 12-10-2024
                   *Reason-Modifie css */}
                  <div
                    className={`${signupStyle.InputError}`}
                    style={{
                      position: "relative",
                      alignitems: "center",
                      display: "flex",
                      justifycontent: "center",
                    }}>
                    {/**End of code addition by Unnati on 12-10-2024
                     *Reason-Modifie css */}
                    <input
                      className={`${signupStyle.formInput}`}
                      type={passwordVisible ? "text" : "password"}
                      autoComplete="new-password"
                      name="password"
                      id="password"
                      placeholder="Password"
                      value={password}
                      onChange={handlePasswordChange}
                      maxLength={16}
                      onBlur={(e) => isValidOnBlur("password", e.target.value)}
                      onPaste={(e) => e.preventDefault()}
                      onCopy={(e) => e.preventDefault()}
                      style={{
                        paddingRight: "40px",
                        backgroundImage: `url(${
                          passwordVisible ? "/eye-slash.svg" : "/eye.svg"
                        })`,
                        backgroundPosition: "right",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "20px",
                      }}
                    />
                    {/**Code added by Unnati on 12-10-2024
                     *Reason-Arranged eye icon */}
                    <div
                      onClick={togglePasswordVisibility}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "20%",
                        // transform: "translateY(-50%)",
                        cursor: "pointer",
                      }}>
                      {/* Code changed by - Ashlekh on 06-12-2024
                      Reason - To change working of password icon hidden/visible */}
                      {/* {passwordVisible ? <FaEyeSlash /> : <FaEye />} */}
                      {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                      {/* End of code - Ashlekh on 06-12-2024
                      Reason - To change working of password icon hidden/visible */}
                    </div>
                    {/**End of code addition by Unnati on 12-10-2024
                     *Reason-Arranged eye icon */}
                  </div>
                  <div className={`${signupStyle.formInputError}`}>
                    {passwordError}
                  </div>
                </div>

                <div className={`${signupStyle.formInputContainer}`}>
                  <div
                    className={`${signupStyle.labelField}`}
                    style={{ display: "flex" }}>
                    <label className={`${signupStyle.subTitleColor}`}>
                      Confirm Password
                    </label>
                    <span className={`${signupStyle.mandatoryField}`}>*</span>
                  </div>
                  <div
                    className={`${signupStyle.InputError}`}
                    style={{ position: "relative" }}>
                    <input
                      className={`${signupStyle.formInput}`}
                      type={confirmPasswordVisible ? "text" : "password"}
                      autoComplete="new-password"
                      name="confirm_password"
                      placeholder="Confirm Password"
                      maxLength={16}
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      onBlur={(e) =>
                        isValidOnBlur("confirm_password", e.target.value)
                      }
                      onPaste={(e) => e.preventDefault()}
                      onCopy={(e) => e.preventDefault()}
                      style={{
                        paddingRight: "40px",
                        backgroundImage: `url(${
                          confirmPasswordVisible ? "/eye-slash.svg" : "/eye.svg"
                        })`,
                        backgroundPosition: "right",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "20px",
                      }}
                    />
                    {/**Code added by Unnati on 12-10-2024
                     *Reason-Arranged eye icon */}
                    <div
                      onClick={toggleConfirmPasswordVisibility}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "20%",
                        // transform: "translateY(-50%)",
                        cursor: "pointer",
                      }}>
                      {/* Code changed by - Ashlekh on 06-12-2024
                      Reason - To change working of password icon hidden/visible */}
                      {/* {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />} */}
                      {confirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
                      {/* End of code - Ashlekh on 06-12-2024
                      Reason - To change working of password icon hidden/visible */}
                    </div>
                    {/**End of code addition by Unnati on 12-10-2024
                     *Reason-Arranged eye icon */}
                    <div className={`${signupStyle.formInputError}`}>
                      {confirmPasswordError}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className={`${signupStyle.signinInformation}`}> */}
          <div className={`${signupStyle.createAccountButton}`}>
            <div className={`${signupStyle.formButtonContainer}`}>
              <input
                type="submit"
                value={"Create an account"}
                // disabled={isSubmitting}
                className={`${signupStyle.signupButton}`}
              />
            </div>
            {/**End of code addition by Unnati on 08-08-2024
             *Reason-Created a container that will have sign in information */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
/**End of code addition by Unnati Bajaj on 24-05-2024
 * Reason- To have Signup page
 */
