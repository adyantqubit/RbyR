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
                      {parse(privacyPolicy.title1)}
                    </span>
                    <span className={style.content}>
                      {parse(privacyPolicy.content1)}
                    </span>

                    <span className={style.subTitle}>
                      {parse(privacyPolicy.subtitle1)}
                    </span>

                    <span className={style.content}>
                      {parse(privacyPolicy.content2)}
                    </span>
                    <span className={style.subTitle}>
                      {parse(privacyPolicy.subtitle2)}
                    </span>
                    <span className={style.content}>
                      {parse(privacyPolicy.content3)}
                    </span>
                  </div>
                );
              })}
            </>
          ) : (
            <div>Privacy policy currently not available</div>
          )}
        </div>

        <div style={{paddingTop:"100px",background:"#323232" }}>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
