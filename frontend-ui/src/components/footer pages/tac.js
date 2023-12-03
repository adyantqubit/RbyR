import React, { useEffect, useState } from "react";
import Footer from "../global/footer";
import Navbar from "../global/NavHeader";
import style from "./tac.module.css";
import { getTermsAndConditionsDetail } from "../../api/service";
import parse from "html-react-parser";
import {IoMdArrowRoundBack} from "react-icons/io"
import { notification } from 'antd';
import stylee from './globalFooterFile.module.css'
import '../../context.css'

const Terms = () => {
notification.destroy()
  const [termsAndConditions, setTermsAndConditions] = useState([]);

  useEffect(() => {
    getTermsAndConditions();
    window.scrollTo(0,0)
  }, []);

  const getTermsAndConditions = async () => {
    const termsAndConditionsData = await getTermsAndConditionsDetail();
    if (termsAndConditionsData) {
      setTermsAndConditions(termsAndConditionsData);
      
    }
  };

  return (
    <div>
      <Navbar />
      <div className={style.tacContainer}>
      <div className='headingFooter'
      > Terms & Conditions</div> 
        <div className={style.contain}>
          
          {termsAndConditions.length > 0 ? (
            <>
              {termsAndConditions.map((termAndCondition) => {
                return (
                  <div className={style.column}>
                    <span className={style.title}>{parse(termAndCondition.title1)}</span>
                    <span dangerouslySetInnerHTML={{__html:termAndCondition.content1}} className={style.content}>
                      {/* {parse(termAndCondition.content1)} */}
                    </span>
                    
                    <span className={style.subTitle}>
                      {parse(termAndCondition.subtitle1)}
                    </span>
                    
                    <span dangerouslySetInnerHTML={{__html:termAndCondition.content2}} className={style.content}>
                    {/* {parse(termAndCondition.content2)} */}
                    </span>

                    <span className={style.subTitle}>
                                 {/* Modification and addition by Om Shrivastava on 08-11-23
                      Reason : When the data is not there then no need to show this div  */}
                      {termAndCondition && termAndCondition.subtitle2 ? 
                    parse(termAndCondition.subtitle2)
                    :null}
                     {/* End of modification and addition by Om Shrivastava on 08-11-23
                      Reason : When the data is not there then no need to show this div  */}
                      </span>
                    <span dangerouslySetInnerHTML={{__html:termAndCondition.content3}} className={style.content}>
                    {/* {parse(termAndCondition.content3)} */}
                    </span>

                    <span className={style.subTitle}>
                      {/* Modification and addition by Om Shrivastava on 08-11-23
                      Reason : When the data is not there then no need to show this div  */}
                      {termAndCondition && termAndCondition.subtitle3 ? 
                    parse(termAndCondition.subtitle3)
                    :null}
                     {/* End of modification and addition by Om Shrivastava on 08-11-23
                      Reason : When the data is not there then no need to show this div  */}
                    </span>
                    <span dangerouslySetInnerHTML={{__html:termAndCondition.content4}} className={style.content}>
                    {/* {parse(termAndCondition.content4)} */}
                    </span>

                    <span className={style.subTitle}>
                      {/* Modification and addition by Om Shrivastava on 08-11-23
                      Reason : When the data is not there then no need to show this div  */}
                      {termAndCondition && termAndCondition.subtitle4 ? 
                    parse(termAndCondition.subtitle4)
                    :null}
                     {/* End of modification and addition by Om Shrivastava on 08-11-23
                      Reason : When the data is not there then no need to show this div  */}
                    </span>
                    <span dangerouslySetInnerHTML={{__html:termAndCondition.content5}} className={style.content}>
                    {/* {parse(termAndCondition.content5)} */}
                    </span>
                  </div>
                );
              })}
            </>
          ) : (
            // Addition and modification by Om shrivastava on 27-11-23
          // Reason : Set the height and width
          <div className={stylee.footerTermsNullContent}
          // style={{height:'35vh'}}
          >
            
            <div 
            // style={{border:'1px solid black'}}
            >
            Terms And Conditions Details Are Not Available
            </div>
            </div>
            // End of addition and modification by Om shrivastava on 27-11-23
          // Reason : Set the height and width

          )}
        </div>

        <div style={{ marginTop: "5vh" }}>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Terms;
