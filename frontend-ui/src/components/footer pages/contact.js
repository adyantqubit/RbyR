import React, { Fragment, useEffect, useState } from "react";
import Footer from "../global/footer";
import Navbar from "../global/NavHeader";
import style from "./contact.module.css";
import { getContactUsDetail } from "../../api/service";
import parse from "html-react-parser";
import config from "../../api/config";
import { notification } from 'antd';
const Contact = () => {
  notification.destroy()
  const [contactUs, setContactUs] = useState([]);

  useEffect(() => {
    getContactUs();
    window.scrollTo(0,0)

  }, []);

  const getContactUs = async () => {
    const contactUsData = await getContactUsDetail();
    if (contactUsData) {
      setContactUs(contactUsData);
    }
  };

  return (
    <>
      <Navbar />
      <div className={style.contact}>
        {contactUs.length > 0 ? (
          <>
            {contactUs.map((contact) => {
              return (
                <div className={style.contain}>
                  <div className={`${style.column} ${style.col1}`}>
                    <span className={style.head}>
                      {parse(contact.subtitle1)}
                    </span>
                    <span dangerouslySetInnerHTML={{__html:contact.content1}} className={style.body}>
                      {/* {parse(contact.content1)} */}
                    </span>

                    <span className={style.head2}>
                       {/* Modification and addition by Om Shrivastava on 08-11-23
                      Reason : When the data is not there then no need to show this div  */}
                      {contact && contact.subtitle2 ? 
                    parse(contact.subtitle2)
                    :null}
                     {/* End of modification and addition by Om Shrivastava on 08-11-23
                      Reason : When the data is not there then no need to show this div  */}
                    </span>
                    <span dangerouslySetInnerHTML={{__html:contact.content2}} className={style.body}>
                      {/* {parse(contact.content2)} */}
                    </span>

                    <span className={style.head2}>
                      {/* Modification and addition by Om Shrivastava on 08-11-23
                      Reason : When the data is not there then no need to show this div  */}
                      {contact && contact.subtitle3 ? 
                    parse(contact.subtitle3)
                    :null}
                     {/* End of modification and addition by Om Shrivastava on 08-11-23
                      Reason : When the data is not there then no need to show this div  */}
                    </span>
                    <span  dangerouslySetInnerHTML={{__html:contact.content3}} className={style.body}>
                      {/* {parse(contact.content3)} */}
                    </span>
                  </div>
                  <div className={`${style.column} ${style.col2}`}>
                    {/* Modification and addition by Om Shrivastava on 20-10-23
                    Reason : Need to add right path for the image */}
                    {/* <img  src={config.staticBaseURL+contact.contactUsImage}></img> */}
                    <img  src={config.staticBaseURL+"media/"+contact.contactUsImage}></img>
                    {/* Modification and addition by Om Shrivastava on 20-10-23
                    Reason : Need to add right path for the image */}
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div>No Contact Detail is present</div>
        )}

        {/* </div> */}

        <div className={style.footerMargin} style={{ paddingTop: "80px" }}>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Contact;
