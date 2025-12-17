/**Code added by Unnati on 21-12-2024
 * Reason-To have exchange payment processing page
 */
import React, { useState, useEffect, useContext }  from 'react'
import { getStripeSessionStatusForExchangeAPI, postExchangeOrderUsingStripeAPI } from "../../Api/services";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import notificationObject from "../../components/Widgets/Notification/Notification";
import OrderDetailStyle from "./OrderDetail.module.css";
import { getImageFromLocalStorage } from "../../utils/ImageSetAndGetLocalStorage";
const ExchangePaymentProcessing = () => {
      
      const [stripePaymentStatus, setStriptePaymentStatus] = useState("");
      const [isModalVisible, setIsModalVisible] = useState(false);
      const [modalMessage, setModalMessage] = useState("");
      const [stripeCustomerEmail, setStripeCustomerEmail] = useState('');
      const [isLoading, setIsLoading] = useState(true);
      const [order, setOrder] = useState({});
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
            var itemId = JSON.parse(localStorage.getItem("itemId")) || null;
            var orderId = JSON.parse(localStorage.getItem("orderId")) || null;
            var OrderItemExchangeTime = JSON.parse(localStorage.getItem("OrderItemExchangeTime")) || null;
            var exchangeReason = JSON.parse(localStorage.getItem("exchangeReason")) || null;
            /**Code modified by Unnati on 19-01-2025
             * Reason-Added images
             */
            // var itemImage1 = (localStorage.getItem("itemImage1")) || null;
            var itemImage1 = getImageFromLocalStorage("itemImage1");
            // var itemImage2 = (localStorage.getItem("itemImage2")) || null;
            var itemImage2 = getImageFromLocalStorage("itemImage2");
            /**End of code modification by Unnati on 19-01-2025
             * Reason-Added images
             */
            var selectedColor = JSON.parse(localStorage.getItem("selectedColor")) || null;
            var selectedSize = JSON.parse(localStorage.getItem("size")) || null;
            var is_free_size=JSON.parse(localStorage.getItem("is_free_size"))
            if (is_free_size) {
              selectedSize = "free_size";
              }
            var quantity = JSON.parse(localStorage.getItem("quantity")) || 0;
            var requestType = JSON.parse(localStorage.getItem("requestType")) || null;
            var sale_percentage = JSON.parse(localStorage.getItem("sale_percentage")) || null;
            var after_customization_product_price = JSON.parse(localStorage.getItem("after_customization_product_price")) || 0.0;
            var customization_comment = JSON.parse(localStorage.getItem("customization_comment")) || "";
            var logo = JSON.parse(localStorage.getItem("logo")) || null;
            var patches = JSON.parse(localStorage.getItem("patches")) || null;
            var security_batches = JSON.parse(localStorage.getItem("security_batches")) || null;
            var embroider = JSON.parse(localStorage.getItem("embroider")) || null;
            // Added by - Ashlekh on 21-02-2025
            // Reason - To add customization
            var security_id_on_back = JSON.parse(localStorage.getItem("security_id_on_back")) || null;
            var printed_id = JSON.parse(localStorage.getItem("printed_id")) || null;
            // End of code - Ashlekh on 21-02-2025
            // Reason - To add customization
            var productName = JSON.parse(localStorage.getItem("productName")) || "";
            var salesRate = JSON.parse(localStorage.getItem("salesRate")) || 0.0;
            var logoPrice = JSON.parse(localStorage.getItem("logoPrice")) || 0.0;
            var patchesPrice = JSON.parse(localStorage.getItem("patchesPrice")) || 0.0;
            var securityBatchesPrice = JSON.parse(localStorage.getItem("securityBatchesPrice")) || 0.0;
            // Added by - Ashlekh on 21-02-2025
            // Reason - To add customization
            var securityIdOnBackPrice = JSON.parse(localStorage.getItem("securityIdOnBackPrice")) || 0.0;
            var printedIdPrice = JSON.parse(localStorage.getItem("printedIdPrice")) || 0.0;
            // End of code - Ashlekh on 21-02-2025
            // Reason - To add customization
            var embroiderPrice = JSON.parse(localStorage.getItem("embroiderPrice")) || 0.0;
            var toPay=JSON.parse(localStorage.getItem("extraAmount"));
            
            const response = await postExchangeOrderUsingStripeAPI(
              stripeSessionId,
              itemId,
              orderId,
              OrderItemExchangeTime,
              exchangeReason,
              itemImage1,
              itemImage2,
              selectedColor,
              selectedSize,
              quantity,
              requestType,
              sale_percentage,
              after_customization_product_price,
              customization_comment,
              logo,
              patches,
              security_batches,
              // Added by - Ashlekh on 21-02-2025
              // Reason - To add customization
              security_id_on_back,
              printed_id,
              // End of code - Ashlekh on 21-02-2025
              // Reason - To add customization
              embroider,
              productName,
              salesRate,
              logoPrice,
              patchesPrice,
              securityBatchesPrice,
              // Added by - Ashlekh on 21-02-2025
              // Reason - To add customization
              securityIdOnBackPrice,
              printedIdPrice,
              // End of code - Ashlekh on 21-02-2025
              // Reason - To add customization
              embroiderPrice,
              toPay
          
            );
            /**Code added by unnati on 02-01-2025
             * Reason-To set order summary for invoice
             */
            setOrder(response?.order)
            /**End of code addition by unnati on 02-01-2025
             * Reason-To set order summary for invoice
             */
            if(response?.success){
              const res = await getStripeSessionStatusForExchangeAPI(stripeSessionId)
              setStriptePaymentStatus(res.status);
              setStripeCustomerEmail(res.customer_email);
              setIsLoading(false)
            }
        
          }
          useEffect(()=>{
            if(stripePaymentStatus?.trim()?.length>0){
            if (stripePaymentStatus == "complete") {

              localStorage.removeItem("OrderItemExchangeTime");
              localStorage.removeItem("exchangeReason");
              localStorage.removeItem("itemImage1");
              localStorage.removeItem("itemImage2");
              localStorage.removeItem("selectedColor");
              localStorage.removeItem("selectedSize");
              localStorage.removeItem("quantity");
              localStorage.removeItem("requestType");
              localStorage.removeItem("sale_percentage");
              localStorage.removeItem("after_customization_product_price");
              localStorage.removeItem("customization_comment");
              localStorage.removeItem("logo");
              localStorage.removeItem("patches");
              localStorage.removeItem("security_batches");
              localStorage.removeItem("embroider");
              // Added by - Ashlekh on 21-02-2025
              // Reason - To remove customization details from localstorage
              localStorage.removeItem("security_id_on_back");
              localStorage.removeItem("printed_id");
              // End of code - Ashlekh on 21-02-2025
              // Reason - To remove customization details from localstorage
              localStorage.removeItem("productName");
              localStorage.removeItem("salesRate");
              localStorage.removeItem("logoPrice");
              localStorage.removeItem("patchesPrice");
              localStorage.removeItem("securityBatchesPrice");
              localStorage.removeItem("embroiderPrice");
              // Added by - Ashlekh on 21-02-2025
              // Reason - To remove customization details from localstorage
              localStorage.removeItem("securityIdOnBackPrice");
              localStorage.removeItem("printedIdPrice");
              // End of code - Ashlekh on 21-02-2025
              // Reason - To remove customization details from localstorage

              var orderId = JSON.parse(localStorage.getItem("orderId")) || null;
              
                
                if (orderId) {
                  /**Code added by Unnati on 02-01-2025
                 * Reason-To send data through state
                 */
                  navigate(`/orderdetail/${orderId}`,{ state: { order } });
                  /*End of code addition by Unnati on 02-01-2025
                 * Reason-To send data through state
                 */
                } else {
                  console.log("not available");
                }
              // Added by - Unnati on 21-11-2024
              // Reason - If payment is completed then to show message
              notificationObject.success("Your order placed successfully");
              // End of code - Unnati on 21-11-2024
              // Reason - If payment is completed then to show message
        
            } else {
              /**
               * Added by - Unnati on 21-11-2024
               * Reason - To remove details from local storage after order is placed
               */
              localStorage.removeItem("itemId");
              localStorage.removeItem("orderId");
              localStorage.removeItem("OrderItemExchangeTime");
              localStorage.removeItem("exchangeReason");
              localStorage.removeItem("itemImage1");
              localStorage.removeItem("itemImage2");
              localStorage.removeItem("selectedColor");
              localStorage.removeItem("selectedSize");
              localStorage.removeItem("quantity");
              localStorage.removeItem("requestType");
              localStorage.removeItem("sale_percentage");
              localStorage.removeItem("after_customization_product_price");
              localStorage.removeItem("customization_comment");
              localStorage.removeItem("logo");
              localStorage.removeItem("patches");
              localStorage.removeItem("security_batches");
              localStorage.removeItem("embroider");
              // Added by - Ashlekh on 21-02-2025
              // Reason - To remove customization details from localstorage
              localStorage.removeItem("security_id_on_back");
              localStorage.removeItem("printed_id");
              // End of code - Ashlekh on 21-02-2025
              // Reason - To remove customization details from localstorage
              localStorage.removeItem("productName");
              localStorage.removeItem("salesRate");
              localStorage.removeItem("logoPrice");
              localStorage.removeItem("patchesPrice");
              localStorage.removeItem("securityBatchesPrice");
              localStorage.removeItem("embroiderPrice");
              // Added by - Ashlekh on 21-02-2025
              // Reason - To remove customization details from localstorage
              localStorage.removeItem("securityIdOnBackPrice");
              localStorage.removeItem("printedIdPrice");
              // End of code - Ashlekh on 21-02-2025
              // Reason - To remove customization details from localstorage
              
              /**
               * End of addition by - Unnati on 21-11-2024
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
    <div>
      <div>
              <Modal
              title="Payment Status"
              visible={isModalVisible}
              onOk={handleModalClose}
              onCancel={handleModalClose}
              okText="OK"
              cancelButtonProps={{ style: { display: "none" } }}
            >
              <p className={`${OrderDetailStyle.modalText}`}>{modalMessage}</p>
            </Modal>
            </div>
    </div>
  )
}

export default ExchangePaymentProcessing
/**End of code addition by Unnati on 21-12-2024
 * Reason-To have exchange payment processing page
 */