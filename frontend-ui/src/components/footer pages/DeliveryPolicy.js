import React, { useEffect, useState } from "react";
import Footer from "../global/footer";
import Navbar from "../global/NavHeader";
import style1 from "./contact.module.css";
import style from "./DeliveryPolicy.module.css";
import { getDeliveryAndShippingPoliciesDetail } from "../../api/service";
import parse from "html-react-parser";
import { notification } from 'antd';
const DeliveryPolicy = () => {
  notification.destroy()
  const [deliveryAndShippingPolicies, setDeliveryAndShippingPolicies] =
    useState([]);
  useEffect(() => {
    getDeliveryAndShippingPolicies();
  }, []);

  const getDeliveryAndShippingPolicies = async () => {
    const deliveryAndShippingPoliciesData =
      await getDeliveryAndShippingPoliciesDetail();
    if (deliveryAndShippingPoliciesData) {
      setDeliveryAndShippingPolicies(deliveryAndShippingPoliciesData);
    }
  };

  return (
    <div>
      <Navbar />
      <div className={style.ppContainer}>
        <div className={style.contain}>
          {deliveryAndShippingPolicies.length > 0 ? (
            <>
              {deliveryAndShippingPolicies.map((deliveryAndShippingPolicy) => {
                return (
                  <div className={style.column}>
                    <span className={style.title}>
                      {parse(deliveryAndShippingPolicy.title1)}
                    </span>
                    <span className={style.content}>
                      {parse(deliveryAndShippingPolicy.content1)}
                    </span>
                    <br />
                    <span className={style.title}>
                      {parse(deliveryAndShippingPolicy.title2)}
                    </span>
                    <span className={style.content}>
                      {parse(deliveryAndShippingPolicy.content2)}
                    </span>
                  </div>
                );
              })}
            </>
          ) : (
            <div>Delivery policy currently not available</div>
          )}
          {/* <div className={style.column}>
            <span className={style.title}>DELIVERY & SHIPPING POLICY</span>
            <span className={style.content}>
            We offer complimentary domestic shipping.
            </span>
            <br/>
            <span className={style.content}>
            The estimated time to ship will differ depending on the respective delivery deadlines mentioned against each product. Our products are shipped as per the timelines mentioned on the product page. The delivery lead time is about 4-12 days from the date of dispatch for domestic and international orders respectively. All the shipping details will be shared over an email with you.
            </span>
            <br/>
            <span className={style.content}>
            We also offer ‘Ship to Store’ facility to customers within India. To pick your order from RbyR flagship store please email us after placing your order at adyant.org@gmail.com You will need to carry a valid Id proof (Driving license, Passport etc) for identity and billing address verification. All deliveries are made from Monday to Friday, this excludes bank holidays and weekends. A signature is required upon delivery. If you are not available to accept delivery the courier company will leave a calling card and/or send a notification via SMS/Call or Email to advise that delivery has been attempted. If the parcel is not successfully delivered to you, it will be returned to us. Additional postage charges will be applicable for further delivery in case the parcel is returned to us.
            </span>
            <br/>
            <span className={style.content}>
            All international orders may be subject to import/custom duties or local taxes, which are levied by the importing country you are in and as the recipient, you are liable to clear the payment of these to release your order from customs on arrival. We advise checking with your local custom authorities to find correct information on import duties from India.
            </span>
            <br/>
            <span className={style.content}>
            For any queries regarding delivery please email us at adyant.org@gmail.com
            </span>
            <br/>
            <span className={style.content}>
            Kindly refer to our terms and conditions for further information.
            </span>
            <br/>
            <span className={style.title}>INTERNATIONAL DELIVERY</span>
            <span className={style.content}>
            For International deliveries, the shipping cost is calculated at the time of placing the order depending on the value, weight and volume of the products purchased.
            </span>
            <br/>
             <span className={style.content}>
             We will provide you with an estimated delivery date for your order at the time of placing the order, which will also be noted on your order confirmation email. We do not ship on Saturdays, Sundays and/or on nationally observed holidays. Once shipped, you will receive a shipment confirmation email with a tracking number. Please note : the shipping charge DOES NOT include import duty(s). Please read our tax related T&Cs. Before your parcel leaves our warehouse, it is fully checked by our quality control team. If you receive an item which is damaged, please Contact Us immediately at adyant.org@gmail.com
            </span>
          </div> */}
        </div>

        <div style={{ paddingTop: "100px",background:"#323232" }}>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DeliveryPolicy;
