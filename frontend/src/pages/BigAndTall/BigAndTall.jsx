/**Code added by Unnati on 12-08-2024
 * Reason-To have big and tall inquiry page
 */

import React, { useState,useContext,useEffect} from "react";
import Styles from "./BigAndTall.module.css";
import {
  checkIsEmailInvalid,
  checkIsEmpty,
  checkIsNotADigit,
  checkIsPhoneNoInvalid,
} from "../../utils/validations";
import { bigAndTallInquiry } from "../../Api/services";
import notificationObject from "../../components/Widgets/Notification/Notification";
import NavigationPath from "../../components/NavigationPath/NavigationPath";
import { GlobalContext } from "../../context/Context";
const BigAndTall = () => {
  const [emailError, setEmailError] = useState("");
  const [itemNameError, setitemNameError] = useState("");
  const [sizeAndDimensionError, setsizeAndDimensionError] = useState("");
  const [contactNumberError, setContactNumberError] = useState("");
  const [FirstNameError, setFirstNameError] = useState("");
  const [additionalInformationError, setAdditionalInformationError] =
    useState("");
     {/**Code added by Unnati on 28-08-2024
    * Reason-Added navigation link path
    */}
    const { navigationPath, setNavigationPath } = useContext(GlobalContext);
  useEffect(() => {
    setNavigationPath([
      { name: "Home", path: "/" },
      { name: "Big And Tall Inquiry", path: "/bigAndTall" },
    ]);
    window.scrollTo(0, 0); 
  }, [setNavigationPath]);
   {/**End of code addition by Unnati on 28-08-2024
    * Reason-Added navigation link path
    */}
  /**
   * Added by - Unnati Bajaj on 16-08-2024
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
    if (input === "item_name") {
      if (checkIsEmpty(value)) {
        setitemNameError("Please enter item name");
        return false;
      }
    }
    if (input === "size_and_dimension") {
      if (checkIsEmpty(value)) {
        setsizeAndDimensionError("Please enter size and dimensions");
        return false;
      }
    }
    if (input === "first_name") {
      if (checkIsEmpty(value)) {
        setFirstNameError("Please enter first name");
        return false;
      }
    }
    if (input === "contact_number") {
      if (checkIsEmpty(value)) {
        setContactNumberError("Please enter contact number");
        return false;
      } else {
        if (!checkIsPhoneNoInvalid(value)) {
          setContactNumberError("Please enter a valid contact number");
        }
      }
    }
    if (input === "additional_information") {
      if (checkIsEmpty(value)) {
        setAdditionalInformationError("Please enter additional information");
        return false;
      }
    }
  };
  /**
   * End of code addition by - Unnati Bajaj on 16-08-2024
   * Reason - To validate input on blur
   */
  /**
   * Added by - Unnati Bajaj on 16-08-2024
   * Reason - To validate input on form submit
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

    if (checkIsEmpty(data.item_name)) {
      setitemNameError("Please enter item name");
      isValid = false;
    }

    if (checkIsEmpty(data.size_and_dimension)) {
      setsizeAndDimensionError("Please enter size and dimensions");
      isValid = false;
    }

    if (checkIsEmpty(data.first_name)) {
      setFirstNameError("Please enter first name");
      isValid = false;
    } else {
      if (!checkIsNotADigit(data.first_name)) {
        setFirstNameError("Please enter a valid first name");
        isValid = false;
      }
    }

    if (checkIsEmpty(data.contact_number)) {
      setContactNumberError("Please enter contact number");
      isValid = false;
    } else {
      if (!checkIsPhoneNoInvalid(data.contact_number)) {
        setContactNumberError("Please enter a valid contact number");
        isValid = false;
      }
    }

    if (checkIsEmpty(data.additional_information)) {
      setAdditionalInformationError("Please enter additional information");
      isValid = false;
    }

    return isValid;
  };
  /**
   * End of code addition by - Unnati Bajaj on 16-08-2024
   * Reason - To validate input on form submit
   */
  /**
   * Added by - Unnati  on 16-08-2024
   * Reason - To post big and tall inquiry when user submits the form
   */
  const postBigAndTallDetails = async (e) => {
    const data = {
      item_name: e.target.item_name.value,
      size_and_dimension: e.target.size_and_dimension.value,
      first_name: e.target.first_name.value,
      last_name: e.target.last_name.value,
      email: e.target.email.value,
      contact_number: e.target.contact_number.value,
      additional_information: e.target.additional_information.value,
    };
    if (isValidOnSubmit(data)) {
      const response = await bigAndTallInquiry(data);

      if (response.success) {
        notificationObject.success(response.success);
      } else {
        notificationObject.error("Please try again");
      }
    }
  };
  /**
   * End of code addition by - Unnati  on 16-08-2024
   * Reason - To post big and tall inquiry when user submits the form
   */
  /**Code added by Unnati on 16-08-2024
   * Reason-To handle submit button
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    await postBigAndTallDetails(e);
  };
  /**End of code addition by Unnati on 16-08-2024
   * Reason-To handle submit button
   */
  const scrollDoc = () => {
    window.scrollTo(0, 0);
  };
  return (
    <div className={Styles.pageFrame}>
      <div className={Styles.pageContainer}>
       {/**Code added by Unnati on 28-08-2024
    * Reason-Added navigation link path
    */}
      <NavigationPath navigationPathArray={navigationPath} />
       {/**End of code addition by Unnati on 28-08-2024
    * Reason-Added navigation link path
    */}
        <div className={Styles.colouredBackground}>
          <div className={Styles.formcontainer}>
            <h2>Big and Tall Inquiry</h2>
            <p>
              We strive to offer the most comprehensive uniform selection in
              this industry. If you require a size that is outside of our
              normally offered selection, please submit the details below.
            </p>
            <form onSubmit={handleSubmit}>
              <div className={Styles.row}>
                <div className={Styles.formgroup}>
                  <div className={Styles.formLabel}>
                    <label>Item Name/Item #</label>
                    <span className={Styles.mandatoryField}>*</span>
                  </div>
                  <input
                    type="text"
                    name="item_name"
                    /**Code added by Unnati on 16-08-2024
                     * Reason-Added on change and onblur
                     */
                    onChange={(e) => setitemNameError("")}
                    onBlur={(e) => isValidOnBlur("item_name", e.target.value)}
                    required
                    /**End of code addition by Unnati on 16-08-2024
                     * Reason-Added on change and onblur
                     */
                  />
                  <div className={Styles.formInputError}>{itemNameError}</div>
                </div>

                <div className={Styles.formgroup}>
                  <div className={Styles.formLabel}>
                    <label>Size/Dimensions You Need</label>
                    <span className={Styles.mandatoryField}>*</span>
                  </div>
                  <input
                    type="text"
                    name="size_and_dimension"
                    /**Code added by Unnati on 16-08-2024
                     * Reason-Added on change and onblur
                     */
                    onChange={(e) => setsizeAndDimensionError("")}
                    onBlur={(e) =>
                      isValidOnBlur("size_and_dimension", e.target.value)
                    }
                    /**End of code addition by Unnati on 16-08-2024
                     * Reason-Added on change and onblur
                     */
                    required
                  />
                  <div className={Styles.formInputError}>
                    {sizeAndDimensionError}
                  </div>
                </div>
              </div>
              <div className={Styles.row}>
                <div className={Styles.formgroup}>
                  <div className={Styles.formLabel}>
                    <label>First Name</label>
                    <span className={Styles.mandatoryField}>*</span>
                  </div>
                  <input
                    type="text"
                    name="first_name"
                    maxLength={50}
                    /**Code added by Unnati on 16-08-2024
                     * Reason-Added on change and onblur
                     */
                    onChange={(e) => setFirstNameError("")}
                    onBlur={(e) => isValidOnBlur("first_name", e.target.value)}
                    /**End of code addition by Unnati on 16-08-2024
                     * Reason-Added on change and onblur
                     */
                  />
                  <div className={Styles.formInputError}>{FirstNameError}</div>
                </div>

                <div className={Styles.formgroup}>
                  <label>Last Name</label>
                  <div className={Styles.InputError}>
                    <input
                      className={Styles.formInput}
                      type="text"
                      name="last_name"
                      maxLength={50}
                      /**Code added by Unnati on 16-08-2024
                       * Reason-Added on change and onblur
                       */
                      onBlur={(e) => isValidOnBlur("last_name", e.target.value)}
                      /**End of code addition by Unnati on 16-08-2024
                       * Reason-Added on change and onblur
                       */
                    />
                  </div>
                </div>
              </div>
              <div className={Styles.row}>
                <div className={Styles.formgroup}>
                  <div className={Styles.formLabel}>
                    <label>Phone Number</label>
                    <span className={Styles.mandatoryField}>*</span>
                  </div>
                  <div className={Styles.InputError}>
                    <input
                      className={Styles.formInput}
                      type="text"
                      name="contact_number"
                      maxLength={50}
                      placeholder="(000)-000-0000"
                      /**Code added by Unnati on 16-08-2024
                       * Reason-Added on change and onblur
                       */
                      onChange={(e) => setContactNumberError("")}
                      onBlur={
                        (e) => isValidOnBlur("contact_number", e.target.value)
                        /**End of code addition by Unnati on 16-08-2024
                         * Reason-Added on change and onblur
                         */
                      }
                    />
                    <div className={Styles.formInputError}>
                      {contactNumberError}
                    </div>
                  </div>
                </div>

                <div className={Styles.formgroup}>
                  <div className={Styles.formLabel}>
                    <label>Email</label>
                    <span className={Styles.mandatoryField}>*</span>
                  </div>
                  <div className={Styles.InputError}>
                    <input
                      className={Styles.formInput}
                      type="text"
                      name="email"
                      maxLength={50}
                      placeholder="ex:email@yahoo.com"
                      /**Code added by Unnati on 16-08-2024
                       * Reason-Added on change and onblur
                       */
                      onChange={(e) => setEmailError("")}
                      onBlur={(e) => isValidOnBlur("email", e.target.value)}
                      /**End of code addition by Unnati on 16-08-2024
                       * Reason-Added on change and onblur
                       */
                    />
                    <div className={Styles.formInputError}>{emailError}</div>
                  </div>
                </div>
              </div>
              <div className={Styles.formgroup}>
                <div className={Styles.formLabel}>
                  <label>Additional Information</label>
                  <span className={Styles.mandatoryField}>*</span>
                </div>
                <div className={Styles.InputError}>
                  <textarea
                    className={Styles.formInput}
                    type="text"
                    name="additional_information"
                    maxLength={50}
                    /**Code added by Unnati on 16-08-2024
                     * Reason-Added on change and onblur
                     */
                    onChange={(e) => setEmailError("")}
                    onBlur={(e) =>
                      isValidOnBlur("additional_information", e.target.value)
                    }
                    /**End of code addition by Unnati on 16-08-2024
                     * Reason-Added on change and onblur
                     */
                  />
                  <div className={Styles.formInputError}>
                    {additionalInformationError}
                  </div>
                </div>
              </div>
              <div className={Styles.buttonContainer}>
                <button className={Styles.bigAndTallButton} type="submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {scrollDoc()}
    </div>
  );
};

export default BigAndTall;
/**End of code addition by Unnati on 12-08-2024
 * Reason-To have big and tall inquiry page
 */
