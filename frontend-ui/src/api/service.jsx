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