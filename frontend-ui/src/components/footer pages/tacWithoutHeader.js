import React, { useEffect, useState } from "react";
import Footer from "../global/footer";
import Navbar from "../global/NavHeader";
import style from "./tacWithoutHeader.module.css";
import { getTermsAndConditionsDetail } from "../../api/service";
import parse from "html-react-parser";
import {IoMdArrowRoundBack} from "react-icons/io"
import { notification } from 'antd';
import stylee from './globalFooterFile.module.css'

const TermsWithoutHeader = () => {
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
      <div className={style.tacContainer}>
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

                    <span className={style.subTitle}>{parse(termAndCondition.subtitle2)}</span>
                    <span dangerouslySetInnerHTML={{__html:termAndCondition.content3}} className={style.content}>
                    {/* {parse(termAndCondition.content3)} */}
                    </span>

                    <span className={style.subTitle}>
                    {parse(termAndCondition.subtitle3)}
                    </span>
                    <span dangerouslySetInnerHTML={{__html:termAndCondition.content4}} className={style.content}>
                    {/* {parse(termAndCondition.content4)} */}
                    </span>

                    <span className={style.subTitle}>
                    {parse(termAndCondition.subtitle4)}
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

      </div>
    </div>
  );
};

export default TermsWithoutHeader;
