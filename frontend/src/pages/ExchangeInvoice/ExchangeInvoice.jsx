/**Code added by Unnati on 22-12-2024
 * Reason-To have  exchange invoice page
 */

import React, { useRef, useEffect, useContext, useState } from "react";
import styles from "./ExchangeInvoice.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import ReactToPrint from "react-to-print";
import config from "../../Api/config";
import { GlobalContext } from "../../context/Context";
import { DateFormatter } from "../../utils/DateFormat";
import { useParams } from "react-router-dom";
import { getOrderDetail } from "../../Api/services";
import Constants from "../../constants/Constants";
import { getStripeSessionStatusAPI } from "../../Api/services";
const ExchangeInvoice = () => {
  const { id } = useParams();
  const { settingInfo } = useContext(GlobalContext);
  const location = useLocation();
  const Exchange  = location.state || {};
  const [Order, setOrder] = useState("");
  const orderDetail = Order && Order.orderItems
  ? Array.isArray(Order.orderItems)
    ? Order.orderItems
    : [Order.orderItems]
  : [];
  console.log("exchange",orderDetail)
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

  /* Added by jhamman on 23-10-2024
  Reason - now we are fetching data from api before getting data from state*/
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await getOrderDetail(id, user.id,Exchange.type);
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
    return total;
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
                {/**Code modified by Unnati on 28-12-2024
                *Reason-Added logo */}
                {/* {Order?.settings?.logo != null && ( */}
                {settingInfo?.logo != null && (
                  /*End of code modification by Unnati on 28-12-2024
                *Reason-Added logo */
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
       
                
                    <th>S.NO</th>
                 
                    <th>Product Name</th>
                   
                    <th>Rate($)</th>
                  
                    <th>Discount(%)</th>
                      {/**Code added by Unnati on 17-01-2025
                    *Reason-Added discounted amount field */}
                    <th>Discounted Amount($)</th>
                    {/**End of code addition by Unnati on 17-01-2025
                    *Reason-Added discounted amount field */}
                    
                    <th>Customized detail($)</th>
                    <th>QTY</th>
                    <th>Amount($)</th>
            
                    {/* <th>QTY</th> */}
                    <th>Size</th>
                    <th>Tax</th>
                    <th>Total Amount($)</th>
                  
                  </tr>
                </thead>
          
                <tbody>
                  {orderDetail?.map((item, index) => (
                    <tr key={item.id}>
                     
                    <td>{index + 1}</td>
               
                    <td>
                      {item.product_name}
                 
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
                    
                    </td>
                 
                    <td className={styles.rate}>{item.sales_rate}</td>
                   
                    <td className={`${styles.salePercentage}`}>{item.sale_percentage}</td>
                    {/**Code added by Unnati on 17-01-2025
                      *Reason-Added discounted amount field */}
                      {/* Added by - Ashlekh on 14-02-2025
                      Reason - Earlier amount was displayed. If sale_percentage is empty */}
                      {item.sale_percentage != null ? (
                        <td className={`${styles.salePercentage}`}>{item.amount}</td>
                      ) : (
                        <td className={`${styles.salePercentage}`}>-</td>  
                      )}
                      {/* <td className={`${styles.salePercentage}`}>{item.amount}</td> */}
                      {/* End of code - Ashlekh on 14-02-2025
                      Reason - Earlier amount was displayed. If sale_percentage is empty */}
                      {/**End of code addition by Unnati on 17-01-2025
                      *Reason-Added discounted amount field */}
                  
                    <td className={styles.rate}>
                    {item.logo?<p>Logo : ${item.logo_price}</p>:null}
                    {item.patches?<p>Patches / Batches : ${item.patches_price}</p>:null}
                    {item.embroider?<p>Embroider / Name : ${item.embroider_price}</p>:null}
                    {/* Code changed by - Ashlekh on 18-02-2025
                    Reason - To change customization name */}
                    {/* {item.security_batches?<p>Security id : ${item.security_batches_price}</p>:null} */}
                    {item.security_batches?<p>Security ID on Back and Chest : ${item.security_batches_price}</p>:null}
                    {/* End of code - Ashlekh on 18-02-2025
                    Reason - To change customization name */}
                    {/* Added by - Ashlekh on 19-02-2025
                    Reason - To add customization */}
                    {item.security_id_on_back?<p>Security ID on Back : ${item.security_id_on_back_price}</p>:null}
                    {item.printed_id?<p>Printed Id : ${item.printed_id_price}</p>:null}
                    {/* End of code - Ashlekh on 19-02-2025
                    Reason - To add customization */}
                    {calculateTotalCustomizedPrice(item) > 0 ?<p> Total Amount : ${calculateTotalCustomizedPrice(item)}</p> :<>---</>}
                    </td>
                    <td className={styles.quantity}>{item.quantity}</td>
                    <td className={styles.rate}>
                   
                      {item.after_customization_product_price}
                     
                    </td>
                    {/* <td className={styles.quantity}>{item.quantity}</td> */}
                    <td className={styles.size}>{item.size}</td>
                    <td>{((Constants.sales_tax/100)*item.after_customization_product_price).toFixed(2)}</td>
                    <td className={styles.subtotal}>
                      {item.total_amount}
                    </td>
                  </tr>
                ))}
              </tbody>
    
            </table>
          </section>
          <div className={styles.section3}>
            <section className={styles.paymentInstructions}>
             
                <h3>Payment Instruction :</h3>
             
                <span> {
                  order?.paypal_order_id &&
                  order?.paypal_order_id?.trim()?.length>0 ?
                  "PayPal":
                  "Stripe"}
                </span>
        
                <section className={styles.notes}>
                  <h3>Notes :</h3>
                  <div>Thank you for Shopping.</div>
                </section>
             
              </section>
              {orderDetail?.map((item, index) => (
              <section className={styles.invoiceSummary}>
                <div className={styles.summaryDetails}>
                  {item.refund_amount >0?
                  <div className={styles.field}>
                    <div className={styles.label}>Refund Amount: </div>
                    <div className={styles.value}>${item.refund_amount}</div>
                  </div>:null}
                  </div>
                  <div className={styles.summaryDetails}>
                  {item.to_pay >0?
                  <div className={styles.field}>
                    <div className={styles.label}>Payable Amount: </div>
                    <div className={styles.value}>${item.to_pay}</div>
                  </div>:null}
                  </div>
                  <div className={styles.summaryDetails}>
                  {item.to_pay ==null && item.refund_amount==null?
                  <div className={styles.field}>
                    <div className={styles.label}>Net Amount: </div>
                    <div className={styles.value}>$0</div>
                  </div>:null}
                  </div>
              
              </section>
              ))}
                  
                
                  
                
                  
               
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
      {/**End of code addition by Unnati on 05-08-2024
       *Reason-To add reactToPrint component*/}
    </>
  );
};

export default ExchangeInvoice;
/*End of code addition by Unnati on 22-12-2024
 * Reason-To have  exchange invoice page
 */
