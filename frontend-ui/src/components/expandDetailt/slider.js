import React, { useState, useEffect } from "react";
import Carousel from "react-grid-carousel";
import "react-multi-carousel/lib/styles.css";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import config from "../../api/config";
import { CartState } from "../../context";

import style from "../listing/listpage.module.css";
import styles from "./slider.module.css";
import logo from "../../assets/photos/rts-icon.svg";

import "./recentViewSlider.css";

const Slider = ({ scrollTop }) => {
  const {
    CategoryProduct,
    con,
    setcon,
    currency,
    recentlyViewedItems,
    setRecentlyViewedItems,
    currentSelectedItem,
    setCurrentSelectedItem,
  } = CartState();
  const recentlyViews = [];

  /**
   * Commented by - Ashish Dewangan on 07-12-2023
   * Reason - Getting recently viewed data differently
   */
  // const [recentlyViewedProducts, setRecentlyViewedProducts] = useState([]);
  /**
   * End of code addition by - Ashish Dewangan on 07-12-2023
   * Reason - Getting recently viewed data differently
   */

  const { id } = useParams();

  /**
   * Commented by - Ashish Dewangan on 07-12-2023
   * Reason - Getting recently viewed data differently
   */
  // useEffect(() => {
  //   func();
  // }, []);
  // function func() {
  //   var storage = JSON.parse(localStorage.getItem("recentview"));
  //   if (storage && storage.length > 1) {
  //     for (var i = 0; i < storage.length; i++) {
  //       if (i > 0) recentlyViews.push(storage[i]);
  //     }
  //     setRecentlyViewedProducts(recentlyViews);

  //   }
  // }
  /**
   * End of code addition by - Ashish Dewangan on 07-12-2023
   * Reason - Getting recently viewed data differently
   */

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const nav = useNavigate();
  function openDetail(id) {
    // console.log(window)
    window.scrollTo({
      top: 0,
      behavior: "smooth",
      /* you can also use 'auto' behaviour
         in place of 'smooth' */
    });

    if (id.category.length != 0)
      nav(`/listing/${id.menu}/${id.category}/detail/${id.id}`);
    else nav(`/listing/${id.menu}/0/detail/${id.id}`);
  }

  return (
    <>
      {/* Commented and modified by - Ashish Dewangan on 07-12-2023
    Reason - mapping data from new array */}
      {/* {recentlyViewedProducts.length > 0 ? ( */}
      {/* Modified by - Ashish Dewangan on 15-12-2023
      Reason - To show recently viewed only if more than one item is displayed */}
      {/* {recentlyViewedItems.length > 0 ? ( */}
      {recentlyViewedItems.length > 1 ? (
        /* End of code modification by - Ashish Dewangan on 15-12-2023
      Reason - To show recently viewed only if more than one item is displayed */
        // Commented and modified by - Ashish Dewangan on 07-12-2023
        // Reason - mapping data from new array
        <div
          className={styles.sliderContainer}
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "0 8%",
            // Addition by Om Shrivastava on 25-11-23
            // Reason : Set the margin top
            marginTop: "18px",
            // End of addition by Om Shrivastava on 25-11-23
            // Reason : Set the margin top

            // Commented by Om Shrivastava on 25-11-23
            // Reason : Comment this code
            // marginBottom: "9vh"
            // End of commentd code by Om Shrivastava on 25-11-23
            // Reason : Comment this code
          }}
        >
          <div
            className={styles.header}
            style={{ textAlign: "center", fontWeight: "600" }}
          >
            RECENTLY VIEWED PRODUCTS
          </div>

          <Carousel cols={4} rows={1} gap={10} style={{ width: "100%" }}>
            {/* {JSON.parse(localStorage.getItem("recentview")) &&
          JSON.parse(localStorage.getItem("recentview")).length > 0 */}

            {/* Commented and modified by - Ashish Dewangan on 09-12-2023
          Reason - To sort recently viewed items according to their visited time */}
            {/* recentlyViewedProducts
                .map((cart) => { */}
            {[]
              .concat(recentlyViewedItems)
              .sort((a, b) => (a.timeOfView > b.timeOfView ? -1 : 1))
              .map((cart) => {
                {
                  /* End of code addition by - Ashish Dewangan on 09-12-2023
                  Reason - To sort recently viewed items according to their visited time */
                }

                return (
                  /**
                   * Added by - Ashish Dewangan on 15-12-2023
                   * Reason - To hide currently selected item from recently view
                   */
                  cart.id != currentSelectedItem?.id && (
                    /**
                     * End of code addition by - Ashish Dewangan on 15-12-2023
                     * Reason - To hide currently selected item from recently view
                     */
                    <Carousel.Item
                      style={{
                        cursor: "pointer",
                        padding: "5px auto",
                        border: "1px solid red",
                      }}
                    >
                      <div  style={{
                        // cursor: "pointer",
                        // padding: "5px auto",
                        // border: "1px solid red",
                        
                      }}
                      className={style.recentlyViewCard}
                      
                      >
                        <img
                          className={style.img12}
                          src={config.staticBaseURL + cart.img_main}
                          // Modification and addition by Om Shrivastava on 16-11-23
                          // Reason : Fix the image height and width
                          // style={{width:'350px'}}
                          // style={{ width: "320px",height:'320px' }}
                          // End of modification and addition by Om Shrivastava on 16-11-23
                          // Reason : Fix the image height and width
                          onClick={(e) => {
                            openDetail(cart);
                            scrollTop();
                          }}
                        />
                        <div
                          style={{
                            textAlign: "center",
                            textTransform: "capitalize",
                            fontWeight: "600",
                            fontSize: ".8rem",
                            color: "var(--textColorPrimary)",
                            // Addition by Om Shrivastava on 29-11-23
                            // Reason : Add the letterspacing
                            letterSpacing: "1px",
                            // End of Addition by Om Shrivastava on 29-11-23
                            // Reason : Add the letterspacing
                          }}
                          onClick={(e) => {
                            openDetail(cart);
                            scrollTop();
                          }}
                        >
                          {/* Modification and addition by Om Shrivastava on 08-12-23
                    Reason : Show the product name with lowercase  */}
                          {/* {cart.title} */}
                          {cart.title.toLowerCase()}
                          {/*End of modification and addition by Om Shrivastava on 08-12-23
                    Reason : Show the product name with lowercase  */}
                        </div>
                        <div
                          style={{
                            textAlign: "center",
                            fontSize: ".9rem",
                            fontWeight: "500",
                            color: "var(--textColorPrimary)",
                          }}
                        >
                          {/* Modification and addition by Om Shrivastava on 18-06-2024
                      Reason : Remove the commas and decimal value  */}
                          {/* {(cart.price * currency.value).toFixed(2)} */}
                          {/* Modification and addition by Om Shrivastava on 20-06-2024
                            Reason : Show the discountant amount which product on_sale  */}
                          {/* {(cart.price * currency.value).toLocaleString("en-IN")} */}

                          {cart.is_sale == true ? (
                            <>
                              <strike>
                                {" "}
                                {currency.sign}{" "}
                                {(cart.price * currency.value).toLocaleString(
                                  "en-IN"
                                )}
                              </strike>
                              <div>
                                {" "}
                                {currency.sign}{" "}
                                {(
                                  cart.price *
                                  (1 - cart.sale_discount_percentage / 100) *
                                  currency.value
                                ).toLocaleString("en-IN")}
                              </div>
                            </>
                          ) : (
                            <>
                              {currency.sign}{" "}
                              {(cart.price * currency.value).toLocaleString(
                                "en-IN"
                              )}
                            </>
                          )}
                          {/* End of Modification and addition by Om Shrivastava on 20-06-2024
                            Reason : Show the discountant amount which product on_sale  */}
                          {/* Modification and addition by Om Shrivastava on 18-06-2024
                      Reason : Remove the commas and decimal value  */}
                        </div>

                        {/* Commented by Rohan - 16/12/22
                      Reason - Adding representation of Reading to ship items  */}

                        {cart.ready_to_ship ? (
                          <div
                            className={styles.readyContainer}
                            onClick={(e) => {
                              openDetail(cart);
                              scrollTop();
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <div className={styles.readyBox}>
                              {/* <img src={logo} className={styles.readyIcon} /> */}
                              Ready To Ship
                            </div>
                          </div>
                        ) : null}
                      </div>
                      {/* End of code */}
                    </Carousel.Item>
                  )
                );
              })}

            {/* <div>.</div> */}
          </Carousel>
        </div>
      ) : null}
    </>
  );
};

export default Slider;
