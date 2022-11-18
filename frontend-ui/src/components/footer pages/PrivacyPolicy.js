import React, { useEffect, useState } from "react";
import Footer from "../global/footer";
import Navbar from "../global/NavHeader";
import style from "./PrivacyPolicy.module.css";
import { getPrivacyPoliciesDetail } from "../../api/service";
import parse from "html-react-parser";

const PrivacyPolicy = () => {
  const [privacyPolicies, setPrivacyPolicies] = useState([]);

  useEffect(() => {
    getPrivacyPolicies();
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

        <div style={{ marginTop: "5vh" }}>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
