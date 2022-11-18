import React, { useEffect, useState } from "react";
import Footer from "../global/footer";
import Navbar from "../global/NavHeader";
import style from "./RefundPolicy.module.css";
import { getRefundPoliciesDetail } from "../../api/service";
import parse from "html-react-parser";

const RefundPolicy = () => {
  const [refundPolicies, setRefundPolicies] = useState([]);
  useEffect(() => {
    getRefundPolicies();
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
                    <span className={style.content}>
                      {parse(refundPolicy.content1)}
                    </span>

                    <span className={style.subTitle}>
                      {parse(refundPolicy.subtitle1)}
                    </span>

                    <span className={style.content}>
                      {parse(refundPolicy.content2)}
                    </span>
                    <br />
                  </div>
                );
              })}
            </>
          ) : (
            <div>Refund policy currently not available</div>
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
