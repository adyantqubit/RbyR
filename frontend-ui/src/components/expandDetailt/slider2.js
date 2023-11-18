import React from "react";
import Carousel from "react-grid-carousel";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import config from "../../api/config";
import { CartState } from "../../context";
import styles from "./slider.module.css";
import logo from "../../assets/photos/rts-icon.svg";
import style from "../listing/listpage.module.css";

const Slider2 = ({ scrollTop }) => {
  const { CategoryProduct, con, setcon, currency } = CartState();
  const { id } = useParams();

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
    if (id.category.length != 0)
      nav(`/listing/${id.menu}/${id.category}/detail/${id.id}`);
    else nav(`/listing/${id.menu}/0/detail/${id.id}`);
    // nav(`/listing/${id.menu}/${id.category}/detail/${id.id}`);
    setcon(false);
    // window.location.reload(false)

    //  <Navigate to={`/listing/${id.category}/detail/${id.id}`}/>
  }

  return (
    <>
      {CategoryProduct && CategoryProduct.length > 1 ? (
        <div
          className={styles.sliderContainer}
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "0 8%",
            margin: "50px 0",
            marginBottom: "5vh",
          }}
        >
          <div
          // Modification and addition by Om Shrivastava on 16-11-23
          // Reason : Apply the css in external file
            // style={{
            //   fontSize: "20px",
            //   lineHeight: "32px",
            //   letterSpacing: "3px",
            //   marginBottom: "20px",
            // }}
            className={styles.likedContain}
            // End of Modification and addition by Om Shrivastava on 16-11-23
          // Reason : Apply the css in external file
          >
            YOU MAY ALSO LIKE 
          </div>
          <Carousel cols={4} rows={1} gap={10} style={{ width: "100%" }}>
            
            {CategoryProduct.map((cart, i) => {
              // commented by Rohan - 21/12/22
              //Reason i have to not show same
              if (cart.id != id)
                return (
                  <Carousel.Item
                    style={{ cursor: "pointer", padding: "5px auto" }}
                  >
                    {cart.is_active == true ? (
                      <>
                        <img
                          // className={style.img}
                          className={style.img12}

                          src={config.staticBaseURL + cart.img_main}
                          // Modification and addition by Om Shrivastava on 16-11-23
                          // Reason : Fix the image height and width
                          // style={{width:'350px'}}
                          style={{ width: "320px",height:'320px' }}
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
                            color: "#323232",
                          }}
                          // className={styles.productName}
                          onClick={(e) => {
                            openDetail(cart);
                            scrollTop();
                          }}
                        >
                          {cart.title}
                        </div>
                        <div
                          style={{
                            textAlign: "center",
                            fontSize: ".9rem",
                            fontWeight: "500",
                            color: "#323232",
                          }}
                        >
                          {" "}
                          {currency.sign}{" "}
                          {(cart.price * currency.value).toFixed(2)}
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
                      </>
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

export default Slider2;
