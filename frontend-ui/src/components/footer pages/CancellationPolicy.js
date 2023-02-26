import React, { useEffect, useState } from "react";
import Footer from "../global/footer";
import Navbar from "../global/NavHeader";
import style from "./CancellationPolicy.module.css";
import { getCancellationPoliciesDetail } from "../../api/service";
import parse from "html-react-parser";
import { notification } from 'antd';
const CancellationPolicy = () => {
  notification.destroy()
  const [cancellationPolicies, setCancellationPolicies] = useState([]);
  useEffect(() => {
    getCancellationPolicies();
    window.scrollTo(0,0)
  }, []);

  const getCancellationPolicies = async () => {
    const cancellationPoliciesData = await getCancellationPoliciesDetail();
    if (cancellationPoliciesData) {
      setCancellationPolicies(cancellationPoliciesData);
    }
  };

  return (
    <div>
      <Navbar />
      <div className={style.ppContainer}>
        <div className={style.contain}>
          {cancellationPolicies.length > 0 ? (
            <>
              {cancellationPolicies.map((cancellationPolicy) => {
                return (
                  <div className={style.column}>
                    <span className={style.title}>
                      {parse(cancellationPolicy.title1)}
                    </span>
                    <span dangerouslySetInnerHTML={{__html:cancellationPolicy.content1}} className={style.content}>
                      {/* {parse(cancellationPolicy.content1)} */}
                    </span>

                    <span className={style.subTitle}>
                      {parse(cancellationPolicy.subtitle1)}
                    </span>

                    <span dangerouslySetInnerHTML={{__html:cancellationPolicy.content2}} className={style.content}>
                      {/* {parse(cancellationPolicy.content2)} */}
                    </span>

                    <br />
                  </div>
                );
              })}
            </>
          ) : (
            <div>Cancellation policy currently not available </div>
          )}
        </div>

        <div style={{ marginTop: "-20vh" }}>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy;
