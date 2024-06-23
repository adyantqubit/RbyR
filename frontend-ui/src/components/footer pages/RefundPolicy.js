import React, { useEffect, useState } from "react";
import Footer from "../global/footer";
import Navbar from "../global/NavHeader";
import style from "./RefundPolicy.module.css";
import { getRefundPoliciesDetail } from "../../api/service";
import parse from "html-react-parser";
import { notification } from "antd";
import stylee from "./globalFooterFile.module.css";
import "../../context.css";

const RefundPolicy = () => {
  notification.destroy();
  const [refundPolicies, setRefundPolicies] = useState([]);
  useEffect(() => {
    getRefundPolicies();
    window.scrollTo(0, 0);
  }, []);

  const getRefundPolicies = async () => {
    const refundPoliciesData = await getRefundPoliciesDetail();
    if (refundPoliciesData) {
      setRefundPolicies(refundPoliciesData);
    }
  };

  return (
    <div>
      <Navbar />
      <div className={style.ppContainer}>
        <div className={style.divContainer}>
          <div className="headingFooter"> Return policy</div>
          <div className={style.contain}>
            {refundPolicies.length > 0 ? (
              <>
                {refundPolicies.map((refundPolicy) => {
                  return (
                    <div className={style.column}>
                      <span className={style.title}>
                        {parse(refundPolicy.title1)}
                      </span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: refundPolicy.content1,
                        }}
                        className={style.content}
                      >
                        {/* {parse(refundPolicy.content1)} */}
                      </span>

                      <span className={style.subTitle}>
                        {parse(refundPolicy.subtitle1)}
                      </span>

                      <span
                        dangerouslySetInnerHTML={{
                          __html: refundPolicy.content2,
                        }}
                        className={style.content}
                      >
                        {/* {parse(refundPolicy.content2)} */}
                      </span>
                      <br />
                    </div>
                  );
                })}
              </>
            ) : (
              // Addition and modification by Om shrivastava on 27-11-23
              // Reason : Set the height and width
              <div
                className={stylee.footerRefundNullContent}
                // style={{height:'35vh'}}
              >
                <div
                // style={{border:'1px solid black'}}
                >
                  Return Policy Details Are Not Available
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
    </div>
  );
};

export default RefundPolicy;
