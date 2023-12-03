import React, { useEffect, useState, useRef } from "react";
import { MdStackedLineChart } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import config from "../../api/config";
import {
  cartDeleteApi,
  getQrDetailApi,
  getStoreLocatorDetail,
} from "../../api/service";
import { CartState } from "../../context";
import {
  afterColumnTotalOfferAdd,
  toWords,
  toWorduS,
} from "../../Redux-manage/services/billing";
import { getToken } from "../../Redux-manage/services/localStorageService";
import Navbar from "../global/NavHeader";
import styles from "./billing.module.css";
import style from "../global/cartCard.module.css";
import ReactToPrint from "react-to-print";
import parse from "html-react-parser";
import Footer from "../global/footer";
import Below from "../global/below";
import { Button, notification } from "antd";
import { SizeGetter } from "../global/getSize";

const Billing = () => {
  notification.destroy();
  var {
    userdata,
    checkoutDetails,
    setCheckoutDetails,
    cart,
    setCart,
    currency,
    offer,
    setOffer,
    taxRate,
    setTaxRate,
  } = CartState();
  const nav = useNavigate();
  var [cond, setCon] = useState(false);
  var [onlineDetail, setonlineDetail] = useState({});
  const componentRef = useRef();

  const [storeLocatorDetails, setStoreLocator] = useState(null);
  useEffect(() => {
    getStoreLocator();
    checkoutDetails = JSON.parse(sessionStorage.getItem("checkoutDetails"));
    setCheckoutDetails(checkoutDetails);
    setOffer({
      discount_percentage: 0,
      maximum_discount_price: 1000,
      expiry_date: "2022-11-30",
    });

    window.scrollTo(0, 0);
  }, []);

  const getStoreLocator = async () => {
    const storeLocatorData = await getStoreLocatorDetail();
    if (storeLocatorData) {
      setStoreLocator(storeLocatorData);
    }
  };

  // useEffect(()=>{
  // //   checkoutDetails=JSON.parse(sessionStorage.getItem('checkoutDetails'))
  // //   setCheckoutDetails(checkoutDetails)
  // //   console.log(JSON.parse(sessionStorage.getItem('checkoutDetails')))

  // },[])

  const getTotalPrice = (cart2) => {
    var p = 0;
    cart2.map((c) => (p += c.price * c.quantity));
    return p;
  };

  const alertUser = (e) => {
    e.preventDefault();
    nav("/");
    e.returnValue = "";
  };

  useEffect(() => {
    qrDetails();

    window.onpopstate = (e) => {
      nav("/");
    };

    // if(cart&&cart.length==0)
    //   nav("/")
  }, []);

  async function qrDetails() {
    await getQrDetailApi().then((r) => {
      try {
        const data = {
          name: r.name,
          account_number: r.account_number,
          bank_name: r.bank_name,
          qr_img: r.qr_img,
          upi_id: r.upi_id,
          // Added by Om Shrivastava on 08-11-23
          // Reason : Set the contact number
          contact_number: r.contact_number,
          // End of Added by Om Shrivastava on 08-11-23
          // Reason : Set the contact number
        };
        setonlineDetail(data);
      } catch {
        setonlineDetail(null);
      }
    });
  }

  console.log(onlineDetail);

  // Added by Ashish Dewangan on 11-12-2022
  // Reason - To navigate to homepage when we click on continue shopping
  const goToHomePage = () => {
    nav("/");
  };
  // End of comment
  return (
    <>
      <Navbar />
      <div className={styles.container} id="scrolled">
        <div className={styles.main}>
          {checkoutDetails.payment == "onlinepay" ? (
            onlineDetail != null ? (
              <div
                className={styles.payBox}
                style={{
                  backgroundColor: "rgb(243 243 243)",
                  height: "160px",
                  marginTop: "2px",
                  border: "1px solid black",
                }}
              >
                <img
                  src={config.staticBaseURL + onlineDetail.qr_img}
                  className={styles.img}
                  style={{ border: "1px solid black" }}
                />

                <div className={styles.payTitle}>
                  <div>
                    {/* <div ><span className={styles.userinfoText}>Name:</span><span className={styles.userinfoText2} >{onlineDetail.name}</span ></div>
                    <div ><span className={styles.userinfoText}>Bank Name:</span><span className={styles.userinfoText2}>{onlineDetail.bank_name}</span></div>
                    <div ><span className={styles.userinfoText}>Account Number:</span><span className={styles.userinfoText2}>{onlineDetail.account_number}</span></div>
                    <div ><span className={styles.userinfoText}>UPI ID:</span><span className={styles.userinfoText2}>{onlineDetail.upi_id}</span></div> */}
                    {/* <div style={{fontSize:'14px',color:'blue',marginLeft:'-5px'}} className={styles.payTitle}>Account Details : </div> */}
                    <div style={{ paddingTop: "3px" }}>
                      <span
                        style={{ fontSize: "12px", fontWeight: "bold" }}
                        className={styles.userinfoText2}
                      >
                        {onlineDetail.bank_name}
                      </span>
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          letterSpacing: "0.5px",
                        }}
                        className={styles.userinfoText}
                      >
                        Name &nbsp;&nbsp;:{" "}
                      </span>
                      <span
                        style={{ fontSize: "12px" }}
                        className={styles.userinfoText2}
                      >
                        {onlineDetail.name}
                      </span>
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          letterSpacing: "0.5px",
                        }}
                        className={styles.userinfoText}
                      >
                        A/C No &nbsp;:{" "}
                      </span>
                      <span
                        style={{ fontSize: "12px" }}
                        className={styles.userinfoText2}
                      >
                        {onlineDetail.account_number}
                      </span>
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          letterSpacing: "0.5px",
                        }}
                        className={styles.userinfoText}
                      >
                        UPI ID&nbsp;:{" "}
                      </span>
                      <span
                        style={{ fontSize: "12px" }}
                        className={styles.userinfoText2}
                      >
                        {onlineDetail.upi_id}
                      </span>
                    </div>
                    {/* Addition by Om Shrivastava on 02-12-23
                  Reason : Set the design of the phone label */}
                    <div>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          letterSpacing: "0.5px",
                        }}
                        className={styles.userinfoText}
                      >
                        Phone&nbsp;:{" "}
                      </span>
                      <span
                        style={{ fontSize: "12px" }}
                        className={styles.userinfoText2}
                      >
                        {onlineDetail.contact_number}
                      </span>
                    </div>
                    {/* End of addition by Om Shrivastava on 02-12-23
                  Reason : Set the design of the phone label */}
                  </div>
                  {/* Modification and addition by Om Shrivastava on 08-11-23
                  Reason : Set the contact number of payment time */}
                  {/* <div style={{ height: "60px", width: "100%" }}><span className={styles.userinfoText2} style={{ lineBreak: "normal", wordBreak: 'keep-all' }}> Please Confirm To Admin After Paying At {storeLocatorDetails != null ? parse("PHONE:" + storeLocatorDetails[0]?.phoneNumber) : null}</span></div> */}
                  {/* <div style={{ height: "60px", width: "100%",paddingTop:'2px' }}><span className={styles.userinfoText2} style={{ lineBreak: "normal", wordBreak: 'keep-all',fontSize:'11px' }}> Please Confirm To Admin After Paying At <b>phone:</b>{onlineDetail.contact_number}</span></div> */}
                  <div
                    style={{
                      height: "60px",
                      width: "100%",
                      paddingBottom: "2px",
                    }}
                  >
                    <span
                      className={styles.userinfoText2}
                      style={{
                        lineBreak: "normal",
                        wordBreak: "keep-all",
                        fontSize: "11px",
                      }}
                    >
                      {" "}
                      Please Confirm To Admin After Paying{" "}
                    </span>
                  </div>

                  {/* End of Modification and addition by Om Shrivastava on 08-11-23
                  Reason : Set the contact number of payment time  */}
                </div>
              </div>
            ) : (
              <div>The qr Code getting error</div>
            )
          ) : null}
        </div>
        {/* <ReactToPrint
        trigger={() =><div style={{width:"100%",display:"flex",justifyContent:"center",background:"#f2f2f2"}}> <button className={style.shopbtn1} style={{width:"50%"}} onClick={e=>nav('/')}>Print this out</button> </div>}     
        content={() => componentRef.current}
        
      /> */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
          }}
        >
          <button
            className={style.shopbtn1}
            style={{ width: "50%" }}
            onClick={(e) => window.print()}
          >
            Print this out
          </button>
        </div>
        <div className={styles.main} id="main">
          {checkoutDetails.userInfo ? (
            <div className={styles.invoice} id="invoice">
              <div
                id="section-to-print"
                // ref={componentRef}
              >
                <div className={styles.head}>
                  <div className={styles.headIn}>INVOICE</div>
                </div>

                <div className={styles.header} id="header">
                  <div className={styles.headerTexts}>
                    <div className={styles.columnitem1head}>BILLING TO</div>
                    <hr style={{ color: "black" }}></hr>
                    <div>
                      <span className={styles.userinfoText2}>
                        {" "}
                        {checkoutDetails.billingData.firstname}{" "}
                        {checkoutDetails.billingData.lastname}
                      </span>
                    </div>
                    <div>
                      <span className={styles.userinfoText2}>
                        {" "}
                        {checkoutDetails.billingData.street},{" "}
                        {checkoutDetails.billingData.houseno}
                      </span>
                      <span className={styles.userinfoText2}>
                        {" "}
                        {checkoutDetails.billingData.city},{" "}
                      </span>
                    </div>
                    <div>
                      <span className={styles.userinfoText2}>
                        {" "}
                        {checkoutDetails.billingData.state},{" "}
                      </span>
                      <span className={styles.userinfoText2}>
                        {" "}
                        {checkoutDetails.billingData.country},{" "}
                      </span>
                    </div>
                    <div>
                      <span className={styles.userinfoText2}>
                        {" "}
                        {checkoutDetails.billingData.number}
                      </span>
                    </div>
                  </div>

                  <div className={styles.headerTexts}>
                    <div className={styles.columnitem1head}>
                      BILLING DETAILS
                    </div>
                    <hr style={{ color: "black" }}></hr>
                    <div>
                      <span className={styles.userinfoText2}>
                        {" "}
                        Invoice Date:{" "}
                      </span>
                      <span className={styles.userinfoText2}>
                        {checkoutDetails.date.split("-").reverse().join("-")}
                      </span>
                    </div>
                    <div>
                      <span className={styles.userinfoText2}>Order No:</span>
                      <span className={styles.userinfoText2}>
                        {checkoutDetails.orderno}
                      </span>
                    </div>
                    <div>
                      <span
                        className={styles.userinfoText2}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Payment Mode:
                      </span>
                      <span
                        className={styles.userinfoText2}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {checkoutDetails.payment
                          .split("p")
                          .join(" p")
                          .toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Commented and modified by - Ashish Dewangan on 27-11-2023
                Reason - TO hide vendor details and arrange shipping details on same line  */}
                  {/* {storeLocatorDetails != null ?
                  <div className={styles.headerTexts}>
                    <div className={styles.columnitem1head}>VENDOR DETAILS</div>
                    <hr style={{ color: "black" }}></hr>
                    
                    <div className={styles.userinfoText2}>{parse("" + storeLocatorDetails[0]?.address)}</div>
                    <div><span className={styles.userinfoText2}>{parse("PHONE:" + storeLocatorDetails[0]?.phoneNumber)}</span></div>
                    <div><span className={styles.userinfoText2}>{parse("" + storeLocatorDetails[0]?.email)}</span></div>
                  
                  </div> 
                  : null} */}

                  {storeLocatorDetails != null ? (
                    <div className={styles.headerTexts}>
                      <div className={styles.columnitem1head}>SHIPPING TO</div>
                      <hr style={{ color: "black" }}></hr>

                      <div className={styles.userinfoText2}>
                        {checkoutDetails.shippingData.firstname}{" "}
                        {checkoutDetails.shippingData.lastname},{" "}
                        {checkoutDetails.shippingData.street}{" "}
                        {checkoutDetails.shippingData.houseno},{" "}
                        {checkoutDetails.shippingData.city} -
                        {checkoutDetails.shippingData.zipcode},{" "}
                        {checkoutDetails.shippingData.state}{" "}
                        {checkoutDetails.shippingData.country},{" "}
                        {checkoutDetails.shippingData.number}
                      </div>
                    </div>
                  ) : null}
                  {/* End of comment and modified by - Ashish Dewangan on 27-11-2023
                Reason - TO hide vendor details and arrange shipping details on same line  */}
                </div>

                {/* Commented by - Ashish Dewangan on 27-11-2023
              Reason - To rearrange shipping details */}
                {/* <div className={styles.shippingDetail}>
                <span className={styles.columnitem1head}>
                  SHIPPING TO
                </span>
                <hr style={{ color: "black" }}></hr>
                <span className={styles.userinfoText2}>{checkoutDetails.shippingData.firstname} {checkoutDetails.shippingData.lastname}, {checkoutDetails.shippingData.street} {checkoutDetails.shippingData.houseno}, {checkoutDetails.shippingData.city} -{checkoutDetails.shippingData.zipcode}, {checkoutDetails.shippingData.state} {checkoutDetails.shippingData.country}, {checkoutDetails.shippingData.number}
                </span>
              </div> */}
                {/* End of comment by - Ashish Dewangan on 27-11-2023
              Reason - To rearrange shipping details */}

                <div className={styles.billingmain}>
                  <div className={styles.billingheader} id="footer">
                    <span
                      className={`${styles.columnitem1head} ${styles.header1}`}
                    >
                      {" "}
                      Item Description
                    </span>
                    <span
                      className={`${styles.columnitem1head} ${styles.header2} ${styles.show}`}
                      id="show"
                      style={{ textAlign: "center" }}
                    >
                      {" "}
                      Quantity
                    </span>
                    <span
                      className={`${styles.columnitem1head} ${styles.header2} ${styles.show2}`}
                      id="show2"
                      style={{ textAlign: "center" }}
                    >
                      {" "}
                      Qty
                    </span>
                    <span
                      className={`${styles.columnitem1head} ${styles.header2}`}
                    >
                      {" "}
                      Price
                    </span>
                    <span
                      className={`${styles.columnitem1head} ${styles.header2}`}
                      style={{ border: "none", outline: "none" }}
                    >
                      Total
                    </span>
                  </div>
                  {/* Commented and modified by - Ashish Dewangan on 27-11-2023
                Reason - To show items from purchased items table instead of  items tables */}
                  {/* {checkoutDetails.cart.map(c =>
                  <div className={styles.billingheader2} id="footer" style={{ marginTop: "5px", background: "var(--backgroundColorSecondary)" }}>
                    <span className={styles.protitle} > {c.title} ({SizeGetter(c.size)})</span>
                    <span className={`${styles.protitle2} ${styles.show}`} > {c.quantity}</span>
                    <span className={`${styles.protitle2} ${styles.show2}`} > {c.quantity}</span>
                    <span className={styles.protitle2} >{checkoutDetails.currency_sign}{(c.price * checkoutDetails.currency_value).toFixed(2)}</span>
                    <span className={styles.protitle2} style={{ paddingLeft: "5px", border: "none", outline: "none" }}> {checkoutDetails.currency_sign} {(c.price * c.quantity * checkoutDetails.currency_value).toFixed(2)}</span>
                  </div>
                )} */}
                  {checkoutDetails.purchased_products_list.map((c) => (
                    <div
                      className={styles.billingheader2}
                      id="footer"
                      style={{
                        marginTop: "5px",
                        background: "var(--backgroundColorSecondary)",
                      }}
                    >
                      {/* Commented and modified by - Ashish Dewangan on 29-11-2023
                    Reason - To show product name which was at the time of purchase */}
                      {/* <span className={styles.protitle} > {c.title} ({SizeGetter(c.size)})</span> */}
                      <span className={styles.protitle}>
                        {" "}
                        {c.product_name.toLowerCase()} ({SizeGetter(c.size)})
                      </span>
                      {/* End of code modification by - Ashish Dewangan on 29-11-2023
                    Reason - To show product name which was at the time of purchase */}
                      <span className={`${styles.protitle2} ${styles.show}`}>
                        {" "}
                        {c.quantity}
                      </span>
                      <span className={`${styles.protitle2} ${styles.show2}`}>
                        {" "}
                        {c.quantity}
                      </span>
                      <span className={styles.protitle2}>
                        {checkoutDetails.currency_sign}
                        {(c.price * checkoutDetails.currency_value).toFixed(2)}
                      </span>
                      <span
                        className={styles.protitle2}
                        style={{
                          paddingLeft: "5px",
                          border: "none",
                          outline: "none",
                        }}
                      >
                        {" "}
                        {checkoutDetails.currency_sign}{" "}
                        {(
                          c.price *
                          c.quantity *
                          checkoutDetails.currency_value
                        ).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {/* End of code modification by - Ashish Dewangan on 27-11-2023
                Reason - To show items from purchased items table instead of  items tables */}

                  <div className={styles.billingfooter} id="footer">
                    <span className={`${styles.columnitem1head}`}>
                      Subtotal : &nbsp;{" "}
                    </span>
                    {/* Commented and modified by - Ashish Dewangan on 27-11-2023
                  Reason - To show details from purchased items tables rather than items table */}
                    {/* <span className={`${styles.columnitem1head} ${styles.header2}`} style={{ borderRight: "1px solid black", whiteSpace: "nowrap", border: "none", outline: "none", width: "auto" }}> {checkoutDetails.currency_sign}{(afterColumnTotalOfferAdd(offer, checkoutDetails.cart, taxRate).subtotal * checkoutDetails.currency_value).toFixed(2)}</span> */}
                    <span
                      className={`${styles.columnitem1head} ${styles.header2}`}
                      style={{
                        borderRight: "1px solid black",
                        whiteSpace: "nowrap",
                        border: "none",
                        outline: "none",
                        width: "auto",
                      }}
                    >
                      {" "}
                      {checkoutDetails.currency_sign}
                      {(
                        afterColumnTotalOfferAdd(
                          offer,
                          checkoutDetails.purchased_products_list,
                          taxRate
                        ).subtotal * checkoutDetails.currency_value
                      ).toFixed(2)}
                    </span>
                    {/* End of code modification by - Ashish Dewangan on 27-11-2023
                  Reason - To show details from purchased items tables rather than items table */}
                  </div>

                  <div className={styles.billingtexts}>
                    <span className={`${styles.columnitem1head}`}>
                      Shipping charges : &nbsp;{" "}
                    </span>
                    {/* Commented and modified by - Ashish Dewangan on 27-11-2023
                  Reason - To show details from purchased items tables rather than items table */}
                    {/* <span className={`${styles.columnitem1head} ${styles.header2}`} style={{ color: "black", width: "auto", border: "none", outline: "none" }} > {checkoutDetails.currency_sign}{(afterColumnTotalOfferAdd(offer, checkoutDetails.cart, taxRate).shipping * checkoutDetails.currency_value).toFixed(2)}</span> */}
                    <span
                      className={`${styles.columnitem1head} ${styles.header2}`}
                      style={{
                        color: "black",
                        width: "auto",
                        border: "none",
                        outline: "none",
                      }}
                    >
                      {" "}
                      {checkoutDetails.currency_sign}
                      {(
                        afterColumnTotalOfferAdd(
                          offer,
                          checkoutDetails.purchased_products_list,
                          taxRate
                        ).shipping * checkoutDetails.currency_value
                      ).toFixed(2)}
                    </span>
                    {/* End of code modification by - Ashish Dewangan on 27-11-2023
                  Reason - To show details from purchased items tables rather than items table */}
                  </div>
                  {/* <div className={styles.billingtexts}>
                  <span className={`${styles.columnitem1head}`}  >GST Charges : </span>
                  <span className={`${styles.columnitem1head} ${styles.header2}`} style={{ color: "black", whiteSpace: "nowrap", width: "auto", border: "none", outline: "none" }} > {checkoutDetails.currency_sign} {(afterColumnTotalOfferAdd(offer, checkoutDetails.cart, taxRate).tax * checkoutDetails.currency_value).toFixed(2)}</span>
                </div> */}
                  {/* Commented by - Ashish Dewangan on 15-02-2023
                Reason - To Hide offer/Coupon/promocode from bill */}
                  {/* <div className={styles.billingtexts}>
                  <span className={`${styles.columnitem1head}`}  >Discount -</span>
                  <span className={`${styles.columnitem1head} ${styles.header2}`} style={{ color: "black", width: "auto" }} > {checkoutDetails.currency_sign} {checkoutDetails.CouponDiscount ? (checkoutDetails.CouponDiscount* checkoutDetails.currency_value).toFixed(2) : (afterColumnTotalOfferAdd(offer, checkoutDetails.cart, taxRate).coupon * checkoutDetails.currency_value).toFixed(2)}</span>
                </div> */}
                  {/* End of comment */}
                  <div className={styles.billingtexts}>
                    <span
                      className={`${styles.columnitem1head}`}
                      style={{
                        color: "black",
                        borderBottom: "1px solid black",
                      }}
                    ></span>
                    <span
                      className={`${styles.columnitem1head} ${styles.header2}`}
                      style={{
                        color: "black",
                        borderBottom: "1px solid black",
                        width: "50%",
                      }}
                    ></span>
                  </div>

                  <div className={styles.billingtexts}>
                    <span className={`${styles.columnitem1head}`}>
                      Grand Total : &nbsp;
                    </span>
                    <span
                      className={`${styles.columnitem1head} ${styles.header2}`}
                      style={{
                        color: "black",
                        whiteSpace: "nowrap",
                        width: "auto",
                        border: "none",
                        outline: "none",
                      }}
                    >
                      {" "}
                      {checkoutDetails.currency_sign}
                      {/* {(afterColumnTotalOfferAdd(offer, checkoutDetails.cart, taxRate).Grand * checkoutDetails.currency_value).toFixed(2)} */}
                      {/* {checkoutDetails.CouponDiscount ?((afterColumnTotalOfferAdd(offer, checkoutDetails.cart, taxRate).Grand * checkoutDetails.currency_value)- (checkoutDetails.CouponDiscount* checkoutDetails.currency_value)).toFixed(2) :(afterColumnTotalOfferAdd(offer, checkoutDetails.cart, taxRate).Grand * checkoutDetails.currency_value).toFixed(2)} */}
                      {checkoutDetails.grand
                        ? (
                            checkoutDetails.grand *
                            checkoutDetails.currency_value
                          ).toFixed(2)
                        : afterColumnTotalOfferAdd(
                            offer,
                            checkoutDetails.cart,
                            taxRate
                          ).Grand}
                    </span>
                  </div>

                  <div
                    className={styles.billingtexts}
                    style={{ marginTop: "-10px" }}
                  >
                    {/* <span className={`${styles.columnitem1head}`}  ></span>  */}
                    <span
                      className={`${styles.columnitem1head} ${styles.header2}`}
                      style={{
                        color: "black",
                        width: "auto",
                        border: "none",
                        outline: "none",
                      }}
                    >
                      {`(`}{" "}
                      {checkoutDetails.currency_sign == "₹"
                        ? checkoutDetails.grand
                          ? toWords.convert(
                              (
                                checkoutDetails.grand *
                                checkoutDetails.currency_value
                              ).toFixed(2)
                            )
                          : toWords.convert(
                              afterColumnTotalOfferAdd(
                                offer,
                                checkoutDetails.cart,
                                taxRate
                              ).Grand
                            )
                        : checkoutDetails.grand
                        ? toWorduS.convert(
                            (
                              checkoutDetails.grand *
                              checkoutDetails.currency_value
                            ).toFixed(2)
                          )
                        : toWorduS.convert(
                            afterColumnTotalOfferAdd(
                              offer,
                              checkoutDetails.cart,
                              taxRate
                            ).Grand
                          )}
                      {` )`}
                    </span>
                  </div>

                  <div
                    className={styles.billingheader}
                    style={{ height: "30px" }}
                  ></div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* <div style={{width:"100%",display:"flex",justifyContent:"center",background:"#f2f2f2"}}> <button className={style.shopbtn1} style={{width:"50%"}} onClick={e=>nav('/')}>Continue Shopping</button> */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            paddingBottom: "50px",
          }}
        >
          <Button
            type="primary"
            className={styles.continueShopbtn}
            onClick={goToHomePage}
          >
            Continue Shopping
          </Button>
          {/* <div className={style.shopbtn1} style={{width:"50%"}} onClick={}></div> */}
        </div>

        <div className={styles.foot}>
          <Footer />
          {/* Commented by - Ashish Dewangan on 15-02-2023
          Reason - To hide the text that appear after footer */}
          {/* <Below /> */}
          {/* End of comment */}
        </div>
      </div>
    </>
  );
};

export default Billing;
