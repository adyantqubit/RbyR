import React, { useEffect, useState } from "react";
import Footer from "../global/footer";
import Navbar from "../global/NavHeader";
import style from "./PrivacyPolicy.module.css";
import { getPrivacyPoliciesDetail } from "../../api/service";
import parse from "html-react-parser";
import { notification } from "antd";
import stylee from "./globalFooterFile.module.css";
import "../../context.css";

const PrivacyPolicy = () => {
  notification.destroy();
  const [privacyPolicies, setPrivacyPolicies] = useState([]);

  useEffect(() => {
    getPrivacyPolicies();
    window.scrollTo(0, 0);
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
        <div className={style.divContainer} >
          <div className="headingFooter"> Privacy policy</div>
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
                        {privacyPolicy && privacyPolicy.content1
                          ? parse(privacyPolicy.content1)
                          : null}
                      </span>

                      <span className={style.subTitle}>
                        {privacyPolicy && privacyPolicy.subtitle1
                          ? parse(privacyPolicy.subtitle1)
                          : null}
                      </span>

                      <span className={style.content}>
                        {privacyPolicy && privacyPolicy.content2
                          ? parse(privacyPolicy.content2)
                          : null}
                      </span>
                      <span className={style.subTitle}>
                        {privacyPolicy && privacyPolicy.content3
                          ? parse(privacyPolicy.subtitle2)
                          : null}
                      </span>
                      <span className={style.content}>
                        {privacyPolicy && privacyPolicy.content3
                          ? parse(privacyPolicy.content3)
                          : null}
                      </span>
                    </div>
                  );
                })}
              </>
            ) : (
              // Addition and modification by Om shrivastava on 27-11-23
              // Reason : Set the height and width
              <div
                className={stylee.footerPrivacyNullContent}
                // style={{height:'35vh'}}
              >
                <div
                // style={{border:'1px solid black'}}
                >
                  Privacy Policy Details Are Not Available
                </div>
              </div>
              // End of addition and modification by Om shrivastava on 27-11-23
              // Reason : Set the height and width
            )}
          </div>

          <div
            className={style.footerMargin}
            // style={{paddingTop:"100px" }}
          >
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
