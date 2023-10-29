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
} from "../../api/service";
import { useEffect, useState } from "react";
import { notification } from "antd";
import { IoChevronForwardOutline } from "react-icons/io5";
import config from "../../api/config";

function Footer2() {
  const [socialLinks, setSocialLinks] = useState([]);
  const [copyrights, setCopyrights] = useState([]);
  var [instagramCollections, setInstagramCollections] = useState(null);

  const nav = useNavigate();

  useEffect(() => {
    getSocialLinks();
    getCopyrights();
    instagramApi();
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

  const subscribeToEmailUpdate = async () => {
    var email = document.getElementById("emailAddress");
    if (email.value.length == 0) {
      notification.open({
        message: "",
        style: { marginTop: "20px" },
        style: { backgroundColor: "var(--bannerColor)" },
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
        style: { marginTop: "20px" },
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
    if(objectName!=null || objectName!=undefined){
    return Object.keys(objectName)?.length === 0
    }
  }
  // End of adition by Om Shrivastava on 20-10-23
  // Reason : Add the condition when the data is not show  
  // console.log(isObjectEmpty(instagramCollections));
  return (
    <div className={style.App}>
       {/* // Adition by Om Shrivastava on 20-10-23
  // Reason : Add the condition when the data is not show  */}
   {/* {instagramCollections .length>0 ? ( */}
      {isObjectEmpty(instagramCollections) != true ? 
        <div className={style.instagramContainer}>
          <a
            className={style.instagramLink}
            href={instagramCollections?.instagram_home_link}
          >
            <div className={style.instagramTextContainer}>
              <div className={style.instaBox}>FOLLOW US</div>
              <div className={style.instaText}>ON INSTAGRAM</div>
            </div>
          </a>
          <a
            className={style.instagramLink}
            href={instagramCollections?.instagram_post1_link}
          >
            {/* Added By Rohan kansari
            reason- This div is not needed. style is not define for this div so i m replacing it.
            jira issue-RBYR184 */}
            {/* <div className={style.instagramItem}> */}

            <img
              className={style.instagramImage}
              src={config.staticBaseURL + instagramCollections?.instagram_post1}
            ></img>
            {/* </div> */}
          </a>
          <a
            className={style.instagramLink}
            href={instagramCollections?.instagram_post2_link}
          >
            {/* <div className={style.instagramItem}> */}
            <img
              className={style.instagramImage}
              src={config.staticBaseURL + instagramCollections?.instagram_post2}
            ></img>
            {/* </div> */}
          </a>
          <a
            className={style.instagramLink}
            href={instagramCollections?.instagram_post3_link}
          >
            {/* <div className={style.instagramItem}> */}
            <img
              className={style.instagramImage}
              src={config.staticBaseURL + instagramCollections?.instagram_post3}
            ></img>
            {/* </div> */}
          </a>
          <a
            className={style.instagramLink}
            href={instagramCollections?.instagram_post4_link}
          >
            {/* <div className={style.instagramItem}> */}
            <img
              className={style.instagramImage}
              src={config.staticBaseURL + instagramCollections?.instagram_post4}
            ></img>
            {/* </div> */}
          </a>
          <a
            className={style.instagramLink}
            href={instagramCollections?.instagram_post5_link}
          >
            {/* <div className={style.instagramItem}> */}
            <img
              className={style.instagramImage}
              src={config.staticBaseURL + instagramCollections?.instagram_post5}
            ></img>
            {/* </div> */}

            {/* End of the code */}
          </a>
        </div>

      :
        null
          }
      {/* // End of adition by Om Shrivastava on 20-10-23
        // Reason : Add the condition when the data is not show  */}
      <div style={{ height: "40px", borderBottom: "1px solid #7c7c7c" }}></div>
      <div className={style.row}>
        <div className={style.column1}>
          <h1 className={style.heading}>CUSTOMER CARE</h1>
          <Link to="/custom" style={{ textDecoration: "none", color: "white" }}>
            {" "}
            <span className={style.span}>Contact Us</span>
          </Link>
          <Link to="/terms" style={{ textDecoration: "none", color: "white" }}>
            {" "}
            <span className={style.span}>Terms and Conditions</span>
          </Link>
          <Link to="/FAQ" style={{ textDecoration: "none", color: "white" }}>
            {" "}
            <span className={style.span}>FAQ</span>
          </Link>
          <Link to="/bridal" style={{ textDecoration: "none", color: "white" }}>
            <span className={style.span}>Bridal</span>
          </Link>
        </div>
        <div className={style.column2}>
          <h1 className={style.heading}>POLICIES</h1>
          <Link
            to="/privacy-policy"
            style={{ textDecoration: "none", color: "white" }}
          >
            <span className={style.span}>Privacy Policy</span>
          </Link>
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

        <div className={style.column3}>
          <h1 className={style.heading}>THE COMPANY</h1>
          <Link
            to="/aboutRR"
            style={{ textDecoration: "none", color: "white" }}
          >
            <span className={style.span}>World of RbyR</span>
          </Link>

          <Link
            to="/store-locator"
            style={{ textDecoration: "none", color: "white" }}
          >
            <span className={style.span}>Store Locator</span>
          </Link>
        </div>

        <div className={style.column4}>
          <h1 className={style.heading}>FOLLOW US</h1>
          <div className={style.socialLinksTab}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                marginTop: "7px",
              }}
            >
              {socialLinks.length > 0 ? (
                <>
                  {socialLinks.map((socialLink) => {
                    return (
                      <img
                        src={config.staticBaseURL + socialLink.logo}
                        style={{
                          color: "var(--iconsColor)",
                          width: "25px",
                          height: "25px",
                        }}
                        alt=""
                      />
                    );
                  })}
                </>
              ) : null}
              {/* <FaFacebookF style={{ color: "var(--iconsColor)", fontSize: "25px" }} />
              <TiSocialInstagram style={{ color: "var(--iconsColor)", fontSize: "25px" }} /> */}
              {/* Commented by - Ashish Dewangan on 15-02-2023
              Reason - To hide Twitter link */}
              {/* <FaTwitter style={{ color: "grey", fontSize: "25px" }} /> */}
              {/* End of comment */}
            </div>
            <div
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
                        {/* <a
                          href={socialLink.link}
                          className={style.span}
                          style={{
                            textDecoration: "none",
                            color: "black",
                            marginLeft: "10px",
                          }}
                        > */}
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
            </div>
          </div>
          {/* <div className={style.icon}><FaFacebookF style={{color:"grey",fontSize:"25px",marginLeft:"5px"}}/><span style={{marginTop:"0"}}className={style.span} > Facebook</span></div>
      <div className={style.icon}><TiSocialInstagram style={{color:"grey",fontSize:"25px",marginLeft:"5px"}}/><span style={{marginTop:"0"}}className={style.span}> Instagram</span></div>
      <div className={style.icon}><FaTwitter style={{color:"grey",fontSize:"25px",marginLeft:"5px"}}/><span style={{marginTop:"0"}}className={style.span}> Twitter</span></div> */}
        </div>
        <div className={style.column5}>
          <h1 className={style.heading}>SIGN UP FOR UPDATES</h1>
          <div
            style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}
          >
            <input
              type="email"
              className={style.emailBox}
              placeholder="Enter Your Email"
              id="emailAddress"
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
        </div>
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
            : "© 2022 RR. ALL RIGHTS RESERVED"}
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
                fontFamily: "Rawson-Regular",
                fontSize: "16px",
                fontWeight: "20",
                color: "#212121",
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
