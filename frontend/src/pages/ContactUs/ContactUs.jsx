/**Code added by Unnati on 30-05-2024
 * Reason- To have contact us page
 */
import React, { useState, useEffect, useContext } from "react";
import ContactStyle from "./ContactUs.module.css";
import { FaRegClock } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import {
  checkIsPhoneNoInvalid,
  checkIsNotADigit,
  checkIsEmailInvalid,
  checkIsEmpty,
} from "../../utils/validations";
import { contactus, getSettings } from "../../Api/services";
import notificationObject from "../../components/Widgets/Notification/Notification";
import { GlobalContext } from "../../context/Context";
import NavigationPath from "../../components/NavigationPath/NavigationPath";

/**Code added by Unnati Bajaj on 10-06-2024
 * Reason -To scroll to the top when component loads
 */
const ContactUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /**End of code additionby Unnati Bajaj on 10-06-2024
   * Reason -To scroll to the top when component loads
   */
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [contactInfo, setContactInfo] = useState({});
  const { social, settingInfo } = useContext(GlobalContext);
  {
    /**Code added by Unnati on 28-08-2024
     * Reason-Added navigation link path
     */
  }
  const { navigationPath, setNavigationPath } = useContext(GlobalContext);
  useEffect(() => {
    setNavigationPath([
      { name: "Home", path: "/" },
      { name: "Contact Us", path: "/contactus" },
    ]);
    window.scrollTo(0, 0);
  }, [setNavigationPath]);
  {
    /**End of code addition by Unnati on 28-08-2024
     * Reason-Added navigation link path
     */
  }
  /**Code commented by Unnati on 17-06-2024
   * Reason -As flickering issue between pages occured
   */
  // const [isSubmitting, setIsSubmitting] = useState(false);
  /**End of code comment by Unnati on 17-06-2024
   * Reason -As flickering issue between pages occured
   */

  /**Code added by Unnati Bajaj on 30-05-2024
   * Reason -To get contact details when the component loads
   */
  // useEffect(() => {
  //   const fetchContactInfo = async () => {
  //     try {
  //       const data = await getSettings();
  //       setContactInfo(data.settingInfo);
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   };
  //   fetchContactInfo();
  // }, []);
  /**End of code addition by Unnati Bajaj on 30-05-2024
   * Reason -To get contact details when the component loads
   */

  /**
   *Code added by - Unnati Bajaj on 30-05-2024
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
   * End of code addition by - Unnati Bajaj on 30-05-2024
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
   * Added by - Unnati on 30-05-2024
   * Reason - To post contact details when user submits the form
   */
  const postContactUsDetails = async (e) => {
    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone_number: e.target.phone_number.value,
      message: e.target.message.value,
    };
    if (isValidOnSubmit(data)) {
      const response = await contactus(data);

      /**Code added by Unnati on 13-04-2024
       * Reason-To display notification of error and success
       * */
      if (response.success) {
        notificationObject.success(response.success);
        e.target.reset();
      }
      if (response.error) {
      }
      /**End of code addition by Unnati on 13-04-2024
       * Reason-To display notification of error and success
       */

      /**Code commented by Unnati on 17-06-2024
       * Reason -As flickering issue between pages occured
       */
      // setTimeout(() => {
      //   setIsSubmitting(false);
      // }, 5000);

      /**End of code comment by Unnati on 17-06-2024
       * Reason -As flickering issue between pages occured
       */
    }
  };
  /**
   * End of code addition - Unnati on 30-05-2024
   * Reason - To post contact details when user submits the form
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // setIsSubmitting(true);
    postContactUsDetails(e);
  };
  const scrollDoc = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className={`${ContactStyle.pageFrame}`}>
      {/**Code commented by Unnati on 11-08-2024
       *Reason- Colored background is not in use*/}
      {/* <div className={`${ContactStyle.coloredBackground}`}> */}
      {/**End of code commented by Unnati on 11-08-2024
       *Reason- Colored background is not in use*/}
      <div className={`${ContactStyle.pageContainer}`}>
        {/**Code added by Unnati on 28-08-2024
         * Reason-Added navigation link path
         */}
        <NavigationPath navigationPathArray={navigationPath} />
        {/**End of code addition  by Unnati on 28-08-2024
         * Reason-Added navigation link path
         */}
        {/**Code commented by Unnati on 13-04-2024
         *Reason- As designed changed of contact request */}
        {/* <section className={`layout_padding ${ContactStyle.contactSection}`}>
            <div className={`${ContactStyle.container}`}> */}
        {/**End of code comment by Unnati on 13-04-2024
         *Reason- As designed changed of contact request */}
        <div className={`${ContactStyle.headingContainer}`}>
          <h2 className={`${ContactStyle.pageHeading}`}>Contact Us</h2>
        </div>
        {/* </div> */}
        <div className={`${ContactStyle.container_bg}`}>
          <div className={`${ContactStyle.row}`}>
            <div className={`${ContactStyle.col7} ${ContactStyle.px0}`}>
              <div className={`${ContactStyle.map_container}`}>
                <div className={`${ContactStyle.map_responsive}`}>
                  {/**Code added by Unnati on 11-08-2024
                   *Reason- Changed the image in contact us page*/}
                  <img
                    src="/contactUs.png"
                    alt="Signup"
                    className={`${ContactStyle.image}`}
                  />
                  {/**End of code addition by Unnati on 11-08-2024
                   *Reason- Changed the image in contact us page*/}
                  {/**Code commented by Unnati on 13-06-2024
                   *Reason -To change the deisgn of the form */}
                  {/* <div className={`${ContactStyle.contactInfo}`}> */}
                  {/* <div className={`${ContactStyle.iconText}`}>
                        <CiLocationOn size={25} className={ContactStyle.icon} />
                        <p>{contactInfo.address}</p>
                      </div>
                      <div className={`${ContactStyle.iconText}`}>
                        <FaPhoneAlt size={22} className={ContactStyle.icon} />
                        <p>{contactInfo.contact_number}</p>
                      </div>
                      <div className={`${ContactStyle.iconText}`}>
                        <MdOutlineMail size={25} className={ContactStyle.icon} />
                        <p>{contactInfo.email}</p>
                      </div> */}
                  {/* <div className={`${ContactStyle.rowInfo}`}>
                        <div className={`${ContactStyle.col5}`}>
                          <FaRegClock size={30} />
                          <h3>Open Hours</h3>
                          <p className={`${ContactStyle.text}`}>{contactInfo.opening_hours}</p>
                          <p className={`${ContactStyle.text}`}>{contactInfo.closing_hours}</p>
                        </div>
                        <div className={`${ContactStyle.col5}`}>
                          <FaLocationDot size={30} />
                          <h3>Address</h3>
                          <p className={`${ContactStyle.text}`}>{contactInfo.address}</p>
                          <p className={`${ContactStyle.text}`}>{contactInfo.pincode}</p>
                        </div>
                        <div className={`${ContactStyle.col5}`}>
                          <IoCall size={30} />
                          <h3>Contacts</h3>
                          <p className={`${ContactStyle.text}`}>{contactInfo.contact_number}</p>
                          <p className={`${ContactStyle.text}`}>{contactInfo.email}</p>
                        </div>
                        </div>
                      </div> */}
                  {/**Code commented by Unnati on 13-06-2024
                   *Reason -To change the deisgn of the form */}
                </div>
              </div>
            </div>

            <div className={`${ContactStyle.col5} ${ContactStyle.px0}`}>
              <form className={`${ContactStyle.form}`} onSubmit={handleSubmit}>
                {/**Code added by Unnati on 11-08-2024
                 *Reason- Text message to be displayed above the form*/}
                <div className={`${ContactStyle.subContent}`}>
                  In case of any queries, please drop your message here. We will
                  get back to you soon.
                </div>
                {/**End of code addition by Unnati on 11-08-2024
                 *Reason- Text message to be displayed above the form*/}
                <div>
                  {/**Code added by Unnati on 11-08-2024
                   *Reason-Changed css property */}
                  <label className={`${ContactStyle.subTitleColor}`}>
                    Name
                    <span className={`${ContactStyle.asterisk}`}>*</span>
                  </label>
                  {/**End of code addition by Unnati on 11-08-2024
                   *Reason-Changed css property */}
                  <input
                    className={`${ContactStyle.inputField}`}
                    type="text"
                    name="name"
                    onChange={(e) => setNameError("")}
                    onBlur={(e) => isValidOnBlur("name", e.target.value)}
                  />
                  <div className={`${ContactStyle.formInputError}`}>
                    {nameError}
                  </div>
                </div>

                <div>
                  {/**Code added by Unnati on 11-08-2024
                   *Reason-Changed css property */}
                  <label className={`${ContactStyle.subTitleColor}`}>
                    Email
                    <span className={`${ContactStyle.asterisk}`}>*</span>
                  </label>
                  {/**End of code addition by Unnati on 11-08-2024
                   *Reason-Changed css property */}
                  <input
                    className={`${ContactStyle.inputField}`}
                    type="text"
                    name="email"
                    maxLength={30}
                    onChange={(e) => setEmailError("")}
                    onBlur={(e) => isValidOnBlur("email", e.target.value)}
                  />
                  <div className={`${ContactStyle.formInputError}`}>
                    {emailError}
                  </div>
                </div>

                <div>
                  {/**Code added by Unnati on 11-08-2024
                   *Reason-Changed css property */}
                  <label className={`${ContactStyle.subTitleColor}`}>
                    Contact Number
                    <span className={`${ContactStyle.asterisk}`}>*</span>
                  </label>
                  {/**End of code addition by Unnati on 11-08-2024
                   *Reason-Changed css property */}
                  <input
                    className={`${ContactStyle.inputField}`}
                    type="text"
                    name="phone_number"
                    maxLength={10}
                    onChange={(e) => setPhoneNumberError("")}
                    onBlur={(e) =>
                      isValidOnBlur("phone_number", e.target.value)
                    }
                  />
                  <div className={`${ContactStyle.formInputError}`}>
                    {phoneNumberError}
                  </div>
                </div>

                <div>
                  {/**Code added by Unnati on 11-08-2024
                   *Reason-Changed css property */}
                  <label className={`${ContactStyle.subTitleColor}`}>
                    Message
                    <span className={`${ContactStyle.asteriskNone}`}></span>
                  </label>
                  {/**End of code addition by Unnati on 11-08-2024
                   *Reason-Changed css property */}
                  <textarea
                    name="message"
                    className={`${ContactStyle.message_box} ${ContactStyle.inputField}`}
                  />
                </div>
                <div>
                  <button
                    className={`${ContactStyle.contactUsButton}`}
                    // disabled={isSubmitting}
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className={`${ContactStyle.contactInfo}`} 
          // Addition by Om Shrivastava on 13-12-2024
          // Reason : Set the padding 
          style={{paddingBottom:'1%'}}
          // End of addition by Om Shrivastava on 13-12-2024
          // Reason : Set the padding 
          >
            <div className={`${ContactStyle.rowInfo}`}>

            {/* Commented by jhamman on 19-10-2024
            Reason - remove this field*/}
              {/* <div className={`${ContactStyle.col5}`}>
                <FaRegClock size={30} color="	#009fe3" />
                <h3>Open Hours</h3>
                <p className={`${ContactStyle.text}`}>
                  {settingInfo.opening_hours}
                </p>
                <p className={`${ContactStyle.text}`}>
                  {settingInfo.closing_hours}
                </p>
              </div> */}
               {/* End of addition by jhamman on 19-10-2024
            Reason - remove this field*/}
            {/* Added by - Ashlekh on 14-12-2024
            Reason - To add condition for address */}
            {settingInfo?.address != null && 
            (
              // End of code - Ashlekh on 14-12-2024
              // Reason - To add condition for address
                <div className={`${ContactStyle.col5}`}>
                  <FaLocationDot size={30} color="red" />
                  <h3>Address</h3>
                  <p className={`${ContactStyle.text}`}>{settingInfo?.address}</p>
                  <p className={`${ContactStyle.text}`}>{settingInfo?.pincode}</p>
                </div>
            )}
            {/* Added by - Ashlekh on 14-12-2024
            Reason - To add condition for contact number */}
            {settingInfo?.contact_number != null &&
             (
              // End of code - Ashlekh on 14-12-2024
              // Reason - To add condition for contact number
              <div className={`${ContactStyle.col5}`}>
                <IoCall size={30} color="green" />
                <h3>Contacts</h3>
                <p className={`${ContactStyle.text}`}>
                  {settingInfo?.contact_number}
                </p>
              </div>
             )}
             {/* Added by - Ashlekh on 14-12-2024
             Reason - To add condition for email */}
             {settingInfo?.email != null && (
                // End of code - Ashlekh on 14-12-2024
                // Reason - To add condition for email
              <div className={`${ContactStyle.col5}`}>
                <MdOutlineEmail size={30} />
                <h3>Email</h3>
                <p className={`${ContactStyle.text}`}>{settingInfo?.email}</p>
              </div>
              )}
            </div>
          </div>
          {/* // Addition by Om Shrivastava on 13-12-2024
          // Reason : When data is present then map link section is show  */}
        {contactInfo.map_link?
          <div className={`${ContactStyle.col7} ${ContactStyle.px0}`} style={{border:'1px solid red'}}>
            <div className={`${ContactStyle.map_container}`}>
              <div className={`${ContactStyle.map_responsive}`}>
                <iframe
                  src={contactInfo.map_link}
                  width="600"
                  height="300"
                  frameBorder="0"
                  style={{ border: 0, width: "100%", height: "100%" }}
                  allowFullScreen
                />
              </div>
            </div>
          </div>
          :null}
          {/* // End of addition by Om Shrivastava on 13-12-2024
          // Reason : When data is present then map link section is show  */}

        </div>
        {/* </section> */}
        {/* Commented by Om Shrivastava on 13-12-2024 Reason : No need to show below div  */}
        {/* <div className={`${ContactStyle.contactInfo}`}>
          <div className={`${ContactStyle.rowInfo}`}> */}
            {/**Code commented by Unnati on 13-04-2024
             *Reason- As designed changed of contact request */}
            {/* <div className={`${ContactStyle.col5}`}>
                <FaRegClock size={50} />
                <h3>Open Hours</h3>
                <p className={`${ContactStyle.text}`}>{contactInfo.opening_hours}</p>
                <p className={`${ContactStyle.text}`}>{contactInfo.closing_hours}</p>
              </div>
              <div className={`${ContactStyle.col5}`}>
                <FaLocationDot size={50} />
                <h3>Address</h3>
                <p className={`${ContactStyle.text}`}>{contactInfo.address}</p>
                <p className={`${ContactStyle.text}`}>{contactInfo.pincode}</p>
              </div>
              <div className={`${ContactStyle.col5}`}>
                <IoCall size={50} />
                <h3>Contacts</h3>
                <p className={`${ContactStyle.text}`}>{contactInfo.contact_number}</p>
                <p className={`${ContactStyle.text}`}>{contactInfo.email}</p>
              </div> */}
            {/* <div className={`${ContactStyle.col7} ${ContactStyle.px0}`}>
            <div className={`${ContactStyle.map_container}`}>
              <div className={`${ContactStyle.map_responsive}`}>
                <iframe
                  src={contactInfo.map_link}
                  width="600"
                  height="300"
                  frameBorder="0"
                  style={{ border: 0, width: '100%', height: '100%' }}
                  allowFullScreen
                />
              </div>
            </div>
          </div> */}
            {/**End of code commented by Unnati on 13-04-2024
             *Reason- As designed changed of contact request */}
          {/* </div>
        </div> */}
        {/* End of commented by Om Shrivastava on 13-12-2024 Reason : No need to show below div  */}
      </div>
      {scrollDoc()}
      {/* </div > */}
    </div>
  );
};

export default ContactUs;
/**End of code addition by Unnati on 30-05-2024
 * Reason- To have contact us page
 */
