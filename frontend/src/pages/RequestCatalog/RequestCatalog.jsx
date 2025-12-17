/**Code added by Unnati on 22-08-2024
 * Reason-To have request catalog page
 */

import React from "react";
import { useState, useEffect, useContext } from "react";
import Styles from "./RequestCatalog.module.css";
import {
  checkIsEmailInvalid,
  checkIsEmpty,
  checkIsNotADigit,
} from "../../utils/validations";
import notificationObject from "../../components/Widgets/Notification/Notification";
import { catalogRequest } from "../../Api/services";
import NavigationPath from "../../components/NavigationPath/NavigationPath";
import { GlobalContext } from "../../context/Context";
import config from "../../Api/config";
const RequestCatalog = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [emailError, setEmailError] = useState("");
  const [contactNumberError, setContactNumberError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [addressLine1Error, setAddressLine1Error] = useState("");
  const [cityError, setCityError] = useState("");
  const [zipcodeError, setZipcodeError] = useState("");
  const [stateError, setStateError] = useState("");
  /**Code added by Unnati on 28-08-2024
   * Reason-To have navigation path
   */
  const { navigationPath, setNavigationPath, settingInfo } =
    useContext(GlobalContext);
  useEffect(() => {
    setNavigationPath([
      { name: "Home", path: "/" },
      { name: "Request Catalog", path: "/requestcatalogue" },
    ]);
    window.scrollTo(0, 0);
  }, [setNavigationPath]);
  /**End of code addition by Unnati on 28-08-2024
   * Reason-To have navigation path
   */
  /**
   * Added by - Unnati Bajaj on 22-08-2024
   * Reason - To validate input on blur
   */
  const isValidOnBlur = (input, value) => {
    if (input === "first_name") {
      if (checkIsEmpty(value)) {
        setFirstNameError("Please enter first name");
        return false;
      }
    }
    // Code changed by - Ashlekh on 10-12-2024
    // Reason - To remove mandatory message from email. Now will only check email format
    // if (input === "email") {
    //   if (checkIsEmpty(value)) {
    //     setEmailError("Please enter email address");
    //     return false;
    //   } else {
    //     if (checkIsEmailInvalid(value)) {
    //       setEmailError("Please enter valid email");
    //       return false;
    //     }
    //   }
    // }
    if (input === "email") {
      if (value && checkIsEmailInvalid(value)) {
        setEmailError("Please enter a valid email");
        return false;
      }
    }
    // End of code - Ashlekh on 10-12-2024
    // Reason - To remove mandatory message from email. Now will only check email format
    if (input === "address_line1") {
      if (checkIsEmpty(value)) {
        setAddressLine1Error("Please enter address");
        return false;
      }
    }
    if (input === "city") {
      if (checkIsEmpty(value)) {
        setCityError("Please enter city");
        return false;
      }
    }
    // Commented by - Ashlekh on 10-12-2024
    // Reason - To remove validation message from state
    // if (input === "state") {
    //   if (checkIsEmpty(value)) {
    //     setStateError("Please enter state");
    //     return false;
    //   }
    // }
    // End of comment - Ashlekh on 10-12-2024
    // Reason - To remove validation message from state
    if (input === "zipcode") {
      if (checkIsEmpty(value)) {
        setZipcodeError("Please enter zipcode");
        return false;
      }
    }
  };
  /**
   * End of code addition by - Unnati Bajaj on 22-08-2024
   * Reason - To validate input on blur
   */
  /**
   * Added by - Unnati Bajaj on 22-08-2024
   * Reason - To validate on submit
   */
  const isValidOnSubmit = (data) => {
    let isValid = true;
    if (checkIsEmpty(data.first_name)) {
      setFirstNameError("Please enter first name");
      isValid = false;
    } else {
      if (!checkIsNotADigit(data.first_name)) {
        setFirstNameError("Please enter a valid first name");
        isValid = false;
      }
    }
    // Code changed by - Ashlekh on 10-12-2024
    // Reason - To remove mandatory message from email. Now will only check email format
    // if (checkIsEmpty(data.email)) {
    //   setEmailError("Please enter email address");
    //   isValid = false;
    // } else {
    //   if (checkIsEmailInvalid(data.email)) {
    //     setEmailError("Please enter valid email");
    //     isValid = false;
    //   }
    // }
    if (data.email && checkIsEmailInvalid(data.email)) {
      setEmailError("Please enter a valid email");
      isValid = false;
    }
    // End of code - Ashlekh on 10-12-2024
    // Reason - To remove mandatory message from email. Now will only check email format
    if (checkIsEmpty(data.address_line1)) {
      setAddressLine1Error("Please enter address");
      isValid = false;
    }
    if (checkIsEmpty(data.city)) {
      setCityError("Please enter city");
      isValid = false;
    }
    // Commented by - Ashlekh on 10-12-2024
    // Reason - To remove validation from state
    // if (checkIsEmpty(data.state)) {
    //   setStateError("Please enter state");
    //   isValid = false;
    // }
    // End of code - Ashlekh on 10-12-2024
    // Reason - To remove validation from state
    if (checkIsEmpty(data.zipcode)) {
      setZipcodeError("Please enter zipcode");
      isValid = false;
    }

    return isValid;
  };
  /**
   * End of code addition by - Unnati Bajaj on 22-08-2024
   * Reason - To validate on submit
   */

  /* Added by - Unnati Bajaj on 22-08-2024
   * Reason - To post reuqest catalog details
   */
  const postRequestCatalogDetails = async (e) => {
    const data = {
      first_name: e.target.first_name.value,
      last_name: e.target.last_name.value,
      contact_number: e.target.contact_number.value,
      email: e.target.email.value,
      company: e.target.company.value,
      address_line1: e.target.address_line1.value,
      address_line2: e.target.address_line2.value,
      city: e.target.city.value,
      state: e.target.state.value,
      zipcode: e.target.zipcode.value,
      comments: e.target.comments.value,
    };
    if (isValidOnSubmit(data)) {
      const response = await catalogRequest(data);
      /**Code added by Unnati on 22-08-2024
       * Reason -To display notification of success and error
       */
      if (response.success) {
        notificationObject.success(response.success);
        e.target.reset();
      } else {
        notificationObject.error("Something went wrong.Please try again");
      }
      /**End of code  addition by Unnati on 22-08-2024
       * Reason -To display notification of success and error
       */
    }
  };
  /* End of code addition by - Unnati Bajaj on 22-08-2024
   * Reason - To post reuqest catalog details
   */

  /* Code added by - Unnati Bajaj on 22-08-2024
   * Reason - To handle submit button
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    await postRequestCatalogDetails(e);
  };
  /* End of code addition by - Unnati Bajaj on 22-08-2024
   * Reason - To handle submit button
   */
  return (
    <>
      <div className={Styles.pageFrame}>
        {/**Code added by Unnati on 28-08-2024
         * Reason-To have navigation path
         */}
        <div className={Styles.breadCrumb}>
          <NavigationPath navigationPathArray={navigationPath} />
        </div>
        {/*End of code addition by Unnati on 28-08-2024
         * Reason-To have navigation path
         */}
        <div className={Styles.pageContainer}>
          <div className={Styles.coloredBackground}>
            <div className={Styles.formContainer}>
              <div className={Styles.header}>
                {/* Modification and addition by Om Shrivastava on 01-01-2025
                Reason : Show the logo, when its save in backend site  */}
                {settingInfo?.logo ? (
                  <img
                    src={`${config.baseURL}${settingInfo.logo}`}
                    alt="Uniform Warehouse"
                    className={Styles.logo}
                      />
                    ) : (
                      <div className={Styles.logo}></div>
                  )}
                  {/* End of modification and addition by Om Shrivastava on 01-01-2025
                Reason : Show the logo, when its save in backend site  */}
                <div className={Styles.formHeaderText}>
                  <h2>Catalogue Request Form</h2> 
                  <p>
                    Please complete the form below to be added to our catalogue
                    mailing list. Once our catalogue is available, it will be
                    shipped to the address submitted.
                  </p>
                </div>
              </div>
              <form className={Styles.form} onSubmit={handleSubmit}>
                <div className={Styles.formGroup}>
                  <label className={Styles.subTitleColor}>
                    Name<span className={Styles.mandatoryField}>*</span>
                  </label>
                  <div className={Styles.inputGroup}>
                    <div className={Styles.inputWrapper}>
                      <input
                        type="text"
                        placeholder="First Name"
                        className={Styles.input}
                        name="first_name"
                        onChange={(e) => setFirstNameError("")}
                        onBlur={(e) =>
                          isValidOnBlur("first_name", e.target.value)
                        }
                      />
                      {/* Addition by Om shrivastava on 18-12-2024
                      Reason : Hide the div when error is not show  */}
                      {firstNameError ? (
                        <div className={Styles.formInputError}>
                          {firstNameError}
                        </div>
                      ) : null}
                      {/* End of addition by Om shrivastava on 18-12-2024
                      Reason : Hide the div when error is not show  */}
                    </div>
                    <div className={Styles.inputWrapper}>
                      <input
                        type="text"
                        placeholder="Last Name"
                        name="last_name"
                        className={Styles.input}
                        onChange={(e) => setLastNameError("")}
                        onBlur={(e) =>
                          isValidOnBlur("last_name", e.target.value)
                        }
                      />
                      {/* Addition by Om shrivastava on 18-12-2024
                      Reason : Hide the div when error is not show  */}
                      {lastNameError ? (
                        <div className={Styles.formInputError}>
                          {lastNameError}
                        </div>
                      ) : null}
                      {/* End of addition by Om shrivastava on 18-12-2024
                      Reason : Hide the div when error is not show  */}
                    </div>
                  </div>
                </div>

                <div
                  className={Styles.formGroup}
                  style={{ paddingTop: "2%", paddingBottom: "2%" }}
                >
                  {/* Modification and addition by Om Shrivastava on 31-12-2024
                Reason : Add label */}
                  <label className={Styles.subTitleColor}>Phone Number</label>
                  {/* End of modification and addition by Om Shrivastava on 31-12-2024
                Reason : Add label */}
                  <div className={Styles.inputGroup}>
                    <div className={Styles.inputWrapper}>
                      <input
                        type="text"
                        placeholder="Phone Number"
                        name="contact_number"
                        className={Styles.inputRow}
                        onChange={(e) => setContactNumberError("")}
                        onBlur={(e) =>
                          isValidOnBlur("contact_number", e.target.value)
                        }
                      />
                      {/* Addition by Om shrivastava on 18-12-2024
                      Reason : Hide the div when error is not show  */}
                      {contactNumberError ? (
                        <div className={Styles.formInputError}>
                          {contactNumberError}
                        </div>
                      ) : null}
                      {/* End of addition by Om shrivastava on 18-12-2024
                      Reason : Hide the div when error is not show  */}
                    </div>
                  </div>
                </div>
                {/* Modification and addition by Om Shrivastava on 31-12-2024
                Reason : Add label */}
                <div className={Styles.formGroup}>
                  <label className={Styles.subTitleColor}>Email</label>
                  <div className={Styles.inputGroup}>
                    <div className={Styles.inputWrapper}>
                      <input
                        type="text"
                        placeholder="Email"
                        name="email"
                        className={Styles.inputRow}
                        onChange={(e) => setEmailError("")}
                        onBlur={(e) => isValidOnBlur("email", e.target.value)}
                      />
                      {/* Addition by Om shrivastava on 18-12-2024
                      Reason : Hide the div when error is not show  */}
                      {emailError ? (
                        <div className={Styles.formInputError}>
                          {emailError}
                        </div>
                      ) : null}
                      {/* End of addition by Om shrivastava on 18-12-2024
                      Reason : Hide the div when error is not show  */}
                    </div>
                  </div>
                </div>
                {/* End of modification and addition by Om Shrivastava on 31-12-2024
                Reason : Add label */}
                <div className={Styles.formGroup}>
                  <label className={Styles.subTitleColor}>Company</label>
                  <div className={Styles.inputGroup}>
                    <input
                      type="text"
                      name="company"
                      placeholder="Company"
                      className={Styles.inputRow}
                    />
                  </div>
                </div>

                <div className={Styles.formGroup}>
                  <label className={Styles.subTitleColor}>
                    Address Line 1
                    <span className={Styles.mandatoryField}>*</span>
                  </label>
                  <div className={Styles.inputWrapper}>
                    <input
                      type="text"
                      className={Styles.inputRow}
                      placeholder="Address Line 1"
                      onChange={(e) => setAddressLine1Error("")}
                      name="address_line1"
                      onBlur={(e) =>
                        isValidOnBlur("address_line1", e.target.value)
                      }
                    />
                    {/* Addition by Om shrivastava on 18-12-2024
                      Reason : Hide the div when error is not show  */}
                    {addressLine1Error ? (
                      <div className={Styles.formInputError}>
                        {addressLine1Error}
                      </div>
                    ) : null}
                    {/* End of addition by Om shrivastava on 18-12-2024
                      Reason : Hide the div when error is not show  */}
                  </div>
                </div>

                <div className={Styles.formGroup}>
                  <label className={Styles.subTitleColor}>Address Line 2</label>
                  <input
                    type="text"
                    name="address_line2"
                    placeholder="Address Line 2"
                    className={Styles.inputRow}
                  />
                </div>

                <div className={Styles.formGroup}>
                  <label className={Styles.subTitleColor}>
                    City/State<span className={Styles.mandatoryField}>*</span>
                  </label>
                  <div className={Styles.inputGroup}>
                    <div className={Styles.inputWrapper}>
                      <input
                        type="text"
                        placeholder="City"
                        name="city"
                        className={Styles.input}
                        onChange={(e) => setCityError("")}
                        onBlur={(e) => isValidOnBlur("city", e.target.value)}
                      />
                      {/* Addition by Om shrivastava on 18-12-2024
                      Reason : Hide the div when error is not show  */}
                      {cityError ? (
                        <div className={Styles.formInputError}>{cityError}</div>
                      ) : null}
                      {/* End of addition by Om shrivastava on 18-12-2024
                      Reason : Hide the div when error is not show  */}
                    </div>
                    <div className={Styles.inputWrapper}>
                      <input
                        type="text"
                        placeholder="State"
                        name="state"
                        className={Styles.input}
                        onChange={(e) => setStateError("")}
                        onBlur={(e) => isValidOnBlur("state", e.target.value)}
                      />
                      {/* Addition by Om shrivastava on 18-12-2024
                      Reason : Hide the div when error is not show  */}
                      {stateError ? (
                        <div className={Styles.formInputError}>
                          {stateError}
                        </div>
                      ) : null}
                      {/* End of addition by Om shrivastava on 18-12-2024
                      Reason : Hide the div when error is not show  */}
                    </div>
                  </div>
                </div>

                <div className={Styles.formGroup}>
                  <label className={Styles.subTitleColor}>
                    Zipcode<span className={Styles.mandatoryField}>*</span>
                  </label>
                  <div className={Styles.inputWrapper}>
                    <input
                      type="text"
                      className={Styles.inputRow}
                      placeholder="Zipcode"
                      name="zipcode"
                      onChange={(e) => setZipcodeError("")}
                      onBlur={(e) => isValidOnBlur("zipcode", e.target.value)}
                    />
                    {/* Addition by Om shrivastava on 18-12-2024
                      Reason : Hide the div when error is not show  */}
                    {zipcodeError ? (
                      <div className={Styles.formInputError}>
                        {zipcodeError}
                      </div>
                    ) : null}
                    {/* End of addition by Om shrivastava on 18-12-2024
                      Reason : Hide the div when error is not show  */}
                  </div>
                </div>

                <div className={Styles.formGroup}>
                  <label className={Styles.subTitleColor}>Comments</label>
                  <textarea
                    type="text"
                    name="comments"
                    placeholder="Type here...."
                    className={Styles.input}
                  />
                </div>

                <button type="submit" className={Styles.submitButton}>
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestCatalog;
/**End of code addition by Unnati on 22-08-2024
 * Reason-To have request catalog page
 */
