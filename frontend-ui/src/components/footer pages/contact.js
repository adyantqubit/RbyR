import React, { Fragment, useEffect, useState } from "react";
import Footer from "../global/footer";
import Navbar from "../global/NavHeader";
import style from "./contact.module.css";
import { getContactUsDetail } from "../../api/service";
import parse from "html-react-parser";
import config from "../../api/config";
import { notification } from 'antd';
import stylee from './globalFooterFile.module.css'
import '../../context.css'

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
                <>
      <div className='headingFooter'
      // style={{color:'black',textAlign:'center',fontWeight:'bold',fontSize:'32px',fontFamily:'var(--fontFamily)',paddingBottom:'15px'}}
      > Contact Us</div> 

                {/* Commented by Om Shrivastava on 27-11-23
                      Reason : Set this content in heading  */}
                    <div className={style.headingName}
                    // style={{color:'black',textAlign:'center',fontWeight:'bold',fontSize:'28px',fontFamily:'var(--fontFamily)',paddingBottom:'15px'}}
                    > {parse(contact.subtitle1)}</div> 
{/* End of Commented by Om Shrivastava on 27-11-23
                      Reason : Set this content in heading    */}
                <div className={style.contain}>
  
                  <div className={`${style.column} ${style.col1}`}>
                    <span className={style.head}>
                      {/* Commented by Om Shrivastava on 27-11-23
                      Reason : Set this content in heading  */}
                      {/* {parse(contact.subtitle1)} */}
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
                </>
              );
            })}
          </>
        ) : (
          // Addition and modification by Om shrivastava on 27-11-23
          // Reason : Set the height and width
          <div className={stylee.footerNullContent}
          // style={{height:'18vh'}}
          >
            
            <div 
            // style={{border:'1px solid black'}}
            >
            Contact Details Are Not Available
            </div>
            </div>
            // End of addition and modification by Om shrivastava on 27-11-23
          // Reason : Set the height and width
        )}

        {/* </div> */}

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
