import React, { useEffect, useState } from "react";
import Footer from "../global/footer";
import Navbar from "../global/NavHeader";
import style from "./PrivacyPolicy.module.css";
import { getPrivacyPoliciesDetail } from "../../api/service";
import parse from "html-react-parser";
import { notification } from 'antd';
const PrivacyPolicy = () => {
  notification.destroy()
  const [privacyPolicies, setPrivacyPolicies] = useState([]);

  useEffect(() => {
    getPrivacyPolicies();
    window.scrollTo(0,0)

  }, []);

  const getPrivacyPolicies = async () => {
    const privacyPoliciesData = await getPrivacyPoliciesDetail();
    if (privacyPoliciesData) {
      setPrivacyPolicies(privacyPoliciesData);
    }
  };

  return (
    <div>
      <Navbar />
      <div className={style.ppContainer}>
        <div className={style.contain}>
          {privacyPolicies.length > 0 ? (
            <>
              {privacyPolicies.map((privacyPolicy) => {
                return (
                  <div className={style.column}>
                    <span className={style.title}>
                      {parse(privacyPolicy?.title1)} 
                    </span>
                    <span className={style.content}>
                      {privacyPolicy && privacyPolicy.content1 ? 
                    parse(privacyPolicy.content1)
                    :null}
                    </span>

                    <span className={style.subTitle}>
                      {privacyPolicy && privacyPolicy.subtitle1 ? 
                    parse(privacyPolicy.subtitle1)
                    :null}
                    </span>

                    <span className={style.content}>
                      {privacyPolicy && privacyPolicy.content2 ? 
                    parse(privacyPolicy.content2)
                    :null}
                    </span>
                    <span className={style.subTitle}>
                    {privacyPolicy && privacyPolicy.content3 ? 
                    parse(privacyPolicy.subtitle2)
                    :null}
                    </span>
                    <span className={style.content}>
                      {privacyPolicy && privacyPolicy.content3 ? 
                    parse(privacyPolicy.content3)
                    :null}
                    </span>
                  </div>
                );
              })}
            </>
          ) : (
            <div 
             // Addition by Om Shrivastava on 28-10-23
            // Reason: Need to add styling part 
            style={{fontFamily:'sans-serif',letterSpacing:'1px'}}
            // End of addition by Om Shrivastava on 28-10-23
            // Reason: Need to add styling part 
            >Privacy policy currently not available</div>
          )} 
        </div>

        <div className={style.footerMargin} style={{paddingTop:"100px" }}>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
