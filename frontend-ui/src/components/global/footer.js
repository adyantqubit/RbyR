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
            message: 'Success',
            description:
              'Subscribed to email updates successfully',
            onClick: () => {
            },
          });
        }else{
          if(emailData.error){
            notification.open({
              message: 'Error',
              description:
                emailData.error,
              onClick: () => {
              },
            });
          }else{
            notification.open({
              message: 'Error',
              description:
                'Email subscription failed',
              onClick: () => {
              },
            });
          }
          
        }
      }
    }else{
      notification.open({
        message: 'Error',
        description:
          'Please provide a valid email format',
        onClick: () => {
        },
      });
    }
 
  }

  return (
    <div className={style.App} style={{ borderTop: "1px solid white" }}>
      <div className={style.row}>
        <div className={style.column1}>
          <h1 className={style.heading}>CUSTOMER CARE</h1>
          <a href="/custom" style={{ textDecoration: "none", color: "white" }}>
            {" "}
            <span className={style.span}>Contact Us</span>
          </a>
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
            <span className={style.span}>Refund Policy</span>
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
          <span className={style.span} onClick={e=>nav('/Listing/world_of_rbyr')} style={{cursor:"pointer"}}>RR EXCLUSIVE</span>
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
                marginTop: "15px",
              }}
            >
              <FaFacebookF style={{ color: "grey", fontSize: "25px" }} />
              <TiSocialInstagram style={{ color: "grey", fontSize: "25px" }} />
              <FaTwitter style={{ color: "grey", fontSize: "25px" }} />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                marginTop: "15px",
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
                            color: "white",
                            marginLeft: "10px",
                          }}
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
            style={{ display: "flex", flexDirection: "row", marginTop: "30px" }}
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
