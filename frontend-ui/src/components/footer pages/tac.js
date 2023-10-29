import React, { useEffect, useState } from "react";
import Footer from "../global/footer";
import Navbar from "../global/NavHeader";
import style from "./tac.module.css";
import { getTermsAndConditionsDetail } from "../../api/service";
import parse from "html-react-parser";
import {IoMdArrowRoundBack} from "react-icons/io"
import { notification } from 'antd';
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
            <div 
            // Addition by Om Shrivastava on 28-10-23
            // Reason: Need to add styling part 
            style={{fontFamily:'Lora',letterSpacing:'1px'}}
            // End of addition by Om Shrivastava on 28-10-23
            // Reason: Need to add styling part 
            >No Terms and Conditions are present</div>
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
