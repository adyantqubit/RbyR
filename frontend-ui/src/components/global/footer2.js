import style from "./footer2.module.css";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { TiSocialInstagram } from "react-icons/ti";
import { FiArrowRight } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import {
  getSocialLinkDetail,
  getCopyrightDetails,
  postEmailDetails,
  InstagramCollections,
  getStoreLocatorDetail,
} from "../../api/service";
import { useEffect, useState } from "react";
import { notification } from "antd";
import { IoChevronForwardOutline } from "react-icons/io5";
import config from "../../api/config";
import "../../context.css";
import parse from "html-react-parser";

function Footer2() {
  const [socialLinks, setSocialLinks] = useState([]);
  const [copyrights, setCopyrights] = useState([]);
  var [instagramCollections, setInstagramCollections] = useState(null);
  // Addition by Om Shrivastava on 15-06-2024
  // Reason : Set the store locator details
  const [storeLocatorDetails, setStoreLocator] = useState([]);
  // Addition by Om Shrivastava on 15-06-2024
  // Reason : Set the store locator details
  const nav = useNavigate();

  useEffect(() => {
    getSocialLinks();
    getCopyrights();
    instagramApi();
    // Addition by Om Shrivastava on 15-06-2024
    // Reason : Create method for set the store locator details
    getStoreLocator();
    // Addition by Om Shrivastava on 15-06-2024
    // Reason : Create method for set the store locator details
  }, []);

  const getSocialLinks = async () => {
    const socialLinksData = await getSocialLinkDetail();
    if (socialLinksData) {
      setSocialLinks(socialLinksData);
    }
  };
  const getCopyrights = async () => {
    const copyrightData = await getCopyrightDetails();
    if (copyrightData) {
      setCopyrights(copyrightData);
    }
  };

  // Addition by Om Shrivastava on 15-06-2024
  // Reason : Get the store locator details
  const getStoreLocator = async () => {
    const storeLocatorData = await getStoreLocatorDetail();
    if (storeLocatorData) {
      setStoreLocator(storeLocatorData);
    }
  };
  // Addition by Om Shrivastava on 15-06-2024
  // Reason : Get the store locator details

  const subscribeToEmailUpdate = async () => {
    var email = document.getElementById("emailAddress");
    if (email.value.length == 0) {
      notification.open({
        message: "",
        // Modification and addition by Om shrivastava on 01-12-23
        // REason : Create the popup class to apply the designing
        className: "popupClass",
        // style:{marginTop:"20px"},
        // style:{backgroundColor: "#f1cdd9",
        // padding:'0px 5px 5px 5px',borderRadius:'10px',width:'200px'},
        // End of modification and addition by Om shrivastava on 01-12-23
        // REason : Create the popup class to apply the designing
        description: "Please enter email id",
        onClick: () => {},
        key: 1,
      });
    } else if (
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)
    ) {
      const data = {
        email: email.value,
      };
      const emailData = await postEmailDetails(data);
      if (emailData) {
        if (emailData.msg) {
          notification.open({
            message: "",
            style: { marginTop: "20px" },
            description: "Subscribed to email updates successfully",
            onClick: () => {},
            style: { backgroundColor: "var(--bannerColor)" },
            key: 1,
          });
        } else {
          if (emailData.error) {
            notification.open({
              message: "",
              style: { marginTop: "20px" },
              description: emailData.error,
              onClick: () => {},
              style: { backgroundColor: "var(--bannerColor)" },
              key: 1,
            });
          } else {
            notification.open({
              message: "",
              style: { marginTop: "20px" },
              description: "Email subscription failed",
              onClick: () => {},
              style: { backgroundColor: "var(--bannerColor)" },
              key: 1,
            });
          }
        }
      }
    } else {
      notification.open({
        message: "",
        // Modification and addition by Om shrivastava on 01-12-23
        // REason : Create the popup class to apply the designing
        className: "popupClass",
        // style:{marginTop:"20px"},
        // style:{backgroundColor: "#f1cdd9",
        // padding:'0px 5px 5px 5px',borderRadius:'10px',width:'200px'},
        // End of modification and addition by Om shrivastava on 01-12-23
        // REason : Create the popup class to apply the designing
        description: "Please provide a valid email format",
        onClick: () => {},
        style: { backgroundColor: "var(--bannerColor)" },

        key: 1,
      });
    }
  };

  async function instagramApi() {
    await InstagramCollections().then((r) => {
      if (!r.error) {
        setInstagramCollections(r);
      } else
        notification.open({
          message: "",
          style: { marginTop: "20px" },
          description: "Instagram Post Not Found",
          onClick: () => {},
          style: { backgroundColor: "var(--bannerColor)" },
          key: 1,
        });
    });
  }
  // Adition by Om Shrivastava on 20-10-23
  // Reason : Add the condition when the data is not show
  const isObjectEmpty = (objectName) => {
    if (objectName != null || objectName != undefined) {
      return Object.keys(objectName)?.length === 0;
    }
  };
  // End of adition by Om Shrivastava on 20-10-23
  // Reason : Add the condition when the data is not show
  // console.log(isObjectEmpty(instagramCollections));
  return (
    <div className={style.App}>
      {/* // Adition by Om Shrivastava on 20-10-23
  // Reason : Add the condition when the data is not show  */}
      {/* {instagramCollections .length>0 ? ( */}
      {/* Commented by Om Shrivastava on 15-06-2024
      Reason : Remove the instagram section from home page  */}
      {/* {isObjectEmpty(instagramCollections) != true ? (
        <div className={style.instagramContainer}>
          <a
            className={style.instagramLink}
            href={instagramCollections?.instagram_home_link}
          >
            <div className={style.instagramTextContainer}>
              <h5
                style={{
                  padding: "0",
                  margin: "0",
                  textDecoration: "underline",
                  textDecorationColor: "blue",
                  color: "blue",
                }}
                className={style.instaBox}
              >
                Follow Us6
              </h5>
              <h5
                style={{
                  padding: "0",
                  margin: "0",
                  textDecoration: "underline",
                  textDecorationColor: "blue",
                  color: "blue",
                }}
                className={style.instaText}
              >
                On Instagram
              </h5>
            </div>
          </a>
          <a
            className={style.instagramLink}
            href={instagramCollections?.instagram_post1_link}
          >
            <img
              className={style.instagramImage}
              src={config.staticBaseURL + instagramCollections?.instagram_post1}
            ></img>
          </a>
          <a
            className={style.instagramLink}
            href={instagramCollections?.instagram_post2_link}
          >
            <img
              className={style.instagramImage}
              src={config.staticBaseURL + instagramCollections?.instagram_post2}
            ></img>
          </a>
          <a
            className={style.instagramLink}
            href={instagramCollections?.instagram_post3_link}
          >
            <img
              className={style.instagramImage}
              src={config.staticBaseURL + instagramCollections?.instagram_post3}
            ></img>
          </a>
          <a
            className={style.instagramLink}
            href={instagramCollections?.instagram_post4_link}
          >
            <img
              className={style.instagramImage}
              src={config.staticBaseURL + instagramCollections?.instagram_post4}
            ></img>
          </a>
          <a
            className={style.instagramLink}
            href={instagramCollections?.instagram_post5_link}
          >
            <img
              className={style.instagramImage}
              src={config.staticBaseURL + instagramCollections?.instagram_post5}
            ></img>

          </a>
        </div>
      ) : null} */}
      {/* End of commented by Om Shrivastava on 15-06-2024
      Reason : Remove the instagram section from home page  */}
      {/* // End of adition by Om Shrivastava on 20-10-23
        // Reason : Add the condition when the data is not show  */}
      {/* <div style={{ height: "40px", borderBottom: "1px solid #7c7c7c" }}></div> */}
      <div className={style.row}>
        <div className={style.column1}>
          {/* <h1 className={style.heading}>CUSTOMER CARE</h1> */}
          <Link to="/custom" style={{ textDecoration: "none", color: "white" }}>
            {" "}
            <span className={style.span}>Contact Us</span>
          </Link>
          <Link to="/terms" style={{ textDecoration: "none", color: "white" }}>
            {" "}
            <span className={style.span}>Terms and Conditions</span>
          </Link>
          <Link
            to="/privacy-policy"
            style={{ textDecoration: "none", color: "white" }}
          >
            <span className={style.span}>Privacy Policy</span>
          </Link>
          {/* Commented by Om Shrivastava on 14-06-2024
          Reason : No need to show this section */}
          {/* <Link to="/FAQ" style={{ textDecoration: "none", color: "white" }}>
            {" "}
            <span className={style.span}>FAQ</span>
          </Link> */}
          {/* Commented by Om Shrivastava on 14-06-2024
          Reason : No need to show this section */}
          {/* Commented by Om Shrivastava on 14-06-2024
          Reason : No need to show this section */}
          {/* <Link to="/bridal" style={{ textDecoration: "none", color: "white" }}>
            <span className={style.span}>Bridal</span>
          </Link> */}
          {/* End of commented by Om Shrivastava on 14-06-2024
          Reason : No need to show this section */}
        </div>
        <div className={style.column2}>
          {/* <span className={style.heading}>POLICIES</span> */}
         
          <Link
            to="/delivery-policy"
            style={{ textDecoration: "none", color: "white" }}
          >
            <span className={style.span}>Delivery and Shipping Policy</span>
          </Link>
          <Link
            to="/refund-policy"
            style={{ textDecoration: "none", color: "white" }}
          >
            <span className={style.span}>Return Policy</span>
          </Link>
          <Link
            to="/cancellation-policy"
            style={{ textDecoration: "none", color: "white" }}
          >
            <span className={style.span}>Order Cancellation Policy</span>
          </Link>
        </div>
        {/* Commented by Om Shrivastava on 14-06-2024
          Reason : No need to show store locator */}
        {/* <div className={style.column3}>
          <h1 className={style.heading}>THE COMPANY</h1>
          <Link
            to="/aboutRR"
            style={{ textDecoration: "none", color: "white" }}
          >
            <span className={style.span}>
              About us
            </span>
          </Link>
          <Link
            to="/store-locator"
            style={{ textDecoration: "none", color: "white" }}
          >
            <span className={style.span}>Store Locator</span>
          </Link>
        </div> */}
        {/* End of commented by Om Shrivastava on 14-06-2024
          Reason : No need to show store locator */}
        {/* // Addition by Om Shrivastava on 15-06-2024 
           // Reason :  Create the section for address, email and contact number */}
        {/* {socialLinks.length > 0 ? ( */}
          <div className={style.column4}>
            {/* <h1 className={style.heading} style={{fontWeight:'bold'}}>Get in touch</h1> */}

            {/* {storeLocatorDetails.length > 0 ? ( */}
              <>
                {storeLocatorDetails.map((storeLocatorDetail) => {
                  return (
                    <div>
                      <div
                        style={{ marginTop: "0px", textDecoration: "none" }}
                        className={style.span}
                      >
                       <i className="fa-solid fa-phone" style={{ fontSize: '14px', position: 'relative', color: 'black' }}></i>
                       &nbsp;+91 {parse("" + storeLocatorDetail.phoneNumber)}
                      </div>
                      <div
                        style={{ textDecoration: "none" }}
                        className={style.span}
                      >
                        <i className="fa-solid fa-envelope" style={{ fontSize: '14px', position: 'relative', color: 'black' }}></i>
                        &nbsp;{parse("" + storeLocatorDetail.email)}
                      </div>
                      {/* <div className={style.itemText}>
                            {parse("" + storeLocatorDetail.timing)}
                          </div> */}
                      {/* <div className={style.itemText}>
                            {parse("" + storeLocatorDetail.address)}
                          </div> */}
                      <div className={style.span}>
                        <a
                          className={style.span}
                          style={{ textDecoration: "none" }}
                          target="_blank"
                          href={`https://www.google.com/maps/search/?api=1&query=${storeLocatorDetail.address.replace(
                            /(<([^>]+)>)/gi,
                            ""
                          )}`}
                        >
                        <i className="fa-solid fa-map-marker-alt" style={{ fontSize: '14px', position: 'relative', color: 'black' }}></i>
                        &nbsp;{parse("" + storeLocatorDetail.address)}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </>
            {/* ) : (
              <div>
                <div>Details Are Not Available</div>
              </div>
            )} */}

            <div className={style.socialLinksTab}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "8px",
                  marginTop: "10px",
                }}
              >
                {socialLinks.length > 0 ? (
                  <>
                    {socialLinks.map((socialLink) => {
                      return (
                        // <img
                        //   src={
                        //     config.staticBaseURL + "media/" + socialLink.logo
                        //   }
                        //   style={{
                        //     color: "var(--iconsColor)",
                        //     width: "20px",
                        //     height: "20px",
                        //   }}
                        //   onClick={{}}
                        //   alt=""
                        // />
                        <span
                          style={{ marginTop: "0" }}
                          className={`${style.span} ${style.span1}`}
                        >
                          <a
                            href={socialLink.link}
                            className={style.span}
                            style={{
                              textDecoration: "none",
                              marginLeft: "10px",
                            }}
                            target="_blank"
                          >
                           <img
                          src={
                            config.staticBaseURL + "media/" + socialLink.logo
                          }
                          style={{
                            color: "var(--iconsColor)",
                            width: "20px",
                            height: "20px",
                          }}
                          onClick={{}}
                          alt=""
                        />
                          </a>
                        </span>
                      );
                    })}
                  </>
                ) : null}
              </div>
              {/* <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  marginTop: "7px",
                }}
              >
                {socialLinks.length > 0 ? (
                  <>
                    {socialLinks.map((socialLink) => {
                      return (
                        <span
                          style={{ marginTop: "0" }}
                          className={`${style.span} ${style.span1}`}
                        >
                          <a
                            href={socialLink.link}
                            className={style.span}
                            style={{
                              textDecoration: "none",
                              marginLeft: "10px",
                            }}
                            target="_blank"
                          >
                            {" "}
                            {socialLink.linkName}
                          </a>
                        </span>
                      );
                    })}
                  </>
                ) : null}
              </div> */}
            </div>
          </div>
        {/* // ) : null} */}
        {/* // Addition by Om Shrivastava on 15-06-2024 
         // Reason : Create the section for address, email and contact number*/}
        {/* Commented by Om Shrivastava on 14-06-2024
          Reason : Remove this div  */}
        {/* <div className={style.column5}>
          <span className={style.heading}>SIGN UP FOR UPDATES</span>
          <div
            style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}
          >
            <input
              type="email"
              className={style.emailBox}
              placeholder="Enter Your Email"
              id="emailAddress"
              maxLength={254}
            />
            <button
              className={style.emailBoxButton}
              onClick={subscribeToEmailUpdate}
            >
              <IoChevronForwardOutline
                style={{ fontSize: "25px", color: "white" }}
              />
            </button>
          </div>
        </div> */}
        {/* Commented by Om Shrivastava on 14-06-2024
          Reason : Remove this div  */}
      </div>

      <div className={style.copyrightText}>
        <span
          className={style.span2}
          style={{ fontSize: "15px", marginLeft: "10px" }}
        >
          {" "}
          {copyrights.length > 0
            ? copyrights.map((copyright) => {
                return copyright.title;
              })
            : // Modification and addition by Om Shrivastava on 04-11-23
              // Reason : No need to show the hardcode content
              // : "© 2022 RR. ALL RIGHTS RESERVED"}
              ""}
          {/* // End of modification and addition by Om Shrivastava on 04-11-23
              // Reason : No need to show the hardcode content */}
        </span>
        <a href="https://adyant.co.in/" target="_blank">
          <span
            className={style.span2}
            style={{ fontSize: "15px", marginRight: "10px" }}
          >
            {" "}
            Powered by{" "}
            <span
              style={{
                fontFamily: "var(--pagesFontFamily)",
                fontSize: "14px",
                // fontWeight: "20",
                color: "black",
                textDecoration: "none",
              }}
            >
              ADYANT
            </span>
          </span>
        </a>
      </div>
    </div>
  );
}

export default Footer2;
