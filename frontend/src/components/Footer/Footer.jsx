/**
 * Created by - Ashish Dewangan on 24-05-2024
 * Reason - To have footer section
 */
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import footerStyle from "./footer.module.css";
import { emailSubscription } from "../../Api/services";
import config from "../../Api/config";
import { CiLocationOn } from "react-icons/ci";
import { CiPhone } from "react-icons/ci";
import { CiMail } from "react-icons/ci";
import notificationObject from "../../components/Widgets/Notification/Notification";
import { checkIsEmailInvalid, checkIsEmpty } from "../../utils/validations";
import { GlobalContext } from "../../context/Context";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import { AiOutlineCopyrightCircle } from "react-icons/ai";

const Footer = () => {
  const [emailError, setEmailError] = useState("");
  const { social, settingInfo, 
          // Added by - Ashlekh on 02-12-2024
          // Reason - To add user from context
          user,
          // End of code - Ashlekh on 02-12-2024
          // Reason - To add user from context
        } = useContext(GlobalContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Added by - Ashlekh on 02-12-2024
  // Reason - To add variable for navigation
  const navigate = useNavigate();
  // End of code - Ashlekh on 02-12-2024
  // Reason - To add variable for navigation
  /**Code added by Unnati Bajaj on 02-06-2024
   * Reason -To get social links when the component loads
   */
  // useEffect(() => {
  //   const fetchSocialLinks = async () => {
  //     try {
  //       const data = await getSocialLinks();
  //       setSocial(data.social);
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   };
  //   fetchSocialLinks();
  // }, []);
  /**End of code addition by Unnati Bajaj on 02-06-2024
   * Reason -To get social links when the component loads
   */

  /**Code added by Unnati Bajaj on 26-06-2024
   * Reason -To get contact details when the component loads
   */
  // useEffect(() => {
  //   const fetchSettingInfo = async () => {
  //     try {
  //       const data = await getSettings();
  //       setSettingInfo(data.setting);
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   };
  //   fetchSettingInfo();
  // }, []);
  /**End of code addition by Unnati Bajaj on 26-06-2024
   * Reason -To get contact details when the component loads
   */
  const isValidOnBlur = (input, value) => {
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
  };
  /**Code added by Unnati on 03-07-2024
   * Reason -To add validation for email field
   */
  const isValidOnSubmit = (data) => {
    if (checkIsEmpty(data.email)) {
      setEmailError("Please enter email address");
      return false;
    } else {
      if (checkIsEmailInvalid(data.email)) {
        setEmailError("Please type correct email format");
        return false;
      }

      return true;
    }
  };
  /**End of code addition by Unnati on 03-07-2024
   * Reason -To add validation for email field
   */
  /**Code added by Unnati on 03-07-2024
   * Reason-To post email when clicked on submit button
   */
  const postEmailSubscriptionRequest = async (e) => {
    const data = {
      email: e.target.email.value,
    };

    if (isValidOnSubmit(data)) {
      const response = await emailSubscription(data);

      if (response.success) {
        notificationObject.success(response.success);
        e.target.reset();
      }
      if (response.error) {
        notificationObject.error("Email already exists");
      }
    }
  };
  /**End of code addition by Unnati on 03-07-2024
   * Reason-To post email when clicked on submit button
   */
  /**Code added by Unnati on 03-07-2024
   * Reason-To handle submit button
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    postEmailSubscriptionRequest(e);
  };
  /**End of code addition by Unnati on 03-07-2024
   * Reason-To handle submit button
   */

  /**Code added by Unnati on 23-10-2024
   * Reason-To open and close modal
   */
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  /*End of code addition by Unnati on 23-10-2024
   * Reason-To open and close modal
   */
  /**Code added by Unnati on 23-10-2024
   * Reason-To handle scroll bar when modal is open
   */
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);
  /**End of code addition by Unnati on 23-10-2024
   * Reason-To handle scroll bar when modal is open
   */

  /**
   * Added by - Ashlekh on 02-12-2024
   * Reason - To naviagte in order history and to send orders in state. This will be used to directly open My Order tab
   */
  const navigateMyOrder = () => {
    if (user.id != undefined){
      navigate("/myaccount", { state: { myOrder: "orders" } });
    } else{
      navigate("/login");
    }
  };
  /**
   * End of code - Ashlekh on 02-12-2024
   * Reason - To naviagte in order history and to send orders in state. This will be used to directly open My Order tab
   */
  return (
    <div className={`${footerStyle.pageFrame}`}>
      <div className={`${footerStyle.footerContainer}`}>
        {settingInfo?.contact_number?.trim()?.length > 0 && (
          <div className={`${footerStyle.whatsAppIcon}`} draggable={true}>
            <FloatingWhatsApp
              style={{ left: 30 }}
              buttonStyle={{ left: 30, width: 40, height: 40 }}
              phoneNumber={`1${settingInfo.contact_number}`}
              avatar={
                settingInfo.logo ? config.baseURL + settingInfo.logo : null
              }
              accountName="Global Power LLC"
              allowClickAway={true}
            />
          </div>
        )}
        {/**Code added by Unnati on 26-06-2024
         *Reason-Footer's top row */}
        <div className={`${footerStyle.topRow}`}>
          <div className={`${footerStyle.topRowContainer}`}>
            <div className={`${footerStyle.iconContainer}`}>
              <div className={`${footerStyle.icons}`}>
                {social?.map((socialItem, index) => (
                  <Link
                    to={socialItem.social_link}
                    key={index}
                    className={`${footerStyle.socialIcon}`}
                    target="_blank">
                    <img
                      className={`${footerStyle.img}`}
                      src={config.baseURL + socialItem.icon}
                      alt={socialItem.name}
                    />
                  </Link>
                ))}
              </div>
            </div>

            <div className={`${footerStyle.newsletterContainer}`}>
              <div className={`${footerStyle.newsletter}`}>
                <div className={`${footerStyle.footerNewsletter}`}>
                  {/* Commented by jhamman on 28-10-2024
                Reason - removed as per preeti mam guide */}
                  {/* <p className={`${footerStyle.newsletterText}`}>
                    SUBSCRIBE VIA EMAIL ID{" "}
                  </p> */}
                  {/* End of commentation by jhamman on 28-10-2024
                Reason - removed as per preeti mam guide */}
                {/* Added by - Ashlekh on 20-01-2025
                Reason - To add div for handling validation message */}
                <div className={`${footerStyle.emailInputWrapper}`}>
                {/* End of code - Ashlekh on 20-01-2025
                Reason - To add div for handling validation message */}
                  <form
                    className={`${footerStyle.inputContainer}`}
                    onSubmit={handleSubmit}>
                    <div className={`${footerStyle.inputEmail}`}>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        className={`${footerStyle.newsletterInput}`}
                        onChange={(e) => setEmailError("")}
                        onBlur={(e) => isValidOnBlur("email", e.target.value)}
                      />

                      <button
                        type="submit"
                        className={`${footerStyle.subscribeButton}`}>
                        SUBSCRIBE
                      </button>
                    </div>
                    {emailError && (
                      <div
                        className={`${footerStyle.formInputError} ${
                          emailError ? footerStyle.visible : ""
                        }`}>
                        {emailError}
                      </div>
                    )}
                  </form>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/**End of code addition by Unnati on 26-06-2024
         *Reason-Footer's top row */}
        {/**Code added by Unnati on 26-06-2024
         *Reason-Footer's middle row */}
        <div className={`${footerStyle.middleRow}`}>
          <div className={`${footerStyle.middleRowContainer}`}>
            <div className={`${footerStyle.col4}`}>
              <div className={footerStyle.contactUsHeading}>
                Contact Us
              </div>
              {/**Code commented by Unnati on 26-06-2024
               *Reason- Quick links is not displayed in this row*/}
              {/* <p>
            <Link to="/aboutus" className={`${footerStyle.text}`}>
              About us
            </Link>
          </p>
          <p>
            <Link to="/contactus" className={`${footerStyle.text}`}>
              Contact us
            </Link>
          </p>
          <p>
            <Link to="/ourpolicies" className={`${footerStyle.text}`}>
              Our Policies
            </Link>
          </p>
          <p>
            <Link to="/terms-and-conditions" className={`${footerStyle.text}`}>
              Terms & Conditions
            </Link>
          </p> */}
              {/**End of code commented by Unnati on 26-06-2024
               *Reason- Quick links is not displayed in this row*/}
              <div className={`${footerStyle.contactUscontentFooter}`}>
                <ul>
                  {/**Code modified by Unnati on 14-10-2024
                   *Reason-To show icons only if detail is present */}
                  {settingInfo?.address && (
                    <li className={`${footerStyle.contactInfo}`}>
                      <div className={`${footerStyle.reactIcon}`}>
                        <CiLocationOn />
                      </div>
                      <div className={`${footerStyle.label}`}>
                        {settingInfo?.address}{" "}{settingInfo?.pincode}
                      </div>
                    </li>
                  )}
                  {/**End of code modification by Unnati on 14-10-2024
                   *Reason-To show icons only if detail is present */}
                  {/**Code modified by Unnati on 14-10-2024
                   *Reason-To show icons only if detail is present */}
                  {settingInfo?.contact_number &&
                    settingInfo?.contact_number?.trim()?.length > 0 && (
                      <li className={`${footerStyle.contactInfo}`}>
                        <div className={`${footerStyle.reactIcon}`}>
                          {" "}
                          <CiPhone />
                        </div>

                        <div className={`${footerStyle.label}`}>
                          {settingInfo?.contact_number}
                        </div>
                      </li>
                    )}
                  {/**End of code modification by Unnati on 14-10-2024
                   *Reason-To show icons only if detail is present */}
                  {/**Code modified by Unnati on 14-10-2024
                   *Reason-To show icons only if detail is present */}
                  {settingInfo?.email && (
                    <li className={`${footerStyle.contactInfo}`}>
                      <div className={`${footerStyle.reactIcon}`}>
                        <CiMail />
                      </div>
                      <div className={`${footerStyle.label}`}>
                        {settingInfo?.email}
                      </div>
                    </li>
                  )}
                  {/**End of code modification by Unnati on 14-10-2024
                   *Reason-To show icons only if detail is present */}
                  {/**Code modified by Unnati on 14-10-2024
                   *Reason-To show icons only if detail is present */}
                  {/**Code commented by Unnati on 21-10-2024
                   *Reason-To remove opening and closing hour */}
                  {/* {settingInfo?.opening_hours && settingInfo?.closing_hours && (
                    <li className={`${footerStyle.contactInfo}`}>
                      <div className={`${footerStyle.reactIcon}`}>
                        <CiClock2 />
                      </div>
                      <div className={`${footerStyle.iconLabel}`}>
                        <p>{settingInfo?.opening_hours}</p>
                        <p>{settingInfo?.closing_hours}</p>
                      </div>
                    </li>
                  )} */}
                  {/**End of code comment by Unnati on 21-10-2024
                   *Reason-To remove opening and closing hour */}
                  {/**End of code modification by Unnati on 14-10-2024
                   *Reason-To show icons only if detail is present */}
                </ul>
              </div>
            </div>
            <div className={`${footerStyle.col3}`}>
              <h3 className={`${footerStyle.heading}`}>Account</h3>
              {/**Code commented by Unnati on 26-06-2024
               *Reason- Social icons need not to be displayed in the footer*/}
              {/* <span className={`${footerStyle.iconContainer}`}>
            {social.map((socialItem, index) => (
              <Link
                to={socialItem.social_link}
                key={index}
                className={`${footerStyle.socialIcon}`}
                target="_blank"
              >
                <img
                  className={`${footerStyle.img}`}
                  src={config.baseURL + socialItem.icon}
                  alt={socialItem.name}
                />
              </Link>
            ))}
          </span> */}
              {/**End of code commented by Unnati on 26-06-2024
               *Reason- Social icons need not to be displayed in the footer*/}
              <div className={`${footerStyle.contentFooter}`}>
                <ul>
                  {/* Code commented by - Ashlekh on 11-11-2024
                  Reason - No need to display My Account */}
                  <li className={`${footerStyle.contactInfo}`}>
                    <div className={`${footerStyle.iconLabel}`}>
                      <Link to="./myaccount" 
                      // Added by - Ashlekh on 12-12-2024
                      // Reason - To pass state when My Account is clicked
                      state={{ myAccount: "account" }}
                      // End of code - Ashlekh on 12-12-2024
                      // Reason - To pass state when My Account is clicked
                      >My Account</Link>
                    </div>
                  </li>
                  {/* End of comment - Ashlekh on 11-11-2024
                  Reason - No need to display My Account */}

                  {/* Added by - Ashlekh on 02-12-2024
                  Reason - To add My Orders */}
                  <li className={`${footerStyle.contactInfo}`}>
                    <div className={`${footerStyle.iconLabel}`}>
                      <div className={`${footerStyle.myOrderText}`} onClick={navigateMyOrder}>
                        My Orders
                      </div>
                    </div>
                  </li>
                  {/* End of code - Ashlekh on 02-12-2024
                  Reason - To add My Orders */}
                  {/* <li className={`${footerStyle.contactInfo}`}> */}
                  {/**Code commented by Unnati on 03-10-2024
                   *Reason-To add link to My cart option in footer */}
                  {/* <Link to="/viewcart">
                      <div className={`${footerStyle.iconLabel}`}>My Cart</div>
                    </Link> */}
                  {/**End of code commented by Unnati on 03-10-2024
                   *Reason-To add link to My cart option in footer */}
                  {/* </li> */}
                  <li className={`${footerStyle.contactInfo}`}>
                    <div className={`${footerStyle.iconLabel}`}>
                      <Link to="./returns-and-exchanges">
                        Return & Exchange
                      </Link>
                    </div>
                  </li>
                  {/**Code commented by Unnati on 11-11-2024
                   *Reason-commented track order */}
                  {/* <li className={`${footerStyle.contactInfo}`}>
                    <div className={`${footerStyle.iconLabel}`}>
                      Track Order
                    </div>
                  </li> */}
                  {/*End of code addition by Unnati on 11-11-2024
                   *Reason-commented track order */}
                </ul>
              </div>
            </div>
            <div className={`${footerStyle.col3}`}>
              <h3 className={`${footerStyle.heading}`}>Useful links</h3>
              <div className={`${footerStyle.contentFooter}`}>
                <ul>
                  <li className={`${footerStyle.contactInfo}`}>
                    <div className={`${footerStyle.iconLabel}`}>
                      <Link to="./aboutus">About Us</Link>
                    </div>
                  </li>
                  <li className={`${footerStyle.contactInfo}`}>
                    <div className={`${footerStyle.iconLabel}`}>
                      <Link to="./faq">Faqs</Link>
                    </div>
                  </li>
                  <li className={`${footerStyle.contactInfo}`}>
                    <div className={`${footerStyle.iconLabel}`}>
                      <Link to="./contactus">Contact Us</Link>
                    </div>
                  </li>
                  {/**Code commented by Unnati on 23-10-2024
                   *Reason-To remove custom order form */}
                  {/* <li className={`${footerStyle.contactInfo}`}>
                    <div className={`${footerStyle.iconLabel}`}>
                      <a
                        href="/customOrderForm.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Custom Order Form
                      </a>
                    </div>
                  </li> */}
                  {/**End of code comment by Unnati on 23-10-2024
                   *Reason-To remove custom order form */}
                  <li className={`${footerStyle.contactInfo}`}>
                    <div className={`${footerStyle.iconLabel}`}>
                      {/**Code added by Unnati on 22-08-2024
                       *Reason-Added request catalog link */}
                      <Link to="/requestcatalogue">Request Catalogue</Link>
                      {/**End of code addition by Unnati on 22-08-2024
                       *Reason-Added request catalog link */}
                    </div>
                  </li>
                  {/**Code commented by Unnati on 23-10-2024
                   *Reason-To remove custom order form */}
                  {/* <li className={`${footerStyle.contactInfo}`}>
                    <div className={`${footerStyle.iconLabel}`}> */}
                  {/**Code added by Unnati on 22-08-2024
                   *Reason-Added pdf to Online catalog */}
                  {/* <a
                        href="/customOrderForm.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Online Catalog
                      </a> */}
                  {/**End of code addition by Unnati on 22-08-2024
                   *Reason-Added pdf to Online catalog */}
                  {/* </div>
                  </li> */}
                  {/**End of code comment by Unnati on 23-10-2024
                   *Reason-To remove custom order form */}
                  <li className={`${footerStyle.contactInfo}`}>
                    <div className={`${footerStyle.iconLabel}`}>
                      <Link to="/blog">Blog</Link>
                    </div>
                  </li>
                  {/* <li className={`${footerStyle.contactInfo}`}>
                    <div className={`${footerStyle.iconLabel}`}>Site Map</div>
                  </li> */}
                </ul>
              </div>
            </div>
            <div className={`${footerStyle.col2}`}>
              <h3 className={`${footerStyle.heading}`}>Quick Links</h3>
              <div className={`${footerStyle.contentFooter}`}>
                <ul>
                  {/* <li className={`${footerStyle.contactInfo}`}>
                    <div className={`${footerStyle.iconLabel}`}>
                      New Products
                    </div>
                  </li> */}
                  {/* <li className={`${footerStyle.contactInfo}`}>
                    <div className={`${footerStyle.iconLabel}`}>Clearance</div>
                  </li> */}
                  <li className={`${footerStyle.contactInfo}`}>
                    <div className={`${footerStyle.iconLabel}`}>
                      {/**Code added by Unnati on 11-08-2024
                       *Reason-Adding shipping link */}
                      <Link to="/shipping">Shipping</Link>
                      {/**End of code addition by Unnati on 11-08-2024
                       *Reason-Adding shipping link */}
                    </div>
                  </li>
                  {/* <li className={`${footerStyle.contactInfo}`}>
                    <div className={`${footerStyle.iconLabel}`}>
                      <Link to="/storelocator">Find Our Store</Link>
                    </div>
                  </li> */}
                  {/**Code modified by Unnati on 23-10-2024
                   *Reason-To show size chart  */}
                  {settingInfo?.size_chart && (
                    <li className={footerStyle.contactInfo}>
                      <div
                        className={footerStyle.iconLabel}
                        onClick={openModal}
                        style={{ cursor: "pointer" }}>
                        Sizing Info
                      </div>
                    </li>
                  )}
                  {/**End of code by Unnati on 23-10-2024
                   *Reason-To show size chart  */}
                  {/**Code added by Unnati on 23-10-2024
                   *Reason-To open modal when user clicks on sizing info*/}
                  {isModalOpen && (
                    <div className={footerStyle.modalOverlay}>
                      <div className={footerStyle.modalContent}>
                        <span
                          className={footerStyle.closeButton}
                          onClick={closeModal}>
                          &times;
                        </span>
                        <img
                          src={config.baseURL + settingInfo.size_chart}
                          alt="Size Chart"
                          className={footerStyle.sizeChartImage}
                        />
                      </div>
                    </div>
                  )}
                  {/**End of code addition by Unnati on 23-10-2024
                   *Reason-To open modal when user clicks on sizing info*/}
                  <li className={`${footerStyle.contactInfo}`}>
                    {/**Code added by Unnati on 23-10-2024
                     *Reason-To redirect to contact us page when clicked on help */}
                    {/* Modification and addition by Om Shrivastava on 26-11-2024
                    Reason : Set the content  */}
                    <div className={`${footerStyle.iconLabel}`}>
                      <Link to="./contactus">Help</Link>
                    </div>
                    {/* End of modification and addition by Om Shrivastava on 26-11-2024
                    Reason : Set the content  */}
                    {/**End of code addition by Unnati on 23-10-2024
                     *Reason-To redirect to contact us page when clicked on help */}
                  </li>
                  <li className={`${footerStyle.contactInfo}`}>
                    {/* Modification and addition by Om Shrivastava on 26-11-2024
                    Reason : Set the content  */}
                    <div className={`${footerStyle.iconLabel}`}>
                      <Link to="/leavefeedback">Leave Feedback</Link>
                    </div>
                    {/* End of modification and addition by Om Shrivastava on 26-11-2024
                    Reason : Set the content  */}
                  </li>
                  {/* Added by - Ashlekh on 08-10-2024
                  Reason - To add privacy policy */}
                  <li className={`${footerStyle.contactInfo}`}>
                    <div className={`${footerStyle.iconLabel}`}>
                      <Link to="/privacy_policy">Privacy policy</Link>
                    </div>
                  </li>
                  {/* End of code - Ashlekh on 08-10-2024
                  Reason - To add privacy policy */}
                  {/* Added by - Unnati  on 18-10-2024
                  Reason - To add terms and conditions */}
                  <li className={`${footerStyle.contactInfo}`}>
                    <div className={`${footerStyle.iconLabel}`}>
                      <Link to="/terms-and-conditions">Terms & Conditions</Link>
                    </div>
                  </li>
                  {/* End of code - Unnati  on 18-10-2024
                  Reason -To add terms and conditions*/}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/**End of code addition by Unnati on 26-06-2024
         *Reason-Footer's middle row */}
        {/**Code added by Unnati on 26-06-2024
         *Reason-Footer's bottom row*/}
        <div className={`${footerStyle.bottomRow}`}>
          <div className={`${footerStyle.centerText}`}>
            <p className={`${footerStyle.copyrightIcon}`}>
              <AiOutlineCopyrightCircle />{" "}
            </p>
            <p className={`${footerStyle.copyright}`}>
              2024 Global Power LLC. All Rights Reserved.
            </p>
          </div>
          {/**Code added by Unnati on 27-10-2024
           *Reason-Added Powered by*/}
          <div className={`${footerStyle.leftText}`}>
            <a
              href="https://adyant.co.in/"
              target="_blank"
              rel="noopener noreferrer">
              <p className={`${footerStyle.poweredBy}`}>
                Powered by Adyant SoftTech
              </p>
            </a>
          </div>
          {/**End of code addition by Unnati on 27-10-2024
           *Reason-Added Powered by*/}
        </div>
        {/*End of code addition by Unnati on 26-06-2024
         *Reason-Footer's bottom row*/}
      </div>
    </div>
  );
};
export default Footer;
/**
 * End of code addition by Ashish Dewangan on 24-05-2024
 * Reason - To have footer section
 */
