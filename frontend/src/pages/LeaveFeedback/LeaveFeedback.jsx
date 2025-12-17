/**Code added by Unnati on 23-10-2024
 * Reason- To have leave feedback  page
 */
import React, { useState, useEffect, useContext } from "react";
import LeaveFeedbackStyle from "./LeaveFeedback.module.css";
import {
  checkIsPhoneNoInvalid,
  checkIsNotADigit,
  checkIsEmailInvalid,
  checkIsEmpty,
} from "../../utils/validations";
import { leavefeedback } from "../../Api/services";
import notificationObject from "../../components/Widgets/Notification/Notification";
import { GlobalContext } from "../../context/Context";
import NavigationPath from "../../components/NavigationPath/NavigationPath";

/**Code added by Unnati Bajaj on 23-10-2024
 * Reason -To scroll to the top when component loads
 */
const LeaveFeedback = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /**End of code additionby Unnati Bajaj on 23-10-2024
   * Reason -To scroll to the top when component loads
   */
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const scrollDoc = () => {
    window.scrollTo(0, 0);
  };
  {
    /**Code added by Unnati on 23-10-2024
     * Reason-Added navigation link path
     */
  }
  const { navigationPath, setNavigationPath } = useContext(GlobalContext);
  useEffect(() => {
    setNavigationPath([
      { name: "Home", path: "/" },
      { name: "Leave Feedback", path: "/leavefeedback" },
    ]);
    window.scrollTo(0, 0);
  }, [setNavigationPath]);
  {
    /**End of code addition by Unnati on 23-10-2024
     * Reason-Added navigation link path
     */
  }

  /**
   *Code added by - Unnati Bajaj on 23-10-2024
   * Reason - To validate input on blur
   */
  const isValidOnBlur = (input, value) => {
    if (input === "name") {
      if (checkIsEmpty(value)) {
        setNameError("Please enter first name");
        return false;
      }
    }
    if (input === "email") {
      if (checkIsEmpty(value)) {
        setEmailError("Please enter email address");
        return false;
      } else {
        if (checkIsEmailInvalid(value)) {
          setEmailError("Please type correct email format");
          return false;
        }
      }
    }
    if (input === "phone_number") {
      if (checkIsEmpty(value)) {
        setPhoneNumberError("Please enter contact number");
        return false;
      } else {
        if (!checkIsPhoneNoInvalid(value)) {
          setPhoneNumberError("Please enter a valid contact number");
        }
      }
    }
  };
  /**
   * End of code addition by - Unnati Bajaj on 23-10-2024
   * Reason - To validate input on blur
   */
  const isValidOnSubmit = (data) => {
    if (checkIsEmpty(data.name)) {
      setNameError("Please enter name");
      return false;
    } else {
      if (!checkIsNotADigit(data.name)) {
        setNameError("Please enter a valid name");
        return false;
      }
    }

    if (checkIsEmpty(data.email)) {
      setEmailError("Please enter email address");
      return false;
    } else {
      if (checkIsEmailInvalid(data.email)) {
        setEmailError("Please type correct email format");
        return false;
      }
    }
    if (checkIsEmpty(data.phone_number)) {
      setPhoneNumberError("Please enter contact number");
      return false;
    } else {
      if (!checkIsPhoneNoInvalid(data.phone_number)) {
        setPhoneNumberError("Please enter a valid contact number");
        return false;
      }
    }
    return true;
  };

  /**
   * Added by - Unnati on 23-10-2024
   * Reason - To post leaveFeedback when user submits the form
   */
  const postLeaveFeedbackDetails = async (e) => {
    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone_number: e.target.phone_number.value,
      message: e.target.message.value,
    };
    if (isValidOnSubmit(data)) {
      const response = await leavefeedback(data);

      /**Code added by Unnati on 23-10-2024
       * Reason-To display notification of error and success
       * */
      if (response.success) {
        // Changed by - Ashlekh on 09-12-2024
        // Reason - To change message
        // notificationObject.success(response.success);
        notificationObject.success("Thankyou for your feedback!");
        // End of code - Ashlekh on 09-12-2024
        // Reason - To change message
        e.target.reset();
      }
      if (response.error) {
      }
      /**End of code addition by Unnati on 23-10-2024
       * Reason-To display notification of error and success
       */
    }
  };
  /**
   * End of code addition - Unnati on 23-10-2024
   * Reason - To post contact details when user submits the form
   */
  /**Code added by Unnati on 23-10-2024
   * Reason-To handleSubmit button
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    postLeaveFeedbackDetails(e);
  };
  /**End of code addition Unnati on 23-10-2024
   * Reason-To handleSubmit button
   */

  return (
    <div className={`${LeaveFeedbackStyle.pageFrame}`}>
      <div className={`${LeaveFeedbackStyle.pageContainer}`}>
        <NavigationPath navigationPathArray={navigationPath} />

        <div className={`${LeaveFeedbackStyle.headingContainer}`}>
          <h2 className={`${LeaveFeedbackStyle.pageHeading}`}>
            Leave Feedback
          </h2>
        </div>

        <div className={`${LeaveFeedbackStyle.container_bg}`}>
          <div className={`${LeaveFeedbackStyle.row}`}>
            <div
              className={`${LeaveFeedbackStyle.col7} ${LeaveFeedbackStyle.px0}`}
            >
              <div className={`${LeaveFeedbackStyle.map_container}`}>
                <div className={`${LeaveFeedbackStyle.map_responsive}`}>
                  <img
                    // Code changed by - Ashlekh on 10-02-2025
                    // Reason - To change file name of image (as it is not appearing in live)
                    // src="/LeaveFeedback.jpg"
                    src="/leavefeedback.jpg"
                    // End of code - Ashlekh on 10-02-2025
                    // Reason - To change file name of image (as it is not appearing in live)
                    alt=""
                    className={`${LeaveFeedbackStyle.image}`}
                  />
                </div>
              </div>
            </div>

            <div
              className={`${LeaveFeedbackStyle.col5} ${LeaveFeedbackStyle.px0}`}
            >
              <form
                className={`${LeaveFeedbackStyle.form}`}
                onSubmit={handleSubmit}
              >
                {/**Code modified by Unnati on 24-10-2024
                 *Reason-Changed message */}
                <div className={`${LeaveFeedbackStyle.subContent}`}>
                  Please drop your feedback here
                </div>
                {/**End of code modification by Unnati on 24-10-2024
                 *Reason-Changed message */}

                <div>
                  <label className={`${LeaveFeedbackStyle.subTitleColor}`}>
                    Name
                    <span className={`${LeaveFeedbackStyle.asterisk}`}>*</span>
                  </label>

                  <input
                    className={`${LeaveFeedbackStyle.inputField}`}
                    type="text"
                    name="name"
                    onChange={(e) => setNameError("")}
                    onBlur={(e) => isValidOnBlur("name", e.target.value)}
                  />
                  <div className={`${LeaveFeedbackStyle.formInputError}`}>
                    {nameError}
                  </div>
                </div>

                <div>
                  <label className={`${LeaveFeedbackStyle.subTitleColor}`}>
                    Email
                    <span className={`${LeaveFeedbackStyle.asterisk}`}>*</span>
                  </label>

                  <input
                    className={`${LeaveFeedbackStyle.inputField}`}
                    type="text"
                    name="email"
                    maxLength={30}
                    onChange={(e) => setEmailError("")}
                    onBlur={(e) => isValidOnBlur("email", e.target.value)}
                  />
                  <div className={`${LeaveFeedbackStyle.formInputError}`}>
                    {emailError}
                  </div>
                </div>

                <div>
                  <label className={`${LeaveFeedbackStyle.subTitleColor}`}>
                    Contact Number
                    <span className={`${LeaveFeedbackStyle.asterisk}`}>*</span>
                  </label>

                  <input
                    className={`${LeaveFeedbackStyle.inputField}`}
                    type="text"
                    name="phone_number"
                    maxLength={10}
                    onChange={(e) => setPhoneNumberError("")}
                    onBlur={(e) =>
                      isValidOnBlur("phone_number", e.target.value)
                    }
                  />
                  <div className={`${LeaveFeedbackStyle.formInputError}`}>
                    {phoneNumberError}
                  </div>
                </div>

                <div>
                  <label className={`${LeaveFeedbackStyle.subTitleColor}`}>
                    Message
                    <span
                      className={`${LeaveFeedbackStyle.asteriskNone}`}
                    ></span>
                  </label>

                  <textarea
                    name="message"
                    className={`${LeaveFeedbackStyle.message_box} ${LeaveFeedbackStyle.inputField}`}
                  />
                </div>
                <div>
                  <button
                    className={`${LeaveFeedbackStyle.contactUsButton}`}
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {scrollDoc()}
    </div>
  );
};

export default LeaveFeedback;
/**End of code addition by Unnati on 23-10-2024
 * Reason- To have leaveFeedback page
 */
