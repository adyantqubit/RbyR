/**
 * Created by - Ashish on 22-05-2024
 * Reason - for storing global states
 */
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { createContext } from "react";
import {
  refresh,
  userDetails,
  getSocialLinks,
  getSettings,
} from "../Api/services";
export const GlobalContext = createContext();

export default function Context(props) {
  const [user, setUser] = useState({});
  const [cartData, setCartData] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [navigationPath, setNavigationPath] = useState([]);
  const [isUserLoading, SetIsUserLoading] = useState(true);
  const [social, setSocial] = useState([]);
  const [settingInfo, setSettingInfo] = useState({});
  // Added by - Ashlekh on 05-10-2024
  // Reason - To display size chart
  const [sizeChart, setSizeChart] = useState(null);
  // End of code - Ashlekh on 05-10-2024
  // Reason - To display size chart

  // Added by - Ashlekh on 04-11-2024
  // Reason - To store wish list data
  const [wishListData, setWishListData] = useState([]);
  // End of code - Ashlekh on 04-11-2024
  // Reason - To store wish list data
  /**Code added by Unnati on 10-01-2025
   * Reason-Added varivale to show modal
   */
  const [showModal,setShowModal] =useState(false);
   /**End of cdoe addition by Unnati on 10-01-2025
   * Reason-Added varivale to show modal
   */
  /**Code commented by Unnati on 13-07-2024
   * Reason-As we do not need to get whole product list from backend
   */
  // useEffect(() => {
  //   const fetchProductList = async () => {
  //     try {
  //       const data = await getProductList();
  //       setProductList(data.product);
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   };
  //   fetchProductList();
  // }, []);
  /**End of code comment by Unnati on 13-07-2024
   * Reason-As we do not need to get whole product list from backend
   */

  /**Code commented by Unnati on 11-07-2024
   * Reason-To get updated cart from backend and local it in local storage
   */
  // const fetchCart = async () => {
  //   const cartData = await getCartDetails();
  //   setCart(cartData);
  //   localStorage.setItem("cartData", JSON.stringify(cartData));
  // };
  // useEffect(() => {
  //   fetchCart();
  // }, []);
  /**End of code commented by Unnati on 11-07-2024
   * Reason-To get updated cart from backend and local it in local storage
   */

  const location = useLocation()
  useEffect(() => {
    const previousPath = sessionStorage.getItem('path');
    sessionStorage.setItem('path', location.pathname);
  },[location.pathname])

  /* Added by - Ashish Dewangan on 22-05-2024
   * Reason - On refresh get user details from backend
   */
  useEffect(() => {
    var access = localStorage.getItem("access");
    /**Code added by Unnati on 18-09-2024
     * Reason-To get refresh from local storage
     */

    /**End of code additon by Unnati on 18-09-2024
     * Reason-To get refresh from local storage
     */
    if (access) {
      /**Code commented by Unnati on 14-09-2024
       * Reason-To setIsUserLoadting value
       */
      // SetIsUserLoading(false);
      getUserDetails(access);

      // SetIsUserLoading(false);
      // console.log("context false",isUserLoading)
      /**End of code comment by Unnati on 14-09-2024
       * Reason-To setIsUserLoadting value
       */
      /**Code added by Unnati on 18-09-2024
       * Reason-Added Refresh access token
       */
    } else{
      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        refreshAccessToken();
      }
      else {
        localStorage.removeItem("access");
        setUser({})
        SetIsUserLoading(false);
      }
    }
     
  }, []);

  /**
   * End of code addition by - Ashish Dewangan on 22-05-2024
   * Reason - On refresh get user details from backend
   */
  /**Code commented by Unnati on 28-07-2024
   * Reason- This code is not in use currently
   */
  // useEffect(() => {
  //   const storedCartData = localStorage.getItem("cartData");
  //   if (storedCartData) {
  //     setCartData(JSON.parse(storedCartData));
  //   }
  // }, []);
  /**End of code comment by Unnati on 28-07-2024
   * Reason- This code is not in use currently
   */

  /**Code commented by Unnati on 07-07-2024
   * Reason- This code is not in use currently
   */
  const refreshCartData = () => {
    const storedCartData = localStorage.getItem("cartData");
    // Code changed by - Ashlekh on 23-11-2024
    // Reason - To keep storedCartData in try-catch
    // if (storedCartData) {
    //   setCartData(JSON.parse(storedCartData));
    // }
    if (storedCartData) {
      try{
      setCartData(JSON.parse(storedCartData));
      } catch (error) {
        console.error("Failed to get cart data: ", error);
      }
    }
  };
  useEffect(() => {
    refreshCartData();
    // Added by - Ashlekh on 04-11-2024
    // Reason - To get wishlist data from localstorage
    getWishListData();
    // End of code - Ashlekh on 04-11-2024
    // Reason - To get wishlist data from localstorage
  }, []);
  /**End of code comment by Unnati on 07-07-2024
   * Reason- This code is not in use currently
   */

  /**Code commented by Unnati on 11-07-2024
   * Reason-To get updated cart from backend and local it in local storage
   */
  // useEffect(() => {
  //   const fetchAndStoreCartData = async () => {
  //     const data = await getCartData();
  //     setCartData(data);
  //   };

  //   fetchAndStoreCartData();
  // }, []);
  /**End of code commented by Unnati on 11-07-2024
   * Reason-To get updated cart from backend and local it in local storage
   */

  /**Code commented by Unnati on 11-07-2024
   * Reason-To get updated cart from backend and local it in local storage
   */
  // const updateCartData = async (data) => {
  //   try {
  //     const updatedCartData = await updateCart(data);
  //     setCartData(updatedCartData);
  //     localStorage.setItem('cartData', JSON.stringify(updatedCartData));
  //     console.log("Cart data updated successfully:", updatedCartData);

  //   } catch (err) {
  //     console.error('Error updating cart:', err);
  //   }
  // };
  /**End of code commented by Unnati on 11-07-2024
   * Reason-To get updated cart from backend and local it in local storage
   */
  
  /**
   * Added by - Ashish Dewangan on 22-05-2024
   * Reason - calling api to get user details
   */
  const getUserDetails = async (access) => {
    const response = await userDetails(access);
    /**Code added by Unnati on 15-09-2024
     * Reason-To setIsUserLoading value
     */
    SetIsUserLoading(false);
    /**End of code addition by Unnati on 15-09-2024
     * Reason-To setIsUserLoading value
     */
    if (response.user) {
      setUser(response.user);
    } else {
      // localStorage.removeItem("access");
      /**Code added by Unnati on 18-09-2024
       * Reason-Added refresh token
       */

      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        refreshAccessToken();
      } else {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh")
        setUser({});
        SetIsUserLoading(false);
      }
      /**End of code addition by Unnati on 18-09-2024
       * Reason-Added refresh token
       */
    }
    {
      /**Code commented by Unnati on 14-09-2024
       *Reason-This code is not in use currently */
    }
    //  else {
    //   const response = await refresh();
    //   if (response.refresh) {
    //     localStorage.setItem("access", response.access);
    //     /**Code added by Unnati on 26-07-2024
    //      * Reason-Added a condition
    //      */
    //     // if (localStorage.getItem("access"))
    //     //   getUserDetails(localStorage.getItem("access"));
    //   }
    //    else {
    //     localStorage.removeItem("access");
    //   }
    /**End of code addition by Unnati on 26-07-2024
     * Reason-Added a condition
     */
    // }
    {
      /**End of code commented by Unnati on 14-09-2024
       *Reason-This code is not in use currently */
    }
  };
  /**
   * End of code addition by - Ashish Dewangan on 22-05-2024
   * Reason - calling api to get user details
   */
  /**Code added by Unnati on 18-09-2024
   * Reason-Added Refresh api
   */
  const refreshAccessToken = async () => {
    const response = await refresh();
    if (response && response.access) {
      var a=response.access
      localStorage.setItem("access", a);
      localStorage.setItem("refresh", response.refresh);
x(a)
    } else {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh")
      setUser({});
      SetIsUserLoading(false);
    }
  };
  /**End of code addition by Unnati on 18-09-2024
   * Reason-Added Refresh api
   */

  const x=async(a)=>{
    const response = await userDetails(a);

    if (response.user) {
      setUser(response.user);
    } else {

      localStorage.removeItem("access");
      localStorage.removeItem("refresh")
      setUser({});
      SetIsUserLoading(false);
    }
  }
  /**Code commented by Unnati on 15-07-2024
   * Reason-This code is not in use
   */
  // const addToCartContext = (item) => {
  //   setCartData((prevCartData) => {
  //     const updatedCartData = [...prevCartData, item];
  //     localStorage.setItem("cartData", JSON.stringify(updatedCartData));
  //     return updatedCartData;
  //   });
  // };
  /**End of code comment by Unnati on 15-07-2024
   * Reason-This code is not in use
   */
  /**Code added by Unnati on 29-07-2024
   * Reason-To set cart data as empty
   */
  // useEffect(() => {
  //   if (!localStorage.getItem("cartData")) {
  //     localStorage.setItem("cartData", JSON.stringify([]));
  //   }
  // }, []);
  /**End of code addition by Unnati on 29-07-2024
   * Reason-To set cart data as empty
   */

  /**Code added by Unnati on 25-08-2024
   * Reason-To reset filter
   */
  const resetFilters = () => {
    setSelectedColors([]);
    setSelectedBrands([]);
    setMinPrice([]);
    setMaxPrice([]);
    setPriceRange([minPrice, maxPrice]);
  };
  /**End of code addition by Unnati on 25-08-2024
   * Reason-To reset filter
   */
  /**Code added by Unnati on 26-08-2024
   * Reason-To clear cart data
   */
  const clearCart = () => {
    setCartData([]);
  };
  /**End of code addition by Unnati on 26-08-2024
   * Reason-To clear cart data
   */
  /**Code added by Unnati on 20-09-2024
   * Reason-To get social links
   */
  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const data = await getSocialLinks();
        setSocial(data?.social ?? []);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchSocialLinks();
  }, []);
  /**End of code addition by Unnati on 20-09-2024
   * Reason-To get social links
   */

  /**Code added by Unnati Bajaj on 20-09-2024
   * Reason -To get contact details when the component loads
   */
  useEffect(() => {
    const fetchSettingInfo = async () => {
      try {
        const data = await getSettings();
        setSettingInfo(data.setting);
        // Added by - Ashlekh on 05-10-2024
        // Reason - To set size chart image 
        setSizeChart(data?.setting?.size_chart);
        // End of code - Ashlekh on 05-10-2024
        // Reason - To set size chart image
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchSettingInfo();
  }, []);
  /**End of code addition by Unnati Bajaj on 20-09-2024
   * Reason -To get contact details when the component loads
   */

  // Added by - Ashlekh on 04-11-2024
  // Reason - To get wishListData from localStorage
  const getWishListData = () => {
    const wishListData = localStorage.getItem("wishListData");
    if (wishListData) {
      // Code added by - Ashlekh on 20-11-2024
      // Reason - To add try catch block
      try{
        setWishListData(JSON.parse(wishListData));
      } catch(error) {
        console.error("Failed to get wishlist data ", error)
      }
      // End of code - Ashlekh on 20-11-2024
      // Reason - To add try catch block
    }
  };
  // End of code - Ashlekh on 04-11-2024
  // Reason - To get wishListData from localStorage
  return (
    <>
      <GlobalContext.Provider
        value={{
          user,
          setUser,
          cartData,
          setCartData,
          refreshCartData,
          cart,
          setCart,
          /**Code commented by Unnati on 19-07-2024
          Reason-This code is not in use */
          // fetchCart,
          // updateCartData,
          // productList,
          // getProductDetails,
          // addToCartContext,
          /**End of code addition by Unnati on 19-07-2024
          Reason-This code is not in use */
          selectedColors,
          setSelectedColors,
          selectedBrands,
          setSelectedBrands,
          priceRange,
          setPriceRange,
          minPrice,
          setMinPrice,
          maxPrice,
          setMaxPrice,
          resetFilters,
          clearCart,
          navigationPath,
          setNavigationPath,
          isUserLoading,
          SetIsUserLoading,
          social,
          setSocial,
          settingInfo,
          setSettingInfo,
          // Added by - Ashlekh on 05-10-2024
          // Reason - To make sizeChart variable to other components
          sizeChart,
          setSizeChart,
          // End of code - Ashlekh on 05-10-2024
          // Reason - To make sizeChart variable to other components
          // Added by - Ashlekh on 04-11-2024
          // Reason - To make wish list available to other components
          wishListData,
          setWishListData,
          // End of code - Ashlekh on 04-11-2024
          // Reason - To make wish list available to other components
          /**Code added by Unnati on 10-01-2025
          *Reason-Added show modal and set show modal */
          showModal,
          setShowModal,
          /**End of code additin by Unnati on 10-01-2025
          *Reason-Added show modal and set show modal */
        }}
      >
        {props.children}
      </GlobalContext.Provider>
    </>
  );
}
