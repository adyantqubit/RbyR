/**Code added by Unnati on 07-10-2024
 * Reason-Added payment detail page
 */

import React, { useState, useEffect, useContext } from "react";
import PaymentDetailStyles from "./PaymentDetail.module.css";
import { useLocation, useNavigate } from "react-router-dom";

import { useCallback } from "react";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import {
  postPayPalCaptureAPI,
  createPayPalOrderIdAPI,
} from "../../Api/services";
import config from "../../Api/config";
import { GlobalContext } from "../../context/Context";
import { Modal } from "antd";

import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { createStripeSessionIdAPI } from "../../Api/services";
import notificationObject from "../../components/Widgets/Notification/Notification";

const PaymentDetail = () => {
  /**
   * Added by - Ashish Dewangan on 27-11-2024
   * Reason - configuring stripe with public key
   */
  const stripePromise = loadStripe(
    "pk_test_51QM1ZMLLdYR5IHNiVTJBf1YuG5y8nLx4UM28ptBlLs3b21RlpdX7js0prwzWBuilq8nuCNlLQQuTzAs4qiD45HOz00tUMxu1As"
  );
  /**
   * End of addition by - Ashish Dewangan on 27-11-2024
   * Reason - configuring stripe with public key
   */
  const { cartData, setCartData } = useContext(GlobalContext);
  // Added by - Ashlekh on 19-10-2024
  // Reason - To have useState for loader and storing details for invoice and for antd modal
  const [isLoading, setIsLoading] = useState(true);
  const [invoiceDetails, setInvoiceDetails] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  // End of code - Ashlekh on 19-10-2024
  // Reason - To have useState for loader and storing details for invoice and for antd modal
  // Added by - Ashlekh on 16-10-2024
  // Reason - To save paypal_order_id and paypal access token
  const [paypalOrderId, setPayPalOrderId] = useState("");
  const [paypalAccessToken, setPayPalAccessToken] = useState("");
  // End of code - Ashlekh on 16-10-2024
  // Reason - To save paypal_order_id and paypal access
  // Added by - Ashlekh on 18-10-2024
  // Reason - To store billing & shipping address
  const [billingAddress, setBillingAddress] = useState({});
  const [shippingAddress, setShippingAddress] = useState({});
  // End of code - Ashlekh on 18-10-2024
  // Reason - To store billing & shipping address
  const location = useLocation();
  const navigate = useNavigate();
  // const { Order } = location.state;
  // const {Order} = location.state
  /**
   * Added by - Ashish Dewangan on 27-11-2024
   * Reason - variable to detrmine which payment gateway to use
   */
  // code changed by - Ashlekh on 22-02-2025
  // Reason - To add null condition
  // const { selectedPaymentGateway } = location.state;
  const Order = location.state?.Order || null;
  const selectedPaymentGateway = location.state?.selectedPaymentGateway || null;
  // End of code - Ashlekh on 22-02-2025
  // Reason - To add null condition
  /**
   * End of addition by - Ashish Dewangan on 27-11-2024
   * Reason - variable to detrmine which payment gateway to use
   */
  const orderSummary = Order ? Order.orderSummary : [];
  // Added by - Ashlekh on 17-10-2024
  // Reason - To store user id
  /**Code added by Unnati on 27-10-2024
   * Reason-Modified code
   */
  const userId = Order?.user;
  /**End of code addition by Unnati on 27-10-2024
   * Reason-Modified code
   */
  // End of code - Ashlekh on 17-10-2024
  // Reason - To store user id
  /**
   * Added by - Ashish Dewangan on 27-11-2024
   * Reason - If sripe is selected then load data from local storage
   */
  const [stripePaymentoptions, setStripePaymentOptions] = useState({});

  useEffect(()=>{
    if(selectedPaymentGateway=="stripe"){
      localStorage.setItem("billingAddress",JSON.stringify(Order?.billingAddress))
      localStorage.setItem("shippingAddress",JSON.stringify(Order?.shippingAddress))
      localStorage.setItem("userId",userId)
    }
    // Added by - Ashlekh on 22-02-2025
    // Reason - To store selected payment gateway in localstorage
    if (selectedPaymentGateway != null) {
      localStorage.setItem("lastPaymentGateway", selectedPaymentGateway);
    }
    // End of code - Ashlekh on 22-02-2025
    // Reason - To store selected payment gateway in localstorage
  },[selectedPaymentGateway])
  /**
   * End of addition by - Ashish Dewangan on 27-11-2024
   * Reason - If sripe is selected then load data from local storage
   */
  // Added by - Ashlekh on 22-02-2025
  // Reason - To get selected payment method/gateway from localstorage
  const lastUsedPaymentGateway = localStorage.getItem("lastPaymentGateway") || null;
  const paymentGateway = selectedPaymentGateway || lastUsedPaymentGateway;
  // End of code - Ashlekh on 22-02-2025
  // Reason - To get selected payment method/gateway from localstorage
  useEffect(() => {
    /**
     * Modified by - Ashish Dewangan on 27-11-2024
     * Reason - To determine which payment method to initialize
     */
    // //create paypal order api send user id => get user details cart details
    // const paypalOrderId = async () => {
    //   const response = await createPayPalOrderIdAPI(userId);
    //   setPayPalOrderId(response?.paypal_order_id);
    //   setPayPalAccessToken(response?.paypal_access_token);
    //   setIsLoading(false);
    // };
    // paypalOrderId();
    // setBillingAddress(Order?.billingAddress);
    // setShippingAddress(Order?.shippingAddress);


    if(selectedPaymentGateway=="stripe"){
    const fetchClientSecret = async () => {
      const res = await createStripeSessionIdAPI(userId);
      if(res.success){
        setStripePaymentOptions(res.data);
        setIsLoading(false);
      }else{
        navigate("/")
      }
    };

    fetchClientSecret();
  }else{
    const paypalOrderId = async () => {
      const response = await createPayPalOrderIdAPI(userId);
      setPayPalOrderId(response?.paypal_order_id);
      setPayPalAccessToken(response?.paypal_access_token);
      setIsLoading(false);
    };
    paypalOrderId();
    setBillingAddress(Order?.billingAddress);
    setShippingAddress(Order?.shippingAddress);
  }
  /**
     * End of modification by - Ashish Dewangan on 27-11-2024
     * Reason - To determine which payment method to initialize
     */
  }, []);
  // Added by - Ashlekh on 16-10-2024
  // Reason - To add paypal
  const initialOptions = {
    "client-id": config.PAYPAL_CLIENT_ID,
    "enable-funding": "venmo",
    "disable-funding": "",
    "buyer-country": "US",
    currency: "USD",
    "data-page-type": "product-details",
    components: "buttons",
    "data-sdk-integration-source": "developer-studio",
  };
  // End of code - Ashlekh on 16-10-2024
  // Reason - To add paypal
  // Added by - Ashlekh on 16-10-2024
  // Reason - To set paypal_order_id and paypal_access_token
  // useEffect(() => {
  //   if (Order?.orderSummary) {
  //     setPayPalOrderId(Order?.orderSummary?.paypal_order_id);
  //     setPayPalAccessToken(Order?.orderSummary?.paypal_access_token);
  //   }
  // }, [Order]);
  // End of code - Ashlekh on 16-10-2024
  // Reason - To set paypal_order_id and paypal_access_token
  /**Code added by Unnati on 07-10-2024
   * Reason-To handle payment
   */
  /* Modified by jhamman on 23-10-2024
  Reason - Changed path because we are calling api in invoice page*/
  // const handlePayment = () => {
  //   navigate("/invoice", { state: { Order } });
  // };
  /* Commented by jhamman on 24-10-2024
  Reason - no need*/
  // const handlePayment = () => {
  //   navigate(`/invoice/${orderSummary.id}`, { state: { Order } });
  // };
  /* End of comme by jhamman on 24-10-2024
  Reason - no need*/
  /* End of modification by jhamman on 23-10-2024
  Reason - Changed path because we are calling api in invoice page*/

  /**End of code addition by Unnati on 07-10-2024
   * Reason-To handle payment
   */
  // Added by - Ashlekh on 19-10-2024
  // Reason - To handle antd modal close/open
  const handleModalClose = () => {
    setIsModalVisible(false);
  };
  // End of code - Ashlekh on 19-10-2024
  // Reason - To handle antd modal close/open
  return (
    <div className={PaymentDetailStyles.paymentContainer}>
      {/* Code commented by - Ashlekh on 16-10-2024
      Reason - No need to display QR  */}
      {/* <div className={PaymentDetailStyles.paymentSection}>
        <div className={PaymentDetailStyles.paymentScanner}>
          <p className={PaymentDetailStyles.instructionText}>
            Please scan the QR code using your preferred payment app:
          </p>
          <img
            src="./QRcode (2).png"
            alt="QR code for Payment"
            className={PaymentDetailStyles.scannerImage}
          />
        </div>

        <div className={PaymentDetailStyles.bankDetails}>
          <h3 className={PaymentDetailStyles.paymentMethodTitle}>Paypal</h3>
          <p>
            <strong>Bank Name:</strong> HDFC Bank
          </p>
          <p>
            <strong>Account Name:</strong> John Smith
          </p>
          <p>
            <strong>Account Number:</strong> 061120084
          </p>
          <p>
            <strong>IFSC Code:</strong> HDFC0000004
          </p>
        </div>
      </div>

      <div className={PaymentDetailStyles.buttonContainer}>
        <button
          className={PaymentDetailStyles.paymentButton}
          onClick={handlePayment}
        >
          Proceed to Invoice
        </button>
      </div> */}
      {/* End of comment - Ashlekh on 16-10-2024
      Reason - No need to display QR */}
      {/* Added by - Ashlekh on 16-10-2024
      Reason - To display paypal buttons */}
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
          {/* Added by - Ashish Dewangan on 27-11-2024
          * Reason - TO show stripe's payment UI */}
        </div>
      // Code changed by - Ashlekh on 22-02-2025
      // Reason - To change condition (checked from localstorage)
      // ) : selectedPaymentGateway == "stripe" ? (
      ) : paymentGateway == "stripe" ? (
      // End of code - Ashlekh on 22-02-2025
      // Reason - To change condition (checked from localstorage)
        <div id="checkout">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={stripePaymentoptions}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
        /**
         * End of addition by - Ashish Dewangan on 27-11-2024
         * Reason - TO show stripe's payment UI 
         */
      ) : (
        <PayPalScriptProvider options={initialOptions}>
          <PayPalButtons
            style={{
              shape: "rect",
              layout: "vertical",
              color: "silver",
              label: "paypal",
            }}
            createOrder={() => {
              return paypalOrderId;
            }}
            onApprove={async (data, actions) => {
              try {
                /**Code added by Unnati on 08-11-2024
                 *Reason-Added order time */
                const localOrderTime = new Date().toLocaleString(undefined, {
                  timeZone: "Asia/Kolkata",
                });
                /**End of code addition by Unnati on 08-11-2024
                 *Reason-Added order time */
                const response = await postPayPalCaptureAPI(
                  paypalOrderId,
                  paypalAccessToken,
                  userId,
                  billingAddress,
                  shippingAddress,
                  /**Code added by Unnati on 08-11-2024
                   *Reason-Added order time */
                  localOrderTime
                  /**Code added by Unnati on 08-11-2024
                   *Reason-Added order time */
                );
                if (response?.payment_status == "Completed") {
                  localStorage.removeItem("cartData");
                  setCartData([]);
                  setInvoiceDetails(response);
                  // Added by - Ashlekh on 11-12-2024
                  // Reason - If payment is completed then to show message
                  notificationObject.success("Your order placed successfully");
                  // End of code - Ashlekh on 11-12-2024
                  // Reason - If payment is completed then to show message
                  /* Modified by jhamman on 24-10-2024
                  Reason - Changed path because we are calling api in invoice page*/
                  // navigate("/invoice", {
                  //   state: { Order: response },
                  // });
                  navigate("/invoice/" + response?.orderSummary?.id);
                  /* End of modification by jhamman on 24-10-2024
                  Reason - Changed path because we are calling api in invoice page*/
                } else if (response?.payment_status == "Pending") {
                  setModalMessage("Payment is pending");
                  setIsModalVisible(true);
                  navigate("/orderdetail/" + response?.orderSummary?.id);
                } else {
                  setModalMessage("Payment is not completed");
                  setIsModalVisible(true);
                }
              } catch (error) {
                console.error("Error during capture:", error);
              }
            }}
          />
        </PayPalScriptProvider>
      )}
      {/* End of code - Ashlekh on 16-10-2024
      Reason - To display paypal buttons */}
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
    </div>
  );
};

export default PaymentDetail;
/**End of code by Unnati on 07-10-2024
 * Reason-Added payment detail page
 */
