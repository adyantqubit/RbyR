import React, { useEffect, useState } from "react";
import Footer from "../global/footer";
import Navbar from "../global/NavHeader";
import style from "./CancellationPolicy.module.css";
import { getCancellationPoliciesDetail } from "../../api/service";
import parse from "html-react-parser";
import { notification } from 'antd';
import stylee from './globalFooterFile.module.css'
import '../../context.css'

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
      <div className='headingFooter'
      > Order cancellation policy</div> 
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
                   // Addition and modification by Om shrivastava on 27-11-23
          // Reason : Set the height and width
          <div className={stylee.footerOrderCancellationNullContent}
          // style={{height:'35vh'}}
          >
            
            <div 
            // style={{border:'1px solid black'}}
            >
            Order Cancellation Policy Details Are Not Available
            </div>
            </div>
            // End of addition and modification by Om shrivastava on 27-11-23
          // Reason : Set the height and width
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
