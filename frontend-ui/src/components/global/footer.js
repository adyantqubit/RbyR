import style from "./footer2.module.css";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { TiSocialInstagram } from "react-icons/ti";
import { FiArrowRight } from "react-icons/fi";
import {IoChevronForwardOutline} from "react-icons/io5"
import { Link, useNavigate } from "react-router-dom";
import { getSocialLinkDetail, getCopyrightDetails,postEmailDetails } from "../../api/service";
import { useEffect, useState } from "react";
import { notification } from "antd";

function Footer() {
  const [socialLinks, setSocialLinks] = useState([]);
  const [copyrights, setCopyrights] = useState([]);
     const nav=useNavigate()


  useEffect(() => {
    getSocialLinks();
    getCopyrights();
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

  const subscribeToEmailUpdate = async()=>{
    var email=document.getElementById("emailAddress");
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)){
      const data={
        email:email.value
      }
      const emailData= await postEmailDetails(data);
      if(emailData){
        if(emailData.msg){
          notification.open({
            message: "",
            description:
              'Subscribed to email updates successfully',
            onClick: () => {
            },
            key:1
          });
        }else{
          if(emailData.error){
            notification.open({
              message: "",
              description:
                emailData.error,
              onClick: () => {
              },
              key:1

            });
          }else{
            notification.open({
              message: "",
              description:
                'Email subscription failed',
              onClick: () => {
              },
              key:1

            });
          }
          
        }
      }
    }else{
      notification.open({
        message: "",
        description:
          'Please provide a valid email format',
        onClick: () => {
        },
        key:1

      });
    }
 
  }

  return (
    <div className={style.App} style={{ borderTop: ".1em solid #7c7c7c" }}>
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
          <Link to="/aboutRR"
            style={{ textDecoration: "none", color: "white" }}
           >
            <span
            className={style.span}
          >
            World of RbyR
          </span> 
           </Link>
                      <Link
            to="/store-locator"
            style={{ textDecoration: "none", color: "white" }}
          >
            <span className={style.span} >Store Locator</span>
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
              <FaFacebookF style={{ color: "var(--iconsColor)", fontSize: "25px" }} />
              <TiSocialInstagram style={{ color: "var(--iconsColor)", fontSize: "25px" }} />
              {/* Commented by - Ashish Dewangan on 15-02-2023
              Reason - To hide twitter link */}
              {/* <FaTwitter style={{ color: "grey", fontSize: "25px" }} /> */}
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
            <button className={style.emailBoxButton} onClick={subscribeToEmailUpdate}>
              <IoChevronForwardOutline  
                style={{color:"white"}}
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
          {copyrights.length > 0
            ? copyrights.map((copyright) => {
                return copyright.title;
              })
            : "© 2022 RR. ALL RIGHTS RESERVED"}
        </span>
        <span
          className={style.span2}
          style={{ fontSize: "15px", marginRight: "10px" }}
        >
          Powered by{" "}
          <span
            style={{
              fontFamily: "Rawson-Medium",
              fontSize: "16px",
              fontWeight: "20",
              color:"#212121",
              textDecoration: "none",
            }}
          >
            ADYANT
          </span>
        </span>
      </div>
    </div>
  );
}

export default Footer;
