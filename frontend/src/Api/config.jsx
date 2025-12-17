/**
 * Created by - Ashish Dewangan on 22-05-2024
 * Reason - To specify frontend configurations
 */

// for local ----------->
// const baseURL = "http://192.168.1.18:8000";
const baseURL = "https://rbyr.adyantsofttech.com";


// for server ------------>
//const baseURL = "http://euniform.adyantsofttech.com";

const config = {
  baseURL : baseURL,
  apiBaseURL: `${baseURL}/api/v1`,
  staticBaseURL: `${baseURL}/static/`,
  apiTimeout: 500000,
  // Added by - Ashlekh on 17-09-2024
  // Reason - To add paypal client id
  PAYPAL_CLIENT_ID: "Af3_vJZmAA6DeikZ145Koa1grJX65nSZ4DizDCKFgMc_LmLAiqQD4H8brRFcQF6FqixDQGVEhFE7kry6",
  // End of code - Ashlekh on 17-09-2024
  // Reason - To add paypal client id
  currency_icon : "₹"
};

export default config;
