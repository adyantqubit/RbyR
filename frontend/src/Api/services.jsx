/**
 * Created by - Ashish Dewangan on 22-05-2024
 * Reason - To specify API calling methods
 */
/**
 * Added by - Unnati Bajaj on 26-05-2024
 * Reason - To import notification object
 */


import notificationObject from "../components/Widgets/Notification/Notification";
/**
 * End of code addition by - Unnati Bajaj on 26-05-2024
 * Reason - To import notification object
 */
import API from "./api";



/**
 * Added by - Ashish Dewangan on 22-05-2024
 * Reason - To post login details
 */
export const login = async (userDetails) => {
  const response = await API.post(`/login/`, userDetails, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  if (response.response) {
    if (response.response.status == 404) {
      /**
       * Added by - Unnati Bajaj on 27-05-2024
       * Reason - Error handling/notification
       */
      // notificationObject.error(response.error);
      /**
       * End of code addition by - Unnati Bajaj on 27-05-2024
       * Reason - Handling and displaying error messages to the user
       */
      console.log(response.response.data);
    }
    if (response.response.status == 401) {
      /**
       * Added by - Unnati Bajaj on 27-05-2024
       * Reason - Error handling/notification
       */
      // notificationObject.error(response.error);
      /**
       * End of code addition by - Unnati Bajaj on 27-05-2024
       * Reason - Handling and displaying error messages to the user
       */
      console.log(response.response.data);
    }
    return response.response.data;
  } else {
    if (response.status == 200) {
      return response ? response.data : {};
    }
  }
};
/**
 * End of code addition by - Ashish Dewangan on 22-05-2024
 * Reason - To post login details
 */

/**
 * Added by - Ashish Dewangan on 22-05-2024
 * Reason - To get user details
 */
export const userDetails = async (access) => {
  const response = await API.get(`/user/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`,
    },
  }).catch((err) => console.log(err));
  if (response.response) {
    if (response.response.status == 401) {
      console.log(response.response.data);
      /**Code added by Unnati on 26-10-2024
       * Reason-To check whether user is active or not
       */
      if(response.response.data.code=="user_inactive"){
        return response.response.data
      }
      /*End of code addition by Unnati on 26-10-2024
       * Reason-To check whether user is active or not
       */
    }
    return {};
  } else {
    if (response.status == 200) {
      return response ? response.data : {};
    }
  }
};
/**
 * End of code addition by - Ashish Dewangan on 22-05-2024
 * Reason - To get user details
 */

/**
 * Added by - Ashish Dewangan on 22-05-2024
 * Reason - To get new access token using refresh token
 */

export const refresh = async () => {
  const data = {
    refresh_token: localStorage.getItem("refresh"),
  };
  const response = await API.post(`/refresh/`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  if (response.response) {
    if (response.response.status != 200) {
      console.log(response.response.data);
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    }
    return {};
  } else {
    if (response.status == 200) {
      return response ? response.data : {};
    }
  }
};
/**
 * End of code addition by - Ashish Dewangan on 22-05-2024
 * Reason - To get new access token using refresh token
 */

/**
 * Added by - Ashish Dewangan on 23-05-2024
 * Reason - To post login details
 */
export const signup = async (userDetails) => {
  const response = await API.post(`/signup/`, userDetails, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  if (response.response) {
    if (response.response.status == 500) {
      /**
       * Added and commented by - Unnati Bajaj on 27-05-2024
       * Reason - Error handling/notification
       */
      //  if(response.response.data.error){
      //   notificationObject.success(response.response.data.error);
      //  }
      // else{
      //   notificationObject.success(response.response.data);
      // }
      /**
       * End of code commented by - Unnati Bajaj on 27-05-2024
       * Reason - Handling and displaying error messages to the user
       */
    }
    return response.response.data;
  } else {
    if (response.status == 200) {
      return response ? response.data : {};
    }
  }
};
/**
 * End of code addition by - Ashish Dewangan on 23-05-2024
 * Reason - To post login details
 */
/**
 * Added by - Unnati Bajaj on 26-05-2024
 * Reason - To post otp
 */
export const sendOtpApi = async (value) => {
  const response = await API.post(
    `/send-otp/`,
    { postFor: "email", data: value },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).catch((err) => console.log(err));
  return response ? response.data : {};
};
/**
 * End of code addition by - Unnati Bajaj on 26-05-2024
 * Reason - To post otp
 */
/**
 * Added by - Unnati Bajaj on 26-05-2024
 * Reason - To update password during password reset
 */
export const updatePasswordApi = async (value) => {
  const response = await API.put(`/update-password/`, value, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
/**
 * End of code addition by - Unnati Bajaj on 26-05-2024
 * Reason - To update password during password reset
 */

/**
 * Added by - Unnati on 27-05-2024
 * Reason - To verify otp
 */
export const verifyOtpApi = async (value) => {
  try {
    const response = await API.post("/verify-otp/", {
      postFor: "otp",
      data: value,
    });
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
};

/**End of code addition by - Unnati on 27-05-2024
 * Reason - To verify otp
 */

/**
 * Added by - Unnati Bajaj on 29-05-2024
 * Reason - To post contact-Us details
 */
export const contactus = async (value) => {
  const response = await API.post(`/contactus/`, value, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  if (response.response) {
    if (response.response.status == 500) {
      console.log(response.response.data);
    }
    return response.response.data;
  } else {
    if (response.status == 200) {
      return response ? response.data : {};
    }
  }
};
/**
 *End of code addition by Unnati Bajaj on 29-05-2024
 * Reason - To post contact-Us details
 */

/**
 * Added by - Unnati Bajaj on 29-05-2024
 * Reason - To get settings
 */
export const getSettings = async (value) => {
  try {
    const response = await API.get("/contactus/", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.log(response.data);

      return {};
    }
  } catch (err) {
    console.error("Error fetching settings:", err);

    return {};
  }
};
/**
 * End of code additon by Unnati Bajaj on 29-05-2024
 * Reason - To get settings
 */

/**Code added by Unnati on 31-05-2024
 * Reason -To update user details
 */
export const updateUserDetails = async (userData) => {
  try {
    const authToken = localStorage.getItem("access");
    const response = await API.put(`/update-user-details/`, userData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    notificationObject.success("Data modified successfully");
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
/**End of code addition by Unnati on 31-05-2024
 * Reason -To update user details
 */

/**Code added by Unnati on 02-06-2024
 * Reason -To get social media links
 */
export const getSocialLinks = async () => {
  try {
    const response = await API.get("/get-social-links/", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.log(response.data);

      return {};
    }
  } catch (err) {
    console.error("Error fetching social links:", err);

    return {};
  }
};
/**End of code addition by Unnati on 02-06-2024
 * Reason -To get social media links
 */

/**Code added by Unnati on 02-06-2024
 * Reason -To get FAQ
 */
export const getFaq = async () => {
  try {
    const response = await API.get("/faq/", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.log(response.data);

      return {};
    }
  } catch (err) {
    console.error("Error fetching FAQ:", err);

    return {};
  }
};
/**End of code addition by Unnati on 02-06-2024
 * Reason -To get FAQ
 */

/**Code added by Unnati on 02-06-2024
 * Reason -To get store locator
 */
export const getStoreLocator = async () => {
  try {
    const response = await API.get("/storelocator/", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.log(response.data);

      return {};
    }
  } catch (err) {
    console.error("Error fetching Store Locator:", err);

    return {};
  }
};
/**End of code addition by Unnati on 02-06-2024
 * Reason -To get store locator
 */

/**Code added by Unnati on 02-06-2024
 * Reason -To get categories
 */
export const getCategory = async () => {
  try {
    const response = await API.get("/category/", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.log(response.data);

      return {};
    }
  } catch (err) {
    console.error("Error fetching Category:", err);

    return {};
  }
};
/**End of code addition by Unnati on 02-06-2024
 * Reason -To get categories
 */
/**Code added  by Unnati on 10-06-2024
 * Reason -To get about us
 */
export const getAboutUs = async () => {
  try {
    const response = await API.get("/aboutus/", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.log(response.data);
      return {};
    }
  } catch (err) {
    console.error("Error fetching About us:", err);
    return {};
  }
};
/**End of code addition by Unnati on 10-06-2024
 * Reason -To get about us
 */

/**Code added  by Unnati on 10-06-2024
 * Reason -To get terms and conditions
 */
export const getTermsAndConditions = async () => {
  try {
    const response = await API.get("/terms-and-conditions/", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.log(response.data);

      return {};
    }
  } catch (err) {
    console.error("Error fetching Terms and conditions:", err);

    return {};
  }
};
/**End of code addition by Unnati on 10-06-2024
 * Reason -To get terms and conditions
 */

/**Code added  by Unnati on 10-06-2024
 * Reason -To get our policies
 */
export const getOurPolicies = async () => {
  try {
    const response = await API.get("/ourpolicies/", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.log(response.data);

      return {};
    }
  } catch (err) {
    console.error("Error fetching Our Policies:", err);

    return {};
  }
};
/**End of code addition by Unnati on 10-06-2024
 * Reason -To get our policies
 */
/**Code added by Unnati on 20-06-2024
 * Reason -To get filtered products
 */
export const getProduct = async (
  cid,
  colors,
  brands,
  minPrice,
  maxPrice,
  sortBy,
  sortOrder,
  currentPage,
  listPerPage,
  /**Code added by Unnati on 10-08-2024
   * Reason-Added selected item type
   */
  selectedItemType
  /**End of code addition by Unnati on 10-08-2024
   * Reason-Added selected item type
   */
) => {
  try {
    const response = await API.get(`products/`, {
      params: {
        category_id: cid,
        color: colors,
        brand: brands,
        min_price: minPrice,
        max_price: maxPrice,
        sort_by: sortBy,
        sort_order: sortOrder,
        current_page: currentPage,
        list_per_page: listPerPage,
        /**Code added by Unnati on 10-08-2024
         * Reason-Added selected item type
         */
        item_type: selectedItemType,
        /**End of code addition by Unnati on 10-08-2024
         * Reason-Added selected item type
         */
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.log("Failed to fetch products:", response.data);
      return {};
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return {};
  }
};

/**End of code addition by Unnati on 20-06-2024
 * Reason -To get filtered products
 */
/**Code added by Unnati on 21-06-2024
 * Reason -To get filtered option
 */
export const getFilterOption = async (id) => {
  try {
    const response = await API.get("/filter-options/", {
      params: {
        categoryId: id,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.log(response.data);

      return {};
    }
  } catch (err) {
    console.error("Error fetching Our Policies:", err);
    return {};
  }
};
/**End of code addition by Unnati on 21-06-2024
 * Reason -To get filtered options
 */
/**Code added by Unnati on 21-06-2024
 * Reason -To get product
 */
export const getProductDetail = async (identifier,
  /**Code added by Unnati on 28-11-2024
   * Reason-Added color
   */
  color
  /**End of code addition by Unnati on 28-11-2024
   * Reason-Added color
   */
) => {
  try {
    /**Code added by Unnati on 30-09-2024
     * Reason-To get product details for row id and product_id both
     */
    let url = `productdetail/${identifier}/`;
    /**End of code addition by Unnati on 30-09-2024
     * Reason-To get product details for row id and product_id both
     */
    const response = await API.get(url,
      /**Code added by Unnati on 28-11-2024
   * Reason-Sending color in params
   */
      {params: {
        color:color,
      },
    }
    /**End of code addition by Unnati on 28-11-2024
   * Reason-Sending color in params
   */
    );
    if (response.status === 200) {
      return response.data;
    } else {
      console.log("Error:", response.data);
      return {};
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return {};
  }
};

export default API;
/**End of code addition by Unnati on 21-06-2024
 * Reason -To get  product
 */
/**Code commented by Unnati on 21-06-2024
 * Reason -To get brand
 */
// export const getbrand = async () => {
//   try {
//     const response = await API.get("/brand/", {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (response.status === 200) {
//       return response.data;
//     } else {
//       console.log(response.data);

//       return {};
//     }
//   } catch (err) {
//     console.error("Error fetching brands:", err);

//     return {};
//   }
// };
/**End of code comment by Unnati on 21-06-2024
 * Reason -To get  brand
 */
/**
 * Added by - Unnati Bajaj on 03-07-2024
 * Reason - To post Email subscription request
 */
export const emailSubscription = async (value) => {
  const response = await API.post(`/email-subscription-request/`, value, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  if (response.response) {
    if (response.response.status == 500) {
      console.log(response.response.data);
    }
    return response.response.data;
  } else {
    if (response.status == 200) {
      return response ? response.data : {};
    }
  }
};
/**
 *End of code addition by Unnati Bajaj on 29-05-2024
 * Reason - To post contact-Us details
 */
/**Code added by Unnati on 04-07-2024
 * Reason-To post add to cart details
 */
export const addToCart = async (value) => {
  try {
    const response = await API.post(`/add-to-cart/`, value, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      const cartData = response.data.cartData;
      /**Code commented by Unnati on 27-07-2024
       * Reason-This code is not in use
       */
      // let localCartData = JSON.parse(localStorage.getItem("cartData")) || [];
      // localCartData.push(cartData);
      // localStorage.setItem("cartData", JSON.stringify(localCartData));
      /**End of code comment by Unnati on 27-07-2024
       * Reason-This code is not in use
       */
      notificationObject.success("Product added to cart successfully");
      return cartData;
    } else {
      console.error("Error adding to cart:", response.data);
      return {};
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

/**End of code addition by Unnati on 04-07-2024
 * Reason-To post add to cart details
 */
/**Code added by Unnati on 07-07-2024
 * Reason -To check if product already exists or not
 */
export const checkIfProductExistsInCart = async (product, userId,data) => {
  const response = await API.post(`/check-if-product-exists-incart/`,data, {
    params: { product, userId },
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  if (response.response) {
    if (response.response.status == 500) {
      console.log(response.response.data);
    }
    return response.response.data;
  } else {
    if (response.status == 200) {
      return response ? response.data : {};
    }
  }
};
/**End of code addition by Unnati on 07-07-2024
 * Reason -To check if product already exists or not
 */
/**Code added by Unnati on 07-07-2024
 * Reason -To update cart when productId already exists
 */
export const updateCart = async (data) => {
  try {
    const response = await API.put(`/update-cart/`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    /**Code commented by Unnati on 27-07-2024
     * Reason-This code is not in use
     */
    // const cartData = response.data.cartData;
    // localStorage.setItem("cartData", JSON.stringify(cartData));
    /**End of code comment by Unnati on 27-07-2024
     * Reason-This code is not in use
     */
    if (response.status === 200) {
      /**Code added by Unnati on 21-10-2024
       * Reason-Change notification message
       */
      // notificationObject.success("Data modified successfully");
      notificationObject.success("Product added to cart successfully");
      /**End of code addition by Unnati on 21-10-2024
       * Reason-Change notification message
       */
      return response.data;
    }
  } catch (err) {
    console.error("Error updating cart", err);
    throw err;
  }
};
/**End of code addition by Unnati on 07-07-2024
 * Reason -To update cart when productId already exists
 */
/**Code added by Unnati on 11-07-2024
 * Reason -To get all product list
 */
export const getProductList = async () => {
  try {
    const response = await API.get("/product-list/", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      return {};
    }
  } catch (err) {
    console.error("Error fetching product list:", err);

    return {};
  }
};
/**End of code addition by Unnati on 11-07-2024
 * Reason -To get all product list
 */
/**Code added by Unnati on 15-07-2024
 * Reason -To get return and exchange description
 */
export const getReturnsAndExchanges = async () => {
  try {
    const response = await API.get("/returns-and-exchanges/", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      return {};
    }
  } catch (err) {
    console.error("Error fetching returns and exhanges:", err);
    return {};
  }
};
/**End of code addition by Unnati on 15-07-2024
 * Reason -To get return and exchange description
 */

/**Code modified by Unnati on 31-07-2024
 * Reason-To post shipping details
 */
export const placeOrder = async (value) => {
  const authToken = localStorage.getItem("access");
  const response = await API.post(`/place-order/`, value, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  }).catch((err) => console.log(err));
  if (response.response) {
    if (response.response.status == 500) {
      console.log(response.response.data);
    }
    return response.response.data;
  } else {
    if (response.status == 200) {
      notificationObject.success("Successfully order placed");
      return response ? response.data : {};
    }
  }
};
/**End of code modification by Unnati on 31-07-2024
 * Reason-To post shipping details
 */
/**Code added by Unnati on 24-07-2024
 * Reason-To get searched product
 */
export const getSearchedProduct = async (
  selectedCategoryId,
  searchTerm,
  isEnter
) => {
  try {
    const response = await API.get(`searched-products/`, {
      params: {
        category_id: selectedCategoryId,
        search_term: searchTerm,
        /**Code added by Unnati on 18-09-2024
         * Reason-Added is enter
         */
        is_enter: isEnter,
        /**End of code addition by Unnati on 18-09-2024
         * Reason-Added is enter
         */
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.log("Failed to fetch searched products:", response.data);
      return {};
    }
  } catch (error) {
    console.error("Error fetching searched products:", error);
    return {};
  }
};

/**End of code addition by Unnati on 24-07-2024
 * Reason-To get searched product
 */

/**Code added by Unnati on 25-07-2024
 * Reason-To get cart items
 */
export const getCartItem = async (productId,userid) => {
  try {
    const response = await API.get(`cart-item/`, {
      params: {
        product_id: productId,
        userid:userid,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.log("Failed to fetch searched products:", response.data);
      return {};
    }
  } catch (error) {
    console.error("Error fetching searched products:", error);
    return {};
  }
};
/**End of code addition by Unnati on 25-07-2024
 * Reason-To get cart items
 */
/**Code added by Unnati on 27-07-2024
 * Reason-To remove items
 */
export const removeItem = async (userId, productId, size,
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
  ) => {
  try {
    const response = await API.delete(`remove-product/`, {
      params: {
        user_id: userId,
        product_id: productId,
        size: size,
        logo:logo,
        patches:patches,
        security_batches:security_batches,
        // Added by - Ashlekh on 19-02-2025
        // Reason - To add customization
        security_id_on_back:security_id_on_back,
        printed_id:printed_id,
        // End of code - Ashlekh on 19-02-2025
        // Reason - To add customization
        embroider:embroider,
        color:color,

      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.log("Failed to fetch searched products:", response.data);
      return {};
    }
  } catch (error) {
    console.error("Error fetching searched products:", error);
    return {};
  }
};
/**End of code addition by Unnati on 27-07-2024
 * Reason-To remove items
 */
/**Code added by Unnati on 28-07-2024
 * Reason-To fetch cart data from backend
 */
export const fetchBackendCartData = async () => {
  try {
    const response = await API.get("/fetch-cart-item/", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.log(response.data);

      return {};
    }
  } catch (err) {
    console.error("Error fetching item list:", err);

    return {};
  }
};
/**End of code addition by Unnati on 28-07-2024
 * Reason-To fetch cart data from backend
 */
/**Code added by Unnati on 29-07-2024
 * Reason-To update backend cart data
 */
export const updateBackendCart = async (data) => {
  try {
    const response = await API.put(`/update-backend-cart/`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (err) {
    console.error("Error updating cart", err);
    throw err;
  }
};
/**End of code addition by Unnati on 29-07-2024
 * Reason-To update backend cart data
 */
/**Code added by Unnati on 01-08-2024
 * Reason-To check whether discount code is active or not
 */
export const IsDiscountActive = async (discount_code) => {
  try {
    const authToken = localStorage.getItem("access");
    const response = await API.get(`/is-discount-active/`, {
      params: {
        discountCode: discount_code,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
    return {};
  }
};
/**End of code addition by Unnati on 01-08-2024
 * Reason-To check whether discount code is active or not
 */
/**Code added by Unnati on 02-08-2024
 * Reason-To get order history
 */
export const getOrderHistory = async (user, currentPage, listPerPage) => {
  const response = await API.get(`/get-order-history/`, {
    params: {
      user,
      /**Code added by Unnati on 03-10-2024
       * Reason-Added current page and listPerPage
       */
      current_page: currentPage,
      list_per_page: listPerPage,
    },
    /**End of code addition by Unnati on 03-10-2024
     * Reason-Added current page and listPerPage
     */
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  if (response.response) {
    if (response.response.status == 500) {
      console.log(response.response.data);
    }
    return response.response.data;
  } else {
    if (response.status == 200) {
      return response ? response.data : {};
    }
  }
};
/**End of code addition  by Unnati on 02-08-2024
 * Reason-To get order history
 */
/**Code added by Unnati on 03-08-2024
 * Reason-To get order details
 */
export const getOrderDetail = async (id, user,
  /**Code modified by Unnati on 22-12-2024
   * Reason-commented shipping address id and added type
   */
  // shippingAddressId,
  type
   /**End of code modification by Unnati on 22-12-2024
   * Reason-commented shipping address id and added type
   */
) => {
  try {
    const response = await API.get(`order-detail/${id}/`, {
      params: {
        user,
        /**Code added by Unnati on 13-09-2024
         * Reason-To add shippingAddressId
         */
         /**Code modified by Unnati on 22-12-2024
   * Reason-commented shipping address id and added type
   */
        // shippingAddressId,
        type
         /**End of code modification by Unnati on 22-12-2024
   * Reason-commented shipping address id and added type
   */
    
      },
      /**End of code addition by Unnati on 13-09-2024
       * Reason-To add shippingAddressId
       */
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 500) {
        console.log(error.response.data);
      }
      return error.response.data;
    } else {
      console.log(error.message);
      return {};
    }
  }
};
/**End of code addition by Unnati on 03-08-2024
 * Reason-To get order details
 */
/**Code added by Unnati on 03-08-2024
 * Reason-To get user details and address
 */
export const getUserAddress = async (user) => {
  const response = await API.get(`/get-user-address/`, {
    params: { user },
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  if (response.response) {
    if (response.response.status == 500) {
      console.log(response.response.data);
    }
    return response.response.data;
  } else {
    if (response.status == 200) {
      return response ? response.data : {};
    }
  }
};
/**End of code addition by Unnati on 03-08-2024
 * Reason-To get user details and address
 */
/**Code added by Unnati on 04-08-2024
 * Reason-To get companuy information
 */
export const getCompanyInfo = async () => {
  try {
    const response = await API.get("/company-info/", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.log(response.data);

      return {};
    }
  } catch (err) {
    console.error("Error fetching company information:", err);

    return {};
  }
};
/**End of code addition by Unnati on 04-08-2024
 * Reason-To get companuy information
 */
/**Code added by Unnati on 05-08-2024
 * Reason-To get home page details
 */
export const getHomePageDetails = async () => {
  try {
    const response = await API.get("/get-home-page/", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.log(response.data);

      return {};
    }
  } catch (err) {
    console.error("Error fetching home page details:", err);

    return {};
  }
};
/**End of code addition by Unnati on 05-08-2024
 * Reason-To get home page details
 */
/**Code added by Unnati on 10-08-2024
 * Reason-To get brand item
 */
/**Code modified by Unnati on 24-08-2024
 * Reason-Added sort_order as query params
 */
// export const getBrandItem = async (id, sortOrder) => {
//   try {
//     const response = await API.get(`brandItem/${id}/`, {
//       params: {
//         sort_order: sortOrder,
//       },
//     });
/**End of code modification by Unnati on 24-08-2024
 * Reason-Added sort_order as query params
 */
//     if (response.status === 200) {
//       return response.data;
//     } else {
//       console.log("Error:", response.data);
//       return {};
//     }
//   } catch (error) {
//     console.error("Error fetching brand item:", error);
//     return {};
//   }
// };
/**End of code addition by Unnati on 10-08-2024
 * Reason-To get brand item
 */
/**Code added  by Unnati on 11-08-2024
 * Reason -To get Shipping
 */
export const getShipping = async () => {
  try {
    const response = await API.get("/shipping/", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.log(response.data);
      return {};
    }
  } catch (err) {
    console.error("Error fetching shipping:", err);
    return {};
  }
};
/**End of code addition by Unnati on 11-08-2024
 * Reason -To get shipping
 */
/**Code added  by Unnati on 16-08-2024
 * Reason -To post big and tall inquiry
 */
export const bigAndTallInquiry = async (value) => {
  const response = await API.post(`/big-and-tall-inquiry/`, value, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  if (response.response) {
    if (response.response.status == 500) {
      console.log(response.response.data);
    }
    return response.response.data;
  } else {
    if (response.status == 200) {
      return response ? response.data : {};
    }
  }
};
/**End of code additon by Unnati on 16-08-2024
 * Reason -To post big and tall inquiry
 */
/**Code added  by Unnati on 22-08-2024
 * Reason -To post request catalg details
 */
export const catalogRequest = async (value) => {
  const response = await API.post(`/request-catalog/`, value, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  if (response.response) {
    if (response.response.status == 500) {
      console.log(response.response.data);
    }
    return response.response.data;
  } else {
    if (response.status == 200) {
      return response ? response.data : {};
    }
  }
};
/**End of code addition by Unnati on 22-08-2024
 * Reason -To post request catalg details
 */
/**Code added  by Unnati on 22-08-2024
 * Reason -To get blog
 */
export const getBlog = async (id) => {
  try {
    const endpoint = id ? `/blog/${id}/` : "/blog/";

    const response = await API.get(endpoint, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.log(response.data);
      return {};
    }
  } catch (err) {
    console.error("Error fetching blog:", err);
    return {};
  }
};
/**End of code addition by Unnati on 22-08-2024
 * Reason -To get blog
 */

/**Code added by Unnati on 30-09-2024
 * Reason-To clear cart
 */
export const clearCart = async (userId) => {
  try {
    const response = await API.post(`clear-cart/${userId}/`);

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Error clearing cart:", response.data);
      return {};
    }
  } catch (error) {
    console.error("Error clearing cart:", error);
    return {};
  }
};

/**End of code addition by Unnati on 30-09-2024
 * Reason-To clear cart
 */

/**Code added by Unnati on 15-09-2024
 * Reason-To update user address(Primary address)
 */
export const updateUserAddress = async (addressId, userId) => {
  try {
    const response = await API.put(`/update-user-address/`, null, {
      params: {
        addressId: addressId,
        userId: userId,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (err) {
    console.error("Error updating address", err);
    throw err;
  }
};
/**End of code addition by Unnati on 15-09-2024
 * Reason-To update user address(Primary address)
 */

/**Code added by Unnati on 15-09-2024
 * Reason-To get primary shipping address
 */
export const getPrimaryShippingAddress = async (user) => {
  const response = await API.get(`/get-primary-user-address/`, {
    params: { user },
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  if (response.response) {
    if (response.response.status == 500) {
      console.log(response.response.data);
    }
    return response.response.data;
  } else {
    if (response.status == 200) {
      return response ? response.data : {};
    }
  }
};
/**End of code addition by Unnati on 15-09-2024
 * Reason-To get primary shipping address
 */
/**Code added by Unnati on 15-09-2024
 * Reason-To remove shipping address
 */
export const removeAddress = async (addressId, userId) => {
  try {
    const response = await API.put(
      `/remove-address/`,
      {},
      {
        params: {
          addressId: addressId,
          userId: userId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**End of code addition by Unnati on 15-09-2024
 * Reason-To remove shipping address
 */
/**Code added by Unnati on 16-09-2024
 * Reason-To update shipping address
 */
export const UpdateShippingAddress = async (data, addressId, userId) => {
  try {
    const response = await API.put(`/update-shipping-address/`, data, {
      params: {
        addressId: addressId,
        userId: userId,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
/**End of code addition by Unnati on 16-09-2024
 * Reason-To update shipping address
 */
/**Code commented by Unnati on 28-09-2024
 * Reason-To edit product detail
 */
// export const editProductDetail = async (identifier) => {
//   try {
//     /**Code added by Unnati on 30-09-2024
//      * Reason-To get product details for row id and product_id both
//      */
//     let url = `edit-product/${identifier}/`;
//     /**End of code addition by Unnati on 30-09-2024
//      * Reason-To get product details for row id and product_id both
//      */
//     const response = await API.get(url);
//     if (response.status === 200) {
//       return response.data;
//     } else {
//       console.log("Error:", response.data);
//       return {};
//     }
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     return {};
//   }
// };
/**End of code comment by Unnati on 28-09-2024
 * Reason-To edit product detail
 */
/**Code added by Unnati on 03-10-2024
 * Reason-To get searched order history
 */
export const getSearchedOrder = async (
  searchTerm,
  selectedDate,
  currentPage,
  listPerPage,
  // Added by - Ashlekh on 15-11-2024
  // Reason - To send user id in backend (will be used in filter)
  userId,
  // End of code - Ashlekh on 15-11-2024
  // Reason - To send user id in backend (will be used in filter)
) => {
  try {
    const response = await API.get(`searched-orders/`, {
      params: {
        search_term: searchTerm,
        selected_date: selectedDate,
        current_page: currentPage,
        list_per_page: listPerPage,
        // Added by - Ashlekh on 15-11-2024
        // Reason - To send user id in backend (will be used in filter)
        user_id: userId,
        // End of code - Ashlekh on 15-11-2024
        // Reason - To send user id in backend (will be used in filter)
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.log("Failed to fetch searched products:", response.data);
      return {};
    }
  } catch (error) {
    console.error("Error fetching searched products:", error);
    return {};
  }
};
/**End of code addition by Unnati on 03-10-2024
 * Reason-To get searched order history
 */
/**Code added by Unnati on 05-10-2024
 * Reason-To get sale products
 */

export const getSaleProducts = async (id,
  /**Code added by Unnati on 06-12-2024
   * Reason-Added sortOrder
   */
  sortOrder
   /**End of code addition by Unnati on 06-12-2024
   * Reason-Added sortOrder
   */
) => {
  try {
    const response = await API.get(`sale-products/`, {
      params: {
        id,
         /**Code added by Unnati on 06-12-2024
   * Reason-Added sortOrder
   */
        sortOrder
         /**End of code addition by Unnati on 06-12-2024
   * Reason-Added sortOrder
   */
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.log("Failed to fetch searched products:", response.data);
      return {};
    }
  } catch (error) {
    console.error("Error fetching searched products:", error);
    return {};
  }
};
/**End of code addition by Unnati on 05-10-2024
 * Reason-To get sale products
 */

/**
 * Added by - Ashlekh on 08-10-2024
 * Reason - To have api for privacy policy
 */
export const getPrivacyPolicyDetailsAPI = async () => {
  try {
    const response = await API.get("/privacy_policy/", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.log(response.data);
      return {};
    }
  } catch (error) {
    console.error("Error fetching privacy policy:", error);
    return {};
  }
};
/**
 * End of code - Ashlekh on 08-10-2024
 * Reason - To have api for privacy policy
 */
/**Code added by Unnati on 20-10-2024
 * Reason-To have api for user address
 */
export const UserAddress = async (value, user) => {
  try {
    const response = await API.post(
      `/user-address/`,
      { ...value, user },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.status === 200 ? response.data : {};
  } catch (error) {
    console.error("Error in UserAddress API call:", error);
    return {};
  }
};
/**End of code addition by Unnati on 20-10-2024
 * Reason-To have api for user address
 */

/**
 * Added by - Ashlekh on 16-10-2024
 * Reason - To post paypal order id and paypal access token for capturing payment status
 */
/**Code added by Unnati on 07-11-2024
 * Reason-Added order time
 */
export const postPayPalCaptureAPI = async (
  paypalOrderId,
  paypalAccessToken,
  userId,
  billingAddress,
  shippingAddress,
  localOrderTime
) => {
  const response = await API.post(
    `capture_payment/`,
    {
      paypalOrderId,
      paypalAccessToken,
      userId,
      billingAddress,
      shippingAddress,
      localOrderTime,
    },
    {
      /**End of code addition by Unnati on 07-11-2024
       * Reason-Added order time
       */
      headers: {
        "Content-Type": "application/JSON",
      },
    }
  );

  if (response.response) {
    if (response.response.status == 500) {
      console.log(response.response.data);
    } else if (response.response.status == 404) {
      console.log(response.response.data);
    }
    return response ? response.data : {};
  } else {
    if (response.status == 200) {
      return response ? response.data : {};
    }
  }
};
/**
 * End of code - Ashlekh on 16-10-2024
 * Reason - To post paypal order id and paypal access token for capturing payment status
 */

/**
 * Added by - Ashlekh on 17-10-2024
 * Reason - To create paypal order id
 */
export const createPayPalOrderIdAPI = async (userId) => {
  const response = await API.post(
    `create_paypal_order/`,
    { userId },
    {
      headers: {
        "Content-Type": "application/JSON",
      },
    }
  );

  if (response.response) {
    if (response.response.status == 500) {
      console.log(response.response.data);
    } else if (response.response.status == 404) {
      console.log(response.response.data);
    }
    return response ? response.data : {};
  } else {
    if (response.status == 200) {
      return response ? response.data : {};
    }
  }
};
/**
 * End of code - Ashlekh on 17-10-2024
 * Reason - To create paypal order id
 */
/**
 * Added by - Unnati Bajaj on 23-10-2024
 * Reason - To post leave feedback details
 */
export const leavefeedback = async (value) => {
  const response = await API.post(`/leave-feedback/`, value, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  if (response.response) {
    if (response.response.status == 500) {
      console.log(response.response.data);
    }
    return response.response.data;
  } else {
    if (response.status == 200) {
      return response ? response.data : {};
    }
  }
};
/**
 *End of code addition by Unnati Bajaj on 23-10-2024
 * Reason - To post leavefeedback details
 */

/**
 * Added by - Ashlekh on 23-10-2024
 * Reason - To post cartData (will be used to check quantity of product)
 */
export const postCartDetailsAPI = async (cartData) => {
  const response = await API.post(
    `check_stock/`,
    { cartData },
    {
      headers: {
        "Content-Type": "application/JSON",
      },
    }
  );

  if (response.response) {
    if (response.response.status == 500) {
      console.log(response.response.data);
    } else if (response.response.status == 404) {
      console.log(response.response.data);
    }
    return response ? response.data : {};
  } else {
    if (response.status == 200) {
      return response ? response.data : {};
    }
  }
};

/**
 * End of code - Ashlekh on 23-10-2024
 * Reason - To post cartData (will be used to check quantity of product)
 */
/**Code added by Unnati on 06-11-2024
 * Reason-To update cancellation time
 */
export const UpdateCancellationTime = async (
  ItemId,
  order,
  OrderItemCancellationTime,
  cancellationReason,
) => {
  try {
    const requestBody = {
      ItemId: ItemId,
      order: order,
      OrderItemCancellationTime: OrderItemCancellationTime,
      cancellationReason:cancellationReason,
    };
    const response = await API.patch(
      `/update-cancellation-time/`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error updating cancellation time", err);
    throw err;
  }
};
/**End of code addition by Unnati on 06-11-2024
 * Reason-To update cancellation time
 */
/**Code added by Unnati on 08-11-2024
 * Reason-To get credit note
 */
export const getCreditNote = async (id, user,
   /**Code modified by Unnati on 22-12-2024
   * Reason- added type
   */
  type,
  /**Code added by Unnati on 27-12-2024
   * Reason-Added order
   */
  order,
   /**End of code addition by Unnati on 27-12-2024
   * Reason-Added order
   */
  /**End of code modification by Unnati on 22-12-2024
   * Reason- added type
   */
) => {
  try {
    const response = await API.get(`credit-note/${id}/`, {
      params: {
        user,
        /**Code modified by Unnati on 22-12-2024
   * Reason- added type
   */
        type,
  /**Code added by Unnati on 27-12-2024
   * Reason-Added order
   */
  order,
   /**End of code addition by Unnati on 27-12-2024
   * Reason-Added order
   */       
   /**End of code modification by Unnati on 22-12-2024
   * Reason- added type
   */
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 500) {
        console.log(error.response.data);
      }
      return error.response.data;
    } else {
      console.log(error.message);
      return {};
    }
  }
};
/*End of code addition Unnati on 08-11-2024
 * Reason-To get credit note
 */
 /**
 * Added by - Ashlekh on 28-10-2024
 * Reason - To post userId, product_id, quantity, size, color
 */
export const updateCartQuantityAPI = async(userId, productId, quantity, size, color,
  logo,patches,security_batches,
  // Added by - Ashlekh on 19-02-2025
  // Reason - To add customization
  security_id_on_back,
  printed_id,
  // End of code - Ashlekh on 19-02-2025
  // Reason - To add customization
  embroider

) => {
  const response = await API.post(`update_cart_quantity/`, {userId, productId, quantity, size, color,
    logo,patches,security_batches,
    // Added by - Ashlekh on 19-02-2025
    // Reason - To add customization
    security_id_on_back,
    printed_id,
    // End of code - Ashlekh on 19-02-2025
    // Reason - To add customization
    embroider

  }, {
      headers: {
        "Content-Type": "application/JSON",
      },
    });

    if (response.response) {
      if (response.response.status == 500) {
        console.log(response.response.data);
      } else if (response.response.status == 404) {
        console.log(response.response.data);
      }
      return response ? response.data : {};
    } else {
      if (response.status == 200) {
        return response ? response.data : {};
      }
    }
};
/**
 * End of code - Ashlekh on 28-10-2024
 * Reason - To post userId, product_id, quantity, size, color
 */

/**
 * Added by - Ashlekh on 30-10-2024
 * Reason - To post user id, product_id and color for WishList
 */
export const addToWishListAPI = async(userId, productId, color) => {
  const response = await API.post(`add_to_wishlist/`, {userId, productId, color}, {
      headers: {
        "Content-Type": "application/JSON",
      },
    });

    if (response.response) {
      if (response.response.status == 500) {
        console.log(response.response.data);
      } else if (response.response.status == 404) {
        console.log(response.response.data);
      }
      return response ? response.data : {};
    } else {
      if (response.status == 200) {
        return response ? response.data : {};
      }
    }
};
/**
 * End of code - Ashlekh on 30-10-2024
 * Reason - To post user id, product_id and color for WishList
 */

/**
 * Added by - Ashlekh on 05-11-2024
 * Reason - To update wish list data in backend
 */
export const updateWishListAPI = async (data) => {
  try {
    const response = await API.put(`/update-wishlist/`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (err) {
    console.error("Error updating cart", err);
    throw err;
  }
};
/**
 * End of code - Ashlekh on 05-11-2024
 * Reason - To update wish list data in backend
 */

/**
 * Added by - Ashlekh on 05-11-2024
 * Reason - To get details of product in wishlist
 */
export const getWishListDetailsAPI = async(wishListData) => {
  const response = await API.post(`wishlist_details/`, {wishListData}, {
      headers: {
        "Content-Type": "application/JSON",
      },
    });

    if (response.response) {
      if (response.response.status == 500) {
        console.log(response.response.data);
      } else if (response.response.status == 404) {
        console.log(response.response.data);
      }
      return response ? response.data : {};
    } else {
      if (response.status == 200) {
        return response ? response.data : {};
      }
    }
};
/**
 * End of code - Ashlekh on 05-11-2024
 * Reason - To get details of product in wishlist
 */

/**
 * Added by - Ashlekh on 07-11-2024
 * Reason - To add product in cart from wishlist page
 */
export const addProductInCartAPI = async (
  userId, 
  product_id, 
  color, 
  size, 
  quantity,
  // Added by - Ashlekh on 04-12-2024
  // Reason - To add customization details (and send it to backend)
  after_customization_product_price, 
  customization_comment, 
  logo, patches, 
  security_batches, 
  // Added by - Ashlekh on 19-02-2025
  // Reason - To add customization
  security_id_on_back,
  printed_id,
  // End of code - Ashlekh on 19-02-2025
  // Reason - To add customization
  embroider
  // End of code - Ashlekh on 04-12-2024
  // Reason - To add customization details (and send it to backend)
  ) => {
  try {
    const response = await API.post(`/add-product-to-cart/`, {userId, product_id, color, size, quantity,
      // Added by - Ashlekh on 04-12-2024
      // Reason - To add customization details (and send it to backend)
      after_customization_product_price, customization_comment, logo, patches, security_batches, 
      // Added by - Ashlekh on 19-02-2025
      // Reason - To add customization
      security_id_on_back,
      printed_id,
      // End of code - Ashlekh on 19-02-2025
      // Reason - To add customization
      embroider,
      // End of code - Ashlekh on 04-12-2024
      // Reason - To add customization details (and send it to backend)
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      const cartData = response.data.cartData;
      const wishlist = response.data.wishlist;

      return {cartData, wishlist};
    } else {
      console.error("Error adding to cart:", response.data);
      return {};
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};
/**
 * End of code - Ashlekh on 07-11-2024
 * Reason - To add product in cart from wishlist page
 */

/**
 * Added by - Ashlekh on 07-11-2024
 * Reason - API to delete products from wishlist
 */
export const removeProductFromWishListAPI = async (userId, productId, color) => {
  try {
    const response = await API.delete(`remove-wishlist-product/`, {
      params: {
        user_id: userId,
        product_id: productId,
        color: color,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.log("Failed to fetch searched products:", response.data);
      return {};
    }
  } catch (error) {
    console.error("Error fetching searched products:", error);
    return {};
  }
};
/**
 * End of code - Ashlekh on 07-11-2024
 * Reason - API to delete products from wishlist
 */
/**Code added by Unnati on 09-11-2024
 * Reason-Added return API
 */
export const Return = async (ItemId, orderId) => {
  try {
    const requestBody = {
      ItemId: ItemId,
      orderId: orderId,
    };
    const response = await API.patch(`/return/`, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error updating cancellation time", err);
    throw err;
  }
};
/**End of code addition by Unnati on 06-11-2024
 * Reason-Added return API
 */
 
/**
 * Added by - Ashlekh on 18-11-2024
 * Reason - To get filtered (sorted) products in sale product
 */
 /**Code commeted by Unnati on 06-12-2024
   * Reason-Not in use
   */
// export const getSortedProductsAPI = async (
//   bannerId,
//   sortOrder,
//   currentPage,
//   listPerPage,
// ) => {
//   try {
//     const response = await API.get(`sorted_products/`, {
//       params: {
//         banner_id: bannerId,
//         sort_order: sortOrder,
//         current_page: currentPage,
//         list_per_page: listPerPage,
//       },
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (response.status === 200) {
//       return response.data;
//     } else {
//       console.log("Failed to fetch products:", response.data);
//       return {};
//     }
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return {};
//   }
// };
 /*End of code comment by Unnati on 06-12-2024
   * Reason-Not in use
   */
/**
 * End of code - Ashlekh on 18-11-2024
 * Reason - To get filtered (sorted) products in sale product
 */

// export const updateCustomizationCommentAPI = async (productId, customizationComment) => {
//   try {
//     // Make the POST request
//     const response = await API.post(
//       `update-customization-comment/`,
//       {
//         product_id: productId,
//         customization_comment: customizationComment,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     // Handle successful responses (200 status)
//     if (response.status === 200) {
//       return response.data; // Return the response data
//     }
//   } catch (error) {
//     // Handle error responses
//     if (error.response) {
//       const { status, data } = error.response;

//       // Match your Django API status codes
//       if (status === 400) {
//         console.error('Bad Request:', data);
//         throw new Error('Bad Request: Please check the input data.');
//       } else if (status === 404) {
//         console.error('Not Found:', data);
//         throw new Error('Not Found: The specified product does not exist.');
//       } else if (status === 500) {
//         console.error('Server Error:', data);
//         throw new Error('Internal Server Error: Please try again later.');
//       }
//     } else {
//       // Network or other errors
//       console.error('Unexpected Error:', error.message);
//       throw new Error('An unexpected error occurred.');
//     }
//   }
// };

// Addition by Om Shrivastava on 20-11-2024
// Reason : Add the method for post the comment and customized price 
export const updateCustomizationCommentAPI = async (productData) => {
  try {
    const response = await API.post(`update-customization-comment/`, productData, {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${access}`,  // Uncomment if needed for authentication
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting customization comment:", error);
    throw error;
  }
};
// End of addition by Om Shrivastava on 20-11-2024
// Reason : Add the method for post the comment and customized price 



/**
 * Added by Ashish Dewangan on 24-11-2024
 * Reason- Calling backend API to return the item
 */
export const performItemReturn = async (
    ItemId,
    order,
    OrderItemReturnTime,
    returnReason,
    itemImage1,
    itemImage2,
    /**Code added by Unnati on 27-12-2024
     * Reason-Send return product details 
     */
    size,
    quantity,
    color,
    amount,
    product_id,
    sales_rate,
    subtotal,
    total_amount,
    sale_percentage,
    /**End of code addition by Unnati on 27-12-2024
     * Reason-Send return product details 
     */
  ) => {
  try {
    var formData = new FormData()
    formData.append("ItemId", ItemId)
    formData.append("order", order)
    formData.append("OrderItemReturnTime", OrderItemReturnTime)
    formData.append("returnReason",returnReason)
    formData.append("itemImage1",itemImage1)
    formData.append("itemImage2",itemImage2)
    /**Code added by Unnati on 27-12-2024
     * Reason-Send return product details 
     */
    formData.append("size",size)
    formData.append("quantity",quantity)
    formData.append("color",color)
    formData.append("amount",amount)
    formData.append("product_id",product_id)
    formData.append("sales_rate",sales_rate)
    formData.append("subtotal",subtotal)
    formData.append("total_amount",total_amount)
    formData.append("sale_percentage",sale_percentage)
    /**End of code addition by Unnati on 27-12-2024
     * Reason-Send return product details 
     */

    

/**Code modified by Unnati on 27-12-2024
 * Reason-Modified patch to post
 */
    // const response = await API.patch(
    /**End of code modification by Unnati on 27-12-2024
 * Reason-Modified patch to post
 */
    const response = await API.post(
      `/return-item/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error occured while returing the item", err);
    throw err;
  }
};
/**
 * End of addition by Ashish Dewangan on 24-11-2024
 * Reason- Calling backend API to return the item
 */


/**
 * Added by Ashish Dewangan on 24-11-2024
 * Reason- Calling backend API to return the item
 */
export const addTrackingDetailsForItem = async (
  ItemId,
  orderId,
  returnTrackingId,
  returnCourierProviderName,
) => {
try {
  var formData = {
    ItemId:ItemId,
    orderId:orderId,
    returnTrackingId:returnTrackingId,
    returnCourierProviderName:returnCourierProviderName,
  }
  
  const response = await API.patch(
    `/add-tracking-details/`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
} catch (err) {
  console.error("Error occured while adding tracking details", err);
  throw err;
}
};
/**
* End of addition by Ashish Dewangan on 24-11-2024
* Reason- Calling backend API to return the item
*/

/**
 * Added by Ashish Dewangan on 27-11-2024
 * Reason- Calling backend API to create stripe's checkout session
 */
export const createStripeSessionIdAPI = async (userId) => {
  const response = await API.post(
    `create-stripe-checkout-session/`,
    { userId },
    {
      headers: {
        "Content-Type": "application/JSON",
           
      },
    }
  );

  if (response.response) {
    if (response.response.status == 500) {
      console.log(response.response.data);
    } else if (response.response.status == 404) {
      console.log(response.response.data);
    }
    return response ? response.data : {};
  } else {
    if (response.status == 200) {
      return response ? response.data : {};
    }
  }
};
/**
 * End of addition by Ashish Dewangan on 27-11-2024
 * Reason- Calling backend API to create stripe's checkout session
 */

/**
 * Added by Ashish Dewangan on 27-11-2024
 * Reason- Calling backend API to create order using stripe's session
 */
export const postOrderUsingStripeAPI = async (
  stripeSessionId,
  userId,
  billingAddress,
  shippingAddress,
  localOrderTime
) => {
  const response = await API.post(
    `create-order-from-stripe/`,
    {
      stripeSessionId,
      userId,
      billingAddress,
      shippingAddress,
      localOrderTime
    },
    {
      headers: {
        "Content-Type": "application/JSON",
      },
    }
  );

  if (response?.response) {
    if (response?.response?.status == 500) {
      console.log(response?.response?.data);
    } else if (response?.response?.status == 404) {
      console.log(response?.response?.data);
    }
    return response ? response.data : {};
  } else {
    if (response?.status == 200) {
      return response ? response.data : {};
    }
  }
};
/**
 * End of addition by Ashish Dewangan on 27-11-2024
 * Reason- Calling backend API to create order using stripe's session
 */

/**
 * Added by Ashish Dewangan on 27-11-2024
 * Reason- Calling backend API to check payment status using session id of stripe
 */
export const getStripeSessionStatusAPI = async (sessionId) => {
  try {
    const response = await API.get(`stripe-session-status/${sessionId}/`, {
      headers: {
        "Content-Type": "application/json",
           
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 500) {
        console.log(error.response.data);
      }
      return error.response.data;
    } else {
      console.log(error.message);
      return {};
    }
  }
};
/**
 * End of additin by Ashish Dewangan on 27-11-2024
 * Reason- Calling backend API to check payment status using session id of stripe
 */
/**Code added by Unnati on 20-12-2024
 * Reason-Calling backend API to perform item exchange
 */
export const performItemExchange = async (
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
  after_customization_product_price, 
  customization_comment, 
  logo, patches, 
  security_batches, 
  // Added by - Ashlekh on 19-02-2025
  // Reason - To add customization
  security_id_on_back,
  printed_id,
  // End of code - Ashlekh on 19-02-2025
  // Reason - To add customization
  embroider,
  product_id,
  salesRate,
  logoPrice,
          patchesPrice,
          securityBatchesPrice,
          // Added by - Ashlekh on 19-02-2025
          // Reason - To add customization
          securityIdOnBackPrice,
          printedIdPrice,
          // End of code - Ashlekh on 19-02-2025
          // Reason - To add customization
          embroiderPrice,
          image1,
) => {
try {
  var formData = new FormData()
  formData.append("ItemId", ItemId)
  formData.append("orderId", orderId)
  formData.append("OrderItemExchangeTime", OrderItemExchangeTime)
  formData.append("exchangeReason",exchangeReason)
  formData.append("itemImage1",itemImage1)
  formData.append("itemImage2",itemImage2)
  formData.append("selectedColor",selectedColor)
  formData.append("selectedSize",selectedSize)
  formData.append("quantity",quantity)
  formData.append("requestType",requestType)
  formData.append("sale_percentage",sale_percentage)
  formData.append("after_customization_product_price",after_customization_product_price)
  formData.append("customization_comment",customization_comment)
  formData.append("selectedSize",selectedSize)
  formData.append("logo",logo)
  formData.append("patches",patches)
  formData.append("security_batches",security_batches)
  // Added by - Ashlekh on 19-02-2025
  // Reason - To add customization
  formData.append("security_id_on_back", security_id_on_back)
  formData.append("printed_id", printed_id)
  // End of code - Ashlekh on 19-02-2025
  // Reason - To add customization
  formData.append("embroider",embroider)
  formData.append("product_id",product_id)
  formData.append("salesRate",salesRate)
  formData.append("logoPrice",logoPrice)
  formData.append("patchesPrice",patchesPrice)
  formData.append("securityBatchesPrice",securityBatchesPrice)
  // Added by - Ashlekh on 19-02-2025
  // Reason - To add customization
  formData.append("securityIdOnBackPrice",securityIdOnBackPrice)
  formData.append("printedIdPrice",printedIdPrice)
  // End of code - Ashlekh on 19-02-2025
  // Reason - To add customization
  formData.append("embroiderPrice",embroiderPrice)
  formData.append("image1",image1)
  
  const response = await API.post(
    `/exchange-item/`,
  formData,     
    
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
} catch (err) {
  console.error("Error occured while exchange the item", err);
  throw err;
}
};
/**End of code addition by Unnati on 20-12-2024
 * Reason-Calling backend API to perform item exchange
 */
/**
 * Added by Unnati Bajaj on 22-11-2024
 * Reason- Calling backend API to post paypal capture exchange item
 */
export const postPayPalCaptureExchangeAPI = async (
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
  after_customization_product_price, 
  customization_comment, 
  logo, patches, 
  security_batches, 
  // Added by - Ashlekh on 19-02-2025
  // Reason - To add customization
  security_id_on_back,
  printed_id,
  // End of code - Ashlekh on 19-02-2025
  // Reason - To add customization
  embroider,
  productName,
  salesRate,
  logoPrice,
          patchesPrice,
          securityBatchesPrice,
          // Added by - Ashlekh on 19-02-2025
          // Reason - To add customization
          securityIdOnBackPrice,
          printedIdPrice,
          // End of code - Ashlekh on 19-02-2025
          // Reason - To add customization
          embroiderPrice,
          image1,
          product_id,
          toPay,
) => {


try {
  var formData = new FormData()
  formData.append("paypalOrderId",paypalOrderId)
  formData.append("paypalAccessToken",paypalAccessToken)
  formData.append("itemId", itemId)
  formData.append("orderId", orderId)
  formData.append("OrderItemExchangeTime", OrderItemExchangeTime)
  formData.append("exchangeReason",exchangeReason)
  formData.append("itemImage1",itemImage1)
  formData.append("itemImage2",itemImage2)
  formData.append("selectedColor",selectedColor)
  formData.append("size",size)
  formData.append("quantity",quantity)
  formData.append("requestType",requestType)
  formData.append("sale_percentage",sale_percentage)
  formData.append("after_customization_product_price",after_customization_product_price)
  formData.append("customization_comment",customization_comment)
  // formData.append("selectedSize",selectedSize)
  formData.append("logo",logo)
  formData.append("patches",patches)
  formData.append("security_batches",security_batches)
  // Added by - Ashlekh on 19-02-2025
  // Reason - To add customization
  formData.append("security_id_on_back", security_id_on_back)
  formData.append("printed_id", printed_id)
  // End of code - Ashlekh on 19-02-2025
  // Reason - To add customization
  formData.append("embroider",embroider)
  formData.append("productName",productName)
  formData.append("salesRate",salesRate)
  formData.append("logoPrice",logoPrice)
  formData.append("patchesPrice",patchesPrice)
  formData.append("securityBatchesPrice",securityBatchesPrice)
  // Added by - Ashlekh on 19-02-2025
  // Reason - To add customization
  formData.append("securityIdOnBackPrice",securityIdOnBackPrice)
  formData.append("printedIdPrice",printedIdPrice)
  // End of code - Ashlekh on 19-02-2025
  // Reason - To add customization
  formData.append("embroiderPrice",embroiderPrice)
  formData.append("image1",image1)
  formData.append("product_id",product_id)
  formData.append("toPay",toPay)
  
  const response = await API.post(
    `/capture_paypal_payment_exchange_item/`,
  formData,     
    
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
} catch (err) {
  console.error("Error occured while exchange the item", err);
  throw err;
}
};
/**
 * End of code addition by Unnati Bajaj on 22-11-2024
 * Reason- Calling backend API to post paypal capture exchange item
 */
/**
 * Added by Unnati on 20-12-2024
 * Reason- Calling backend API to exchange item
 */
export const addExchangeTrackingDetailsForItem = async (
  ItemId,
  orderId,
  exchangeTrackingId,
  exchangeCourierProviderName,
) => {
try {
  var formData = {
    ItemId:ItemId,
    orderId:orderId,
    exchangeTrackingId:exchangeTrackingId,
    exchangeCourierProviderName:exchangeCourierProviderName,
  }
  
  const response = await API.patch(
    `/add-exchange-tracking-details/`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
} catch (err) {
  console.error("Error occured while adding tracking details", err);
  throw err;
}
};
/**
 * End of code addition by Unnati on 20-12-2024
 * Reason- Calling backend API to exchange item
 */
/**Code added by Unnati on 2--12-2024
 * Reason-To get product size and color
 */
export const getProductSizeAndColor = async (itemId) => {
  try {
    console.log("........id",itemId)
    const response = await API.get(`get-product-size-and-color/`, {
      params: {
        itemId
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.log("Failed to fetch products:", response.data);
      return {};
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return {};
  }
};
/**End of code addition by Unnati on 2--12-2024
 * Reason-To get product size and color
 */
/**code addition by Unnati on 20-12-2024
 * Reason-To get exchange and return items
 */
export const getExchangeAndReturnItem = async (ItemId,
  orderId) => {
  try {
    const response = await API.get("/exchange-item/", {
      params: {
        ItemId,
        orderId
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.log(response.data);

      return {};
    }
  } catch (err) {
    console.error("Error fetching settings:", err);

    return {};
  }
};
/*End of code addition by Unnati on 20-12-2024
 * Reason-To get exchange and return items
 */
/**
 * Modified by - Ashish Dewangan on 16-12-2024
 * Reason - Renamed the method
 */
// export const getLatestDetailsOfCartItemsForGuest = async (cartData) => {
export const getLatestDetailsOfCartItems = async (cartData) => {
  /**
 * End of modification by - Ashish Dewangan on 16-12-2024
 * Reason - Renamed the method
 */
  try {
    const response = await API.post(`latest-details-of-items-in-cart/`,cartData, {
      
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.log("Failed to fetch searched products:", response.data);
      return {};
    }
  } catch (error) {
    console.error("Error fetching searched products:", error);
    return {};
  }
};
/**End of addition by Ashish Deewangan on 12-12-2024
 * Reason-To get latest details of cart items for guest user
 */ 

/**
 * Added by - Ashish Dewangan on 18-12-2024
 * Reason - Method to call API that will check product availability
 */
export const checkProductAvailability = async (product_id,color) => {
  try {
    const response = await API.get("/check-product-availability/", {
      headers: {
        "Content-Type": "application/json",
      },
     params:{
      product_id:product_id,
      color:color
     }
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.log(response.data);

      return {};
    }
  } catch (err) {
    console.error("Error fetching item list:", err);

    return {};
  }
};
/**
 * End of addition by - Ashish Dewangan on 18-12-2024
 * Reason - Method to call API that will check product availability
 */
 
/**
 * Added by - Ashlekh on 18-12-2024
 * Reason - API to update quantity in ViewCart for guest user
 */
export const updateViewCartQuantityForGuestAPI = async( productId, newQuantity, size, color,) => {
  const response = await API.post(`update_viewcart_quantity/`, {productId, newQuantity, size, color,}, {
      headers: {
        "Content-Type": "application/JSON",
      },
    });

    if (response.response) {
      if (response.response.status == 500) {
        console.log(response.response.data);
      } else if (response.response.status == 404) {
        console.log(response.response.data);
      }
      return response ? response.data : {};
    } else {
      if (response.status == 200) {
        return response ? response.data : {};
      }
    }
};
/**
 * End of code - Ashlekh on 18-12-2024
 * Reason - API to update quantity in ViewCart for guest user
 */
/**Code commnetd by Unnati on 26-12-2024
 * Reason-To get credit note for exchange
 */
// export const getExchangeCreditNote = async (id, user) => {
//   try {
//     const response = await API.get(`exchange-credit-note/${id}/`, {
//       params: {
//         user,
        
//       },
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     if (response.status === 200) {
//       return response.data;
//     }
//   } catch (error) {
//     if (error.response) {
//       if (error.response.status === 500) {
//         console.log(error.response.data);
//       }
//       return error.response.data;
//     } else {
//       console.log(error.message);
//       return {};
//     }
//   }
// };
/**Code addition by Unnati on 22-12-2024
 * Reason-To create paypal exchange item API
 */
export const createPayPalExchangeItemAPI = async (extraAmount) => {
  const response = await API.post(
    `create_paypal_order_exchange_item/`,
    { extraAmount },
    {
      headers: {
        "Content-Type": "application/JSON",
      },
    }
  );

  if (response.response) {
    if (response.response.status == 500) {
      console.log(response.response.data);
    } else if (response.response.status == 404) {
      console.log(response.response.data);
    }
    return response ? response.data : {};
  } else {
    if (response.status == 200) {
      return response ? response.data : {};
    }
  }
};
/**End of code addition by Unnati on 22-12-2024
 * Reason-To create paypal exchange item API
 */
/**Code addition by Unnati on 22-12-2024
 * Reason-To get stripe session status
 */
export const getStripeSessionStatusForExchangeAPI = async (sessionId) => {
  try {
    const response = await API.get(`stripe-session-status-exchange/${sessionId}/`, {
      headers: {
        "Content-Type": "application/json",
           
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 500) {
        console.log(error.response.data);
      }
      return error.response.data;
    } else {
      console.log(error.message);
      return {};
    }
  }
};
/**End of code addition by Unnati on 22-12-2024
 * Reason-To get stripe session status
 */
/**Code addition by Unnati on 22-12-2024
 * Reason-To create stripe session id
 */
export const CreateStripeSessionIdForExchangeAPI = async (userId,extraAmount) => {
  const response = await API.post(
    `create-stripe-session-for-exchange/`,
    { userId ,extraAmount},
    {
      headers: {
        "Content-Type": "application/JSON",
           
      },
    }
  );

  if (response.response) {
    if (response.response.status == 500) {
      console.log(response.response.data);
    } else if (response.response.status == 404) {
      console.log(response.response.data);
    }
    return response ? response.data : {};
  } else {
    if (response.status == 200) {
      return response ? response.data : {};
    }
  }
};
/**End of code addition by Unnati on 22-12-2024
 * Reason-To create stripe session id
 */
/**code addition by Unnati on 22-12-2024
 * Reason-To post exchange order using stripe
 */
export const postExchangeOrderUsingStripeAPI = async (
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
  // Added by - Ashlekh on 19-02-2025
  // Reason - To add customization
  security_id_on_back,
  printed_id,
  // End of code - Ashlekh on 19-02-2025
  // Reason - To add customization
  embroider,
  productName,
  salesRate,
  logoPrice,
  patchesPrice,
  securityBatchesPrice,
  // Added by - Ashlekh on 19-02-2025
  // Reason - To add customization
  securityIdOnBackPrice,
  printedIdPrice,
  // End of code - Ashlekh on 19-02-2025
  // Reason - To add customization
  embroiderPrice,
  toPay,
//   userId,
//   billingAddress,
//   shippingAddress,


) => {
  {/**Code modified by unnati on1 19-01-2025
    *Reason-Added multipart form data instead of json */}
  try {
    
    var formData = new FormData()
    formData.append("stripeSessionId", stripeSessionId);
    formData.append("itemId", itemId);
    formData.append("orderId", orderId);
    formData.append("OrderItemExchangeTime", OrderItemExchangeTime);
    formData.append("exchangeReason", exchangeReason);
    formData.append("itemImage1", itemImage1);
    formData.append("itemImage2", itemImage2);
    formData.append("selectedColor", selectedColor);
    formData.append("selectedSize",selectedSize);
    formData.append("quantity", quantity);
    formData.append("requestType", requestType);
    formData.append("sale_percentage", sale_percentage);
    formData.append("after_customization_product_price", after_customization_product_price);
    formData.append("customization_comment", customization_comment);
    formData.append("logo", logo);
    formData.append("patches", patches);
    formData.append("security_batches", security_batches);
    // Added by - Ashlekh on 19-02-2025
    // Reason - To add customization
    formData.append("security_id_on_back", security_id_on_back);
    formData.append("printed_id", printed_id);
    // End of code - Ashlekh on 19-02-2025
    // Reason - To add customization
    formData.append("embroider", embroider);
    formData.append("productName", productName);
    formData.append("salesRate", salesRate);
    formData.append("logoPrice", logoPrice);
    formData.append("patchesPrice", patchesPrice);
    formData.append("securityBatchesPrice", securityBatchesPrice);
    // Added by - Ashlekh on 19-02-2025
    // Reason - To add customization
    formData.append("securityIdOnBackPrice",securityIdOnBackPrice);
    formData.append("printedIdPrice",printedIdPrice)
    // End of code - Ashlekh on 19-02-2025
    // Reason - To add customization
    formData.append("embroiderPrice", embroiderPrice);
    formData.append("toPay", toPay);
    const response = await API.post(
      `create-exchange-item-from-stripe/`,
    formData,     
      
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error occured while exchange the item", err);
    throw err;
  }
}
//   const response = await API.post(
//     `create-exchange-item-from-stripe/`,
//     {
//       stripeSessionId,
//               itemId,
//               orderId,
//               OrderItemExchangeTime,
//               exchangeReason,
//               itemImage1,
//               itemImage2,
//               selectedColor,
//               selectedSize,
//               quantity,
//               requestType,
//               sale_percentage,
//               after_customization_product_price,
//               customization_comment,
//               logo,
//               patches,
//               security_batches,
//               embroider,
//               productName,
//               salesRate,
//               logoPrice,
//               patchesPrice,
//               securityBatchesPrice,
//               embroiderPrice,
//               toPay
//             //   userId,
//             //   billingAddress,
//             //   shippingAddress,

//     },
//     {
//       headers: {
//         "Content-Type": "application/JSON",
//         // "Content-Type": "multipart/form-data"
//       },
//     }
//   );
//   if (response.response) {
//     if (response.response.status == 500) {
//       console.log(response.response.data);
//     } else if (response.response.status == 404) {
//       console.log(response.response.data);
//     }
//     return response ? response.data : {};
//   } else {
//     if (response.status == 200) {
//       return response ? response.data : {};
//     }
//   }
// };
  /**End of code modified by unnati on1 19-01-2025
    *Reason-Added multipart form data instead of json */
/**End of code addition by Unnati on 22-12-2024
 * Reason-To post exchange order using stripe
 */
/**Code added by Unnati on 26-12-2024
 * Reason-To perform cancellation
 */
export const performItemCancellation = async (
  ItemId,
  order,
  OrderItemCancellationTime,
  cancellationReason,
  size,
  quantity,
  color,
  amount,
  product_id,
  sales_rate,
  subtotal,
  total_amount,
  sale_percentage,
) => {
  try {
    const requestBody = {
      ItemId: ItemId,
      order: order,
      OrderItemCancellationTime: OrderItemCancellationTime,
      cancellationReason:cancellationReason,
      size:size,
      quantity:quantity,
      color:color,
      amount:amount,
      product_id:product_id,
      sales_rate:sales_rate,
      subtotal:subtotal,
      total_amount:total_amount,
      sale_percentage:sale_percentage,
    };
    const response = await API.post(
      `/cancel-item/`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error in cancellation of an item", err);
    throw err;
  }
};
/**End of code addition by Unnati on 26-12-2024
 * Reason-To perform cancellation
 */

/**
 * Added by - Ashlekh on 01-01-2025
 * Reason - API to post feedback
 */
export const postFeedBackDetailsAPI = async (value) => {
  try {
    const response = await API.post(
      `/post-feedback/`,
      { ...value },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.status === 200 ? response.data : {};
  } catch (error) {
    console.error("Error in FeedBack API call:", error);
    return {};
  }
};
/**
 * End of code - Ashlekh on 01-01-2025
 * Reason - API to post feedback
 */
/**Code added by Unnati on 2--12-2024
 * Reason-To get product size and color
 */
export const getProductDetails = async (product_id) => {
  try {
    const response = await API.get(`get-product-details/`, {
      params: {
        product_id
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.log("Failed to fetch products:", response.data);
      return {};
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return {};
  }
};
/**End of code addition by Unnati on 2--12-2024
 * Reason-To get product size and color
 */
/**Code aded by Unnati on 09-01-2025
 * Reason-Added order items to show in my orders
 */
export const getOrderItems = async (userId) => {
  try {
    const response = await API.get(`order-items/`, {
      // Added by - Ashlekh on 07-02-2025
      // Reason - To send user id
      params: {
        userId: userId,
      },
      // End of code - Ashlekh on 07-02-2025
      // Reason - To send user id
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.log("Failed to fetch items:", response.data);
      return {};
    }
  } catch (error) {
    console.error("Error fetching items:", error);
    return {};
  }
};
/**End of code addition by Unnati on 09-01-2025
 * Reason-Added order items to show in my orders
 */

export const getBanners = async () => {
  try {
    const response = await API.get("/banners/", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.warn("Unexpected response:", response);
      return [];
    }
  } catch (err) {
    console.error("Error fetching banners:", err);
    return [];
  }
};
