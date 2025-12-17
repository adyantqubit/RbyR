/**Code added by Unnati on 07-10-2024
 * Reason-Added payment detail page
 */

import React, { useState, useEffect, useContext } from "react";
import PaymentDetailStyles from "./PaymentDetail.module.css";
import { getStripeSessionStatusAPI, postOrderUsingStripeAPI } from "../../Api/services";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal } from "antd";
import { GlobalContext } from "../../context/Context";
import notificationObject from "../../components/Widgets/Notification/Notification";
const PaymentProcessing = () => {
  const { cartData, setCartData } = useContext(GlobalContext);
  const [isLoading, setIsLoading] = useState(true);
  
  const [stripePaymentStatus, setStriptePaymentStatus] = useState("");
  const [stripeCustomerEmail, setStripeCustomerEmail] = useState('');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();
  const [orderDetails,setOrderDetails]=useState({})

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const stripeSessionId = urlParams.get('session_id');
    createOrder(stripeSessionId)
  }, []);

  const createOrder = async (stripeSessionId)=>{

    const localOrderTime = new Date().toLocaleString(undefined, {
      timeZone: "Asia/Kolkata",
    });
    var userId = JSON.parse(localStorage.getItem("userId"))
    var billingAddress = JSON.parse(localStorage.getItem("billingAddress"))
    var shippingAddress = JSON.parse(localStorage.getItem("shippingAddress"))

    const response = await postOrderUsingStripeAPI(
      stripeSessionId,
      userId,
      billingAddress,
      shippingAddress,
      localOrderTime,
  
    );
    if(response.success){

      setOrderDetails(response.orderSummary)
      const res = await getStripeSessionStatusAPI(stripeSessionId)
      setStriptePaymentStatus(res.status);
      setStripeCustomerEmail(res.customer_email);
      setIsLoading(false)
    }

  }

  useEffect(()=>{
    if(stripePaymentStatus?.trim()?.length>0){
    if (stripePaymentStatus == "complete") {
      localStorage.removeItem("cartData");
      setCartData([]);
      localStorage.removeItem("billingAddress")
      localStorage.removeItem("shippingAddress")
      localStorage.removeItem("userId")
      // setInvoiceDetails(response);
      navigate("/invoice/" + orderDetails?.id);
      // Added by - Ashlekh on 11-12-2024
      // Reason - If payment is completed then to show message
      notificationObject.success("Your order placed successfully");
      // End of code - Ashlekh on 11-12-2024
      // Reason - If payment is completed then to show message

    } else {
      /**
       * Added by - Ashish Dewangan on 29-11-2024
       * Reason - To remove details from local storage after order is placed
       */
      localStorage.removeItem("cartData");
      setCartData([]);
      localStorage.removeItem("billingAddress")
      localStorage.removeItem("shippingAddress")
      localStorage.removeItem("userId")
      /**
       * End of addition by - Ashish Dewangan on 29-11-2024
       * Reason - To remove details from local storage after order is placed
       */
      setModalMessage("Payment is pending");
      setIsModalVisible(true);
      navigate("/orderdetail/" + orderDetails?.id);
    }
  }
  },[stripePaymentStatus])

 

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <div className={PaymentDetailStyles.paymentContainer}>
     
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "30vh",
          }}
        >
          <img style={{ height: "30vh" }} src="adyant_loader.gif" />
        </div>
      ):
      <div>
        <Modal
        title="Payment Status"
        visible={isModalVisible}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        okText="OK"
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <p className={`${PaymentDetailStyles.modalText}`}>{modalMessage}</p>
      </Modal>
      </div> }
    </div>
  );
};

export default PaymentProcessing;
