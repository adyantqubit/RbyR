/**Code added by Unnati on 04-08-2024
 * Reason-To have invoice page
 */

import React, { useRef, useEffect, useContext, useState } from "react";
import styles from "./Invoice.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import ReactToPrint from "react-to-print";
import config from "../../Api/config";
import { GlobalContext } from "../../context/Context";
import { DateFormatter } from "../../utils/DateFormat";
import { useParams } from "react-router-dom";
import { getOrderDetail } from "../../Api/services";
import Constants from "../../constants/Constants";
import { getStripeSessionStatusAPI } from "../../Api/services";
const Invoice = () => {
  const { id } = useParams();
  const { settingInfo } = useContext(GlobalContext);
  const location = useLocation();
  /**Code modified by Unnati on 27-12-2024
   * Reason-To get item from state
   */
  const item  = location.state || {};
   /**End of code modification by Unnati on 27-12-2024
   * Reason-To get item from state
   */
  const [Order, setOrder] = useState("");
   /**Code modified by Unnati on 27-12-2024
   * Reason-Modified orderDetail
   */
  const orderDetail = Order && Order.orderItems
  ? Array.isArray(Order.orderItems)
    ? Order.orderItems
    : [Order.orderItems]
  : [];
   /*End of code modification by Unnati on 27-12-2024
   * Reason-Modified orderDetail
   */
  const order = Order ? Order.orderSummary : {};
  const companyInfo = Order ? Order.companyInfo[0] : {};
  const shippingAddress = Order ? Order.shippingAddress : {};
  const billingAddress = Order ? Order.billingAddress : {};
  const { user, setUser } = useContext(GlobalContext);
  // Added by - Ashlekh on 26-11-2024
  // Reason - useState for loader
  const [isLoading, setIsLoading] = useState(true);
  // End of code - Ashlekh on 26-11-2024
  // Reason - useState for loader
  /**Code added by Unnati on 05-08-2024
   * Reason-Using useRef
   */
  let componentRef = useRef();
  /**End of code addition by Unnati on 05-08-2024
   * Reason-Using useRef
   */
  /**Code added by Unnati on 10-01-2025
   * Reason-Added to navigate my order
   */
  const navigateMyOrder = () => {
    if (user.id != undefined){
      navigate("/myaccount", { state: { myOrder: "orders" } });
    } else{
      navigate("/login");
    }
  };
    /**End of code addition by Unnati on 10-01-2025
   * Reason-Added to navigate my order
   */
    /**Code added by Unnati on 10-01-2025
   * Reason-Added to navigate home
   */
  const handleContinueShopping =() =>{
    navigate("/")
  }
      /**End of code addition by Unnati on 10-01-2025
   * Reason-Added to navigate home
   */
  /* Added by jhamman on 23-10-2024
  Reason - now we are fetching data from api before getting data from state*/
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try { 
        /**Code modified by Unnati on 27-12-2024
        * Reason-Added item type
        */
        const response = await getOrderDetail(id, user.id,item.type);
        /**End of code modificaton by Unnati on 27-12-2024
        * Reason-Added item type
        */
        setOrder(response);
        // Added by - Ashlekh on 26-11-2024
        // Reason - To set loader false
        if (response?.msg == "success") {
          setIsLoading(false);
        }
        // End of code - Ashlekh on 26-11-2024
        // Reason - To set loader false
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      }
    };
    fetchOrderDetail();
    // Added by - Ashlekh on 07-12-2024
    // Reason - If user clicks on logout then will navigate to login page
    if(user.id == undefined){
      navigate("/login");
    }
    // End of code - Ashlekh on 07-12-2024
    // Reason - If user clicks on logout then will navigate to login page
  }, [id, user.id]);
  /* End of addition by jhamman on 23-10-2024
  Reason - now we are fetching data from api before getting data from state*/

  const navigate = useNavigate();

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = (event) => {
      event.preventDefault();
      navigate("/");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);
  /**Code added by Unnati on 11-09-2024
   * Reason-To fetch logo from backend
   */
  // useEffect(() => {
  //   const fetchlogo = async () => {
  //     try {
  //       const data = await getSettings();
  //       setLogo(data.contact_info);
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   };
  //   fetchlogo();
  // }, []);
  /**End of code addition by Unnati on 11-09-2024
   * Reason-To fetch logo from backend
   */
  /**Code commented by Unnati on 27-12-2024
    * Reason-This code is not in use
    */
  // const total = orderDetail?.reduce((accumulator, item) => {
  //   return accumulator + item.amount;
  // }, 0);
  /**End of code commented by Unnati on 27-12-2024
    * Reason-This code is not in use
    */
  // Addition by Om Shrivastava on 04-12-2024
  // Reason : Show the total price of Customized amount
  const calculateTotalCustomizedPrice = (item) => {
    let total = 0;
    if (item.logo) total += parseFloat(item.logo_price) || 0;
    if (item.patches) total += parseFloat(item.patches_price) || 0;
    if (item.embroider) total += parseFloat(item.embroider_price) || 0;
    if (item.security_batches) total += parseFloat(item.security_batches_price) || 0;
    // Added by - Ashlekh on 19-02-2025
    // Reason - To add customization
    if (item.security_id_on_back) total += parseFloat(item.security_id_on_back_price) || 0;
    if (item.printed_id) total += parseFloat(item.printed_id_price) || 0;
    // End of code - Ashlekh on 19-02-2025
    // Reason - To add customization
    // Code changed by - Ashlekh on 21-02-2025
    // Reason - To roundoff the total to 2 decimal places
    // return total;
    return Math.round(total * 1e2) / 1e2;
    // End of code - Ashlekh on 21-02-2025
    // Reason - To roundoff the total to 2 decimal places
  };
  // End of addition by Om Shrivastava on 04-12-2024
  // Reason : Show the total price of Customized amount
  return (
    <>
      {/* Added by - Ashlekh on 26-11-2024
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
        // End of code - Ashlekh on 26-11-2024
        // Reason - To add loader
        <div>
          <div
            className={styles.invoiceContainer}
            ref={(el) => (componentRef = el)}
          >
            <header className={styles.invoiceHeader}>
              <div className={styles.logo}>
                {/* Added by - Ashlekh on 10-12-2024
                Reason - To apply null condition */}
                {Order?.settings?.logo != null && (
                // End of code - Ashlekh on 10-12-2024
                // Reason - To apply null condition
                  <img src={`${config.baseURL}${settingInfo?.logo}`} alt="Logo" />
                )}
              </div>
              <div className={styles.invoiceTitle}>
                <h1>{companyInfo?.name}</h1>
                <div className={styles.invoiceDetails}>
                  <div>Order Id: {order.order_id || "N/A"}</div>

                  {/* Modified by by jhamman on 19-10-2024
                Reason - added function to format date from yyyy-mm-dd */}
                  {/* <div>Invoice date: {order.date || "N/A"}</div> */}
                  <div>Invoice date: {DateFormatter(order.date) || "N/A"}</div>
                  {/* End of modification by jhamman on 19-10-2024
                Reason - added function to format date from yyyy-mm-dd */}
                </div>
              </div>
            </header>
            {/**Code added by Unnati on 04-08-2024
             *Reason-To map company information */}
            <section className={styles.addressDetails}>
              <div className={styles.from}>
                <h2>From</h2>
                <div className={styles.fromDetails}>
                  <div>{companyInfo?.name}</div>
                  <div>{companyInfo?.email}</div>
                  <div>{companyInfo?.contact_number}</div>
                  <div>{companyInfo?.address}</div>
                  <div>{companyInfo?.pincode}</div>
                </div>
              </div>
              {/**End of code addition by Unnati on 04-08-2024
               *Reason-To map company information */}
              <div className={styles.To}>
                <div className={styles.billTo}>
                  <h2>Bill to</h2>
                  <div className={styles.billToDetails}>
                    {/**Code modified by Unnati on 15-09-2024
                     *Reason-To map billing user details */}
                    <div>
                      {billingAddress.first_name} {billingAddress.last_name}
                    </div>

                    <div>{billingAddress.contact_number || "N/A"}</div>
                    <div>
                      {billingAddress.address || "N/A"},{" "}
                      {billingAddress.city || "N/A"},{billingAddress.state},
                    </div>
                    <div>
                      {billingAddress.country || "N/A"},
                      {billingAddress.zipcode || "N/A"}
                    </div>
                  </div>
                </div>
                <div className={styles.shipTo}>
                  <h2>Ship to</h2>
                  <div className={styles.shipToDetails}>
                    <div>
                      {shippingAddress.first_name} {shippingAddress.last_name}
                    </div>
                    <div>{shippingAddress.contact_number}</div>
                    <div>
                      {shippingAddress.address || "N/A"}{" "}
                      {shippingAddress.city || "N/A"},{shippingAddress.state},
                    </div>
                    <div>
                      {shippingAddress.country || "N/A"},
                      {shippingAddress.zipcode || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/**End of code addition by Unnati on 04-08-2024
             *Reason-To map billing user details */}

            <section className={styles.invoiceTable}>
              <table>
                <thead>
                  <tr>
                    {/* Added by - Ashlekh on 21-11-2024
                  Reason - To display serial no */}
                    <th>S.NO</th>
                    {/* End of code - Ashlekh on 21-11-2024
                  Reason - To display serial no */}
                    <th>Product Name</th>
                    {/* Addition by Unnati  on 07-12-2024
                    Reason : Add the rate field  */}
                    <th>Rate({config.currency_icon})</th>
                     {/* End of code addition by Unnati  on 07-12-2024
                    Reason : Add the rate field  */}
                    {/* Added by - Ashlekh on 14-12-2024
                    Reason - To add discount field*/}
                    <th>Discount(%)</th>
                    {/* End of code - Ashlekh on 14-12-2024
                    Reason - To add discount field */}
                    {/**Code added by Unnati on 17-01-2025
                    *Reason-Added discounted amount */}
                    <th>Discounted Amount({config.currency_icon})</th>
                    {/**End of code addition by Unnati on 17-01-2025
                    *Reason-Added discounted amount */}
                    {/* Addition by Om Shrivastava on 04-12-2024
                    Reason : Add the customized amount field  */}
                    {/* Modified by Unnati on 08-12-2024
                    Reason : Modified customized amount to customized detail  */}
                    {/* <th>Customized amount($)</th> */}
                    <th>Customized detail({config.currency_icon})</th>
                    {/* End of code modification by Unnati on 08-12-2024
                    Reason : Modified customized amount to customized detail  */}
                    {/* End of addition by Om Shrivastava on 04-12-2024
                    Reason : Add the customized amount field  */}
                    {/**Code added by Unnati on 16-10-2024
                     Reason-Added $ */}
                     {/* Modified by Unnati  on 07-12-2024
                    Reason : Add the amount field  */}
                    {/* <th>Rate($)</th> */}
                    <th>Amount({config.currency_icon})</th>
                    {/**End of code modification by Unnati on 07-12-2024
                  Reason-Add the amount field  */}
                    <th>QTY</th>
                    <th>Size</th>
                    {/* Modified by Unnati on 08-12-2024
                    Reason : Modified amount to total amount  */}
                    <th>Total Amount({config.currency_icon})</th>
                    {/* End of code modification by Unnati on 08-12-2024
                    Reason : Modified amount to total amount  */}
                  </tr>
                </thead>
                {/**Code added by Unnati on 04-08-2024
                 *Reason-To map items  */}
                <tbody>
                  {orderDetail?.map((item, index) => (
                    <tr key={item.id}>
                      {/* Added by - Ashlekh on 21-11-2024
                    Reason - To display serial no */}
                    <td>{index + 1}</td>
                    {/* End of code - Ashlekh on 21-11-2024
                    Reason - To display serial no */}
                    {/* Code changed by - Ashlekh on 25-01-2025
                    Reason - To add class name */}
                    {/* <td> */}
                    <td className={`${styles.productName}`}>
                      {/* End of code - Ashlekh on 25-01-2025
                      Reason - To add class name */}
                      {item.product_name}
                      {/* Addition by Om Shrivastava on 26-11-2024
                                            Reason : Add text of customized product  */}
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
                    </td>
                    {/**Code added by Unnati on 08-12-2024
                    *Reason-Added sales rate */}
                    <td className={styles.rate}>{item.sales_rate}</td>
                    {/**End of code addition by Unnati on 08-12-2024
                    *Reason-Added sales rate */}
                    {/* Added by - Ashlekh on 14-12-2024
                    Reason - To add sale percentage */}
                    {/* Code Changed by - Ashlekh on 17-01-2025
                    Reason - To display (-) if percentage is not added in backend */}
                    {/* <td className={`${styles.salePercentage}`}>{item.sale_percentage}</td> */}
                    {item?.sale_percentage ? (
                      <td className={`${styles.salePercentage}`}>{item.sale_percentage}</td>
                    ) : (
                      <td className={`${styles.salePercentage}`}>-</td>
                    )}
                    {/* End of code - Ashlekh on 17-01-2025
                    Reason - To display (-) if percentage is not added in backend */}
                    {/* End of code - Ashlekh on 14-12-2024
                    Reason - To add sale percentage */}
                    {/**Code added by Unnati on 17-01-2025
                    *Reason-Added discounted amount field */}
                    {/* Added by - Ashlekh on 24-01-2025
                    Reason - To display (-) if percentage is not added in backend */}
                    {item.sale_percentage ? (
                      <td className={`${styles.salePercentage}`}>{item.amount}</td>
                    ) : (
                      <td className={`${styles.salePercentage}`}>-</td>
                    )}
                    {/* End of code - Ashlekh on 24-01-2025
                    Reason - To display (-) if percentage is not added in backend */}
                    {/**End of code addition by Unnati on 17-01-2025
                    *Reason-Added discounted amount field */}
                    {/* Addition by Om Shrivastava on 04-12-2024
                    Reason : Add the customized amount field  */}
                    <td className={`${styles.rate} ${styles.customizedDetail}`}>
                    {item.logo?<p>Logo : ${item.logo_price}</p>:null}
                    {item.patches?<p>Patches / Batches : ${item.patches_price}</p>:null}
                    {/* Code changed by - Ashlekh on 18-12-2024
                    Reason - To change name */}
                    {/* {item.embroider?<p>Embroider / Name : ${item.embroider_price}</p>:null} */}
                    {item.embroider?<p>Embroider: ${item.embroider_price}</p>:null}
                    {/* End of code - Ashlekh on 18-12-2024
                    Reason - To change name */}
                    {/* Code changed by - Ashlekh on 18-02-2025
                    Reason - To change customization name */}
                    {/* {item.security_batches?<p>Security id : ${item.security_batches_price}</p>:null} */}
                    {item.security_batches?<p className={`${styles.customizationDetail}`}>Security ID on Back and Chest : ${item.security_batches_price}</p>:null}
                    {/* End of code - Ashlekh on 18-02-2025
                    Reason - To change customization name */}
                    {/* Added by - Ashlekh on 19-02-2025
                    Reason - To add customization */}
                    {item.security_id_on_back?<p>Security ID on Back : ${item.security_id_on_back_price}</p>:null}
                    {item.printed_id?<p>Printed Id : ${item.printed_id_price}</p>:null}
                    {/* End of code - Ashlekh on 19-02-2025
                    Reason - To add customization */}
                    {calculateTotalCustomizedPrice(item) > 0 ?<p> Total Amount : {config.currency_icon}{calculateTotalCustomizedPrice(item)}</p> :<>---</>}
                    </td>
                    {/* End of addition by Om Shrivastava on 04-12-2024
                    Reason : Add the customized amount field  */}
                    <td className={styles.rate}>
                      {/* Modification and addition by Om Shrivastava on 26-11-2024
                    Reason : Show the customization amount also  */}
                      {/* {item.sales_rate} */}
                      {/* Modification and addition by Om Shrivastava on 04-12-2024
                      Reason : Show the amount  */}
                      {/* {item.logo ||
                      item.patches ||
                      item.security_batches ||
                      item.embroider ? (
                        <>{item.after_customization_product_price}</>
                      ) : (
                        <>{item.sales_rate}</>
                      )} */}
                      {item.after_customization_product_price}
                      {/* End of commented by Om Shrivastava on 04-12-2024
                      Reason : Show the amount  */}
                      {/* End of modification and addition by Om Shrivastava on 26-11-2024
                    Reason : Show the customization amount also  */}
                    </td>
                    <td className={styles.quantity}>{item.quantity}</td>
                    <td className={styles.size}>{item.size}</td>
                    <td className={styles.subtotal}>
                      {/* {item.amount} */}
                      {/* Modification and addition by Om Shrivastava on 26-11-2024
                    Reason : Show the customization amount also  */}
                      {/* {item.sales_rate} */}
                      {/* {item.amount} */}
                      {item.after_customization_product_price * item.quantity}
                      {/* End of modification and addition by Om Shrivastava on 26-11-2024
                    Reason : Show the customization amount also  */}
                    </td>
                  </tr>
                ))}
              </tbody>
              {/**End of code addition by Unnati on 04-08-2024
               *Reason-To map items  */}
            </table>
          </section>
          <div className={styles.section3}>
            <section className={styles.paymentInstructions}>
              {/* Modified by jhamman on 19-10-2024
            Reason - changed headin name and comment other*/}
                {/* <h3>Payment Instruction</h3> */}
                {/* <div> */}
                <h3>Payment Instruction :
                {/* Added by - Ashish Dewangan on 27-11-2024
                * Reason - To show stripe label if stripe was selected for the purchase */}
                <span style={{fontWeight:'400'}}> {
                  order?.paypal_order_id &&
                  order?.paypal_order_id?.trim()?.length>0 ?
                  "PayPal":
                  "Stripe"}
                </span>
                </h3>
                {/* End of addition by - Ashish Dewangan on 27-11-2024
                * Reason - To show stripe label if stripe was selected for the purchase */}
                {/* </div> */}
                <section className={styles.notes}>
                  <h3>Notes :</h3>
                  <div>Thank you for Shopping.</div>
                </section>
                {/* <div>
                <h3>Notes</h3>
                <div>Thank you for Shopping.</div>
              </div> */}
                {/* <div>Paypal email: globalpower@gmail.com</div>
              <div>Make checks payable to: John Smith</div>
              <div>Bank Transfer Routing (ABA): 061120084</div> */}
                {/* End of modification by jhamman on 19-10-2024
            Reason - changed headin name and comment other*/}
              </section>

              <section className={styles.invoiceSummary}>
                <div className={styles.summaryDetails}>
                  {/**Code added by Unnati on 04-08-2024
                   *Reason-To map invoice summary  */}

                  <div className={styles.field}>
                    <div className={styles.label}>Subtotal: </div>
                    <div className={styles.value}>{config.currency_icon}{order.subtotal}</div>
                  </div>

                  {/**Code added by Unnati on 12-09-2024
                   *Reason-To show discount field only when its greater than 0 */}
                  {order.discount_amount > 0 && (
                    <div className={styles.field}>
                      <div className={styles.label}>Discount Amount: </div>
                      <div className={styles.value}>
                        {config.currency_icon}{Number(order.discount_amount).toFixed(2)}
                      </div>
                    </div>
                  )}
                  {/**Code added by Unnati on 12-09-2024
                   *Reason-To show discount field only when its greater than 0 */}

                  {/* <div className={styles.field}>
                  <div className={styles.label}>Shipping Cost: </div>
                  <div className={styles.value}>
                    ${order.shipping_amount || "0.00"}
                  </div>
                </div> */}
                <div className={styles.field}>
                  <div className={styles.label}>Tax(%):</div>
                  {/**Code modified by Unnati on 25-11-2024
                  *Reason-Modified tax  */}
                  {/* <div className={styles.value}>5%</div> */}
                  <div className={styles.value}>{Constants.sales_tax}%</div>
                  {/**End of code modification by Unnati on 25-11-2024
                  *Reason-Modified tax  */}
                </div>
                <div className={styles.field}>
                  <div className={styles.label}>Tax Amount:</div>
                  <div className={styles.value}>{config.currency_icon}{order.tax_amount}</div>
                </div>

                  <div className={styles.field}>
                    <div className={styles.label}>Total: </div>
                    <div className={styles.value}>{config.currency_icon}{order.grand_total}</div>
                  </div>
                  {/**Code commented by Unnati on 25-08-2024
                   *Reason-This fields are not in use currently */}
                  {/* <div className={styles.field}>
                  <div className={styles.label}>Amount paid: </div>
                  <div className={styles.value}>Rs. {"0.00"}</div>
                </div>
                <div className={styles.field}>
                  <h2 className={styles.label}>Balance Due:</h2>
                  <div className={styles.value}>Rs. {"0.00"}</div>
                </div> */}
                  {/**End of code comment by Unnati on 25-08-2024
                   *Reason-This fields are not in use currently */}
                </div>
                {/**End of code addition by Unnati on 04-08-2024
                 *Reason-To map invoice summary  */}
              </section>
            </div>
            {/* Commented by jhamman on 19-10-2024
          Reason - Added it above*/}
            {/* <section className={styles.notes}>
            <h3>Notes</h3>
            <div>Thank you for Shopping.</div>
          </section> */}
            {/* End of commentation by jhamman on 19-10-2024
          Reason - Added it above*/}
          </div>
        </div>
      )}

      {/**Code added by Unnati on 05-08-2024
       *Reason-To add reactToPrint component*/}
      <div className={styles.buttonContainer}>
        <ReactToPrint
          trigger={() => (
            <button className={styles.printButton} type="submit">
              Print
            </button>
          )}
          content={() => componentRef}
        ></ReactToPrint>
      </div>
      {/**Code added by unnati on 10-01-2025
      *Reason-added buttons */}
      <div className={styles.buttonsContainer}>
      <button className={styles.printButton} type="submit" onClick={navigateMyOrder}>
             Check your order status
        </button>
        <button className={styles.printButton} type="submit" onClick={handleContinueShopping}>
             Continue Shopping
        </button>
      </div>
       {/**End of code addition by unnati on 10-01-2025
      *Reason-added buttons */}
      {/**End of code addition by Unnati on 05-08-2024
       *Reason-To add reactToPrint component*/}
    </>
  );
};

export default Invoice;
/**End of code addition by Unnati on 04-08-2024
 * Reason-To have invoice page
 */
