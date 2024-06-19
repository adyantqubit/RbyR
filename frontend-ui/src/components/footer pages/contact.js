import React, { Fragment, useEffect, useState } from "react";
import Footer from "../global/footer";
import Navbar from "../global/NavHeader";
import style from "./contact.module.css";
import { InstagramCollections, getContactUsDetail } from "../../api/service";
import parse from "html-react-parser";
import config from "../../api/config";
import { notification } from "antd";
import stylee from "./globalFooterFile.module.css";
import "../../context.css";

const Contact = () => {
  notification.destroy();
  const [contactUs, setContactUs] = useState([]);
  // Addition by Om Shrivastava on 15-06-2024
  // Reason : Set the instagram data
  var [instagramCollections, setInstagramCollections] = useState(null);
  // End of addition by Om Shrivastava on 15-06-2024
  // Reason : Set the instagram data

  useEffect(() => {
    getContactUs();
    // Addition by Om Shrivastava on 15-06-2024
    // Reason : Set the instagram api
    instagramApi();
    // End of addition by Om Shrivastava on 15-06-2024
    // Reason : Set the instagram api
    window.scrollTo(0, 0);
  }, []);

  const getContactUs = async () => {
    const contactUsData = await getContactUsDetail();
    if (contactUsData) {
      setContactUs(contactUsData);
    }
  };
  // Addition by Om Shrivastava on 15-06-2024
  // Reason : Get the instagram data 
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
   // End of addition by Om Shrivastava on 15-06-2024
  // Reason : Get the instagram data 

  const isObjectEmpty = (objectName) => {
    if (objectName != null || objectName != undefined) {
      return Object.keys(objectName)?.length === 0;
    }
  };

  return (
    <>
      <Navbar />
      <div className={style.contact}>
        <div
          className="headingFooter"
          // style={{color:'black',textAlign:'center',fontWeight:'bold',fontSize:'32px',fontFamily:'var(--fontFamily)',paddingBottom:'15px'}}
        >
          {" "}
          Contact Us
        </div>
        {contactUs.length > 0 ? (
          <>
            {contactUs.map((contact) => {
              return (
                <>
                  {/* Commented by Om Shrivastava on 27-11-23
                      Reason : Set this content in heading  */}
                  <div
                    className={style.headingName}
                    // style={{color:'black',textAlign:'center',fontWeight:'bold',fontSize:'28px',fontFamily:'var(--fontFamily)',paddingBottom:'15px'}}
                  >
                    {" "}
                    {parse(contact.subtitle1)}
                  </div>
                  {/* End of Commented by Om Shrivastava on 27-11-23
                      Reason : Set this content in heading    */}
                  <div className={style.contain}>
                    <div
                      className={
                        contact && contact.contactUsImage
                          ? `${style.column} ${style.col1}`
                          : `${style.columnMain}`
                      }
                    >
                      {/* className={`${style.column} ${style.col1}`} */}
                      {/* style={{width:'50%',border:'1px solid blue'}} */}

                      <span className={style.head}>
                        {/* Commented by Om Shrivastava on 27-11-23
                      Reason : Set this content in heading  */}
                        {/* {parse(contact.subtitle1)} */}
                      </span>
                      <span
                        dangerouslySetInnerHTML={{ __html: contact.content1 }}
                        className={style.body}
                      >
                        {/* {parse(contact.content1)} */}
                      </span>

                      <span className={style.head2}>
                        {/* Modification and addition by Om Shrivastava on 08-11-23
                      Reason : When the data is not there then no need to show this div  */}
                        {contact && contact.subtitle2
                          ? parse(contact.subtitle2)
                          : null}
                        {/* End of modification and addition by Om Shrivastava on 08-11-23
                      Reason : When the data is not there then no need to show this div  */}
                      </span>
                      <span
                        dangerouslySetInnerHTML={{ __html: contact.content2 }}
                        className={style.body}
                      >
                        {/* {parse(contact.content2)} */}
                      </span>

                      <span className={style.head2}>
                        {/* Modification and addition by Om Shrivastava on 08-11-23
                      Reason : When the data is not there then no need to show this div  */}
                        {contact && contact.subtitle3
                          ? parse(contact.subtitle3)
                          : null}
                        {/* End of modification and addition by Om Shrivastava on 08-11-23
                      Reason : When the data is not there then no need to show this div  */}
                      </span>
                      <span
                        dangerouslySetInnerHTML={{ __html: contact.content3 }}
                        className={style.body}
                      >
                        {/* {parse(contact.content3)} */}
                      </span>
                    </div>
                    {contact && contact.contactUsImage ? (
                      <div className={`${style.column} ${style.col2}`}>
                        {/* Modification and addition by Om Shrivastava on 20-10-23
                    Reason : Need to add right path for the image */}
                        {/* <img  src={config.staticBaseURL+contact.contactUsImage}></img> */}

                        <img
                          src={
                            config.staticBaseURL +
                            "media/" +
                            contact?.contactUsImage
                          }
                        ></img>

                        {/* Modification and addition by Om Shrivastava on 20-10-23
                    Reason : Need to add right path for the image */}
                      </div>
                    ) : null}
                  </div>
                </>
              );
            })}
          </>
        ) : (
          // Addition and modification by Om shrivastava on 27-11-23
          // Reason : Set the height and width
          <div
            className={stylee.footerNullContent}
            // style={{height:'18vh'}}
          >
            <div
            // style={{border:'1px solid black'}}
            >
              {/* Contact Details Are Not Available */}
            </div>
          </div>
          // End of addition and modification by Om shrivastava on 27-11-23
          // Reason : Set the height and width
        )}
        {/* </div> */}
        {/* Addition by Om Shrivastava on 15-06-2024
        Reason : Create div section for get the instagram data  */}
        {isObjectEmpty(instagramCollections) != true ? (
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
                  Follow Us
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
                src={
                  config.staticBaseURL + instagramCollections?.instagram_post1
                }
              ></img>
            </a>
            <a
              className={style.instagramLink}
              href={instagramCollections?.instagram_post2_link}
            >
              <img
                className={style.instagramImage}
                src={
                  config.staticBaseURL + instagramCollections?.instagram_post2
                }
              ></img>
            </a>
            <a
              className={style.instagramLink}
              href={instagramCollections?.instagram_post3_link}
            >
              <img
                className={style.instagramImage}
                src={
                  config.staticBaseURL + instagramCollections?.instagram_post3
                }
              ></img>
            </a>
            <a
              className={style.instagramLink}
              href={instagramCollections?.instagram_post4_link}
            >
              <img
                className={style.instagramImage}
                src={
                  config.staticBaseURL + instagramCollections?.instagram_post4
                }
              ></img>
            </a>
            <a
              className={style.instagramLink}
              href={instagramCollections?.instagram_post5_link}
            >
              <img
                className={style.instagramImage}
                src={
                  config.staticBaseURL + instagramCollections?.instagram_post5
                }
              ></img>
            </a>
          </div>
        ) : null}
        {/* End of addition by Om Shrivastava on 15-06-2024
        Reason : Create div section for get the instagram data  */}
        <div
        // Modification and addition by Om Shrivastava on 29-11-23
        // Reason : Set the spacing
        // className={style.footerMargin}
        // className={stylee.footerSpacing}
        // style={{ paddingTop: "80px"}}
        // End of Modification and addition by Om Shrivastava on 29-11-23
        // Reason : Set the spacing
        >
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Contact;
