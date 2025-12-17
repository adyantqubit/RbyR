/**Code added by Unnati on 13-07-2024
 * Reason-To have view cart page
 */
import React, { useEffect, useState, useContext } from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import "react-country-state-city/dist/react-country-state-city.css";
import styles from "./ViewCart.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context/Context";
import config from "../../Api/config";
import { MdEdit, MdInfo } from "react-icons/md";
import {
  removeItem,
  clearCart,
  getCartItem,
  updateCartQuantityAPI,
  getLatestDetailsOfCartItems,
  updateViewCartQuantityForGuestAPI,
} from "../../Api/services";
import NavigationPath from "../../components/NavigationPath/NavigationPath";
import { calculateDiscountFromProduct } from "../../utils/discountedPrices";
import { FaEye } from "react-icons/fa";
import { Modal } from "antd";

const ViewCart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [selectedState, setSelectedState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const { cartData, user, setCartData } = useContext(GlobalContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [cartItem, setCartItem] = useState([]);
  // Added by - Om Shrivastava on 05-12-2024
  // Reason - To have useState for storing quantity
  const [quantities, setQuantities] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  // End of code - Om Shrivastava on 05-12-2024
  // Reason - To have useState for storing quantity
  // Added by - Ashlekh on 18-12-2024
  // Reason - useState for storing validation message of quantity
  const [stockValidationMessage, setStockValidationMessage] = useState({});
  // End of code - Ashlekh on 18-12-2024
  // Reason - useState for storing validation message of quantity
  // Added by - Ashlekh on 11-03-2025
  // Reason - This useState is used to display name and description in mobile view
  const [mobileView, setMobileView] = useState(false);
  // End of code - Ashlekh on 11-03-2025
  // Reason - This useState is used to display name and description in mobile view
  /**Code added by Unnati on 03-10-2024
   * Reason-To get totalItemCount and subtotal through location
   */
  // Modification and addition by Om Shrivastava on 05-12-2024
  // Reason : Show the total no of products and grand total amount
  // const { totalItemCount, subtotal } = location.state || {
  //   totalItemCount: 0,
  //   subtotal: 0,
  // };
  const getTotalItemCount = (cartData) => {
    let totalCount = 0;

    for (let i = 0; i < cartData.length; i++) {
      const item = cartData[i];
      totalCount += parseInt(item.quantity ? item.quantity : 0);
    }

    return totalCount;
  };

  const totalItemCount = getTotalItemCount(cartData);

  const calculateSubtotal = () => {
    if (!Array.isArray(cartData)) {
      return 0;
    }
    var total = 0;
    cartData.forEach((item) => {
      const price = item.sales_rate
        ? item.sale_percentage
          ? calculateDiscountFromProduct(item.sales_rate, item.sale_percentage)
          : item.sales_rate
        : 0;

      const finalPrice =
        // Code changed by - 19-02-2025
        // Reason - To add customization
        // item.logo || item.patches || item.security_batches || item.embroider
        item.logo || item.patches || item.security_batches || item.security_id_on_back || item.printed_id || item.embroider
        // End of code - Ashlekh on 19-02-2025
        // Reason - To add customization
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
  // End of modification and addition by Om Shrivastava on 05-12-2024
  // Reason : Show the total no of products and grand total amount

  /**End of code addition by Unnati on 03-10-2024
   * Reason-To get totalItemCount and subtotal through location
   */

  /**Code added by Unnati on 19-07-2024
   * Reason-To get cart items from header(Mycart dropdown)
   */
  const cart = location.state?.cart;
  /**End of code addition by Unnati on 19-07-2024
   * Reason-To get cart items from header(Mycart dropdown)
   */
  const openModal = () => {
    setIsModalOpen(true);
  };
  const confirmClear = () => {
    handleClearButton();
    setIsModalOpen(false);
  };
  const cancelClear = () => {
    setIsModalOpen(false);
  };
  /**Code added by Unnati on 28-08-2024
   * Reason-To have navigation path
   */
  const { navigationPath, setNavigationPath } = useContext(GlobalContext);
  useEffect(() => {
    setNavigationPath([
      { name: "Home", path: "/" },
      { name: "View Cart", path: "/viewcart" },
    ]);
    window.scrollTo(0, 0);
  }, [setNavigationPath]);
  /**End of code addition by Unnati on 28-08-2024
   * Reason-To have navigation path
   */
  /**Code added by Unnati Bajaj on 14-07-2024
   * Reason -To scroll to the top when component loads
   */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  /**End of code addition by Unnati Bajaj on 14-07-2024
   * Reason -To scroll to the top when component loads
   */
  /**Code commented by Unnati on 15-07-2024
   * Reason-To handle add discount coupon dropdown
   */
  // const handleDiscountDropdown = () => {
  //   setIsDropdownOpen(!isDropdownOpen);
  // };
  /**End of code comment by Unnati on 15-07-2024
   * Reason-To handle add discount coupon dropdown
   */
  /**Code commented by Unnati on 15-07-2024
   * Reason-To handle shipping details dropdown
   */
  // const handleShippingDropdown = () => {
  //   setIsOpen(!isOpen);
  // };
  /**End of code comment by Unnati on 15-07-2024
   * Reason-To handle shipping details dropdown
   */
  /**Code commenetd by  Unnati on 14-07-2024
   * Reason-This code is not in use as i am getting filtered products from header
   */
  // const cartProducts = Array.isArray(cartData)
  //   ? cartData.map((item) => {
  //       const { productId, product, ...sizes } = item;
  //       const sizeQuantity = Object.entries(sizes).filter(
  //         ([key, value]) => key !== 'id' && key !== 'user' && value !== null
  //       );
  //       const productDetails = productList.find(
  //         (p) => p.id === (productId || product)
  //       );
  //       return {
  //         productDetails,
  //         sizeQuantity,
  //       };
  //     })
  //   : [];
  /**End of code commented by  Unnati on 14-07-2024
   * Reason-This code is not in use as i am getting filtered products from header
   */

  /**Code commented by Unnati on 15-07-2024
   * Reason-This code is not in use currently
   */
  // const handleZipChange = (e) => {
  //   setZip(e.target.value);
  // };
  /**End of code commented by Unnati on 15-07-2024
   * Reason-This code is not in use currently
   */
  /**Code commented by Unnati on 19-07-2024
   * Reason-To make state dropdown
   */
  // const StateDropdown = ({ countryCode = "US", onStateChange }) => {
  //   const options = State.getStatesOfCountry(countryCode).map((state) => ({
  //     value: state.isoCode,
  //     displayValue: `${state.name} - ${state.isoCode}`,
  //   }));

  //   const handleStateChange = (event) => {
  //     onStateChange(event.target.value);
  //   };

  //   return (
  //     <select className={styles.dropdown} onChange={handleStateChange}>
  //       {options.map((option, index) => (
  //         <option key={index} value={option.value}>
  //           {option.displayValue}
  //         </option>
  //       ))}
  //     </select>
  //   );
  // };
  /**End of code comment by Unnati on 19-07-2024
   * Reason-To make state dropdown
   */
  /**Code commented by Unnati on 19-07-2024
   * Reason-To handle state dropdown
   */
  // const handleStateChange = (state) => {
  //   setSelectedState(state);
  // };

  /*End of code comment by Unnati on 19-07-2024
   * Reason-To handle state dropdown
   */
  /**Code added by Unnati on 19-07-2024
   * Reason-To assign variable with country code and name
   */
  const countries = [{ code: "US", name: "United States" }];
  /**end of code addition by Unnati on 19-07-2024
   * Reason-To assign variable with country code and name
   */
  /**Code added by Unnati on 22-07-2024
   * Reason-To handle checkout button and send data from viewcart page to checkout page
   */
  const handleCheckout = (e) => {
    e.preventDefault();
    /**Code added by Unnati on 14-08-2024
     * Reason-Added condition to check whether user is logged in or not
     */
    if (user.id) {
      navigate("/checkout", {
        /**Code added by Unnati on 04-09-2024
         * Reason-Added replace
         */
        state: {
          cart,
          selectedCountry,
          selectedState,
          zipCode,
          totalItemCount,
          // Modification and addition by Om Shrivastava on 05-12-2024
          // Reason : Show the grand total amount
          // subtotal,
          grand_total,
          // End of modification and addition by Om Shrivastava on 05-12-2024
          // Reason : Show the grand total amount
        },

        /**End of code addition by Unnati on 04-09-2024
         * Reason-Added replace
         */
      });
    } else {
      navigate("/login", {
        state: {
          from: "/checkout",
          cart,
          selectedCountry,
          selectedState,
          zipCode,
        },
      });
    }
    /**End of code addition by Unnati on 14-08-2024
     * Reason-Added condition to check whether user is logged in or not
     */
  };
  /**End of code addition by Unnati on 22-07-2024
   * Reason-To handle checkout button and send data from viewcart page to checkout page
   */
  /**Code added by Unnati on 22-07-2024
   * Reason-To initialise subtotal variable as 0
   */
  let calculatedSubtotal = 0;
  /*End of code addition by Unnati on 22-07-2024
   * Reason-To initialise subtotal variable as 0
   */
  /**Code commented by Unnati on 22-07-2024
   * Reason-To handle country field
   */
  // const handleCountryChange = (event) => {
  //   setSelectedCountry(event.target.value);
  // };
  /**End of code comment by Unnati on 22-07-2024
   * Reason-To handle country field
   */
  /**Code commented by Unnati on 22-07-2024
   * Reason-To handle zipcode field
   */
  // const handleZipCodeChange = (event) => {
  //   setZipCode(event.target.value);
  // };
  /*End of code comment by Unnati on 22-07-2024
   * Reason-To handle zipcode field
   */
  /**Code added by Unnati on 25-07-2024
   * Reason-To get filtered sizes from cart items
   */
  const getFilteredSizes = (item) => {
    const sizeKeys = ["XS", "S", "M", "L", "XL", "XXL", "XXXL",
       /**Code added by Unnati on 30-12-2024
       * Reason-Added free size
       */
       "free_size"];
       /**End of code addition by Unnati on 30-12-2024
        * Reason-Added free size
        */
    const filterSizeKeys = sizeKeys.filter((key) => item[key] !== null || 0);
    const mapSize = filterSizeKeys.map((key) => [key, item[key]]);
    return mapSize;
  };
  /**End of code addition by Unnati on 25-07-2024
   * Reason-To get filtered sizes from cart items
   */
  /**Code added by Unnati on 25-08-2024
   * Reason-To handle delete button in shopping cart
   */
  const handleDelete = (
    product,
    size,
    // Addition by Om Shrivastava on 04-12-2024
    // Reason : Add the customized field also
    logo,
    patches,
    security_batches,
    // Added by - Ashlekh on 19-02-2025
    // Reason - To add customization
    security_id_on_back,
    printed_id,
    // End of code - Ashlekh on 19-02-2025
    // Reason - To add customization
    embroider,
    color
    // End of addition by Om Shrivastava on 04-12-2024
    // Reason : Add the customized field also
  ) => {
    if (user.id) {
      const deleteProduct = async () => {
        try {
          const data = await removeItem(
            user.id,
            product,
            size,
            // Addition by Om Shrivastava on 04-12-2024
            // Reason : Add the customized field also
            logo,
            patches,
            security_batches,
            // Added by - Ashlekh on 19-02-2025
            // Reason - To add customization
            security_id_on_back,
            printed_id,
            // End of code - Ashlekh on 19-02-2025
            // Reason - To add customization
            embroider,
            color
            // End of addition by Om Shrivastava on 04-12-2024
            // Reason : Add the customized field also
          );
          localStorage.setItem("cartData", JSON.stringify(data.cartItem));
          setCartData(data.cartItem);
        } catch (error) {
          console.error(error.message);
        }
      };
      deleteProduct();
      /**End of code addition by Unnati on 27-07-2024
       * Reason-To delete item from backend when user is logged in
       */
    } else {
      // Modification and addition by Om Shrivastava on 04-12-2024
      // Reason : Handle the customized functionality
      // const updatedData = cartData
      //   .map((item) => {
      //     if (item.product === product) {
      //       if (item[size] !== null) {
      //         const updatedItem = { ...item, [size]: null };
      //         const remainingSizes = Object.values(updatedItem);
      //         const filterRemainingSizes = remainingSizes.filter(
      //           (value) => value !== null
      //         );
      //         const remainingSizesLength = filterRemainingSizes.length;
      //         return remainingSizesLength > 1 ? updatedItem : null;
      //       }
      //     }

      //     return item;
      //   })
      //   .filter((item) => item !== null);
      // localStorage.setItem("cartData", JSON.stringify(updatedData));
      // setCartData(updatedData);
      const updatedData = cartData
        .map((item) => {
          if (
            item.product === product &&
            item.logo === logo &&
            item.patches === patches &&
            item.security_batches === security_batches &&
            // Added by - Ashlekh on 19-02-2025
            // Reason - To add customization
            item.security_id_on_back === security_id_on_back &&
            item.printed_id === printed_id &&
            // End of code - Ashlekh on 19-02-2025
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
    // End of modification and addition by Om Shrivastava on 04-12-2024
    // Reason : Handle the customized functionality
  };
  /**End of code addition by Unnati on 25-08-2024
   * Reason-To handle delete button in shopping cart
   */

  /**Code added by Unnati on 30-08-2024
   * Reason-To handle clear button
   */
  const handleClearButton = async () => {
    if (user.id) {
      const response = await clearCart(user.id);
      localStorage.removeItem("cartData");
      setCartData([]);
      if (response.message) {
        setCartData([]);
      } else {
        console.error("Failed to clear the cart:", response);
      }
    } else {
      localStorage.removeItem("cartData");
      setCartData([]);
    }
  };
  /**End of code addition by Unnati on 30-08-2024
   * Reason-To handle clear button
   */
  /**Code added by Unnati on 30-08-2024
   * Reason-To handle delete button
   */
  const handleDeleteClick = (
    product,
    size,
    // Addition by Om Shrivastava on 04-12-2024
    // Reason : Add the customized field also
    logo,
    patches,
    security_batches,
    // Added by - Ashlekh on 19-02-2025
    // Reason - To add customization
    security_id_on_back,
    printed_id,
    // End of code - Ashlekh on 19-02-2025
    // Reason - To add customization
    embroider,
    color
    // End of addition by Om Shrivastava on 04-12-2024
    // Reason : Add the customized field also
  ) => {
    setItemToDelete({
      product,
      size,
      // Addition by Om Shrivastava on 04-12-2024
      // Reason : Add the customized field also
      logo,
      patches,
      security_batches,
      // Added by - Ashlekh on 19-02-2025
      // Reason - To add customization
      security_id_on_back,
      printed_id,
      // End of code - Ashlekh on 19-02-2025
      // Reason - To add customization
      embroider,
      color,
      // End of addition by Om Shrivastava on 04-12-2024
      // Reason : Add the customized field also
    });
    setIsModalVisible(true);
  };
  /**End of code addition by Unnati on 30-08-2024
   * Reason-To handle delete button
   */
  const confirmDelete = () => {
    if (itemToDelete) {
      handleDelete(
        itemToDelete.product,
        itemToDelete.size,
        // Addition by Om Shrivastava on 04-12-2024
        // Reason : Add the customized field also
        itemToDelete.logo,
        itemToDelete.patches,
        itemToDelete.security_batches,
        // Added by - Ashlekh on 19-02-2025
        // Reason - To add customization
        itemToDelete.security_id_on_back,
        itemToDelete.printed_id,
        // End of code - Ashlekh on 19-02-2025
        // Reason - To add customization
        itemToDelete.embroider,
        itemToDelete.color
        // End of addition by Om Shrivastava on 04-12-2024
        // Reason : Add the customized field also
      );
      setItemToDelete(null);
    }
    setIsModalVisible(false);
  };
  /**Code added by Unnati on 30-08-2024
   * Reason-To cancel cancel delete button
   */
  const cancelDelete = () => {
    setItemToDelete(null);
    setIsModalVisible(false);
  };
  /**End of code addition by Unnati on 30-08-2024
   * Reason-To cancel cancel delete button
   */
  /**Code added by Unnati on 22-09-2024
   * Reason-To scroll page to the top
   */
  const scrollDoc = () => {
    window.scrollTo(0, 0);
  };
  /**End of code addition by Unnati on 22-09-2024
   * Reason-To scroll page to the top
   */
  /**Code added by Unnati on 09-10-2024
   * Reason-To get product details
   */
  const fetchCartDetails = async () => {
    try {
      /**
       * Modified by - Ashish Dewangan on 16-12-2024
       * Reason - For both guest and logged user get latest details from product
       */
      // const product = cartData.map((item) => item.product);

      // /**
      //  * Modified by - Ashish Dewangan on 12-12-2024
      //  * Reason - To handle fetch cart for guest user
      //  */
      // // const response = await getCartItem(product);
      // // setCartItem(response.products);
      // if(user && user.id){
      //   const response = await getCartItem(product,user.id);
      //   /**
      //    * Modified by - Ashish Dewangan on 15-12-2024
      //    * Reason - To update cart variable in context
      //    */
      //   // setCartItem(response.products);
      //   setCartData(response.products);
      //   /**
      //    * End of modification by - Ashish Dewangan on 15-12-2024
      //    * Reason - To update cart variable in context
      //    */
      // }else{
      //   // Code changed by - Ashlekh on 13-12-2024
      //   // Reason - To use getLatestDetailsOfCartItemsForGuest api from services
      //   // const response = await getLatestDetailsOfSelectedCartItem(cartData)
      //   const response = await getLatestDetailsOfCartItemsForGuest(cartData);
      //   // End of code - Ashlekh on 13-12-2024
      //   // Reason - To use getLatestDetailsOfCartItemsForGuest api from services
      //   /**
      //    * Modified by - Ashish Dewangan on 15-12-2024
      //    * Reason - To update cart variable in context
      //    */
      //   // setCartItem(response.products);
      //   setCartData(response.products);
      //   /**
      //    * End of modification by - Ashish Dewangan on 15-12-2024
      //    * Reason - To update cart variable in context
      //    */
      // }
      /**
       * End of modification by - Ashish Dewangan on 12-12-2024
       * Reason - To handle fetch cart for guest user
       */

      var data = JSON.parse(localStorage.getItem("cartData"));
      if (data) {
        const response = await getLatestDetailsOfCartItems(data);
        setCartData(response.products);
      }
      /**
       * Modified by - Ashish Dewangan on 16-12-2024
       * Reason - For both guest and logged user get latest details from product
       */
    } catch (error) {
      console.error("Error fetching cart details:", error);
    }
  };
  /**
   * Modified by - Ashish Dewangan on 15-12-2024
   * Reason - To fetch cart details on page load rather than depending on any variable
   */
  // useEffect(() => {
  //   fetchCartDetails();
  // }, [cartData]);
  useEffect(() => {
    fetchCartDetails();
    // Added by - Ashlekh on 11-03-2025
    // Reason - To handle name and description for mobile view
    const handleResize = () => {
      setMobileView(window.innerWidth <= 600);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
    // End of code - Ashlekh on 11-03-2025
    // Reason - To handle name and description for mobile view
  }, []);

  /**
   * End of modification by - Ashish Dewangan on 15-12-2024
   * Reason - To fetch cart details on page load rather than depending on any variable
   */

  /**End of code addition by Unnati on 09-10-2024
   * Reason-To get product details
   */
  // Addition by Om Shrivastava on 02-12-2024
  // Reason : Show the total price of Customized amount
  const calculateTotalCustomizedPrice = (CartItem) => {
    let total = 0;
    if (CartItem.logo) total += parseFloat(CartItem.logo_price) || 0;
    if (CartItem.patches) total += parseFloat(CartItem.patches_price) || 0;
    if (CartItem.embroider) total += parseFloat(CartItem.embroider_price) || 0;
    // Added by - Ashlekh on 19-02-2025
    // Reason - To calculate customization
    if (CartItem.security_id_on_back) total += parseFloat(CartItem.security_id_on_back_price) || 0;
    if (CartItem.printed_id) total += parseFloat(CartItem.printed_id_price) || 0;
    // End of code - Ashlekh on 19-02-2025
    // Reason - To calculate customization
    if (CartItem.security_batches)
      total += parseFloat(CartItem.security_batches_price) || 0;
    // Code changed by - Ashlekh on 07-02-2025
    // Reason - After decimal amount will return upto 2 digits only
    // return total;
    // return Math.round(total * 100) / 100;
    return parseFloat(total.toFixed(2));
    // End of code - Ashlekh on 07-02-2025
    // Reason - After decimal amount will return upto 2 digits only
  };
  // End of addition by Om Shrivastava on 02-12-2024
  // Reason : Show the total price of Customized amount

  const handleQuantityChange = async (
    userId,
    productId,
    currentQuantity,
    size,
    color,
    logo,
    patches,
    security_batches,
    // Added by - Ashlekh on 19-02-2025
    // Reason - To add customization
    security_id_on_back,
    printed_id,
    // End of code - Ashlekh on 19-02-2025
    // Reason - To add customization
    embroider,
    action
  ) => {
    let newQuantity = currentQuantity;
    // Added by - Ashlekh on 18-12-2024
    // Reason - To clear stock validation message useState
    setStockValidationMessage({});
    // End of code - Ashlekh on 18-12-2024
    // Reason - To clear stock validation message useState
    if (userId == null && userId == undefined) {
      const cartData = JSON.parse(localStorage.getItem("cartData")) || [];
      // const updatedCartData = cartData?.map((item) => {
      //   const matchedProduct =
      //     item.product == productId &&
      //     item.size == size &&
      //     item.color == color &&
      //     item.logo == logo &&
      //     item.patches == patches &&
      //     item.security_batches == security_batches &&
      //     item.embroider == embroider;
      //   if (matchedProduct) {
      //     return { ...item, quantity: newQuantity };
      //   } else {
      //     return item;
      //   }
      // });
      // Added by - Ashlekh on 18-12-2024
      // Reason - When user clicks on +/- then to send relevant details in API for guest user
      if (action == "increase") {
        newQuantity = currentQuantity + 1;
      } else if (action == "decrease") {
        newQuantity = currentQuantity - 1;
      }
      const response = await updateViewCartQuantityForGuestAPI(
        productId, // This is row id, not product_id
        newQuantity,
        size,
        color
      );
      let responseQuantity;
      if (response?.message == "Success") {
        responseQuantity = response?.quantity;
        const updatedCartData = cartData?.map((item) => {
          const matchedProduct =
            item.product == productId &&
            item.size == size &&
            item.color == color &&
            item.logo == logo &&
            item.patches == patches &&
            item.security_batches == security_batches &&
            // Added by - Ashlekh on 19-02-2025
            // Reason - To add customization
            item.security_id_on_back == security_id_on_back &&
            item.printed_id == printed_id &&
            // End of code - Ashlekh on 19-02-2025
            // Reason - To add customization
            item.embroider == embroider;
          if (matchedProduct) {
            return { ...item, quantity: responseQuantity };
          } else {
            return item;
          }
        });
        localStorage.setItem("cartData", JSON.stringify(updatedCartData));
        setCartData(updatedCartData);
        setStockValidationMessage({});
      } else if (response?.message == "Quantity cannot be less than one") {
        // setErrorMessage("Quantity cannot be less than one");
        // setErrorModalVisible(true);
        setStockValidationMessage((prev) => ({
          ...prev,
          [`${productId}-${size}-${color}`]: `Quantity cannot be less than 1`,
        }));
      } else if (response?.message == "quantity_exceeds") {
        // setErrorMessage("Stock not available");
        // setErrorModalVisible(true);
        setStockValidationMessage((prev) => ({
          ...prev,
          [`${productId}-${size}-${color}`]: `Stock is not available in size ${size}`,
        }));
      }
      else if (response?.message == "Quantity exceeds") {
        // setErrorMessage(`Only ${response?.quantity} items are available.`);
        // setErrorModalVisible(true);
        setStockValidationMessage((prev) => ({
          ...prev,
          [`${productId}-${size}-${color}`]: `Only ${response?.quantity} quantity available in size ${size}`,
        }));
      }
      // End of code - Ashlekh on 18-12-2024
      // Reason - When user clicks on +/- then to send relevant details in API for guest user
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
        // Added by - Ashlekh on 19-02-2025
        // Reason - To add customization
        security_id_on_back,
        printed_id,
        // End of code - Ashlekh on 19-02-2025
        // Reason - To add customization
        embroider
      );
      if (response?.message == "success") {
        localStorage.setItem(
          "cartData",
          JSON.stringify(response?.updated_cart_data)
        );
        setCartData(response?.updated_cart_data);
        // Added by - Ashlekh on 18-12-2024
        // Reason - To clear stock validation message useState
        setStockValidationMessage({});
        // End of code - Ashlekh on 18-12-2024
        // Reason - To clear stock validation message useState
      } else if (response?.message == "quantity_exceeds") {
        // Code changed by - Ashlekh on 18-12-2024
        // Reason - To display validation message below quantity (not in modal)
        // setErrorMessage("Quantity exceeds");
        // setErrorModalVisible(true);
        if(response?.available_quantity == 0) {
          setStockValidationMessage((prev) => ({
            ...prev,
            [`${productId}-${size}-${color}`]: `Stock is not available in size ${size}`,
          }));
        } else{
          setStockValidationMessage((prev) => ({
            ...prev,
            [`${productId}-${size}-${color}`]: `Only ${response?.available_quantity} quantity available in size ${size}`,
          }));
        }
        // End of code - Ashlekh on 18-12-2024
        // Reason - To display validation message below quantity (not in modal)
      }
      // Added by - Ashlekh on 07-12-2024
      // Reason - To add condition. If quantity is less than 1
      else if (response?.message == "Quantity cannot be less than one") {
        // Code changed by - Ashlekh on 18-12-2024
        // Reason - To display validation below quantity (not in modal)
        // setErrorMessage("Quantity cannot be less than zero");
        // setErrorModalVisible(true);
        setStockValidationMessage((prev) => ({
          ...prev,
          [`${productId}-${size}-${color}`]:
            "Quantity cannot be less than one.",
        }));
        // End of code - Ashlekh on 18-12-2024
        // Reason - To display validation message below quantity (not in modal)
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

  return (
    /*Code added by Unnati on 13-07-2024
     *Reason-To make structure of the shopping cart
     */
    <div className={styles.pageMain}>
      <div className={styles.pageContent}>
        {/**Code added by Unnati on 28-08-2024
         * Reason-To have navigation path
         */}
        <NavigationPath navigationPathArray={navigationPath} />
        {/**End of code addition by Unnati on 28-08-2024
         * Reason-To have navigation path
         */}
        <div className={styles.title}>
          <h2 className={styles.pageHeading}>Shopping Cart</h2>
        </div>
        {/**Code added by Unnati on 03-10-2024
         *Reason-To show total product count and grandtotal at the top */}

        {/**End of code addition by Unnati on 03-10-2024
         *Reason-To show total product count and grandtotal at the top */}
        {cartData &&
        cartData.length > 0 &&
        cartData.some((item) => getFilteredSizes(item).length > 0) ? (
          <div className={styles.columnMain}>
            <div className={styles.productDetails}>
              <div className={styles.productCount}>
                <p>Total Products:{totalItemCount}</p>
                <p>
                  Grand Total:
                  {/* ${subtotal} */}
                  
                  {config.currency_icon}{grand_total}
                </p>
              </div>
              {/* Added by - Ashlekh on 23-01-2025
              Reason - To keep the product list inside a div so that horizontal scrolling can be added in mobile view */}
              <div className={`${styles.tableContainer}`}>
                {/* End of code - Ashlekh on 23-01-2025
                Reason - To keep the product list inside a div so that horizontal scrolling can be added in mobile view */}
              <table className={styles.table}>
                <thead>
                  <tr>
                    {/**Code added by Unnati on 27-10-2024
                     *Reason-To change name */}
                    <th className={styles.itemColumn}>PRODUCT NAME</th>
                    {/* <th className={styles.itemColumn}>ITEM</th> */}
                    {/*End of code addition by Unnati on 27-10-2024
                     *Reason-To change name */}
                    {/* Addition by Unnati  on 07-12-2024
                    Reason : Add the rate field  */}
                    <th className={styles.priceColumn}>RATE</th>
                    {/* End of code addition by Unnati  on 07-12-2024
                    Reason : Add the rate field  */}
                    {/* Addition by Om Shrivastava on 02-12-2024
                     Reason : Show the customization field with their amount  */}
                    <th className={styles.customizedColumn}>
                      CUSTOMIZATION AMOUNT
                    </th>
                    {/* End of addition by Om Shrivastava on 02-12-2024
                     Reason : Show the customization field with their amount  */}

                    <th className={styles.priceColumn}>PRICE</th>
                    <th className={styles.qtyColumn}>QTY</th>
                    <th className={styles.subtotalColumn}>SUBTOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {/**Code added by Unnati on 19-07-2024
                   *Reason-To map cart items to their respective columns(First generating separate row for each size) */}

                  <>
                    {cartData.map((item, index) =>
                      getFilteredSizes(item).map(([size, quantity]) => {
                        /**Code added by Unnati on 14-08-2024
                         *Reason-Calculated sales rate and subtotal  */
                        const salesRate = item.sales_rate;
                        const subtotal = salesRate ? salesRate * quantity : 0;
                        calculatedSubtotal += subtotal;
                        /**End of code addition by Unnati on 14-08-2024
                         *Reason-Calculated sales rate and subtotal  */
                        {
                          /* Addition by Om Shrivastava on 02-12-2024
                         Reason : Mapped with their id  */
                        }
                        {
                          /* const CartItem =
                          cartItem.find(
                            (product) => product.id === item.product
                          ) || {}; */
                        }
                        // const CartItem =
                        // cartItem.find(
                        //   (product) => product.id === item.id
                        // ) || {};
                        {
                          /* End of addition by Om Shrivastava on 02-12-2024
                         Reason : Mapped with their id  */
                        }
                        // Added by - Ashlekh on 11-03-2025
                        // Reason - To handle name and description for mobile view
                        const displayedName = mobileView ? item?.name?.slice(0, 50) : item?.name;
                        const displayedDescription = mobileView ? item?.description?.slice(0, 100) : item?.description;
                        // End of code - Ashlekh on 11-03-2025
                        // Reason - To handle name and description for mobile view
                        return (
                          /**
                           * Modified by - Ashish Dewangan on 07-12-2024
                           * Reason - Gave unique id to each row for proper react rendering
                           */
                          // <React.Fragment key={`${item.productId}-${size}`}>
                          <React.Fragment
                            // Added by - Ashlekh on 19-02-2025
                            // Reason - To add customization
                            // key={`${item.product}-${item.size}-${item.logo}-${item.patches}-${item.security_batches}-${item.embroider}`}
                            key={`${item.product}-${item.size}-${item.logo}-${item.patches}-${item.security_batches}-${item.security_id_on_back}-${item.printed_id}-${item.embroider}`}
                            // End of code - Ashlekh on 19-02-2025
                            // Reason - To add customization
                          >
                            {/*
                             * End of modification by - Ashish Dewangan on 07-12-2024
                             * Reason - Gave unique id to each row for proper react rendering
                             */}
                            <tr>
                              <td className={styles.itemColumn}>
                                <div className={styles.imageAndName}>
                                  {/**Code added by Unnati on 25-07-2024
                                   *Reason-This code is not in use  */}
                                  <Link
                                    to={
                                      item.is_active
                                        ? `/productdetail/${
                                            item.product_id
                                              ? parseInt(item.product_id)
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
                                      className={styles.img}
                                      // src={`${config.baseURL}${CartItem.image1}`}
                                      src={`${config.baseURL}${item.image1}`}
                                      alt=""
                                    />
                                  </Link>
                                  {/**End of code addition by Unnati on 25-07-2024
                                   *Reason-This code is not in use  */}
                                  <div className={styles.productInfo}>
                                    {/* Code Changed by - Ashlekh on 25-01-2025
                                    Reason - To add class name */}
                                    {/* <p> */}
                                    <p className={`${styles.productName}`}>
                                    {/* End of code - Ashlekh on 25-01-2025
                                    Reason - To add class name */}
                                      <Link
                                        to={
                                          item.is_active
                                            ? `/productdetail/${
                                                item.product_id
                                                  ? parseInt(item.product_id)
                                                  : ""
                                              }`
                                            : "#"
                                        }
                                        /**Code added by Unnati on 11-12-2024
                                         *Reason-Send color through state */
                                        state={item.color}
                                        /**End of code addition by Unnati on 11-12-2024
                                         *Reason-Send color through state */
                                        className={styles.itemName}
                                      >
                                        {/**Code added by Unnati on 25-07-2024
                                         *Reason-This code is not in use  */}
                                        {/* Added by - Ashlekh on 11-03-2025
                                        Reason - To handle name for mobile view */}
                                        {/* {item.name} */}
                                        {mobileView && item?.name?.length > 50 ? `${displayedName}...` : displayedName}
                                        {/* Added by - Ashlekh on 11-03-2025
                                        Reason - To handle name for mobile view */}
                                        {/**End of code addition by Unnati on 25-07-2024
                                         *Reason-This code is not in use  */}
                                      </Link>
                                    </p>
                                    {/* Added by - Ashlekh on 12-12-2024
                                    Reason - To show description */}
                                    <p
                                      className={`${styles.descriptionContainer}`}
                                    >
                                      <Link
                                        to={
                                          item.is_active
                                            ? `/productdetail/${
                                                item.product_id
                                                  ? parseInt(item.product_id)
                                                  : ""
                                              }`
                                            : "#"
                                        }
                                        className={`${styles.descriptionContent}`}
                                      >
                                        {/* Added by - Ashlekh on 11-03-2025
                                        Reason - To handle description for mobile view */}
                                        {/* {item.description} */}
                                        {mobileView && item?.description?.length > 100 ? `${displayedDescription}...` : displayedDescription}
                                        {/* Added by - Ashlekh on 11-03-2025
                                        Reason - To handle description for mobile view */}
                                      </Link>
                                    </p>
                                    {/* End of code - Ashlekh on 12-12-2024
                                    Reason - To show description */}
                                    {/* Addition by Om Shrivastava on 26-11-2024
                                            Reason : Add text of customized product  */}
                                    {/* Modification and addition by Om Shrivastava on 02-12-2024
                                    Reason : Show the customized field  */}
                                    {/* Commented by Om Shrivastava on 04-12-2024
                                    Reason : No need to show the customized field in this column */}
                                    {/* {CartItem.logo  ? (
                                      <div
                                        style={{
                                          color: "#008000",
                                          fontSize: "10px",
                                        }}
                                      >
                                        Logo 
                                      </div>
                                    ) : null}
                                    {CartItem.patches  ? (
                                      <div
                                        style={{
                                          color: "#008000",
                                          fontSize: "10px",
                                        }}
                                      >
                                        Patches
                                      </div>
                                    ) : null}
                                    {CartItem.embroider ? (
                                      <div
                                        style={{
                                          color: "#008000",
                                          fontSize: "10px",
                                        }}
                                      >
                                        Embroider
                                      </div>
                                    ) : null}
                                    {CartItem.security_batches ? (
                                      <div
                                        style={{
                                          color: "#008000",
                                          fontSize: "10px",
                                        }}
                                      >
                                        Security id
                                      </div>
                                    ) : null} */}
                                    {/* Commented by Om Shrivastava on 04-12-2024
                                    Reason : No need to show the customized field in this column
                                    {/* End of modification and addition by Om Shrivastava on 02-12-2024
                                    Reason : Show the customized field  */}
                                    {/* End of addition by Om Shrivastava on 26-11-2024
                                            Reason : Add text of customized product  */}

                                    {/* Added by - Ashish Dewangan on 16-12-2024
                                     * Reason - To show customized product text */}
                                    {item.logo ||
                                    item.patches ||
                                    item.security_batches ||
                                    // Added by - Ashlekh on 19-02-2025
                                    // Reason - To add customization
                                    item.security_id_on_back ||
                                    item.printed_id ||
                                    // End of code - Ashlekh on 19-02-2025
                                    // Reason - To add customization
                                    item.embroider ? (
                                      <div
                                        className={styles.customizedProductText}
                                      >
                                        Customized product
                                      </div>
                                    ) : null}
                                    {/* End of addition by - Ashish Dewangan on 16-12-2024
                                     * Reason - To show customized product text */}

                                    <div className={styles.productInfoQuantity}>
                                      {/* Code changed by - Ashlekh on 27-01-2025
                                      Reason - To add class name */}
                                      {/* <div> */}
                                      <div className={`${styles.sizeContainer}`}>Size: {item.size}</div>
                                      {/* End of code - Ashlekh on 27-01-2025
                                      Reason - To add class name */}
                                      {/* Commented by jhamman on 14-10-2024
                                      Reason - quantity is showin two time*/}
                                      {/* <div>Quantity: {quantity}</div> */}
                                      {/* End of commentation by jhamman on 14-10-2024
                                      Reason - quantity is showin two time*/}
                                    </div>
                                    {/* Modification and addition by Om Shrivastava on 05-12-2024
                                     Reason : Add the quantity increment, decrement functionality */}
                                    {/* Added by - Ashlekh on 07-12-2024
                                    Reason - To display customization comment */}
                                    {item?.customization_comment != "" && (
                                      <div
                                        className={`${styles.customizationCommentContainer}`}
                                      >
                                        Customization comment :{" "}
                                        {/* Modified by - Ashish Dewangan on 12-12-2024
                                         * Reason - To show entire customization comment */}
                                        {/* {item?.customization_comment && typeof item.customization_comment === 'string' 
                                            ? item.customization_comment.length > 25 
                                              ? `${item.customization_comment.slice(0, 25)}...` 
                                              : item.customization_comment
                                            : null} */}
                                        {item?.customization_comment &&
                                        typeof item.customization_comment ===
                                          "string"
                                          ? item.customization_comment
                                          : null}
                                        {/* End of modification by - Ashish Dewangan on 12-12-2024
                                         * Reason - To show entire customization comment */}
                                      </div>
                                    )}
                                    {/* End of code - Ashlekh on 07-12-2024
                                    Reason - To display customization comment */}
                                    <div>
                                      <div
                                        className={`${styles.text} ${styles.quantityContainer}`}
                                      >
                                        Quantity:{" "}
                                        <p
                                          className={`${styles.iconContainer}`}
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
                                              // Added by - Ashlekh on 19-02-2025
                                              // Reason - To add customization
                                              item.security_id_on_back,
                                              item.printed_id,
                                              // End of code - Ashlekh on 19-02-2025
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
                                          className={`${styles.iconContainer}`}
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
                                              // Added by - Ashlekh on 19-02-2025
                                              // Reason - To add customization
                                              item.security_id_on_back,
                                              item.printed_id,
                                              // End of code - Ashlekh on 19-02-2025
                                              // Reason - To add customization
                                              item.embroider,
                                              "increase"
                                            )
                                          }
                                        >
                                          +
                                        </p>
                                      </div>

                                      {/*
                                       * Added by - Ashish Dewangan on 15-12-2024
                                       * Reason - If customizations are disabled by admin in user's cart than show proper message */}
                                      {(item.show_patches_and_embroider_on_UI !=
                                        true &&
                                        (item.logo == true ||
                                          item.patches == true ||
                                          item.security_batches == true ||
                                          // Added by - Ashlekh on 19-02-2025
                                          // Reason - To add customization
                                          item.security_id_on_back ||
                                          item.printed_id ||
                                          // End of code - Ashlekh on 19-02-2025
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
                                      // Added by - Ashlekh on 19-02-2025
                                      // Reason - To calculate customization
                                      (item.security_id_on_back &&
                                        (!item.security_id_on_back_price ||
                                          item.security_id_on_back_price <= 0)) ||
                                      (item.printed_id &&
                                        (!item.printed_id_price ||
                                          item.printed_id_price <= 0)) ||
                                      // End of code - Ashlekh on 19-02-2025
                                      // Reason - To calculate customization
                                      (item.security_batches &&
                                        (!item.security_batches_price ||
                                          item.security_batches_price <= 0)) ? (
                                        <div
                                          className={`${styles.notAvailableAnymoreText}`}
                                        >
                                          Selected customization(s) for this
                                          product is currently not available.
                                          Please re-add the product.
                                        </div>
                                      ) : null}

                                      {/*
                                       * End of addition by - Ashish Dewangan on 15-12-2024
                                       * Reason - If customizations are disabled by admin in user's cart than show proper message */}
                                        {/* Added by - Ashlekh on 18-12-2024
                                        Reason - To show validation message below quantity */}
                                        {stockValidationMessage[`${item.product}-${item.size}-${item.color}`] && (
                                          <div
                                            className={`${styles.stockValidationMessageContainer}`}
                                          >
                                            {
                                              stockValidationMessage[
                                                `${item.product}-${item.size}-${item.color}`
                                              ]
                                            }
                                          </div>
                                        )}
                                        {/* End of code - Ashlekh on 18-12-2024
                                        Reason - To show validation message below quantity */}
                                      {/* Code commented by - Ashlekh on 18-12-2024
                                      Reason - To display message below quantity (not in modal) */}
                                      {/* {errorModalVisible && (
                                        <Modal
                                          title=""
                                          open={errorModalVisible}
                                          onCancel={handleErrorModal}
                                          footer={null}
                                        >
                                          <p className={`${styles.errorModal}`}>
                                            {errorMessage}
                                          </p>
                                        </Modal>
                                      )} */}
                                      {/* End of comment - Ashlekh on 18-12-2024 
                                      Reason - To display message below quantity (not in modal) */}
                                    </div>
                                  </div>
                                  {/* End of modification and addition by Om Shrivastava on 05-12-2024
                                     Reason : Add the quantity increment, decrement functionality */}
                                </div>
                                {item.is_active ? (
                                  ""
                                ) : (
                                  <div className={styles.unavailableMessage}>
                                    Not available
                                  </div>
                                )}
                              </td>
                              {/**Code added by Unnati on 08-12-2024
                               *Reaso-Added sales rate */}
                              {/* Code changed by - Ashlekh on 20-01-2025
                              Reason - To add multiple class name */}
                              {/* <td className={styles.priceColumn}> */}
                              <td className={`${styles.priceColumn} ${styles.commonColumnHeading}`}>
                              {/* End of code - Ashlekh on 20-01-2025
                              Reason - To add multiple class name */}
                                {config.currency_icon}{item.sales_rate}
                              </td>
                              {/**End of code addition by Unnati on 08-12-2024
                               *Reaso-Added sales rate */}
                              {/* Addition by Om Shrivastava on 02-12-2024
                              Reason : Add customized amount  */}
                              {/* Code changed by - Ashlekh on 20-01-2025
                              Reason - To add multiple class name */}
                              {/* <td className={styles.customizedColumn}> */}
                              <td className={`${styles.customizedColumn} ${styles.commonColumnHeading}`}>
                              {/* End of code - Ashlekh on 20-01-2025
                              Reason - To add multiple class name */}
                                {/* {calculateTotalCustomizedPrice(item) > 0 ? ( */}
                                {item.logo == true ||
                                item.patches == true ||
                                item.security_batches == true ||
                                // Added by - Ashlekh on 19-02-2025
                                // Reason - To add customization
                                item.security_id_on_back == true ||
                                item.printed_id == true ||
                                // End of code - Ashlekh on 19-02-2025
                                // Reason - To add customization
                                item.embroider == true ? (
                                  <div className={styles.price}>
                                    {/* Addition by Om Shrivastava on 04-12-2024
                                Reason : Show customized amounts  */}
                                    <div>
                                      {/*
                                       * Modified by - Ashish Dewangan on 15-12-2024
                                       * Reason - To show different labels depending on customization is available or not
                                       */}
                                      {/* {item.logo?<p>Logo : ${item.logo_price}</p>:null}
                                {item.patches?<p>Patches / Batches : ${item.patches_price}</p>:null}
                                {item.embroider?<p>Embroider / Name : ${item.embroider_price}</p>:null}
                                {item.security_batches?<p>Security id : ${item.security_batches_price}</p>:null} */}

                                      {/* {item.logo ? item.logo_price && item.logo_price>0 && item.show_patches_and_embroider_on_UI==true ? <p  > Logo : ${item.logo_price}</p> : <p className={`${styles.customizationNotAvailableAnymoreText}`}> Logo : $0</p>:null}
                                {item.patches ? item.patches_price && item.patches_price>0 && item.show_patches_and_embroider_on_UI==true ? <p  > Patches / Batches : ${item.patches_price}</p> : <p className={`${styles.customizationNotAvailableAnymoreText}`}> Patches / Batches : $0</p>:null}
                                {item.embroider ? item.embroider_price && item.embroider_price>0 && item.show_patches_and_embroider_on_UI==true ? <p  > Embroider / Name : ${item.embroider_price}</p> : <p className={`${styles.customizationNotAvailableAnymoreText}`}> Embroider / Name : $0</p>:null}
                                {item.security_batches ? item.security_batches_price && item.security_batches_price>0 && item.show_patches_and_embroider_on_UI==true ? <p  > Security id : ${item.security_batches_price}</p> : <p className={`${styles.customizationNotAvailableAnymoreText}`}> Security id : $0</p>:null} */}

                                      {item.logo ? (
                                        item.logo_price &&
                                        item.logo_price > 0 &&
                                        item.show_patches_and_embroider_on_UI ==
                                          true ? (
                                          <p> Logo : ${item.logo_price}</p>
                                        ) : item.logo_price &&
                                          item.logo_price > 0 &&
                                          item.show_patches_and_embroider_on_UI ==
                                            false ? (
                                          <p
                                            className={`${styles.customizationNotAvailableAnymoreText}`}
                                          >
                                            {" "}
                                            Logo : ${item.logo_price}
                                          </p>
                                        ) : (
                                          <p
                                            className={`${styles.customizationNotAvailableAnymoreText}`}
                                          >
                                            {" "}
                                            Logo : $0
                                          </p>
                                        )
                                      ) : null}

                                      {item.patches ? (
                                        item.patches_price &&
                                        item.patches_price > 0 &&
                                        item.show_patches_and_embroider_on_UI ==
                                          true ? (
                                          <p>
                                            {" "}
                                            Patches / Batches : $
                                            {item.patches_price}
                                          </p>
                                        ) : item.patches_price &&
                                          item.patches_price > 0 &&
                                          item.show_patches_and_embroider_on_UI ==
                                            false ? (
                                          <p
                                            className={`${styles.customizationNotAvailableAnymoreText}`}
                                          >
                                            {" "}
                                            Patches / Batches : $
                                            {item.patches_price}
                                          </p>
                                        ) : (
                                          <p
                                            className={`${styles.customizationNotAvailableAnymoreText}`}
                                          >
                                            {" "}
                                            Patches / Batches : $0
                                          </p>
                                        )
                                      ) : null}

                                      {item.embroider ? (
                                        item.embroider_price &&
                                        item.embroider_price > 0 &&
                                        item.show_patches_and_embroider_on_UI ==
                                          true ? (
                                          <p>
                                            {" "}
                                            {/* Code changed by - Ashlekh on 18-12-2024
                                            Reason - To change name */}
                                            {/* Embroider / Name : $ */}
                                            Embroider: $
                                            {/* End of code - Ashlekh on 18-12-2024
                                            Reason - To change name */}
                                            {item.embroider_price}
                                          </p>
                                        ) : item.embroider_price &&
                                          item.embroider_price > 0 &&
                                          item.show_patches_and_embroider_on_UI ==
                                            false ? (
                                          <p
                                            className={`${styles.customizationNotAvailableAnymoreText}`}
                                          >
                                            {" "}
                                            {/* Code changed by - Ashlekh on 18-12-2024
                                            Reason - To change name */}
                                            {/* Embroider / Name : $ */}
                                            Embroider: $
                                            {/* End of code - Ashlekh on 18-12-2024
                                            Reason - To change name */}
                                            {item.embroider_price}
                                          </p>
                                        ) : (
                                          <p
                                            className={`${styles.customizationNotAvailableAnymoreText}`}
                                          >
                                            {" "}
                                            {/* Code changed by - Ashlekh on 18-12-2024
                                            Reason - To change name */}
                                            {/* Embroider / Name : $0 */}
                                            Embroider: $0
                                            {/* End of code - Ashlekh on 18-12-2024
                                            Reason - To change name */}
                                          </p>
                                        )
                                      ) : null}

                                      {item.security_batches ? (
                                        item.security_batches_price &&
                                        item.security_batches_price > 0 &&
                                        item.show_patches_and_embroider_on_UI ==
                                          true ? (
                                          <p>
                                            {" "}
                                            {/* Code changed by - Ashlekh on 18-02-2025
                                            Reason - To change customization name */}
                                            {/* Security id : $ */}
                                            Security ID on Back and Chest : $
                                            {/* End of code - Ashlekh on 18-02-2025
                                            Reason - To change customization name */}
                                            {item.security_batches_price}
                                          </p>
                                        ) : item.security_batches_price &&
                                          item.security_batches_price > 0 &&
                                          item.show_patches_and_embroider_on_UI ==
                                            false ? (
                                          <p
                                            className={`${styles.customizationNotAvailableAnymoreText}`}
                                          >
                                            {" "}
                                            {/* Code changed by - Ashlekh on 18-02-2025
                                            Reason - To change customization name */}
                                            {/* Security id : $ */}
                                            Security ID on Back and Chest : $
                                            {/* End of code - Ashlekh on 18-02-2025
                                            Reason - To change customization name */}
                                            {item.security_batches_price}
                                          </p>
                                        ) : (
                                          <p
                                            className={`${styles.customizationNotAvailableAnymoreText}`}
                                          >
                                            {" "}
                                            {/* Code changed by - Ashlekh on 18-02-2025
                                            Reason - To change customization name */}
                                            {/* Security id : $0 */}
                                            Security ID on Back and Chest : $0
                                            {/* End of code - Ashlekh on 18-02-2025
                                            Reason - To change customization name */}
                                          </p>
                                        )
                                      ) : null}

                                      {/*
                                       * End of modification by - Ashish Dewangan on 15-12-2024
                                       * Reason - To show different labels depending on customization is available or not
                                       */}
                                      {/* Added by - Ashlekh on 19-02-2025
                                      Reason - To add customization fields */}
                                      {item.security_id_on_back ? (
                                        item.security_id_on_back_price &&
                                        item.security_id_on_back_price > 0 &&
                                        item.show_patches_and_embroider_on_UI ==
                                          true ? (
                                          <p>
                                            {" "}
                                            Security ID on Back : $
                                            {item.security_id_on_back_price}
                                          </p>
                                        ) : item.security_id_on_back_price &&
                                          item.security_id_on_back_price > 0 &&
                                          item.show_patches_and_embroider_on_UI ==
                                            false ? (
                                          <p
                                            className={`${styles.customizationNotAvailableAnymoreText}`}
                                          >
                                            {" "}
                                            Security ID on Back : $
                                            {item.security_id_on_back_price}
                                          </p>
                                        ) : (
                                          <p
                                            className={`${styles.customizationNotAvailableAnymoreText}`}
                                          >
                                            {" "}
                                            Security ID on Back : $0
                                          </p>
                                        )
                                      ) : null}
                                      {item.printed_id ? (
                                        item.printed_id_price &&
                                        item.printed_id_price > 0 &&
                                        item.show_patches_and_embroider_on_UI ==
                                          true ? (
                                          <p>
                                            {" "}
                                            Printed ID : $
                                            {item.printed_id_price}
                                          </p>
                                        ) : item.printed_id_price &&
                                          item.printed_id_price > 0 &&
                                          item.show_patches_and_embroider_on_UI ==
                                            false ? (
                                          <p
                                            className={`${styles.customizationNotAvailableAnymoreText}`}
                                          >
                                            {" "}
                                            Printed ID : $
                                            {item.printed_id_price}
                                          </p>
                                        ) : (
                                          <p
                                            className={`${styles.customizationNotAvailableAnymoreText}`}
                                          >
                                            {" "}
                                            Printed ID : $0
                                          </p>
                                        )
                                      ) : null}
                                      {/* End of code - Ashlekh on 19-02-2025
                                      Reason - To add customization fields */}
                                    </div>
                                    {/* End of addition by Om Shrivastava on 04-12-2024
                                Reason : Show customized amounts  */}
                                    {/* Modified by - Ashish Dewangan on 15-12-2024
                                     * Reason - To show total customization amount only if user's selected customization are available */}
                                    {/* Total Amount : ${calculateTotalCustomizedPrice(item)}</div> */}
                                    {item.show_patches_and_embroider_on_UI !=
                                      true ||
                                    (item.logo &&
                                      (!item.logo_price ||
                                        item.logo_price <= 0)) ||
                                    (item.patches &&
                                      (!item.patches_price ||
                                        item.patches_price <= 0)) ||
                                    (item.embroider &&
                                      (!item.embroider_price ||
                                        item.embroider_price <= 0)) ||
                                    // Code changed by - Ashlekh on 19-02-2025
                                    // Reason - To add customization
                                    (item.security_id_on_back &&
                                      (!item.security_id_on_back_price ||
                                        item.security_id_on_back_price <= 0)) ||
                                    (item.printed_id &&
                                      (!item.printed_id_price ||
                                        item.printed_id_price <= 0)) ||
                                    // End of code - Ashlekh on 19-02-2025
                                    // Reason - To add customziation
                                    (item.security_batches &&
                                      (!item.security_batches_price ||
                                        item.security_batches_price <=
                                          0)) ? null : (
                                      <div>
                                        Total Amount : {config.currency_icon}
                                        {calculateTotalCustomizedPrice(item)}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  /* End of modification by - Ashish Dewangan on 15-12-2024
                                   * Reason - To show total customization amount only if user's selected customization are available */
                                  <div>----</div>
                                )}
                              </td>
                              {/* End of addition by Om Shrivastava on 02-12-2024
                              Reason : Add customized amount  */}
                              {/* Code changed by - Ashlekh on 20-01-2025
                              Reason - To add multiple class name */}
                              {/* <td className={styles.priceColumn}> */}
                              <td className={`${styles.priceColumn} ${styles.commonColumnHeading}`}>
                              {/* End of code - Ashlekh on 20-01-2025
                              Reason - To add multiple class name */}
                                <div className={styles.price}>
                                  {/**Code modified by Unnati on 12-09-2024
                                   *Reason-This code is not in use  */}

                                  {/* Modified by Jhamman on 10-10-2024
                                   Reason - calculate discounted price*/}
                                  {/* {CartItem.sales_rate != null &&
                                  !isNaN(Number(CartItem.sales_rate))
                                    ? `$${Number(CartItem.sales_rate).toFixed(2)}`
                                    : "Price not available"} */}
                                  {/**Code commented by Unnati on 25-11-2024
                                   *Reason-This code is not in use */}
                                  {/* {CartItem.sales_rate != null &&
                                  !isNaN(Number(CartItem.sales_rate)) ? (
                                    CartItem.sale_percentage ? (
                                      <div>
                                        {calculateDiscountFromProduct(
                                          CartItem.sales_rate,
                                          CartItem.sale_percentage
                                        )}
                                      </div>
                                    ) : (
                                      <div>
                                        $ */}
                                  {/**End of code comment by Unnati on 25-11-2024
                                   *Reason-This code is not in use */}
                                  {/**Code added by Unnati on 17-10-2024
                                   *Reason-Added fixed to */}
                                  {/* {Math.round(CartItem.sales_rate * 1e2) /
                                          1e2} */}
                                  {/**Code commented by Unnati on 25-11-2024
                                   *Reason-This code is not in use */}
                                  {/* {Number(CartItem.sales_rate)
                                          ? Number(CartItem.sales_rate).toFixed(
                                              2
                                            )
                                          : "0.00"} */}
                                  {/**End of code comment by Unnati on 25-11-2024
                                   *Reason-This code is not in use */}
                                  {/*End of code addition by Unnati on 17-10-2024
                                   *Reason-Added fixed to */}
                                  {/**Code commented by Unnati on 25-11-2024
                                   *Reason-This code is not in use */}
                                  {/* </div>
                                    )
                                  ) : (
                                    "Price not available"
                                  )} */}
                                  {/**End of code comment by Unnati on 25-11-2024
                                   *Reason-This code is not in use */}

                                  {/* End of modification by Jhamman on 10-10-2024
                                   Reason - calculate discounted price*/}

                                  {/**End of code modification by Unnati on 12-09-2024
                                   *Reason-This code is not in use  */}
                                  {/**Code added by Unnati on 25-11-2024
                                   *Reason-To show price before and  after discount*/}
                                  {item.sale_percentage ? (
                                    <div className={styles.discountedPriceText}>
                                      {/* Modification and addition by Om Shrivastava on 21-11-2024
                                                  Reason : Show the customized price  */}
                                      {item.logo ||
                                      item.patches ||
                                      item.security_batches ||
                                      // Added by - Ashlekh on 19-02-2025
                                      // Reason - To add customization
                                      item.security_id_on_back ||
                                      item.printed_id ||
                                      // End of code - Ashlekh on 19-02-2025
                                      // Reason - To add customization
                                      item.embroider ? (
                                        <>
                                          {/* Code changed by - Ashlekh on 10-02-2025
                                          Reason - To show price upto 2 digits after decimal */}
                                          {/* $
                                          {
                                            item?.after_customization_product_price
                                          } */}
                                          {config.currency_icon}{Number(item?.after_customization_product_price).toFixed(2)}
                                          {/* End of code - Ashlekh on 10-02-2025
                                          Reason - To show price upto 2 digits after decimal */}
                                        </>
                                      ) : (
                                        <>
                                         {config.currency_icon}
                                          {calculateDiscountFromProduct(
                                            item.sales_rate,
                                            item.sale_percentage
                                          )}
                                        </>
                                      )}
                                    </div>
                                  ) : (
                                    <div className={styles.discountedPriceText}>
                                      {item.logo ||
                                      item.patches ||
                                      item.security_batches ||
                                      // Added by - Ashlekh on 19-02-2025
                                      // Reason - To add customization
                                      item.security_id_on_back ||
                                      item.printed_id ||
                                      // End of code - Ashlekh on 19-02-2025
                                      // Reason - To add customization
                                      item.embroider ? (
                                        <>
                                          {/* Code changed by - Ashlekh on 10-02-2025
                                          Reason - To show price upto 2 digits after decimal */}
                                          {/* $
                                          {
                                            item?.after_customization_product_price
                                          } */}
                                          ${Number(item?.after_customization_product_price).toFixed(2)}
                                          {/* End of code - Ashlekh on 10-02-2025
                                          Reason - To show price upto 2 digits after decimal */}
                                        </>
                                      ) : (
                                        <>{config.currency_icon}{item.sales_rate}</>
                                      )}
                                    </div>
                                  )}
                                  {/* End of modification and addition by Om Shrivastava on 21-11-2024
                                                  Reason : Show the customized price  */}

                                  {item.sale_percentage ? (
                                    <div
                                      className={styles.mrpPriceText}
                                      style={
                                        item.sale_percentage
                                          ? {
                                              textDecoration: "line-through",
                                              textDecorationColor: "#000",
                                              color: "red",
                                            }
                                          : { color: "green" }
                                      }
                                    >
                                      ${item.sales_rate}
                                    </div>
                                  ) : null}
                                  {/**End of code addition by Unnati on 25-11-2024
                                   *Reason-To show price before and  after discount*/}
                                  {/* Added by - Ashlekh on 05-12-2024
                                  Reason - To display offer percentage */}
                                  {item.sale_percentage && (
                                    <p
                                      className={`${styles.offerPercentageText}`}
                                    >
                                      {item.sale_percentage}%off
                                    </p>
                                  )}
                                  {/* End of code - Ashlekh on 05-12-2024
                                   Reason - To display offer percentage */}
                                </div>
                              </td>
                              {/* Code changed by - Ashlekh on 20-01-2025
                              Reason - To add multiple class name */}
                              {/* <td className={styles.qtyColumn}> */}
                              <td className={`${styles.qtyColumn} ${styles.commonColumnHeading}`}>
                              {/* End of code - Ashlekh on 20-01-2025
                              Reason - To add multiple class name */}
                                <div className={styles.quantity}>
                                  {item.quantity}
                                </div>
                              </td>
                              {/* Code changed by - Ashlekh on 20-01-2025
                              Reason - To add multiple class name */}
                              {/* <td className={styles.subtotalColumn}> */}
                              <td className={`${styles.subtotalColumn} ${styles.commonColumnHeading}`}>
                              {/* End of code - Ashlekh on 20-01-2025
                              Reason - To add multiple class name */}
                                <div className={styles.subtotal}>
                                  {/** Code commented by Unnati on 25-07-2024
                                   * Reason- This code is not in use
                                   */}
                                  {/**Code added by Unnati on 12-09-2024
                                   *Reason-Adding upto 2 decimal places */}
                                  {/* Modified by Jhamman on 10-10-2024
                                   Reason - calculate price after discount*/}
                                  <div className={styles.subtotal}>
                                    {/* $
                                    {(quantity * CartItem.sales_rate).toFixed(
                                      2
                                    )} */}
                                    {item.sales_rate != null &&
                                    !isNaN(Number(item.sales_rate)) ? (
                                      item.sale_percentage ? (
                                        <div>
                                          {/**Code added by Unnati on 17-10-2024
                                           *Reason-Added fixed to */}
                                          {/* Modification and addition by Om Shrivastava on 26-11-2024
                                           Reason : according to customization price fix calculation  */}

                                          {/* $
                                          {(
                                            quantity *
                                            calculateDiscountFromProduct(
                                              CartItem.sales_rate,
                                              CartItem.sale_percentage
                                            )
                                          ).toFixed(2)} */}
                                          {item.logo ||
                                          item.patches ||
                                          item.security_batches ||
                                          // Added by - Ashlekh on 19-02-2025
                                          // Reason - To add customization
                                          item.security_id_on_back ||
                                          item.printed_id ||
                                          // End of code - Ashlekh on 19-02-2025
                                          // Reason - To add customization
                                          item.embroider ? (
                                            <>
                                              $
                                              {(
                                                item.quantity *
                                                item.after_customization_product_price
                                              ).toFixed(2)}
                                            </>
                                          ) : (
                                            <>
                                              $
                                              {(
                                                item.quantity *
                                                calculateDiscountFromProduct(
                                                  item.sales_rate,
                                                  item.sale_percentage
                                                )
                                              ).toFixed(2)}
                                            </>
                                          )}
                                          {/* End of modification and addition by Om Shrivastava on 26-11-2024
                                           Reason : according to customization price fix calculation  */}
                                        </div>
                                      ) : (
                                        <div>
                                          {/* Modification and addition by Om Shrivastava on 26-11-2024
                                           Reason : according to customization price fix calculation  */}

                                          {/* $
                                          {(
                                            Math.round(
                                              quantity *
                                                CartItem.sales_rate *
                                                1e2
                                            ) / 1e2
                                          ).toFixed(2)} */}
                                          {item.logo ||
                                          item.patches ||
                                          item.security_batches ||
                                          // Added by - Ashlekh on 19-02-2025
                                          // Reason - To add customization
                                          item.security_id_on_back ||
                                          item.printed_id ||
                                          // End of code - Ashlekh on 19-02-2025
                                          // Reason - To add customization
                                          item.embroider ? (
                                            <>
                                             {config.currency_icon}
                                              {(
                                                Math.round(
                                                  item.quantity *
                                                    item.after_customization_product_price *
                                                    1e2
                                                ) / 1e2
                                              ).toFixed(2)}
                                            </>
                                          ) : (
                                            <>
                                             {config.currency_icon}
                                              {(
                                                Math.round(
                                                  item.quantity *
                                                    item.sales_rate *
                                                    1e2
                                                ) / 1e2
                                              ).toFixed(2)}
                                            </>
                                          )}

                                          {/* Modification and addition by Om Shrivastava on 26-11-2024
                                           Reason : according to customization price fix calculation  */}

                                          {/*End of code addition by Unnati on 17-10-2024
                                           *Reason-Added fixed to */}
                                        </div>
                                      )
                                    ) : (
                                      "Price not available"
                                    )}
                                  </div>
                                  {/* End of modificatiomn by Jhamman on 10-10-2024
                                   Reason - calculate price after discount*/}
                                  {/**End of code addition by Unnati on 12-09-2024
                                   *Reason-Adding upto 2 decimal places */}
                                  {/** End of code comment by Unnati on 25-07-2024
                                   * Reason- This code is not in use
                                   */}
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="4">
                                <div className={styles.icons}>
                                  <div className={`${styles.square}`}>
                                    {/**Code commented by Unnati on 25-07-2024
                                     *Reason-This code is not in use */}
                                    <Link
                                      /**Code added by Unnati on 13-09-2024
                                       *Reason-Modified product_id */
                                      to={`/productdetail/${
                                        item.product_id
                                          ? `${item.product_id}`
                                          : ""
                                      }`}
                                      /*End of code addition by Unnati on 13-09-2024
                                       *Reason-Modified product_id */
                                      /**Code added by Unnati on 11-12-2024
                                       *Reason-Send color through state */
                                      state={item.color}
                                      /**End of code addition by Unnati on 11-12-2024
                                       *Reason-Send color through state */
                                    >
                                      <p className={`${styles.squareIcon}`}>
                                        {/* Modification and addition by Om Shrivastava on 03-12-2024
                                      Reason : Change the edit icon  */}
                                        {/* <MdEdit color="blue" /> */}
                                        {/* <MdInfo color="blue" /> */}
                                        {/* End of modification and addition by Om Shrivastava on 03-12-2024
                                      Reason : Change the edit icon */}
                                        {/* Code changed by - Ashlekh on 02-12-2024
                                        Reason - To change icon */}
                                        {/* <MdEdit color="blue" /> */}
                                        <FaEye color="green" />
                                        {/* End of code - Ashlekh on 02-12-2024
                                        Reason - To change icon */}
                                      </p>
                                    </Link>
                                    {/**End of code comment by Unnati on 25-07-2024
                                     *Reason-This code is not in use */}
                                  </div>
                                  <div className={styles.square}>
                                    <p
                                      className={styles.squareIcon}
                                      onClick={() => {
                                        handleDeleteClick(
                                          // Modification and addition by Om Shrivastava on 04-12-2024
                                          // Reason : Add the customized field also
                                          item.product,
                                          item.size,
                                          item.logo,
                                          item.patches,
                                          item.security_batches,
                                          // Added by - Ashlekh on 19-02-2025
                                          // Reason - To add customization
                                          item.security_id_on_back,
                                          item.printed_id,
                                          // End of code - Ashlekh on 19-02-2025
                                          // Reason - To add customization
                                          item.embroider,
                                          item.color
                                          // End of modification and addition by Om Shrivastava on 04-12-2024
                                          // Reason : Add the customized field also
                                        );
                                      }}
                                    >
                                      <RiDeleteBin6Fill color="red" />
                                    </p>
                                  </div>

                                  {isModalVisible && (
                                    <div className={styles.modalOverlay}>
                                      <div className={styles.modalContent}>
                                        <p>
                                          Are you sure you want to remove this
                                          item?
                                        </p>
                                        <button
                                          className={styles.buttonYesOrNo}
                                          onClick={confirmDelete}
                                        >
                                          Yes
                                        </button>
                                        <button
                                          className={styles.buttonYesOrNo}
                                          onClick={cancelDelete}
                                        >
                                          No
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })
                    )}
                    {/* Code modified by Unnati on 26-08-2024
                     *Adding a new row for buttons */}
                    {/* Commented by - Ashlekh on 23-01-2025
                    Reason - To change position of button */}
                    {/* <tr>
                      <td colSpan="4">
                        <div className={styles.buttonContainer}>
                          <div className={styles.buttonContainerOne}>
                            <Link to="/">
                              <button>CONTINUE SHOPPING</button>
                            </Link>
                            <button onClick={openModal}>
                              CLEAR SHOPPING CART
                            </button>
                            {isModalOpen && (
                              <div className={styles.modalOverlay}>
                                <div className={styles.modalContent}>
                                  <p>Are you sure you want to clear cart?</p>
                                  <button
                                    className={styles.buttonYesOrNo}
                                    onClick={confirmClear}
                                  >
                                    Yes
                                  </button>
                                  <button
                                    className={styles.buttonYesOrNo}
                                    onClick={cancelClear}
                                  >
                                    No
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr> */}
                    {/* End of code - Ashlekh on 23-01-2025
                    Reason - To change position of buttons */}
                    {/*End of code modification by Unnati on 26-08-2024
                     *Adding a new row for buttons */}
                  </>

                  {/**End of code addition by Unnati on 19-07-2024
                   *Reason-To map cart items to their respective columns(First generating separate row for each size) */}
                </tbody>
              </table>
              </div>
              {/* Added by - Ashlekh on 23-01-2025
              Reason -  To add button*/}
              <tr>
                <td colSpan="4">
                  <div className={styles.buttonContainer}>
                    <div className={styles.buttonContainerOne}>
                      <Link to="/">
                        <button>CONTINUE SHOPPING</button>
                      </Link>
                      <button onClick={openModal}>
                        CLEAR SHOPPING CART
                      </button>
                      {isModalOpen && (
                        <div className={styles.modalOverlay}>
                          <div className={styles.modalContent}>
                            <p>Are you sure you want to clear cart?</p>
                            <button
                              className={styles.buttonYesOrNo}
                              onClick={confirmClear}
                            >
                              Yes
                            </button>
                            <button
                              className={styles.buttonYesOrNo}
                              onClick={cancelClear}
                            >
                              No
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    {/**Code commented by Unnati on 11-09-2024
                     *Reason-To remove update shopping cart button
                      */}
                    {/* <div>
                      <button>UPDATE SHOPPING CART</button>
                    </div> */}
                    {/**End of code comment by Unnati on 11-09-2024
                     *Reason-To remove update shopping cart button
                      */}
                  </div>
                </td>
              </tr>
              {/* End of code - Ashlekh on 23-01-2025
              Reason -  To add button */}
            </div>
            {/**Code commented by Unnati on 18-09-2024
             *Reason-This code is not in use */}
            {/* <div className={styles.summarySectionContainer}> */}
            {/* <div
              className={`${styles.summarySection} ${
                isOpen || isDropdownOpen ? styles.expanded : ""
              }`}
            > */}
            {/* <div className={styles.summarySectionTitle}>
                <h3>SUMMARY</h3>
              </div> */}
            {/* <div className={styles.shippingContainer}>
                <div
                  className={styles.shippingTitle}
                  onClick={handleShippingDropdown}
                  style={{ cursor: "pointer" }}
                >
                  <div>
                    <h3>ESTIMATE SHIPPING AND TAX</h3>
                  </div>
                  <div>
                    <FaAngleDown />
                  </div>
                </div>
              </div> */}
            {/**Code added by Unnati on 17-07-2024
             *Reason-Adding isOpen to adjust the size of the summary section when drodpown is open  */}
            {/* {isOpen && (
                <div className={styles.shippingContent}>
                  <p className={styles.displayNote}>
                    Enter your destination to get a shipping estimate.
                  </p>
                  <form> */}
            {/**Code commented by Unnati on 17-07-2024
             *Reason -This code is not in use because country will be by default US */}
            {/* <div className={styles.formGroup}> */}
            {/* <h6 className={styles.countryTitle}>Country</h6>
                      <span style={{ color: "red" }}>*</span>

                      <CountrySelect
                        onChange={(e) => {
                          setCountryid(e.id);
                        }}
                        placeHolder="Select Country"
                      />

                      <h6 className={styles.stateTitle}>State</h6>
                      <StateSelect
                        countryid={countryid}
                        onChange={(e) => {
                          setstateid(e.id);
                        }}
                        placeHolder="Select State"
                      /> */}
            {/**Code added by Unnati on 19-07-2024
             *Reason-To add state dropdown */}
            {/* <div className={styles.formGroup}>
                        <div className={styles.Country}>
                          <div className={styles.CountryTitle}>
                            <label>Country</label>
                            <span className={styles.Mandatory}>*</span>
                          </div>
                          <select
                            id="country"
                            className={styles.dropdown}
                            value={selectedCountry}
                            onChange={handleCountryChange}
                          >
                            {countries.map((country) => (
                              <option key={country.code} value={country.code}>
                                {country.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className={styles.stateContainer}>
                          <label htmlFor="country">State/Province</label>
                          <StateDropdown
                            countryCode={selectedCountry}
                            onStateChange={handleStateChange}
                          />
                        </div>
                      </div> */}
            {/**End of code addition by Unnati on 19-07-2024
             *Reason-To add state dropdown */}
            {/* </div> */}
            {/**End of code comment by Unnati on 18-07-2024
             *Reason This code is not in use because country will be by default US*/}
            {/* <div className={styles.formGroup}>
                      <div className={styles.zipCodeContainer}>
                        <h6 className={styles.zipCodeTitle}>Zip/Postal Code</h6>
                        <input
                          type="text"
                          id="zip"
                          className={styles.zipCodeformControl}
                          value={zipCode}
                          onChange={handleZipCodeChange}
                        />
                      </div>
                    </div>
                  </form>
                </div>
              )} */}
            {/**End of code addition by Unnati on 18-07-2024
             *Reason-Adding isOpen to adjust the size of the summary section when drodpown is open  */}
            {/* <div className={styles.cartTotalContainer}>
            <table className={styles.cartTotal}>
              <tbody>
                <tr className={styles.summaryTrTag}>
                  <th>Subtotal</th>
                  <td>{`$${calculatedSubtotal.toFixed(2)}`}</td>
                </tr>
                <tr className={styles.summaryTrTag}>
                  <th>Order Total Incl. Tax</th>
                  <td>{`$${calculatedSubtotal.toFixed(2)}`}</td>
                </tr>
                <tr className={styles.summaryTrTag}>
                  <th>Order Total Excl. Tax</th>
                  <td>{`$${calculatedSubtotal.toFixed(2)}`}</td>
                </tr>
              </tbody>
            </table>
          </div> */}
            {/**Code commented by Unnati on 11-09-2024
             *Reason-Apply discount option is already there in checkout page */}
            {/* <div
                className={styles.discountDropdown}
                onClick={handleDiscountDropdown}
              >
                <div>
                  <h3>APPLY DISCOUNT CODE</h3>
                </div>
                <div>
                  <FaAngleDown />
                </div>
              </div> */}
            {/**End of code comment by Unnati on 11-09-2024
             *Reason-Apply discount option is already there in checkout page */}
            {/**Code added by Unnati on 17-07-2024
             *Reason-Adding isOpen to adjust the size of the summary section when drodpown is open  */}
            {/* {isDropdownOpen && (
            <div className={styles.dropdownContent}>
              <div className={styles.dicountInputBox}>
                <div className={styles.discountFieldTitle}>
                  <h6>Enter discount code</h6>
                </div>
                <div className={styles.dicountInputField}>
                  <input type="text" placeholder="Enter discount code" />
                </div>
              </div>
              <div className={styles.applyDiscountButton}>
                <button>APPLY DISCOUNT</button>
              </div>
            </div>
          )} */}
            {/* </div> */}

            {/**End of code addition by Unnati on 17-07-2024
             *Reason-Adding isOpen to adjust the size of the summary section when drodpown is open  */}
            <div className={styles.buttonCheckOutContainer}>
              <div className={styles.buttonProceedCheckOut}>
                {/**Code added by Unnati on 20-07-2024
                 *Reason-Adding link in checkout button */}

                <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>

                {/**End of code addition by Unnati on 20-07-2024
                 *Reason-Adding link in checkout button */}
              </div>
            </div>
            {/* </div> */}
            {/**End of code comment by Unnati on 18-09-2024
             *Reason-This code is not in use currently  */}
          </div>
        ) : (
          /**Code added by Unnati on 30-09-2024
           *Reason-Added shopping cart button */
          <div className={styles.noItemCart}>
            <p colSpan="4">No items in the cart.</p>
            <div className={styles.buttonContinueShopping}>
              <Link to="/">
                <button>CONTINUE SHOPPING</button>
              </Link>
            </div>
          </div>
        )}
        {/**End of code addition by Unnati on 30-09-2024
         *Reason-Added shopping cart button */}
      </div>
      {/**Code added by Unnati on 30-09-2024
       *Reason-Called scrollDoc component*/}
      {/* Code commented by - Ashlekh on 18-12-2024
      Reason - When user click on +/- button, then top of page appears */}
      {/* {scrollDoc()} */}
      {/* End of comment - Ashlekh on 18-12-2024
      Reason - When user click on +/- button, then top of page appears */}
      {/**End of code addition by Unnati on 30-09-2024
       *Reason-Called scrollDoc component*/}
    </div>
    /*End of code addition by Unnati on 13-07-2024
     *Reason-To make structure of the shopping cart
     */
  );
};

export default ViewCart;
/**End of code addition by Unnati on 13-07-2024
 * Reason-To have view cart page
 */
