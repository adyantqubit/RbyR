/**Code added by Unnati on 03-08-2024
 * Reason-To have order detail page
 */

import React, { useEffect, useState, useContext } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import {
  addTrackingDetailsForItem,
  checkProductAvailability,
  getOrderDetail,
  performItemReturn,
  performItemExchange,
  performItemCancellation,
  UpdateCancellationTime,
  addExchangeTrackingDetailsForItem,
  getProductSizeAndColor,
  getExchangeAndReturnItem,
  createPayPalExchangeItemAPI,
  postPayPalCaptureExchangeAPI,
  CreateStripeSessionIdForExchangeAPI,
} from "../../Api/services";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import config from "../../Api/config";
import OrderDetailStyle from "./OrderDetail.module.css";
import { GlobalContext } from "../../context/Context";
import { DateFormatter } from "../../utils/DateFormat";
import { useNavigate } from "react-router-dom";
import Constants from "../../constants/Constants";
import notificationObject from "../../components/Widgets/Notification/Notification";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { saveImageToLocalStorage } from "../../utils/ImageSetAndGetLocalStorage";
const OrderDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const { order } = location.state || {};
  const [orderDetail, setOrderDetail] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [Order, setOrder] = useState([]);
  const { user } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [itemToCancel, setItemToCancel] = useState(null);
  // Added by - Ashlekh on 21-11-2024
  // Reason - useState for loader
  const [isLoading, setIsLoading] = useState(true);
  // End of code - Ashlekh on 21-11-2024
  // Reason - useState for loader
  /**Code added by Unnati Bajaj on 03-08-2024
   * Reason -To get order details and user address when the component loads
   */

  /**
   * Added by - Ashish Dewangan on 23-11-2024
   * Reason - To store setting details
   */
  const [settings, setSettings] = useState({});
  /**
   * End of addition by - Ashish Dewangan on 23-11-2024
   * Reason - To store setting details
   */

  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedReturnReason, setSelectedReturnReason] = useState("");
  const [otherReturnReason, setOtherReturnReason] = useState("");
  const [itemToReturn, setItemToReturn] = useState(null);

  const [itemImage1, setItemImage1] = useState();
  const [itemImage2, setItemImage2] = useState();

  const [showContactPopupAfterReturn, setShowContactPopupAfterReturn] =
    useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  /**
   * Added by - Ashish Dewangan on 25-11-2024
   * Reason - defined varibles for storing tracking details
   */
  const [returnTrackingId, setReturnTrackingId] = useState("");
  const [returnTrackingIdError, setReturnTrackingIdError] = useState("");

  const [returnCourierProviderName, setReturnCourierProviderName] =
    useState("");
  const [returnCourierProviderNameError, setReturnCourierProviderNameError] =
    useState("");
  /**
   * End of addition by - Ashish Dewangan on 25-11-2024
   * Reason - defined varibles for storing tracking details
   */
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [selectedExchangeReason, setSelectedExchangeReason] = useState("");
  const [otherExchangeReason, setOtherExchangeReason] = useState("");
  const [itemToExchange, setItemToExchange] = useState(null);
  const [showContactPopupAfterExchange, setShowContactPopupAfterExchange] =
    useState(false);
  const [exchangeTrackingId, setExchangeTrackingId] = useState("");
  const [exchangeTrackingIdError, setExchangeTrackingIdError] = useState("");

  const [exchangeCourierProviderName, setExchangeCourierProviderName] =
    useState("");
  const [
    exchangeCourierProviderNameError,
    setExchangeCourierProviderNameError,
  ] = useState("");
  const [availableSizes, setAvailableSizes] = useState({});
  const [selectedColor, setSelectedColor] = useState("");
  const [products, setProducts] = useState([]);
  const [validationMessage, setValidationMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isInitialStored, setIsInitialStored] = useState(false);
  const [formData, setFormData] = useState({
    logo: false,
    patches: false,
    security_batches: false,
    // Added by - Ashlekh on 20-02-2025
    // Reason - To add customization
    security_id_on_back: false,
    printed_id: false,
    // End of code - Ashlekh on 20-02-2025
    // Reason - To add customization
    embroider: false,
    customization_comment: "",
    logo_price: "",
    patches_price: "",
    security_batches_price: "",
    // Added by - Ashlekh on 20-02-2025
    // Reason - To add customization
    security_id_on_back_price: "",
    printed_id_price: "",
    // End of code - Ashlekh on 20-02-2025
    // Reason - To add customization
    embroider_price: "",
    after_customization_product_price: "",
  });
  const [soldItems, setSoldItems] = useState([]);
  const [exchangedItems, setExchangedItems] = useState([]);
  const [returnedItems, setReturnedItems] = useState([]);
  const [cancelledItems, setCancelledItems] = useState([]);
  /**Code modified by unnati on 02-01-2025
   * Reason-Added default value as free_size
   */
  // const [selectedSize, setSelectedSize] = useState(null);
  const [selectedSize, setSelectedSize] = useState("free_size");
  /**End of code modification by unnati on 02-01-2025
   * Reason-Added default value as free_size
   */
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [paypalOrderId, setPayPalOrderId] = useState("");
  const [paypalAccessToken, setPayPalAccessToken] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [itemId, setItemId] = useState(null);
  // const [selectedPaymentGateway, setSelectedPaymentGateway] =
  //   useState("paypal");
  const [selectedPaymentGateway, setSelectedPaymentGateway] =
    useState("stripe");
  const [stripePaymentoptions, setStripePaymentOptions] = useState({});
  const [sizeErrorMessage, setSizeErrorMessage] = useState("");
  const [exchangeReasonError, setExchangeReasonError] = useState("");
  const [returnReasonError, setReturnReasonError] = useState("");
  const [cancelReasonError, setCancelReasonError] = useState("");
  /**Code added by Unnati on 22-12-2024
   * Reason-To initialize extra amount
   */
  let extraAmount = 0;
  /**End of code addition by Unnati on 22-12-2024
   * Reason-To initialize extra amount
   */
  /**Code added by Unnati on 22-12-2024
   * Reason-To initialize options
   */
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
  const initialFormData = {
    logo: false,
    patches: false,
    security_batches: false,
    // Added by - Ashlekh on 20-02-2025
    // Reason - To add customization
    security_id_on_back: false,
    printed_id: false,
    // End of code - Ashlekh on 20-02-2025
    // Reason - To add customization
    embroider: false,
    customization_comment: "",
  };
  /*End of code addition by Unnati on 22-12-2024
   * Reason-To initialize options
   */
  /**Code added by Unnati on 22-12-2024
   * Reason-Addded handle change
   */
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (type === "checkbox" && checked) {
      setValidationMessage("");
    }
  };
  /**End of code addition by Unnati on 22-12-2024
   * Reason-Addded handle change
   */
  /**Code added by Unnati on 22-12-2024
   * Reason-To calculate grandtotal of exchangd item
   */
  const calculateExchangedItemGrandTotal = (quantity, originalAmount) => {
    const {
      logo,
      patches,
      security_batches,
      // Added by - Ashlekh on 20-02-2025
      // Reason - To add customization
      security_id_on_back,
      printed_id,
      // End of code - Ashlekh on 20-02-2025
      // Reason - To add customization
      embroider,
      customization_comment,
    } = formData;
    const selectedProduct = products.filter((i) => i.color == selectedColor);
    let basePrice = parseFloat(selectedProduct[0]?.sales_rate) || 0;

    if (selectedProduct[0]?.sale_percentage) {
      basePrice =
        selectedProduct[0]?.sales_rate -
        (selectedProduct[0]?.sales_rate * selectedProduct[0]?.sale_percentage) /
          100;
    }
    if (logo) {
      basePrice += parseFloat(selectedProduct[0]?.logo_price);
    }

    if (patches) {
      basePrice += parseFloat(selectedProduct[0]?.patches_price);
    }

    if (security_batches) {
      basePrice += parseFloat(selectedProduct[0]?.security_batches_price);
    }
    // Added by - Ashlekh on 20-02-2025
    // Reason - To add customization
    if (security_id_on_back) {
      basePrice += parseFloat(selectedProduct[0]?.security_id_on_back_price);
    }
    if (printed_id) {
      basePrice += parseFloat(selectedProduct[0]?.printed_id_price);
    }
    // End of code - Ashlekh on 20-02-2025
    // Reason - To add customization

    if (embroider) {
      basePrice += parseFloat(selectedProduct[0]?.embroider_price);
    }

    let customizationPrice = basePrice;
    const total_amount = quantity * customizationPrice;
    const grand_total =
      total_amount + (Constants.sales_tax / 100) * total_amount;
    extraAmount =
      grand_total > originalAmount ? grand_total - originalAmount : 0;
    localStorage.setItem("extraAmount", JSON.stringify(extraAmount));
    extraAmount = Math.round((extraAmount + Number.EPSILON) * 100) / 100;

    // return { grand_total, extraAmount };
    return {
      grand_total: parseFloat(grand_total.toFixed(2)),
      extraAmount: parseFloat(extraAmount.toFixed(2)),
    };
  };
  /**End of code addition by Unnati on 22-12-2024
   * Reason-To calculate grandtotal of exchangd item
   */
  /**
   * Modified by - Ashish Dewangan on 24-11-2024
   * Reason - To make fetchOrderDetail available outside useEffect for reusability
   */
  // useEffect(() => {
  //   const fetchOrderDetail = async () => {
  //     try {
  //       const response = await getOrderDetail(id, user.id);
  //       setOrderDetail(response.orderItems);
  //       /**Code added by Unnati on 18-09-2024
  //        * Reason-To set order status
  //        */
  //       setOrderStatus(response.orderSummary);
  //       /**End of code addition by Unnati on 18-09-2024
  //        * Reason-To set order status
  //        */
  //       setOrder(response);
  //       // Added by - Ashlekh on 21-11-2024
  //       // Reason - To set loader false
  //       setIsLoading(false);
  //       // End of code - Ashlekh on 21-11-2024
  //       // Reason - To set loader false

  //       /**
  //        * Added by - Ashish Dewangan on 23-11-2024
  //        * Reason - To store setting details
  //        */
  //       setSettings(response?.settings)
  //       /**
  //        * End of addition by - Ashish Dewangan on 23-11-2024
  //        * Reason - To store setting details
  //        */
  //     } catch (error) {
  //       console.error("Failed to fetch order details:", error);
  //     }
  //   };
  //   fetchOrderDetail();
  // }, [id, user.id]);

  /**
   * Added by - Ashish Dewangan on 18-12-2024
   * Reason - If a product id is set in this variable then show product not available message for that product
   */
  const [unavailableProduct, setUnavailableProduct] = useState({
    productId: "",
    color: "",
  });
  /**
   * End of addition by - Ashish Dewangan on 18-12-2024
   * Reason - If a product id is set in this variable then show product not available message for that product
   */

  /**
   * Added by - Ashish Dewangan on 18-12-2024
   * Reason - Method to check if a product is available or not
   */
  const handleCheckProductAvailability = async (product_id, color, product) => {
    const response = await checkProductAvailability(product_id, color);
    if (response?.is_product_available == false) {
      setUnavailableProduct((prevState) => ({
        ...prevState,
        productId: product_id,
        color: color,
      }));
    } else {
      setUnavailableProduct((prevState) => ({
        ...prevState,
        productId: "",
        color: "",
      }));
      navigate(`/productdetail/${product_id ? product_id : product}`, {
        state: color,
      });
    }
  };
  /**
   * End of addition by - Ashish Dewangan on 18-12-2024
   * Reason - Method to check if a product is available or not
   */

  useEffect(() => {
    fetchOrderDetail();
  }, [id, user.id]);
  /**Code modified by Unnati on 22-12-2024
   * Reason-Added parameters in fetchorder details
   */
  const fetchOrderDetail = async (ItemId, orderId, requestType) => {
    try {
      const response = await getOrderDetail(id, user.id, requestType);
      /*End of code modification by Unnati on 22-12-2024
       * Reason-Added parameters in fetchorder details
       */
      setOrderDetail(response.orderItems);
      /**Code modified by Unnati on 22-12-2024
       * Reason-To initialise variable with respective items
       */
      const orderItems = response.orderItems;
      const sold = orderItems.filter((item) => item.type === "Sold");
      const exchanged = orderItems.filter((item) => item.type === "Exchanged");
      const returned = orderItems.filter((item) => item.type === "Returned");
      const cancelled = orderItems.filter((item) => item.type === "Cancelled");
      setSoldItems(sold);
      setExchangedItems(exchanged);
      setReturnedItems(returned);
      setCancelledItems(cancelled);
      /**End of code modification by Unnati on 22-12-2024
       * Reason-To initialise variable with respective items
       */
      /**Code added by Unnati on 18-09-2024
       * Reason-To set order status
       */
      setOrderStatus(response.orderSummary);
      /**End of code addition by Unnati on 18-09-2024
       * Reason-To set order status
       */
      setOrder(response);
      // Added by - Ashlekh on 21-11-2024
      // Reason - To set loader false
      setIsLoading(false);
      // End of code - Ashlekh on 21-11-2024
      // Reason - To set loader false

      /**
       * Added by - Ashish Dewangan on 23-11-2024
       * Reason - To store setting details
       */
      setSettings(response?.settings);
      /**
       * End of addition by - Ashish Dewangan on 23-11-2024
       * Reason - To store setting details
       */
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  /**
   * End of modification by - Ashish Dewangan on 24-11-2024
   * Reason - To make fetchOrderDetail available outside useEffect for reusability
   */
  /**Code added by Unnati on 29-12-2024
   * Reason-To select size by default
   */
  useEffect(() => {
    /**Code modified by Unnati on 30-12-2024
     * Reason-Added sizes XS and S
     */
    const firstAvailableSize = ["M", "L", "XL", "XXL", "XXXL", "S", "XS"].find(
      (size) => isSizeAvailable(size)
    );
    /**End of code addition by Unnati on 30-12-2024
     * Reason-Added sizes XS and S
     */
    if (firstAvailableSize) {
      setSelectedSize(firstAvailableSize);
      // Code modified by Unnati on 13-01-2025
      localStorage.setItem("size", JSON.stringify(firstAvailableSize));
      //End of code modification by Unnati on 13-01-2025
    }
  }, [availableSizes]);
  /**End of code addition by Unnati on 29-12-2024
   * Reason-To select size by default
   */
  /**Code added by Unnati Bajaj on 03-08-2024
   * Reason -To get order details and user address when the component loads
   */
  /**Code modified by Unnati on 20-12-2024
   * Reason-Added type in state
   */
  const handleViewInvoice = (Order) => {
    navigate(`/invoice/${Order.id}`, { state: { Order, type: "Sold" } });
  };
  /**End of code modification by Unnati on 20-12-2024
   * Reason-Added type in state
   */
  /**Code added by Unnati on 08-11-2024
   * Reason-Added handle Credit note
   */
  /**Code modified by Unnati on 27-12-2024
   * Reason-Added item instead of order
   */
  const handleCreditNote = (item) => {
    navigate(`/creditnote/${item.id}`, { state: { item } });
  };
  /**End of code modification by Unnati on 27-12-2024
   * Reason-Added item instead of order
   */
  /**End of code addition by Unnati on 08-11-2024
   * Reason-Added handle Credit note
   */
  /**Code added by Unnati on 22-12-2024
   * Reason-To handle exchange invoices
   */
  const handleExchangeInvoice = (item) => {
    navigate(`/exchange_invoice/${item.id}`, {
      state: { item, type: "Exchange" },
    });
  };
  /*End of code addition by Unnati on 22-12-2024
   * Reason-To handle exchange invoices
   */
  const total = orderDetail
    .reduce((accumulator, item) => {
      return accumulator + item.amount * item.quantity;
    }, 0)
    .toFixed(2);
  /**Code added by Unnati on 06-11-2024
   * Reason-To handle cancel button
   */
  {
    /**Code modified by Unnati on 26-12-2024
     *Reason-Added item in handlecancelbutton parameter */
  }
  const handleCancelButton = async (e, ItemId, order, item) => {
    e.preventDefault();
    {
      /**End of code modification by Unnati on 26-12-2024
       *Reason-Added item in handlecancelbutton parameter */
    }
    const cancellationReason =
      selectedReason === "Other" && otherReason ? otherReason : selectedReason;

    const OrderItemCancellationTime = new Date().toLocaleString(undefined, {
      timeZone: "Asia/Kolkata",
    });
    if (cancellationReason) {
      /**Code added by Unnati on 24-11-2024
       * Reason-Assigned variable
       */
      /**Code commented by Unnati on 26-12-2024
       * Reason-This code is not in use
       */
      // const response = await UpdateCancellationTime(
      //   /*End of code addition by Unnati on 24-11-2024
      //    * Reason-Assigned variable
      //    */
      //   ItemId,
      //   order,
      //   OrderItemCancellationTime,
      //   cancellationReason
      // );
      /**End of code comment by Unnati on 26-12-2024
       * Reason-This code is not in use
       */
      /**Code added by Unnati on 27-12-2024
       * Reason-To send cancelled product details
       */
      const size = item.size;
      const quantity = item.quantity;
      const color = item.color;
      const amount = item.amount;
      const product_id = item.product_id;
      const sales_rate = item.sales_rate;
      const subtotal = item.subtotal;
      const total_amount = item.total_amount;
      const sale_percentage = item.sale_percentage;
      const requestType = "Cancelled";
      /**End of code addition by Unnati on 27-12-2024
       * Reason-To send cancelled product details
       */
      /**Code added by Unnati on 26-12-2024
       * Reason-To perform cancellation
       */
      const response = await performItemCancellation(
        ItemId,
        order,
        OrderItemCancellationTime,
        cancellationReason,
        /**Code added by Unnati on 27-12-2024
         * Reason-To send cancelled product details
         */
        size,
        quantity,
        color,
        amount,
        product_id,
        sales_rate,
        subtotal,
        total_amount,
        sale_percentage
        /**End of code addition by Unnati on 27-12-2024
         * Reason-To send cancelled product details
         */
      );
      /**End of code addition by Unnati on 26-12-2024
       * Reason-To perform cancellation
       */
      /**Code added by Unnati on 23-11-2024
       * Reason-To get order details after updating cancellation reason
       */
      if (response.success) {
        /**Code commented by Unnati on 27-12-2024
         * Reason-This code is not in use
         */
        // const response = await getOrderDetail(id, user.id);
        // setOrderDetail(response.orderItems);
        // setOrderStatus(response.orderSummary);
        // setOrder(response);
        // setIsLoading(false);
        /**End of code comment by Unnati on 27-12-2024
         * Reason-This code is not in use
         */
        fetchOrderDetail(ItemId, orderId);
      }
      /*End of code addition by Unnati on 23-11-2024
       * Reason-To get order details after updating cancellation reason
       */
      setShowCancelModal(false);
      setSelectedReason("");
      setOtherReason("");
    } else {
      /**Code modified by Unnati on 02-01-2025
       * Reason-Added cancellation reason error
       */
      // alert("Please select a cancellation reason.");
      setCancelReasonError("Please select a cancellation reason.");
      /**End of code modification by Unnati on 02-01-2025
       * Reason-Added cancellation reason error
       */
    }
  };
  /**End of code addition by Unnati on 06-11-2024
   * Reason-To handle cancel button
   */
  /**Code added by Unnati on 11-11-2024
   * Reason-Added handleCancelModal
   */
  const handleCancelModal = (itemId) => {
    setItemToCancel(itemId);
    setShowCancelModal(true);
    // Added by - Ashlekh on 11-03-2025
    // Reason - To empty cancel error message
    setCancelReasonError("");
    // End of code - Ashlekh on 11-03-2025
    // Reason - To empty cancel error message
  };
  /**End of code addition by Unnati on 11-11-2024
   * Reason-Added handleCancelModal
   */

  /** Added by Ashish Dewangan on 24-11-2024
   * Reason- To call return API once return button of modal is clicked
   */
  /**Code modified by Unnati on 27-12-2024
   * Reason-Added item
   */
  const handleReturnButton = async (e, ItemId, orderId, item) => {
    /**End of code modification by Unnati on 27-12-2024
     * Reason-Added item
     */
    e.preventDefault();

    const returnReason =
      selectedReturnReason === "Other" && otherReturnReason
        ? otherReturnReason
        : selectedReturnReason;

    const OrderItemReturnTime = new Date().toLocaleString(undefined, {
      timeZone: "Asia/Kolkata",
    });
    /**Code added by Unnati on 27-12-2024
     * Reason-To send returned product details
     */
    const size = item.size;
    const quantity = item.quantity;
    const color = item.color;
    const amount = item.amount;
    const product_id = item.product_id;
    const sales_rate = item.sales_rate;
    const subtotal = item.subtotal;
    const total_amount = item.total_amount;
    const sale_percentage = item.sale_percentage;
    /**End of code addition by Unnati on 27-12-2024
     * Reason-To send returned product details
     */
    if (returnReason) {
      const response = await performItemReturn(
        ItemId,
        orderId,
        OrderItemReturnTime,
        returnReason,
        itemImage1,
        itemImage2,
        /**Code added by Unnati on 27-12-2024
         * Reason-To send returned product details
         */
        size,
        quantity,
        color,
        amount,
        product_id,
        sales_rate,
        subtotal,
        total_amount,
        sale_percentage
        /**End of code addition by Unnati on 27-12-2024
         * Reason-To send returned product details
         */
      );

      setShowReturnModal(false);
      setSelectedReturnReason("");
      setOtherReturnReason("");
      setShowContactPopupAfterReturn(true);
      setIsLoading(true);
      /**Code modified by Unnati on 27-12-2024
       * Reason-Added parameters in fetchOrderDetails
       */
      // fetchOrderDetail();
      fetchOrderDetail(ItemId, orderId);
      /*End of code modification by Unnati on 27-12-2024
       * Reason-Added parameters in fetchOrderDetails
       */
    } else {
      /**Code added by Unnati on 27-12-2024
       * Reason-Added validation message
       */
      setReturnReasonError("Please select a return reason.");
      /**End of code addition by Unnati on 27-12-2024
       * Reason-Added validation message
       */
    }
  };
  /**End of code addition by Ashish Dewangan on 24-11-2024
   * Reason- To call return API once return button of modal is clicked
   */

  /**
   * Added by - Ashish Dewangan on 23-11-2024
   * Reason - To show return modal
   */
  const handleReturnModal = (itemId) => {
    setItemToReturn(itemId);
    setShowReturnModal(true);
  };
  /**
   * End of addition by - Ashish Dewangan on 23-11-2024
   * Reason - To show return modal
   */
  /**Code added by Unnati on 20-12-2024
   * Reason-To check is size is available or not
   */
  const isSizeAvailable = (size) => {
    return availableSizes[size] > 0;
  };
  /**End of code addition  by Unnati on 20-12-2024
   * Reason-To check is size is available or not
   */
  /** Added by Unnati on 20-12-2024
   * Reason- To call return API once exchange button of modal is clicked
   */
  const handleExchangeButton = async (
    e,
    ItemId,
    orderId,
    selectedColor,
    quantity,
    item
  ) => {
    e.preventDefault();

    localStorage.setItem("itemId", JSON.stringify(ItemId));
    localStorage.setItem("orderId", JSON.stringify(orderId));
    localStorage.setItem("item", JSON.stringify(item));
    const exchangeReason =
      selectedExchangeReason === "Other" && otherExchangeReason
        ? otherExchangeReason
        : selectedExchangeReason;
    const OrderItemExchangeTime = new Date().toLocaleString(undefined, {
      timeZone: "Asia/Kolkata",
    });

    const {
      logo,
      patches,
      security_batches,
      // Added by - Ashlekh on 20-02-2025
      // Reason - To add customization
      security_id_on_back,
      printed_id,
      // End of code - Ashlekh on 20-02-2025
      // Reason - To add customization
      embroider,
      customization_comment,
    } = formData;
    const selectedProduct = products.filter((i) => i.color == selectedColor);
    let basePrice = parseFloat(selectedProduct[0]?.sales_rate) || 0;

    if (selectedProduct[0]?.sale_percentage) {
      basePrice =
        selectedProduct[0]?.sales_rate -
        (selectedProduct[0]?.sales_rate * selectedProduct[0]?.sale_percentage) /
          100;
    }
    if (logo) {
      basePrice += parseFloat(selectedProduct[0]?.logo_price);
    }

    if (patches) {
      basePrice += parseFloat(selectedProduct[0]?.patches_price);
    }

    if (security_batches) {
      basePrice += parseFloat(selectedProduct[0]?.security_batches_price);
    }
    // Added by - Ashlekh on 20-02-2025
    // Reason - To add customization
    if (security_id_on_back) {
      basePrice += parseFloat(selectedProduct[0]?.security_id_on_back_price);
    }
    if (printed_id) {
      basePrice += parseFloat(selectedProduct[0]?.printed_id_price);
    }
    // End of code - Ashlekh on 20-02-2025
    // Reason - To add customization

    if (embroider) {
      basePrice += parseFloat(selectedProduct[0]?.embroider_price);
    }

    let customizationPrice = basePrice;
    const formattedCustomizationPrice = isNaN(customizationPrice)
      ? "0.00"
      : customizationPrice.toFixed(2);
    setFormData((prevState) => ({
      ...prevState,
      after_customization_product_price: formattedCustomizationPrice,
      customization_comment,
      logo,
      patches,
      security_batches,
      // Added by - Ashlekh on 20-02-2025
      // Reason - To add customization
      security_id_on_back,
      printed_id,
      // End of code - Ashlekh on 20-02-2025
      // Reason - To add customization
      embroider,
      logo_price: parseFloat(selectedProduct[0]?.logo_price) || "0.00",
      patches_price: parseFloat(selectedProduct[0]?.patches_price) || "0.00",
      security_batches_price:
        parseFloat(selectedProduct[0]?.security_batches_price) || "0.00",
      embroider_price:
        parseFloat(selectedProduct[0]?.embroider_price) || "0.00",
      // Added by - Ashlekh on 20-02-2025
      // Reason - To add customization
      security_id_on_back_price:
        parseFloat(selectedProduct[0]?.security_id_on_back_price) || "0.00",
      printed_id_price:
        parseFloat(selectedProduct[0]?.printed_id_price) || "0.00",
      // End of code - Ashlekh on 20-02-2025
      // Reason - To add customization
    }));
    const requestType = "Exchanged";
    const product_id = selectedProduct[0]?.product_id;
    const logoPrice = selectedProduct[0]?.logo_price;
    const patchesPrice = selectedProduct[0]?.patches_price;
    const securityBatchesPrice = selectedProduct[0]?.security_batches_price;
    // Added by - Ashlekh on 20-02-2025
    // Reason - To add customization
    const securityIdOnBackPrice = selectedProduct[0]?.security_id_on_back_price;
    const printedIdPrice = selectedProduct[0]?.printed_id_price;
    // End of code - Ashlekh on 20-02-2025
    // Reason - To add customization
    const embroiderPrice = selectedProduct[0]?.embroider_price;
    const image1 = selectedProduct[0]?.image1;
    const sale_percentage = selectedProduct[0]?.sale_percentage;
    /**Code added by Unnati on 02-01-2025
     * Reason-Added free size and its condition
     */
    const free_size = selectedProduct[0]?.is_free_size;
    if (free_size) {
      setSelectedSize("free_size");
    }
    /**End of code addition by Unnati on 02-01-2025
     * Reason-Added free size and its condition
     */
    const salesRate = selectedProduct[0]?.sales_rate;
    /**Code modified by Unnati on 02-01-2025
     * Reason-Modified condition
     */
    // if (!selectedSize) {
    if (!selectedSize && !free_size) {
      setSizeErrorMessage("Please select at least one size before submitting.");
      return;
    }
    /*End of code modification by Unnati on 02-01-2025
     * Reason-Modified condition
     */

    if (exchangeReason) {
      if (extraAmount > 0) {
        if (selectedPaymentGateway == "stripe") {
          const fetchClientSecret = async () => {
            const res = await CreateStripeSessionIdForExchangeAPI(
              user.id,
              extraAmount
            );
            if (res.success) {
              setStripePaymentOptions(res.data);

              setIsLoading(false);
            } else {
              navigate("/");
            }
          };

          fetchClientSecret();
        } else {
          const paypalExchangeItem = async () => {
            const response = await createPayPalExchangeItemAPI(extraAmount);
            setPayPalOrderId(response?.paypal_order_id);
            setPayPalAccessToken(response?.paypal_access_token);
            setItemId(ItemId);
            setOrderId(orderId);
            setIsLoading(false);
            setShowPaymentModal(true);
          };
          paypalExchangeItem();
        }
      } else {
        const response = await performItemExchange(
          ItemId,
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
          (formData.after_customization_product_price =
            formattedCustomizationPrice),
          formData.customization_comment,
          formData.logo,
          formData.patches,
          formData.security_batches,
          // Added by - Ashlekh on 20-02-2025
          // Reason - To add customization
          formData.security_id_on_back,
          formData.printed_id,
          // End of code - Ashlekh on 20-02-2025
          // Reason - To add customization
          formData.embroider,
          product_id,
          salesRate,
          logoPrice,
          patchesPrice,
          securityBatchesPrice,
          // Added by - Ashlekh on 20-02-2025
          // Reason - To add customization
          securityIdOnBackPrice,
          printedIdPrice,
          // End of code - Ashlekh on 20-02-2025
          // Reason - To add customization
          embroiderPrice,
          image1
        );
        setFormData(initialFormData);
        /**Code modified by Unnati on 02-01-2025
         * Reason-Added condition for free size
         */
        if (!selectedProduct.is_free_size) {
          setSelectedSize("");
        }
        /**End of code modification by Unnati on 02-01-2025
         * Reason-Added condition for free size
         */
      }
      setShowExchangeModal(false);
      setSelectedExchangeReason("");
      setOtherExchangeReason("");
      setShowContactPopupAfterExchange(true);
      setQuantity(1);
      setIsLoading(true);
      fetchOrderDetail(ItemId, orderId, requestType);
      await getExchangeAndReturnItem(ItemId, orderId);
      localStorage.removeItem("selectedSize");
    } else {
      /**Code added by Unnati on 27-12-2024
       * Reason-Added validation message
       */
      setExchangeReasonError("Please select a exchange reason.");
      /**End of code addition by Unnati on 27-12-2024
       * Reason-Added validation message
       */
    }
    setSelectedExchangeReason("");
    // Code changed by - Ashlekh on 07-02-2025
    // Reason - Default(first) color was selecting while exchanging product
    // setSelectedColor("")
    // End of code - Ashlekh on 07-02-2025
    // Reason - Default(first) color was selecting while exchanging product
  };
  /**End of code addition by Unnati on 20-12-2024
   * Reason- To call return API once exchange button of modal is clicked
   */
  /**
   * Added by - Unnati Bajaj on 29-11-2024
   * Reason - To show exchange modal
   */
  const handleExchangeModal = async (itemId) => {
    const response = await getProductSizeAndColor(itemId);
    setProducts(response.products);
    /**Code added by Unnati on 03-01-2025
     * Reason-Added code for unique color
     */
    const distintColor = [
      ...new Set(response.products.map((product) => product.color)),
    ];
    if (distintColor.length > 0) {
      setSelectedColor(distintColor[0]);
    }
    /**End of code addition by Unnati on 03-01-2025
     * Reason-Added code for unique color
     */
    if (response.products.length > 0) {
      const sizes = {
        XS: response.products[0].XS,
        S: response.products[0].S,
        M: response.products[0].M,
        L: response.products[0].L,
        XL: response.products[0].XL,
        XXL: response.products[0].XXL,
        XXXL: response.products[0].XXXL,
        free_size: response.products[0].free_size,
      };
      setAvailableSizes(sizes);
      setSelectedProduct(response.products[0]);
    }
    setItemToExchange(itemId);
    setShowExchangeModal(true);
  };
  {
    /**Code added by Unnati on 20-12-2024
     *Reason-Created a set of unique colors and maps ieach product to its color*/
  }
  const uniqueColors = [...new Set(products.map((product) => product.color))];
  {
    /**End of code addition by Unnati on 20-12-2024
     *Reason-Created a set of unique colors and maps ieach product to its color*/
  }
  /**
   * End of addition by - Unnati Bajaj on 29-11-2024
   * Reason - To show exchange modal
   */
  /**
   * Added by - Ashish Dewangan on 24-11-2024
   * Reason - to format date string if string is in the format of 2024-11-24T14:36:40+05:30
   */
  function formatDateToMMDDYYYY(dateString) {
    const date = new Date(dateString);

    // Extract date components
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    // Format and return the result
    return `${month}/${day}/${year}`;
  }
  /**
   * End of addition by - Ashish Dewangan on 24-11-2024
   * Reason - to format date string if string is in the format of 2024-11-24T14:36:40+05:30
   */

  /**
   * Added by - Ashish Dewangan on 25-11-2024
   * Reason - added a method that will call API to add tracking details for the
   * item which is being returned
   */
  const submitReturnTrackingId = async (e, ItemId, orderId) => {
    e.preventDefault();
    if (returnTrackingId.trim().length < 1) {
      setReturnTrackingIdError("Please enter a tracking id");
    } else {
      setReturnTrackingIdError("");
    }
    if (returnCourierProviderName.trim().length < 1) {
      setReturnCourierProviderNameError(
        "Please enter name of the courier service"
      );
    } else {
      setReturnCourierProviderNameError("");
    }
    if (
      returnTrackingId.trim().length > 1 &&
      returnCourierProviderName.trim().length > 1
    ) {
      const response = await addTrackingDetailsForItem(
        ItemId,
        orderId,
        returnTrackingId,
        returnCourierProviderName
      );
      setIsLoading(true);
      fetchOrderDetail();
    }
  };

  /**
   * End of addition by - Ashish Dewangan on 25-11-2024
   * Reason - added a method that will call API to add tracking details for the
   * item which is being returned
   */
  /**
   * Added by - Unnati on 01-12-2024
   * Reason - added a method that will call API to add tracking details for the
   * item which is being exchanged
   */
  const submitExchangeTrackingId = async (e, ItemId, orderId) => {
    e.preventDefault();

    if (exchangeTrackingId.trim().length < 1) {
      setExchangeTrackingIdError("Please enter a tracking id");
    } else {
      setExchangeTrackingIdError("");
    }
    if (exchangeCourierProviderName.trim().length < 1) {
      setExchangeCourierProviderNameError(
        "Please enter name of the courier service"
      );
    } else {
      setExchangeCourierProviderNameError("");
    }
    if (
      exchangeTrackingId.trim().length > 1 &&
      exchangeCourierProviderName.trim().length > 1
    ) {
      const response = await addExchangeTrackingDetailsForItem(
        ItemId,
        orderId,
        exchangeTrackingId,
        exchangeCourierProviderName
      );
      setIsLoading(true);
      fetchOrderDetail();
    }
  };

  /**
   *End of code addition by - Unnati on 01-12-2024
   * Reason - added a method that will call API to add tracking details for the
   * item which is being exchanged
   */
  /**Code added by Unnati on 20-12-2024
   * Reason-To handle select change
   */
  const handleSelectChange = (size) => {
    setSelectedSize(size);
    localStorage.setItem("size", JSON.stringify(size));
    // localStorage.setItem("size",size)
    console.log("handle select change", size);
    setSizeErrorMessage("");
  };
  /**End of cdoe addition by Unnati on 20-12-2024
   * Reason-To handle select change
   */

  /**Code added by Unnati on 22-12-2024
   *Reason-To select color and show the available sizes
   */

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const selectedProduct = products.find((product) => product.color === color);
    // setSelectedProductDetails(selectedProduct);

    setSelectedProduct(selectedProduct);
    const sizes = {
      XS: selectedProduct.XS,
      S: selectedProduct.S,
      M: selectedProduct.M,
      L: selectedProduct.L,
      XL: selectedProduct.XL,
      XXL: selectedProduct.XXL,
      XXXL: selectedProduct.XXXL,
    };

    setAvailableSizes(sizes);
  };
  /*End of code addition by Unnati on 22-12-2024
   *Reason-To select color and show the available sizes
   */
  // Added by - Ashlekh on 03-12-2024
  // Reason - useState for storing customized data

  // End of code - Ashlekh on 03-12-2024
  // Reason - useState for storing customized data
  /**Code added by Unnati on 22-12-2024
   * Reason-Added stripe promise
   */
  const stripePromise = loadStripe(
    "pk_test_51QM1ZMLLdYR5IHNiVTJBf1YuG5y8nLx4UM28ptBlLs3b21RlpdX7js0prwzWBuilq8nuCNlLQQuTzAs4qiD45HOz00tUMxu1As"
  );
  /**End of code addition by Unnati on 22-12-2024
   * Reason-Added stripe promise
   */

  /**Code added by Unnati on 22-12-2024
   * Reason-If payment gateway is stripe then to store data in local storage
   */
  useEffect(() => {
    if (selectedPaymentGateway == "stripe") {
      const exchangeReason =
        selectedExchangeReason === "Other" && otherExchangeReason
          ? otherExchangeReason
          : selectedExchangeReason;
      const OrderItemExchangeTime = new Date().toLocaleString(undefined, {
        timeZone: "Asia/Kolkata",
      });

      const {
        logo,
        patches,
        security_batches,
        // Added by - Ashlekh on 20-02-2025
        // Reason - To add customization
        security_id_on_back,
        printed_id,
        // End of code - Ashlekh on 20-02-2025
        // Reason - To add customization
        embroider,
        customization_comment,
      } = formData;
      // Calculation of customization
      const selectedProduct = products.filter((i) => i.color == selectedColor);
      let basePrice = parseFloat(selectedProduct[0]?.sales_rate) || 0;

      if (selectedProduct[0]?.sale_percentage) {
        basePrice =
          selectedProduct[0]?.sales_rate -
          (selectedProduct[0]?.sales_rate *
            selectedProduct[0]?.sale_percentage) /
            100;
      }
      if (logo) {
        basePrice += parseFloat(selectedProduct[0]?.logo_price);
      }

      if (patches) {
        basePrice += parseFloat(selectedProduct[0]?.patches_price);
      }

      if (security_batches) {
        basePrice += parseFloat(selectedProduct[0]?.security_batches_price);
      }

      // Added by - Ashlekh on 20-02-2025
      // Reason - To add customization
      if (security_id_on_back) {
        basePrice += parseFloat(selectedProduct[0]?.security_id_on_back_price);
      }
      if (printed_id) {
        basePrice += parseFloat(selectedProduct[0]?.printed_id_price);
      }
      // End of code - Ashlekh on 20-02-2025
      // Reason - To add customization
      if (embroider) {
        basePrice += parseFloat(selectedProduct[0]?.embroider_price);
      }

      let customizationPrice = basePrice;
      const formattedCustomizationPrice = isNaN(customizationPrice)
        ? "0.00"
        : customizationPrice.toFixed(2);
      setFormData((prevState) => ({
        ...prevState,
        after_customization_product_price: formattedCustomizationPrice,
        customization_comment,
        logo,
        patches,
        security_batches,
        // Added by - Ashlekh on 20-02-2025
        // Reason - To add customization
        security_id_on_back,
        printed_id,
        // End of code - Ashlekh on 20-02-2025
        // Reason - To add customization
        embroider,
        logo_price: parseFloat(selectedProduct[0]?.logo_price) || "0.00",
        patches_price: parseFloat(selectedProduct[0]?.patches_price) || "0.00",
        security_batches_price:
          parseFloat(selectedProduct[0]?.security_batches_price) || "0.00",
        embroider_price:
          parseFloat(selectedProduct[0]?.embroider_price) || "0.00",
        // Added by - Ashlekh on 20-02-2025
        // Reason - To add customization
        security_id_on_back_price:
          parseFloat(selectedProduct[0]?.security_id_on_back_price) || "0.00",
        printed_id_price:
          parseFloat(selectedProduct[0]?.printed_id_price) || "0.00",
        // End of code - Ashlekh on 20-02-2025
        // Reason - To add customization
      }));
      const requestType = "Exchanged";
      const productName = selectedProduct[0]?.name;
      const logoPrice = selectedProduct[0]?.logo_price;
      const patchesPrice = selectedProduct[0]?.patches_price;
      const securityBatchesPrice = selectedProduct[0]?.security_batches_price;
      // Added by - Ashlekh on 20-02-2025
      // Reason - To add customization
      const securityIdOnBackPrice =
        selectedProduct[0]?.security_id_on_back_price;
      const printedIdPrice = selectedProduct[0]?.printed_id_price;
      // End of code - Ashlekh on 20-02-2025
      // Reason - To add customization
      const embroiderPrice = selectedProduct[0]?.embroider_price;
      const image1 = selectedProduct[0]?.image1;
      const sale_percentage = selectedProduct[0]?.sale_percentage;
      const salesRate = selectedProduct[0]?.sales_rate;
      const is_free_size = selectedProduct[0]?.is_free_size;
      localStorage.setItem(
        "billingAddress",
        JSON.stringify(Order?.billingAddress)
      );
      localStorage.setItem(
        "shippingAddress",
        JSON.stringify(Order?.shippingAddress)
      );
      localStorage.setItem(
        "OrderItemExchangeTime",
        JSON.stringify(OrderItemExchangeTime)
      );
      localStorage.setItem("exchangeReason", JSON.stringify(exchangeReason));
      /**Code modified by Unnati on 19-01-2025
       * Reason-Added images
       */
      // localStorage.setItem("itemImage1",itemImage1)
      // localStorage.setItem("itemImage1",itemImage1.name)
      saveImageToLocalStorage(itemImage1, "itemImage1");
      // localStorage.setItem("itemImage2",itemImage2)
      saveImageToLocalStorage(itemImage2, "itemImage2");
      /**End of code modification by Unnati on 19-01-2025
       * Reason-Added images
       */
      localStorage.setItem("selectedColor", JSON.stringify(selectedColor));
      localStorage.setItem("selectedSize", JSON.stringify(selectedSize));
      localStorage.setItem("quantity", JSON.stringify(quantity));
      localStorage.setItem("requestType", JSON.stringify(requestType));
      localStorage.setItem("sale_percentage", JSON.stringify(sale_percentage));
      /**Code modified by Unnati on 28-12-2024
       * Reason-Added formatted customization price
       */
      localStorage.setItem(
        "after_customization_product_price",
        JSON.stringify(formattedCustomizationPrice)
      );
      /**End of code modification by Unnati on 28-12-2024
       * Reason-Added formatted customization price
       */
      localStorage.setItem(
        "customization_comment",
        JSON.stringify(formData.customization_comment)
      );
      localStorage.setItem("logo", JSON.stringify(formData.logo));
      localStorage.setItem("patches", JSON.stringify(formData.patches));
      localStorage.setItem(
        "security_batches",
        JSON.stringify(formData.security_batches)
      );
      // Added by - Ashlekh on 20-02-2025
      // Reason - To add customization
      localStorage.setItem(
        "security_id_on_back",
        JSON.stringify(formData.security_id_on_back)
      );
      localStorage.setItem("printed_id", JSON.stringify(formData.printed_id));
      // End of code - Ashlekh on 20-02-2025
      // Reason - To add customization
      localStorage.setItem("embroider", JSON.stringify(formData.embroider));
      localStorage.setItem("productName", JSON.stringify(productName));
      localStorage.setItem("salesRate", JSON.stringify(salesRate));
      localStorage.setItem("logoPrice", JSON.stringify(logoPrice));
      localStorage.setItem("patchesPrice", JSON.stringify(patchesPrice));
      localStorage.setItem(
        "securityBatchesPrice",
        JSON.stringify(securityBatchesPrice)
      );
      // Added by - Ashlekh on 20-02-2025
      // Reason - To add customization
      localStorage.setItem(
        "securityIdOnBackPrice",
        JSON.stringify(securityIdOnBackPrice)
      );
      localStorage.setItem("printedIdPrice", JSON.stringify(printedIdPrice));
      // End of code - Ashlekh on 20-02-2025
      // Reason - To add customization
      localStorage.setItem("embroiderPrice", JSON.stringify(embroiderPrice));
      localStorage.setItem("extraAmount", JSON.stringify(extraAmount));
      localStorage.setItem("is_free_size", JSON.stringify(is_free_size));
      // localStorage.setItem("userId",userId)
    }
  }, [selectedPaymentGateway]);
  /*End od code addition by Unnati on 22-12-2024
   * Reason-If payment gateway is stripe then to store data in local storage
   */
  /**Code added by Unnati on 22-12-2024
   * Reason-To by default select first color
   */
  useEffect(() => {
    if (!selectedColor && uniqueColors.length > 0) {
      setSelectedColor(uniqueColors[0]);
    }
  }, [uniqueColors, selectedColor]);
  /**End of code addition by Unnati on 22-12-2024
   * Reason-To by default select first color
   */
  return (
    <div className={OrderDetailStyle.pageFrame}>
      <div className={OrderDetailStyle.pageContainer}>
        <div className={OrderDetailStyle.coloredBackground}>
          <div className={OrderDetailStyle.formContainer}>
            <h2 className={OrderDetailStyle.pageTitle}>Order Details</h2>
            {/* Added by - Ashlekh on 21-11-2024
            Reason - To add loader */}
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "30vh",
                }}
              >
                <img style={{ height: "30vh" }} src="/adyant_loader.gif" />
              </div>
            ) : (
              // End of code - Ashlekh on 21-11-2024
              // Reason - To add loader
              <div>
                <div className={OrderDetailStyle.orderInfo}>
                  <div className={OrderDetailStyle.orderIdContainer}>
                    <p className={OrderDetailStyle.orderIdLabel}>
                      <strong>Order ID:</strong>
                    </p>
                    <p className={OrderDetailStyle.orderId}>
                      {orderStatus.order_id || "N/A"}
                    </p>
                  </div>
                  {/* Code changed by - Ashlekh on 14-01-2025
                  Reason - To add multiple class name */}
                  {/* <div className={OrderDetailStyle.orderDateContainer}> */}
                  <div
                    className={`${OrderDetailStyle.orderDateContainer} ${OrderDetailStyle.paymentStatusContainer}`}
                  >
                    {/* End of code - Ashlekh on 14-01-2025
                    Reason - To add multiple class name */}
                    <p className={OrderDetailStyle.orderDateLabel}>
                      <strong>Payment Status:</strong>
                    </p>
                    <p className={OrderDetailStyle.orderDate}>
                      {orderStatus.payment_status}
                    </p>
                  </div>
                  {/* Commented by - Ashish Dewangan on 24-11-2024
                   * Reason - No need to display this details */}
                  {/* <div className={OrderDetailStyle.orderDateContainer}>
                    <p className={OrderDetailStyle.orderDateLabel}>
                      <strong>Order Status:</strong>
                    </p>
                    <p className={OrderDetailStyle.orderDate}>
                      {orderStatus.order_status}
                    </p>
                    
                  </div> */}
                  {/* End of comment by - Ashish Dewangan on 24-11-2024
                   * Reason - No need to display this details */}
                  <div className={OrderDetailStyle.orderDateContainer}>
                    <p className={OrderDetailStyle.orderDateLabel}>
                      <strong>Date:</strong>
                    </p>
                    {/* Modified by jhamman on 19-10-2024
                  Reason - changed date format*/}
                    {/* <p className={OrderDetailStyle.orderDate}>
                  {orderStatus.date || "N/A"}
                  </p> */}
                    <p className={OrderDetailStyle.orderDate}>
                      {DateFormatter(orderStatus.date) || "N/A"}
                    </p>
                    {/* End of modification by jhamman on 19-10-2024
                  Reason - changed date format*/}
                  </div>
                </div>
                {/* Added by - Ashlekh on 08-03-2025
                Reason - To add payment status */}
                <div
                  className={`${OrderDetailStyle.orderDateContainer} ${OrderDetailStyle.paymentStatus}`}
                >
                  <p className={OrderDetailStyle.orderDateLabel}>
                    <strong>Payment Status:</strong>
                  </p>
                  <p className={OrderDetailStyle.orderDate}>
                    {orderStatus.payment_status}
                  </p>
                </div>
                {/* End of code - Ashlekh on 08-03-2025
                Reason - To add payment status */}
                {/* Code added by Unnati on 18-09-2024
                 *Reason-To map Order Details */}
                <div className={OrderDetailStyle.orderDetailsContainer}>
                  {/**Code added by Unnati on 20-12-2024
                   *Reason-To show exchanged items */}
                  {exchangedItems.map((item) => {
                    if (item.delivery_date != null) {
                      var elapsedDate =
                        (new Date() - new Date(item.delivery_date)) /
                        (1000 * 60 * 60 * 24);
                      {
                        /**Code commented by Unnati on 27-12-2024
                         *Reason-This code is not in use */
                      }
                      {
                        /* var max_return_days = settings.max_return_days
                        ? settings.max_return_days
                        : 30; */
                      }
                      {
                        /**End of code commented by Unnati on 27-12-2024
                         *Reason-This code is not in use */
                      }
                      /**Code added by Unnati on 29-11-2024
                       *Reason-Added max exchange days */
                      var max_exchange_days = settings.max_exchange_days
                        ? settings.max_exchange_days
                        : 30;
                      /**End of code addition by Unnati on 29-11-2024
                       *Reason-Added max exchange days */
                    }
                    return (
                      <div className={OrderDetailStyle.orderCard} key={item.id}>
                        <div className={OrderDetailStyle.statusSection}>
                          <div className={OrderDetailStyle.status}></div>
                          {/* <div className={OrderDetailStyle.date}><span>{item.date || "N/A"}</span></div> */}
                        </div>
                        <div className={OrderDetailStyle.productSection}>
                          <div className={OrderDetailStyle.orderItemImage}>
                            {/**Code added by Unnati on 30-09-2024
                             *Reason-To add link in image section */}
                            {item.is_active ? (
                              <Link
                                to={`/productdetail/${
                                  item.product_id
                                    ? item.product_id
                                    : item.product
                                }`}
                                /**Code added by Unnati on 11-12-2024
                                 *Reason-Send color through state */
                                state={item.color}
                                /**End of code addition by Unnati on 11-12-2024
                                 *Reason-Send color through state */
                              >
                                <img
                                  /**Code added by Unnati on 29-12-2024
                                   *Reason-To check for product and category whether it is active or not */
                                  onClick={(e) => {
                                    handleCheckProductAvailability(
                                      item.product_id,
                                      item.color,
                                      item.product
                                    );
                                  }}
                                  /**End of code addition by Unnati on 29-12-2024
                                   *Reason-To check for product and category whether it is active or not */
                                  src={`${config.baseURL}${item.product_image1}`}
                                  alt={item.product_name}
                                  className={OrderDetailStyle.productImage}
                                />
                              </Link>
                            ) : (
                              <img
                                /**Code added by Unnati on 29-12-2024
                                 *Reason-To check for product and category whether it is active or not */
                                onClick={(e) => {
                                  handleCheckProductAvailability(
                                    item.product_id,
                                    item.color,
                                    item.product
                                  );
                                }}
                                /**End of code addition by Unnati on 29-12-2024
                                 *Reason-To check for product and category whether it is active or not */
                                src={`${config.baseURL}${item.product_image1}`}
                                alt={item.product_name}
                                className={OrderDetailStyle.productImage}
                              />
                            )}

                            {/**End of code addition by Unnati on 30-09-2024
                             *Reason-To add link in image section */}
                          </div>
                          <div className={OrderDetailStyle.productInfo}>
                            {/**Code added by Unnati on 30-09-2024
                             *Reason-To add link in product name */}

                            <h3
                              className={OrderDetailStyle.productTitle}
                              /**Code added by Unnati on 29-12-2024
                               *Reason-To check for product and category whether it is active or not */
                              onClick={(e) => {
                                handleCheckProductAvailability(
                                  item.product_id,
                                  item.color,
                                  item.product
                                );
                              }}
                              /**End of code addition by Unnati on 29-12-2024
                               *Reason-To check for product and category whether it is active or not */
                            >
                              {item.is_active ? (
                                <Link
                                  to={`/productdetail/${
                                    item.product_id
                                      ? item.product_id
                                      : item.product
                                  }`}
                                  className={OrderDetailStyle.productTitle}
                                  /**Code added by Unnati on 11-12-2024
                                   *Reason-Send color through state */
                                  state={item.color}
                                  /**End of code addition by Unnati on 11-12-2024
                                   *Reason-Send color through state */
                                >
                                  {item.product_name}
                                  {/* Addition by Om Shrivastava on 26-11-2024
                                            Reason : Add text of customized product  */}
                                  {item.logo ||
                                  item.patches ||
                                  item.security_batches ||
                                  // Added by - Ashlekh on 20-02-2025
                                  // Reason - To add customization
                                  item.security_id_on_back ||
                                  item.printed_id ||
                                  // End of code - Ashlekh on 20-02-2025
                                  // Reason - To add customization
                                  item.embroider ? (
                                    <div
                                      style={{
                                        color: "#008000",
                                        fontSize: "10px",
                                      }}
                                    >
                                      Customized product
                                    </div>
                                  ) : null}
                                  {/* End of addition by Om Shrivastava on 26-11-2024
                                            Reason : Add text of customized product  */}
                                </Link>
                              ) : (
                                item.product_name
                              )}
                            </h3>

                            {/**End of code addition by Unnati on 30-09-2024
                             *Reason-To add link in product name */}
                            {/**Code added by Unnati on 30-09-2024
                             *Reason-To add link in product description */}

                            {/**End of code addition by Unnati on 30-09-2024
                             *Reason-To add link in product description */}
                            <p className={OrderDetailStyle.productSize}>
                              Size: {item.size}
                            </p>
                            <p className={OrderDetailStyle.productSize}>
                              Quantity: {item.quantity}
                            </p>
                            {item.item_status == "Cancelled" ? (
                              <p className={OrderDetailStyle.productSize}>
                                {/* -${item.sales_rate} */}
                                {/* Modification and addition by Om Shrivastava on 26-11-2024
                             Reason : Show the customization amount also  */}
                                {/* Modification and addition by Om Shrivastava on 04-12-2024
                                 Reason : Show the amount  */}
                                {/* {item.sales_rate} */}
                                {/* {item.logo ||
                                    item.patches ||
                                    item.security_batches ||
                                    item.embroider ? (
                                  <>
                                    -${item.after_customization_product_price}
                                  </>
                                ) : (
                                  <>-${item.sales_rate}</>
                                )} */}
                                -{config.currency_icon}{item.amount}
                                {/* End of modification and addition by Om Shrivastava on 04-12-2024
                           Reason : Show the amount  */}
                                {/* End of modification and addition by Om Shrivastava on 26-11-2024
                           Reason : Show the customization amount also  */}
                              </p>
                            ) : (
                              <p className={OrderDetailStyle.productSize}>
                                {/* ${item.sales_rate} */}
                                {/* Modification and addition by Om Shrivastava on 04-12-2024
                              Reason : Show the amount  */}
                                {/* Modification and addition by Om Shrivastava on 26-11-2024
                                Reason : Show the customization amount also  */}
                                {/* {item.sales_rate} */}
                                {/* {item.logo ||
                                    item.patches ||
                                    item.security_batches ||
                                    item.embroider ? (
                                  <>${item.after_customization_product_price}</>
                                ) : (
                                  <>${item.sales_rate}</>
                                )} */}
                               {config.currency_icon}{item.amount}
                                {/* Emd of modification and addition by Om Shrivastava on 04-12-2024
                                  Reason : Show the amount  */}
                                {/* End of modification and addition by Om Shrivastava on 26-11-2024
                                Reason : Show the customization amount also  */}
                              </p>
                            )}
                            {/**Code added by Unnati on 27-12-2024
                             *Reason-Added inactive message */}
                            <p className={OrderDetailStyle.notAvailableMessage}>
                              {item.product_id ==
                                unavailableProduct.productId &&
                              item.color == unavailableProduct.color
                                ? "This product is not available"
                                : ""}
                            </p>
                            {/*End of code addition by Unnati on 27-12-2024
                             *Reason-Added inactive message */}
                            <p className={OrderDetailStyle.notAvailableMessage}>
                              {item.is_active
                                ? ""
                                : "This product is not available"}
                            </p>
                            {item.item_status != "" && (
                              <p className={`${OrderDetailStyle.greenStatus}`}>
                                {item.item_status}
                              </p>
                            )}
                            {/**Code added by Unnati on 20-01-2025
                             *Reason-Added message for refund initiated */}
                            {item.item_status === "Refund Initiated" && (
                              <p className={OrderDetailStyle.productSize}>
                                ${item.refund_amount} will be refunded to your
                                account within 7-10 business days
                              </p>
                            )}
                            {item.item_status === "Refunded" && (
                              <p className={OrderDetailStyle.productSize}>
                                ${item.refund_amount} is refunded to your
                                account
                              </p>
                            )}
                            {/**End of code addition by Unnati on 20-01-2025
                             *Reason-Added message for refund initiated */}
                            {/* Added by - Unnati on 29-11-2024
                             * Reason - To user inputbox for entering tracking id
                             * if return reason is not defective */}
                            <div className={OrderDetailStyle.buttons}>
                              {item.item_status == "Exchange Approved" &&
                              item.return_reason !=
                                "Defective or Damaged Item" ? (
                                <form>
                                  <div style={{ display: "flex" }}>
                                    <div
                                      style={{ margin: "10px 10px 10px 0px" }}
                                    >
                                      <div
                                        className={
                                          OrderDetailStyle.cancellationReason
                                        }
                                        style={{
                                          marginBottom: "3px",
                                          fontWeight: 600,
                                        }}
                                      >
                                        Please add the tracking details after
                                        you courier the parcel
                                      </div>
                                      <div
                                        // style={{ display: "flex" }}
                                        className={`${OrderDetailStyle.exchangeInputBox}`}
                                      >
                                        <div>
                                          <input
                                            type="text"
                                            name="courier_name"
                                            placeholder="Courier Service Provider Name"
                                            value={exchangeCourierProviderName}
                                            onChange={(e) =>
                                              setExchangeCourierProviderName(
                                                e.target.value
                                              )
                                            }
                                            style={{ marginBottom: "5px" }}
                                            className={
                                              OrderDetailStyle.textInputBox
                                            }
                                          />
                                          {exchangeCourierProviderNameError.length >
                                            0 && (
                                            <div
                                              className={
                                                OrderDetailStyle.cancellationReason
                                              }
                                              style={{
                                                color: "red",
                                                marginBottom: "5px",
                                              }}
                                            >
                                              {exchangeCourierProviderNameError}
                                            </div>
                                          )}
                                        </div>
                                        <div>
                                          <input
                                            type="text"
                                            name="tracking_id"
                                            placeholder="Tracking ID"
                                            value={exchangeTrackingId}
                                            onChange={(e) =>
                                              setExchangeTrackingId(
                                                e.target.value
                                              )
                                            }
                                            style={{ marginBottom: "5px" }}
                                            className={
                                              OrderDetailStyle.textInputBox
                                            }
                                          />
                                          {exchangeTrackingIdError.length >
                                            0 && (
                                            <div
                                              className={
                                                OrderDetailStyle.cancellationReason
                                              }
                                              style={{
                                                color: "red",
                                                marginBottom: "5px",
                                              }}
                                            >
                                              {exchangeTrackingIdError}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div>
                                        <button
                                          className={
                                            OrderDetailStyle.cancelButton
                                          }
                                          onClick={(e) =>
                                            submitExchangeTrackingId(
                                              e,
                                              item.id,
                                              item.order
                                            )
                                          }
                                        >
                                          Submit
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </form>
                              ) : null}
                            </div>
                            {/* End of addition by - Unnati on 25-11-2024
                             * Reason - To user inputbox for entering tracking id
                             * if return reason is not defective */}
                            {item.item_status == "Refunded" ||
                            item.item_status == "Exchanged" ? (
                              <button
                                className={OrderDetailStyle.invoiceButton}
                                onClick={() => handleExchangeInvoice(item)}
                              >
                                View Invoice
                              </button>
                            ) : null}
                            {/**Code commented by Unnati on 20-01-2025
                             *Reason-This code is not in use currently */}
                            {/* {item.item_status == "Refund Initiated"?
                               <p className={
                                    OrderDetailStyle.cancellationReason
                                  }
                                  style={{letterSpacing:".3px",fontWeight:500}}>
                                  Amount will be refunded to account within 7-10 business days 
                              </p>:null} */}
                            {/**End of code commented by Unnati on 20-01-2025
                             *Reason-This code is not in use currently */}

                            {item.product_is_exchangeable &&
                            item.item_status === "Delivered" &&
                            item.delivery_date !== null &&
                            elapsedDate <= max_exchange_days &&
                            !(
                              item.logo ||
                              item.patches ||
                              item.security_batches ||
                              // Added by - Ashlekh on 20-02-2025
                              // Reason - To add customization
                              item.security_id_on_back ||
                              item.printed_id ||
                              // End of code - Ashlekh on 20-02-2025
                              // Reason - To add customization
                              item.embroider
                            ) ? (
                              <button
                                className={OrderDetailStyle.cancelButton}
                                onClick={() => handleExchangeModal(item.id)}
                              >
                                Exchange
                              </button>
                            ) : null}
                          </div>
                          {/**Code added by Unnati on 27-12-2024
                           *Reason-Added customisation */}
                          <div className={OrderDetailStyle.customisation}>
                            {item.logo ||
                            item.patches ||
                            item.embroider ||
                            item.security_batches ||
                            // Added by - Ashlekh on 20-02-2025
                            // Reason - To add customization
                            item.security_id_on_back ||
                            item.printed_id ? (
                              // End of code - Ashlekh on 20-02-2025
                              // Reason - To add customization
                              <h4>Customization Detail</h4>
                            ) : null}
                            {item.logo ? (
                              <p>Logo : ${item.logo_price}</p>
                            ) : null}
                            {item.patches ? (
                              <p>Patches / Batches : ${item.patches_price}</p>
                            ) : null}
                            {item.embroider ? (
                              <p>Embroider / Name : ${item.embroider_price}</p>
                            ) : null}
                            {/* Code changed by - Ashlekh on 21-02-2025
                                Reason - To change customization name */}
                            {/* {item.security_batches?<p>Security id : ${item.security_batches_price}</p>:null} */}
                            {item.security_batches ? (
                              <p>
                                Security ID on Back and Chest : $
                                {item.security_batches_price}
                              </p>
                            ) : null}
                            {/* End of code - Ashlekh on 21-02-2025
                                Reason - To change name */}
                            {/* Added by - Ashlekh on 20-02-2025
                                Reason - To add customizaation customization */}
                            {item.security_id_on_back ? (
                              <p>
                                Security ID on Back : $
                                {item.security_id_on_back_price}
                              </p>
                            ) : null}
                            {item.printed_id ? (
                              <p>Print ID : ${item.printed_id_price}</p>
                            ) : null}
                            {/* End of code - Ashlekh on 20-02-2025
                                Reason - To add customization */}
                          </div>
                          {/**End of code addition by Unnati on 27-12-2024
                           *Reason-Added customisation */}
                        </div>
                      </div>
                    );
                  })}
                  {/**End of code addition by Unnati on 20-12-2024
                   *Reason-To show exchanged items */}
                  {/**Code added by Unnati on 26-12-2024
                   *Reason-To show cancelled items */}
                  {cancelledItems.map((item) => {
                    if (item.delivery_date != null) {
                      var elapsedDate =
                        (new Date() - new Date(item.delivery_date)) /
                        (1000 * 60 * 60 * 24);

                      /**Code added by Unnati on 26-12-2024
                       *Reason-Added max exchange days */
                      var max_cancellation_days = settings.max_cancellation_days
                        ? settings.max_cancellation_days
                        : 7;
                      /**End of code addition by Unnati on 26-12-2024
                       *Reason-Added max exchange days */
                    }
                    return (
                      <div className={OrderDetailStyle.orderCard} key={item.id}>
                        <div className={OrderDetailStyle.statusSection}>
                          <div className={OrderDetailStyle.status}></div>
                          {/* <div className={OrderDetailStyle.date}><span>{item.date || "N/A"}</span></div> */}
                        </div>
                        <div className={OrderDetailStyle.productSection}>
                          <div className={OrderDetailStyle.orderItemImage}>
                            {/**Code added by Unnati on 30-09-2024
                             *Reason-To add link in image section */}
                            {item.is_active ? (
                              <Link
                                to={`/productdetail/${
                                  item.product_id
                                    ? item.product_id
                                    : item.product
                                }`}
                                state={item.color}
                              >
                                <img
                                  /**Code added by Unnati on 29-12-2024
                                   *Reason-To check for product and category whether it is active or not */
                                  onClick={(e) => {
                                    handleCheckProductAvailability(
                                      item.product_id,
                                      item.color,
                                      item.product
                                    );
                                  }}
                                  /**End of code addition by Unnati on 29-12-2024
                                   *Reason-To check for product and category whether it is active or not */
                                  src={`${config.baseURL}${item.product_image1}`}
                                  alt={item.product_name}
                                  className={OrderDetailStyle.productImage}
                                />
                              </Link>
                            ) : (
                              <img
                                /**Code added by Unnati on 29-12-2024
                                 *Reason-To check for product and category whether it is active or not */
                                onClick={(e) => {
                                  handleCheckProductAvailability(
                                    item.product_id,
                                    item.color,
                                    item.product
                                  );
                                }}
                                /**End of code addition by Unnati on 29-12-2024
                                 *Reason-To check for product and category whether it is active or not */
                                src={`${config.baseURL}${item.product_image1}`}
                                alt={item.product_name}
                                className={OrderDetailStyle.productImage}
                              />
                            )}
                          </div>
                          <div className={OrderDetailStyle.productInfo}>
                            <h3
                              className={OrderDetailStyle.productTitle}
                              /**Code added by Unnati on 29-12-2024
                               *Reason-To check for product and category whether it is active or not */
                              onClick={(e) => {
                                handleCheckProductAvailability(
                                  item.product_id,
                                  item.color,
                                  item.product
                                );
                              }}
                              /**End of code addition by Unnati on 29-12-2024
                               *Reason-To check for product and category whether it is active or not */
                            >
                              {item.is_active ? (
                                <Link
                                  to={`/productdetail/${
                                    item.product_id
                                      ? item.product_id
                                      : item.product
                                  }`}
                                  className={OrderDetailStyle.productTitle}
                                  state={item.color}
                                >
                                  {item.product_name}

                                  {item.logo ||
                                  item.patches ||
                                  item.security_batches ||
                                  // Added by - Ashlekh on 20-02-2025
                                  // Reason - To add customization
                                  item.security_id_on_back ||
                                  item.printed_id ||
                                  // End of code - Ashlekh on 20-02-2025
                                  // Reason - To add customization
                                  item.embroider ? (
                                    <div
                                      style={{
                                        color: "#008000",
                                        fontSize: "10px",
                                      }}
                                    >
                                      Customized product
                                    </div>
                                  ) : null}
                                </Link>
                              ) : (
                                item.product_name
                              )}
                            </h3>
                            <p className={OrderDetailStyle.productSize}>
                              Size: {item.size}
                            </p>
                            <p className={OrderDetailStyle.productSize}>
                              Quantity: {item.quantity}
                            </p>
                            {item.item_status == "Cancelled" ? (
                              <p className={OrderDetailStyle.productSize}>
                                -{config.currency_icon}{item.amount}
                              </p>
                            ) : (
                              <p className={OrderDetailStyle.productSize}>
                                {config.currency_icon}{item.amount}
                              </p>
                            )}
                            <p className={OrderDetailStyle.notAvailableMessage}>
                              {item.is_active
                                ? ""
                                : "This product is not available"}
                            </p>
                            {item.item_status != "" && (
                              <p className={`${OrderDetailStyle.greenStatus}`}>
                                {item.item_status}
                              </p>
                            )}
                            {item.item_status === "Refund Initiated" && (
                              <p className={OrderDetailStyle.productSize}>
                                ${item.refund_amount} will be refunded to your
                                account within 7-10 business days
                              </p>
                            )}
                            {item.item_status === "Refunded" && (
                              <p className={OrderDetailStyle.productSize}>
                                ${item.refund_amount} is refunded to your
                                account
                              </p>
                            )}
                            {item.item_status == "Refunded" ? (
                              <button
                                className={OrderDetailStyle.invoiceButton}
                                onClick={() => handleCreditNote(item)}
                              >
                                View Credit Note
                              </button>
                            ) : null}
                            {/**Code commented by Unnati on 20-01-2025
                             *Reason-This code is not in use */}
                            {/* {item.item_status == "Refund Initiated"?
                               <p className={
                                    OrderDetailStyle.cancellationReason
                                  }
                                  style={{letterSpacing:".3px",fontWeight:500}}>
                                  Amount will be refunded to account within 7-10 business days 
                              </p>:null} */}
                            {/**End of code addition by Unnati on 20-01-2025
                             *Reason-This code is not in use */}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {/**End of code addition by Unnati on 26-12-2024
                   *Reason-To show cancelled items */}
                  {/**Code added by Unnati on 27-12-2024
                   *Reason-To show returned items */}
                  {returnedItems.map((item) => {
                    if (item.delivery_date != null) {
                      var elapsedDate =
                        (new Date() - new Date(item.delivery_date)) /
                        (1000 * 60 * 60 * 24);
                      var max_return_days = settings.max_return_days
                        ? settings.max_return_days
                        : 30;
                    }
                    return (
                      <div className={OrderDetailStyle.orderCard} key={item.id}>
                        <div className={OrderDetailStyle.statusSection}>
                          <div className={OrderDetailStyle.status}></div>
                          {/* <div className={OrderDetailStyle.date}><span>{item.date || "N/A"}</span></div> */}
                        </div>
                        <div className={OrderDetailStyle.productSection}>
                          <div className={OrderDetailStyle.orderItemImage}>
                            {/**Code added by Unnati on 30-09-2024
                             *Reason-To add link in image section */}
                            {item.is_active ? (
                              <Link
                                to={`/productdetail/${
                                  item.product_id
                                    ? item.product_id
                                    : item.product
                                }`}
                                /**Code added by Unnati on 11-12-2024
                                 *Reason-Send color through state */
                                state={item.color}
                                /**End of code addition by Unnati on 11-12-2024
                                 *Reason-Send color through state */
                              >
                                <img
                                  /**Code added by Unnati on 29-12-2024
                                   *Reason-To check for product and category whether it is active or not */
                                  onClick={(e) => {
                                    handleCheckProductAvailability(
                                      item.product_id,
                                      item.color,
                                      item.product
                                    );
                                  }}
                                  /**End of code addition by Unnati on 29-12-2024
                                   *Reason-To check for product and category whether it is active or not */
                                  src={`${config.baseURL}${item.product_image1}`}
                                  alt={item.product_name}
                                  className={OrderDetailStyle.productImage}
                                />
                              </Link>
                            ) : (
                              <img
                                /**Code added by Unnati on 29-12-2024
                                 *Reason-To check for product and category whether it is active or not */
                                onClick={(e) => {
                                  handleCheckProductAvailability(
                                    item.product_id,
                                    item.color,
                                    item.product
                                  );
                                }}
                                /**End of code addition by Unnati on 29-12-2024
                                 *Reason-To check for product and category whether it is active or not */
                                src={`${config.baseURL}${item.product_image1}`}
                                alt={item.product_name}
                                className={OrderDetailStyle.productImage}
                              />
                            )}

                            {/**End of code addition by Unnati on 30-09-2024
                             *Reason-To add link in image section */}
                          </div>
                          <div className={OrderDetailStyle.productInfo}>
                            {/**Code added by Unnati on 30-09-2024
                             *Reason-To add link in product name */}

                            <h3
                              className={OrderDetailStyle.productTitle}
                              /**Code added by Unnati on 29-12-2024
                               *Reason-To check for product and category whether it is active or not */
                              onClick={(e) => {
                                handleCheckProductAvailability(
                                  item.product_id,
                                  item.color,
                                  item.product
                                );
                              }}
                              /**End of code addition by Unnati on 29-12-2024
                               *Reason-To check for product and category whether it is active or not */
                            >
                              {item.is_active ? (
                                <Link
                                  to={`/productdetail/${
                                    item.product_id
                                      ? item.product_id
                                      : item.product
                                  }`}
                                  className={OrderDetailStyle.productTitle}
                                  /**Code added by Unnati on 11-12-2024
                                   *Reason-Send color through state */
                                  state={item.color}
                                  /**End of code addition by Unnati on 11-12-2024
                                   *Reason-Send color through state */
                                >
                                  {item.product_name}
                                  {/* Addition by Om Shrivastava on 26-11-2024
                                            Reason : Add text of customized product  */}
                                  {item.logo ||
                                  item.patches ||
                                  item.security_batches ||
                                  // Added by - Ashlekh on 20-02-2025
                                  // Reason - To add customization
                                  item.security_id_on_back ||
                                  item.printed_id ||
                                  // End of code - Ashlekh on 20-02-2025
                                  // Reason - To add customization
                                  item.embroider ? (
                                    <div
                                      style={{
                                        color: "#008000",
                                        fontSize: "10px",
                                      }}
                                    >
                                      Customized product
                                    </div>
                                  ) : null}
                                  {/* End of addition by Om Shrivastava on 26-11-2024
                                            Reason : Add text of customized product  */}
                                </Link>
                              ) : (
                                item.product_name
                              )}
                            </h3>

                            {/**End of code addition by Unnati on 30-09-2024
                             *Reason-To add link in product name */}
                            {/**Code added by Unnati on 30-09-2024
                             *Reason-To add link in product description */}

                            {/**End of code addition by Unnati on 30-09-2024
                             *Reason-To add link in product description */}
                            <p className={OrderDetailStyle.productSize}>
                              Size: {item.size}
                            </p>
                            <p className={OrderDetailStyle.productSize}>
                              Quantity: {item.quantity}
                            </p>
                            {item.item_status == "Cancelled" ? (
                              <p className={OrderDetailStyle.productSize}>
                                {/* -${item.sales_rate} */}
                                {/* Modification and addition by Om Shrivastava on 26-11-2024
                             Reason : Show the customization amount also  */}
                                {/* Modification and addition by Om Shrivastava on 04-12-2024
                                 Reason : Show the amount  */}
                                {/* {item.sales_rate} */}
                                {/* {item.logo ||
                                    item.patches ||
                                    item.security_batches ||
                                    item.embroider ? (
                                  <>
                                    -${item.after_customization_product_price}
                                  </>
                                ) : (
                                  <>-${item.sales_rate}</>
                                )} */}
                                -{config.currency_icon}{item.amount}
                                {/* End of modification and addition by Om Shrivastava on 04-12-2024
                           Reason : Show the amount  */}
                                {/* End of modification and addition by Om Shrivastava on 26-11-2024
                           Reason : Show the customization amount also  */}
                              </p>
                            ) : (
                              <p className={OrderDetailStyle.productSize}>
                                {/* ${item.sales_rate} */}
                                {/* Modification and addition by Om Shrivastava on 04-12-2024
                              Reason : Show the amount  */}
                                {/* Modification and addition by Om Shrivastava on 26-11-2024
                                Reason : Show the customization amount also  */}
                                {/* {item.sales_rate} */}
                                {/* {item.logo ||
                                    item.patches ||
                                    item.security_batches ||
                                    item.embroider ? (
                                  <>${item.after_customization_product_price}</>
                                ) : (
                                  <>${item.sales_rate}</>
                                )} */}
                                {config.currency_icon}{item.amount}
                                {/* Emd of modification and addition by Om Shrivastava on 04-12-2024
                                  Reason : Show the amount  */}
                                {/* End of modification and addition by Om Shrivastava on 26-11-2024
                                Reason : Show the customization amount also  */}
                              </p>
                            )}
                            <p className={OrderDetailStyle.notAvailableMessage}>
                              {item.is_active
                                ? ""
                                : "This product is not available"}
                            </p>
                            {item.item_status != "" && (
                              <p className={`${OrderDetailStyle.greenStatus}`}>
                                {item.item_status}
                              </p>
                            )}
                            {item.returned_by != "None" &&
                            [
                              "Return Initiated",
                              "Return Approved",
                              "Return Rejected",
                              "Parcel Pickup Initiated for Return",
                              "Parcel Picked Up for Return",
                              "Returned",
                            ].includes(item.item_status) &&
                            item.return_approval_reason != null &&
                            item.return_approval_reason?.trim()?.length > 0 ? (
                              <>
                                <p
                                  className={
                                    OrderDetailStyle.cancellationReason
                                  }
                                >
                                  Return Approval Reason :{" "}
                                  {item.return_approval_reason}
                                </p>
                              </>
                            ) : null}

                            {item.returned_by != "None" &&
                            item.return_rejection_reason != null &&
                            item.return_rejection_reason?.trim()?.length > 0 ? (
                              <>
                                <p
                                  className={
                                    OrderDetailStyle.cancellationReason
                                  }
                                >
                                  Return Rejection Reason :{" "}
                                  {item.return_rejection_reason}
                                </p>
                              </>
                            ) : null}
                            {/**Code added by Unnati on 20-01-2025
                             *Reason-Added message for refund initiated */}
                            {item.item_status === "Refund Initiated" && (
                              <p className={OrderDetailStyle.productSize}>
                                ${item.refund_amount} will be refunded to your
                                account within 7-10 business days
                              </p>
                            )}
                            {item.item_status === "Refunded" && (
                              <p className={OrderDetailStyle.productSize}>
                                ${item.refund_amount} is refunded to your
                                account
                              </p>
                            )}
                            {/**End of code addition by Unnati on 20-01-2025
                             *Reason-Added message for refund initiated */}
                            {item.returned_by == "Admin" &&
                            [
                              "Return Initiated",
                              "Return Approved",
                              "Return Rejected",
                              "Parcel Pickup Initiated for Return",
                              "Parcel Picked Up for Return",
                              "Returned",
                            ].includes(item.item_status) ? (
                              <p className={OrderDetailStyle.cancelled}>
                                Item Return Initiated by Admin
                              </p>
                            ) : null}

                            {item.returned_by != "None" &&
                            [
                              "Parcel Pickup Initiated for Return",
                              "Parcel Picked Up for Return",
                            ].includes(item.item_status) &&
                            item.return_pickup_date != null ? (
                              <>
                                <p
                                  className={
                                    OrderDetailStyle.cancellationReason
                                  }
                                >
                                  Pickup date :{" "}
                                  {formatDateToMMDDYYYY(
                                    item.return_pickup_date
                                  )}
                                </p>
                              </>
                            ) : null}
                            {/* Added by - Ashish Dewangan on 25-11-2024
                             * Reason - To user inputbox for entering tracking id
                             * if return reason is not defective */}
                            <div className={OrderDetailStyle.buttons}>
                              {item.item_status == "Return Approved" &&
                              item.return_reason != "Defective" ? (
                                <form>
                                  <div style={{ display: "flex" }}>
                                    <div
                                      style={{ margin: "10px 10px 10px 0px" }}
                                    >
                                      <div
                                        className={
                                          OrderDetailStyle.cancellationReason
                                        }
                                        style={{
                                          marginBottom: "3px",
                                          fontWeight: 600,
                                        }}
                                      >
                                        Please add the tracking details after
                                        you courier the parcel
                                      </div>
                                      <div style={{ display: "flex" }}>
                                        <div>
                                          <input
                                            type="text"
                                            name="courier_name"
                                            placeholder="Courier Service Provider Name"
                                            value={returnCourierProviderName}
                                            onChange={(e) =>
                                              setReturnCourierProviderName(
                                                e.target.value
                                              )
                                            }
                                            style={{ marginBottom: "3px" }}
                                            className={
                                              OrderDetailStyle.textInputBox
                                            }
                                          />
                                          {returnCourierProviderNameError.length >
                                            0 && (
                                            <div
                                              className={
                                                OrderDetailStyle.cancellationReason
                                              }
                                              style={{
                                                color: "red",
                                                marginBottom: "3px",
                                              }}
                                            >
                                              {returnCourierProviderNameError}
                                            </div>
                                          )}
                                        </div>
                                        <div>
                                          <input
                                            type="text"
                                            name="tracking_id"
                                            placeholder="Tracking ID"
                                            value={returnTrackingId}
                                            onChange={(e) =>
                                              setReturnTrackingId(
                                                e.target.value
                                              )
                                            }
                                            style={{ marginBottom: "3px" }}
                                            className={
                                              OrderDetailStyle.textInputBox
                                            }
                                          />
                                          {returnTrackingIdError.length > 0 && (
                                            <div
                                              className={
                                                OrderDetailStyle.cancellationReason
                                              }
                                              style={{
                                                color: "red",
                                                marginBottom: "3px",
                                              }}
                                            >
                                              {returnTrackingIdError}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div>
                                        <button
                                          className={
                                            OrderDetailStyle.cancelButton
                                          }
                                          onClick={(e) =>
                                            submitReturnTrackingId(
                                              e,
                                              item.id,
                                              item.order
                                            )
                                          }
                                        >
                                          Submit
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </form>
                              ) : null}
                            </div>
                            {/* End of addition by - Ashish Dewangan on 25-11-2024
                             * Reason - To user inputbox for entering tracking id
                             * if return reason is not defective */}
                            {item.returned_by != "None" &&
                            [
                              "Return Initiated",
                              "Return Approved",
                              "Return Rejected",
                              "Parcel Pickup Initiated for Return",
                              "Parcel Picked Up for Return",
                              "Returned",
                            ].includes(item.item_status) &&
                            item.return_reason != null &&
                            item.return_reason?.trim()?.length > 0 ? (
                              <>
                                <p
                                  className={
                                    OrderDetailStyle.cancellationReason
                                  }
                                >
                                  Reason for Return : {item.return_reason}
                                </p>
                              </>
                            ) : null}

                            {item.returned_by != "None" &&
                            [
                              "Return Initiated",
                              "Return Approved",
                              "Return Rejected",
                              "Parcel Pickup Initiated for Return",
                              "Parcel Picked Up for Return",
                              "Returned",
                            ].includes(item.item_status) &&
                            item.return_authorization_no != null &&
                            item.return_authorization_no?.trim()?.length > 0 ? (
                              <>
                                <p
                                  className={
                                    OrderDetailStyle.cancellationReason
                                  }
                                >
                                  Return Authorization Number :{" "}
                                  {item.return_authorization_no}
                                </p>
                              </>
                            ) : null}
                            {item.item_status != "Returned" &&
                            item.courier_service_provider_name != null &&
                            item.courier_service_provider_name?.trim()?.length >
                              0 ? (
                              <>
                                <p
                                  className={
                                    OrderDetailStyle.cancellationReason
                                  }
                                >
                                  Courier Service Provider Name :{" "}
                                  {item.courier_service_provider_name}
                                </p>
                              </>
                            ) : null}
                            {/* {item.item_status == "Refunded" || item.item_status == "Exchanged" ? (
                                  <button
                                    className={OrderDetailStyle.invoiceButton}
                                    onClick={() => handleExchangeInvoice(item)}
                                  >
                                    View Invoice
                                  </button>
                                ) : null} */}
                            {item.item_status == "Refunded" ? (
                              <button
                                className={OrderDetailStyle.invoiceButton}
                                onClick={() => handleCreditNote(item)}
                              >
                                View Credit Note
                              </button>
                            ) : null}
                            {/**Code added by Unnati on 08-12-2024
                             *Reason-To show message if item status is refund initiated */}
                            {/**Code commented by Unnati on 20-01-2025
                             *Reason-This code is not in use currently */}
                            {/* {item.item_status == "Refund Initiated"?
                               <p className={
                                    OrderDetailStyle.cancellationReason
                                  }
                                  style={{letterSpacing:".3px",fontWeight:500}}>
                                  Amount will be refunded to account within 7-10 business days 
                              </p>:null} */}
                            {/**End of code commented by Unnati on 20-01-2025
                             *Reason-This code is not in use currently */}
                            {item.item_status == "Refunded" &&
                            item.refund_transaction_id != null &&
                            item.refund_transaction_id?.trim()?.length > 0 ? (
                              <p
                                className={OrderDetailStyle.cancellationReason}
                              >
                                Return Transaction ID :{" "}
                                {item.refund_transaction_id}
                              </p>
                            ) : null}
                            {/**End of code addition by Unnati on 08-12-2024
                             *Reason-To show message if item status is refund initiated */}
                            {item.product_is_exchangeable &&
                            item.item_status === "Delivered" &&
                            item.delivery_date !== null &&
                            elapsedDate <= max_return_days &&
                            !(
                              item.logo ||
                              item.patches ||
                              item.security_batches ||
                              // Added by - Ashlekh on 20-02-2025
                              // Reason - To add customization
                              item.security_id_on_back ||
                              item.printed_id ||
                              // End of code - Ashlekh on 20-02-2025
                              // Reason - To add customization
                              item.embroider
                            ) ? (
                              <button
                                className={OrderDetailStyle.cancelButton}
                                onClick={() => handleExchangeModal(item.id)}
                              >
                                Exchange
                              </button>
                            ) : null}
                          </div>
                          {/**Code added by Unnati on 27-12-2024
                           *Reason-Added customisation */}
                          <div className={OrderDetailStyle.customisation}>
                            {/* Added by - Ashlekh on 20-02-2025
                          Reason - To add customization */}
                            {/* {item.logo ||item.patches||item.embroider||item.security_batches ? <h4>Customization Detail</h4>:null} */}
                            {item.logo ||
                            item.patches ||
                            item.embroider ||
                            item.security_batches ||
                            item.security_id_on_back ||
                            item.printed_id ? (
                              <h4>Customization Detail</h4>
                            ) : null}
                            {/* End of code - Ashlekh on 20-02-2025
                          Reason - To add customization */}
                            {item.logo ? (
                              <p>Logo : ${item.logo_price}</p>
                            ) : null}
                            {item.patches ? (
                              <p>Patches / Batches : ${item.patches_price}</p>
                            ) : null}
                            {item.embroider ? (
                              <p>Embroider / Name : ${item.embroider_price}</p>
                            ) : null}
                            {item.security_batches ? (
                              <p>
                                Security id : ${item.security_batches_price}
                              </p>
                            ) : null}
                            {/* Added by - Ashlekh on 20-02-2025
                                Reason - To add customization */}
                            {item.security_id_on_back ? (
                              <p>
                                Security ID on Back : $
                                {item.security_id_on_back_price}
                              </p>
                            ) : null}
                            {item.printed_id ? (
                              <p>Print ID : ${item.printed_id_price}</p>
                            ) : null}
                            {/* End of code - Ashlekh on 20-02-2025
                                Reason - To add customization */}
                          </div>
                          {/**End of code addition by Unnati on 27-12-2024
                           *Reason-Added customisation */}
                        </div>
                      </div>
                    );
                  })}
                  {/**End of code addition by Unnati on 27-12-2024
                   *Reason-To show returned items */}
                  {/**Code modified by Unnati on 22-12-24
                   *Reason-Used sold item instead of order details */}
                  {/* {orderDetail.map((item) => { */}
                  {/**End of code addition by Unnati on 22-12-24
                   *Reason-Used sold item instead of order details */}
                  {soldItems.map((item) => {
                    /**
                     * Added by - Ashish Dewangan on 23-11-2024
                     * Reason - To count how many days have passed since the order
                     */
                    /**
                     * Modified by - Ashish Dewangan on 24-11-2024
                     * Reason - To count days after delivery rather than count from order date
                     */
                    // var elapsedDate = (new Date() - new Date(item.delivery_date)) / (1000 * 60 * 60 * 24)
                    // var max_return_days = settings.max_return_days ? settings.max_return_days : 30
                    if (item.delivery_date != null) {
                      var elapsedDate =
                        (new Date() - new Date(item.delivery_date)) /
                        (1000 * 60 * 60 * 24);
                      var max_return_days = settings.max_return_days
                        ? settings.max_return_days
                        : 30;
                      /**Code added by Unnati on 29-11-2024
                       *Reason-Added max exchange days */
                      var max_exchange_days = settings.max_exchange_days
                        ? settings.max_exchange_days
                        : 30;
                      /**End of code addition by Unnati on 29-11-2024
                       *Reason-Added max exchange days */
                    }
                    /**
                     * End of modification by - Ashish Dewangan on 24-11-2024
                     * Reason - To count days after delivery rather than count from order date
                     */
                    /**Code adde by Unnati on 20-12-2024
                     *reason-To filter items with parent it same as row id */
                    var filteredItems = exchangedItems.filter(
                      (i) => i.parent_id == item.id
                    );
                    /**Code added by Unnati on 27-12-2024
                     *Reason-To hide cancel button when cancellation is done*/
                    var cancelledFilteredItems = cancelledItems.filter(
                      (i) => i.parent_id == item.id
                    );
                    var showCancelButton = cancelledFilteredItems.length > 0;
                    /*End of code addition by Unnati on 27-12-2024
                     *Reason-To hide cancel button when cancellation is done*/
                    /**Code added by Unnati on 28-12-2024
                     *Reason-To hide return button when cancellation is done*/
                    var returnFilteredItems = returnedItems.filter(
                      (i) => i.parent_id == item.id
                    );
                    var showReturnButton = returnFilteredItems.length > 0;
                    /*End of code addition by Unnati on 28-12-2024
                     *Reason-To hide return button when cancellation is done*/
                    var showButton = filteredItems.length > 0;
                    /**Code adde by Unnati on 20-12-2024
                     *reason-To filter items with parent it same as row id */
                    /**
                     * End of addition by - Ashish Dewangan on 23-11-2024
                     * Reason - To count how many days have passed since the order
                     */
                    return (
                      <div className={OrderDetailStyle.orderCard} key={item.id}>
                        <div className={OrderDetailStyle.statusSection}>
                          <div className={OrderDetailStyle.status}></div>
                          {/* <div className={OrderDetailStyle.date}><span>{item.date || "N/A"}</span></div> */}
                        </div>

                        <div className={OrderDetailStyle.productSection}>
                          <div className={OrderDetailStyle.orderItemImage}>
                            {/**Code added by Unnati on 30-09-2024
                             *Reason-To add link in image section */}
                            {/* Modified by - Ashish Dewangan on 18-12-2024
                             * Reason - To show unavailable message on click */}
                            {/* {item.is_active ? (
                              <Link
                                to={`/productdetail/${
                                  item.product_id
                                    ? item.product_id
                                    : item.product
                                }`}
                                
                                state={item.color}
                            
                              >
                                <img
                                  src={`${config.baseURL}${item.product_image1}`}
                                  alt={item.product_name}
                                  className={OrderDetailStyle.productImage}
                                />
                              </Link>
                            ) : (
                              <img
                                src={`${config.baseURL}${item.product_image1}`}
                                alt={item.product_name}
                                className={OrderDetailStyle.productImage}
                              />
                            )} */}

                            <img
                              onClick={(e) => {
                                handleCheckProductAvailability(
                                  item.product_id,
                                  item.color,
                                  item.product
                                );
                              }}
                              src={`${config.baseURL}${item.product_image1}`}
                              alt={item.product_name}
                              className={OrderDetailStyle.productImage}
                            />
                            {/* End of modification by - Ashish Dewangan on 18-12-2024
                             * Reason - To show unavailable message on click */}

                            {/**End of code addition by Unnati on 30-09-2024
                             *Reason-To add link in image section */}
                          </div>

                          <div className={OrderDetailStyle.productInfo}>
                            {/**Code added by Unnati on 30-09-2024
                             *Reason-To add link in product name */}
                            {/* Modified by - Ashish Dewangan on 18-12-2024
                             * Reason - To check product availability on click */}
                            {/* <h3 className={OrderDetailStyle.productTitle}>
                              {item.is_active ? (
                                <Link
                                  to={`/productdetail/${
                                    item.product_id
                                      ? item.product_id
                                      : item.product
                                  }`}
                                  className={OrderDetailStyle.productTitle}
                                  Code added by Unnati on 11-12-2024
                                        *Reason-Send color through state 
                                  state={item.color}
                                        End of code addition by Unnati on 11-12-2024
                                        *Reason-Send color through state 
                                >
                                  {item.product_name}
                                   Addition by Om Shrivastava on 26-11-2024
                                            Reason : Add text of customized product  
                                  {item.logo ||
                                    item.patches ||
                                    item.security_batches ||
                                    item.embroider ? (
                                    <div
                                      style={{
                                        color: "#008000",
                                        fontSize: "10px",
                                      }}
                                    >
                                      Customized product
                                    </div>
                                  ) : null}
                                   End of addition by Om Shrivastava on 26-11-2024
                                            Reason : Add text of customized product  
                                </Link>
                              ) : (
                                item.product_name
                              )}
                            </h3> */}

                            <h3
                              className={OrderDetailStyle.productTitle}
                              onClick={(e) => {
                                handleCheckProductAvailability(
                                  item.product_id,
                                  item.color,
                                  item.product
                                );
                              }}
                            >
                              {item.product_name}

                              {item.logo ||
                              item.patches ||
                              item.security_batches ||
                              // Added by - Ashlekh on 20-02-2025
                              // Reason - To add customization
                              item.security_id_on_back ||
                              item.printed_id ||
                              // End of code - Ashlekh on 20-02-2025
                              // Reason - To add customization
                              item.embroider ? (
                                <div
                                  style={{
                                    color: "#008000",
                                    fontSize: "10px",
                                  }}
                                >
                                  Customized product
                                </div>
                              ) : null}
                            </h3>
                            {/* End of modification by - Ashish Dewangan on 18-12-2024
                             * Reason - To check product availability on click */}

                            {/**End of code addition by Unnati on 30-09-2024
                             *Reason-To add link in product name */}
                            {/**Code added by Unnati on 30-09-2024
                             *Reason-To add link in product description */}

                            {/**End of code addition by Unnati on 30-09-2024
                             *Reason-To add link in product description */}
                            <p className={OrderDetailStyle.productSize}>
                              Size: {item.size}
                            </p>
                            <p className={OrderDetailStyle.productSize}>
                              Quantity: {item.quantity}
                            </p>
                            {/**Code added by Unnati on 08-11-2024
                             *Reason-Added sales rate*/}
                            {item.item_status == "Cancelled" ? (
                              <p className={OrderDetailStyle.productSize}>
                                {/* -${item.sales_rate} */}
                                {/* Modification and addition by Om Shrivastava on 26-11-2024
                    Reason : Show the customization amount also  */}
                                {/* Modification and addition by Om Shrivastava on 04-12-2024
                      Reason : Show the amount  */}
                                {/* {item.sales_rate} */}
                                {/* {item.logo ||
                                    item.patches ||
                                    item.security_batches ||
                                    item.embroider ? (
                                  <>
                                    -${item.after_customization_product_price}
                                  </>
                                ) : (
                                  <>-${item.sales_rate}</>
                                )} */}
                                -{config.currency_icon}{item.after_customization_product_price}
                                {/* End of modification and addition by Om Shrivastava on 04-12-2024
                      Reason : Show the amount  */}
                                {/* End of modification and addition by Om Shrivastava on 26-11-2024
                    Reason : Show the customization amount also  */}
                              </p>
                            ) : (
                              <p className={OrderDetailStyle.productSize}>
                                {/* ${item.sales_rate} */}
                                {/* Modification and addition by Om Shrivastava on 04-12-2024
                      Reason : Show the amount  */}
                                {/* Modification and addition by Om Shrivastava on 26-11-2024
                                Reason : Show the customization amount also  */}
                                {/* {item.sales_rate} */}
                                {/* {item.logo ||
                                    item.patches ||
                                    item.security_batches ||
                                    item.embroider ? (
                                  <>${item.after_customization_product_price}</>
                                ) : (
                                  <>${item.sales_rate}</>
                                )} */}
                               {config.currency_icon}{item.after_customization_product_price}
                                {/* Emd of modification and addition by Om Shrivastava on 04-12-2024
                                  Reason : Show the amount  */}
                                {/* End of modification and addition by Om Shrivastava on 26-11-2024
                                Reason : Show the customization amount also  */}
                              </p>
                            )}
                            {/**End of code addition by Unnati on 08-11-2024
                             *Reason-Added sales rate*/}
                            {/**Code added by Unnati on 30-09-2024
                             *Reason-To display item status */}
                            {/* Commented by jhamman on 24-10-2024
                       Reason - Temporily removed this for now*/}
                            {/* <p className={OrderDetailStyle.productSize}>
                        Item Status: {item.item_status}
                      </p> */}
                            {/* End of commentation by jhamman on 24-10-2024
                       Reason - Temporily removed this for noe*/}
                            {/**Code added by Unnati on 26-10-2024
                             *Reason-Added classname */}

                            {/* Modified by - Ashish Dewangan on 18-12-2024
                             * Reason - To show product not available message differently */}
                            {/* <p className={OrderDetailStyle.notAvailableMessage}>
                              {item.is_active
                                ? ""
                                : "This product is not available"}
                            </p> */}

                            <p className={OrderDetailStyle.notAvailableMessage}>
                              {item.product_id ==
                                unavailableProduct.productId &&
                              item.color == unavailableProduct.color
                                ? "This product is not available"
                                : ""}
                            </p>
                            {/* End of modification by - Ashish Dewangan on 18-12-2024
                             * Reason - To show product not available message differently */}

                            {/**Code added by Unnati on 11-11-2024
                             *Reason-Added message for cancellation by Admin */}
                            {item.cancelled_by == "Admin" &&
                            // Added by - Ashlekh on 13-12-2024
                            // Reason - To apply item_status condition
                            item.item_status == "Cancelled" ? (
                              // End of code - Ashlekh on 13-12-2024
                              // Reason - To apply item_status condition
                              <p className={OrderDetailStyle.cancelled}>
                                Order cancelled by Admin
                              </p>
                            ) : null}
                            {/**End of code addition by Unnati on 11-11-2024
                             *Reason-Added message for cancellation by Admin */}
                            {/**Code added by Unnati on 06-11-2024
                             *Reason-Added cancel button */}
                            {/**Code added by Unnati on 11-11-2024
                             *Reason-Added message for cancellation by Admin */}
                            {/* Commented by - Ashlekh on 13-12-2024
                             Reason - Cancelled message was displayed two times */}
                            {/* {item.cancelled_by !== "Admin" &&
                            item.item_status === "Cancelled" ? (
                              <p className={OrderDetailStyle.cancelled}>
                                Cancelled
                              </p>
                            ) : null} */}
                            {/* End of code - Ashlekh on 13-12-2024
                            Reason - Cancelled message was displayed two times */}
                            {/**End of code addition by Unnati on 11-11-2024
                             *Reason-Added message for cancellation by Admin */}
                            {item.product_is_cancellable &&
                            item.item_status === "Cancelled" ? (
                              <>
                                {/*Code commented by Unnati on 11-11-2024
                        *Reason-This code is not in use}
                          {/* <p className={OrderDetailStyle.cancelled}>
                            Cancelled
                          </p> */}
                                {/*End of code comment by Unnati on 11-11-2024
                                 *Reason-This code is not in use*/}

                                {item.cancel_reason && (
                                  <p
                                    className={
                                      OrderDetailStyle.cancellationReason
                                    }
                                  >
                                    Reason: {item.cancel_reason}
                                  </p>
                                )}
                              </>
                            ) : null}

                            {/* Added by - Ashish Dewangan on 25-11-2024
                             * Reason - TO show shipped and delivered status */}
                            {/* Code changed by - Ashlekh on 12-12-2024
                            Reason - To display all item status */}
                            {/* {"Shipped" == item.item_status ? (
                              <p className={OrderDetailStyle.greenStatus}>
                                Shipped
                              </p>
                            ) : null}

                            {"Delivered" == item.item_status ? (
                              <p className={OrderDetailStyle.greenStatus}>
                                Delivered
                              </p>
                            ) : null} */}
                            {item.item_status != "" && (
                              <p className={`${OrderDetailStyle.greenStatus}`}>
                                {item.item_status}
                              </p>
                            )}

                            {/* End of code - Ashlekh on 12-12-2024
                            Reason - To display all item status */}
                            {/* End of addition by - Ashish Dewangan on 25-11-2024
                             * Reason - TO show shipped and delivered status */}

                            {/* Added by - Ashish Dewangan on 24-11-2024
                             * Reason - To show return status and reason */}
                            {item.returned_by == "Admin" &&
                            [
                              "Return Initiated",
                              "Return Approved",
                              "Return Rejected",
                              "Parcel Pickup Initiated for Return",
                              "Parcel Picked Up for Return",
                              "Returned",
                            ].includes(item.item_status) ? (
                              <p className={OrderDetailStyle.cancelled}>
                                Item Return Initiated by Admin
                              </p>
                            ) : null}

                            {item.returned_by != "None" &&
                              [
                                "Return Initiated",
                                "Return Approved",
                                "Return Rejected",
                                "Parcel Pickup Initiated for Return",
                                "Parcel Picked Up for Return",
                                "Returned",
                              ].includes(item.item_status) && (
                                <p className={OrderDetailStyle.orangeStatus}>
                                  {item.item_status}
                                </p>
                              )}

                            {item.returned_by != "None" &&
                            [
                              "Parcel Pickup Initiated for Return",
                              "Parcel Picked Up for Return",
                            ].includes(item.item_status) &&
                            item.return_pickup_date != null ? (
                              <>
                                <p
                                  className={
                                    OrderDetailStyle.cancellationReason
                                  }
                                >
                                  Pickup date :{" "}
                                  {formatDateToMMDDYYYY(
                                    item.return_pickup_date
                                  )}
                                </p>
                              </>
                            ) : null}

                            {item.returned_by != "None" &&
                            [
                              "Return Initiated",
                              "Return Approved",
                              "Return Rejected",
                              "Parcel Pickup Initiated for Return",
                              "Parcel Picked Up for Return",
                              "Returned",
                            ].includes(item.item_status) &&
                            item.return_reason != null &&
                            item.return_reason?.trim()?.length > 0 ? (
                              <>
                                <p
                                  className={
                                    OrderDetailStyle.cancellationReason
                                  }
                                >
                                  Reason for Return : {item.return_reason}
                                </p>
                              </>
                            ) : null}

                            {item.returned_by != "None" &&
                            [
                              "Return Initiated",
                              "Return Approved",
                              "Return Rejected",
                              "Parcel Pickup Initiated for Return",
                              "Parcel Picked Up for Return",
                              "Returned",
                            ].includes(item.item_status) &&
                            item.return_approval_reason != null &&
                            item.return_approval_reason?.trim()?.length > 0 ? (
                              <>
                                <p
                                  className={
                                    OrderDetailStyle.cancellationReason
                                  }
                                >
                                  Return Approval Reason :{" "}
                                  {item.return_approval_reason}
                                </p>
                              </>
                            ) : null}

                            {item.returned_by != "None" &&
                            item.return_rejection_reason != null &&
                            item.return_rejection_reason?.trim()?.length > 0 ? (
                              <>
                                <p
                                  className={
                                    OrderDetailStyle.cancellationReason
                                  }
                                >
                                  Return Rejection Reason :{" "}
                                  {item.return_rejection_reason}
                                </p>
                              </>
                            ) : null}

                            {item.returned_by != "None" &&
                            [
                              "Return Initiated",
                              "Return Approved",
                              "Return Rejected",
                              "Parcel Pickup Initiated for Return",
                              "Parcel Picked Up for Return",
                              "Returned",
                            ].includes(item.item_status) &&
                            item.return_authorization_no != null &&
                            item.return_authorization_no?.trim()?.length > 0 ? (
                              <>
                                <p
                                  className={
                                    OrderDetailStyle.cancellationReason
                                  }
                                >
                                  Return Authorization Number :{" "}
                                  {item.return_authorization_no}
                                </p>
                              </>
                            ) : null}

                            {/* End of addition by - Ashish Dewangan on 24-11-2024
                             * Reason - To show return status and reason */}

                            {/* Added by - Ashish Dewangan on 24-11-2024
                             * Reason - To show refund status and transaction id */}

                            {/* {["Refund Initiated", "Refunded"].includes(
                              item.item_status
                            ) && (
                              <p className={OrderDetailStyle.greenStatus}>
                                {item.item_status}
                              </p>
                            )} */}
                            {/**Code added by Unnati on 08-12-2024
                             *Reason-To show message if item status is refund initiated */}
                            {item.item_status == "Refund Initiated" ? (
                              <p
                                className={OrderDetailStyle.cancellationReason}
                                style={{
                                  letterSpacing: ".3px",
                                  fontWeight: 500,
                                }}
                              >
                                Amount will be refunded to account within 7-10
                                business days
                              </p>
                            ) : null}
                            {/**End of code addition by Unnati on 08-12-2024
                             *Reason-To show message if item status is refund initiated */}
                            {item.item_status == "Refunded" &&
                            item.refund_transaction_id != null &&
                            item.refund_transaction_id?.trim()?.length > 0 ? (
                              <p
                                className={OrderDetailStyle.cancellationReason}
                              >
                                Return Transaction ID :{" "}
                                {item.refund_transaction_id}
                              </p>
                            ) : null}

                            {/* End of addition by - Ashish Dewangan on 24-11-2024
                             * Reason - To show refund status and reason and transaction id */}

                            {/* Added by - Ashish Dewangan on 25-11-2024
                             * Reason - To courier service provider name */}
                            {/* Modified by - Ashish Dewangan on 30-11-2024
                             * Reason - added more condition for displaying this field */}
                            {/* {item.courier_service_provider_name != null && */}
                            {item.item_status != "Returned" &&
                            item.courier_service_provider_name != null &&
                            /* End of modification by - Ashish Dewangan on 30-11-2024
                             * Reason - added more condition for displaying this field */
                            item.courier_service_provider_name?.trim()?.length >
                              0 ? (
                              <>
                                <p
                                  className={
                                    OrderDetailStyle.cancellationReason
                                  }
                                >
                                  Courier Service Provider Name :{" "}
                                  {item.courier_service_provider_name}
                                </p>
                              </>
                            ) : null}
                            {/* End of addition by - Ashish Dewangan on 25-11-2024
                             * Reason - To courier service provider name */}

                            {/* Added by - Ashish Dewangan on 25-11-2024
                             * Reason - To show tracking id */}
                            {/* {item.tracking_id != null && */}
                            {/* Modified by - Ashish Dewangan on 30-11-2024
                             * Reason - added more condition for displaying this field */}
                            {item.item_status != "Returned" &&
                            item.tracking_id != null &&
                            /* Modified by - Ashish Dewangan on 30-11-2024
                             * Reason - added more condition for displaying this field */
                            item.tracking_id?.trim()?.length > 0 ? (
                              <>
                                <p
                                  className={
                                    OrderDetailStyle.cancellationReason
                                  }
                                >
                                  Return Tracking ID : {item.tracking_id}
                                </p>
                              </>
                            ) : null}
                            {/* End of addition by - Ashish Dewangan on 25-11-2024
                             * Reason - To show tracking id */}

                            {/* Added by - Unnati Bajaj on 29-11-2024
                             * Reason - To show exchange status and reason */}

                            {[
                              "Exchange Initiated",
                              "Exchange Approved",
                              "Exchange Rejected",
                              "Parcel Pickup Initiated for Exchange",
                              "Parcel Picked Up for Exchange",
                              "Exchanged",
                            ].includes(item.item_status) && (
                              <p className={OrderDetailStyle.orangeStatus}>
                                {item.item_status}
                              </p>
                            )}

                            {[
                              "Parcel Pickup Initiated for Exchange",
                              "Parcel Picked Up for Exchange",
                            ].includes(item.item_status) &&
                            item.exchange_pickup_date != null ? (
                              <>
                                <p
                                  className={
                                    OrderDetailStyle.cancellationReason
                                  }
                                >
                                  Pickup date :{" "}
                                  {formatDateToMMDDYYYY(
                                    item.exchange_pickup_date
                                  )}
                                </p>
                              </>
                            ) : null}

                            {[
                              "Exchange Initiated",
                              "Exchange Approved",
                              "Exchange Rejected",
                              "Parcel Pickup Initiated for Exchange",
                              "Parcel Picked Up for Exchange",
                              "Exchanged",
                            ].includes(item.item_status) &&
                            item.exchange_reason != null &&
                            item.exchange_reason?.trim()?.length > 0 ? (
                              <>
                                <p
                                  className={
                                    OrderDetailStyle.cancellationReason
                                  }
                                >
                                  Reason for Exchange : {item.exchange_reason}
                                </p>
                              </>
                            ) : null}

                            {[
                              "Exchange Initiated",
                              "Exchange Approved",
                              "Exchange Rejected",
                              "Parcel Pickup Initiated for Exchange",
                              "Parcel Picked Up for Exchange",
                              "Exchanged",
                            ].includes(item.item_status) &&
                            item.exchange_id != null &&
                            item.exchange_id?.trim()?.length > 0 ? (
                              <>
                                <p
                                  className={
                                    OrderDetailStyle.cancellationReason
                                  }
                                >
                                  Exchange ID : {item.exchange_id}
                                </p>
                              </>
                            ) : null}

                            {/* End of addition by - Ashish Dewangan on 24-11-2024
                             * Reason - To show return status and reason */}
                            {item.product_is_exchangeable &&
                            item.item_status === "Delivered" &&
                            item.delivery_date !== null &&
                            elapsedDate <= max_exchange_days &&
                            // Added by - Ashlekh on 20-02-2025
                            // Reason - To add customization
                            // !(item.logo || item.patches || item.security_batches || item.embroider) &&
                            !(
                              item.logo ||
                              item.patches ||
                              item.security_batches ||
                              item.embroider ||
                              item.security_id_on_back ||
                              item.printed_id
                            ) &&
                            // End of code - Ashlekh on 20-02-2025
                            // Reason - To add customization
                            !showButton &&
                            /**Code added by Unnati on 28-12-2024
                             *Reason-Added condition to show return button */
                            !showReturnButton ? (
                              /**End of code addition by Unnati on 28-12-2024
                               *Reason-Added condition to show return button */
                              <button
                                className={OrderDetailStyle.cancelButton}
                                onClick={() => handleExchangeModal(item.id)}
                              >
                                Exchange
                              </button>
                            ) : null}

                            <div className={OrderDetailStyle.buttons}>
                              {item.product_is_cancellable &&
                              /**
                               * Modified by - Ashish Dewangan on 24-11-2024
                               * Reason - To show cancel button only when status is pending or shipped
                               */
                              // item.item_status !== "Cancelled" &&
                              // Code changed by - Ashlekh on 13-12-2024
                              // Reason - To change condition (item_status)
                              // (item.item_status == "Pending" ||
                              (item.item_status == "Order Placed" ||
                                // End of code - Ashlekh on 13-12-2024
                                // Reason - To change condition (item_status)
                                item.item_status == "Shipped") &&
                              /**
                               * End of modification by - Ashish Dewangan on 24-11-2024
                               * Reason - To show cancel button only when status is pending or shipped
                               */

                              /**Code added by Unnati on 11-11-2024
                               *Reason-Added condition
                               */ item.cancelled_by == "None" &&
                              /**
                               * Added by - Ashlekh on 13-12-2024
                               * Reason - To hide cancel button if customization is not selected
                               */
                              //  Added by - Ashlekh on 20-02-2025
                              // Reason - To add customization
                              //  && !(item.logo == true || item.patches == true || item.security_batches == true || item.embroider == true)
                              !(
                                item.logo == true ||
                                item.patches == true ||
                                item.security_batches == true ||
                                item.embroider == true ||
                                item.security_id_on_back == true ||
                                item.printed_id == true
                              ) &&
                              // End of code - Ashlekh on 20-02-2025
                              // Reason - To add customization
                              /**Code added by Unnat on 27-12-2024
                               *Reason-To show cancel button */
                              !showCancelButton ? (
                                /**End of code addition by Unnat on 27-12-2024
                                 *Reason-To show cancel button */
                                /**
                                 * End of code - Ashlekh on 13-12-2024
                                 * Reason - To hide cancel button if customization is not selected
                                 */
                                /*End of code addition by Unnati on 11-11-2024
                                 *Reason-Added condition
                                 */ <button
                                  className={OrderDetailStyle.cancelButton}
                                  /**Code added by Unnati on 11-11-2024
                                   *Reason-Added handle cancel modal */
                                  onClick={() => handleCancelModal(item.id)}
                                  /**End of code addition by Unnati on 11-11-2024
                                   *Reason-Added handle cancel modal */
                                >
                                  Cancel
                                </button>
                              ) : null}

                              {/**End of code addition by Unnati on 06-11-2024
                               *Reason-Added cancel button */}
                              {/**End of code addition by Unnati on 26-10-2024
                               *Reason-Added classname */}
                              {/**End of code addition by Unnati on 30-09-2024
                               *Reason-To display item status */}
                              {/*Code added by Unnati on 16-11-2024
                               *Reason-Added return button */}
                              {
                                /**
                                 * Modified by - Ashish Dewangan on 24-11-2024
                                 * Reason - To show return button only if status is delivered,
                                 * item is returnable and 30 days are not passed since the delivery
                                 */
                                // item.product_is_returnable &&
                                // ![
                                //   "Return Initiated",
                                //   "Cancelled",
                                //   "Returned",
                                //   "Refunded",
                                // ].includes(item.item_status)
                                item.product_is_returnable &&
                                item.item_status == "Delivered" &&
                                /**
                                 * End of modification by - Ashish Dewangan on 24-11-2024
                                 * Reason - To show return button only if status is delivered,
                                 * item is returnable and 30 days are not passed since the delivery
                                 */
                                /**
                                 * Added by - Ashish Dewangan on 24-11-2024
                                 * Reason - Added extra condition to check if return time is elapsed or not
                                 */
                                item.delivery_date != null &&
                                /**Code added by Unnati on 28-12-2024
                                 *Reason-Added condition to show return button */
                                elapsedDate <= max_return_days &&
                                // Added by - Ashlekh on 20-02-2025
                                // Reason - To add customization
                                // !(item.logo || item.patches || item.security_batches || item.embroider) &&
                                !(
                                  item.logo ||
                                  item.patches ||
                                  item.security_batches ||
                                  item.embroider ||
                                  item.security_id_on_back ||
                                  item.printed_id
                                ) &&
                                // End of code - Ashlekh on 20-02-2025
                                // Reason - To add customization
                                !showButton &&
                                !showReturnButton ? (
                                  /**End of code addition by Unnati on 28-12-2024
                                   *Reason-Added condition to show return button */
                                  /**
                                   * End of addition by - Ashish Dewangan on 24-11-2024
                                   * Reason - Added extra condition to check if return time is elapsed or not
                                   */

                                  /**
                                   * Modified by - Ashish Dewangan on 29-11-2024
                                   * Reason - To show return note
                                   */
                                  // <button
                                  // style={{margin:"5px 5px 5px 0px"}}
                                  //   className={OrderDetailStyle.cancelButton}
                                  //   onClick={() => handleReturnModal(item.id)}
                                  // >
                                  //   Return
                                  // </button>

                                  <div>
                                    <button
                                      style={{ margin: "5px 5px 5px 0px" }}
                                      className={OrderDetailStyle.cancelButton}
                                      onClick={() => handleReturnModal(item.id)}
                                    >
                                      Return
                                    </button>
                                    <p
                                      className={
                                        OrderDetailStyle.cancellationReason
                                      }
                                      style={{
                                        letterSpacing: ".3px",
                                        fontWeight: 500,
                                      }}
                                    >
                                      Return conditions - To be eligible for a
                                      return, the item must be in its original
                                      condition, with tags and packaging intact.
                                      The item should not have been used and
                                      must be returned within{" "}
                                      {max_return_days ? max_return_days : 30}{" "}
                                      days after the delivery.
                                    </p>
                                  </div>
                                ) : /**
                                 * End of modification by - Ashish Dewangan on 29-11-2024
                                 * Reason - To show return note
                                 */
                                null
                              }
                              {/**End of code comment by Unnati on 16-11-2024
                               *Reason-Added return button */}
                            </div>

                            {/**Code added by Unnati on 11-11-2024
                             *Reason-To check for item id */}
                            {/**Code modified by Unnati on 18-11-2024
                             *Reason-Added modification */}
                            {showCancelModal && itemToCancel === item.id && (
                              <>
                                <div
                                  className={OrderDetailStyle.modalOverlay}
                                  onClick={() => setShowCancelModal(false)}
                                />
                                <div className={OrderDetailStyle.cancelModal}>
                                  {/**Code modified by Unnati on 26-12-2024
                                   *Reason-Added item in handlecancelbutton parameter */}
                                  <form
                                    onSubmit={(e) =>
                                      handleCancelButton(
                                        e,
                                        item.id,
                                        item.order,
                                        item
                                      )
                                    }
                                  >
                                    {/**End of code modification by Unnati on 26-12-2024
                                     *Reason-Added item in handlecancelbutton parameter */}
                                    <h3 className={OrderDetailStyle.modalTitle}>
                                      Cancel Order
                                    </h3>

                                    <div
                                      className={OrderDetailStyle.reasonList}
                                    >
                                      <label
                                        className={OrderDetailStyle.reason}
                                      >
                                        <input
                                          type="radio"
                                          value="Wrong Product Ordered"
                                          checked={
                                            selectedReason ===
                                            "Wrong Product Ordered"
                                          }
                                          onChange={(e) =>
                                            setSelectedReason(e.target.value)
                                          }
                                        />
                                        Wrong Product Ordered
                                      </label>

                                      <label
                                        className={OrderDetailStyle.reason}
                                      >
                                        <input
                                          type="radio"
                                          value="Found Cheaper Elsewhere"
                                          checked={
                                            selectedReason ===
                                            "Found Cheaper Elsewhere"
                                          }
                                          onChange={(e) =>
                                            setSelectedReason(e.target.value)
                                          }
                                        />
                                        Found Cheaper Elsewhere
                                      </label>

                                      <label
                                        className={OrderDetailStyle.reason}
                                      >
                                        <input
                                          type="radio"
                                          value="Change of Mind"
                                          checked={
                                            selectedReason === "Change of Mind"
                                          }
                                          onChange={(e) =>
                                            setSelectedReason(e.target.value)
                                          }
                                        />
                                        Change of Mind
                                      </label>

                                      <label
                                        className={OrderDetailStyle.reason}
                                      >
                                        <input
                                          type="radio"
                                          value="Long delivery time"
                                          checked={
                                            selectedReason ===
                                            "Long delivery time"
                                          }
                                          onChange={(e) =>
                                            setSelectedReason(e.target.value)
                                          }
                                        />
                                        Long delivery time
                                      </label>

                                      <label
                                        className={OrderDetailStyle.reason}
                                      >
                                        <input
                                          type="radio"
                                          value="Other"
                                          checked={selectedReason === "Other"}
                                          onChange={(e) =>
                                            setSelectedReason(e.target.value)
                                          }
                                        />
                                        Other
                                      </label>
                                    </div>
                                    {selectedReason === "Other" && (
                                      <textarea
                                        placeholder="Please specify your reason (optional)"
                                        value={otherReason}
                                        onChange={(e) =>
                                          setOtherReason(e.target.value)
                                        }
                                        className={OrderDetailStyle.textArea}
                                      />
                                    )}
                                    {/**Code added by Unnati on 30-12-2024
                                     *Reason-Added other reason error message */}
                                    {cancelReasonError && (
                                      <div
                                        className={
                                          OrderDetailStyle.errorMessage
                                        }
                                      >
                                        {cancelReasonError}
                                      </div>
                                    )}
                                    {/**End of code addition by Unnati on 30-12-2024
                                     *Reason-Added other reason error message */}

                                    <div
                                      className={
                                        OrderDetailStyle.buttonContainer
                                      }
                                    >
                                      <button
                                        type="submit"
                                        className={
                                          OrderDetailStyle.submitButton
                                        }
                                      >
                                        Confirm Cancellation
                                      </button>
                                      <button
                                        type="button"
                                        className={
                                          OrderDetailStyle.cancelModalButton
                                        }
                                        onClick={() => {
                                          setShowCancelModal(false);
                                          setOtherReason("");
                                          // Added by - Ashlekh on 11-03-2025
                                          // Reason - To empty cancel error message
                                          setCancelReasonError("");
                                          // End of code - Ashlekh on 11-03-2025
                                          // Reason - To empty cancel error message
                                        }}
                                      >
                                        Close
                                      </button>
                                    </div>
                                  </form>
                                </div>
                              </>
                            )}

                            {/*End of code addition by Unnati on 18-11-2024
                             *Reason-Added modification */}

                            {/* Added by - Ashish Dewangan on 23-11-2024
                             * Reason - To show return modal with return reason option */}
                            {showReturnModal && itemToReturn === item.id && (
                              <>
                                <div
                                  className={OrderDetailStyle.modalOverlay}
                                  onClick={() => setShowReturnModal(false)}
                                />
                                <div className={OrderDetailStyle.cancelModal}>
                                  <form
                                    onSubmit={
                                      (e) =>
                                        /**Code modified by Unnati on 27-12-2024
                                         *Reason-Added item */
                                        handleReturnButton(
                                          e,
                                          item.id,
                                          item.order,
                                          item
                                        )
                                      /**End of code modification by Unnati on 27-12-2024
                                       *Reason-Added item */
                                    }
                                  >
                                    <h3 className={OrderDetailStyle.modalTitle}>
                                      Return Order
                                    </h3>

                                    <div
                                      className={OrderDetailStyle.reasonList}
                                    >
                                      <label
                                        className={OrderDetailStyle.reason}
                                      >
                                        <input
                                          type="radio"
                                          // value="Item arrived damaged"
                                          value="Defective"
                                          checked={
                                            // selectedReturnReason ===
                                            // "Item arrived damaged"
                                            selectedReturnReason === "Defective"
                                          }
                                          onChange={(e) =>
                                            setSelectedReturnReason(
                                              e.target.value
                                            )
                                          }
                                        />
                                        {/* Item arrived damaged */}
                                        Defective
                                      </label>

                                      <label
                                        className={OrderDetailStyle.reason}
                                      >
                                        <input
                                          type="radio"
                                          value="Item does not match the description"
                                          checked={
                                            selectedReturnReason ===
                                            "Item does not match the description"
                                          }
                                          onChange={(e) =>
                                            setSelectedReturnReason(
                                              e.target.value
                                            )
                                          }
                                        />
                                        Item does not match the description
                                      </label>

                                      <label
                                        className={OrderDetailStyle.reason}
                                      >
                                        <input
                                          type="radio"
                                          value="Wrong product received"
                                          checked={
                                            selectedReturnReason ===
                                            "Wrong product received"
                                          }
                                          onChange={(e) =>
                                            setSelectedReturnReason(
                                              e.target.value
                                            )
                                          }
                                        />
                                        Wrong product received
                                      </label>

                                      <label
                                        className={OrderDetailStyle.reason}
                                      >
                                        <input
                                          type="radio"
                                          value="No longer needed"
                                          checked={
                                            selectedReturnReason ===
                                            "No longer needed"
                                          }
                                          onChange={(e) =>
                                            setSelectedReturnReason(
                                              e.target.value
                                            )
                                          }
                                        />
                                        No longer needed
                                      </label>

                                      <label
                                        className={OrderDetailStyle.reason}
                                      >
                                        <input
                                          type="radio"
                                          value="Order arrived too late"
                                          checked={
                                            selectedReturnReason ===
                                            "Order arrived too late"
                                          }
                                          onChange={(e) =>
                                            setSelectedReturnReason(
                                              e.target.value
                                            )
                                          }
                                        />
                                        Order arrived too late
                                      </label>

                                      <label
                                        className={OrderDetailStyle.reason}
                                      >
                                        <input
                                          type="radio"
                                          value="Wardrobing"
                                          checked={
                                            selectedReturnReason ===
                                            "Wardrobing"
                                          }
                                          onChange={(e) =>
                                            setSelectedReturnReason(
                                              e.target.value
                                            )
                                          }
                                        />
                                        Wardrobing
                                      </label>

                                      <label
                                        className={OrderDetailStyle.reason}
                                      >
                                        <input
                                          type="radio"
                                          value="Changed Mind"
                                          checked={
                                            selectedReturnReason ===
                                            "Changed Mind"
                                          }
                                          onChange={(e) =>
                                            setSelectedReturnReason(
                                              e.target.value
                                            )
                                          }
                                        />
                                        Changed Mind
                                      </label>

                                      <label
                                        className={OrderDetailStyle.reason}
                                      >
                                        <input
                                          type="radio"
                                          value="Other"
                                          checked={
                                            selectedReturnReason === "Other"
                                          }
                                          onChange={(e) =>
                                            setSelectedReturnReason(
                                              e.target.value
                                            )
                                          }
                                        />
                                        Other
                                      </label>
                                    </div>
                                    {selectedReturnReason === "Other" && (
                                      <textarea
                                        placeholder="Please specify your reason (optional)"
                                        value={otherReturnReason}
                                        onChange={(e) =>
                                          setOtherReturnReason(e.target.value)
                                        }
                                        className={OrderDetailStyle.textArea}
                                      />
                                    )}
                                    {/**Code added by Unnati on 27-12-2024
                                     *Reason-Added other reason error message */}
                                    {returnReasonError && (
                                      <div
                                        className={
                                          OrderDetailStyle.errorMessage
                                        }
                                      >
                                        {returnReasonError}
                                      </div>
                                    )}
                                    {/**End of code addition by Unnati on 27-12-2024
                                     *Reason-Added other reason error message */}
                                    {/* Added by - Ashish Dewangan on 24-11-2024
                                     * Reason - added input boxes to select images of the item that user is returning */}
                                    <div
                                      className={
                                        OrderDetailStyle.itemImagesContainer
                                      }
                                    >
                                      <label
                                        className={OrderDetailStyle.reason}
                                      >
                                        {" "}
                                        Item images (optional)
                                      </label>

                                      <input
                                        type="file"
                                        name="itemImage1"
                                        onChange={(e) =>
                                          setItemImage1(e.target.files[0])
                                        }
                                      ></input>
                                      <input
                                        type="file"
                                        name="itemImage2"
                                        onChange={(e) =>
                                          setItemImage2(e.target.files[0])
                                        }
                                      ></input>
                                    </div>
                                    {/* End of addition by - Ashish Dewangan on 24-11-2024
                                     * Reason - added input boxes to select images of the item that user is returning */}

                                    <div
                                      className={
                                        OrderDetailStyle.buttonContainer
                                      }
                                    >
                                      <button
                                        type="submit"
                                        className={
                                          OrderDetailStyle.submitButton
                                        }
                                      >
                                        Confirm Return
                                      </button>
                                      <button
                                        type="button"
                                        className={
                                          OrderDetailStyle.cancelModalButton
                                        }
                                        onClick={() => {
                                          setShowReturnModal(false);
                                          setOtherReturnReason("");
                                        }}
                                      >
                                        Close
                                      </button>
                                    </div>
                                  </form>
                                </div>
                              </>
                            )}
                            {/* End of addition by - Ashish Dewangan on 23-11-2024
                             * Reason - To show return modal with return reason option */}

                            {/* Added by - Ashish Dewangan on 24-11-2024
                             * Reason - To show contact modal after return is requested */}
                            {showContactPopupAfterReturn && (
                              <>
                                <div
                                  className={OrderDetailStyle.modalOverlay}
                                  onClick={() =>
                                    setShowContactPopupAfterReturn(false)
                                  }
                                />
                                <div className={OrderDetailStyle.cancelModal}>
                                  <div>
                                    <h3 className={OrderDetailStyle.modalTitle}>
                                      Contact Us
                                    </h3>
                                    <div
                                      className={
                                        OrderDetailStyle.itemImagesContainer
                                      }
                                    >
                                      <div className={OrderDetailStyle.reason}>
                                        Please call on our contact number or
                                        email us to complete the return process.
                                        Note : It is mandatory to call to
                                        complete the return process.
                                      </div>
                                      <div>
                                        <span
                                          className={OrderDetailStyle.reason}
                                        >
                                          {settings.contact_number
                                            ? ` Contact Number : ${settings.contact_number}`
                                            : ""}{" "}
                                        </span>
                                        <span
                                          className={OrderDetailStyle.reason}
                                        >
                                          {settings.email
                                            ? ` Email : ${settings.email}`
                                            : ""}
                                        </span>
                                      </div>
                                    </div>
                                    <div
                                      className={
                                        OrderDetailStyle.buttonContainer
                                      }
                                    >
                                      <button
                                        type="button"
                                        className={
                                          OrderDetailStyle.cancelModalButton
                                        }
                                        onClick={() => {
                                          setShowContactPopupAfterReturn(false);
                                        }}
                                      >
                                        Close
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                            {/* End of addition by - Ashish Dewangan on 24-11-2024
                             * Reason - To show contact modal after return is requested */}

                            {/* Added by - Unnati Bajaj on 29-11-2024
                             * Reason - To show contact modal after exchange is requested */}
                            {showContactPopupAfterExchange && (
                              <>
                                <div
                                  className={OrderDetailStyle.modalOverlay}
                                  onClick={() =>
                                    setShowContactPopupAfterExchange(false)
                                  }
                                />
                                <div className={OrderDetailStyle.cancelModal}>
                                  <div>
                                    <h3 className={OrderDetailStyle.modalTitle}>
                                      Contact Us
                                    </h3>
                                    <div
                                      className={
                                        OrderDetailStyle.itemImagesContainer
                                      }
                                    >
                                      <div className={OrderDetailStyle.reason}>
                                        Please call on our contact number or
                                        email us to complete the exchange
                                        process. Note : It is mandatory to call
                                        to complete the return process.
                                      </div>
                                      <div>
                                        <span
                                          className={OrderDetailStyle.reason}
                                        >
                                          {settings.contact_number
                                            ? ` Contact Number : ${settings.contact_number}`
                                            : ""}{" "}
                                        </span>
                                        <span
                                          className={OrderDetailStyle.reason}
                                        >
                                          {settings.email
                                            ? ` Email : ${settings.email}`
                                            : ""}
                                        </span>
                                      </div>
                                    </div>
                                    <div
                                      className={
                                        OrderDetailStyle.buttonContainer
                                      }
                                    >
                                      <button
                                        type="button"
                                        className={
                                          OrderDetailStyle.cancelModalButton
                                        }
                                        onClick={() => {
                                          setShowContactPopupAfterExchange(
                                            false
                                          );
                                        }}
                                      >
                                        Close
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                            {/* End of addition by - Unnati on 29-11-2024
                             * Reason - To show contact modal after exchange is requested */}
                            {/* Added by - Unnati Bajaj on 29-11-2024
                             * Reason - To show exchange modal with exchange reason option */}
                            {showExchangeModal &&
                              itemToExchange === item.id && (
                                <>
                                  <div
                                    className={OrderDetailStyle.modalOverlay}
                                    onClick={() => setShowExchangeModal(false)}
                                  />

                                  <div
                                    className={OrderDetailStyle.exchangeModal}
                                  >
                                    <form
                                      onSubmit={(e) =>
                                        handleExchangeButton(
                                          e,
                                          item.id,
                                          item.order,
                                          selectedColor,
                                          item.quantity,
                                          item
                                        )
                                      }
                                    >
                                      <h3
                                        className={OrderDetailStyle.modalTitle}
                                      >
                                        Exchange Order
                                      </h3>

                                      <div
                                        className={OrderDetailStyle.reasonList}
                                      >
                                        <label
                                          className={OrderDetailStyle.reason}
                                        >
                                          <input
                                            type="radio"
                                            value="Wrong Size"
                                            checked={
                                              selectedExchangeReason ===
                                              "Wrong Size"
                                            }
                                            onChange={(e) => {
                                              setSelectedExchangeReason(
                                                e.target.value
                                              );
                                              /**Code added by unnati on 28-12-2024
                                               *Reason-To store selected reason in local storage and clear validation message */
                                              setExchangeReasonError("");
                                              localStorage.setItem(
                                                "selectedExchangeReason",
                                                e.target.value
                                              );
                                              /**End of code addition by unnati on 28-12-2024
                                               *Reason-To store selected reason in local storage and clear validation message */
                                            }}
                                          />
                                          Wrong Size
                                        </label>

                                        <label
                                          className={OrderDetailStyle.reason}
                                        >
                                          <input
                                            type="radio"
                                            value="Color Mismatch"
                                            checked={
                                              selectedExchangeReason ===
                                              "Color Mismatch"
                                            }
                                            onChange={(e) => {
                                              setSelectedExchangeReason(
                                                e.target.value
                                              );
                                              /**Code added by unnati on 28-12-2024
                                               *Reason-To store selected reason in local storage and clear validation message */
                                              setExchangeReasonError("");
                                              localStorage.setItem(
                                                "selectedExchangeReason",
                                                e.target.value
                                              );
                                              /**End of code addition by unnati on 28-12-2024
                                               *Reason-To store selected reason in local storage and clear validation message */
                                            }}
                                          />
                                          Color Mismatch
                                        </label>

                                        <label
                                          className={OrderDetailStyle.reason}
                                        >
                                          <input
                                            type="radio"
                                            value="Defective or Damaged Item"
                                            checked={
                                              selectedExchangeReason ===
                                              "Defective or Damaged Item"
                                            }
                                            onChange={(e) => {
                                              setSelectedExchangeReason(
                                                e.target.value
                                              );
                                              /**Code added by unnati on 28-12-2024
                                               *Reason-To store selected reason in local storage and clear validation message */
                                              setExchangeReasonError("");
                                              localStorage.setItem(
                                                "selectedExchangeReason",
                                                e.target.value
                                              );
                                              /**End of code addition by unnati on 28-12-2024
                                               *Reason-To store selected reason in local storage and clear validation message */
                                            }}
                                          />
                                          Defective or Damaged Item
                                        </label>

                                        <label
                                          className={OrderDetailStyle.reason}
                                        >
                                          <input
                                            type="radio"
                                            value="Change of Mind"
                                            checked={
                                              selectedExchangeReason ===
                                              "Change of Mind"
                                            }
                                            onChange={(e) => {
                                              setSelectedExchangeReason(
                                                e.target.value
                                              );
                                              /**Code added by unnati on 28-12-2024
                                               *Reason-To store selected reason in local storage and clear validation message */
                                              setExchangeReasonError("");
                                              localStorage.setItem(
                                                "selectedExchangeReason",
                                                e.target.value
                                              );
                                              /**End of code addition by unnati on 28-12-2024
                                               *Reason-To store selected reason in local storage and clear validation message */
                                            }}
                                          />
                                          Change of Mind
                                        </label>

                                        <label
                                          className={OrderDetailStyle.reason}
                                        >
                                          <input
                                            type="radio"
                                            value="Fit or Comfort Issues"
                                            checked={
                                              selectedExchangeReason ===
                                              "Fit or Comfort Issues"
                                            }
                                            onChange={(e) => {
                                              setSelectedExchangeReason(
                                                e.target.value
                                              );
                                              /**Code added by unnati on 28-12-2024
                                               *Reason-To store selected reason in local storage and clear validation message */
                                              setExchangeReasonError("");
                                              localStorage.setItem(
                                                "selectedExchangeReason",
                                                e.target.value
                                              );
                                              /**End of code addition by unnati on 28-12-2024
                                               *Reason-To store selected reason in local storage and clear validation message */
                                            }}
                                          />
                                          Fit or Comfort Issues
                                        </label>

                                        <label
                                          className={OrderDetailStyle.reason}
                                        >
                                          <input
                                            type="radio"
                                            value="Outfit Doesn't Match Other Items"
                                            checked={
                                              selectedExchangeReason ===
                                              "Outfit Doesn't Match Other Items"
                                            }
                                            onChange={(e) => {
                                              setSelectedExchangeReason(
                                                e.target.value
                                              );
                                              /**Code added by unnati on 28-12-2024
                                               *Reason-To store selected reason in local storage and clear validation message */
                                              setExchangeReasonError("");
                                              localStorage.setItem(
                                                "selectedExchangeReason",
                                                e.target.value
                                              );
                                              /**End of code addition by unnati on 28-12-2024
                                               *Reason-To store selected reason in local storage and clear validation message */
                                            }}
                                          />
                                          Outfit Doesn't Match Other Items
                                        </label>

                                        <label
                                          className={OrderDetailStyle.reason}
                                        >
                                          <input
                                            type="radio"
                                            value="Seasonal Change"
                                            checked={
                                              selectedExchangeReason ===
                                              "Seasonal Change"
                                            }
                                            onChange={(e) => {
                                              setSelectedExchangeReason(
                                                e.target.value
                                              );
                                              /**Code added by unnati on 28-12-2024
                                               *Reason-To store selected reason in local storage and clear validation message */
                                              setExchangeReasonError("");
                                              localStorage.setItem(
                                                "selectedExchangeReason",
                                                e.target.value
                                              );
                                              /**End of code addition by unnati on 28-12-2024
                                               *Reason-To store selected reason in local storage and clear validation message */
                                            }}
                                          />
                                          Seasonal Change
                                        </label>

                                        <label
                                          className={OrderDetailStyle.reason}
                                        >
                                          <input
                                            type="radio"
                                            value="Other"
                                            checked={
                                              selectedExchangeReason === "Other"
                                            }
                                            onChange={(e) => {
                                              setSelectedExchangeReason(
                                                e.target.value
                                              );
                                              /**Code added by unnati on 28-12-2024
                                               *Reason-To store selected reason in local storage and clear validation message */
                                              setExchangeReasonError("");
                                              localStorage.setItem(
                                                "selectedExchangeReason",
                                                e.target.value
                                              );
                                              /**End of code addition by unnati on 28-12-2024
                                               *Reason-To store selected reason in local storage and clear validation message */
                                            }}
                                          />
                                          Other
                                        </label>
                                      </div>
                                      {selectedExchangeReason === "Other" && (
                                        <textarea
                                          placeholder="Please specify your reason (optional)"
                                          value={otherExchangeReason}
                                          onChange={
                                            (e) => {
                                              /**Code added by unnati on 28-12-2024
                                               *Reason-To store selected reason in local storage and clear validation message */
                                              setOtherExchangeReason(
                                                e.target.value
                                              );
                                              localStorage.setItem(
                                                "selectedExchangeReason",
                                                e.target.value
                                              );
                                            }
                                            /**End of code addition by unnati on 28-12-2024
                                             *Reason-To store selected reason in local storage and clear validation message */
                                          }
                                          className={OrderDetailStyle.textArea}
                                        />
                                      )}
                                      {/**Code added by Unnati on 27-12-2024
                                       *Reason-Added other reason error message */}
                                      {exchangeReasonError && (
                                        <div
                                          className={
                                            OrderDetailStyle.errorMessage
                                          }
                                        >
                                          {exchangeReasonError}
                                        </div>
                                      )}
                                      {/**End of code addition by Unnati on 27-12-2024
                                       *Reason-Added other reason error message */}
                                      {/* Added by - Unnati on 15-12-2024
                                       * Reason - added input boxes to select images of the item that user is returning */}
                                      <div
                                        className={
                                          OrderDetailStyle.itemImagesContainer
                                        }
                                      >
                                        <label
                                          className={OrderDetailStyle.reason}
                                        >
                                          {" "}
                                          Item images (optional)
                                        </label>
                                        <input
                                          type="file"
                                          name="itemImage1"
                                          onChange={(e) =>
                                            setItemImage1(e.target.files[0])
                                          }
                                        ></input>
                                        <input
                                          type="file"
                                          name="itemImage2"
                                          onChange={(e) =>
                                            setItemImage2(e.target.files[0])
                                          }
                                        ></input>
                                      </div>
                                      {/* End of addition by - Added by - Unnati on 15-12-2024
                                       * Reason - added input boxes to select images of the item that user is returning */}

                                      <div
                                        className={
                                          OrderDetailStyle.productColors
                                        }
                                      >
                                        {/**Code added by Unnati on 20-12-2024
                                         *Reason-To map product to according to its color*/}
                                        {uniqueColors.map((color) => (
                                          <div
                                            key={color}
                                            className={`${
                                              OrderDetailStyle.colorOption
                                            } ${
                                              selectedColor === color
                                                ? OrderDetailStyle.activeColorOption
                                                : ""
                                            }`}
                                            style={{ backgroundColor: color }}
                                            onClick={() =>
                                              handleColorSelect(color)
                                            }
                                          ></div>
                                        ))}
                                        {/**End of code addition by Unnati on 20-12-2024
                                         *Reason-To map product to according to its color*/}
                                      </div>
                                      {/**Code added by Unnati on 20-12-2024
                                       * Reason-Changed the UI for size display
                                       */}

                                      {/**Code added by Unnati on 02-01-2025
                                       *Reason-Added condition for free size*/}
                                      {!selectedProduct.is_free_size && (
                                        <div
                                          className={OrderDetailStyle.sizeBoxes}
                                        >
                                          {[
                                            "XS",
                                            "S",
                                            "M",
                                            "L",
                                            "XL",
                                            "XXL",
                                            "XXXL",
                                          ].map((size) => (
                                            <div
                                              key={size}
                                              className={`${
                                                OrderDetailStyle.sizeBox
                                              } ${
                                                selectedSize === size
                                                  ? OrderDetailStyle.selectedSizeBox
                                                  : ""
                                              } ${
                                                !isSizeAvailable(size)
                                                  ? OrderDetailStyle.unavailableSizeBox
                                                  : ""
                                              }`}
                                              onClick={() =>
                                                isSizeAvailable(size) &&
                                                handleSelectChange(size)
                                              }
                                            >
                                              {size}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                      {/**End of code addition by Unnati on 02-01-2025
                                       *Reason-Added condition for free size*/}
                                      {sizeErrorMessage && (
                                        <div
                                          className={
                                            OrderDetailStyle.errorMessage
                                          }
                                        >
                                          {sizeErrorMessage}
                                        </div>
                                      )}

                                      {/**End of code addition by Unnati on 20-12-2024
                                       * Reason-Changed the UI for size display
                                       */}

                                      {selectedProduct?.show_patches_and_embroider_on_UI ? (
                                        <h5
                                          className={`${OrderDetailStyle.popupContent}`}
                                        >
                                          {/* Customization Options */}
                                        </h5>
                                      ) : null}
                                      <div
                                        className={
                                          OrderDetailStyle.checkboxGroup
                                        }
                                      >
                                        {selectedProduct?.logo_price ? (
                                          <label
                                            className={OrderDetailStyle.reason}
                                          >
                                            <input
                                              type="checkbox"
                                              name="logo"
                                              checked={formData.logo}
                                              onChange={handleChange}
                                              className={`${OrderDetailStyle.checkBox}`}
                                            />{" "}
                                            Logo + $
                                            {selectedProduct?.logo_price}
                                          </label>
                                        ) : null}
                                        {selectedProduct?.patches_price ? (
                                          <label
                                            className={OrderDetailStyle.reason}
                                          >
                                            <input
                                              type="checkbox"
                                              name="patches"
                                              checked={formData.patches}
                                              onChange={handleChange}
                                              className={`${OrderDetailStyle.checkBox}`}
                                            />{" "}
                                            Patches / Batches + $
                                            {selectedProduct?.patches_price}
                                          </label>
                                        ) : null}
                                        {selectedProduct?.security_batches_price ? (
                                          <label
                                            className={OrderDetailStyle.reason}
                                          >
                                            <input
                                              type="checkbox"
                                              name="security_batches"
                                              checked={
                                                formData.security_batches
                                              }
                                              onChange={handleChange}
                                              className={`${OrderDetailStyle.checkBox}`}
                                            />{" "}
                                            Security id + $
                                            {
                                              selectedProduct?.security_batches_price
                                            }
                                          </label>
                                        ) : null}
                                        {selectedProduct?.security_id_on_back_price ? (
                                          <label
                                            className={OrderDetailStyle.reason}
                                          >
                                            <input
                                              type="checkbox"
                                              name="security_id_on_back"
                                              checked={
                                                formData.security_id_on_back
                                              }
                                              onChange={handleChange}
                                              // Added by - Ashlekh on 07-03-2025
                                              // Reason - To add class name
                                              className={`${OrderDetailStyle.checkBox}`}
                                              // End of code - Ashlekh on 07-03-2025
                                              // Reason - To add class name
                                            />{" "}
                                            Security ID on Back + $
                                            {
                                              selectedProduct?.security_id_on_back_price
                                            }
                                          </label>
                                        ) : null}
                                        {selectedProduct?.printed_id_price ? (
                                          <label
                                            className={OrderDetailStyle.reason}
                                          >
                                            <input
                                              type="checkbox"
                                              name="printed_id"
                                              checked={formData.printed_id}
                                              onChange={handleChange}
                                              // Added by - Ashlekh on 07-03-2025
                                              // Reason - To add class name
                                              className={`${OrderDetailStyle.checkBox}`}
                                              // End of code - Ashlekh on 07-03-2025
                                              // Reason - To add class name
                                            />{" "}
                                            Printed ID + $
                                            {selectedProduct?.printed_id_price}
                                          </label>
                                        ) : null}
                                        {/* End of code - Ashlekh on 20-02-2025
                                    Reason - To add customization */}
                                        {selectedProduct?.embroider_price ? (
                                          <label
                                            className={OrderDetailStyle.reason}
                                          >
                                            <input
                                              type="checkbox"
                                              name="embroider"
                                              checked={formData.embroider}
                                              onChange={handleChange}
                                              // Added by - Ashlekh on 07-03-2025
                                              // Reason - To add class name
                                              className={`${OrderDetailStyle.checkBox}`}
                                              // End of code - Ashlekh on 07-03-2025
                                              // Reason - To add class name
                                            />{" "}
                                            Embroider / Name + $
                                            {selectedProduct?.embroider_price}
                                          </label>
                                        ) : null}
                                      </div>
                                      {validationMessage && (
                                        <div
                                          style={{
                                            color: "red",
                                            marginBottom: "10px",
                                          }}
                                        >
                                          {validationMessage}
                                        </div>
                                      )}
                                      {selectedProduct.show_patches_and_embroider_on_UI ? (
                                        <div
                                          className={
                                            OrderDetailStyle.commentBox
                                          }
                                        >
                                          <textarea
                                            name="customization_comment"
                                            placeholder="Comment"
                                            className={
                                              OrderDetailStyle.commentInput
                                            }
                                            value={
                                              formData.customization_comment
                                            }
                                            onChange={handleChange}
                                          />
                                        </div>
                                      ) : null}
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "center",
                                        }}
                                      ></div>
                                      {selectedProduct.sales_rate ? (
                                        <div
                                          className={
                                            OrderDetailStyle.grandTotal
                                          }
                                        >
                                          Grand Total: $
                                          {calculateExchangedItemGrandTotal(
                                            item.quantity,
                                            item.total_amount
                                          ).grand_total.toFixed(2)}
                                          {calculateExchangedItemGrandTotal(
                                            item.quantity,
                                            item.total_amount
                                          ).extraAmount > 0 && (
                                            <p
                                              style={{
                                                color: "red",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              You have to pay an additional
                                              amount: $
                                              {calculateExchangedItemGrandTotal(
                                                item.quantity,
                                                item.total_amount
                                              ).extraAmount.toFixed(2)}
                                            </p>
                                          )}
                                        </div>
                                      ) : null}
                                      {extraAmount > 0 ? (
                                        <div style={{ display: "none" }}>
                                          <h5
                                            className={`${OrderDetailStyle.radioInputLabel} ${OrderDetailStyle.columnTitle}`}
                                          >
                                            Payment Option{" "}
                                          </h5>

                                          <label
                                            className={
                                              OrderDetailStyle.radioInput
                                            }
                                          >
                                            <input
                                              type="radio"
                                              value="paypal"
                                              checked={
                                                selectedPaymentGateway ===
                                                "paypal"
                                              }
                                              onChange={(e) =>
                                                setSelectedPaymentGateway(
                                                  e.target.value
                                                )
                                              }
                                            />
                                            PayPal
                                          </label>
                                          <label
                                            className={
                                              OrderDetailStyle.radioInput
                                            }
                                          >
                                            <input
                                              type="radio"
                                              value="stripe"
                                              checked={
                                                selectedPaymentGateway ===
                                                "stripe"
                                              }
                                              onChange={(e) =>
                                                setSelectedPaymentGateway(
                                                  e.target.value
                                                )
                                              }
                                            />
                                            Stripe
                                          </label>
                                        </div>
                                      ) : null}

                                      <div
                                        className={
                                          OrderDetailStyle.buttonContainer
                                        }
                                      >
                                        <button
                                          type="submit"
                                          className={
                                            OrderDetailStyle.submitButton
                                          }
                                        >
                                          Confirm Exchange
                                        </button>
                                        <button
                                          type="button"
                                          className={
                                            OrderDetailStyle.cancelModalButton
                                          }
                                          onClick={() => {
                                            setShowExchangeModal(false);
                                            setOtherExchangeReason("");
                                            setQuantity(1);
                                            /**Code added by Unnati on 04-01-2025
                                             *Reason-To clear size,reason.color */
                                            setSelectedExchangeReason("");
                                            if (!selectedProduct.is_free_size) {
                                              setSelectedSize("");
                                            }
                                            setSelectedColor("");
                                            /**End of code addition by Unnati on 04-01-2025
                                             *Reason-To clear size,reason.color */
                                          }}
                                        >
                                          Close
                                        </button>
                                      </div>
                                    </form>
                                  </div>
                                </>
                              )}
                            {/* End of addition by - Unnati  on 22-12-2024
                             * Reason - To show excahnge with exchange option */}
                            {/**Code added by Unnati on 22-12-2024
                             *Reason-To select payment options */}
                            {selectedPaymentGateway == "stripe" ? (
                              /**Code added by Unnati on 29-12-2024
                               *Reason-To show popup for item to exchange only */
                              itemToExchange === item.id ? (
                                <div id="checkout">
                                  <EmbeddedCheckoutProvider
                                    stripe={stripePromise}
                                    options={stripePaymentoptions}
                                  >
                                    <EmbeddedCheckout />
                                  </EmbeddedCheckoutProvider>
                                </div>
                              ) : null
                            ) : (
                              /**End of code addition by Unnati on 29-12-2024
                               *Reason-To show popup for item to exchange only */

                              paypalOrderId.length > 0 &&
                              paypalAccessToken.length > 0 &&
                              showPaymentModal &&
                              /**Code added by Unnati on 29-12-2024
                               *Reason-To show popup for item to exchange only */
                              itemToExchange === item.id && (
                                /**End of code addition by Unnati on 29-12-2024
                                 *Reason-To show popup for item to exchange only */
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
                                        /**Code commented by unnati on 28-12-2024
                                         *Reason-This code is not in use currently */
                                        // const exchangeReason =
                                        //   selectedExchangeReason === "Other" && otherExchangeReason
                                        //     ? otherExchangeReason
                                        //     : selectedExchangeReason;
                                        /**End of code comment by unnati on 28-12-2024
                                         *Reason-This code is not in use currently */
                                        const OrderItemExchangeTime =
                                          new Date().toLocaleString(undefined, {
                                            timeZone: "Asia/Kolkata",
                                          });

                                        const {
                                          logo,
                                          patches,
                                          security_batches,
                                          // Added by - Ashlekh on 20-02-2025
                                          // Reason - To add customization
                                          security_id_on_back,
                                          printed_id,
                                          // End of code - Ashlekh on 20-02-2025
                                          // Reason - To add customization
                                          embroider,
                                          customization_comment,
                                        } = formData;
                                        // Calculation of customization
                                        const selectedProduct = products.filter(
                                          (i) => i.color == selectedColor
                                        );
                                        let basePrice =
                                          parseFloat(
                                            selectedProduct[0]?.sales_rate
                                          ) || 0;

                                        if (
                                          selectedProduct[0]?.sale_percentage
                                        ) {
                                          basePrice =
                                            selectedProduct[0]?.sales_rate -
                                            (selectedProduct[0]?.sales_rate *
                                              selectedProduct[0]
                                                ?.sale_percentage) /
                                              100;
                                        }
                                        if (logo) {
                                          basePrice += parseFloat(
                                            selectedProduct[0]?.logo_price
                                          );
                                        }

                                        if (patches) {
                                          basePrice += parseFloat(
                                            selectedProduct[0]?.patches_price
                                          );
                                        }

                                        if (security_batches) {
                                          basePrice += parseFloat(
                                            selectedProduct[0]
                                              ?.security_batches_price
                                          );
                                        }
                                        // Added by - Ashlekh on 20-02-2025
                                        // Reason - To add customization
                                        if (security_id_on_back) {
                                          basePrice += parseFloat(
                                            selectedProduct[0]
                                              ?.security_id_on_back_price
                                          );
                                        }
                                        if (printed_id) {
                                          basePrice += parseFloat(
                                            selectedProduct[0]?.printed_id_price
                                          );
                                        }
                                        // End of code - Ashlekh on 20-02-2025
                                        // Reason - To add customization
                                        if (embroider) {
                                          basePrice += parseFloat(
                                            selectedProduct[0]?.embroider_price
                                          );
                                        }

                                        let customizationPrice = basePrice;
                                        const formattedCustomizationPrice =
                                          isNaN(customizationPrice)
                                            ? "0.00"
                                            : customizationPrice.toFixed(2);
                                        setFormData((prevState) => ({
                                          ...prevState,
                                          after_customization_product_price:
                                            formattedCustomizationPrice,
                                          customization_comment,
                                          logo,
                                          patches,
                                          security_batches,
                                          // Added by - Ashlekh on 20-02-2025
                                          // Reason - To add customization
                                          security_id_on_back,
                                          printed_id,
                                          // End of code - Ashlekh on 20-02-2025
                                          // Reason - To add customization
                                          embroider,
                                          logo_price:
                                            parseFloat(
                                              selectedProduct[0]?.logo_price
                                            ) || "0.00",
                                          patches_price:
                                            parseFloat(
                                              selectedProduct[0]?.patches_price
                                            ) || "0.00",
                                          security_batches_price:
                                            parseFloat(
                                              selectedProduct[0]
                                                ?.security_batches_price
                                            ) || "0.00",
                                          embroider_price:
                                            parseFloat(
                                              selectedProduct[0]
                                                ?.embroider_price
                                            ) || "0.00",
                                          // Added by - Ashlekh on 20-02-2025
                                          // Reason - To add customization
                                          security_id_on_back_price:
                                            parseFloat(
                                              selectedProduct[0]
                                                ?.security_id_on_back_price
                                            ) || "0.00",
                                          printed_id_price:
                                            parseFloat(
                                              selectedProduct[0]
                                                ?.printed_id_price
                                            ) || "0.00",
                                          // End of code - Ashlekh on 20-02-2025
                                          // Reason - To add customization
                                        }));
                                        const requestType = "Exchanged";
                                        const productName =
                                          selectedProduct[0]?.name;
                                        const logoPrice =
                                          selectedProduct[0]?.logo_price;
                                        const patchesPrice =
                                          selectedProduct[0]?.patches_price;
                                        const securityBatchesPrice =
                                          selectedProduct[0]
                                            ?.security_batches_price;
                                        const embroiderPrice =
                                          selectedProduct[0]?.embroider_price;
                                        // Added by - Ashlekh on 20-02-2025
                                        // Reason - To add customization
                                        const securityIdOnBackPrice =
                                          selectedProduct[0]
                                            ?.security_id_on_back_price;
                                        const printedIdPrice =
                                          selectedProduct[0]?.printed_id_price;
                                        // End of code - Ashlekh on 20-02-2025
                                        // Reason - To add customization
                                        const image1 =
                                          selectedProduct[0]?.image1;
                                        const sale_percentage =
                                          selectedProduct[0]?.sale_percentage;
                                        const salesRate =
                                          selectedProduct[0]?.sales_rate;
                                        const product_id =
                                          selectedProduct[0]?.product_id;
                                        const is_free_size =
                                          selectedProduct[0]?.is_free_size;
                                        var toPay = JSON.parse(
                                          localStorage.getItem("extraAmount")
                                        );
                                        /**Code added by Unnati on 28-12-2024
                                         *Reason-To get exchange reason from local storage */
                                        var exchangeReason =
                                          localStorage.getItem(
                                            "selectedExchangeReason"
                                          );
                                        /**End of code addition by Unnati on 28-12-2024
                                         *Reason-To get exchange reason from local storage */
                                        var size =
                                          JSON.parse(
                                            localStorage.getItem("size")
                                          ) || null;
                                        console.log(
                                          "//////////////////////////",
                                          size
                                        );
                                        if (is_free_size) {
                                          console.log("inside in paypal");
                                          size = "free_size";
                                        }
                                        console.log(
                                          "size............",
                                          selectedSize
                                        );
                                        console.log("paypal image", itemImage1);
                                        const response =
                                          await postPayPalCaptureExchangeAPI(
                                            paypalOrderId,
                                            paypalAccessToken,
                                            itemId,
                                            orderId,
                                            OrderItemExchangeTime,
                                            exchangeReason,
                                            itemImage1,
                                            itemImage2,
                                            selectedColor,
                                            size,
                                            quantity,
                                            requestType,
                                            sale_percentage,
                                            (formData.after_customization_product_price =
                                              formattedCustomizationPrice),
                                            formData.customization_comment,
                                            formData.logo,
                                            formData.patches,
                                            formData.security_batches,
                                            // Added by - Ashlekh on 20-02-2025
                                            // Reason - To add customization
                                            formData.security_id_on_back,
                                            formData.printed_id,
                                            // End of code - Ashlekh on 20-02-2025
                                            // Reason - To add customization
                                            formData.embroider,
                                            productName,
                                            salesRate,
                                            logoPrice,
                                            patchesPrice,
                                            securityBatchesPrice,
                                            embroiderPrice,
                                            // Added by - Ashlekh on 20-02-2025
                                            // Reason - To add customization
                                            securityIdOnBackPrice,
                                            printedIdPrice,
                                            // End of code - Ashlekh on 20-02-2025
                                            // Reason - To add customization
                                            image1,
                                            product_id,
                                            toPay
                                          );
                                        if (
                                          response?.order_item
                                            ?.payment_status == "Completed"
                                        ) {
                                          // notificationObject.success("Your order placed successfully");
                                          notificationObject.success(
                                            "Return requested submitted successfully"
                                          );
                                          if (orderId) {
                                            fetchOrderDetail(itemId, orderId);
                                          } else {
                                            console.log(
                                              "Order ID is not available"
                                            );
                                          }
                                          setShowPaymentModal(false);
                                        } else if (
                                          response?.order_item
                                            ?.payment_status == "Pending"
                                        ) {
                                          notificationObject.error(
                                            "Payment is still pending"
                                          );
                                        }
                                      } catch (error) {
                                        console.error(
                                          "Error during capture:",
                                          error
                                        );
                                      }
                                    }}
                                  />
                                </PayPalScriptProvider>
                              )
                            )}
                          </div>
                          {/**End of code addition by Unnati on 22-12-2024
                           *Reason-To select payment options */}
                          {/**Code added by Unnati on 07-12-2024
                           *Reason-Added customisation */}
                          <div className={OrderDetailStyle.customisation}>
                            {/* Added by - Ashlekh on 20-02-2025
                          Reason - To add customization */}
                            {/* {item.logo ||item.patches||item.embroider||item.security_batches ? <h4>Customization Detail</h4>:null} */}
                            {item.logo ||
                            item.patches ||
                            item.embroider ||
                            item.security_batches ||
                            item.security_id_on_back ||
                            item.printed_id ? (
                              <h4>Customization Detail</h4>
                            ) : null}
                            {/* End of code - Ashlekh on 20-02-2025
                          Reason - To add customization */}
                            {item.logo ? (
                              <p>Logo : ${item.logo_price}</p>
                            ) : null}
                            {item.patches ? (
                              <p>Patches / Batches : ${item.patches_price}</p>
                            ) : null}
                            {item.embroider ? (
                              <p>Embroider / Name : ${item.embroider_price}</p>
                            ) : null}
                            {item.security_batches ? (
                              <p>
                                Security id : ${item.security_batches_price}
                              </p>
                            ) : null}
                            {/* Added by - Ashlekh on 20-02-2025
                                Reason - To add customization */}
                            {item.security_id_on_back ? (
                              <p>
                                Security ID on Back : $
                                {item.security_id_on_back_price}
                              </p>
                            ) : null}
                            {item.printed_id ? (
                              <p>Printed ID : ${item.printed_id_price}</p>
                            ) : null}
                            {/* End of code - Ashlekh on 20-02-2025
                                Reason - To add customization */}
                          </div>
                          {/**End of code addition by Unnati on 07-12-2024
                           *Reason-Added customisation */}
                        </div>

                        {/* <div className={OrderDetailStyle.actionSection}>
                      <p className={OrderDetailStyle.exchangeInfo}>&#8226; Exchange/Return closed</p>
                      </div> */}
                      </div>
                    );
                  })}

                  {/* End of code addition by Unnati on 18-09-2024
                   *Reason-To map Order Details */}
                </div>

                {order && (
                  <div className={OrderDetailStyle.orderSummary}>
                    <h3 className={OrderDetailStyle.summaryTitle}>
                      Order Summary
                    </h3>
                    <p className={OrderDetailStyle.summaryItem}>
                      <span className={OrderDetailStyle.summaryLabel}>
                        Subtotal:
                      </span>{" "}
                     {config.currency_icon}{order.subtotal}
                    </p>
                    {order.discount_amount > 0 && (
                      <p className={OrderDetailStyle.summaryItem}>
                        <span className={OrderDetailStyle.summaryLabel}>
                          Discount Amount:
                        </span>{" "}
                       {config.currency_icon}{parseFloat(order.discount_amount || 0).toFixed(2)}
                      </p>
                    )}
                    {/* <p className={OrderDetailStyle.summaryItem}>
                  <span className={OrderDetailStyle.summaryLabel}>
                    Taxable Amount:
                  </span>{" "}
                  ${order.taxable_amount || "0.00"}
                </p> */}
                    <p className={OrderDetailStyle.summaryItem}>
                      <span className={OrderDetailStyle.summaryLabel}>
                        Tax(%):
                      </span>
                      {/**Code modified by Unnati on 25-11-2024
                       *Reason-Modified sales tax */}
                      {/* 5% */}
                      {Constants.sales_tax}%
                      {/**End of code addition by Unnati on 25-11-2024
                       *Reason-Modified sales tax */}
                    </p>
                    <p className={OrderDetailStyle.summaryItem}>
                      <span className={OrderDetailStyle.summaryLabel}>
                        Tax:
                      </span>{" "}
                     {config.currency_icon}{order.tax_amount}
                    </p>
                    {/* <p className={OrderDetailStyle.summaryItem}>
                  <span className={OrderDetailStyle.summaryLabel}>
                    Shipping Amount:
                  </span>{" "}
                  {order.shipping_amount || "0.00"}
                </p> */}
                    <p className={OrderDetailStyle.summaryTotal}>
                      <span className={OrderDetailStyle.totalLabel}>
                        Grand Total:
                      </span>{" "}
                      {/* $
                  {((total - Number(order.discount_amount)) * 1.05).toFixed(
                    2
                  ) || "0.00"} */}
                      {/* Modified by Jhamman on 11-10-2024
                  Reason - Added $ sign */}
                      {/* {order.grand_total} */}{config.currency_icon}{order.grand_total}
                      {/* Modified by Jhamman on 11-10-2024
                  Reason - Added $ sign */}
                    </p>
                  </div>
                )}
                {/* Code changed by - Ashlekh on 23-10-2024
            Reason - To display invoice button when payment is completed */}

                {/* Commented by jhamman on 23-10-2024
            Reason - we are sending order id with url in below */}
                {/* {orderStatus?.payment_status == "Completed" && (
              <Link to="/invoice" state={{ Order }}>
                <button className={OrderDetailStyle.invoiceButton}>
                  View Invoice
                </button>
              </Link>
            )} */}
                {/* End of commentation by jhamman on 23-10-2024
            Reason - we are sending order id with url in below */}
                {/* End of code - Ashlekh on 23-10-2024
            Reason - To display invoice button when payment is completed */}
                {/* Modified by jhamman on 23-10-2024
            Reason - Changed path because we are calling api in invoice page */}
                {/* <Link to="/invoice" state={{ Order }}>
              <button className={OrderDetailStyle.invoiceButton}>
                View Invoice
              </button>
            </Link> */}
                {/**Code added by Unnati on 07-11-2024
                 *Reason-Added a div*/}
                <div className={OrderDetailStyle.buttons}>
                  {orderStatus?.payment_status == "Completed" && (
                    <div>
                      <button
                        className={OrderDetailStyle.invoiceButton}
                        onClick={() => handleViewInvoice(order)}
                      >
                        {/* view invoice */}
                        View Invoice
                      </button>
                    </div>
                  )}
                  {/**Code commented by Unnati on 27-12-2024
                   *Reason-This code is not in use */}
                  {/* {orderDetail.some(
                    (item) => item.item_status === "Refunded"
                  ) && (
                    <button
                      className={OrderDetailStyle.invoiceButton}
                      onClick={() => handleCreditNote(order)}
                    >
                      View Credit Note
                    </button>
                  )} */}
                  {/**End of code addition by Unnati on 27-12-2024
                   *Reason-This code is not in use */}
                </div>
                {/**End of code addition by Unnati on 07-11-2024
                 *Reason-Added a div*/}
                {}
                {/* End of modification by jhamman on 23-10-2024
            Reason - Changed path because we are calling api in invoice page */}
                {/* Added by - Ashlekh on - 25-10-2024
            Reason - To display Tracking Id & link */}
                {orderStatus?.tracking_id != null &&
                  orderStatus?.tracking_id?.trim()?.length > 0 && (
                    <div className={`${OrderDetailStyle.trackingIdContainer}`}>
                      Tracking Id: <div>{orderStatus?.tracking_id}</div>
                    </div>
                  )}
                {orderStatus?.tracking_link != null &&
                  orderStatus?.tracking_link?.trim()?.length > 0 && (
                    <div
                      className={`${OrderDetailStyle.trackingLinkContainer}`}
                    >
                      You can track order using{" "}
                      <Link
                        className={`${OrderDetailStyle.navigationLink}`}
                        to={orderStatus?.tracking_link}
                        target="_blank"
                      >
                        {orderStatus?.tracking_link}
                      </Link>
                    </div>
                  )}

                {/* End of code - Ashlekh on 25-10-2024
            Reason - To display Tracking Id & link */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
/**End of code addition by Unnati on 03-08-2024
 * Reason-To have order detail page
 */
