/*Code added by Unnati on 20-07-2024
 * Reason-To have checkout page
 */
import React, { useEffect, useState, useContext } from "react";
import CheckOutStyles from "./CheckOut.module.css";
import Constants from "../../constants/Constants";
import {
  checkIsPhoneNoInvalid,
  checkIsNotADigit,
  checkIsEmpty,
} from "../../utils/validations";
import {
  getOrderDetail,
  getPrimaryShippingAddress,
  placeOrder,
  getUserAddress,
  getCartItem,
  UpdateShippingAddress,
  UserAddress,
  postCartDetailsAPI,
  userDetails,
  removeItem,
  getProductDetail,
  addToCart,
  updateBackendCart,
  updateCartQuantityAPI,
} from "../../Api/services";
import { GlobalContext } from "../../context/Context";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { State } from "country-state-city";
import config from "../../Api/config";
import NavigationPath from "../../components/NavigationPath/NavigationPath";
import { IoIosAddCircleOutline } from "react-icons/io";
import { calculateDiscountFromProduct } from "../../utils/discountedPrices";
import { MdEdit } from "react-icons/md";
import { Modal } from "antd";
import notificationObject from "../../components/Widgets/Notification/Notification";
import { RiDeleteBin6Fill } from "react-icons/ri";
const CheckOut = () => {
  const [id, setId] = useState({});
  const [Order, setOrder] = useState([]);
  const [contactNumberError, setContactNumberError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [cityError, setCityError] = useState("");
  const [stateError, setStateError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [zipCodeError, setZipCodeError] = useState("");
  const [billingAddress, setBillingAddress] = useState(null);
  const [billingFirstNameError, setBillingFirstNameError] = useState("");
  const [billingAddressError, setBillingAddressError] = useState("");
  const [billingCityError, setBillingCityError] = useState("");
  const [billingZipCodeError, setBillingZipCodeError] = useState("");
  const [billingContactNumberError, setBillingContactNumberError] =
    useState("");
  const [buttonChange, setButtonChange] = useState(false);
  const [billingStateError, setBillingStateError] = useState("");
  const [temporaryShippingAddressChecked, setTemporaryShippingAddressChecked] =
    useState(false);
  // const [creditCardNumberError, setCreditCardNumberError] = useState("");
  // const [creditCardExpirationError, setCreditCardExpirationError] =
  //   useState("");
  // const [cardVerificationNumberError, setCardVerificationNumberError] =
  //   useState("");
  const [isNewAddressAdded, setIsNewAddressAdded] = useState(false);
  const [billingChoosenState, setBillingChoosenState] = useState("");
  const { user, clearCart, setUser } = useContext(GlobalContext);
  const [paymentMethod, setPaymentMethod] = useState("");
  const {
    cartData,
    // Added by - Ashlekh on 26-10-2024
    // Reason - To add setCartData from context
    setCartData,
    // End of code - Ashlekh on 26-10-2024
    // Reason - To add setCartData from context
  } = useContext(GlobalContext);
  const [discount, setDiscount] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [shippingAddress, setShippingAddress] = useState([]);
  const [temporaryShippingAddress, setTemporaryShippingAddress] = useState({});
  const [billingAsShipping, setBillingAsShipping] = useState({});
  const [addBillingAddress, setAddBillingAddress] = useState({});
  const [shipToSameAddress, setShipToSameAddress] = useState(true);
  const [IsModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [billingError, setBillingError] = useState("");
  const [shippingError, setShippingError] = useState("");
  const [userAddress, setUserAddress] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [checked, setChecked] = useState(true);
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState(0);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    company: "",
    address: "",
    city: "",
    country: "",
    state: "",
    zipcode: "",
    contact_number: "",
  });
  const [billingFormData, setBillingFormData] = useState({
    first_name: "",
    last_name: "",
    company: "",
    address: "",
    city: "",
    country: "",
    state: "",
    zipcode: "",
    contact_number: "",
  });

  const [shippingFormData, setShippingFormData] = useState({
    first_name: "",
    last_name: "",
    company: "",
    address: "",
    city: "",
    country: "",
    state: "",
    zipcode: "",
    contact_number: "",
  });
  const initialShippingFormData = {
    first_name: "",
    last_name: "",
    company: "",
    address: "",
    city: "",
    country: "",
    state: "",
    zipcode: "",
    contact_number: "",
  };
  const [cartItem, setCartItem] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [choosenState, setChoosenState] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const location = useLocation();
  // Added by - Ashlekh on 23-10-2024
  // Reason - To have useState for storing stock message
  // const [stockMessage, setStockMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showOutOfStockMessage, setShowOutOfStockMessage] = useState([]);
  // End of code - Ashlekh on 23-10-2024
  // Reason - To have useState for storing stock message
  // Added by - Ashlekh on 25-10-2024
  // Reason - To have useState for stock and inactive products
  const [showInActiveMessage, setShowInActiveMessage] = useState([]);
  const [isStockChecked, setIsStockChecked] = useState(false);
  const [isInActiveChecked, setIsInActiveChecked] = useState(false);
  const [orderInformation, setOrderInformation] = useState({});
  // End of code - Ashlekh on 25-10-2024
  // Reason - To have useState for stock and inactive products
  // Added by - Ashlekh on 26-10-2024
  // Reason - This useState will use when we delete item
  const [itemToDelete, setItemToDelete] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  // End of code - Ashlekh on 26-10-2024
  // Reason - This useState will use when we delete item
  // Added by - Ashlekh on 27-10-2024
  // Reason - To have useState for storing quantity
  const [quantities, setQuantities] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  // End of code - Ashlekh on 27-10-2024
  // Reason - To have useState for storing quantity

  /**
   * Added by Ashish Dewangan on 27-11-2024
   * Reason- Variable to determine which payment gateway to use
   */
  const [selectedPaymentGateway, setSelectedPaymentGateway] =
    useState("stripe");
  /**
   * End of addition by Ashish Dewangan on 27-11-2024
   * Reason- Variable to determine which payment gateway to use
   */
  // Added by - Ashlekh on 30-11-2024
  // Reason - useState for validation message of stock
  const [stockValidationMessage, setStockValidationMessage] = useState({});
  // End of code - Ashlekh on 30-11-2024
  // Reason - useState for validation message of stock
  // Added by - Ashlekh on 06-12-2024
  // Reason - To useState for displaying message of unavailable color
  const [showColorIssues, setShowColorIssues] = useState(null);
  const [isColorChecked, setIsColorChecked] = useState(false);
  // End of code - Ashlekh on 06-12-2024
  // Reason - To useState for displaying message of unavailable color
  /**Code added by Unnati on 18-10-2024
   * Reason-To handle scroll bar when modal is open
   */
  useEffect(() => {
    if (isShippingModalOpen || IsModalOpen || isModalOpen || isEditModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isShippingModalOpen, IsModalOpen, isModalOpen, isEditModalOpen]);
  /**End of code addition by Unnati on 18-10-2024
   * Reason-To handle scroll bar when modal is open
   */
  /**Code added by Unnati on 17-10-2024
   * Reason-To get total item count in the cart
   */

  const getTotalItemCount = (cartData) => {
    let totalCount = 0;

    for (let i = 0; i < cartData.length; i++) {
      const item = cartData[i];

      // Check if the product is active
      // const CartItem =
      //   cartItem?.find((product) => product.id === item.product) || {};

      // if (CartItem.is_active) {
      //   totalCount += item.XS || 0;
      //   totalCount += item.S || 0;
      //   totalCount += item.M || 0;
      //   totalCount += item.L || 0;
      //   totalCount += item.XL || 0;
      //   totalCount += item.XXL || 0;
      //   totalCount += item.XXXL || 0;
      // }
      // Added by - Ashlekh on 28-12-2024
      // Reason - Product will be counted only if product is_active
      if (item.is_active == true) {
        totalCount += parseInt(item.quantity ? item.quantity : 0);
      }
      // End of code - Ashlekh on 28-12-2024
      // Reason - Product will be counted only if product is_active
    }

    return totalCount;
  };

  const totalItemCount = getTotalItemCount(cartData);
  /**End of code addition by Unnati on 17-10-2024
   * Reason-To get total item count in the cart
   */

  /**Code added by Unnati on 09-10-2024
   * Reason-To get product details
   */

  const fetchCartDetails = async () => {
    try {
      const product = cartData.map((item) => item.product);
      /**
       * Modified by - Ashish Dewangan on 16-12-2024
       * Reason - Sending user id also for better filtering
       */
      // const response = await getCartItem(product);
      // setCartItem(response.products);
      const response = await getCartItem(product, user.id);
      setCartData(response.products);
      /**
       * End of modification by - Ashish Dewangan on 16-12-2024
       * Reason - Sending user id also for better filtering
       */
    } catch (error) {
      console.error("Error fetching cart details:", error);
    }
  };
  /**
   * Modified by - Ashish Dewangan on 16-12-2024
   * Reason - To fetch cart of logged in user
   */
  // useEffect(() => {
  //   fetchCartDetails();
  // }, [cartData]);

  useEffect(() => {
    if (user && user.id) {
      fetchCartDetails();
    }
  }, [user]);
  /**
   * End of modification by - Ashish Dewangan on 16-12-2024
   * Reason - To fetch cart of logged in user
   */

  /**End of code addition by Unnati on 09-10-2024
   * Reason-To get product details
   */
  /**Code added by Unnati Bajaj on 08-10-2024
   * Reason -To get shipping address when the component loads
   */
  useEffect(() => {
    const fetchShippingAddress = async () => {
      try {
        const data = await getUserAddress(user.id);
        setUserAddress(data.userAddress);
        /**Code added by Unnati on 20-10-2024
         * Reason-To set selectedShippingAddressId
         */
        // Commented by - Ashlekh on 15-01-2025
        // Reason - Address will be retrieved from session storage
        const storedShippingAddressId = sessionStorage.getItem("selectedShippingAddressId");
        if (!storedShippingAddressId) {
          setSelectedShippingAddressId(data.primaryAddressId);
        }
        // End of comment - Ashlekh on 15-01-2025
        // Reason - Address will be retrieved from session storage
        /*End of code addition by Unnati on 20-10-2024
         * Reason-To set selectedShippingAddressId
         */
      } catch (error) {
        console.error("Error fetching shipping address:", error.message);
      }
    };

    if (user?.id) {
      fetchShippingAddress();
    }
  }, [user.id]);
  /**End of code addition by Unnati Bajaj on 08-10-2024
   * Reason -To get shipping address when the component loads
   */

  /**Code added by Unnati on 11-09-2024
   * Reason-To have navigation link for checkout page
   */
  const { navigationPath, setNavigationPath } = useContext(GlobalContext);
  useEffect(() => {
    setNavigationPath([
      { name: "Home", path: "/" },
      { name: "View Cart", path: "/viewcart" },
      { name: "Check Out", path: "/checkout" },
    ]);
    window.scrollTo(0, 0);
  }, [setNavigationPath]);
  /**End of code addition by Unnati on 11-09-2024
   * Reason-To have navigation link for checkout page
   */
  /**Code added by Unnati on 25-07-2024
   * Reason-To get filtered sizes
   */
  const getFilteredSizes = (item) => {
    const sizeKeys = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
    const filterSizeKeys = sizeKeys.filter((key) => item[key] !== null || 0);
    const mapSize = filterSizeKeys.map((key) => [key, item[key]]);
    return mapSize;
  };
  /**End of code addition by Unnati on 25-07-2024
   * Reason-To get filtered sizes
   */
  /**Code added by Unnati on 25-07-2024
   * Reason-To handle payment change
   */
  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };
  /**End of code addition Unnati on 25-07-2024
   * Reason-To handle payment change
   */

  /*Code added by Unnati on 20-07-2024
   * Reason-To get the data from view cart page
   */
  const navigate = useNavigate();
  const { cart, selectedCountry, selectedState, zipCode } =
    location.state || {};

  /*End of code addition by Unnati on 20-07-2024
   * Reason-To get the data from view cart page
   */
  /**Code added by Unnati Bajaj on 20-07-2024
   * Reason -To scroll to the top when component loads
   */
  useEffect(() => {
    window.scrollTo(0, 0);
    // Added by - Ashlekh on 15-01-2025
    // Reason - To get address from session storage
    const storedAddress = sessionStorage.getItem("selectedShippingAddress");
    const parsedAddress = JSON.parse(storedAddress)
    setShippingAddress(parsedAddress)
    const storedAddressId = sessionStorage.getItem("selectedShippingAddressId");
    if (storedAddressId) {
      const parsedAddressId = JSON.parse(storedAddressId);
      setSelectedShippingAddressId(parsedAddressId);
    }
    // End of code - Ashlekh on 15-01-2025
    // Reason - To get address from session storage
  }, []);
  /**End of code addition by Unnati Bajaj on 20-07-2024
   * Reason -To scroll to the top when component loads
   */
  const isValidBillingAddress = (data) => {
    let isValid = true;

    if (checkIsEmpty(data.first_name)) {
      setBillingFirstNameError("Please enter first name");
      isValid = false;
    } else if (!checkIsNotADigit(data.first_name)) {
      setBillingFirstNameError("Please enter a valid first name");
      isValid = false;
    }

    if (checkIsEmpty(data.address)) {
      setBillingAddressError("Please enter address");
      isValid = false;
    }

    if (checkIsEmpty(data.city)) {
      setBillingCityError("Please enter city");
      isValid = false;
    }
    if (checkIsEmpty(data.state)) {
      setBillingStateError("Please enter state");
      isValid = false;
    }

    if (checkIsEmpty(data.zipcode)) {
      setBillingZipCodeError("Please enter zipcode");
      isValid = false;
    }

    if (checkIsEmpty(data.contact_number)) {
      setBillingContactNumberError("Please enter contact number");
      isValid = false;
    }

    // commentation by jhamman on 20-10-2024
    // Reason - dont want to validate because no. can have bracket
    // else if (!checkIsPhoneNoInvalid(data.contact_number)) {
    //   setBillingContactNumberError("Please enter a valid contact number");
    //   isValid = false;
    // }
    // End of commentation by jhamman on 20-10-2024
    // Reason - dont want to validate because no. can have bracket

    return isValid;
  };
  /*
   * Added by - Unnati Bajaj on 22-07-2024
   * Reason - To validate input on blur
   */
  const isValidOnBlur = (input, value) => {
    {
      /**Code commented by Unnati on 22-07-2024
       *Reason-Email is not in use
       */
    }
    // if (input === "email") {
    //   if (checkIsEmpty(value)) {
    //     setEmailError("Please enter email address");
    //     return false;
    //   } else {
    //     if (checkIsEmailInvalid(value)) {
    //       setEmailError("Please enter valid email");
    //       return false;
    //     }
    //   }
    // }
    {
      /**End of code comment by Unnati on 22-07-2024
       *Reason-Email is not in use
       */
    }
    if (input === "first_name") {
      if (checkIsEmpty(value)) {
        setFirstNameError("Please enter first name");
        return false;
      }
    }
    if (input === "address") {
      if (checkIsEmpty(value)) {
        setAddressError("Please enter address");
        return false;
      }
    }
    if (input === "city") {
      if (checkIsEmpty(value)) {
        setCityError("Please enter city");
        return false;
      }
    }

    if (input === "state") {
      if (checkIsEmpty(value)) {
        setStateError("Please enter state");
        return false;
      }
    }
    if (input === "zipcode") {
      if (checkIsEmpty(value)) {
        setZipCodeError("Please enter zipcode");
        return false;
      }
    }
    if (input === "contact_number") {
      if (checkIsEmpty(value)) {
        setContactNumberError("Please enter contact number");
        return false;
      }
      // commentation by jhamman on 20-10-2024
      // Reason - dont want to validate because no. can have bracket
      // else {
      //   if (!checkIsPhoneNoInvalid(value)) {
      //     setContactNumberError("Please enter a valid contact number");
      //     return false;
      //   }
      // }
      // End of commentation by jhamman on 20-10-2024
      // Reason - dont want to validate because no. can have bracket
    }
    /**Code added by 25-07-2024
     * Reason-To add validation for payment
     */
    // if (input === "credit_card_number") {
    //   if (checkIsEmpty(value)) {
    //     setCreditCardNumberError("Please enter credit card number");
    //     return false;
    //   } else {
    //     if (checkIfGreaterThanMaxLength(value, 16)) {
    //       setCreditCardNumberError("Please enter valid credit card number");
    //       return false;
    //     }
    //   }
    // }
    // if (input === "expiration_date") {
    //   if (checkIsEmpty(value)) {
    //     setCreditCardExpirationError(
    //       "Please enter credit card expiration date"
    //     );
    //     return false;
    //   }
    // }
    // if (input === "card_verification_number") {
    //   if (checkIsEmpty(value)) {
    //     setCardVerificationNumberError("Please enter card verfication number");
    //     return false;
    //   } else {
    //     if (checkIfGreaterThanMaxLength(value, 4)) {
    //       setCardVerificationNumberError(
    //         "Please enter card verfication number"
    //       );
    //       return false;
    //     }
    //   }
    // }
    /**End of code addition by 25-07-2024
     * Reason-To add validation for payment
     */
  };
  /*
   * End of code addition by - Unnati Bajaj on 22-07-2024
   * Reason - To validate input on blur
   */

  /*Code added by - Unnati Bajaj on 22-07-2024
   * Reason - To add validations in the form
   */
  /**Code modified by Unnati on 20-10-2024
   * Reason-To show isValidOnSubmit true when all the fields are valid
   */
  const isValidOnShippingSubmit = (data) => {
    let isValid = true;
    if (checkIsEmpty(data.first_name)) {
      setFirstNameError("Please enter first name");
      isValid = false;
    } else if (!checkIsNotADigit(data.first_name)) {
      setFirstNameError("Please enter a valid first name");
      isValid = false;
    }

    if (checkIsEmpty(data.address)) {
      setAddressError("Please enter address");
      isValid = false;
    }

    if (checkIsEmpty(data.city)) {
      setCityError("Please enter city");
      isValid = false;
    }
    if (checkIsEmpty(data.state)) {
      setStateError("Please enter state");
      isValid = false;
    }

    if (checkIsEmpty(data.zipcode)) {
      setZipCodeError("Please enter zipcode");
      isValid = false;
    }

    if (checkIsEmpty(data.contact_number)) {
      setContactNumberError("Please enter contact number");
      isValid = false;
    }
    /**Code commented by Jhamman on 24-10-2024
     * Reason-To remove validation
     */
    // } else if (!checkIsPhoneNoInvalid(data.contact_number)) {
    //   setContactNumberError("Please enter a valid contact number");
    //   isValid = false;
    // }
    /**End of code comment by Jhamman on 24-10-2024
     * Reason-To remove validation
     */

    return isValid;
    /**End of code modification by Unnati on 20-10-2024
     * Reason-To show isValidOnSubmit true when all the fields are valid
     */

    /*Code added by - Unnati Bajaj on 25-07-2024
     * Reason - To add credit card validations in the form
     */
    // if (checkIsEmpty(data.paymentDetails.credit_card_number)) {
    //   setCreditCardNumberError("Please enter credit card number");
    //   return false;
    // } else {
    //   if (
    //     checkIfGreaterThanMaxLength(data.paymentDetails.credit_card_number, 16)
    //   ) {
    //     setCreditCardNumberError("Please enter valid credit card number");
    //     return false;
    //   }
    // }
    // if (checkIsEmpty(data.paymentDetails.expiration_date)) {
    //   setCreditCardExpirationError("Please enter credit card expiration");
    //   return false;
    // } else {
    //   if (
    //     checkIfGreaterThanMaxLength(data.paymentDetails.expiration_date, 16)
    //   ) {
    //     setCreditCardExpirationError(
    //       "Please enter valid credit card expiration"
    //     );
    //     return false;
    //   }
    // }
    /*End of code addition by - Unnati Bajaj on 25-07-2024
     * Reason - To add credit card validations in the form
     */
  };
  /**Code modified by Unnati on 09-09-2024
   * Reason-To show isValidOnSubmit true when all the fields are valid
   */
  const isValidOnSubmit = (shippingAddress) => {
    let isValid = true;
    if (checkIsEmpty(shippingAddress.first_name)) {
      setFirstNameError("Please enter first name");
      isValid = false;
    } else if (!checkIsNotADigit(shippingAddress.first_name)) {
      setFirstNameError("Please enter a valid first name");
      isValid = false;
    }

    if (checkIsEmpty(shippingAddress.address)) {
      setAddressError("Please enter address");
      isValid = false;
    }

    if (checkIsEmpty(shippingAddress.city)) {
      setCityError("Please enter city");
      isValid = false;
    }
    if (checkIsEmpty(shippingAddress.state)) {
      setStateError("Please enter state");
      isValid = false;
    }

    if (checkIsEmpty(shippingAddress.zipcode)) {
      setZipCodeError("Please enter zipcode");
      isValid = false;
    }

    if (checkIsEmpty(shippingAddress.contact_number)) {
      setContactNumberError("Please enter contact number");
      isValid = false;
    }
    // commentation by jhamman on 20-10-2024
    // Reason - dont want to validate because no. can have bracket
    // else if (!checkIsPhoneNoInvalid(shippingAddress.contact_number)) {
    //   setContactNumberError("Please enter a valid contact number");
    //   isValid = false;
    // }
    // End of commentation by jhamman on 20-10-2024
    // Reason - dont want to validate because no. can have bracket

    return isValid;
    /**End of code modification by Unnati on 09-09-2024
     * Reason-To show isValidOnSubmit true when all the fields are valid
     */

    /*Code added by - Unnati Bajaj on 25-07-2024
     * Reason - To add credit card validations in the form
     */
    // if (checkIsEmpty(data.paymentDetails.credit_card_number)) {
    //   setCreditCardNumberError("Please enter credit card number");
    //   return false;
    // } else {
    //   if (
    //     checkIfGreaterThanMaxLength(data.paymentDetails.credit_card_number, 16)
    //   ) {
    //     setCreditCardNumberError("Please enter valid credit card number");
    //     return false;
    //   }
    // }
    // if (checkIsEmpty(data.paymentDetails.expiration_date)) {
    //   setCreditCardExpirationError("Please enter credit card expiration");
    //   return false;
    // } else {
    //   if (
    //     checkIfGreaterThanMaxLength(data.paymentDetails.expiration_date, 16)
    //   ) {
    //     setCreditCardExpirationError(
    //       "Please enter valid credit card expiration"
    //     );
    //     return false;
    //   }
    // }
    /*End of code addition by - Unnati Bajaj on 25-07-2024
     * Reason - To add credit card validations in the form
     */
  };
  /*End of code addition by - Unnati Bajaj on 22-07-2024
   * Reason - To add validations in the form
   */

  /**Code added by Unnati on 21-07-2024
   *  Reason - To post order details when user submits the form
   */
  const postOrderDetails = async (e) => {
    {
      /**Code added by Unnati on 26-10-2024
       *Reason-if user is inactive then show logout*/
    }
    if (user.id) {
      try {
        const response = await userDetails(localStorage.getItem("access"));
        /**Code added by Unnati on 27-10-2024
         * Reason-Added response.code
         */
        if (response.code && response.code == "user_inactive") {
          /*End of code addition by Unnati on 27-10-2024
           * Reason-Added response.code
           */
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          setUser({});
          /**Code added by Unnati on 26-10-2024
           * Reason-Added notification
           */
          notificationObject.error("User is inactive.Please contact admin.");
          /**End of code addition by Unnati on 26-10-2024
           * Reason-Added notification
           */
          navigate("/login");
        } else {
          {
            /**End of code addition by Unnati on 26-10-2024
             *Reason-if user is inactive then show logout*/
          }

          var isValid = false;
          /**Code added by Unnati on 14-09-2024
           * Reason-To have billing address
           */
          /**Code added by Unnati on 15-09-2024
           * Reason-To add billing address postOrderDetails
           */
          /**
           * Code changed by - Jhamman on 17-10-2024
           * Reason - To share required details in PaymentDetail page
           */
          // const finalBillingAddress = shipToSameAddress
          //   ? { ...shippingAddress }
          //   : billingAddress;
          /**Code modified by Unnati on 24-10-2024
           * Reason-Added validation message and billingAddress
           */
          if (!shippingAddress) {
            setShippingError("Please add shipping address");
            /**Code added by Unnati on 30-10-2024
             * Reason-Added return
             */
            return;
            /**End of code addition by Unnati on 30-10-2024
             * Reason-Added return
             */
          } else {
            if (shipToSameAddress) {
              var finalBillingAddress = shippingAddress;
              isValid = true;
            } else if (!billingAddress) {
              setBillingError(
                "Please add a new billing address or select checkbox"
              );
              isValid = false;
              /**Code added by Unnati on 30-10-2024
               * Reason-Added return
               */
              return;
              /**End of code addition by Unnati on 30-10-2024
               * Reason-Added return
               */
            } else {
              var finalBillingAddress = billingAddress;
              isValid = true;
            }
          }
          /**End of code modification by Unnati on 24-10-2024
           * Reason-Added validation message and billingAddress
           */
          /**
           * End of code - Jhamman on 17-10-2024
           * Reason - To share required details in PaymentDetail page
           */

          /**End of code addition by Unnati on 15-09-2024
           * Reason-To add billing address postOrderDetails
           */
          /**End of code addition by Unnati on 14-09-2024
           * Reason-To have billing address
           */

          /**Code added by Unnati on 31-07-2024
           * Reason-To store payment details in a variable
           */
          // const paymentDetails = {
          //   payment_mode: paymentMethod || "",
          //   credit_card_number: e.target.creditCardNumber?.value || "",
          //   expiration_date: e.target.expirationDate?.value || "",
          //   card_verification_number: e.target.cardVerificationNumber?.value || "",
          // };
          /**End of code addition by Unnati on 31-07-2024
           * Reason-To store payment details in a variable
           */
          /**Code added by Unnati on 31-07-2024
           * Reason-To store all the order details in a variable
           */
          const orderDetails = {
            shippingAddress: shippingAddress,
            // paymentDetails: paymentDetails,
            user: user.id,
            discount: discount || "",
            /**Code modified by Unnati on 15-09-2024
             * Reason-To add biling address
             */
            billingAddress: finalBillingAddress,
            /**End of code modified by Unnati on 15-09-2024
             * Reason-To add biling address
             */
          };
          /**End of code addition by Unnati on 31-07-2024
           * Reason-To store all the order details in a variable
           */
          /**
           * Added by - Ashlekh on 25-10-2024
           * Reason - To set orderDetails in useState (this setOrderInformation is used in sending detail in payment detail)
           */
          setOrderInformation(orderDetails);
          /**Code added by Unnati on 27-10-2024
           * Reason-Call checkstock
           */
          await checkStock(orderDetails);
          /**End of code addition by Unnati on 27-10-2024
           * Reason-Call checkstock
           */
          /**
           * End of code - Ashlekh on 25-10-2024
           * Reason - To set orderDetails in useState (this setOrderInformation is used in sending detail in payment detail)
           */

          // if (!shipToSameAddress && !billingAddress ) {
          //   setBillingError(
          //     "Please add a billing address or select 'Bill to same address.'"
          //   );
          //   return;
          // }

          /* Added by jhamman on 17-10-2024
          Reason - Navigate to payment page with address details*/
          if (isValid) {
            // Code commented by - Ashlekh on 25-10-2024
            // Reason - Below codes are used in checkStock function
            // Added by - Ashlekh on 23-10-2024
            // Reason - If stock is available then only user will navigate to payment page else show message
            // const stockResponse = await checkStock();
            // if (stockResponse === "Stock available") {
            //   navigate("/paymentdetail", {
            //     state: { Order: orderDetails },
            //   });
            // } else if (stockResponse === "Cart is empty") {
            //   setModalMessage("Cart is empty, Please add items in cart");
            //   setIsModalVisible(true);
            // }
            // Code commented by - Ashlekh on 25-10-2024
            // Reason - Now we are using below code in useEffect
            // Added by - Ashlekh on 24-10-2024
            // Reason - To display message for inactive product
            // else if (stockResponse === "Inactive product") {
            //   let inActiveMessage = "<p style='text-align: center;'><strong>Some items are in active:</strong></p><br/>";
            //   const productInActiveMessage = showInActiveMessage?.map((item) => {
            //     return `<strong>Product :</strong> ${item.product_name} is inactive.<br/>`;
            //   });
            //   inActiveMessage = inActiveMessage + productInActiveMessage;
            //   setModalMessage(inActiveMessage);
            //   setIsModalVisible(true);
            // }
            // End of code - Ashlekh on 24-10-2024
            // Reason - To display message for inactive product
            // else {
            //   // Code changed by - Ashlekh on 24-10-2024
            //   // Reason - To display quantity available product and product name
            //   let outOfStockMessage =
            //     "<p style='text-align: center;'><strong>Some items are out of stock:</strong></p><br/>";
            //   const detailedMessage = showOutOfStockMessage?.map((item) => {
            //     return `<strong>Product :</strong> ${item.product_name}, <strong>Available Quantity :</strong> ${item.available_qty}<br/>`;
            //   });
            //   outOfStockMessage = outOfStockMessage + detailedMessage;
            //   setModalMessage(outOfStockMessage);
            //   setIsModalVisible(true);
            // }
            // else {
            //   setIsStockChecked(true);
            // }
            // End of code - Ashlekh on 24-10-2024
            // Reason - To display quantity of available product and product name
            // End of comment - Ashlekh on 25-10-2024
            // Reason - Below codes are used in checkStock function
          }
          // End of code - Ashlekh on 23-10-2024
          // Reason - If stock is available then only user will navigate to payment page else show message
          /* End of addition by jhamman on 17-10-2024
          Reason - Navigate to payment page with address details*/

          /* Commented by jhamman on 17-10-2024
           * Reason - removed api Call for  place order*/
          // const response = await placeOrder(orderDetails);

          // setId(response.orderSummary?.id);

          // /**Code added by Unnati on 22-07-2024
          //  * Reason -To display notification of success and error
          //  */
          // if (response.success) {
          //   /**Code added by Unnati on 25-08-2024
          //    * Reason-to get order details when clicked on place order button
          //    */
          //   const fetchOrderDetail = async () => {
          //     try {
          //       const orderResponse = await getOrderDetail(
          //         response.orderSummary.id,
          //         user.id,
          //         /**Code added by Unnati on 13-09-2024
          //          * Reason-To send shipping address id
          //          */
          //         response.shippingAddress
          //         /**End of code addition by Unnati on 13-09-2024
          //          * Reason-To send shipping address id
          //          */
          //       );
          //       setOrder(orderResponse);
          //       /**Code added by Unnati on 07-10-2024
          //        * Reaon-Change path to payment detail
          //        */
          //       navigate("/paymentdetail", {
          //         state: { Order: orderResponse },
          //       });
          //       /**End of code by Unnati on 07-10-2024
          //        * Reaon-Change path to payment detail
          //        */
          //       setTemporaryShippingAddress(null);
          //     } catch (error) {
          //       console.error("Failed to fetch order details:", error);
          //     }
          //   };
          //   localStorage.removeItem("cartData");
          //   clearCart();
          //   fetchOrderDetail();
          // }
          /* End of commentation by jhamman on 17-10-2024
           * Reason - removed api Call for  place order*/
          /**End of code addition by Unnati on 25-08-2024
           * Reason-to get order details when clicked on place order button
           */

          // if (response.error) {
          //   notificationObject.error(response.error);
          // }
          /**End of code addition by Unnati on 22-07-2024
           * Reason -To display notification of success and error
           */
        }
      } catch (error) {
        console.error("Error fetching user details:", error.message);
      }
    } else {
      /**Code added by Unnati on 27-10-2024
       * Reason-Added navigate
       */
      navigate("/login");
      /**End of code addition by Unnati on 27-10-2024
       * Reason-Added navigate
       */
    }
  };
  /**End of code addition by Unnati on 21-07-2024
   *  Reason - To post order details when user submits the form
   */

  /**Code added by Unnati on 20-07-2024
   * Reason-To handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    /**Code added by Unnati on 21-07-2024
     * Reason-To post order details
     */
    await postOrderDetails(e);

    /**End of code addition by Unnati on 21-07-2024
     * Reason-To post order details
     */
  };
  /**End of code addition by Unnati on 20-07-2024
   * Reason-To handle form submission
   */
  /**Code added by Unnati on 15-09-2024
   * Reason-To handle input change for billing address form
   */
  /** */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    /**Modified code on 24-10-2024
     * Reason-Changed variable
     */
    setBillingFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    /**End of code modification on 24-10-2024
     * Reason-Changed variable
     */
  };
  /**Code commented by Unnati on 12-10-2024
   * Reason-This code is not in use currently
   */
  // const handleShippingInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setShippingFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };
  /**End of code addition by Unnati on 12-10-2024
   * Reason-This code is not in use currently
   */
  /**End of code addition by Unnati on 15-09-2024
   * Reason-To handle input change for billing address form
   */
  /**Code added by Unnati on 19-09-2024
   * Reason-Added calculated subtotal
   */
  let calculatedSubtotal = 0;
  /**End of code addition by Unnati on 19-09-2024
   * Reason-Added calculated subtotal
   */
  /**Code added by Unnati on 14-09-2024
   * Reason-To handle modal submit
   */
  /**Code added by Unnati on 10-10-2024
   * Reason-To handleEditModalSubmit
   */
  const handleEditModalSubmit = async (addressId) => {
    const data = {
      first_name: formData.first_name || "",
      last_name: formData.last_name || "",
      company: formData.company || "",
      address: formData.address || "",
      city: formData.city || "",
      state: formData.state,
      country: "United States",
      zipcode: formData.zipcode || "",
      contact_number: formData.contact_number || "",
    };
    /**Code added by Unnati on 20-10-2024
     * Reason-To check whether edited shipping address is valid or not
     */
    if (isValidOnShippingSubmit(data)) {
      /*End of code addition by Unnati on 20-10-2024
       * Reason-To check whether edited shipping address is valid or not
       */
      try {
        const response = await UpdateShippingAddress(data, addressId, user.id);

        if (response && response.updatedUserAddress) {
          setUserAddress(response.updatedUserAddress || []);
          /**Code added by Unnati on 23-10-2024
           * Reason-Set value to shipping address
           */
          setShippingAddress(data);
          /**End of code addition by Unnati on 23-10-2024
           * Reason-Set value to shipping address
           */
        } else {
          console.error("Unexpected response format", response);
        }
      } catch (error) {
        console.error("Error updating shipping address", error);
      }
      setIsEditModalOpen(false);
    }
  };
  /**End of code addition by Unnati on 10-10-2024
   * Reason-To handleEditModalSubmit
   */
  /**Code added by Unnati on 15-09-2024
   * Reason-To handle modal submit
   */
  const handleModalSubmit = (e) => {
    e.preventDefault();

    // const billing_address = {
    //   first_name: formData.first_name,
    //   last_name: formData.last_name,
    //   company: formData.company,
    //   address: formData.address,
    //   city: formData.city,
    //   country: "United States",
    //   state: billingChoosenState,
    //   zipcode: formData.zipcode,
    //   contact_number: formData.contact_number,
    //   user: user.id,
    // };
    const billing_address = {
      first_name: billingFormData.first_name,
      last_name: billingFormData.last_name,
      company: billingFormData.company,
      address: billingFormData.address,
      city: billingFormData.city,
      country: "United States",
      state: billingChoosenState,
      zipcode: billingFormData.zipcode,
      contact_number: billingFormData.contact_number,
      user: user.id,
    };
    if (isValidBillingAddress(billing_address)) {
      setBillingAddress(billing_address);
      /**Code added by Unnati on 16-10-2024
       * Reason-TO SET BILLING ADDRRESS
       */
      setAddBillingAddress(billing_address);
      /**eND OF CODE ADDITON by Unnati on 16-10-2024
       * Reason-TO SET BILLING ADDRRESS
       */
      /**Code added by Unnati on 20-10-2024
       * Reason-To set button change as true
       */
      setButtonChange(true);
      /**End of code addition by Unnati on 20-10-2024
       * Reason-To set button change as true
       */
      closeModal();
    }
  };
  /**End of code addition by Unnati on 15-09-2024
   * Reason-To handle modal submit
   */
  /**End of code addition by Unnati on 14-09-2024
   * Reason-To handle modal submit
   */

  const handleShippingModalSubmit = async (e) => {
    // e.preventDefault();
    /**Code added by Unnati on 31-07-2024
     * Reason-To store shipping address in a variable
     */
    const shipping_address = {
      first_name: firstName,
      last_name: lastName,
      company: company,
      address: address,
      city: city,
      country: "United States",
      state: choosenState,
      zipcode: zipcode,
      contact_number: contactNumber,
      user: user.id,
    };

    if (isValidOnSubmit(shipping_address)) {
      try {
        const response = await UserAddress(shipping_address, user.id);
        if (response && response.userAddress) {
          setUserAddress(response.userAddress);
          /**Code added by Unnati on 20-10-2024
           * Reason-To set selectedShippingAddressId
           */
          setSelectedShippingAddressId(response.id);
          /*End of code addition by Unnati on 20-10-2024
           * Reason-To set selectedShippingAddressId
           */
          // Added by - Ashlekh on 15-01-2025
          // Reason - To store address id in session storage
          sessionStorage.setItem("selectedShippingAddressId", JSON.stringify(response.id));
          // End of code - Ashlekh on 15-01-2025
          // Reason - To store address id in session storage
        } else {
          console.error("Unexpected response format", response);
        }
      } catch (error) {
        console.error("Error updating shipping address", error);
      }
      setShippingAddress(shipping_address);
      closeShippingModal();
    }

    /**End of code addition by Unnati on 31-07-2024
     * Reason-To store shipping address in a variable
     */
  };
  /**Code commented by Unnati on 21-07-2024
   * Reason-To handle discount dropdown
   */
  // const handleDiscountDropdown = () => {
  //   setIsDropdownOpen(!isDropdownOpen);
  // };
  /**End of code comment by Unnati on 21-07-2024
   * Reason-To handle discount dropdown
   */
  /**Code added by Unnati on 22-07-2024
   * Reason-To have a state dropdown
   */
  const [states, setStates] = useState([]);
  useEffect(() => {
    const options = State.getStatesOfCountry("US").map((state) => ({
      value: state.isoCode,
      /**Code added by Unnati on 15-09-2024
       * Reason-To add state name in state dropdown
       */
      name: state.name,
      /**End of code addition by Unnati on 15-09-2024
       * Reason-To add state name in state dropdown
       */
    }));
    setStates(options);
  }, []);
  const [billingStates, setBillingStates] = useState([]);
  useEffect(() => {
    const options = State.getStatesOfCountry("US").map((state) => ({
      value: state.isoCode,
      /**Code added by Unnati on 15-09-2024
       * Reason-To add state name in state dropdown
       */
      name: state.name,
      /**End of code addition by Unnati on 15-09-2024
       * Reason-To add state name in state dropdown
       */
    }));
    setBillingStates(options);
  }, []);
  /**Code commented by Unnati on 12-10-2024
   * Reason-This code is not in use
   */
  // const StateDropdown = ({ countryCode = "US", onStateChange }) => {

  // const handleStateChange = (event) => {
  //   const selectedOption = options.find(
  //     (option) => option.value === event.target.value
  //   );
  //   /**Code added by Unnati on 15-09-2024
  //    * Reason-To pass state name only
  //    */
  //   onStateChange(selectedOption.value);
  //   /**End of code addition by Unnati on 15-09-2024
  //    * Reason-To pass state name only
  //    */
  // };

  //   return (
  //     <select
  //       className={CheckOutStyles.dropdownOptions}
  //       onChange={handleStateChange}
  //       // defaultValue={shippingAddress.state}
  //       // value={shippingAddress.state}
  //     >
  //       {options.map((option, index) => (
  //         <option key={index} value={option.value}>
  //           {option.name} - {option.value}
  //         </option>
  //       ))}
  //     </select>
  //   );
  // };
  // const handleStateChange = (e) => {
  //   setChoosenState(e.target.value);
  // };
  /**End of code comment by Unnati on 12-10-2024
   * Reason-This code is not in use
   */
  useEffect(() => {
    if (shippingAddress?.state) {
      setChoosenState("");
    }
  }, [shippingAddress?.state]);

  const handleBillingStateChange = (e) => {
    setBillingChoosenState(e.target.value);
    /**Code added by Unnati on 20-10-2024
     * Reason-To set BillingStateError as empty string
     */
    setBillingStateError("");
    /**End of code addition by Unnati on 20-10-2024
     * Reason-To set BillingStateError as empty string
     */
  };
  /**End of code addition by Unnati on 22-07-2024
   * Reason-To have a state dropdown
   */
  /**Code added by Unnati on 01-08-2024
   * Reason-To check discount code is active or not
   */
  // const CheckDiscountIsActiveOrNot = async () => {
  //   try {
  //     const response = await IsDiscountActive(discountCode);
  //     setDiscount(response.id);
  /**Code added by Unnati on 19-09-2024
   * Reason-To set discount amount
   */
  // setDiscountAmount(response.discount_amount);
  /**End of code addition by Unnati on 19-09-2024
   * Reason-To set discount amount
   */
  //     notificationObject.success("Discount is active");
  //   } catch (error) {
  //     console.error("Error fetching cart details:", error);
  //   }
  // };

  /**End of code addition by Unnati on 01-08-2024
   * Reason-To check discount code is active or not
   */
  /**Code added by Unnati on 09-10-2024
   * Reason-To open and close shipping modal
   */
  const openShippingModal = () => {
    setShippingError("");
    setShippingFormData(initialShippingFormData);
    setIsShippingModalOpen(true);
  };
  const closeShippingModal = () => {
    setIsShippingModalOpen(false);
    /**Code added by Unnati on 20-10-2024
     * Reason-To set error as empty string
     */
    setFirstNameError("");
    setAddressError("");
    setCityError("");
    setStateError("");
    setZipCodeError("");
    setContactNumberError("");
    /**End of code addition by Unnati on 20-10-2024
     * Reason-To set error as empty string
     */
  };
  /**End of code addition by Unnati on 09-10-2024
   * Reason-To open and close shipping modal
   */
  /**Code added by Unnati on 09-10-2024
   * Reason-To open and close all addresses
   */
  const openAllAddress = () => {
    setisModalOpen(true);
  };
  const closeAllAddress = () => {
    setisModalOpen(false);
  };
  /**Code added by Unnati on 14-09-2024
   * Reason-To open and close all addresses
   */
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    /**Code added by Unnati on 20-10-2024
     * Reason-To setBilling error as empty string
     */
    setBillingFirstNameError("");
    setBillingAddressError("");
    setBillingCityError("");
    setBillingStateError("");
    setBillingZipCodeError("");
    setBillingContactNumberError("");
    /**End of code addition by Unnati on 20-10-2024
     * Reason-To setBilling error as empty string
     */
  };
  /**End of code addition by Unnati on 14-09-2024
   * Reason-To open and close modal
   */
  /**Code added by Unnati on 11-10-2024
   * Reason-To open and close edit modal
   */
  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };
  /**End of code addition by Unnati on 11-10-2024
   * Reason-To open and close edit modal
   */
  /**Code added by Unnati on 13-09-2024
   * Reason-To get user primary address when component loads
   */
  useEffect(() => {
    const fetchPrimaryShippingAddress = async () => {
      try {
        const data = await getPrimaryShippingAddress(user.id);
        setShippingAddress(data.userAddress[0]);
      } catch (error) {
        console.error("Error fetching shipping address:", error.message);
      }
    };

    fetchPrimaryShippingAddress();
  }, [user.id]);

  /**End of code addition by Unnati on 13-09-2024
   * Reason-To get user primary address when component loads
   */
  /**Code added by Unnati on 14-09-2024
   * Reason-To handle check box selection
   */

  const handleCheckboxChange = (e) => {
    setAddBillingAddress(null);
    setShipToSameAddress(e.target.checked);
    /**Code added by Unnati on 16-10-2024
     * Reason-TO SET BILLING ADDRRESS
     */
    setBillingAsShipping(temporaryShippingAddress);
    if (e.target.checked == false) {
      setBillingAsShipping(null);
      setChecked(false);
    }
    /**Code added by Unnati on 21-10-2024
     * Reason-Set billing error as empty string
     */
    setBillingError("");
    /**End of code addition by Unnati on 21-10-2024
     * Reason-Set billing error as empty string
     */
  };
  useEffect(() => {
    setBillingAsShipping(temporaryShippingAddress);
  }, [temporaryShippingAddress, handleCheckboxChange]);
  /**End of code additon  by Unnati on 16-10-2024
   * Reason-TO SET BILLING ADDRRESS
   */
  /**End of code addition by Unnati on 14-09-2024
   * Reason-To handle check box selection
   */
  /**Code added by Unnati on 07-10-2024
   * Reason-To handleSetPrimary
   */
  const handleAddressChange = async (addressId) => {
    /**Code commented by Unnati on 20-10-2024
     * Reason-This code is not in use
     */

    // const updatedAddresses = userAddress.map((address) =>
    //   address.id === addressId
    //     ? { ...address, is_primary: true }
    //     : { ...address, is_primary: false }
    // );
    // console.log("...udated address", updatedAddresses);
    //     const selectedAddress = updatedAddresses.find(
    //       (address) => address.id === addressId
    //     );
    // console.log("selected address",selectedAddress)
    //     const reorderedAddresses = [
    //       selectedAddress,
    //       ...updatedAddresses.filter((address) => address.id !== addressId),
    //     ];
    // console.log("re order",reorderedAddresses)
    // setUserAddress(reorderedAddresses);

    // setShippingAddress(updatedAddresses);
    /**End of code comment by Unnati on 20-10-2024
     * Reason-This code is not in use
     */
    /**Code added by Unnati on 20-10-2024
     * Reason-To find selected address from userAddress
     */
    setSelectedShippingAddressId(addressId);
    const selectedAddress = userAddress.find(
      (address) => address.id === addressId
    );
    setShippingAddress(selectedAddress);
    /**End of code addition by Unnati on 20-10-2024
     * Reason-To find selected address from userAddress
     */
    // Added by - Ashlekh on 15-01-2025
    // Reason - To store address in session storage
    if (selectedAddress) {
      sessionStorage.setItem("selectedShippingAddress", JSON.stringify(selectedAddress));
      sessionStorage.setItem("selectedShippingAddressId", JSON.stringify(selectedAddress.id));
    }
    // End of code - Ashlekh on 15-01-2025
    // Reason - To store address in session storage
    /** Code added by Unnati on 17-10-2024
     * Reason-To close modal
     */

    setisModalOpen(false);
    /** End of code addition by Unnati on 17-10-2024
     * Reason-To close modal
     */
  };
  /**Code commented by Unnati on 20-10-2024
   * Reason-This code is not in use
   */
  // useEffect(() => {
  //   // Reorder addresses to have the primary address at the top initially
  //   const primaryAddress = userAddress.find((address) => address.is_primary);
  //   const otherAddresses = userAddress.filter((address) => !address.is_primary);
  //   const reorderedAddresses = primaryAddress
  //     ? [primaryAddress, ...otherAddresses]
  //     : userAddress; // Fallback to original list if no primary address

  //   setUserAddress(reorderedAddresses);

  //   // Set the primary address as the default selected shipping address
  //   if (primaryAddress) {
  //     setShippingAddress(primaryAddress);
  //   }
  // }, [userAddress]);
  /**End of code comment by Unnati on 20-10-2024
   * Reason-This code is not in use
   */
  /*End of code addition by Unnati on 07-10-2024
   * Reason-To handleSetPrimary
   */
  /**Code added by Unnati on 07-10-2024
   * Reason-To handle expand and collapse
   */
  // const toggleExpand = () => {
  //   setIsExpanded(!isExpanded);
  // };
  /**End of code addition by Unnati on 07-10-2024
   * Reason-To handle expand and collapse
   */
  /**Code added by Unnati on 10-10-2024
   * Reaso-To handle edit
   */
  const handleEdit = (addressId) => {
    setSelectedAddressId(addressId);

    const selectedAddress = userAddress.find(
      (address) => address.id === addressId
    );
    setFormData({
      first_name: selectedAddress.first_name || "",
      last_name: selectedAddress.last_name || "",
      company: selectedAddress.company || "",
      address: selectedAddress.address || "",
      city: selectedAddress.city || "",
      state: selectedAddress.state || "",
      zipcode: selectedAddress.zipcode || "",
      contact_number: selectedAddress.contact_number || "",
    });

    setIsEditModalOpen(true);
  };
  /**End of code addition by Unnati on 10-10-2024
   * Reaso-To handle edit
   */
  /**Code added by Unnati on 10-10-2024
   * Reason-To handle change for edit form
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  /**End of code addition by Unnati on 10-10-2024
   * Reason-To handle change for edit form
   */
  /**Code added by Unnati on 17-10-2024
   * Reason-To calculate subtotal
   */
  const calculateSubtotal = () => {
    /* Added by jhamman om 09-10-2024
    Reason - showing error cartData.reduce is not a function*/
    if (!Array.isArray(cartData)) {
      return 0;
    }
    /* End of addition by jhamman om 09-10-2024
    Reason - showing error cartData.reduce is not a function*/
    var total = 0;
    cartData.forEach((item) => {
      // Added by - Ashlekh on 28-12-2024
      // Reason - If item is not active then Subtotal will not calculate
      if (item.is_active == false){
        return;
      }
      // End of code - Ashlekh on 28-12-2024
      // Reason - If item is not active then Subtotal will not calculate
      const price = item.sales_rate
        ? item.sale_percentage
          ? calculateDiscountFromProduct(item.sales_rate, item.sale_percentage)
          : item.sales_rate
        : 0;

      const finalPrice =
        // Code changed by - Ashlekh on 06-03-2025
        // Reason - To add customization fields
        // item.logo || item.patches || item.security_batches || item.embroider
        item.logo || item.patches || item.security_batches || item.security_id_on_back || item.printed_id || item.embroider
        // End of code - Ashlekh on 06-03-2025
        // Reason - To add customization fields
          ? item.after_customization_product_price || price
          : price;

      total += finalPrice * item.quantity;
    });
    /**Code modified by Unnati on 07-12-2024
     * Reason-Added to fixed
     */
    // return total;
    return parseFloat(total.toFixed(2));
    /**End of code modification by Unnati on 07-12-2024
     * Reason-Added to fixed
     */
  };

  const grand_total = calculateSubtotal();

  /*End of code addition by Unnati on 17-10-2024
   * Reason-To calculate subtotal
   */
  // Added by - Ashlekh on 25-10-2024
  // Reason - To add out of stock and in active message in useEffect
  useEffect(() => {
    // Code changed by - Ashlekh on 06-12-2024
    // Reason - To add condition for color
    // if (isStockChecked || isInActiveChecked) {
    if (isStockChecked || isInActiveChecked || isColorChecked) {
      // End of code - Ashlekh on 06-12-2024
      // Reason - To add condition for color
      let modalContent = "";
      if (showOutOfStockMessage?.length > 0) {
        let outOfStockMessage =
          "<p style='text-align: center;'><strong>Some item(s) are out of stock:</strong></p><br/>";
        const detailedMessage = showOutOfStockMessage?.map((item) => {
          // Code changed by - Ashlekh on 05-12-2024
          // Reason - To add background color in popup
          // return `<strong>Product:</strong> ${item.product_name}, <strong>Available Quantity:</strong> <span style='color:red'>${item.available_qty}</span><br/>`;
          // Code changed by - Ashlekh on 18-12-2024
          // Reason - To display color and size
          //   return `
          //   <div style="background-color: #e7e7e7; padding: 5px; border-radius: 5px;">
          //     <strong>Product:</strong> ${item.product_name}, 
          //     <strong>Available Quantity:</strong> <span style="color: red;">${item.available_qty}</span>
          //   </div>
          // `;
          return `
          <div style="background-color: #e7e7e7; padding: 5px; border-radius: 5px;">
            <strong>Product:</strong> ${item.product_name}, 
            <strong style="padding-left: 3px">Size:</strong> ${item.requested_size},
            <strong style="padding-left: 3px">Color:</strong> 
            <span style="
              display: inline-block; 
              background-color: ${item.color}; 
              width: 15px; 
              height: 15px; 
              border-radius: 50%; 
              border: 1px solid #ccc;
              vertical-align: middle;
            "></span>
            <strong style="padding-left: 3px">Available Quantity:</strong> <span style="color: red;">${item.available_qty}</span>
          </div>
        `;
        // End of code - Ashlekh on 18-12-2024
        // Reason - To display color and size
          // End of code - Ashlekh on 05-12-2024
          // Reason - To add background color in popup
        });
        outOfStockMessage = outOfStockMessage + detailedMessage;
        modalContent = modalContent + outOfStockMessage;
      }

      if (showInActiveMessage?.length > 0) {
        let inActiveMessage =
          // Code changed by - Ashlekh on 28-12-2024
          // Reason - To change message
          // "<br/><p style='text-align: center;'><strong>Some item(s) are inactive:</strong></p><br/>";
          "<br/><p style='text-align: center;'><strong>Some item(s) are not available:</strong></p><br/>";
          // End of code - Ashlekh on 28-12-2024
          // Reason - To change message
        const productInActiveMessage = showInActiveMessage.map((item) => {
          // Code changed by - Ashlekh on 05-12-2024
          // Reason - To add background color in popup
          // return `<strong>Product :</strong> ${item.product_name} is inactive<br/>`;
          return `
            <div style="background-color: #e7e7e7; padding: 5px; border-radius: 5px;">
              <strong>Product :</strong> Product (${item.product_name}) is not available<br/>
            </div>
          `;
          // End of code - Ashlekh on 05-12-2024
          // Reason - To add background color in popup
        });
        inActiveMessage = inActiveMessage + productInActiveMessage;
        modalContent = modalContent + inActiveMessage;
      }
      // Added by - Ashlekh on 06-12-2024
      // Reason - If product color is not available then to display message in popup
      if (showColorIssues) {
        let colorMessage =
          "<br/><p style='text-align: center;'><strong>Some item(s) color are not available:</strong></p><br/>";
        // Code changed by - Ashlekh on 17-01-2025
        // Reason - To show color in popup
        // const colorIssueMessage = `
        //   <div style="background-color: #e7e7e7; padding: 5px; border-radius: 5px;">
        //     <span style="">Product $ color not available</span>
        //   </div>
        // `;
        const colorIssueMessage = `
          <div style="background-color: #e7e7e7; padding: 5px; border-radius: 5px; align-items: center">
            <span >Product <strong>(${showColorIssues.product_name})</strong> color </span>
            <div style="margin-left: 10px; margin-right: 10px; height: 15px; width: 15px; background-color: ${showColorIssues.requested_color}; border-radius: 5px; display: inline-block;"></div>
            <span>is not available</span>
          </div>
        `;
        // End of code - Ashlekh on 17-01-2025
        // Reason - To show color in popup
        colorMessage = colorMessage + colorIssueMessage;
        modalContent = modalContent + colorMessage;
      }
      // End of code - Ashlekh on 06-12-2024
      // Reason - If product color is not available then to display message in popup
      if (modalContent) {
        setModalMessage(modalContent);
        setIsModalVisible(true);
      }
      setIsStockChecked(false);
      setIsInActiveChecked(false);
      // Added by - Ashlekh on 06-12-2024
      // Reason - To set color useState false
      setIsColorChecked(false);
      // End of code - Ashlekh on 06-12-2024
      // Reason - To set color useState false
    }
  }, [
    isStockChecked,
    isInActiveChecked,
    showOutOfStockMessage,
    showInActiveMessage,
    // Added by - Ashlekh on 06-12-2024
    // Reason - To add color dependency in useEffect
    isColorChecked,
    showColorIssues,
    // End of code - Ashlekh on 06-12-2024
    // Reason - To add color dependency in useEffect
  ]);
  // End of code - Ashlekh on 25-10-2024
  // Reason - To add out of stock and in active message in useEffect
  // Added by - Ashlekh on 23-10-2024
  // Reason - To check stock
  /**Code added by Unnati on 27-10-2024
   * Reason-Added order information
   */
  const checkStock = async (orderInformation) => {
    /**End of code addition by Unnati on 27-10-2024
     * Reason-Added order information
     */
    try {
      // Added by - Ashlekh on 19-12-2024
      // Reason - To clear previous messages
      setModalMessage("");
      setShowInActiveMessage([]);
      setShowOutOfStockMessage([]);
      setShowColorIssues(null);
      // End of code - Ashlekh on 19-12-2024
      // Reason - To clear previous messages
      const response = await postCartDetailsAPI(cartData);
      // Added by - Ashlekh on 25-10-2024
      // Reason - To check response and set message in antd modal
      if (response?.message == "Cart is empty") {
        setModalMessage("Cart is empty, Please add items in cart");
        setIsModalVisible(true);
      } else if (response?.message == "Product is inactive") {
        setShowInActiveMessage(response?.inactive_products);
        setIsInActiveChecked(true);
      } else if (response?.message == "Stock not available") {
        setShowOutOfStockMessage(response?.stock_issues);
        setIsStockChecked(true);
      }
      // Added by - Ashlekh on 06-12-2024
      // Reason - To add condition if color is not available
      else if (response?.message == "Requested color is not available") {
        setShowColorIssues(response?.details);
        setIsColorChecked(true);
      }
      // End of code - Ashlekh on 06-12-2024
      // Reason - To add condition if color is not available
      else {
        /**
         * Modified by - Ashish Dewangan on 15-12-2024
         * Reason - To get latest details of cart and if selected customizations were disabled by user then dont proceed
         */

        // navigate("/paymentdetail", {
        //   /**Code added by Unnati on 27-10-2024
        //    * Reason-Added order information
        //    */
        //   /**
        //    * Modified by - Ashish Dewangan on 27-11-2024
        //    * Reason - to pass selectedPaymentGateway in state
        //    */
        //   // state: { Order: orderInformation },
        //   state: {
        //     Order: orderInformation,
        //     selectedPaymentGateway: selectedPaymentGateway,
        //   },
        //   /**
        //    * End of modification by - Ashish Dewangan on 27-11-2024
        //    * Reason - to pass selectedPaymentGateway in state
        //    */
        //   /**End of code addition  by Unnati on 27-10-2024
        //    * Reason-Added order information
        //    */
        // });

        let isCustomizationInvalid = false;
        if (user && user.id) {
          const product = cartData.map((item) => item.product);
          const res = await getCartItem(product, user.id);
          setCartData(res.products);

          res.products?.forEach((item) => {
            if (
              (item.show_patches_and_embroider_on_UI != true &&
                (item.logo == true ||
                  item.patches == true ||
                  item.security_batches == true ||
                  // Added by - Ashlekh on 06-03-2025
                  // Reason - To add customization fields
                  item.security_id_on_back ||
                  item.printed_id ||
                  // End of code - Ashlekh on 06-03-2025
                  // Reason - To add customization fields
                  item.embroider == true)) ||
              (item.logo && (!item.logo_price || item.logo_price <= 0)) ||
              (item.patches &&
                (!item.patches_price || item.patches_price <= 0)) ||
              (item.embroider &&
                (!item.embroider_price || item.embroider_price <= 0)) ||
              (item.security_batches &&
                (!item.security_batches_price ||
                  item.security_batches_price <= 0)) ||
              // Added by - Ashlekh on 06-03-2025
              // Reason - To add customization
              (item.security_id_on_back &&
                (!item.security_id_on_back_price || item.security_id_on_back_price <= 0)) ||
              (item.printed_id &&
                (!item.printed_id_price || item.printed_id_price <= 0))
              // End of code - Ashlekh on 06-03-2025
              // Reason - To add customization
            ) {
              isCustomizationInvalid = true;
            }
          });
        }

        if (isCustomizationInvalid == false) {
          navigate("/paymentdetail", {
            /**Code added by Unnati on 27-10-2024
             * Reason-Added order information
             */
            /**
             * Modified by - Ashish Dewangan on 27-11-2024
             * Reason - to pass selectedPaymentGateway in state
             */
            // state: { Order: orderInformation },
            state: {
              Order: orderInformation,
              selectedPaymentGateway: selectedPaymentGateway,
            },
            /**
             * End of modification by - Ashish Dewangan on 27-11-2024
             * Reason - to pass selectedPaymentGateway in state
             */
            /**End of code addition  by Unnati on 27-10-2024
             * Reason-Added order information
             */
          });
        }

        /**
         * End of modification by - Ashish Dewangan on 15-12-2024
         * Reason - To get latest details of cart and if selected customizations were disabled by user then dont proceed
         */
      }
      // End of code - Ashlekh on 25-10-2024
      // Reason - To check response and set message in antd modal
      // Commented by - Ashlekh on 25-10-2024
      // Reason - out of stock and in active responses are handled in response of postCartDetailsAPI
      // Added by - Ashlekh on 24-10-2024
      // Reason - To set response for details of not available in useState and set response of inactive product
      // setShowOutOfStockMessage(response?.stock_issues);
      // setShowInActiveMessage(response?.inactive_products);
      // End of code - Ashlekh on 24-10-2024
      // Reason - To set response for details of not available in useState and set response of inactive product
      // End of comment - Ashlekh on 25-10-2024
      // Reason - out of stock and in active responses are handled in response of postCartDetailsAPI
      if (response?.message) {
        return response.message;
      }
    } catch (error) {
      console.error("Error checking stock ", error);
    }
  };
  // End of code - Ashlekh on 23-10-2024
  // Reason - To check stock

  // Added by - Ashlekh on 26-10-2024
  // Reason - To handle delete
  const handleDeleteClick = (
    product,
    size,
    logo,
    patches,
    security_batches,
    // Added by - Ashlekh on 06-03-2025
    // Reason - To add customization
    security_id_on_back,
    printed_id,
    // End of code - Ashlekh on 06-03-2025
    // Reason - To add customization
    embroider,
    color
  ) => {
    setItemToDelete({
      product,
      size,
      logo,
      patches,
      security_batches,
      // Added by - Ashlekh on 06-03-2025
      // Reason - To add customization
      security_id_on_back,
      printed_id,
      // End of code - Ashlekh on 06-03-2025
      // Reason - To add customization
      embroider,
      color,
    });
    setModalVisible(true);
  };
  const confirmDelete = () => {
    if (itemToDelete) {
      handleDelete(
        itemToDelete.product,
        itemToDelete.size,
        itemToDelete.logo,
        itemToDelete.patches,
        itemToDelete.security_batches,
        // Added by - Ashlekh on 06-03-2025
        // Reason - To add customization
        itemToDelete.security_id_on_back,
        itemToDelete.printed_id,
        // End of code - Ashlekh on 06-03-2025
        // Reason - To add customization
        itemToDelete.embroider,
        itemToDelete.color
      );
      setItemToDelete(null);
    }
    setModalVisible(false);
  };
  const cancelDelete = () => {
    setItemToDelete(null);
    setModalVisible(false);
  };
  // End of code - Ashlekh on 26-10-2024
  // Reason - To handle delete
  // Added by - Ashlekh on 26-10-2024
  // Reason - To update cart in cartData and localstorage when delete icon is clicked
  const handleDelete = (
    product,
    size,
    logo,
    patches,
    security_batches,
    // Added by - Ashlekh on 06-03-2025
    // Reason - To add customization
    security_id_on_back,
    printed_id,
    // End of code - Ashlekh on 06-03-2025
    // Reason - To add customization
    embroider,
    color
  ) => {
    if (user.id) {
      const deleteProduct = async () => {
        try {
          const data = await removeItem(
            user.id,
            product,
            size,
            logo,
            patches,
            security_batches,
            // Added by - Ashlekh on 06-03-2025
            // Reason - To add customization
            security_id_on_back,
            printed_id,
            // End of code - Ashlekh on 06-03-2025
            // Reason - To add customization
            embroider,
            color
          );
          localStorage.setItem("cartData", JSON.stringify(data.cartItem));
          setCartData(data.cartItem);
        } catch (error) {
          console.error(error.message);
        }
      };
      deleteProduct();
    } else {
      const updatedData = cartData
        .map((item) => {
          if (
            item.product === product &&
            item.logo === logo &&
            item.patches === patches &&
            item.security_batches === security_batches &&
            // Added by - Ashlekh on 06-03-2025
            // Reason - To add customization
            item.security_id_on_back === security_id_on_back &&
            item.printed_id === printed_id &&
            // End of code - Ashlekh on 06-03-2025
            // Reason - To add customization
            item.embroider === embroider &&
            item.size === size &&
            item.color === color
          ) {
            return null;
          } else {
            return item;
          }
        })
        .filter((item) => item !== null);
      localStorage.setItem("cartData", JSON.stringify(updatedData));
      setCartData(updatedData);
    }
  };
  // End of code - Ashlekh on 26-10-2024
  // Reason - To update cart in cartData and localstorage when delete icon is clicked
  // Added by - Ashlekh on 26-10-2024
  // Reason - To have function for increasing & decreasing quantity
  const handleQuantityChange = async (
    userId,
    productId,
    currentQuantity,
    size,
    color,
    logo,
    patches,
    security_batches,
    // Added by - Ashlekh on 06-03-2025
    // Reason - To add customization
    security_id_on_back,
    printed_id,
    // End of code - Ashlekh on 06-03-2025
    // Reason - To add customization
    embroider,
    action
  ) => {
    let newQuantity = currentQuantity;
    // Added by - Ashlekh on 11-12-2024
    // Reason - To clear stock validation message usestate
    setStockValidationMessage({});
    // End of code - Ashlekh on 11-12-2024
    // Reason - To clear stock validation message usestate
    console.log(newQuantity, currentQuantity, "checkkkk");
    if (userId == null && userId == undefined) {
      const cartData = JSON.parse(localStorage.getItem("cartData")) || [];
      const updatedCartData = cartData?.map((item) => {
        const matchedProduct =
          item.product == productId &&
          item.size == size &&
          item.color == color &&
          item.logo == logo &&
          item.patches == patches &&
          item.security_batches == security_batches &&
          // Added by - Ashlekh on 06-03-2025
          // Reason - To add customization
          item.security_id_on_back == security_id_on_back &&
          item.printed_id == printed_id &&
          // End of code - Ashlekh on 06-03-2025
          // Reason - To add customization
          item.embroider == embroider;
        if (matchedProduct) {
          return { ...item, quantity: newQuantity };
        } else {
          return item;
        }
      });
      localStorage.setItem("cartData", JSON.stringify(updatedCartData));
      setCartData(updatedCartData);
    } else {
      if (action == "increase") {
        newQuantity = currentQuantity + 1;
        // Code changed by - Ashlekh on 07-12-2024
        // Reason - To change condition. Quantity can be sent 0 from frontend (If 0 is sent then from backend error message will come)
        // } else if (action == "decrease" && currentQuantity > 1) {
      } else if (action == "decrease") {
        // End of code - Ashlekh on 07-12-2024
        // Reason - To change condition. Quantity can be sent 0 from frontend (If 0 is sent then from backend error message will come)
        newQuantity = currentQuantity - 1;
      }
      // Modification and addition by Om Shrivastava on 04-12-2024
      // Reason : Send the customized details
      //   const response = await updateCartQuantityAPI(
      //     userId,
      //     productId,
      //     newQuantity,
      //     size,
      //     color,
      //     logo,patches,security_batches,embroider
      //   );
      //   console.log(response);
      //   if (response?.message == "success") {
      //     localStorage.setItem(
      //       "cartData",
      //       JSON.stringify(response?.updated_cart_data)
      //     );
      //     setCartData(response?.updated_cart_data);
      //     // Added by - Ashlekh on 30-11-2024
      //     // Reason - To remove stock validation message if product quantity is available
      //     setStockValidationMessage({});
      //     // End of code - Ashlekh on 30-11-2024
      //     // Reason - To remove stock validation message if product quantity is available
      //   } else if (response?.message == "quantity_exceeds") {
      //     // Added by - Ashlekh on 30-11-2024
      //     // Reason - To display stock validation message if product quantity is not available
      //     const updatedCartData = response?.updated_cart_data;
      //     setStockValidationMessage((prevMessages) => {
      //       if (response?.available_quantity == 0 || response?.available_quantity == "Stock Not available") {
      //         return {
      //           ...prevMessages,
      //           [`${productId}-${size}-${color}`]: `This product is out of stock for ${size}. Please remove this product.`,
      //         };
      //       } else{
      //         localStorage.setItem(
      //           "cartData",
      //           JSON.stringify(response?.updated_cart_data)
      //         );
      //         setCartData(response?.updated_cart_data);
      //         return {
      //           ...prevMessages,
      //           [`${productId}-${size}-${color}`]: `Only ${response.available_quantity} item(s) available in ${size}`,
      //         };
      //       }
      //     });
      //     // End of code - Ashlekh on 30-11-2024
      //     // Reason - To display stock validation message if product quantity is not available
      //     // Commented by - Ashlekh on 30-11-2024
      //     // Reason - No need to display stock validation message in popup
      //     // setErrorMessage("Quantity exceeds");
      //     // setErrorModalVisible(true);
      //     // End of comment - Ashlekh on 30-11-2024
      //     // Reason - No need to display stock validation message in popup
      //   }
      // }
      const response = await updateCartQuantityAPI(
        userId,
        productId,
        newQuantity,
        size,
        color,
        logo,
        patches,
        security_batches,
        // Added by - Ashlekh on 06-03-2025
        // Reason - To add customization
        security_id_on_back,
        printed_id,
        // End of code - Ashlekh on 06-03-2025
        // Reason - To add customization
        embroider
      );
      console.log(response);
      if (response?.message == "success") {
        localStorage.setItem(
          "cartData",
          JSON.stringify(response?.updated_cart_data)
        );
        setCartData(response?.updated_cart_data);
        // Added by - Ashlekh on 11-12-2024
        // Reason - To clear stock validation message usestate
        setStockValidationMessage({});
        // End of code - Ashlekh on 11-12-2024
        // Reason - To clear stock validation message usestate
      } else if (response?.message == "quantity_exceeds") {
        // Added by - Ashlekh on 18-12-2024
        // Reason - To add message if quantity is zero
        if(response?.available_quantity == 0) {
          setStockValidationMessage((prev) => ({
            ...prev,
            [`${productId}-${size}-${color}`]: `Stock is not available in size ${size}`,
          }));
        } else{
        // End of code - Ashlekh on 18-12-2024
        // Reason - To add message if quantity is zero
          // Code changed by - Ashlekh on 11-12-2024
          // Reason - To display validation message below quantity, not in modal
          // setErrorMessage("Quantity exceeds");
          // setErrorModalVisible(true);
          setStockValidationMessage((prev) => ({
            ...prev,
            // Code changed by - Ashlekh on 16-12-2024
            // Reason - If the same product has multiple sizes, the validation message appears multiple times
            // [productId]: `Only ${response?.available_quantity} quantity available in size ${size}`,
            [`${productId}-${size}-${color}`]: `Only ${response?.available_quantity} quantity available in size ${size}`,
            // End of code - Ashlekh on 16-12-2024
            // Reason - If the same product has multiple sizes, the validation message appears multiple times
          }));
          // End of code - Ashlekh on 11-12-2024
          // Reason - To display validation message below quantity, not in modal
        }
      }
      // Added by - Ashlekh on 07-12-2024
      // Reason - To add condition. If quantity is less than 1
      else if (response?.message == "Quantity cannot be less than one") {
        // Code changed by - Ashlekh on 11-12-2024
        // Reason - To display validation message below quantity, not in modal
        // setErrorMessage("Quantity cannot be less than one")
        // setErrorModalVisible(true);
        setStockValidationMessage((prev) => ({
          ...prev,
          // Code changed by - Ashlekh on 16-12-2024
          // Reason - If the same product has multiple sizes, the validation message appears multiple times
          // [productId]: "Quantity cannot be less than one.",
          [`${productId}-${size}-${color}`]:
            "Quantity cannot be less than one.",
          // End of code - Ashlekh on 16-12-2024
          // Reason - If the same product has multiple sizes, the validation message appears multiple times
        }));
        // End of code - Ashlekh on 11-12-2024
        // Reason - To display validation message below quantity, not in modal
      }
      // End of code - Ashlekh on 07-12-2024
      // Reason - To add condition. If quantity is less than 1
    }
    // End of modification and addition by Om Shrivastava on 04-12-2024
    // Reason : Send the customized details
  };
  const handleErrorModal = () => {
    setErrorModalVisible(false);
    setErrorMessage("");
  };

  const getQuantity = (productId, size, quantity) => {
    return quantities[`${productId}-${size}`] || quantity;
  };
  // End of code - Ashlekh on 26-10-2024
  // Reason - To have function for increasing & decreasing quantity
  return (
    /**Code added by Unnati on 20-07-2024
     * Reason-To create checkout page form
     */
    <div className={CheckOutStyles.pageFrame}>
      <div className={CheckOutStyles.pageContainer}>
        {/**Code added by Unnati on 11-09-2024
         *Reason-To have navigation link */}
        <NavigationPath navigationPathArray={navigationPath} />
        {/**End of code addition by Unnati on 11-09-2024
         *Reason-To have navigation link */}
        {/**Code added by Unnati on 03-10-2024
         *Reason-Modified heading */}
        <h2 className={CheckOutStyles.title}>Checkout</h2>
        {/**End of code addition by Unnati on 03-10-2024
         *Reason-Modified heading */}
        <div className={CheckOutStyles.checkoutContainer}>
          <form className={CheckOutStyles.shippingForm} onSubmit={handleSubmit}>
            {/**Code added by Unnati on 07-10-2024
             *Reason-Added radio buttton for primaryaddresses */}
            <div>
              {/**End of code addition by Unnati on 07-10-2024
               *Reason-Added radio buttton for primaryaddresses */}
              {/**Code added by Unnati on 13-09-2024
               *Reason-To have checkbox for ship to same address */}
              <div className={CheckOutStyles.checkoutColumn}>
                <div className={CheckOutStyles.heading}>
                  <h4 className={CheckOutStyles.columnTitle}>
                    Billing Address
                  </h4>
                  {/**Code added by Unnati on 16-10-2024
                    To show billing address */}
                  {shipToSameAddress ? null : (
                    <div
                      className={CheckOutStyles.AddAddress}
                      onClick={() => {
                        setBillingError("");
                        openModal();
                      }}
                    >
                      <div className={CheckOutStyles.addIcon}>
                        {/**Code added by Unnati on 20-10-2024
                         *Reason-To show edit address button after user adds address */}
                        {buttonChange ? (
                          <MdEdit color="white" />
                        ) : (
                          <IoIosAddCircleOutline />
                        )}
                      </div>

                      <label className={CheckOutStyles.AddAddressText}>
                        {buttonChange ? "Edit Address" : "Add Address"}
                      </label>
                      {/**End of code addition by Unnati on 20-10-2024
                       *Reason-To show edit address button after user adds address */}
                    </div>
                  )}
                </div>
                {/**End of code additon by Unnati on 16-10-2024
                    To show billing address */}
                {/* Added by - Ashlekh on 21-11-2024
                Reason - To keep Same as shipping address in div */}
                <div className={`${CheckOutStyles.primaryRadioContainer}`}>
                  {/* End of code - Ashlekh on 21-11-2024
                  Reason - To keep Same as shipping address in div */}
                  <label className={CheckOutStyles.primaryRadio}>
                    <input
                      type="checkbox"
                      checked={shipToSameAddress ? true : false}
                      onChange={handleCheckboxChange}
                    />
                    {/**Code added by Unnati on 18-10-2024
                     *Reason-Changed label text */}
                    Same as Shipping Address
                    {/**End of code addition by Unnati on 18-10-2024
                     *Reason-Changed label text */}
                  </label>
                </div>
                {/**Code added by Unnati on 20-10-2024
                 *Reason-To show address when ticked same as shipping address */}
                {shipToSameAddress &&
                  userAddress
                    .filter(
                      (address) => address.id === selectedShippingAddressId
                    )
                    .map((address, index) => (
                      <div
                        key={address.id}
                        className={`${CheckOutStyles.addressItem} ${
                          index % 2 === 0
                            ? CheckOutStyles.even
                            : CheckOutStyles.odd
                        }`}
                      >
                        <div className={CheckOutStyles.addressContent}>
                          <div className={CheckOutStyles.addressInfo}>
                            <p className={CheckOutStyles.name}>
                              {address.first_name} {address.last_name}{" "}
                              {address.company} {address.address},{" "}
                              {address.city}, {address.state} {address.zipcode},{" "}
                              {/* Code changed by - Ashlekh on 25-11-2024
                              Reason - To display phone number */}
                              {/* {address.country} {address.phone_number} */}
                              {address.country} {address.contact_number}
                              {/* End of code - Ashlekh on 25-11-2024
                              Reason - To display phone number */}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                {/**End of code addition by Unnati on 20-10-2024
                 *Reason-To show address when ticked same as shipping address */}
                {/**Code added by Unnati on 16-10-2024
                    To show billing address */}
                {checked &&
                billingAsShipping &&
                Object.keys(billingAsShipping).length > 0 ? (
                  <div>
                    <p className={CheckOutStyles.address}>
                      {billingAsShipping.first_name}{" "}
                      {billingAsShipping.last_name} {billingAsShipping.company}{" "}
                      {billingAsShipping.address}, {billingAsShipping.city},{" "}
                      {billingAsShipping.state} {billingAsShipping.zipcode},{" "}
                      {billingAsShipping.country}{" "}
                      {billingAsShipping.phone_number}
                    </p>
                  </div>
                ) : null}
                {/**End of code addition by Unnati on 16-10-2024
                    To show billing address */}

                {shipToSameAddress && (
                  <p
                    /**Code added by Unnati on 30-09-2024
                     *Reason-Added setBilling error */
                    onClick={() => setBillingError("")}
                    /**End of code addition by Unnati on 30-09-2024
                     *Reason-Added setBilling error */
                    className={CheckOutStyles.text}
                  >
                    {/* Using the same address for billing. */}
                  </p>
                )}
                {billingError && (
                  <div className={CheckOutStyles.formInputError}>
                    {billingError}
                  </div>
                )}
                {/**Code added by Unnati on 16-10-2024
                    To show shipping address */}
                {addBillingAddress &&
                Object.keys(addBillingAddress).length > 0 ? (
                  <div>
                    <p className={CheckOutStyles.address}>
                      {addBillingAddress.first_name}{" "}
                      {addBillingAddress.last_name} {addBillingAddress.company}{" "}
                      {addBillingAddress.address}, {addBillingAddress.city},{" "}
                      {addBillingAddress.state} {addBillingAddress.zipcode},{" "}
                      {addBillingAddress.country}{" "}
                      {/* Code changed by - Ashlekh on 25-11-2024
                      Reason - To display contact number */}
                      {/* {addBillingAddress.phone_number} */}
                      {addBillingAddress.contact_number}
                      {/* End of code - Ashlekh on 25-11-2024
                      Reason - To display contact number */}
                    </p>
                  </div>
                ) : null}
                {/**Code added by Unnati on 16-10-2024
                    To show shipping address */}
                {/**Code added by Unnati on 14-09-2024
                 *Reason-To open billing address form in modal */}
                {IsModalOpen && (
                  <div className={CheckOutStyles.modalOverlay}>
                    <div className={CheckOutStyles.modalContainer}>
                      <div className={CheckOutStyles.modalHeader}>
                        <h2>Add Address</h2>
                        {/* <div className="closeButton" onClick={closeModal}> */}
                        <div
                          className={CheckOutStyles.closeButton}
                          onClick={closeModal}
                        >
                          &times;
                        </div>
                      </div>

                      <div className={CheckOutStyles.modalBody}>
                        <div className={CheckOutStyles.rowContainer}>
                          <div className={CheckOutStyles.fieldName}>
                            <label>First Name</label>
                            <span className={CheckOutStyles.mandatory}>*</span>
                          </div>
                          <input
                            type="text"
                            name="first_name"
                            /**Modified code on 24-10-2024
                             * Reason-Changed variable
                             */
                            value={billingFormData.first_name}
                            /**End of code on 24-10-2024
                             * Reason-Changed variable
                             */
                            /**Code added by Unnati on 20-10-2024
                             *Reason-To clear error */
                            onChange={(e) => {
                              handleInputChange(e);
                              setBillingFirstNameError("");
                            }}
                            /*End of code addition by Unnati on 20-10-2024
                             *Reason-To clear error */
                            onBlur={(e) =>
                              isValidOnBlur("first_name", e.target.value)
                            }
                          />
                          <div className={CheckOutStyles.formInputError}>
                            {billingFirstNameError}
                          </div>
                        </div>

                        <div className={CheckOutStyles.rowContainer}>
                          <div className={CheckOutStyles.fieldName}>
                            <label>Last Name</label>
                          </div>
                          <input
                            type="text"
                            name="last_name"
                            /**Modified code on 24-10-2024
                             * Reason-Changed variable
                             */
                            value={billingFormData.last_name}
                            /**End of code on 24-10-2024
                             * Reason-Changed variable
                             */
                            onChange={handleInputChange}
                          />
                        </div>
                        {/**Code commented by Unnati on 21-10-2024
                         *Reason-To remove company */}
                        {/* <div className={CheckOutStyles.rowContainer}>
                          <div className={CheckOutStyles.fieldName}>
                            <label>Company</label>
                          </div>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            onBlur={(e) =>
                              isValidOnBlur("company", e.target.value)
                            }
                          />
                        </div> */}
                        {/**End of code commented by Unnati on 21-10-2024
                         *Reason-To remove company */}
                        <div className={CheckOutStyles.rowContainer}>
                          <div className={CheckOutStyles.fieldName}>
                            <label>Address</label>
                            <span className={CheckOutStyles.mandatory}>*</span>
                          </div>
                          <input
                            type="text"
                            name="address"
                            /**Modified code on 24-10-2024
                             * Reason-Changed variable
                             */
                            value={billingFormData.address}
                            /**End of code on 24-10-2024
                             * Reason-Changed variable
                             */
                            /**Code added by Unnati on 20-10-2024
                             *Reason-To clear error */
                            onChange={(e) => {
                              handleInputChange(e);
                              setBillingAddressError("");
                            }}
                            /**End of code addition by Unnati on 20-10-2024
                             *Reason-To clear error */
                            onBlur={(e) =>
                              isValidOnBlur("address", e.target.value)
                            }
                          />
                          <div className={CheckOutStyles.formInputError}>
                            {billingAddressError}
                          </div>
                        </div>

                        <div className={CheckOutStyles.rowContainer}>
                          <div className={CheckOutStyles.fieldName}>
                            <label>City</label>
                            <span className={CheckOutStyles.mandatory}>*</span>
                          </div>
                          <input
                            type="text"
                            name="city"
                            /**Modified code on 24-10-2024
                             * Reason-Changed variable
                             */
                            value={billingFormData.city}
                            /**End of code on 24-10-2024
                             * Reason-Changed variable
                             */
                            /**Code added by Unnati on 20-10-2024
                             *Reason-To clear error */
                            onChange={(e) => {
                              handleInputChange(e);
                              setBillingCityError("");
                            }}
                            /**End of code addition by Unnati on 20-10-2024
                             *Reason-To clear error */
                            onBlur={(e) =>
                              isValidOnBlur("city", e.target.value)
                            }
                          />
                          <div className={CheckOutStyles.formInputError}>
                            {billingCityError}
                          </div>
                        </div>
                        <div className={CheckOutStyles.rowContainer}>
                          <div className={CheckOutStyles.fieldName}>
                            <label>Country</label>
                            <span className={CheckOutStyles.mandatory}>*</span>
                          </div>
                          <input
                            type="text"
                            value="United States"
                            className={CheckOutStyles.countrydropdownOptions}
                            readOnly
                          />
                          <div className={CheckOutStyles.formInputError}>
                            {countryError}
                          </div>
                        </div>
                        <div className={CheckOutStyles.rowContainer}>
                          <div className={CheckOutStyles.fieldName}>
                            <label>State</label>
                            <span className={CheckOutStyles.mandatory}>*</span>
                          </div>

                          <select
                            className={CheckOutStyles.dropdownOptions}
                            /**Code added by Unnati on 20-10-2024
                             *Reason-To clear error */
                            // onChange={handleBillingStateChange}
                            onChange={(e) => {
                              handleBillingStateChange(e);
                            }}
                            /**End of code addition by Unnati on 20-10-2024
                             *Reason-To clear error */
                            defaultValue={billingChoosenState}
                          >
                            <option value="" disabled>
                              Select a state
                            </option>
                            {billingStates.map((option, index) => (
                              /* Modified by jhamman on 13-10-2024
                              Reason - it firstly only give us code , but we want full form of state*/
                              /* <option key={index} value={option.value}> */
                              <option key={index} value={option.name}>
                                {/* Modified by jhamman on 13-10-2024
                              Reason - it firstly only give us code , but we want full form of state*/}
                                {option.name} - {option.value}
                              </option>
                            ))}
                          </select>
                          <div className={CheckOutStyles.formInputError}>
                            {billingStateError}
                          </div>
                        </div>
                        <div className={CheckOutStyles.rowContainer}>
                          <div className={CheckOutStyles.fieldName}>
                            <label>Zip Code</label>
                            <span className={CheckOutStyles.mandatory}>*</span>
                          </div>
                          <input
                            type="text"
                            name="zipcode"
                            /**Modified code on 24-10-2024
                             * Reason-Changed variable
                             */
                            value={billingFormData.zipcode}
                            /**End of code on 24-10-2024
                             * Reason-Changed variable
                             */
                            /**Code added by Unnati on 20-10-2024
                             *Reason-To clear error */
                            onChange={(e) => {
                              handleInputChange(e);
                              setBillingZipCodeError("");
                            }}
                            /**End of code addition by Unnati on 20-10-2024
                             *Reason-To clear error */
                            onBlur={(e) =>
                              isValidOnBlur("zipcode", e.target.value)
                            }
                          />
                          <div className={CheckOutStyles.formInputError}>
                            {billingZipCodeError}
                          </div>
                        </div>

                        <div className={CheckOutStyles.rowContainer}>
                          <div className={CheckOutStyles.fieldName}>
                            <label>Phone Number</label>
                            <span className={CheckOutStyles.mandatory}>*</span>
                          </div>
                          <input
                            type="text"
                            name="contact_number"
                            /**Modified code on 24-10-2024
                             * Reason-Changed variable
                             */
                            value={billingFormData.contact_number}
                            /**End of code on 24-10-2024
                             * Reason-Changed variable
                             */
                            /**Code added by Unnati on 20-10-2024
                             *Reason-To clear error */
                            onChange={(e) => {
                              handleInputChange(e);
                              setBillingContactNumberError("");
                            }}
                            /**End of code addition by Unnati on 20-10-2024
                             *Reason-To clear error */
                            onBlur={(e) =>
                              isValidOnBlur("contact_number", e.target.value)
                            }
                          />
                          <div className={CheckOutStyles.formInputError}>
                            {billingContactNumberError}
                          </div>
                        </div>

                        <div className={CheckOutStyles.buttonContainer}>
                          <button
                            className={CheckOutStyles.shippingSubmitButton}
                            type="button"
                            onClick={handleModalSubmit}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/**End of code addition by Unnati on 14-09-2024
                 *Reason-To open billing address form in modal */}
              </div>
              <div className={CheckOutStyles.checkoutColumn}>
                <div className={CheckOutStyles.heading}>
                  <h4 className={CheckOutStyles.columnTitle}>
                    Shipping Address
                  </h4>
                  <div
                    className={CheckOutStyles.AddAddress}
                    /**Code added by Unnati on 30-09-2024
                     *Reason-Added setBilling error */
                    onClick={() => {
                      openShippingModal();
                    }}

                    /**End of code addition by Unnati on 30-09-2024
                     *Reason-Added setBilling error */
                  >
                    <div className={CheckOutStyles.addIcon}>
                      <IoIosAddCircleOutline />
                    </div>
                    <label className={CheckOutStyles.AddAddressText}>
                      Add Address
                    </label>
                  </div>
                </div>
                {/* {temporaryShippingAddress &&
                Object.keys(temporaryShippingAddress).length > 0 ? (
                  <div className={CheckOutStyles.addressListContainer}>
                    <ul className={CheckOutStyles.addressList}>
                      <div className={CheckOutStyles.addressContent}>
                        <div className={CheckOutStyles.addressInfo}>
                          <label className={CheckOutStyles.primaryRadio}>
                            <input
                              type="radio"
                              name="primaryAddress"
                              checked={temporaryShippingAddress}
                              onChange={handleToggle}
                            />
                          </label>
                          <p className={CheckOutStyles.name}>
                            {temporaryShippingAddress.first_name}{" "}
                            {temporaryShippingAddress.last_name}{" "}
                            {temporaryShippingAddress.company}{" "}
                            {temporaryShippingAddress.address},{" "}
                            {temporaryShippingAddress.city},{" "}
                            {temporaryShippingAddress.state}{" "}
                            {temporaryShippingAddress.zipcode},{" "}
                            {temporaryShippingAddress.country}{" "}
                            {temporaryShippingAddress.phone_number}
                          </p>
                        </div>
                      </div>
                    </ul>
                  </div>
                ) : null} */}
                {userAddress && userAddress.length > 0 ? (
                  <div>
                    <div className={CheckOutStyles.addressListContainer}>
                      {/**Code added by Unnati on 20-10-2024
                       *Reason-To filter userAddress*/}
                      {userAddress
                        .filter(
                          (address) => address.id === selectedShippingAddressId
                        )
                        .map((address, index) => (
                          <div
                            key={address.id}
                            className={`${CheckOutStyles.addressItem} ${
                              index % 2 === 0
                                ? CheckOutStyles.even
                                : CheckOutStyles.odd
                            }`}
                          >
                            <div className={CheckOutStyles.addressContent}>
                              <div className={CheckOutStyles.addressInfo}>
                                <label
                                  className={
                                    CheckOutStyles.primaryRadioShipping
                                  }
                                >
                                  <input
                                    type="radio"
                                    name="primaryAddress"
                                    /**Code commented by Unnati on 20-10-2024
                                     *Reason-This code is not in use*/
                                    // checked={index === 0 || address.is_primary}
                                    // checked={
                                    //   Object.keys(temporaryShippingAddress).length > 0
                                    //     ? false
                                    //     : address.is_primary
                                    // }
                                    // checked={temporaryShippingAddressChecked ? true : false}
                                    // defaultChecked={
                                    //   isNewAddressAdded
                                    //     ? (userAddress.length - 1) === index
                                    //       ? true
                                    //       : false
                                    //     : address.is_primary
                                    // }
                                    /**End of code comment by Unnati on 20-10-2024
                                     *Reason-This code is not in use*/
                                    checked={address.id}
                                    // End of code addition by unnati on 19-10-2024
                                    // Reason-This code is not in use
                                    onChange={() =>
                                      handleAddressChange(address.id)
                                    }
                                  />
                                  {/**End of code addition by Unnati on 20-10-2024
                                   *Reason-To filter userAddress*/}
                                </label>
                                <p className={CheckOutStyles.name}>
                                  {address.first_name} {address.last_name}{" "}
                                  {address.company} {address.address},{" "}
                                  {address.city}, {address.state}{" "}
                                  {address.zipcode}, {address.country}{" "}
                                  {/* Code changed by - Ashlekh on 25-11-2024
                                  Reason - To display contact number */}
                                  {/* {address.phone_number} */}
                                  {address.contact_number}
                                  {/* End of code - Ashlekh on 25-11-2024
                                  Reason - To display contact number */}
                                </p>
                                <div
                                  className={CheckOutStyles.editButton}
                                  onClick={() => handleEdit(address.id)}
                                >
                                  <MdEdit color="blue" />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      {/* <Link to="/myaccount" state={{ activeTab: "address" }}> */}
                      {/**Code added by Unnati on 21-10-2024
                       *Reason-To show view more only when address is more than 1*/}
                      {userAddress.length > 1 ? (
                        // Added by - Ashlekh on 21-11-2024
                        // Reason - To keep view more text in div
                        <div className={`${CheckOutStyles.viewMoreContainer}`}>
                          {/* End of code - Ashlekh on 21-11-2024
                        Reason - To keep view more text in div */}
                          <p
                            className={CheckOutStyles.viewMore}
                            onClick={() => {
                              openAllAddress();
                            }}
                          >
                            View More
                          </p>
                        </div>
                      ) : null}
                      {/*End of code addition by Unnati on 21-10-2024
                       *Reason-To show view more only when address is more than 1 */}
                      {isModalOpen && (
                        <div className={CheckOutStyles.modalOverlay}>
                          <div className={CheckOutStyles.modalContainer}>
                            <div className={CheckOutStyles.modalHeader}>
                              {/**Code added by Unnati on 30-10-2024
                               *Reason-Added classname */}
                              <h3 className={CheckOutStyles.modalHeading}>
                                All Addresses
                              </h3>
                              {/**End of code addition by Unnati on 30-10-2024
                               *Reason-Added classname */}
                              {/* <div
                                className="closeButton"
                                onClick={closeAllAddress}
                              > */}
                              <div
                                className={CheckOutStyles.closeButton}
                                onClick={closeAllAddress}
                              >
                                &times;
                              </div>
                            </div>
                            <ul className={CheckOutStyles.addressList}>
                              {/**Code added by Unnati on 17-10-2024
                               *Reason-To show addresses in view more */}
                              {/**Code added by Unnati on 20-10-2024
                               *Reason-To sort userAddress*/}
                              {(() => {
                                const sortedAddresses = [...userAddress].sort(
                                  (a, b) => {
                                    return b.is_primary - a.is_primary;
                                  }
                                );

                                return (
                                  <>
                                    {sortedAddresses.map((address, index) => (
                                      /**End of code addition by Unnati on 20-10-2024
                                       *Reason-To sort userAddress*/
                                      <div
                                        key={address.id}
                                        className={`${
                                          CheckOutStyles.addressItem
                                        } ${
                                          index % 2 === 0
                                            ? CheckOutStyles.even
                                            : CheckOutStyles.odd
                                        }`}
                                      >
                                        <div
                                          className={
                                            CheckOutStyles.addressContent
                                          }
                                        >
                                          <div
                                            className={
                                              CheckOutStyles.addressInfo
                                            }
                                          >
                                            <label
                                              className={
                                                CheckOutStyles.primaryRadio
                                              }
                                            >
                                              <input
                                                type="radio"
                                                name="primaryAddress"
                                                // Added by - Ashlekh on 14-01-2025
                                                // Reason - To select radio button
                                                checked={selectedShippingAddressId == address.id}
                                                // End of code - Ashlekh on 14-01-2025
                                                // Reason - To select radio button
                                                onChange={() =>
                                                  handleAddressChange(
                                                    address.id
                                                  )
                                                }
                                                /**Code commented by unnati on 21-10-2024
                                                 *Reason-This code is not in use */
                                                // checked={address.is_primary}
                                                /**End of code comment by unnati on 21-10-2024
                                                 *Reason-This code is not in use */
                                              />
                                            </label>
                                            {/**Code Added by unnati on 21-10-2024
                                             *Reason-Change primary address color */}
                                            <p
                                              className={`${
                                                CheckOutStyles.name
                                              } ${
                                                address.is_primary
                                                  ? CheckOutStyles.primaryAddressText
                                                  : ""
                                              }`}
                                            >
                                              {/**End of code addition unnati on 21-10-2024
                                               *Reason-Change primary address color */}
                                              {address.first_name}{" "}
                                              {address.last_name}{" "}
                                              {address.company}{" "}
                                              {address.address}, {address.city},{" "}
                                              {address.state} {address.zipcode},{" "}
                                              {address.country}{" "}
                                              {/* Code changed by - Ashlekh on 25-11-2024
                                              Reason - To display contact number */}
                                              {/* {address.phone_number} */}
                                              {address.contact_number}
                                              {/* End of code - Ashlekh on 25-11-2024
                                              Reason - To display contact number */}
                                              {/**Code Added by unnati on 21-10-2024
                                               *Reason-If address is primary then show primary written */}
                                              {address.is_primary && (
                                                <span
                                                  className={
                                                    CheckOutStyles.primaryLabel
                                                  }
                                                >
                                                  {" "}
                                                  (Primary Address)
                                                </span>
                                              )}
                                              {/**End of code addition by unnati on 21-10-2024
                                               *Reason-If address is primary then show primary written */}
                                            </p>
                                            <div
                                              className={
                                                CheckOutStyles.editButton
                                              }
                                              onClick={() =>
                                                handleEdit(address.id)
                                              }
                                            >
                                              <MdEdit color="blue" />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </>
                                );
                              })()}

                              {/**End of code addition by Unnati on 17-10-2024
                               *Reason-To show addresses in view more */}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* </Link> */}
                    </div>
                  </div>
                ) : null}
                {/**Code added by Unnati on 11-10-2024
                 *Reaon-To open edit modal */}

                {isEditModalOpen && (
                  <div className={CheckOutStyles.modalOverlay}>
                    <div className={CheckOutStyles.modalContainer}>
                      <div className={CheckOutStyles.modalHeader}>
                        <h2>Edit Address</h2>
                        {/* <div className="closeButton" onClick={closeEditModal}> */}
                        <div
                          className={CheckOutStyles.closeButton}
                          onClick={closeEditModal}
                        >
                          &times;
                        </div>
                      </div>

                      <div className={CheckOutStyles.modalBody}>
                        <div className={CheckOutStyles.rowContainer}>
                          <div className={CheckOutStyles.fieldName}>
                            <label>First Name</label>
                            <span className={CheckOutStyles.mandatory}>*</span>
                          </div>
                          <input
                            className={CheckOutStyles.inputShipping}
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            /**Code added by Unnati on 20-10-2024
                             *Reason-To clear error*/
                            // onChange={handleChange}
                            onChange={(e) => {
                              handleChange(e);
                              setFirstNameError("");
                            }}
                            /**End of code addition  by Unnati on 20-10-2024
                             *Reason-To clear error*/
                            onBlur={(e) =>
                              isValidOnBlur("first_name", e.target.value)
                            }
                          />
                          <div className={CheckOutStyles.formInputError}>
                            {firstNameError}
                          </div>
                        </div>

                        <div className={CheckOutStyles.rowContainer}>
                          <div className={CheckOutStyles.fieldName}>
                            <label>Last Name</label>
                          </div>
                          <input
                            className={CheckOutStyles.inputShipping}
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                          />
                        </div>
                        {/* Commented by - Ashlekh on 22-01-2025
                        Reason - To remove company */}
                        {/* <div className={CheckOutStyles.rowContainer}>
                          <div className={CheckOutStyles.fieldName}>
                            <label>Company</label>
                          </div>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            onBlur={(e) =>
                              isValidOnBlur("company", e.target.value)
                            }
                            className={CheckOutStyles.inputShipping}
                          />
                        </div> */}
                        {/* End of comment - Ashlekh on 22-01-2025
                        Reason - To remove Company name */}

                        <div className={CheckOutStyles.rowContainer}>
                          <div className={CheckOutStyles.fieldName}>
                            <label>Address</label>
                            <span className={CheckOutStyles.mandatory}>*</span>
                          </div>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            /**Code added by Unnati on 20-10-2024
                             *Reason-To clear error*/
                            // onChange={handleChange}
                            onChange={(e) => {
                              handleChange(e);
                              setAddressError("");
                            }}
                            /**End of code addition by Unnati on 20-10-2024
                             *Reason-To clear error*/
                            onBlur={(e) =>
                              isValidOnBlur("address", e.target.value)
                            }
                            className={CheckOutStyles.inputShipping}
                          />
                          <div className={CheckOutStyles.formInputError}>
                            {addressError}
                          </div>
                        </div>

                        <div className={CheckOutStyles.rowContainer}>
                          <div className={CheckOutStyles.fieldName}>
                            <label>City</label>
                            <span className={CheckOutStyles.mandatory}>*</span>
                          </div>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            /**Code added by Unnati on 20-10-2024
                             *Reason-To clear error*/
                            // onChange={handleChange}
                            onChange={(e) => {
                              handleChange(e);
                              setCityError("");
                            }}
                            /*End of code addition by Unnati on 20-10-2024
                             *Reason-To clear error*/
                            onBlur={(e) =>
                              isValidOnBlur("city", e.target.value)
                            }
                            className={CheckOutStyles.inputShipping}
                          />
                          <div className={CheckOutStyles.formInputError}>
                            {cityError}
                          </div>
                        </div>

                        <div className={CheckOutStyles.rowContainer}>
                          <div className={CheckOutStyles.fieldName}>
                            <label>Country</label>
                            <span className={CheckOutStyles.mandatory}>*</span>
                          </div>
                          <input
                            type="text"
                            value="United States"
                            className={CheckOutStyles.inputShipping}
                            readOnly
                          />
                          <div className={CheckOutStyles.formInputError}>
                            {countryError}
                          </div>
                        </div>

                        <div className={CheckOutStyles.rowContainer}>
                          <div className={CheckOutStyles.fieldName}>
                            <label>State</label>
                            <span className={CheckOutStyles.mandatory}>*</span>
                          </div>
                          <select
                            className={CheckOutStyles.inputShipping}
                            /**Code added by Unnati on 20-10-2024
                             *Reason-To clear error*/
                            // onChange={handleChange}
                            onChange={(e) => {
                              handleChange(e);
                              setStateError("");
                            }}
                            /**End of code addition  by Unnati on 20-10-2024
                             *Reason-To clear error*/
                            name="state"
                            value={formData.state}
                          >
                            {states.map((option, index) => (
                              /* Modified by jhamman on 13-10-2024
                              Reason - it firstly only give us code , but we want full form of state*/
                              /* <option key={index} value={option.value}> */
                              <option key={index} value={option.name}>
                                {/* Modified by jhamman on 13-10-2024
                              Reason - it firstly only give us code , but we want full form of state*/}
                                {option.name} - {option.value}
                              </option>
                            ))}
                          </select>
                          <div className={CheckOutStyles.formInputError}>
                            {stateError}
                          </div>
                        </div>

                        <div className={CheckOutStyles.rowContainer}>
                          <div className={CheckOutStyles.fieldName}>
                            <label>Zip Code</label>
                            <span className={CheckOutStyles.mandatory}>*</span>
                          </div>
                          <input
                            className={CheckOutStyles.inputShipping}
                            type="text"
                            name="zipcode"
                            value={formData.zipcode}
                            /**Code added by Unnati on 20-10-2024
                             *Reason-To clear error*/
                            // onChange={handleChange}
                            onChange={(e) => {
                              handleChange(e);
                              setZipCodeError("");
                            }}
                            /**End of code addition by Unnati on 20-10-2024
                             *Reason-To clear error*/
                            onBlur={(e) =>
                              isValidOnBlur("zipcode", e.target.value)
                            }
                          />
                          <div className={CheckOutStyles.formInputError}>
                            {zipCodeError}
                          </div>
                        </div>

                        <div className={CheckOutStyles.rowContainer}>
                          <div className={CheckOutStyles.fieldName}>
                            <label>Phone Number</label>
                            <span className={CheckOutStyles.mandatory}>*</span>
                          </div>
                          <input
                            className={CheckOutStyles.inputShipping}
                            type="text"
                            name="contact_number"
                            value={formData.contact_number}
                            /**Code added by Unnati on 20-10-2024
                             *Reason-To clear error*/
                            // onChange={handleChange}
                            onChange={(e) => {
                              handleChange(e);
                              setContactNumberError("");
                            }}
                            /**End of code addition by Unnati on 20-10-2024
                             *Reason-To clear error*/
                            onBlur={(e) =>
                              isValidOnBlur("contact_number", e.target.value)
                            }
                          />
                          <div className={CheckOutStyles.formInputError}>
                            {contactNumberError}
                          </div>
                        </div>

                        <div className={CheckOutStyles.buttonContainer}>
                          <button
                            type="button"
                            className={CheckOutStyles.shippingSubmitButton}
                            onClick={() =>
                              handleEditModalSubmit(selectedAddressId)
                            }
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/**End of code addition by Unnati on 11-10-2024
                 *Reaon-To open edit modal */}

                {shippingError && (
                  <div className={CheckOutStyles.formInputError}>
                    {shippingError}
                  </div>
                )}
              </div>

              {isShippingModalOpen && (
                <div className={CheckOutStyles.modalOverlay}>
                  <div className={CheckOutStyles.modalContainer}>
                    <div className={CheckOutStyles.modalHeader}>
                      <h2>Add Address</h2>
                      {/* <div className="closeButton" onClick={closeShippingModal}> */}
                      <div
                        className={CheckOutStyles.closeButton}
                        onClick={closeShippingModal}
                      >
                        &times;
                      </div>
                    </div>
                    <div className={CheckOutStyles.modalBody}>
                      <div className={CheckOutStyles.rowContainer}>
                        <div className={CheckOutStyles.fieldName}>
                          <label>First Name</label>
                          <span className={CheckOutStyles.mandatory}>*</span>
                        </div>
                        <input
                          type="text"
                          name="first_name"
                          value={firstName}
                          /**Code added by Unnati on 20-10-2024
                           *Reason-To clear error*/
                          onChange={(e) => {
                            setFirstName(e.target.value);
                            setFirstNameError("");
                          }}
                          // onChange={(e) => {
                          //   setFirstNameError("");
                          // }}
                          // onBlur={(e) =>
                          //   isValidOnBlur("first_name", e.target.value)
                          // }
                          /**End of code addition by Unnati on 20-10-2024
                           *Reason-To clear error*/
                        />
                        <div className={CheckOutStyles.formInputError}>
                          {firstNameError}
                        </div>
                      </div>

                      <div className={CheckOutStyles.rowContainer}>
                        <div className={CheckOutStyles.fieldName}>
                          <label>Last Name</label>
                        </div>
                        <input
                          type="text"
                          name="last_name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                      {/**Code commented by Unnati on 21-10-2024
                       *ReasonTo remove company name */}
                      {/* <div className={CheckOutStyles.rowContainer}>
                        <div className={CheckOutStyles.fieldName}>
                          <label>Company</label>
                        </div>
                        <input
                          type="text"
                          name="company"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          onBlur={(e) =>
                            isValidOnBlur("company", e.target.value)
                          }
                        />
                      </div> */}
                      {/**End of code commented by Unnati on 21-10-2024
                       *ReasonTo remove company name */}

                      <div className={CheckOutStyles.rowContainer}>
                        <div className={CheckOutStyles.fieldName}>
                          <label>Address</label>
                          <span className={CheckOutStyles.mandatory}>*</span>
                        </div>
                        <input
                          type="text"
                          name="address"
                          value={address}
                          /**Code added by Unnati on 20-10-2024
                           *Reason-To clear error*/
                          onChange={(e) => {
                            setAddress(e.target.value);
                            setAddressError("");
                          }}
                          /*End of code addition by Unnati on 20-10-2024
                           *Reason-To clear error*/
                          onBlur={(e) =>
                            isValidOnBlur("address", e.target.value)
                          }
                        />
                        <div className={CheckOutStyles.formInputError}>
                          {addressError}
                        </div>
                      </div>

                      <div className={CheckOutStyles.rowContainer}>
                        <div className={CheckOutStyles.fieldName}>
                          <label>City</label>
                          <span className={CheckOutStyles.mandatory}>*</span>
                        </div>
                        <input
                          type="text"
                          name="city"
                          value={city}
                          /**Code added by Unnati on 20-10-2024
                           *Reason-To clear error*/
                          onChange={(e) => {
                            setCity(e.target.value);
                            setCityError("");
                          }}
                          /**End of code addition by Unnati on 20-10-2024
                           *Reason-To clear error*/
                          onBlur={(e) => isValidOnBlur("city", e.target.value)}
                        />
                        <div className={CheckOutStyles.formInputError}>
                          {cityError}
                        </div>
                      </div>

                      <div className={CheckOutStyles.rowContainer}>
                        <div className={CheckOutStyles.fieldName}>
                          <label>Country</label>
                          <span className={CheckOutStyles.mandatory}>*</span>
                        </div>
                        <input
                          type="text"
                          value="United States"
                          className={CheckOutStyles.countrydropdownOptions}
                          readOnly
                        />
                        <div className={CheckOutStyles.formInputError}>
                          {countryError}
                        </div>
                      </div>

                      <div className={CheckOutStyles.rowContainer}>
                        <div className={CheckOutStyles.fieldName}>
                          <label>State</label>
                          <span className={CheckOutStyles.mandatory}>*</span>
                        </div>
                        {/* <StateDropdown
                    countryCode={selectedCountry}
                    onStateChange={handleStateChange}
                  /> */}

                        <select
                          className={CheckOutStyles.dropdownOptions}
                          value={choosenState}
                          /**Code added by Unnati on 20-10-2024
                           *Reason-To clear error*/
                          onChange={(e) => {
                            setChoosenState(e.target.value);
                            setStateError("");
                          }}
                          // onBlur={(e) => isValidOnBlur("state", e.target.value)}
                          // value={shippingAddress.state}
                        >
                          {/**End of code addition  by Unnati on 20-10-2024
                           *Reason-To clear error*/}
                          <option value="" disabled>
                            Select a state
                          </option>
                          {states.map((option, index) => (
                            /* Added by jhamman on 14-10-2024
                            Reason - we have to pass full name of state*/
                            /* <option key={index} value={option.value}> */
                            <option key={index} value={option.name}>
                              {/* Added by jhamman on 14-10-2024
                            Reason - we have to pass full name of state*/}
                              {option.name} - {option.value}
                            </option>
                          ))}
                        </select>
                        <div className={CheckOutStyles.formInputError}>
                          {stateError}
                        </div>
                      </div>

                      <div className={CheckOutStyles.rowContainer}>
                        <div className={CheckOutStyles.fieldName}>
                          <label>Zip Code</label>
                          <span className={CheckOutStyles.mandatory}>*</span>
                        </div>
                        <input
                          type="text"
                          name="zipcode"
                          value={zipcode}
                          /**Code added by Unnati on 20-10-2024
                           *Reason-To clear error*/
                          onChange={(e) => {
                            setZipcode(e.target.value);
                            setZipCodeError("");
                          }}
                          /**End of code addition by Unnati on 20-10-2024
                           *Reason-To clear error*/
                          onBlur={(e) =>
                            isValidOnBlur("zipcode", e.target.value)
                          }
                        />
                        <div className={CheckOutStyles.formInputError}>
                          {zipCodeError}
                        </div>
                      </div>

                      <div className={CheckOutStyles.rowContainer}>
                        <div className={CheckOutStyles.fieldName}>
                          <label>Phone Number</label>
                          <span className={CheckOutStyles.mandatory}>*</span>
                        </div>
                        <input
                          type="text"
                          name="contact_number"
                          value={contactNumber}
                          /**Code added by Unnati on 20-10-2024
                           *Reason-To clear error*/
                          onChange={(e) => {
                            setContactNumber(e.target.value);
                            setContactNumberError("");
                          }}
                          /*End of code addition  by Unnati on 20-10-2024
                           *Reason-To clear error*/
                          onBlur={(e) =>
                            isValidOnBlur("contact_number", e.target.value)
                          }
                        />
                        <div className={CheckOutStyles.formInputError}>
                          {contactNumberError}
                        </div>
                      </div>
                      <div className={CheckOutStyles.buttonContainer}>
                        <button
                          className={CheckOutStyles.shippingSubmitButton}
                          type="button"
                          onClick={handleShippingModalSubmit}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* <div className={CheckOutStyles.checkoutColumn}> */}
              {/**Code commented by Unnati on 21-07-2024
               *Reason-This code is not in use because we need to signin before proceeding with shipping */}
              {/* {(!user || Object.keys(user).length === 0) && (
               <>
                <div>
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="You can create an account after checkout."
                  onChange={() => setEmailError("")}
                  onBlur={(e) => isValidOnBlur("email", e.target.value)}
                />
                <div className={CheckOutStyles.formInputError}>
                  {emailError}
                </div>
              </div>
              <div>
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  onChange={() => setPasswordError("")}
                  onBlur={(e) => isValidOnBlur("password", e.target.value)}
                />
                <div className={CheckOutStyles.formInputError}>
                  {passwordError}
                </div>
              </div>
              <div>
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirm_password"
                  onChange={() => setConfirmPasswordError("")}
                  onBlur={(e) =>
                    isValidOnBlur("confirm_password", e.target.value)
                  }
                />
                <div className={CheckOutStyles.formInputError}>
                  {confirmPasswordError}
                </div>
              </div>
            </>
            
          )} */}
              {/**End of code comment by Unnati on 21-07-2024
               *Reason-This code is not in use because we need to signin before proceeding with shipping */}
              {/* </div> */}

              {/* Added by - Ashish Dewangan on 27-11-2024
               * Reason - To show radio button for payment gateway selection */}
              {/* Added by - Ashlekh on 11-12-2024
              Reason - If no item/product is present in checkout then to hide Order Summary */}
              {cartData?.length > 0 && (
                // End of code - Ashlekh on 11-12-2024
                // Reason - If no item/product is present in checkout then to hide Order Summary
                <div className={CheckOutStyles.checkoutColumn}>
                  <div style={{ display: "none" }}>
                    <h4
                      className={`${CheckOutStyles.radioInputLabel} ${CheckOutStyles.columnTitle}`}
                    >
                      Payment Option :{" "}
                    </h4>
                    <label className={CheckOutStyles.radioInput}>
                      <input
                        type="radio"
                        value="stripe"
                        checked={selectedPaymentGateway === "stripe"}
                        onChange={(e) =>
                          setSelectedPaymentGateway(e.target.value)
                        }
                      />
                      Stripe
                    </label>
                    <label className={CheckOutStyles.radioInput}>
                      <input
                        type="radio"
                        value="paypal"
                        checked={selectedPaymentGateway === "paypal"}
                        onChange={(e) =>
                          setSelectedPaymentGateway(e.target.value)
                        }
                      />
                      PayPal
                    </label>
                  </div>
                </div>
              )}
              {/* End of addition by - Ashish Dewangan on 27-11-2024
               * Reason - To show radio button for payment gateway selection */}
              {/* Added by - Ashlekh on 11-12-2024
              Reason - If no item/product is present in checkout then to hide Order Summary */}
              {cartData?.length > 0 && (
                // End of code - Ashlekh on 11-12-2024
                // Reason - If no item/product is present in checkout then to hide Order Summary
                <button
                  type="submit"
                  className={CheckOutStyles.placeOrderButton}
                  // Added by - Ashlekh on 25-10-2024
                  // Reason - To verify quantity of products using checkStock function
                  /**Code commented by Unnati on 27-10-2024
                   *Reason-Commented checkStock */
                  // onClick={checkStock}
                  /**End of code addition by Unnati on 27-10-2024
                   *Reason-Commented checkStock */
                  // End of code - Ashlekh on 25-10-2024
                  // Reason - To verify quantity of products using checkStock function
                >
                  {/* Code changed by - Ashlekh on 23-10-2024
                Reason - To change name */}
                  {/* Place Order */}
                  Proceed to pay
                  {/* End of code - Ashlekh on 23-10-2024
                Reason - To change name */}
                </button>
              )}
            </div>
            {/**End of code addition by Unnati on 13-09-2024
             *Reason-To have checkbox for ship to same address */}
            {/* <div className={CheckOutStyles.checkoutColumnShippingMethod}> */}
            {/**Code commented by Unnati on 25-08-2024
             *Reason-This section is currently not in use */}
            {/* <div className={CheckOutStyles.CheckOutBox}>
                <h2 className={CheckOutStyles.columnTitle}>Shipping Method</h2>
                <p className={CheckOutStyles.message}>
                  Sorry, no quotes are available for this order at this time.
                </p>
              </div> */}
            {/**End of code comment by Unnati on 25-08-2024
             *Reason-This section is currently not in use */}
            {/* <div className={CheckOutStyles.CheckOutBox}>
                <h2 className={CheckOutStyles.paymentCcolumnTitle}>
                  Payment Method
                </h2>
                <div className={CheckOutStyles.radioOptions}>
                  <div className={CheckOutStyles.paymentSection}> */}
            {/* Scanner Image */}
            {/* <div className={CheckOutStyles.paymentScanner}>
                      <p>
                        Please scan the QR code using your preferred payment
                        app:
                      </p>
                      <img
                        src="./QRcode (2).png"
                        alt="Scanner for Payment"
                        className={CheckOutStyles.scannerImage}
                      />
                    </div> */}

            {/* Bank Details */}
            {/* <div className={CheckOutStyles.bankDetails}>
                      <h3>Paypal</h3>
                      <p>
                        <strong>Bank Name:</strong> HDFC Bank
                      </p>
                      <p>
                        <strong>Account Name:</strong> John Smith
                      </p>
                      <p>
                        <strong>Account Number:</strong>
                        061120084
                      </p>
                      <p>
                        <strong>IFSC Code:</strong>HDFC0000004
                      </p>
                    </div>
                  </div> */}
            {/* <div className={CheckOutStyles.Options}>
                    <label>
                      <input
                        type="radio"
                        name="payment"
                        value="credit card"
                        onChange={handlePaymentChange}
                      />
                      Credit Card
                    </label>
                  </div> */}
            {/**Code added by Unnati on 25-07-2024
             *Reason-To add payment options like credit card and cash on delivery
             */}
            {/* {paymentMethod === "credit card" && (
                    <div className={CheckOutStyles.CreditCardDetails}>
                      <div>
                        <label>
                          Credit Card Number:
                          <input
                            type="text"
                            name="creditCardNumber"
                            onChange={(e) => {
                              setCreditCardNumberError("");
                            }}
                            onBlur={(e) => {
                              isValidOnBlur("creditCardNumber", e.target.value);
                            }}
                            required
                          />
                        </label>

                        <div className={CheckOutStyles.formInputError}>
                          {creditCardNumberError}
                        </div>
                      </div>
                      <div>
                        <label>
                          Expiration Date:
                          (Write in format YYYY-MM-DD)
                          <input
                            type="text"
                            name="expirationDate"
                            onChange={() => setCreditCardNumberError("")}
                            onBlur={(e) =>
                              isValidOnBlur("expirationDate", e.target.value)
                            }
                            required
                          />
                        </label>
                        <div className={CheckOutStyles.formInputError}>
                          {creditCardExpirationError}
                        </div>
                      </div>
                      <div>
                        <label>
                          Card Verification Number:
                          <input
                            type="text"
                            name="cardVerificationNumber"
                            onChange={() => setCardVerificationNumberError("")}
                            onBlur={(e) =>
                              isValidOnBlur(
                                "cardVerificationNumber",
                                e.target.value
                              )
                            }
                            required
                          />
                        </label>
                        <div className={CheckOutStyles.formInputError}>
                          {cardVerificationNumberError}
                        </div>
                      </div>
                    </div>
                  )} */}
            {/**End of code addition by Unnati on 25-07-2024
             *Reason-To add payment options like credit card and cash on delivery
             */}
            {/* <div className={CheckOutStyles.Options}>
                    <label>
                      <input
                        type="radio"
                        name="payment"
                        value="cash-on-delivery"
                        onChange={handlePaymentChange}
                      />
                      Cash On Delivery
                    </label>
                  </div> */}
            {/* </div> */}
            {/**Code added by Unnati on 25-07-2024
             *Reason-To add payment options like credit card and cash on delivery
             */}
            {/* {paymentMethod === "cash-on-delivery" && (
                  <div className={CheckOutStyles.CashOnDeliveryDetails}>
                    <div>
                      <label>Make check payable to: UniformWareHouse</label>
                    </div>
                  </div>
                )} */}
            {/**End of code addition by Unnati on 25-07-2024
             *Reason-To add payment options like credit card and cash on delivery
             */}
            {/* </div> */}

            {/* </div> */}
            {/* Added by - Ashlekh on 11-12-2024
            Reason - If no item/product is present in checkout then to hide Order Summary */}
            {cartData?.length > 0 && (
              // End of code - Ashlekh on 11-12-2024
              // Reason - If no item/product is present in checkout then to hide Order Summary
              <div className={CheckOutStyles.checkoutColumnOrderSummary}>
                <div className={CheckOutStyles.orderList}>
                  <h4 className={CheckOutStyles.columnTitleOrderSummary}>
                    Order Summary
                  </h4>
                  {/**Code added by Unnati on 17-10-2024
                   *Reason-Added grandtotal and product count */}
                  <div className={CheckOutStyles.countAndTotal}>
                    {/**Code modified by Unnati on 21-10-2024
                     *Reason-To add space between label and value */}
                    <p>Total Products : {totalItemCount},</p>
                    {/**Code modified by Unnati on 15-11-2024
                     *Reason-Added subtotal */}
                    {/* Code changed by - Ashlekh on 27-12-2024
                    Reason - To round off grand_total to 2 decimal  */}
                    {/* <p>Subtotal : ${grand_total}</p> */}
                    <p>Subtotal : ${grand_total.toFixed(2)}</p>
                    {/* End of code - Ashlekh on 27-12-2024
                    Reason - To round off grand_total to 2 decimal  */}
                    {/**End of code modification by Unnati on 15-11-2024
                     *Reason-Added subtotal */}
                  </div>
                  {/**End of code modification by Unnati on 21-10-2024
                   *Reason-To add space between label and value */}
                  {/**End of code addition by Unnati on 17-10-2024
                   *Reason-Added grandtotal and product count */}
                </div>
                <div className={CheckOutStyles.allRow}>
                  {cartData && cartData.length > 0 ? (
                    cartData.map((item, index) => {
                      {
                        /* getFilteredSizes(item).map(([size, quantity]) => {
                     
                      const CartItem =
                        cartItem.find(
                          (product) => product.id === item.product
                        ) || {}; */
                      }
                      const isProductActive = item.is_active;

                      const salesRate =
                        item.logo ||
                        item.patches ||
                        item.security_batches ||
                        // Added by - Ashlekh on 06-03-2025
                        // Reason - To add customization
                        item.security_id_on_back ||
                        item.printed_id ||
                        // End of code - Ashlekh on 06-03-2025
                        // Reason - To add customization
                        item.embroider
                          ? item.after_customization_product_price ||
                            "Customization price not available"
                          : item.sales_rate
                          ? item.sale_percentage
                            ? calculateDiscountFromProduct(
                                item.sales_rate,
                                item.sale_percentage
                              )
                            : item.sales_rate
                          : "Subtotal not available";

                      const subtotal =
                        isProductActive && salesRate
                          ? salesRate * item.quantity
                          : 0;

                      if (isProductActive) {
                        calculatedSubtotal += subtotal;
                      }

                      return (
                        /**
                         * Modified by - Ashish Dewangan on 07-12-2024
                         * Reason - Gave unique id to each row for proper react rendering
                         */
                        // <React.Fragment key={`${item.productId}-${size}`}>
                        <React.Fragment
                        // Added by - Ashlekh on 06-03-2025
                        // Reason - To add customization
                        // key={`${item.product}-${item.size}-${item.logo}-${item.patches}-${item.security_batches}-${item.embroider}`}
                          key={`${item.product}-${item.size}-${item.logo}-${item.patches}-${item.security_batches}-${item.security_id_on_back}-${item.printed_id}-${item.embroider}`}
                          // End of code - Ashlekh on 06-03-2025
                          // Reason - To add customization
                        >
                          {/*
                           * End of modification by - Ashish Dewangan on 07-12-2024
                           * Reason - Gave unique id to each row for proper react rendering
                           */}
                          <div className={CheckOutStyles.orderSummaryContainer}>
                            <div className={CheckOutStyles.row}>
                              <div className={CheckOutStyles.itemContainer}>
                                <div className={CheckOutStyles.itemColumn}>
                                  <div className={CheckOutStyles.imageAndName}>
                                    <Link
                                      to={
                                        item.is_active
                                          ? `/productdetail/${
                                              item.product_id
                                                ? item.product_id
                                                : ""
                                            }`
                                          : "#"
                                      }
                                      /**Code added by Unnati on 11-12-2024
                                       *Reason-Send color through state */
                                      state={item.color}
                                      /**End of code addition by Unnati on 11-12-2024
                                       *Reason-Send color through state */
                                    >
                                      <img
                                        className={CheckOutStyles.img}
                                        src={`${config.baseURL}${item.image1}`}
                                        alt={item.name}
                                      />
                                    </Link>

                                    <div className={CheckOutStyles.productInfo}>
                                      <p className={CheckOutStyles.text}>
                                        {item?.name?.length > 0
                                          ? `${item?.name?.substring(0, 50)}...`
                                          : item?.name}
                                      </p>

                                      {item.logo ||
                                      item.patches ||
                                      item.security_batches ||
                                      // Added by - Ashlekh on 06-03-2025
                                      // Reason - To add customization
                                      item.security_id_on_back ||
                                      item.printed_id ||
                                      // End of code - Ashlekh on 06-03-2025
                                      // Reason - To add customization
                                      item.embroider ? (
                                        <div
                                          style={{
                                            color: "#008000",
                                            fontSize: "10px",
                                            paddingBottom: "1%",
                                          }}
                                        >
                                          Customized product
                                        </div>
                                      ) : null}
                                      {/* Added by - Ashlekh on 07-12-2024
                                    Reason - To display customization comment */}
                                      {/* Modified by - Ashish Dewangan on 12-12-2024
                                       * Reason - To show entire customization comment */}
                                      {/* {item?.customization_comment != "" && (
                                      <div className={`${CheckOutStyles.customizationCommentContainer}`}>Customization comment: 
                                        {item?.customization_comment && typeof item.customization_comment === 'string' 
                                          ? item.customization_comment.length > 25 
                                            ? `${item.customization_comment.slice(0, 25)}...` 
                                            : item.customization_comment
                                          : null}
                                      </div>
                                    )} */}
                                      {item?.customization_comment != "" && (
                                        <div
                                          className={`${CheckOutStyles.customizationCommentContainer}`}
                                        >
                                          Customization comment:
                                          {item?.customization_comment &&
                                          typeof item.customization_comment ===
                                            "string"
                                            ? item.customization_comment
                                            : null}
                                        </div>
                                      )}
                                      {/* End of modification by - Ashish Dewangan on 12-12-2024
                                       * Reason - To show entire customization comment */}

                                      {/*
                                       * Added by - Ashish Dewangan on 15-12-2024
                                       * Reason - If customizations are disabled by admin in user's cart than show proper message */}
                                      {(item.show_patches_and_embroider_on_UI !=
                                        true &&
                                        (item.logo == true ||
                                          item.patches == true ||
                                          item.security_batches == true ||
                                          // Added by - Ashlekh on 06-03-2025
                                          // Reason - To add customization
                                          item.security_id_on_back == true ||
                                          item.printed_id == true ||
                                          // End of code - Ashlekh on 06-03-2025
                                          // Reason - To add customization
                                          item.embroider == true)) ||
                                      (item.logo &&
                                        (!item.logo_price ||
                                          item.logo_price <= 0)) ||
                                      (item.patches &&
                                        (!item.patches_price ||
                                          item.patches_price <= 0)) ||
                                      (item.embroider &&
                                        (!item.embroider_price ||
                                          item.embroider_price <= 0)) ||
                                      // Added by - Ashlekh on 06-03-2025
                                      // Reason - To add customization
                                      (item.security_id_on_back &&
                                        (!item.security_id_on_back_price ||
                                          item.security_id_on_back_price <= 0)) ||
                                      (item.printed_id &&
                                        (!item.printed_id_price ||
                                          item.printed_id_price <= 0)) ||
                                      // End of code - Ashlekh on 06-03-2025
                                      // Reason - To add customization
                                      (item.security_batches &&
                                        (!item.security_batches_price ||
                                          item.security_batches_price <= 0)) ? (
                                        <div
                                          className={`${CheckOutStyles.notAvailableAnymoreText}`}
                                        >
                                          Selected customization(s) for this
                                          product is currently not available.
                                          Please re-add the product.
                                        </div>
                                      ) : null}

                                      {/*
                                       * End of addition by - Ashish Dewangan on 15-12-2024
                                       * Reason - If customizations are disabled by admin in user's cart than show proper message */}

                                      {/* End of code - Ashlekh on 07-12-2024
                                    Reason - To display customization comment */}
                                      <div
                                        className={
                                          CheckOutStyles.productInfoQuantity
                                        }
                                      >
                                        <div className={CheckOutStyles.text}>
                                          Size: {item.size}
                                        </div>

                                        <div
                                          className={`${CheckOutStyles.text} ${CheckOutStyles.quantityContainer}`}
                                        >
                                          Quantity:{" "}
                                          <p
                                            className={`${CheckOutStyles.iconContainer}`}
                                            onClick={() =>
                                              handleQuantityChange(
                                                user.id,
                                                item.product,
                                                item.quantity,
                                                item.size,
                                                item.color,
                                                item.logo,
                                                item.patches,
                                                item.security_batches,
                                                // Added by - Ashlekh on 06-03-2025
                                                // Reason - To add customization
                                                item.security_id_on_back,
                                                item.printed_id,
                                                // End of code - Ashlekh on 06-03-2025
                                                // Reason - To add customization
                                                item.embroider,
                                                "decrease"
                                              )
                                            }
                                          >
                                            -
                                          </p>
                                          {item.quantity}
                                          <p
                                            className={`${CheckOutStyles.iconContainer}`}
                                            onClick={() =>
                                              handleQuantityChange(
                                                user.id,
                                                item.product,
                                                item.quantity,
                                                item.size,
                                                item.color,
                                                item.logo,
                                                item.patches,
                                                item.security_batches,
                                                // Added by - Ashlekh on 06-03-2025
                                                // Reason - To add customization
                                                item.security_id_on_back,
                                                item.printed_id,
                                                // End of code - Ashlekh on 06-03-2025
                                                // Reason - To add customization
                                                item.embroider,
                                                "increase"
                                              )
                                            }
                                          >
                                            +
                                          </p>
                                        </div>
                                        {/* Added by - Ashlekh on 11-12-2024
                                        Reason - To show validation message of stock */}
                                        {/* Code changed by - Ashlekh on 16-12-2024
                                      Reason - If the same product has multiple sizes, the validation message appears multiple times */}
                                        {/* {stockValidationMessage[item.product] && ( */}
                                        {stockValidationMessage[
                                          `${item.product}-${item.size}-${item.color}`
                                        ] && (
                                          <div
                                            className={`${CheckOutStyles.stockValidationMessageContainer}`}
                                          >
                                            {/* {stockValidationMessage[item.product]} */}
                                            {
                                              stockValidationMessage[
                                                `${item.product}-${item.size}-${item.color}`
                                              ]
                                            }
                                            {/* End of code - Ashlekh on 16-12-2024
                                            Reason - If the same product has multiple sizes, the validation message appears multiple times */}
                                          </div>
                                        )}
                                        {/* End of code - Ashlekh on 11-12-2024
                                        Reason - To show validation message of stock */}
                                        {/* Commented by - Ashlekh on 11-12-2024
                                      Reason - To display validation message below quantity, not in modal */}
                                        {/* {errorModalVisible && (
                                        <Modal
                                          title=""
                                          open={errorModalVisible}
                                          onCancel={handleErrorModal}
                                          footer={null}
                                        >
                                          <p
                                            className={`${CheckOutStyles.errorModal}`}
                                          >
                                            {errorMessage}
                                          </p>
                                        </Modal>
                                      )} */}
                                        {/* End of comment - Ashlekh on 11-12-2024
                                      Reason - To display validation message below quantity, not in modal */}
                                      </div>
                                      {/* Addition by Om Shrivastava on 02-01-2025
                                      Reason : Align the delete icon  */}
                                      <div>
                                        <RiDeleteBin6Fill
                                          style={{ cursor: "pointer" }}
                                          onClick={() => {
                                          handleDeleteClick(
                                          item.product,
                                          item.size,
                                          item.logo,
                                          item.patches,
                                          item.security_batches,
                                          // Added by - Ashlekh on 06-03-2025
                                          // Reason - To add customization
                                          item.security_id_on_back,
                                          item.printed_id,
                                          // End of code - Ashlekh on 06-03-2025
                                          // Reason - To add customization
                                          item.embroider,
                                          item.color
                                        );
                                        }}
                                        color="red"
                                      />
                                    </div>
                                    {/* End of addition by Om Shrivastava on 02-01-2025
                                      Reason : Align the delete icon  */}
                                    </div>
                                    
                                  </div>
                                </div>

                                <div className={CheckOutStyles.subtotalColumn}>
                                  <div className={CheckOutStyles.subtotal}>
                                    {salesRate ? (
                                      isProductActive ? (
                                        <span>{`${config.currency_icon}${salesRate}`}</span>
                                      ) : (
                                        <s className={CheckOutStyles.strike}>
                                          <span>{`${config.currency_icon}${salesRate}`}</span>
                                        </s>
                                      )
                                    ) : (
                                      "Subtotal not available"
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* <div
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <RiDeleteBin6Fill
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    handleDeleteClick(
                                      item.product,
                                      item.size,
                                      item.logo,
                                      item.patches,
                                      item.security_batches,
                                      item.embroider,
                                      item.color
                                    );
                                  }}
                                  color="red"
                                />
                              </div> */}

                              {modalVisible && (
                                <div className={CheckOutStyles.modalOverlay}>
                                  <div className={CheckOutStyles.modalContent}>
                                    <p>
                                      Are you sure you want to remove this item?
                                    </p>
                                    <div
                                      className={`${CheckOutStyles.modalButtonContainer}`}
                                    >
                                      <button
                                        className={CheckOutStyles.buttonYesOrNo}
                                        onClick={confirmDelete}
                                      >
                                        Yes
                                      </button>
                                      <button
                                        className={CheckOutStyles.buttonYesOrNo}
                                        onClick={cancelDelete}
                                      >
                                        No
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {item.is_active ? (
                                ""
                              ) : (
                                <p
                                  className={CheckOutStyles.unavailableMessage}
                                >
                                  Not available
                                </p>
                              )}
                            </div>
                            <div>
                              <div colSpan="4">
                                <div className={CheckOutStyles.icons}>
                                  <div className={`${CheckOutStyles.square}`}>
                                    <Link></Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <div>
                      <div colSpan="4">No items in the cart.</div>
                    </div>
                  )}
                </div>

                {/**Code added by Unnati on 19-09-2024
                 *Reason-Added summary section in checkout page */}
                <div className={CheckOutStyles.summaryTotals}>
                  <div className={CheckOutStyles.summaryRow}>
                    <div className={CheckOutStyles.summaryLabel}>Subtotal:</div>
                    <div className={CheckOutStyles.summaryValue}>
                      {`${config.currency_icon}${calculatedSubtotal.toFixed(2)}`}
                    </div>
                  </div>

                  {/* Commented by jhamman on 10-10-2024
               Reason - we just have to show total*/}
                  {/* {discountAmount && (
                  <div className={CheckOutStyles.summaryRow}>
                    <span className={CheckOutStyles.summaryLabel}>
                      Discount:
                    </span>
                    <span className={CheckOutStyles.summaryValue}>
                      {`$${discountAmount.toFixed(2)}`}
                    </span>
                  </div>
                )} */}

                  {/* <div className={CheckOutStyles.summaryRow}>
                  <span className={CheckOutStyles.summaryLabel}>Total:</span>
                  <span className={CheckOutStyles.summaryValue}>
                    {discountAmount
                      ? `$${(calculatedSubtotal - discountAmount).toFixed(2)} `
                      : `$${calculatedSubtotal.toFixed(2)}`}
                  </span>
                </div> */}
                  {/* End of commentation by jhamman on 10-10-2024
               Reason - we just have to show total*/}

                  <div className={CheckOutStyles.summaryRow}>
                    <div className={CheckOutStyles.summaryLabel}>Tax (%):</div>
                    {/**Code modified by Unnati on 25-11-2024
                     *Reason-Modified tax  */}
                    {/* <div className={CheckOutStyles.summaryValue}>5%</div> */}
                    <div className={CheckOutStyles.summaryValue}>
                      {Constants.sales_tax}%
                    </div>
                    {/**End of code modification by Unnati on 25-11-2024
                     *Reason-Modified tax  */}
                  </div>
                  <div className={CheckOutStyles.summaryRow}>
                    <div className={CheckOutStyles.summaryLabel}>Tax ({config.currency_icon}):</div>
                    <div className={CheckOutStyles.summaryValue}>
                      {/**Code modified by Unnati on 25-11-2024
                       *Reason-Modified tax */}
                      {/* {`$${(
                      0.05 *
                      (discountAmount
                        ? calculatedSubtotal - discountAmount
                        : calculatedSubtotal)
                    ).toFixed(2)}`} */}
                      {`${config.currency_icon}${(
                        (Constants.sales_tax / 100) *
                        (discountAmount
                          ? calculatedSubtotal - discountAmount
                          : calculatedSubtotal)
                      ).toFixed(2)}`}
                      {/**End of code modification by Unnati on 25-11-2024
                       *Reason-Modified tax */}
                    </div>
                  </div>

                  <div className={CheckOutStyles.summaryRow}>
                    <div className={CheckOutStyles.summaryLabel}>
                      Grand Total:
                    </div>
                    <div className={CheckOutStyles.summaryValue}>
                      {/**Code modified by Unnati on 25-11-2024
                       *Reason-Modified tax */}
                      {/* {`$${(
                      (discountAmount
                        ? calculatedSubtotal - discountAmount
                        : calculatedSubtotal) +
                      0.05 *
                        (discountAmount
                          ? calculatedSubtotal - discountAmount
                          : calculatedSubtotal)
                    ).toFixed(2)}`} */}
                      {`${config.currency_icon}${(
                        (discountAmount
                          ? calculatedSubtotal - discountAmount
                          : calculatedSubtotal) +
                        (Constants.sales_tax / 100) *
                          (discountAmount
                            ? calculatedSubtotal - discountAmount
                            : calculatedSubtotal)
                      ).toFixed(2)}`}
                      {/**End of code modification by Unnati on 25-11-2024
                       *Reason-Modified tax */}
                    </div>
                  </div>
                </div>
                {/**End of code addition by Unnati on 19-09-2024
                 *Reason-Added summary section in checkout page */}

                <div>
                  {/* <div
                  className={CheckOutStyles.discountDropdown}
                  // onClick={handleDiscountDropdown}
                >
                  <div>
                    <h3>APPLY DISCOUNT CODE</h3>

                    {/**Code commented by Unnati on 01-08-2024
                     *Reason-There is some issue while opeing the dropdown */}
                  {/* {isDropdownOpen && ( */}
                  {/* <div className={CheckOutStyles.dropdownContent}>
                      <div className={CheckOutStyles.dicountInputBox}>
                        <div className={CheckOutStyles.discountFieldTitle}>
                          <h6>Enter discount code</h6>
                        </div>
                        <div className={CheckOutStyles.dicountInputField}>
                          <input
                            type="text"
                            placeholder="Enter discount code"
                            name="discount"
                            onChange={(e) => setDiscountCode(e.target.value)}
                          />
                        </div>
                      </div>
                      <button
                        className={CheckOutStyles.applyDiscount}
                        onClick={CheckDiscountIsActiveOrNot}
                        type="button"
                      >
                        Apply discount
                      </button>
                    </div> */}

                  {/* )} */}
                  {/**End of code comment by Unnati on 01-08-2024
                   *Reason-There is some issue while opeing the dropdown */}
                  {/* </div>
                </div>  */}
                </div>
              </div>
            )}
          </form>
          {/**Code commented by Unnati on 14-09-2024
           *Reason-This code is not in use currently */}
          {/* {showModal && (
            <div className={CheckOutStyles.modalOverlay}>
              <div className={CheckOutStyles.modalContent}>
                <h2>Order Successful!</h2>
                <p>You can check the order status in your order history.</p>
                <button
                  className={CheckOutStyles.modalButton}
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )} */}
          {/**End of code comment by Unnati on 14-09-2024
           *Reason-This code is not in use currently */}
        </div>
      </div>
      {/* Added by - Ashlekh on 23-10-2024
      Reason - To add antd modal */}
      <Modal
        title=""
        // visible={isModalVisible}
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {/* Added by - Ashlekh on 24-10-2024
        Reason - To display message int antd modal */}
        <div
          className={`${CheckOutStyles.modalText}`}
          dangerouslySetInnerHTML={{ __html: modalMessage }}
        />
        {/* End of code - Ashlekh on 24-10-2024
          Reason - To display message in antd modal */}
      </Modal>
      {/* End of code - Ashlekh on 23-10-2024
      Reason - To add antd modal */}
    </div>
    /**Code added by Unnati on 20-07-2024
     * Reason-To create checkout page form
     */
  );
};

export default CheckOut;
/**End of code addition by Unnati on 20-07-2024
 * Reason-To have checkout page
 */
