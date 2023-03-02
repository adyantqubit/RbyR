import API from "./api";

// export const Authenticate = async (payload) => {
//   const response = await API.post("login_react/", payload, {
//     headers: { "Content-Type": "application/json" },
//   }).catch((err) => console.log("Failed to authenticate the user."));
//   console.log(response.data);
//   return response ? response.data : {};
// };

export const SlideShowApi = async () => {
  const response = await API.get("login_react/", {
        headers: { "Content-Type": "application/json" },
      }).catch((err) => console.log("Failed to authenticate the user."));
  console.log(response.data);
  return response ? response.data : {};
};


export const check2 = async () => {
  const response = await API.get("check/", {
        headers: { "Content-Type": "application/json" },
      }).catch((err) => console.log("Failed to authenticate the user."));
  console.log(response.data);
  return response ? response.data : {};
};



export const getCart = async (access_token) => {
  const response = await API.get("cartUpdate/", {
        headers: { "Content-Type": "application/json",'authorization':`Bearer ${access_token}` },
      }).catch((err) => console.log("Failed to authenticate the user."));
  console.log(response.data);
  return response ? response.data : {};
};

export const getCategoryProduct = async (category) => {
  const response = await API.get(`getCategoryProduct/${category}/`, {
        headers: { "Content-Type": "application/json"},
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};

export const picApi = async () => {
  const response = await API.get(`car/`, {
        headers: { "Content-Type": "application/json"},
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};

export const DetailApi = async (id) => {
  const response = await API.get(`detail/${id}/`, {
        headers: { "Content-Type": "application/json"},
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};


export const regenaratingTokenApi = async (id) => {
  const response = await API.post(`refresh/`,id, {
        headers: { "Content-Type": "application/json"},
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};




export const LikeUpdate = async (id) => {
  const response = await API.get(`likedUpdate/`, {
        headers: { "Content-Type": "application/json", 'authorization':`Bearer ${id}`},
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};

export const getCardHomeImagesApi = async () => {
  const response = await API.get(`cardimages/`, {
        headers: { "Content-Type": "application/json"},
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};

export const CartQuantityApi = async ({data,access_token}) => {
  const response = await API.post(`increament/`,data, {
        headers: { "Content-Type": "application/json",'authorization':`Bearer ${access_token}`},
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};

export const CartQuantityApi2 = async ({data,access_token}) => {
  const response = await API.post(`decreament/`,data, {
        headers: { "Content-Type": "application/json",'authorization':`Bearer ${access_token}`},
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};


export const invoiceApi = async (data,access_token) => {
  const response = await API.post(`invoice_post/`,data, {
        headers: { "Content-Type": "application/json",'authorization':`Bearer ${access_token}`},
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};



export const shpingcheckApi = async (data,access_token) => {
  const response = await API.post(`shpping_orderCheck/`,data, {
        headers: { "Content-Type": "application/json",'authorization':`Bearer ${access_token}`},
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};

export const billingcheckApi = async (data,access_token) => {
  const response = await API.post(`billing_orderCheck/`,data, {
        headers: { "Content-Type": "application/json",'authorization':`Bearer ${access_token}`},
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};


export const cartDeleteApi = async ({access}) => {
  const response = await API.get(`cart_delete/`, {
        headers: { "Content-Type": "application/json",'authorization':`Bearer ${access}`},
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};


export const InvoiveGetApi = async ({access}) => {
  const response = await API.get(`invoie_get/`, {
        headers: { "Content-Type": "application/json",'authorization':`Bearer ${access}`},
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};


export const InvoiveSingleGetApi = async ({access,data}) => {
  console.log(access)
  const response = await API.put(`invoiesingle/`,data, {
        headers: { "Content-Type": "application/json",'authorization':`Bearer ${access}`},
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};


export const TransactionGetApi = async ({access}) => {
  const response = await API.get(`transaction_get/`, {
        headers: { "Content-Type": "application/json",'authorization':`Bearer ${access}`},
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};

export const ShippingGetApi = async ({access}) => {
  const response = await API.get(`shipping_get/`, {
        headers: { "Content-Type": "application/json",'authorization':`Bearer ${access}`},
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};


export const ShippingUpdateApi = async ({access,billingData}) => {
  const response = await API.put(`shipping_update/`,billingData ,{
        headers: { "Content-Type": "application/json",'authorization':`Bearer ${access}`},
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};

export const ShippingDeleteApi = async ({access,id}) => {
  const response = await API.put(`shipping_delete/`,id,{
        headers: { "Content-Type": "application/json",'authorization':`Bearer ${access}`},
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};


export const getQrDetailApi=async () => {
  const response = await API.get(`getQR/`, {
        headers: { "Content-Type": "application/json"},
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};

// Added by Ashish on 06-11-2022
// Reason - To have FAQ functionality
export const getFAQList = async () => {
  const response = await API.get("faq/", {
        headers: { "Content-Type": "application/json" },
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};
// End of code addition

// Added by Ashish on 09-11-2022
// Reason - To have Contact us functionality
export const getContactUsDetail = async () => {
  const response = await API.get("contact-us/", {
        headers: { "Content-Type": "application/json" },
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};
// End of code addition

// Added by Ashish on 13-11-2022
// Reason - To have Contact us functionality
export const getTermsAndConditionsDetail = async () => {
  const response = await API.get("terms-and-conditions/", {
        headers: { "Content-Type": "application/json" },
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};
// End of code addition

// Added by Ashish on 13-11-2022
// Reason - To have Privacy Policy functionality
export const getPrivacyPoliciesDetail = async () => {
  const response = await API.get("privacy-policy/", {
        headers: { "Content-Type": "application/json" },
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};
// End of code addition

// Added by Ashish on 13-11-2022
// Reason - To have Privacy Policy functionality
export const getDeliveryAndShippingPoliciesDetail = async () => {
  const response = await API.get("delivery-and-shipping-policy/", {
        headers: { "Content-Type": "application/json" },
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};
// End of code addition

// Added by Ashish on 14-11-2022
// Reason - To have Refund Policy functionality
export const getRefundPoliciesDetail = async () => {
  const response = await API.get("refund-policy/", {
        headers: { "Content-Type": "application/json" },
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};
// End of code addition

// Added by Ashish on 14-11-2022
// Reason - To have cancellation Policy functionality
export const getCancellationPoliciesDetail = async () => {
  const response = await API.get("cancellation-policy/", {
        headers: { "Content-Type": "application/json" },
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};
// End of code addition

// Added by Ashish on 14-11-2022
// Reason - To have StoreLocator functionality
export const getStoreLocatorDetail = async () => {
  const response = await API.get("store-locator/", {
        headers: { "Content-Type": "application/json" },
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};
// End of code addition

// Added by Ashish on 16-11-2022
// Reason - To have StoreLocator functionality
export const getBridalDetail = async () => {
  const response = await API.get("bridal/", {
        headers: { "Content-Type": "application/json" },
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};
// End of code addition

// Added by Ashish on 16-11-2022
// Reason - To have social links functionality
export const getSocialLinkDetail = async () => {
  const response = await API.get("social-link/", {
        headers: { "Content-Type": "application/json" },
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};
// End of code addition

// Added by Ashish on 17-11-2022
// Reason - To have bridal functionality
export const postBridalDetails = async (data) => {
  const response = await API.post(`save-bridal-details/`,data, {
        headers: { "Content-Type": "application/json"},
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};
// End of code addition

// Added by Ashish on 17-11-2022
// Reason - To have copyright text functionality
export const getCopyrightDetails = async () => {
  const response = await API.get("copyright/", {
        headers: { "Content-Type": "application/json" },
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};
// End of code addition

// Added by Ashish on 17-11-2022
// Reason - To have EmailSubscription functionality
export const postEmailDetails = async (data) => {
  const response = await API.post(`save-email/`,data, {
        headers: { "Content-Type": "application/json"},
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};
// End of code addition


export const InstagramCollections = async () => {
  const response = await API.get(`get-instagram-posts/`, {
        headers: { "Content-Type": "application/json"},
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};

// Added by Ashish dewangan on 18-11-2022
// Reason - to have cross button on search icon more width
// Jira issue no - RBYR -141
export const getSearchedProducts = async (parameter) => {
  const response = await API.get(`search-products/${parameter}`, {
        headers: { "Content-Type": "application/json"},
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};

// export const getProfileData = async () => {
//   const response = await API.get(`profile/`, {
//         headers: { "Content-Type": "application/json",'authorization':`Bearer ${localStorage.getItem('access_token')}`},
//       }).catch((err) => console.log("Failed to authenticate the user."));
//   return response ? response.data : {};
// };
// End of code addition

// Added by Ashish dewangan on 19-11-2022
// Reason - to get logo and cover from backend
// Jira issue no - RBYR -149
export const getLogoAndCover = async () => {
  const response = await API.get(`logo-and-cover/`, {
        headers: { "Content-Type": "application/json"},
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};
// End of code addition

// Added by Ashish dewangan on 21-11-2022
// Reason - to get footer description from backend
// Jira issue no - RBYR -149
export const getFooterDescriptionDetail = async () => {
  const response = await API.get(`footer-description/`, {
        headers: { "Content-Type": "application/json"},
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};
// End of code addition

// Added by Ashish Dewangan on 23-11-2022
// Reason - To save get chart image
// Jira issue no - RBYR-193
export const getWomenSizeChartDetail = async () => {
  const response = await API.get(`women-size-chart/`, {
        headers: { "Content-Type": "application/json"},
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};
// End of code addition

// Added by Ashish on 24-11-2022
// Reason - To send custom tailored request to backend
export const postCustomTailoredDetails = async (data) => {
  const response = await API.post(`save-custom-tailored-details/`,data, {
        headers: { "Content-Type": "application/json"},
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};
// End of code addition

// Added by Ashish on 24-11-2022
// Reason - To get whatsapp contact number from backend
export const getWhatsappContactDetail = async () => {
  const response = await API.get(`whatsapp-contact-number/`, {
        headers: { "Content-Type": "application/json"},
      }).catch((err) => console.log("Failed to authenticate the user."));
  return response ? response.data : {};
};
// End of code addition