import React from 'react'
import Carousel from 'react-grid-carousel'
import { Navigate, useNavigate } from "react-router-dom";
import config from "../../api/config";
import { CartState } from "../../context";
import styles from "./slider.module.css"
import logo from "../../assets/photos/rts-icon.svg"
import style from "../listing/listpage.module.css";

const Slider2 = ({scrollTop}) => {
  const { CategoryProduct, con, setcon, currency } = CartState();
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
    nav(`/listing/${id.category}/detail/${id.id}`);
    setcon(false);
    // window.location.reload(false)

    //  <Navigate to={`/listing/${id.category}/detail/${id.id}`}/>
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "0 8%",
          margin: "50px 0",
          marginBottom:"5vh"
        }}
      >
        <div
          style={{
            fontSize: "20px",
            lineHeight: "32px",
            letterSpacing: "3px",
            marginBottom: "20px",
            
          }}
        >
          YOU MAY ALSO LIKE
        </div>
        <Carousel cols={4} rows={1} gap={10} style={{ width: "100%" }} >
          {CategoryProduct
            ? CategoryProduct.map((cart, i) => {
                 
                  return (
                    <Carousel.Item>
                      <img
                        className={style.img}
                        src={config.apiBaseURL + cart.img_main}
                        style={{ width: "350px" }}
                        onClick={(e) => {openDetail(cart);scrollTop()}}
                      />
                     <div
                        style={{
                          textAlign: "center",
                          textTransform: "capitalize",
                          fontWeight:"600",
                          fontSize:".8rem",
                          color:"#323232"
                        }}
                      >
                        {cart.title}
                      </div>
                      <div style={{ textAlign: "center",fontSize:".9rem", fontWeight: "500",color:"#323232" }}>
                        {" "}
                        {currency.sign}{" "}
                        {(cart.price * currency.value).toFixed(2)}
                      </div>

                      {/* Commented by Rohan - 16/12/22
                      Reason - Adding representation of Reading to ship items  */}

                  {cart.ready_to_ship?
                  <div className={styles.readyContainer}>
                  <div className={styles.readyBox}>
                    <img src={logo} className={styles.readyIcon} />
                    Ready To Ship
                  </div>
                </div>
                :null}

                {/* End of code */}
                    </Carousel.Item>
                  );

              })
            : null}

          {/* <div>.</div> */}
        </Carousel>
      </div>
    </>
  );
};

export default Slider2;
