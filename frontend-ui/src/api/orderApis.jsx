import API from "./api";

export const increamentCheck = async (data) => {
    const response = await API.post(`increament_stock_check/`,data, {
          headers: { "Content-Type": "application/json"},
        }).catch((err) => console.log("Failed to authenticate the user."));
    return response ? response.data : {};
  };