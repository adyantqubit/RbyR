import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../api/config";
import { CartState } from "../../context";
import { afterColumnTotalOfferAdd } from "../../Redux-manage/services/billing";
import { SizeGetter } from "../global/getSize";
import styles from "./order.module.css";

const ProductListing = () => {
  const {
    userdata,
    checkoutDetails,
    setCheckoutDetails,
    cart,
    currency,
    offer,
    setOffer,
    taxRate,
    setTaxRate,
  } = CartState();
  const getTotalPrice = () => {
    var p = 0;
    cart.map((c) => (p += c.price * c.quantity));
    return p;
  };

  const nav = useNavigate();

  useEffect(() => {
    /**
     * Commented by - Ashish Dewangan on 07-12-2023
     * Reason - This code is not required because coupon discount functionality is not used
     */
    // if (typeof checkoutDetails.CouponDiscount != "undefined") {
    // } else nav("/cart");
    /**
     * End of code modification by - Ashish Dewangan on 07-12-2023
     * Reason - This code is not required because coupon discount functionality is not used
     */
  }, []);

  return (
    <div className={styles.column2}>
      <div className={styles.listHead}>
        <div className={styles.columnitem1head}>ORDER SUMMARY</div>
        <hr style={{ color: "black" }}></hr>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className={styles.sub}>Subtotal</div>
          <div className={styles.sub}>
            
            {currency.sign}
            {/* Modification and addition by Om Shrivastava on 15-12-23
            Reason : When subtotal is not present then show only 0  */}
            {/* { afterColumnTotalOfferAdd(offer, cart, taxRate).subtotal *
              currency.value ? (
              afterColumnTotalOfferAdd(offer, cart, taxRate).subtotal *
              currency.value
            ).toFixed(2) */}
           {(
                      afterColumnTotalOfferAdd(offer, cart, taxRate).subtotal *
                      currency.value
                    ).toLocaleString("en-IN")}
            {/*End of modification and addition by Om Shrivastava on 15-12-23
            Reason : When subtotal is not present then show only 0  */}
          </div>
        </div>
        {(afterColumnTotalOfferAdd(offer, cart, taxRate).shipping)!=0 ? 

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "8px",
          }}
        >

          <div className={styles.sub}>Shipping Charges</div>
          <div className={styles.sub}>
            {currency.sign}
             {/* Modification and addition by Om Shrivastava on 15-12-23
            Reason : When subtotal is not present then show only 0  */}
            {afterColumnTotalOfferAdd(offer, cart, taxRate).subtotal *
              currency.value?
            (
              afterColumnTotalOfferAdd(offer, cart, taxRate).shipping *
              currency.value
            ).toFixed(2):'0'}
             {/* End of modification and addition by Om Shrivastava on 15-12-23
            Reason : When subtotal is not present then show only 0  */}
          </div>
        </div>
        :null}
        {/* <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
          <div className={styles.sub}>GST Charges</div>
          <div className={styles.sub}>{currency.sign}{(afterColumnTotalOfferAdd(offer, cart, taxRate).tax * currency.value).toFixed(2)}</div>
        </div> */}
        {/* Commented by - Ashish on 15-02-2023
        Reason - To hide coupen/promocode */}
        {/* <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
          <div className={styles.sub}>Offer Discount</div>
          <div className={styles.sub}>{currency.sign}{(afterColumnTotalOfferAdd(offer, cart, taxRate).coupon * currency.value).toFixed(2)}</div>
        </div> */}
        {/* ENd of comment */}
        <hr style={{ color: "black" }}></hr>
        <div
          style={{
            marginTop: "-5px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div className={styles.columnitem1head} style={{ marginTop: "-5px",fontWeight:'600' }}>
            Total
          </div>
          <div className={styles.columnitem1head} style={{ marginTop: "-5px",fontWeight:'600' }}>
            {currency.sign}
            {/* Modification and addition by Om Shrivastava on 15-12-23
            Reason : When subtotal is not present then show only 0  */}
            {/* {afterColumnTotalOfferAdd(offer, cart, taxRate).subtotal *
              currency.value?
            (
              afterColumnTotalOfferAdd(offer, cart, taxRate).Grand *
              currency.value
            ).toFixed(2):'0'} */}
            {(
                  afterColumnTotalOfferAdd(offer, cart, taxRate).Grand *
                  currency.value
                ).toLocaleString("en-IN")}
            
            {/* End of modification and addition by Om Shrivastava on 15-12-23
            Reason : When subtotal is not present then show only 0  */}
          </div>
        </div>
        <hr style={{ color: "black" }}></hr>

        <div className={styles.columnitem1head}>
          TOTAL ITEMS ({cart.length})
        </div>
        {/* Addition by Om Shrivastava on 22-11-23
        Reason : Add the div for the set the image width and height */}
        <div className={styles.productData} >

        {cart.map((c) => (
            <div
              className={styles.cartBox}
              // style={{ border: "2px solid black" }}
            >
              <img
                src={config.staticBaseURL + c.img_main}
                // Modification and addition by Om Shrivastava on 30-11-23
                // Reason : Add new class name
                // className={styles.img}
                className={styles.listedImage}
                // End of Modification and addition by Om Shrivastava on 30-11-23
                // Reason : Add new class name
                // Added by Om Shrivastava on 22-11-23
                // Reason : Apply the onlcick for navigation
                style={{cursor:'pointer'}}
                onClick={e => {  nav(`/listing/${c.menu}/${c.category}/detail/${c.id}`) }}
                // End of code Added by Om Shrivastava on 22-11-23
                // Reason : Apply the onlcick for navigation
              ></img>
              <div className={styles.productInfo}>
                <span className={styles.titlepro}>
                  {/* Modification and addition by Om Shrivastava on 02-12-23
                  Reason : Set the lowercase of the font  */}
                  {/* {c.title} */}
                  {c.title.toLowerCase()}
                  {/* End of  Modification and addition by Om Shrivastava on 02-12-23
                  Reason : Set the lowercase of the font  */}
                  </span>
                <span
                  className={styles.userinfoText}
                  style={{ color: "black" }}
                >
                   {/* Modification and addition by Om Shrivastava on 18-06-2024
                      Reason : Remove the commas and decimal value  */}
                  {/* {(c.price * currency.value).toFixed(2)} */}
                  {/* Modification and addition by Om Shrivastava on 20-06-2024
                            Reason : Show the discountant amount which product on_sale  */}
                  {/* {(c.price * currency.value).toLocaleString("en-IN")} */}

                            {c.is_sale == true ? (
                              <>
                                <strike>
                                  {" "}
                                  {currency.sign}{" "}
                                  {(c.price * currency.value).toLocaleString(
                                    "en-IN"
                                  )}
                                </strike>
                                <div>
                                  {" "}
                                  {currency.sign}{" "}
                                  {(
                                    c.price *
                                    (1 - c.sale_discount_percentage / 100) *
                                    currency.value
                                  ).toLocaleString("en-IN")}
                                </div>
                              </>
                            ) : (
                              <>
                                {currency.sign}{" "}
                                {(c.price * currency.value).toLocaleString(
                                  "en-IN"
                                )}
                              </>
                            )}
                            {/* End of Modification and addition by Om Shrivastava on 20-06-2024
                            Reason : Show the discountant amount which product on_sale  */}
                   {/* Modification and addition by Om Shrivastava on 18-06-2024
                      Reason : Remove the commas and decimal value  */}

                </span>
                <div>
                  <span className={styles.userinfoText}>Qty:</span>
                  <span className={styles.userinfoText2}> {c.quantity}</span>
                </div>
                <div>
                  <span className={styles.userinfoText}>Size:</span>
                  <span className={styles.userinfoText2}>
                    {" "}
                    {SizeGetter(c.size)}
                  </span>
                </div>
              </div>

            </div>
        ))}
        </div>
        {/* Addition by Om Shrivastava on 22-11-23
        Reason : Add the div for the set the image width and height */}
      </div>
    </div>
  );
};

export default ProductListing;
