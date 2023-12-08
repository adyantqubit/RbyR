import React, { useState, useEffect } from "react";
import Carousel from "react-grid-carousel";
import "react-multi-carousel/lib/styles.css";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import config from "../../api/config";
import { CartState } from "../../context";

import style from "../listing/listpage.module.css";
import styles from "./slider.module.css";
import logo from "../../assets/photos/rts-icon.svg";

const Slider = ({ scrollTop }) => {
  const { CategoryProduct, con, setcon, currency } = CartState();
  const recentlyViews = [];
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    func();
  }, []);
  function func() {
    var storage = JSON.parse(localStorage.getItem("recentview"));
    if (storage && storage.length > 1) {
      for (var i = 0; i < storage.length; i++) {
        if (i > 0) recentlyViews.push(storage[i]);
      }
      setRecentlyViewedProducts(recentlyViews);
    }
  }

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
      {recentlyViewedProducts.length > 0 ? (
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
          <div className={styles.header} style={{textAlign:'center',fontWeight:'600'}}>RECENTLY VIEWED PRODUCTS</div>

          <Carousel cols={4} rows={1} gap={10} style={{ width: "100%" }}>
            {/* {JSON.parse(localStorage.getItem("recentview")) &&
          JSON.parse(localStorage.getItem("recentview")).length > 0 */}

            {recentlyViewedProducts.map((cart) => {
              return (
                <Carousel.Item
                  style={{ cursor: "pointer", padding: "5px auto" }}
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
                      letterSpacing:'1px'
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
                    {" "}
                    {currency.sign} {(cart.price * currency.value).toFixed(2)}
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
                        <img src={logo} className={styles.readyIcon} />
                        Ready To Ship
                      </div>
                    </div>
                  ) : null}

                  {/* End of code */}
                </Carousel.Item>
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
