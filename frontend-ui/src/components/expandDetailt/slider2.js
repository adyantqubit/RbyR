import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Navigate, useNavigate } from "react-router-dom";
import config from "../../api/config";
import { CartState } from "../../context";

import style from "../listing/listpage.module.css";

const Slider2 = ({scrollTop}) => {
  const { CategoryProduct, con, setcon, currency } = CartState();
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 4,
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
            paddingLeft: "4%",
          }}
        >
          YOU MAY ALSO LIKE
        </div>
        <Carousel responsive={responsive} style={{ width: "100%" }}>
          {CategoryProduct
            ? CategoryProduct.map((cart, i) => {
                if (i != 0)
                  return (
                    <>
                      <img
                        className={style.img}
                        src={config.apiBaseURL + cart.img_main}
                        style={{ width: "360px" }}
                        onClick={(e) => {openDetail(cart);scrollTop()}}
                      />
                      <div
                        style={{
                          textAlign: "center",
                          textTransform: "capitalize",
                        }}
                      >
                        {cart.title}
                      </div>
                      <div style={{ textAlign: "center", fontWeight: "600" }}>
                        {" "}
                        {currency.sign}{" "}
                        {(cart.price * currency.value).toFixed(2)}
                      </div>
                    </>
                  );
              })
            : null}

          <div>.</div>
        </Carousel>
      </div>
    </>
  );
};

export default Slider2;
