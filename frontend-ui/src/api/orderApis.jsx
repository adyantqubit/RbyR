import API from "./api";

export const increamentCheck = async (data) => {
    const response = await API.post(`increament_stock_check/`,data, {
          headers: { "Content-Type": "application/json"},
        }).catch((err) => console.log("Failed to authenticate the user."));
    return response ? response.data : {};
  };


  export const CouponCheck = async (data) => {
    const response = await API.post(`Coupon_check/`,data, {
          headers: { "Content-Type": "application/json"},
        }).catch((err) => console.log("Failed to authenticate the user."));
    return response ? response.data : {};
  }; 

  
  export const TaxGet = async () => {
    const response = await API.get(`tax_get/`, {
          headers: { "Content-Type": "application/json"},
        }).catch((err) => console.log("Failed to authenticate the user."));
    return response ? response.data : {};
  }; 


  export const ImpotantRuleGet = async () => {
    const response = await API.get(`important_rule_get/`, {
          headers: { "Content-Type": "application/json"},
        }).catch((err) => console.log("Failed to authenticate the user."));
    return response ? response.data : {};
  }; 

  export const cartStockRecheck=async(data)=>{
    const response = await API.post(`cart_recheck/`, data,{
      headers: { "Content-Type": "application/json"},
    }).catch((err) => console.log("Failed to authenticate the user."));
return response ? response.data : {};
  }


  export const shippingTick=async(data)=>{
    const response = await API.post(`shipping_tick/`, data,{
      headers: { "Content-Type": "application/json",'authorization':`Bearer ${localStorage.getItem('access_token')}`},
    }).catch((err) => console.log("Failed to authenticate the user."));
return response ? response.data : {};
  }

  export const shippingTickGet=async()=>{
    const response = await API.get(`shipping_tick/`,{
      headers: { "Content-Type": "application/json",'authorization':`Bearer ${localStorage.getItem('access_token')}`},
    }).catch((err) => console.log("Failed to authenticate the user."));
return response ? response.data : {};
  }

  export const userUpdate=async(data)=>{
    const response = await API.post(`User_update/`, data,{
      headers: { "Content-Type": "application/json",'authorization':`Bearer ${localStorage.getItem('access_token')}`},
    }).catch((err) => console.log("Failed to authenticate the user."));
return response ? response.data : {};
  }


  // #Added by Rohan kansari on 25-11-2022
  //   #reason- To consist data for guest user
  //   #jira issue -RBYR-208
  export const GuestCartRequest=async(data)=>{
    const response = await API.post(`cart_save_for_geust/`, data,{
      headers: { "Content-Type": "application/json",'authorization':`Bearer ${localStorage.getItem('access_token')}`},
    }).catch((err) => console.log("Failed to authenticate the user."));
return response ? response.data : {};
  }

//End of the code


// #Added By Rohan kansari
//     #reason- Pagination functionality where it get one by one page data in each call
//     #jira issue-RBYR233

export const nextIndexPage=async(data)=>{
  const response = await API.post(`page_indexing/`, data,{
    headers: { "Content-Type": "application/json"},
  }).catch((err) => console.log("Failed to authenticate the user."));
return response ? response.data : {};
}

//End of the code
