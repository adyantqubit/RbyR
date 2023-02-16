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
                    <span className={style.body}>
                      {parse(contact.content1)}
                    </span>

                    <span className={style.head2}>
                      {parse(contact.subtitle2)}
                    </span>
                    <span className={style.body}>
                      {parse(contact.content2)}
                    </span>

                    <span className={style.head2}>
                      {parse(contact.subtitle3)}
                    </span>
                    <span className={style.body}>
                      {parse(contact.content3)}
                    </span>
                  </div>
                  <div className={`${style.column} ${style.col2}`}>
                    <img  src={config.apiBaseURL+contact.contactUsImage}></img>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div>No Contact Detail is present</div>
        )}

        {/* </div> */}

        <div style={{ paddingTop: "80px",background:"#ffffff" }}>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Contact;
