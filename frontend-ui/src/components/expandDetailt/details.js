import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import config from "../../api/config";
import { DetailApi } from "../../api/service";
import Footer from "../global/footer";
import Navbar from "../global/NavHeader";
import { bounce } from "react-animations";
import { StyleSheet, css } from "aphrodite";
import { BackTop, Modal } from "antd";

// import projectStyles from '.style.module.css'
import styles from "./detail.module.css";
import "./detail.scss";
import "./details.css";
import Size from "./Size.css";
import { message } from "antd";
import { CartState } from "../../context";
import {
  useCartUpdateMutation,
  useLikedUpdateMutation,
} from "../../Redux-manage/services/userAuthapi";
import Slider from "./slider";
import { AiFillHeart, AiOutlineHeart, AiOutlineWhatsApp } from "react-icons/ai";
import Below from "../global/below";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";
import InnerImageZoom from "react-inner-image-zoom";
import Slider2 from "./slider2";
import Shake from "react-reveal/Shake";
import { Link, animateScroll as scroll } from "react-scroll";
import ScrollButton from "./top";
import { increamentCheck } from "../../api/orderApis";
import { getWomenSizeChartDetail } from "../../api/service";
import CustomTailoredForm from "./CustomTailoredForm";
import WomenSizeChart from "./WomenSizeChart";

const sty = StyleSheet.create({
  bounce: {
    animationName: bounce,
    animationDuration: "1s",
  },
});

const Details = (props) => {
  const { id } = useParams();
  const [details, setDetails] = useState([]);
  const [size, setSize] = useState("");
  const { con, setcon, setCartDrawer, openCartdrawer } = CartState();
  const [sizeCond, setSizecond] = useState(false);
  const [pushData, setPushData] = useState(false);
  const { cart, setCart, like, setLike, CategoryProduct, currency } =
    CartState();
  const [cartsaveApi, { isLoad }] = useCartUpdateMutation();
  const [saveLikeApi, { isLoading }] = useLikedUpdateMutation();
  const [notAvai, setNotAvai] = useState(false);

  // Added by Ashish Dewangan on 23-11-2022
  // Reason - To display size chart image
  // Jira issue no - RBYR-193
  const [womenSizeChart, setWomenSizeChart] = useState([]);
  const [isWomenSizeChartVisible, setIsWomenSizeChartVisible] = useState(false);
  //End of code addition

  // Added by Ashish Dewangan on 24-11-2022
  // Reason - To display custom tailored form
  const [isCustomTailoredVisible,setIsCustomTailoredVisible] = useState(false);
  // End of code addition

  useEffect(() => {
    gettingDetail();
    getWomenSizeChart();
  }, []);

  if (con == false) {
    gettingDetail();
    setcon(true);
  }

  useEffect(() => {
    var recents = JSON.parse(localStorage.getItem("recentview"));
    if (recents == null) {
      localStorage.setItem("recentview", JSON.stringify([details]));
    }

    if (
      recents != null &&
      recents.filter((r) => r.id === details.id).length == 0
    ) {
      recents.push(details);
      localStorage.setItem("recentview", JSON.stringify(recents));
    }
  }, [details]);

  async function gettingDetail() {
    await DetailApi(id).then((r) => {
      setDetails({ ...r });
    });
  }

  // Added by Ashish Dewangan on 23-11-2022
  // Reason - To display size chart image
  // Jira issue no - RBYR-193
  const getWomenSizeChart = async () => {
    const womenSizeChartData = await getWomenSizeChartDetail();
    if (womenSizeChartData) {
      setWomenSizeChart(womenSizeChartData[0].image);
      // alert(JSON.stringify(womenSizeChartData))
    }
  };
  function showSizeChart() {
    setIsWomenSizeChartVisible(true);
  }

  const handleOk = () => {
    setIsWomenSizeChartVisible(false);
  };

  const handleCancel = () => {
    setIsWomenSizeChartVisible(false);
  };
  // End of code addition

  // Added by Ashish Dewangan on 24-11-2022
  // Reason - To show custom tailored form
  function showCustomTailoredForm() {
    setIsCustomTailoredVisible(true);
  }

  const handleCustomTailoredOk = () => {
    setIsCustomTailoredVisible(false);
  };

  const handleCustomTailoredCancel = () => {
    setIsCustomTailoredVisible(false);
  };
  // End of code addition
  function onChange(value) {
    setSize(value);
    setPushData(false);
    setNotAvai(false);
  }

  //  checking from backend before adding to cart
  //   async function increament(details){

  //   var increamentData={id:details.id,
  //     quantity:1,
  //     size:`${size}`}
  //   await increamentCheck(increamentData).then(r=>{
  //     if(r.error){
  //       notAvai =true
  //       setNotAvai(true)
  //     }
  //   }
  //   )
  // }

  async function AddToCart(details) {
    setPushData(false);
    if (!size.length > 0) {
      setSizecond(true);
      setPushData(true);
    }
    if (size) {
      if (size == "Extra Extra Large") {
        if (details.XXL < 1) setNotAvai(true);
        else saveCart(details);
      } else if (size == "Extra Large") {
        if (details.XL < 1) setNotAvai(true);
        else saveCart(details);
      } else if (size == "Large") {
        if (details.L < 1) setNotAvai(true);
        else saveCart(details);
      } else if (size == "Medium") {
        if (details.M < 1) setNotAvai(true);
        else saveCart(details);
      } else if (size == "Short") {
        if (details.S < 1) setNotAvai(true);
        else saveCart(details);
      }
    }
  }

  async function saveCart(details) {
    const data = {
      product_no: details.id,
      size: `${size}`,
    };

    const NewCartData = {
      ...details,
      quantity: 1,
      size: `${size}`,
    };

    var access_token = localStorage.getItem("access_token");
    const resp = await cartsaveApi({ data, access_token }).then((r) =>
      console.log(r)
    );

    if (
      cart.filter((i) => {
        if (i.id == details.id) if (i.size == data.size) return i;
      }).length > 0
    ) {
      var p = cart.filter((i) => {
        if (i.id == details.id) {
          if (i.size != data.size) return i;
        } else return i;
      });
      setCart([...p]);
    } else {
      setCart([...cart, NewCartData]);
      setCartDrawer(true);
    }

    // cart.forEach(element => {
    //   if(element.id==data.id)
    //   {
    //     console.log(element.size)
    //     console.log(data.size)
    //     if(element.size==data.size){
    //       pushData=false
    //       setPushData(pushData)
    //     }
    //   }

    // });

    // if(pushData){
    //   console.log(pushData)
    // cart.push(data)
    // setCart([...cart])
    // }else{
    //   console.log(pushData)

    // }
  }

  const LikedSave = async (product) => {
    if (localStorage.getItem("access_token")) {
    }

    const data = {
      item: product.id,
    };
    var access_token = localStorage.getItem("access_token");
    const resp = await saveLikeApi({ data, access_token });

    if (like.filter((l) => l.id === product.id).length > 0) {
      const p = like.filter((i) => i.id !== product.id);
      setLike(p);
    } else {
      setLike([...like, product]);
    }
  };

  function check() {
    var v = false;
    cart.filter((c) => {
      if (c.id == details.id) {
        if (c.size == size) {
          v = true;
        }
      }
    });

    return v;
  }

  return (
    <>
      <Navbar />

      {details ? (
        <div id="scrolling" className={styles["container"]}>
          <div className={styles["container01"]}>
            <div className={styles["container02"]}>
              <div className={styles["image"]}>
                <InnerImageZoom
                  src={config.apiBaseURL + details.img_main}
                  zoomSrc={config.apiBaseURL + details.img_main}
                />
              </div>

              <div className={styles["container03"]}>
                <div className={styles["container04"]}>
                  <h1 className={styles["heading"]}>{details.title}</h1>
                  <h1 className={styles["text"]}>{details.about}</h1>
                  <span className={styles["text01"]}>
                    {" "}
                    {currency.sign} {details.price * currency.value}
                  </span>
                  <div className={styles["container05"]}>
                    <div
                      class={sizeCond ? sty : "rating-container face"}
                      className={styles.sizeSlection}
                    >
                      {pushData ? (
                        <Shake>
                          {" "}
                          <div class="rating">
                            <form class="rating-form">
                              <label for={details.id}>
                                <input
                                  type="radio"
                                  name={details.id}
                                  class="super-happy"
                                  id={details.id}
                                  value="Short"
                                  onChange={(e) => onChange(e.target.value)}
                                />
                                <span class="span">S</span>
                              </label>

                              <label for={details.id * 44}>
                                <input
                                  type="radio"
                                  name={details.id}
                                  class="happy"
                                  id={details.id * 44}
                                  value="Medium"
                                  onChange={(e) => onChange(e.target.value)}
                                />
                                <span class="span">M</span>
                              </label>

                              <label for={details.id * 88}>
                                <input
                                  type="radio"
                                  name={details.id}
                                  class="sad"
                                  id={details.id * 88}
                                  value="Large"
                                  onChange={(e) => onChange(e.target.value)}
                                />
                                <span class="span">L</span>
                              </label>

                              <label for={details.id * 108}>
                                <input
                                  type="radio"
                                  name={details.id}
                                  class="super-sad"
                                  id={details.id * 108}
                                  value="Extra Large"
                                  onChange={(e) => onChange(e.target.value)}
                                />
                                <span class="span">XL</span>
                              </label>

                              <label for={details.id * 126}>
                                <input
                                  type="radio"
                                  name={details.id}
                                  class="super-sad"
                                  id={details.id * 126}
                                  value="Extra Extra Large"
                                  onChange={(e) => onChange(e.target.value)}
                                />
                                <span class="span">XXL</span>
                              </label>
                            </form>
                          </div>
                          <div
                            class="rating"
                            style={{
                              color: "red",
                              fontSize: "0.8rem",
                              marginLeft: "10px",
                            }}
                          >
                            Please select one size
                          </div>
                        </Shake>
                      ) : (
                        <>
                          <div class="rating">
                            <form class="rating-form">
                              <label for={details.id}>
                                <input
                                  type="radio"
                                  name={details.id}
                                  class="super-happy"
                                  id={details.id}
                                  value="Short"
                                  onChange={(e) => onChange(e.target.value)}
                                />
                                <span class="span">S</span>
                              </label>

                              <label for={details.id * 44}>
                                <input
                                  type="radio"
                                  name={details.id}
                                  class="happy"
                                  id={details.id * 44}
                                  value="Medium"
                                  onChange={(e) => onChange(e.target.value)}
                                />
                                <span class="span">M</span>
                              </label>

                              <label for={details.id * 88}>
                                <input
                                  type="radio"
                                  name={details.id}
                                  class="sad"
                                  id={details.id * 88}
                                  value="Large"
                                  onChange={(e) => onChange(e.target.value)}
                                />
                                <span class="span">L</span>
                              </label>

                              <label for={details.id * 108}>
                                <input
                                  type="radio"
                                  name={details.id}
                                  class="super-sad"
                                  id={details.id * 108}
                                  value="Extra Large"
                                  onChange={(e) => onChange(e.target.value)}
                                />
                                <span class="span">XL</span>
                              </label>

                              <label for={details.id * 126}>
                                <input
                                  type="radio"
                                  name={details.id}
                                  class="super-sad"
                                  id={details.id * 126}
                                  value="Extra Extra Large"
                                  onChange={(e) => onChange(e.target.value)}
                                />
                                <span class="span">XXL</span>
                              </label>
                            </form>
                          </div>
                          {notAvai ? (
                            <div
                              id="rating"
                              style={{
                                color: "red",
                                fontSize: "0.8rem",
                                marginLeft: "10px",
                                display: "block",
                              }}
                            >
                              This size is not available.
                            </div>
                          ) : null}
                        </>
                      )}
                    </div>

                    {/* <span  className={styles["text02"]}>Custom Tailored</span> */}

                    {/* Added by Ashish Dewangan on 24-11-2022
                    Reason - To show custom tailored form */}
                    <span
                      className={styles["text02"]}
                      style={{ cursor: "pointer" }}
                      onClick={showCustomTailoredForm}
                    >
                      Custom Tailored
                    </span>
                    <Modal
                      style={{ top: 0 }}

                      className={styles["modalStyleCustomTailored"]}
                      footer={null}
                      title="CUSTOM TAILORED"
                      visible={isCustomTailoredVisible}
                      onOk={handleCustomTailoredOk}
                      onCancel={handleCustomTailoredCancel}
                    >
                      <CustomTailoredForm/>
                    </Modal>
                    {/* End of code addition */}

                    {/* Commented and modified by - Ashish Dewangan on 23-11-2022
                    Reason - to display size chart when we click on size chart text */}
                    {/* <span  className={styles["text02"]}>Size Chart</span> */}
                    <span
                      className={styles["text02"]}
                      style={{ cursor: "pointer" }}
                      onClick={showSizeChart}
                    >
                      Size Chart
                    </span>
                    <Modal
                      style={{ top: 0 }}
                      className={styles["modalStyle"]}
                      footer={null}
                      title="SIZE GUIDE"
                      visible={isWomenSizeChartVisible}
                      onOk={handleOk}
                      onCancel={handleCancel}
                    >
                      {/* <img
                        style={{ width: "100%", height: "100%" }}
                        src={
                          womenSizeChart.length > 0
                            ? config.apiBaseURL + womenSizeChart
                            : "/women_size_chart.jpg"
                        }
                      /> */}
                      <WomenSizeChart womenSizeChart={womenSizeChart} />
                    </Modal>
                    {/* End of code addition */}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "70%",
                    }}
                  >
                    {check() ? (
                      <button
                        style={{
                          backgroundColor: "#323232",
                          textTransform: "uppercase",
                          fontFamily: "Rawson-Regular",
                          fontSize: "15px",
                          fontWeight: "600",
                          letterSpacing: "1px",
                        }}
                        className={` ${styles["button"]} `}
                        onClick={(e) => saveCart(details)}
                      >
                        Remove From Bag
                      </button>
                    ) : (
                      <button
                        style={{
                          backgroundColor: "#323232",
                          textTransform: "uppercase",
                          fontFamily: "Rawson-Regular",
                          fontSize: "15px",
                          fontWeight: "600",
                          letterSpacing: "1px",
                        }}
                        className={` ${styles["button"]} `}
                        onClick={(e) => AddToCart(details)}
                      >
                        Add To Bag
                      </button>
                    )}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginLeft: "20%",
                      }}
                    >
                      {like.filter((l) => l.id === details.id).length > 0 ? (
                        <AiFillHeart
                          style={{
                            color: "red",
                            marginTop: "20px",
                            width: "25px",
                            height: "25px",
                          }}
                          onClick={(e) => LikedSave(details)}
                        />
                      ) : (
                        <AiOutlineHeart
                          style={{
                            marginTop: "20px",
                            width: "25px",
                            height: "25px",
                          }}
                          onClick={(e) => LikedSave(details)}
                        />
                      )}
                      <a href="https://wa.me/916264170187">
                        {" "}
                        <AiOutlineWhatsApp
                          style={{
                            marginTop: "20px",
                            width: "25px",
                            height: "25px",
                            marginLeft: "10px",
                          }}
                        />
                      </a>
                    </div>
                  </div>
                  <h1 className={styles["text03"]}>ABOUT THE PRODUCT</h1>
                  <span className={styles["text04"]}>
                    {details.description}
                  </span>
                  <div className={styles["container06"]}>
                    <span className={styles["text05"]}>Fabric</span>
                    <span className={styles["text06"]}>:-</span>
                    <span className={styles["text07"]}>{details.fabric}</span>
                  </div>
                  <div className={styles["container07"]}>
                    <span className={styles["text08"]}>Color</span>
                    <span className={styles["text09"]}>:</span>
                    <span className={styles["text10"]}>{details.color}</span>
                  </div>
                  <div className={styles["container08"]}>
                    <span className={styles["text11"]}>Country of Origin</span>
                    <span className={styles["text12"]}>-</span>
                    <span className={styles["text13"]}>{details.made_in}</span>
                  </div>
                  <h1 className={styles["text03"]} onClick={check}>
                    PRODUCT DETAILS
                  </h1>
                  <div className={styles["container06"]}>
                    <span className={styles["text05"]}>Style Code </span>
                    <span className={styles["text06"]}>:</span>
                    <span className={styles["text07"]}>
                      {details.style_code}
                    </span>
                  </div>

                  {/* Commented and modified by Ashish Dewangan on 23-11-2022
                  Reason - To have standard shipping and ready to ship functionality */}
                  {/* <div className={styles["container07"]}>
                      <span
                        className={styles["text08"]}
                        style={{ display: "inline-block", marginRight: "3px" }}
                      >
                        Standard Shipping{" "}
                      </span>
                      <span
                        className={styles["text09"]}
                        style={{ display: "inline-block", marginRight: "3px" }}
                      >
                        {" "}
                        :{" "}
                      </span>
                      <span
                        className={styles["text10"]}
                        style={{ display: "inline-block", marginRight: "3px" }}
                      >
                        {" " + details.shipping_days}
                      </span>
                    </div> */}

                  {details.ready_to_ship == true ? (
                    <div className={styles["container07"]}>
                      <span
                        className={styles["text08"]}
                        style={{ display: "inline-block", marginRight: "3px" }}
                      >
                        Ready to ship{" "}
                      </span>
                      <span
                        className={styles["text09"]}
                        style={{ display: "inline-block", marginRight: "3px" }}
                      >
                        {" "}
                        :{" "}
                      </span>
                      <span
                        className={styles["text10"]}
                        style={{ display: "inline-block", marginRight: "3px" }}
                      >
                        {" " + details.ready_to_ship_days}
                      </span>
                    </div>
                  ) : (
                    <div className={styles["container07"]}>
                      <span
                        className={styles["text08"]}
                        style={{ display: "inline-block", marginRight: "3px" }}
                      >
                        Standard Shipping{" "}
                      </span>
                      <span
                        className={styles["text09"]}
                        style={{ display: "inline-block", marginRight: "3px" }}
                      >
                        {" "}
                        :{" "}
                      </span>
                      <span
                        className={styles["text10"]}
                        style={{ display: "inline-block", marginRight: "3px" }}
                      >
                        {" " + details.shipping_days}
                      </span>
                    </div>
                  )}
                  {/* End of code modification */}
                  <ScrollButton />
                  <div className={styles["container08"]}>
                    <span className={styles["text11"]}>
                      Additional Charges for International Shipping
                    </span>
                  </div>
                  <h1 className={styles["text25"]}>FOR CUSTOMISATIONS</h1>
                  <span className={styles["text26"]}>
                    Submit your customisation details On{" "}
                    <a
                      href="https://wa.me/916264170187/dfdf"
                      style={{ fontSize: "1rem" }}
                    >
                      Whatsapp
                    </a>
                  </span>
                  {/* <span className={styles['text27']}>Contact Us | Shipping Policy</span> */}
                  {/* <div className={styles['container12']}>
                <input
                  type="text"
                  placeholder="placeholder"
                  className={` ${styles['textinput']} `}
                />
                <button
                  className={` ${styles['contact-us']} `}
                >
                  Button
                </button>
              </div> */}
                </div>
              </div>
            </div>
          </div>
          {/* <div className={styles['container13']}>
     <span className={styles['text28']}>Text</span> 
      </div> */}
          <div className={styles.gal}>
            <div className={styles.image_gallery}>
              <div className={styles.column}>
                <div className={styles.image_item}>
                  <InnerImageZoom
                    className={styles.img}
                    src={config.apiBaseURL + details.img_sub1}
                    zoomSrc={config.apiBaseURL + details.img_sub1}
                  />
                </div>
              </div>
              <div className={styles.column}>
                <div className={styles.image_item}>
                  <InnerImageZoom
                    className={styles.img}
                    src={config.apiBaseURL + details.img_sub2}
                    zoomSrc={config.apiBaseURL + details.img_sub2}
                  />
                </div>
              </div>
              <div className={styles.column}>
                <div className={styles.image_item}>
                  <InnerImageZoom
                    className={styles.img}
                    src={config.apiBaseURL + details.img_sub3}
                    zoomSrc={config.apiBaseURL + details.img_sub3}
                  />
                </div>
              </div>
            </div>
          </div>

          {CategoryProduct && CategoryProduct.length > 0 ? (
            <div
              style={{
                width: "80vw",
                height: "70vh",
                marginTop: "6%",
                zIndex: "0",
              }}
            >
              <div
                style={{
                  fontSize: "1.5rem",
                  marginBottom: "20px",
                  textTransform: "uppercase",
                  lineHeight: "32px",
                }}
              >
                You May Also like
              </div>
              <Slider2 />
            </div>
          ) : null}
          <div
            style={{
              width: "80vw",
              height: "70vh",
              marginTop: "6%",
              zIndex: "0",
            }}
          >
            <div
              style={{
                fontSize: "1.5rem",
                lineHeight: "32px",
                letterSpacing: "3px",
                marginBottom: "20px",
                fontFamily: "Rawson-Regular",
                marginLeft: "-10px",
              }}
            >
              RECENTLY VIEWED PRODUCTS
            </div>
            <Slider />
          </div>
        </div>
      ) : (
        "loading"
      )}

      <ScrollButton />
      <Footer />
      <Below />
    </>
  );
};

export default Details;
