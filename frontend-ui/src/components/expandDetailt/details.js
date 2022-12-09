import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import config from "../../api/config";
import { DetailApi, getCategoryProduct } from "../../api/service";
import Footer from "../global/footer";
import Navbar from "../global/NavHeader";
import { bounce } from "react-animations";
import { StyleSheet, css } from "aphrodite";
import { BackTop, Modal, notification } from "antd";

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
import { animateScroll as scroll } from "react-scroll";
import ScrollButton from "../concepts/ScrollButton";
import { increamentCheck } from "../../api/orderApis";
import {
  getWomenSizeChartDetail,
  getWhatsappContactDetail,
} from "../../api/service";
import CustomTailoredForm from "./CustomTailoredForm";
import WomenSizeChart from "./WomenSizeChart";
import { Link } from "react-router-dom";

const sty = StyleSheet.create({
  bounce: {
    animationName: bounce,
    animationDuration: "1s",
  },
});

const Details = (props) => {
  const { id } = useParams();
  const nav = useNavigate()
  const [details, setDetails] = useState([]);
  const [size, setSize] = useState("");
  const { con, setcon, setCartDrawer, openCartdrawer } = CartState();
  const [sizeCond, setSizecond] = useState(false);
  const [pushData, setPushData] = useState(false);
  const {
    cart,
    setCart,
    like,
    setLike,
    CategoryProduct,
    currency,
    setCategoryProduct,
    settemAllpro,
  } = CartState();
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
  const [isCustomTailoredVisible, setIsCustomTailoredVisible] = useState(false);
  // End of code addition

  // Added by Ashish Dewangan on 24-11-2022
  // Reason - To display whatsapp contact number
  const [whatsappContactNumber, setWhatsappContactNumber] = useState(false);
  // End of code addition

  useEffect(() => {
    gettingDetail();
    getWomenSizeChart();
    getWhatsappContactNumber();
    catApi();
  }, []);

  const { category } = useParams();

  const catApi = async () => {
    if(category=="view_all")
    await getCategoryProduct("partywear").then((r) => {
      setCategoryProduct([...r.category]);
      settemAllpro([...r.category]);
      console.log(r.category);
    });

    else
    await getCategoryProduct(category).then((r) => {
      setCategoryProduct([...r.category]);
      settemAllpro([...r.category]);
      console.log(r.category);
    });
  };


  useEffect(() => {
    gettingDetail();
  }, [id])

 


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

   window.scrollTo(0,0)

  }, [details]);

  async function gettingDetail() {


    await DetailApi(id).then((r) => {
      setDetails({ ...r });
    });
  }

  // Added by Ashish Dewangan on 24-11-2022
  // Reason - To display whatsapp contact number
  const getWhatsappContactNumber = async () => {
    const whatsappContactNumberData = await getWhatsappContactDetail();
    if (whatsappContactNumberData) {
      setWhatsappContactNumber(whatsappContactNumberData[0].whatsappNmber);
    }
  };
  // End of code modification

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
    
    if(details.available==false){
      notification.error({
        message: <div style={{fontSize:"18px",color:"black"}}>Not Available !</div>,
        description:
        `No More Stock Available`,
        className:"custom-class",
        style: { backgroundColor:"#8c8c8c",color:"black",marginTop:"10vh"},
        duration:2,
        key:1
        });
        notAvai=true
        setNotAvai(true)
    }

    if(!notAvai)
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

  // Added by Ashish on 24-11-2022
  // Reason - To start whatsapp chat
  function startChat() {
    var chatBox = document.getElementById("chatBox");
    if (chatBox.value) {
      window.location =
        "https://wa.me/" +
        whatsappContactNumber +
        "?text=Product : " +
        details.title +
        "  |   Category : " +
        details.category +
        "  |   Message : " +
        chatBox.value;
    }
  }
  // End of code addition
  const scroller = useRef()
  function scrolling(e) {
    console.log()
    scroller.current.scrollTop = 0
  }

 




  return (

    <div style={{ maxHeight: "150vh", overflow: "scroll" }} id="scrolling"  >

      <Navbar />

      {details ? (
        <div  className={styles["container"]} ref={scroller}>
          <div className={styles["container01"]} >
            <div className={styles["container02"]} >
              <div className={styles["image"]}>
                <InnerImageZoom
                  src={config.apiBaseURL + details.img_main}
                  zoomSrc={config.apiBaseURL + details.img_main}
                />
              </div>
              {/* {scroller.current.scrollTop?:null} */}

              <div className={styles["container03"]}>
                <div className={styles["container04"]}>
                  <h1 className={styles["heading"]}>{details.title}</h1>
                  <h1 className={styles["subtitle"]}>{details.about}</h1>
                  <span className={styles["subtitle"]}>
                    {" "}
                    {currency.sign}{" "}
                    {(details.price * currency.value).toFixed(2)}
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
                              <label
                                for={details.id}
                                className={`${styles.subtitle} ${styles.customSubtitle}`}
                              >
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

                              <label
                                for={details.id * 44}
                                className={`${styles.subtitle} ${styles.customSubtitle}`}
                              >
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

                              <label
                                for={details.id * 88}
                                className={`${styles.subtitle} ${styles.customSubtitle}`}
                              >
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

                              <label
                                for={details.id * 108}
                                className={`${styles.subtitle} ${styles.customSubtitle}`}
                              >
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

                              <label
                                for={details.id * 126}
                                className={`${styles.subtitle} ${styles.customSubtitle}`}
                              >
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
                              <label
                                for={details.id}
                                className={`${styles.subtitle} ${styles.customSubtitle}`}
                              >
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

                              <label
                                for={details.id * 44}
                                className={`${styles.subtitle} ${styles.customSubtitle}`}
                              >
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

                              <label
                                for={details.id * 88}
                                className={`${styles.subtitle} ${styles.customSubtitle}`}
                              >
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

                              <label
                                for={details.id * 108}
                                className={`${styles.subtitle} ${styles.customSubtitle}`}
                              >
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

                              <label
                                for={details.id * 126}
                                className={`${styles.subtitle} ${styles.customSubtitle}`}
                              >
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
                      className={`${styles.subtitle} ${styles.customSubtitle}`}
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
                      <CustomTailoredForm />
                    </Modal>
                    {/* End of code addition */}

                    {/* Commented and modified by - Ashish Dewangan on 23-11-2022
                    Reason - to display size chart when we click on size chart text */}
                    {/* <span  className={styles["text02"]}>Size Chart</span> */}
                    <span
                      className={`${styles.subtitle} ${styles.customSubtitle}`}
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
                    className={` ${styles["customButtonContainer"]} `}
                    style={{}}
                  >
                    {check() ? (
                      <button
                        className={` ${styles["button"]} `}
                        onClick={(e) => saveCart(details)}
                      >
                        REMOVE FROM BAG
                      </button>
                    ) : (
                      <button
                        className={` ${styles["button"]} `}
                        onClick={(e) => AddToCart(details)}
                      >
                        ADD TO BAG
                      </button>
                    )}
                    <div className={` ${styles["iconButtonsContainer"]} `}>
                      {like.filter((l) => l.id === details.id).length > 0 ? (
                        <AiFillHeart
                          style={{
                            color: "red",
                            width: "25px",
                            height: "25px",
                          }}
                          onClick={(e) => LikedSave(details)}
                        />
                      ) : (
                        <AiOutlineHeart
                          style={{
                            width: "25px",
                            height: "25px",
                          }}
                          onClick={(e) => LikedSave(details)}
                        />
                      )}
                      {/* Commented and modified by Ashish Dewangan on 24-11-2022
                      Reason - To have whatsapp chat functionality */}
                      {/* <a href="https://wa.me/916264170187"></a> */}
                      <a
                        href={`https://wa.me/send?text=${window.location.href}`}
                      >
                        {/* End of code modification */}{" "}
                        <AiOutlineWhatsApp
                          style={{
                            width: "25px",
                            height: "25px",
                            marginLeft: "10px",
                          }}
                        />
                      </a>
                    </div>
                  </div>
                  <h1 className={styles["subtitle"]}>ABOUT THE PRODUCT</h1>
                  <span className={styles["text04"]}>
                    {details.description}
                  </span>
                  <div className={styles["container06"]}>
                    <span className={styles["textLabel"]}>Fabric</span>
                    <span className={styles["textLabel"]}>:</span>
                    <span className={styles["textDescription"]}>
                      {details.fabric}
                    </span>
                  </div>
                  <div className={styles["container07"]}>
                    <span className={styles["textLabel"]}>Color </span>
                    <span className={styles["textLabel"]}> : </span>
                    <span className={styles["textDescription"]}>
                      {details.color}
                    </span>
                  </div>
                  <div className={styles["container08"]}>
                    <span className={styles["textLabel"]}>
                      Country of Origin
                    </span>
                    <span className={styles["textLabel"]}>:</span>
                    <span className={styles["textDescription"]}>
                      {details.made_in}
                    </span>
                  </div>
                  <h1 className={styles["subtitle"]} onClick={check}>
                    PRODUCT DETAILS
                  </h1>
                  <div className={styles["container06"]}>
                    <span className={styles["textLabel"]}>Style Code </span>
                    <span className={styles["textLabel"]}>:</span>
                    <span className={styles["textDescription"]}>
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
                      <span className={styles["textLabel"]}>
                        Ready to ship{" "}
                      </span>
                      <span className={styles["textLabel"]}> : </span>
                      <span
                        className={styles["textDescription"]}
                        style={{ display: "inline-block", marginRight: "3px" }}
                      >
                        {" " + details.ready_to_ship_days}
                      </span>
                    </div>
                  ) : (
                    <div className={styles["container07"]}>
                      <span
                        className={styles["textLabel"]}
                        style={{ display: "inline-block", marginRight: "3px" }}
                      >
                        Standard Shipping{" "}
                      </span>
                      <span
                        className={styles["textLabel"]}
                        style={{ display: "inline-block", marginRight: "3px" }}
                      >
                        {" "}
                        :{" "}
                      </span>
                      <span
                        className={styles["textDescription"]}
                        style={{ display: "inline-block", marginRight: "3px" }}
                      >
                        {" " + details.shipping_days}
                      </span>
                    </div>
                  )}
                  {/* End of code modification */}
                  <div className={styles["container08"]}>
                    <span className={styles["textDescription"]}>
                      Additional Charges for International Shipping
                    </span>
                  </div>
                  <h1 className={styles["subtitle"]}>FOR CUSTOMISATIONS</h1>
                  <span className={styles["textDescription"]}>
                    <span
                      onClick={showCustomTailoredForm}
                      className={styles["textLink"]}
                    >
                      Submit
                    </span>{" "}
                    your customisation details
                  </span>
                  {/* Commented and modified by Ashish Dewangan on 24-11-2022
                      Reason - To have whatsapp chat functionality */}
                  {/* <a
                      href="https://wa.me/916264170187/dfdf"
                      style={{ fontSize: "1rem" }}
                    > */}
                  <span className={styles["textDescription"]}>
                    {" "}
                    or share the details on
                    <a
                      className={styles["textLink"]}
                      style={{
                        marginLeft: "3px",
                        marginRight: "3px",
                        // fontSize: "1em",
                        // borderBottom:"1px solid grey",
                      }}
                      href={`https://wa.me/${whatsappContactNumber}?text=Product : ${details.title}  |  Category : ${details.category}`}
                    >
                      Whatsapp
                    </a>
                    with us
                    {/* End of code modification */}
                  </span>
                  <span className={styles["subtitle"]}>
                    <Link
                      to="/custom"
                      className={styles["subtitle"]}
                      style={{
                        textDecoration: "none",
                        letterSpacing: "1px",
                        fontSize: "14px",
                      }}
                    >
                      Contact Us |
                    </Link>

                    <Link
                      to="/delivery-policy"
                      className={styles["subtitle"]}
                      style={{
                        textDecoration: "none",
                        letterSpacing: "1px",
                        fontSize: "14px",
                      }}
                    >
                      Shipping Policy
                    </Link>
                  </span>
                  <div className={styles["chatBoxContainer"]}>
                    <input
                      type="text"
                      id="chatBox"
                      placeholder="Know more about the product.."
                      maxLength={100}
                      className={` ${styles["chatInputBox"]} `}
                    />
                    <button
                      className={` ${styles["chatButton"]} `}
                      onClick={startChat}
                    >
                      CHAT WITH US
                    </button>
                  </div>
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
          {/* 
          {CategoryProduct && CategoryProduct.length > 0 ? (

          
            
            <div
              style={{
                width: "80vw",
                height: "80vh",
                marginTop: "6%",
                zIndex: "0",
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
              <Slider2 />
            </div>
          ) : null}
          <div
            style={{
              width: "80vw",
              height: "80vh",
              marginTop: "6%",
              zIndex: "0",
              
            }}
          >
            <div
              style={{
                fontSize: "20px",
                lineHeight: "32px",
                letterSpacing: "3px",
                marginBottom: "5vh",
                // fontFamily: "Rawson-Regular",
                // marginLeft: "-10px",
              }}
            >
              RECENTLY VIEWED PRODUCTS
            </div>
            <Slider />
          </div> */}

          <div style={{ width: "100%", zIndex: "1" }} >
            <Slider2 scrollTop={scrolling}/>
            <Slider scrollTop={scrolling}/>
          </div>

          <div className={styles.foot}>
            <Footer />

            <Below />

          </div>
        </div>
      ) : (
        "loading"
      )}

    </div>


  );
};

export default Details;
