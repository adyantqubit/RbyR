/**Code added by Unnati on 07-11-2024
 * Reason-To have credit note page
 */

import React, { useRef, useEffect, useContext, useState } from "react";
import styles from "./CreditNote.module.css";
import { useNavigate,useLocation } from "react-router-dom";
import ReactToPrint from "react-to-print";
import config from "../../Api/config";
import { GlobalContext } from "../../context/Context";
import { DateFormatter } from "../../utils/DateFormat";
import { useParams } from "react-router-dom";
import { getCreditNote,  getOrderDetail,} from "../../Api/services";
import Constants from "../../constants/Constants";
const CreditNote = () => {
  const { id } = useParams();
  const { settingInfo } = useContext(GlobalContext);
  const [Order, setOrder] = useState("");
  const orderDetail = Order ? Order.orderItems : [];
  const order = Order ? Order.orderSummary : {};
  const companyInfo = Order ? Order.companyInfo[0] : {};
  const shippingAddress = Order ? Order.shippingAddress : {};
  const billingAddress = Order ? Order.billingAddress : {};
  const { user } = useContext(GlobalContext);
  /**Code added by Unnati on 27-12-2024
   * Reason-To get item from order detail page
   */
  const location = useLocation();
  const item=location.state
   /**End of code addition by Unnati on 27-12-2024
   * Reason-To get item from order detail page
   */
  /**Code added by Unnati on 07-11-2024
   * Reason-Using useRef
   */
  let componentRef = useRef();
  /**End of code addition by Unnati on 07-11-2024
   * Reason-Using useRef
   */
  /* Added by Unnati on 07-11-2024
  Reason - Fetching creditNote details when component loads*/
  useEffect(() => {
    const fetchCreditNote = async () => {
      try {
        /**Code modified by Unnati on 27-12-2024
         * Reason-Added parameters in getCreditNote
         */
        const response = await getCreditNote(id, user.id,item.item.type,item.item.order);
        /**End of code addition by Unnati on 27-12-2024
         * Reason-Added parameters in getCreditNote
         */
        setOrder(response);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      }
    };
    fetchCreditNote();
  }, [id, user.id]);
  /* End of code addition on 07-11-2024
  Reason - Fetching creditNote details when component loads*/
  /**Code added by Unnati on 10-01-2025
   * Reason-Added get credit note
   */
  useEffect(()=>{
   getCreditNote(id, user.id,item.item.type,item.item.order);
  },[])
   /**End of code addition by Unnati on 10-01-2025
   * Reason-Added get credit note
   */
  /**Code commented by Unnati on 10-01-2025
   * Reason-this code is not in use
   */
  // const navigate = useNavigate();

  // useEffect(() => {
  //   window.history.pushState(null, "", window.location.href);
  //   const handlePopState = (event) => {
  //     event.preventDefault();
  //     navigate("/");
  //   };

  //   window.addEventListener("popstate", handlePopState);

  //   return () => {
  //     window.removeEventListener("popstate", handlePopState);
  //   };
  // }, [navigate]);
  /**End of code addition by Unnati on 10-01-2025
   * Reason-this code is not in use
   */
  /**Code added by Unnati on 07-11-2024
   * Reason-Calculating subtotal,tax amount and total
   */
  const subtotal = orderDetail.reduce(
    (acc, item) => acc + (Number(item.amount) || 0),
    0
  );
  /**Code modified by Unnati on 25-11-2024
   * Reason-Modified tax rate
   */
  // const taxRate = 0.05;
  const taxRate= Constants.sales_tax/100
      console.log("sales",taxRate)
  /**End of code addition by Unnati on 25-11-2024
   * Reason-Modified tax rate
   */
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;
  /**End of code addition by Unnati on 07-11-2024
   * Reason-Calculating subtotal,tax amount and total
   */
  /**Added by Unnati on 18-11-2024
   * Reason-Added creditNoteRefs
   */
  const creditNoteRefs = useRef([]);
  /**End of code addition by Unnati on 18-11-2024
   * Reason-Added creditNoteRefs
   */
  return (
    <>
      {/**Code added by Unnati on 18-11-2024
       *Reason-Modified credit note and displaying each item credit note individually */}
      <div>
        {orderDetail.map((item, index) => {
          const subtotal = Number(item.amount) || 0;
          const taxAmount = subtotal * taxRate;
          const total = subtotal + taxAmount;

          return (
            <div key={item.id} className={styles.creditNoteContainer}>
              <div
                className={styles.invoiceContainer}
                ref={(el) => (creditNoteRefs.current[index] = el)}
              >
                <header className={styles.invoiceHeader}>
                  <div className={styles.logo}>
                    <img
                      src={`${config.baseURL}${settingInfo.logo}`}
                      alt="Logo"
                    />
                  </div>
                  <div className={styles.invoiceTitle}>
                  <h1>{companyInfo?.name}</h1>
                  <div className={styles.invoiceDetails}>
                    <div>Order Id: {order.order_id || "N/A"}</div>
                    <div>
                      Credit Note Number: {item.credit_note_number || "N/A"}
                    </div>
                    <div>
                      Credit Note Date:{" "}
                      {/* Modified by - Ashish Dewangan on 24-11-2024
                      * Reason - To show refund date as credit note date  */}
                      {/* {DateFormatter(item.cancelled_at) || "N/A"} */}
                      {DateFormatter(item.refund_date) || "N/A"}
                      {/* End of modificatin by - Ashish Dewangan on 24-11-2024
                      * Reason - To show refund date as credit note date  */}
                    </div>
                    </div>
                  </div>
                </header>
                <section className={styles.addressDetails}>
                  <div className={styles.from}>
                    <h2>From</h2>
                    <div>{companyInfo?.name}</div>
                    <div>{companyInfo?.email}</div>
                    <div>{companyInfo?.contact_number}</div>
                    <div>{companyInfo?.address}</div>
                    <div>{companyInfo?.pincode}</div>
                  </div>

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
              {/**Code added by Unnati on 23-11-2024
              *Reason-Added ship to  */}
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
            {/**End of code addition by Unnati on 23-11-2024
              *Reason-Added ship to  */}
                </section>
                <section className={styles.invoiceTable}>
                  <table>
                    <thead>
                      <tr>
                        {/* Modified by - Ashish Dewangan on 25-11-2024
                        * Reason - To show more fields and rearranged them */}
                        {/* <th>Product Name</th>
                        <th>Rate($)</th>
                        <th>QTY</th>
                        <th>Size</th>
                        <th>Amount($)</th>
                         */}

                        <th>Product Name</th>
                        <th>Size</th>
                        <th>Rate($)</th>
                        {/* <th>QTY</th> */}
                        <th>Tax($)</th>
                        <th>Amount($)</th>
                        {/**Code modified by Unnati on 28-12-2024
                        *Reason-Added subtotal column also and rearranged qty column */}
                        <th>QTY</th>
                        <th>Subtotal</th>
                        {/**End of code modification by Unnati on 28-12-2024
                        *Reason-Added subtotal column also and rearranged qty column */}
                        <th>Restocking Fee($)</th>
                        <th>Credit Amount($)</th>
                        {/* End of modification by - Ashish Dewangan on 25-11-2024
                        * Reason - To show more fields and rearranged them */}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {/* Modified by - Ashish Dewangan on 25-11-2024
                        * Reason - To show more fields and rearranged them */}
                        {/* <td>{item.product_name}</td>
                        <td className={styles.rate}>-${item.sales_rate}</td>
                        <td className={styles.quantity}>{item.quantity}</td>
                        <td className={styles.size}>{item.size}</td>
                        <td className={styles.subtotal}>-${item.amount}</td>
                         */}

                        <td>{item.product_name}</td>
                        <td className={styles.size}>{item.size}</td>
                        <td className={styles.rate}>${item.sales_rate}</td>
                        {/* <td className={styles.quantity}>{item.quantity}</td> */}
                        <td className={styles.rate}>${taxAmount.toFixed(2)}</td>
                        <td className={styles.subtotal}>${total.toFixed(2)}</td>
                        {/**Code modified by Unnati on 28-12-2024
                        *Reason-Added subtotal column also and rearranged qty column */}
                        <td className={styles.quantity}>{item.quantity}</td>
                        <td className={styles.subtotal}>{total.toFixed(2)*item.quantity}</td>
                        {/**End of code modification by Unnati on 28-12-2024
                        *Reason-Added subtotal column also and rearranged qty column */}
                        {/* Modified by - Ashish Dewangan on 29-11-2024
                        * Reason - Amount was being shown in negative if restocking fee was not added */}
                        {/* <td className={styles.subtotal}>-${item.restocking_fee}</td> */}
                        {item.restocking_fee?
                        <td className={styles.subtotal}>-${item.restocking_fee}</td>
                        :
                        <td className={styles.subtotal} style={{textAlign:"center"}}>-</td>
                        }
                        {/* End of modification by - Ashish Dewangan on 29-11-2024
                        * Reason - Amount was being shown in negative if restocking fee was not added */}
                        {/* Added by - Ashlekh on 13-12-2024
                        Reason - To check null condition in amount. If no amount is present then to display - */}
                        {item.refund_amount != null ? (
                        // End of code - Ashlekh on 13-12-2024
                        // Reason - To check null condition in amount. If no amount is present then to display -
                          <td className={styles.subtotal}>${item.refund_amount}</td>
                        // Added by - Ashlekh on 13-12-2024
                        // Reason - To check null condition in amount. If no amount is present then to display "-"
                        ) : (<td className={styles.subtotal}>-</td>)}
                        {/* End of code - Ashlekh on 13-12-2024
                        Reason - To check null condition in amount. If no amount is present then to display "-" */}
                        {/* End of modification by - Ashish Dewangan on 25-11-2024
                        * Reason - To show more fields and rearranged them */}
                      </tr>
                    </tbody>
                  </table>
                </section>
                {/* Commented by - Ashish Dewangan on 25-11-2024
                * Reason - No need to show this section */}
                {/* <section className={styles.invoiceSummary}>
                  <div className={styles.summaryDetails}>
                    <div className={styles.field}>
                      <div className={styles.label}>Subtotal:</div>
                      <div className={styles.value}>
                        -${subtotal.toFixed(2)}
                      </div>
                    </div>
                    <div className={styles.field}>
                      <div className={styles.label}>Tax (5%):</div>
                      <div className={styles.value}>
                        -${taxAmount.toFixed(2)}
                      </div>
                    </div>
                    <div className={styles.field}>
                      <div className={styles.label}>Total:</div>
                      <div className={styles.value}>-${total.toFixed(2)}</div>
                    </div>
                  </div>
                </section> */}
                {/* End of comment by - Ashish Dewangan on 25-11-2024
                * Reason - No need to show this section */}
              </div>
              <div className={styles.buttonContainer}>
                <ReactToPrint
                  trigger={() => (
                    <button className={styles.printButton} type="button">
                      Print
                    </button>
                  )}
                  content={() => creditNoteRefs.current[index]}
                />
              </div>
            </div>
          );
        })}
      </div>
      {/**End of code addition by Unnati on 18-11-2024
       *Reason-Modified credit note and displaying each item credit note individually */}
    </>
  );
};

export default CreditNote;
/**End of code addition by Unnati on 08-11-2024
 * Reason-To have credit note page
 */
