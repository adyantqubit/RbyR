import style from "./footer2.module.css";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { TiSocialInstagram } from "react-icons/ti";
import { FiArrowRight } from "react-icons/fi";
import {IoChevronForwardOutline} from "react-icons/io5"
import { Link, useNavigate } from "react-router-dom";
import { getSocialLinkDetail, getCopyrightDetails,postEmailDetails } from "../../api/service";
import { useEffect, useState } from "react";
import { notification } from "antd";
import config from "../../api/config";
import '../../context.css'

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
    if(email.value.length==0){
      notification.open({
        message: "",
        // Modification and addition by Om shrivastava on 01-12-23
        // REason : Create the popup class to apply the designing
        className:'popupClass',
        // style:{marginTop:"20px"},
        // style:{backgroundColor: "#f1cdd9",
        // padding:'0px 5px 5px 5px',borderRadius:'10px',width:'200px'},
        // End of modification and addition by Om shrivastava on 01-12-23
        // REason : Create the popup class to apply the designing
        description:
          'Please enter email id',
        onClick: () => {
        },
        key:1

      });
    }

    else if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)){
      const data={
        email:email.value
      }
      const emailData= await postEmailDetails(data);
      if(emailData){
        if(emailData.msg){
          notification.open({
            message: "",
              // Modification and addition by Om shrivastava on 01-12-23
        // REason : Create the popup class to apply the designing
        className:'popupClass',
        // style:{marginTop:"20px"},
        // style:{backgroundColor: "#f1cdd9",
        // padding:'0px 5px 5px 5px',borderRadius:'10px',width:'200px'},
        // End of modification and addition by Om shrivastava on 01-12-23
        // REason : Create the popup class to apply the designing
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
              // Modification and addition by Om shrivastava on 01-12-23
        // REason : Create the popup class to apply the designing
        className:'popupClass',
        // style:{marginTop:"20px"},
        // style:{backgroundColor: "#f1cdd9",
        // padding:'0px 5px 5px 5px',borderRadius:'10px',width:'200px'},
        // End of modification and addition by Om shrivastava on 01-12-23
        // REason : Create the popup class to apply the designing
              description:
                emailData.error,
              onClick: () => {
              },
              key:1

            });
          }else{
            notification.open({
              message: "",
               // Modification and addition by Om shrivastava on 01-12-23
        // REason : Create the popup class to apply the designing
        className:'popupClass',
        // style:{marginTop:"20px"},
        // style:{backgroundColor: "#f1cdd9",
        // padding:'0px 5px 5px 5px',borderRadius:'10px',width:'200px'},
        // End of modification and addition by Om shrivastava on 01-12-23
        // REason : Create the popup class to apply the designing
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
         // Modification and addition by Om shrivastava on 01-12-23
        // REason : Create the popup class to apply the designing
        className:'popupClass',
        // style:{marginTop:"20px"},
        // style:{backgroundColor: "#f1cdd9",
        // padding:'0px 5px 5px 5px',borderRadius:'10px',width:'200px'},
        // End of modification and addition by Om shrivastava on 01-12-23
        // REason : Create the popup class to apply the designing
        description:
          'Please provide a valid email format',
        onClick: () => {
        },
        key:1

      });
    }
 
  }

  return (
    <div 
    className={style.App} 
    style={{ borderTop: ".1em solid #7c7c7c" }}>
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
          <h1 className={style.heading} >Follow Us</h1>
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
                  return <img src={config.staticBaseURL+'media/'+socialLink.logo} style={{color:"var(--iconsColor)",width:"25px",height:"25px"}} alt=""/>
                  })
                  }
                  </>
                  ) 
                  : null}
              {/* <FaFacebookF style={{ color: "var(--iconsColor)", fontSize: "25px" }} />
              <TiSocialInstagram style={{ color: "var(--iconsColor)", fontSize: "25px" }} /> */}
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
              maxLength={254}
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
             // Modification and addition by Om Shrivastava on 04-11-23
              // Reason : No need to show the hardcode content
            // : "© 2022 RR. ALL RIGHTS RESERVED"}
            : ""}
            {/* // End of modification and addition by Om Shrivastava on 04-11-23
              // Reason : No need to show the hardcode content */}
        </span>

        <a href="https://adyant.co.in/" target="_blank">
        <span
          className={style.span2}
          style={{ fontSize: "15px", marginRight: "10px" }}
        >
          Powered by{" "}
          <span
            className={style.span2}
            style={{
              // fontFamily: "var(--fontFamily)",
              fontSize: "14px",
              // fontWeight: "20",
              // color:"black",
              // textDecoration: "none",
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

export default Footer;
