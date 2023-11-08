import React, { useEffect, useState } from "react";
import Footer from "../global/footer";
import Navbar from "../global/NavHeader";
import style from "./RefundPolicy.module.css";
import { getRefundPoliciesDetail } from "../../api/service";
import parse from "html-react-parser";
import { notification } from 'antd';
const RefundPolicy = () => {
  notification.destroy()
  const [refundPolicies, setRefundPolicies] = useState([]);
  useEffect(() => {
    getRefundPolicies();
    window.scrollTo(0,0)
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
        <div className={style.contain}>
          {refundPolicies.length > 0 ? (
            <>
              {refundPolicies.map((refundPolicy) => {
                return (
                  <div className={style.column}>
                    <span className={style.title}>
                      {parse(refundPolicy.title1)}
                    </span>
                    <span  dangerouslySetInnerHTML={{__html:refundPolicy.content1}} className={style.content}>
                      {/* {parse(refundPolicy.content1)} */}
                    </span>

                    <span className={style.subTitle}>
                      {parse(refundPolicy.subtitle1)}
                    </span>

                    <span dangerouslySetInnerHTML={{__html:refundPolicy.content2}} className={style.content}>
                      {/* {parse(refundPolicy.content2)} */}
                    </span>
                    <br />
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
            >Refund policy currently not available</div>
          )}
        </div>

        <div style={{ marginTop: "5vh" }}>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
