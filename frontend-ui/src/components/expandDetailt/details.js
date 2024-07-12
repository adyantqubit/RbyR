import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import config from "../../api/config";
import {
  DetailApi,
  getCategoryProduct,
  getRecentlyViewedProductsApi,
  LikeDeleteApi,
} from "../../api/service";
import Footer from "../global/footer";
import Navbar from "../global/NavHeader";
import { bounce } from "react-animations";
import { StyleSheet, css } from "aphrodite";
import { BackTop, Modal, notification } from "antd";
import {
  Magnifier,
  GlassMagnifier,
  SideBySideMagnifier,
  PictureInPictureMagnifier,
  MOUSE_ACTIVATION,
  TOUCH_ACTIVATION,
} from "react-image-magnifiers";
// import Zoom from "react-medium-image-zoom";
// import "react-medium-image-zoom/dist/styles.css";
// import projectStyles from '.style.module.css'
import styles from "./detail.module.css";
import "./detail.scss";
import "./like.scss";
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
// import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";
import "./innerZoom.css";
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
import Chat from "./chat";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import "./styles.css";
import cartImage from "../../images/cartDesign.jpeg";

// import required modules
import { Navigation } from "swiper/modules";
import LoaderImg from '../../images/adyant_loader.gif'


const sty = StyleSheet.create({
  bounce: {
    animationName: bounce,
    animationDuration: "1s",
  },
});

const Details = (props) => {
  notification.destroy();
  const { id } = useParams();
  const nav = useNavigate();
  const [details, setDetails] = useState(null);
  const [size, setSize] = useState("");
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [magnifierStyle, setMagnifierStyle] = useState({
    display: "none",
    left: 0,
    top: 0,
    backgroundPosition: "0px 0px",
    backgroundSize: "0px 0px",
  });

  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    const container = containerRef.current;
    const magnifier = imageRef.current;
    if (!container || !magnifier) return;

    const { top, left, width, height } = container.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Ensure the magnifier stays within bounds
    const magnifierX = Math.max(0, Math.min(width - 200, x - 100)); // Adjust the 200 and 100 values as per your magnifier size
    const magnifierY = Math.max(0, Math.min(height - 200, y - 100));

    // Calculate background position for magnification
    const bgX = -((magnifierX / width) * magnifier.naturalWidth - 4); // Adjust the 100 value as per your magnifier size
    const bgY = -((magnifierY / height) * magnifier.naturalHeight - 5);

    setMagnifierStyle({
      display: "block",
      left: magnifierX,
      top: magnifierY,
      backgroundPosition: `${bgX}px ${bgY}px`,
      backgroundSize: `${magnifier.naturalWidth}px ${magnifier.naturalHeight}px`,
      // backgroundSize:'550px 850px',
      // backgroundSize:'620px 1000px',


    });
  };

  const handleMouseLeave = () => {
    setMagnifierStyle({ display: "none" });
  };

  // Handle pinch-to-zoom on touch devices
  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      const distance = Math.sqrt(
        (e.touches[0].clientX - e.touches[1].clientX) ** 2 +
          (e.touches[0].clientY - e.touches[1].clientY) ** 2
      );
      const newScale = Math.min(Math.max(distance / 100, 1), 3); // Scale between 1 and 3
      setScale(newScale);
    }
  };

  // Handle mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const newScale = Math.min(Math.max(scale + e.deltaY * -0.01, 1), 3);
    setScale(newScale);
  };

  // Handle dragging for panning
  const handleMouseDown = (e) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const initialPos = { ...position };

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      setPosition({ x: initialPos.x + dx, y: initialPos.y + dy });
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const {
    con,
    setcon,
    setCartDrawer,
    openCartdrawer,
    currentSelectedItem,
    setCurrentSelectedItem,
  } = CartState();
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
    recentlyViewedItems,
    setRecentlyViewedItems,
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

  const [zoom, setZoom] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    details?.img_main,
    details?.img_sub1,
    details?.img_sub2,
    details?.img_sub3,
  ].filter((img) => img && img !== "/media/null"); // Filter out null or invalid images

  const handleZoomToggle = () => {
    setZoom(!zoom);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    /**
     * Commented by - Ashish Dewangan on 09-12-2023
     * Reason - No need to call api because it is already being called in another useEffect
     */
    // gettingDetail();
    /**
     * End of comment by - Ashish Dewangan on 09-12-2023
     * Reason - No need to call api because it is already being called in another useEffect
     */
    getWomenSizeChart();
    getWhatsappContactNumber();
    catApi();
  }, []);

  /**
   * Added by - Ashish Dewangan on 09-12-2023
   * Reason - To deleted recently viewed items which are older than one week
   */
  const deleteOldItemsFromRecentlyViewedProducts = () => {
    var items = JSON.parse(localStorage.getItem("recentview"));
    if (items != null && items != undefined) {
      var copyOfItems = items.filter((item) => {
        return (
          Math.round((Date.now() - item.timeOfView) / (24 * 60 * 60 * 1000)) < 7
        );
      });
      localStorage.setItem("recentview", JSON.stringify(copyOfItems));
      setRecentlyViewedItems(copyOfItems);
    }
  };
  /**
   * End of code addition by - Ashish Dewangan on 09-12-2023
   * Reason - To deleted recently viewed items which are older than one week
   */

  /**
   * Added by - Ashish Dewangan on 07-12-2023
   * Reason - To get latest details of recently viewed products
   */
  const getRecentlyViewedProducts = async () => {
    var ids = [];
    var items = JSON.parse(localStorage.getItem("recentview"));
    if (items != null && items != undefined) {
      for (var i = 0; i < items.length; i++) {
        ids.push(items[i].id);
      }
    }

    const response = await getRecentlyViewedProductsApi(ids);

    var copyOfItems = response.products;
    if (copyOfItems) {
      for (var i = 0; i < items?.length; i++) {
        for (var j = 0; j < copyOfItems?.length; j++) {
          if (items[i].id == copyOfItems[j].id) {
            copyOfItems[j].timeOfView = items[i].timeOfView;
          }
        }
      }
      localStorage.setItem("recentview", JSON.stringify(copyOfItems));
      setRecentlyViewedItems(copyOfItems);
    }
  };
  /**
   * End of code addition by - Ashish Dewangan on 07-12-2023
   * Reason - To get latest details of recently viewed products
   */

  const { category } = useParams();

  const catApi = async () => {
    if (category == "view_all")
      await getCategoryProduct("partywear").then((r) => {
        setCategoryProduct([...r.category]);
        settemAllpro([...r.category]);
      });
    else {
      await getCategoryProduct(category).then((r) => {
        setCategoryProduct([...r.category]);
        settemAllpro([...r.category]);
      });
    }
  };

  useEffect(() => {
    /**
     * Added by - Ashish Dewangan on 09-12-2023
     * Reason - To deleted recently viewed items which are older than one week
     */
    deleteOldItemsFromRecentlyViewedProducts();
    /**
     * End of code addition by - Ashish Dewangan on 09-12-2023
     * Reason - To deleted recently viewed items which are older than one week
     */

    /**
     * Added by - Ashish Dewangan on 07-12-2023
     * Reason - To get latest details of recently viewed products
     */
    getRecentlyViewedProducts();
    /**
     * End of code addition by - Ashish Dewangan on 07-12-2023
     * Reason - To get latest details of recently viewed products
     */
    gettingDetail();
  }, [id]);

  useEffect(() => {
    if (details) {
      /**
       * Added by - Ashish Dewangan on 15-12-2023
       * Reason - To set currently selected item
       */
      setCurrentSelectedItem(details);
      /**
       * End of code addition by - Ashish Dewangan on 15-12-2023
       * Reason - To set currently selected item
       */

      /**
       * Commented and modified by - Ashish Dewangan on 07-12-2023
       * Reason - To set recently viewed products
       */

      // if (
      //   recents != null &&
      //   recents.filter((r) => r.id === details.id).length == 0
      // ) {
      //   recents.splice(0, 0, details);
      //   // recents.push(details);
      //   localStorage.setItem("recentview", JSON.stringify(recents));
      //   setRecentlyViewedItems(recents)
      // }

      var items = JSON.parse(localStorage.getItem("recentview"));
      if (items != null && items != undefined) {
        if (items.filter((e) => e.id == details.id).length < 1) {
          var copyOfItem = details;
          copyOfItem["timeOfView"] = Date.now();

          items.push(copyOfItem);
          localStorage.setItem("recentview", JSON.stringify(items));
          setRecentlyViewedItems(items);
        } else {
          var copyOfItems = items;
          for (var i = 0; i < copyOfItems.length; i++) {
            if (copyOfItems[i].id == details.id) {
              copyOfItems[i].timeOfView = Date.now();
            }
          }

          localStorage.setItem("recentview", JSON.stringify(copyOfItems));
          setRecentlyViewedItems(copyOfItems);
        }
      }

      /**
       * End of code modification by - Ashish Dewangan on 07-12-2023
       * Reason - To set recently viewed products
       */

      window.scrollTo(0, 0);
    }
  }, [details]);

  async function gettingDetail() {
    await DetailApi(id).then((r) => {
      setDetails({ ...r });
    });
  }

  const [mainImage, setMainImage] = useState("");

  // Update mainImage when details.img_main changes
  useEffect(() => {
    if (details?.img_main && details?.img_main !== "/media/null") {
      setMainImage(details?.img_main);
    } else {
      // Set a default fallback image if img_main is not valid
      setMainImage("/path/to/fallback/image.jpg"); // Provide a valid fallback image path
    }
  }, [details?.img_main]);

  // Function to update the main image
  // const updateMainImage = (newImage) => {
  //   setMainImage(newImage);
  // };
  const updateMainImage = (newImage) => {
    const imageIndex = images.findIndex((image) => image === newImage);
    if (imageIndex !== -1) {
      setCurrentImageIndex(imageIndex);
    }
  };

  // console.log(details, "check all data");
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

    if (details.available == false) {
      notification.error({
        message: (
          <div style={{ fontSize: "18px", color: "black" }}>
            Not Available !
          </div>
        ),
        description: `No More Stock Available`,
        className: "custom-class",
        style: {
          // Modification and addition by Om Shrivastava on 30-11-23
          // Reason : Set the font color, and font family
          // backgroundColor: "#8c8c8c",
          backgroundColor: "var(--bannerColor)",
          color: "black",
          marginTop: "10vh",
          fontFamily: "var(--pagesFontFamily)",
          // End of Modification and addition by Om Shrivastava on 30-11-23
          // Reason : Set the font color, and font family
        },
        duration: 2,
        key: 1,
      });
      notAvai = true;
      setNotAvai(true);
    }

    if (!notAvai)
      if (size) {
        if (size == "Extra Extra Extra Large") {
          if (details.XXXL < 1) setNotAvai(true);
          else saveCart(details);
        }
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
          // } else if (size == "Short") {
        } else if (size == "Small") {
          if (details.S < 1) setNotAvai(true);
          else saveCart(details);
        } else if (size == "Extra Short") {
          if (details.XS < 1) setNotAvai(true);
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
    const resp = await cartsaveApi({ data, access_token });

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
      size: product.size,
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
        "https://wa.me/+91 " +
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
  const scroller = useRef();
  function scrolling(e) {
    scroller.current.scrollTop = 0;
  }

  // Added by rohan - 19/2/23
  // Reason-Adding buy now functionality so user able to add product in cart and redirect on cart page
  function buyNow(detail) {
    if (size.length == 0) {
      setPushData(true);
    } else {
      cart.filter((i) => {
        if (i.id == detail.id) if (i.size == size) return i;
      }).length > 0
        ? nav("/cart")
        : AddToCart(detail);
    }
  }
  // end of code - 19/2/23

  async function likeDelete(product) {
    const data = {
      id: product.id,
    };
    await LikeDeleteApi(data, localStorage.getItem("access_token")).then((r) =>
      console.log(r)
    );

    if (like.filter((l) => l.id === product.id).length > 0) {
      const p = like.filter((i) => i.id !== product.id);
      setLike(p);
    } else {
      setLike([...like, product]);
    }
  }
  return (
    <div style={{ maxHeight: "100vh" }} id="scrolling">
      <Navbar />
      {/* Omm
      OmmOmm */}

      {details ? (
        <div className={styles["container"]} ref={scroller}>
          <div className={styles.divContainer}>
            <div className={styles["container01"]}>
              <div className={styles["container02"]} >
                <div className={styles["subImagesContainer"]}>
                  {details.img_sub1 != null ? (
                    // {details.img_sub1 !== "/media/null" && (
                    <div className={styles.imageContainer} >
                      <img
                        className={styles.subImage}
                        src={config.staticBaseURL + details.img_sub1}
                        onClick={() => updateMainImage(details.img_sub1)}
                        style={{
                          opacity: images[currentImageIndex] === details.img_sub1 ? 1 : 0.5,
                        }}
                        alt="Sub Image 1"
                      />
                    </div>
                  ) : // )}
                  null}

                  {details.img_sub2 != null ? (
                    // {details.img_sub2 !== "/media/null" && (
                    <div className={styles.imageContainer}>
                      <img
                        className={styles.subImage}
                        src={config.staticBaseURL + details.img_sub2}
                        onClick={() => updateMainImage(details.img_sub2)}
                        style={{
                          opacity: images[currentImageIndex] === details.img_sub2 ? 1 : 0.5,
                        }}
                        alt="Sub Image 266"
                      />
                    </div>
                  ) : // )}
                  null}
                  {details.img_sub3 != null ? (
                    // {details.img_sub3 !== "/media/null" && (
                    <div className={styles.imageContainer}>
                      <img
                        className={styles.subImage}
                        src={config.staticBaseURL + details.img_sub3}
                        onClick={() => updateMainImage(details.img_sub3)}
                        style={{
                          opacity: images[currentImageIndex] === details.img_sub3 ? 1 : 0.5,
                        }}
                        alt="Sub Image 3"
                      />
                    </div>
                  ) : // )}
                  null}
                </div>
                <div
                  className={styles["image"]}
                  // style={{ border: "1px solid red" }}
                  // className="image"
                  ref={containerRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    className={styles.subImage}
                    // src={config.staticBaseURL + mainImage}
                    src={config.staticBaseURL + images[currentImageIndex]}
                    // alt="Main"
                    // className="subImage"
                    // src={imageSrc}
                    alt="Main"
                    ref={imageRef}
                  />
                  <div
                    className={styles.magnifier}
                    // className=""
                    // style={{ ...magnifierStyle, backgroundImage: `url(${config.staticBaseURL + mainImage})` }}
                    style={{
                      ...magnifierStyle,
                      backgroundImage: `url(${
                        config.staticBaseURL + images[currentImageIndex]
                      })`,
                    }}
                  ></div>
                 
                  <button
                    className={styles.prevButton}
                    onClick={handlePrevImage}
                  >
                    &lt;
                  </button>
                  <button
                    className={styles.nextButton}
                    onClick={handleNextImage}
                  >
                    &gt;
                  </button>
                </div>

                <div
                  className={styles["slideImages"]}
                  // style={{ border: "1px dotted black" }}
                >
                  <Swiper
                    navigation={true}
                    modules={[Navigation]}
                    className="mySwiper"
                  >
                    <SwiperSlide>
                      <img src={config.staticBaseURL + details.img_main} />
                    </SwiperSlide>
                    {details.img_sub1 != null ? (
                      <SwiperSlide>
                        <img src={config.staticBaseURL + details.img_sub1} />
                      </SwiperSlide>
                    ) : null}

                    {details.img_sub2 != null ? (
                      <SwiperSlide>
                        <img src={config.staticBaseURL + details.img_sub2} />
                      </SwiperSlide>
                    ) : null}

                    {details.img_sub3 != null ? (
                      <SwiperSlide>
                        <img src={config.staticBaseURL + details.img_sub3} />
                      </SwiperSlide>
                    ) : null}
                  </Swiper>
                </div>

                <div className={styles["container03"]}>
                  <div className={styles["container04"]}>
                    <h1
                      className={styles["heading"]}
                      style={{ wordBreak: "break-all" }}
                    >
                      {details.title.toLowerCase()}
                    </h1>

                    <span className={styles["text04"]}>
                      {details.description}
                    </span>
                    {/* Commented by - Ashish Dewangan on 17-02-2023
                  Reason - To hide description and to have simple UI */}
                    {/* <h1 className={styles["subtitle"]}>{details.about}</h1> */}
                    {/* End of comment */}
                    <h3
                      style={{ marginTop: "2px" }}
                      className={styles["priceLabel"]}
                    >
                      {" "}
                      {/* {currency.sign}{" "} */}
                      {/* Modification and addition by Om Shrivastava on 15-06-2024
                    Reason : Show the price with commas, remove the decimal value  */}
                      {/* {(details.price * currency.value).toFixed(2)} */}
                      {/* Modification and addition by Om Shrivastava on 20-06-2024
                            Reason : Show the discountant amount which product on_sale  */}
                      {/* {(details.price * currency.value).toLocaleString("en-IN")} */}
                      {details.is_sale == true ? (
                        <>
                          MRP:{" "}
                          <strike>
                            {" "}
                            {currency.sign}{" "}
                            {(details.price * currency.value).toLocaleString(
                              "en-IN"
                            )}
                          </strike>
                          <div>
                            {" "}
                            Discounted price: {currency.sign}{" "}
                            {(
                              details.price *
                              (1 - details.sale_discount_percentage / 100) *
                              currency.value
                            ).toLocaleString("en-IN")}
                          </div>
                        </>
                      ) : (
                        <>
                          MRP: {currency.sign}{" "}
                          {(details.price * currency.value).toLocaleString(
                            "en-IN"
                          )}
                        </>
                      )}
                      {/* End of Modification and addition by Om Shrivastava on 20-06-2024
                            Reason : Show the discountant amount which product on_sale  */}
                      {/* End of modification and addition by Om Shrivastava on 15-06-2024
                    Reason : Show the price with commas, remove the decimal value  */}
                    </h3>

                    {/* Added by - Ashish Dewangan on 17-02-2023
                  Reason - To add a horizontal line after price */}
                    {/* Commented by Om Shrivastava on 24-11-23
                  Reason : No need to show this line */}
                    {/* <div
                    style={{
                      borderBottom: "1px solid lightgrey",
                      width: "90%",
                      marginTop: "15px",
                    }}
                  ></div> */}
                    {/* End of Commented by Om Shrivastava on 24-11-23
                  Reason : No need to show this line  */}
                    {/* End of code addition */}
                    <div className={styles["container05"]}>
                      <div
                        class={sizeCond ? sty : "rating-container face"}
                        className={styles.sizeSlection}
                        style={{ display: "flex", width: "100%" }}
                      >
                        <span
                          className={`${styles["textLabel"]} ${styles.sizeMargin}`}
                          style={{ alignItems: "flex-start" }}
                        >
                          SIZE :{" "}
                        </span>

                        {/* Commented by - Ashish Dewangan on 29-12-2023
                      Reason - Redesigned size selection box */}
                        {/* {pushData ? (
                        <Shake>
                          <div>
                            {" "}
                            <div class="rating">
                              <form class="rating-form">
                                <label
                                  for={details.id}
                                  className={`${styles.subtitle} ${styles.customSubtitle}`}
                                  style={{ textDecoration: "none" }}
                                >
                                  <input
                                    type="radio"
                                    name={details.id}
                                    class="super-happy"
                                    id={details.id}
                                    value="Small"
                                    onChange={(e) => onChange(e.target.value)}
                                  />
                                  <span class="span">S</span>
                                </label>

                                <label
                                  for={details.id * 44}
                                  className={`${styles.subtitle} ${styles.customSubtitle}`}
                                  style={{ textDecoration: "none" }}
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
                                  style={{ textDecoration: "none" }}
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
                                  style={{ textDecoration: "none" }}
                                >
                                  <input
                                    type="radio"
                                    name={details.id}
                                    class="super-sad"
                                    id={details.id * 108}
                                    value="Extra Large"
                                    onChange={(e) => onChange(e.target.value)}
                                    style={{ textDecoration: "none" }}
                                  />
                                  <span class="span">XL</span>
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
                              Please select your size
                            </div>
                          </div>
                        </Shake>
                      ) : ( */}
                        {/* End of comment by - Ashish Dewangan on 29-12-2023
                      Reason - Redesigned size selection box */}
                      </div>

                      {/* <div className={styles.charts}> */}
                      {/* <span  className={styles["text02"]}>Custom Tailored</span> */}
                      {/* Added by Ashish Dewangan on 24-11-2022
                      Reason - To show custom tailored form */}
                      {/* Commented by - Ashish Dewangan on 17-02-2023
                      Reason - To hide custom tailored label and have simple UI */}
                      {/* <span
                        className={`${styles.subtitle} ${styles.subtitle2} ${styles.customSubtitle}`}
                        style={{ cursor: "pointer" }}
                        onClick={showCustomTailoredForm}
                      >
                        Custom Tailored
                      </span> */}
                      {/* End of comment */}
                      {/* End of code addition */}
                      {/* Commented and modified by - Ashish Dewangan on 23-11-2022
                      Reason - to display size chart when we click on size chart text */}
                      {/* <span  className={styles["text02"]}>Size Chart</span> */}
                      {/* <span
                        className={`${styles.subtitle} ${styles.subtitle2} ${styles.customSubtitle}`}
                        style={{ cursor: "pointer" }}
                        onClick={showSizeChart}
                      >
                        Size Chart
                      </span> */}
                      {/* </div> */}

                      <Modal
                        /**
                         * Commented and modified by - Ashish Dewangan on 03-12-2023
                         * Reason - To give some space at top
                         */
                        // style={{ top: 0 }}
                        style={{ top: "5vh" }}
                        /**
                         * End of code modification by - Ashish Dewangan on 03-12-2023
                         * Reason - To give some space at top
                         */
                        className={styles["modalStyleCustomTailored"]}
                        bodyStyle={{
                          backgroundColor: "var(--modalBodyBackgroundColor)",
                        }}
                        footer={null}
                        title="CUSTOM TAILORED"
                        visible={isCustomTailoredVisible}
                        onOk={handleCustomTailoredOk}
                        onCancel={handleCustomTailoredCancel}
                      >
                        <CustomTailoredForm details={details} />
                      </Modal>

                      {/* Added by - Ashish Dewangan on 17-12-2023
                    Reason - To show size chart */}
                      {womenSizeChart.length > 0 && (
                        <span
                          className={`${styles.subtitle} ${styles.subtitle2} ${styles.customSubtitle}`}
                          style={{
                            color: "#4c60e5",
                            cursor: "pointer",
                            fontSize: "14px",
                            alignSelf: "flex-start",
                            // width: "11vw",
                            width: "100%",
                          }}
                          onClick={showSizeChart}
                        >
                          SIZE CHART
                        </span>
                      )}
                      {/* End of code addition by - Ashish Dewangan on 17-12-2023
                      Reason - To show size chart */}
                      <Modal
                        style={{ top: "25%" }}
                        className={styles["modalStyle"]}
                        footer={null}
                        title="SIZE CHART"
                        visible={isWomenSizeChartVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                      >
                        {/* <img
                        style={{ width: "100%", height: "100%" }}
                        src={
                          womenSizeChart.length > 0
                            ? config.staticBaseURL + womenSizeChart
                            : "/women_size_chart.jpg"
                        }
                      /> */}
                        <WomenSizeChart womenSizeChart={womenSizeChart} />
                      </Modal>
                      {/* End of code addition */}
                    </div>

                    <div
                      style={{
                        display: "inline-flex",
                        flexDirection: "column",
                        width: "100%",
                        // border:'1px solid red'
                      }}
                    >
                      <div class="rating">
                        <form class="rating-form">
                          {/* Commented by - Ashish Dewangan on 17-02-2023
                              Reason - To hide sizes that are not required */}
                          {/* <label
                                for={details.id * 2}
                                className={`${styles.subtitle} ${styles.customSubtitle}`}
                                style={{ textDecoration: "none" }}
                              >
                                <input
                                  type="radio"
                                  name={details.id}
                                  class="super-duper-happy"
                                  id={details.id * 2}
                                  value="Extra Short"
                                  onChange={(e) => onChange(e.target.value)}
                                />
                                <span class="span">XS</span>
                              </label> */}
                          {/* End of comment */}
                          <label
                            for={details.id}
                            className={`
                              ${styles.customSubtitle} ${styles.sizeText}`}
                            style={{
                              textDecoration: "none",
                              padding: "0%",
                            }}
                          >
                            <input
                              type="radio"
                              name={details.id}
                              class="super-happy"
                              id={details.id}
                              // value="Short"
                              value="Small"
                              onChange={(e) => onChange(e.target.value)}
                              // style={{border:'1px solid red'}}
                            />

                            <span
                              //  style={{b}
                              class="span"
                              // className={styles["sizeContainer"]}
                              style={{ padding: "9% 15% 9% 15%" }}
                            >
                              &nbsp;S&nbsp;
                            </span>
                          </label>

                          <label
                            for={details.id * 44}
                            className={` ${styles.customSubtitle} ${styles.sizeText}`}
                            style={{
                              textDecoration: "none",
                            }}
                          >
                            <input
                              type="radio"
                              name={details.id}
                              class="happy"
                              id={details.id * 44}
                              value="Medium"
                              onChange={(e) => onChange(e.target.value)}
                            />
                            <span
                              class="span"
                              style={{ padding: "9% 15% 9% 15%" }}
                            >
                              &nbsp;M&nbsp;
                            </span>
                          </label>

                          <label
                            for={details.id * 88}
                            className={` ${styles.customSubtitle} ${styles.sizeText}`}
                            style={{
                              textDecoration: "none",
                            }}
                          >
                            <input
                              type="radio"
                              name={details.id}
                              class="sad"
                              id={details.id * 88}
                              value="Large"
                              onChange={(e) => onChange(e.target.value)}
                            />
                            <span
                              class="span"
                              style={{ padding: "9% 15% 9% 15%" }}
                            >
                              &nbsp;L&nbsp;
                            </span>
                          </label>

                          <label
                            for={details.id * 108}
                            className={` ${styles.customSubtitle} ${styles.sizeText}`}
                            style={{
                              textDecoration: "none",
                            }}
                          >
                            <input
                              type="radio"
                              name={details.id}
                              class="super-sad"
                              id={details.id * 108}
                              value="Extra Large"
                              onChange={(e) => onChange(e.target.value)}
                            />
                            <span
                              class="span"
                              style={{ padding: "9% 15% 9% 15%" }}
                            >
                              XL
                            </span>
                          </label>
                          {/* Commented by - Ashish Dewangan on 17-02-2023
                              Reason - To hide sizes that are not required */}
                          {/* <label
                                for={details.id * 126}
                                className={`${styles.subtitle} ${styles.customSubtitle}`}
                                style={{ textDecoration: "none" }}
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
                              <label
                                for={details.id * 146}
                                className={`${styles.subtitle} ${styles.customSubtitle}`}
                                style={{ textDecoration: "none" }}
                              >
                                <input
                                  type="radio"
                                  name={details.id}
                                  class="super-duper-sad"
                                  id={details.id * 146}
                                  value="Extra Extra Extra Large"
                                  onChange={(e) => onChange(e.target.value)}
                                />
                                <span class="span">XXXL</span>
                              </label> */}
                          {/* End of comment */}
                        </form>
                      </div>
                      {/* Modified by - Ashish Dewangan on 29-12-2023
                        Reason - Redesigned Size selection box */}
                      {/* {notAvai ? (
                          <div
                            // id="rating"
                            style={{
                              color: "red",
                              fontSize: "0.8rem",
                              marginLeft: "10px",
                            }}
                          >
                            This size is not available.
                          </div>
                        ) : null} */}

                      {notAvai ? (
                        <div
                          // id="rating"
                          style={{
                            color: "red",
                            fontSize: "0.8rem",
                            marginLeft: "10px",
                          }}
                        >
                          This size is not available.
                        </div>
                      ) : pushData ? (
                        <div
                          // class="rating"
                          style={{
                            color: "red",
                            fontSize: "0.8rem",
                            marginLeft: "10px",
                          }}
                        >
                          Please select your size
                        </div>
                      ) : null}
                      {/* End of code modification by - Ashish Dewangan on 29-12-2023
                        Reason - Redesigned Size selection box */}
                    </div>

                    <div
                      className={` ${styles["customButtonContainer"]} `}
                      style={{}}
                    >
                      <div 
                      className={styles.cartContainer}
                      // style={{ display: "flex", gap: "15px",justifyContent:'center' }}
                      >
                        {check() ? (
                          <button
                            className={` ${styles["button"]} `}
                            onClick={(e) => saveCart(details)}
                          >
                            <span style={{ margin: "auto" }}>
                              REMOVE FROM BAG
                            </span>
                          </button>
                        ) : (
                          <button
                            className={` ${styles["button"]} `}
                            onClick={(e) => AddToCart(details)}
                          >
                            <span style={{ margin: "auto" }}>
                              {/* <i
                              class="fa simple fa-bag-shopping"
                              style={{
                                fontSize: "17px",
                                position: "relative",
                                color: "white",
                                paddingRight: "5px",
                              }}
                            ></i>{" "} */}
                              <img className="cartDesign" src={cartImage} />
                              ADD TO CART
                            </span>
                          </button>
                        )}
                        {/* Commetned by Om Shrivastava on 14-06-2024
                      Reason : No need to show this section  */}
                        {/* <button
                        className={` ${styles["button2"]} `}
                        onClick={(e) => buyNow(details)}
                      >
                        <span style={{ margin: "auto" }}>BUY NOW</span>
                      </button> */}
                        {/* Commetned by Om Shrivastava on 14-06-2024
                      Reason : No need to show this section  */}
                      </div>

                      {like.filter((l) => l.id === details.id).length > 0 ? (
                        // <AiFillHeart
                        //   style={{
                        //     color: "red",
                        //     width: "25px",
                        //     height: "25px",
                        //   }}
                        //   onClick={(e) => LikedSave(details)}
                        // />
                        <button
                          className={` ${styles["button3"]} `}
                          onClick={(e) => likeDelete(details)}
                        >
                          <span style={{ margin: "auto", paddingLeft: "10px" }}>
                            REMOVE FROM WISHLIST
                          </span>
                          <div class="placement">
                            <div
                              class="heart is-active"
                              /**
                               * Commented by - Ashish Dewangan on 20-12-2023
                               * Reason - To reduce api calling because parent button already has onclick listener for api calling
                               */
                              // onClick={(e) => LikedSave(details)}
                              /**
                               * End of comment by - Ashish Dewangan on 20-12-2023
                               * Reason - To reduce api calling because parent button already has onclick listener for api calling
                               */
                            ></div>
                          </div>
                        </button>
                      ) : // <AiOutlineHeart
                      //   style={{
                      //     width: "25px",
                      //     height: "25px",
                      //   }}
                      //   onClick={(e) => LikedSave(details)}
                      // />
                      //     Commented by Om Shrivastava on 14-06-2024
                      // Reason : No need to show this section
                      // <button
                      //   className={` ${styles["button3"]} `}
                      //   onClick={(e) => LikedSave(details)}
                      // >
                      //   <span style={{ margin: "auto" }}>ADD TO WISHLIST</span>
                      //   <div class="placement">
                      //     <div
                      //       class="heart"
                      //       /**
                      //        * Commented by - Ashish Dewangan on 20-12-2023
                      //        * Reason - To reduce api calling because parent button already has onclick listener for api calling
                      //        */
                      //       // onClick={(e) => LikedSave(details)}
                      //       /**
                      //        * End of comment by - Ashish Dewangan on 20-12-2023
                      //        * Reason - To reduce api calling because parent button already has onclick listener for api calling
                      //        */
                      //     ></div>
                      //   </div>
                      // </button>

                      //    Commented by Om Shrivastava on 14-06-2024
                      // Reason : No need to show this section
                      null}

                      {/* <div className={` ${styles["iconButtonsContainer"]} `}> */}
                      {/* {like.filter((l) => l.id === details.id).length > 0 ? (
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
                      )} */}

                      {/* Commented and modified by Ashish Dewangan on 24-11-2022
                      Reason - To have whatsapp chat functionality */}
                      {/* <a href="https://wa.me/916264170187"></a> */}
                      {/* Commented and modified by - Ashish Dewangan on 15-02-2023
                         Reason - To open external links in new browser tab */}

                      {/* <a
                        href={`https://wa.me/send?text=${window.location.href}`} target="_blank"
                      >
                     
                        {" "}
                        <AiOutlineWhatsApp
                          style={{
                            width: "25px",
                            height: "25px",
                            marginLeft: "10px",
                          }}
                        />
                      </a> */}
                      {/* End of code modification */}
                      {/* </div> */}
                    </div>

                    {/* Commented and modified by - Ashish Dewangan on 17-02-2023
                  Reason - To hide unnecessary details
                   */}
                    {/* <h1 className={styles["subtitle"]}>ABOUT THE PRODUCT</h1> */}
                    <h1 className={styles["subtitle"]}></h1>
                    {/* End of code modification */}

                    {/* <span className={styles["text04"]}>
                    {details.description}
                  </span> */}

                    {/* <div className={styles["container06"]}>
                    <span className={styles["textLabel"]}>Fabric</span>
                    <span className={styles["textLabel"]}>:</span>
                    <span className={styles["textDescription"]}>
                      {details.fabric}
                    </span>
                  </div> */}
                    {/* Addition by Om Shrivastava on 24-12-23
                  Reason : When data is present then div is show */}
                    {details.fabric ? (
                      <div className={styles["detailsContainer"]}>
                        <span className={styles["textHeading"]}>Fabric</span>
                        <span className={styles["colon"]}>:</span>
                        <span className={styles["textContent"]}>
                          {details.fabric}
                        </span>
                      </div>
                    ) : null}
                    {/* End of addition by Om Shrivastava on 24-12-23
                  Reason : When data is present then div is show */}

                    {/* Addition by Om Shrivastava on 24-12-23
                  Reason : When data is present then div is show */}
                    {details.color ? (
                      <div className={styles["detailsContainer"]}>
                        <span className={styles["textHeading"]}>Color </span>
                        <span className={styles["colon"]}> : </span>
                        <span className={styles["textContent"]}>
                          {details.color}
                        </span>
                      </div>
                    ) : null}
                    {/* End of addition by Om Shrivastava on 24-12-23
                  Reason : When data is present then div is show */}

                    {/* Commented by - Ashish Dewangan on 17-02-2023
                  Reason - To hide country of origin and have simple UI */}
                    {/* <div className={styles["container08"]}>
                    <span className={styles["textLabel"]}>
                      Country of Origin
                    </span>
                    <span className={styles["textLabel"]}>:</span>
                    <span className={styles["textDescription"]}>
                      {details.made_in}
                    </span>
                  </div> */}

                    {/* End of comment */}

                    {/* <h1 className={styles["subtitle"]} onClick={check}>
                    PRODUCT DETAILS
                  </h1> */}

                    {/* Addition by Om Shrivastava on 24-12-23
                  Reason : When data is present then div is show */}
                    {details.style_code ? (
                      <div className={styles["detailsContainer"]}>
                        <span className={styles["textHeading"]}>
                          Style Code{" "}
                        </span>
                        <span className={styles["colon"]}>:</span>
                        <span className={styles["textContent"]}>
                          {details.style_code}
                        </span>
                      </div>
                    ) : null}
                    {/* End of addition by Om Shrivastava on 24-12-23
                  Reason : When data is present then div is show */}

                    {/* Addition by Om Shrivastava on 04-11-23
                  Reason : Set the Care tip functionality */}
                    {details?.careTip && details.careTip.length > 0 ? (
                      <div className={styles["detailsContainer"]}>
                        <span className={styles["textHeading"]}>Care Tip </span>
                        <span className={styles["colon"]}>:</span>
                        <span className={styles["textContent"]}>
                          {details.careTip}
                        </span>
                      </div>
                    ) : null}
                    {/* End of Addition by Om Shrivastava on 04-11-23
                  Reason : Set the Care tip functionality */}

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

                    {details.ready_to_ship ==
                    true ? // Reason : No need to show this section // Commented by Om Shrivastava on 14-06-2024 // </div> //   </span> //     {" " + details.ready_to_ship_days} //   > //     style={{ display: "inline-block", marginRight: "3px" }} //     className={styles["textContent"]} //   <span //   <span className={styles["colon"]}> : </span> //   </span> //     Ready to Ship{" "} //   <span className={styles["textHeading"]}> // <div className={styles["detailsContainer"]}> // Reason : No need to show this section // Commented by Om Shrivastava on 14-06-2024
                    null : (
                      <>
                        {details.shipping_days ? (
                          <div className={styles["detailsContainer"]}>
                            <span
                              className={styles["textHeading"]}
                              // style={{ display: "inline-block", marginRight: "3px" }}
                            >
                              {/* Standard Shipping{" "} */}
                              Delivery Time{" "}
                            </span>{" "}
                            <span
                              className={styles["colon"]}
                              // style={{ display: "inline-block", marginRight: "3px" }}
                            >
                              :{" "}
                            </span>
                            <span
                              className={styles["textContent"]}
                              // style={{ display: "inline-block", marginRight: "3px" }}
                            >
                              {" " + details.shipping_days}
                            </span>
                          </div>
                        ) : null}
                      </>
                    )}
                    {/* End of code modification */}
                    {/* Commented by - Ashish Dewangan on 17-02-2023
                  Reason - To hide unnecessary details and have simple UI*/}
                    {/* <div className={styles["container08"]}>
                    <span className={styles["textDescription"]}>
                      Additional Charges for International Shipping
                    </span>
                  </div> */}
                    {/* End of comment */}
                    {/* Commented by Om Shrivastava on 14-06-2024
                  Reason : No need to show this section  */}
                    {/* <h1 className={styles["subtitle"]}>FOR CUSTOMISATIONS</h1> */}
                    {/* <span className={styles["textDescription"]}>
                    <span
                      onClick={showCustomTailoredForm}
                      className={styles["textLink"]}
                      // Added by Om Shrivastava on 19-11-23
                      // Reason : Add the color
                      style={{ color: "rgb(59, 59, 224)" }}
                      // End of addition by Om Shrivastava on 19-11-23
                      // Reason : Add the color
                    >
                      Submit
                    </span>{" "}
                    your customisation details
                  </span> */}
                    {/* Commented by Om Shrivastava on 14-06-2024
                  Reason : No need to show this section  */}
                    {/* Commented and modified by Ashish Dewangan on 24-11-2022
                      Reason - To have whatsapp chat functionality */}
                    {/* <a
                      href="https://wa.me/916264170187/dfdf"
                      style={{ fontSize: "1rem" }}
                    > */}
                    {/* <span className={styles["textDescription"]}>
                    {" "}
                    or share the details on
                   
                    <a
                      className={styles["textLink"]}
                      style={{
                        marginLeft: "3px",
                        marginRight: "3px",
                        color: "rgb(59, 59, 224)",
                      }}
                      href={`https://wa.me/+91${whatsappContactNumber}?text=Product : ${details.title}  |  Category : ${details.category}`}
                      target="_blank"
                    >
                      Whatsapp
                    </a>
                    with us.
                  </span> */}
                    <span

                    // className={styles["subtitle"]}
                    >
                      {/* <Link
                      to="/custom"
                      className={styles["subtitle"]}
                      style={{
                        textDecoration: "none",
                        letterSpacing: "1px",
                        fontSize: "14px",
                      }}
                    > Contact Us  </Link> */}
                      <Link
                        to="/refund-policy"
                        className={styles["hoverableSubtitle"]}
                        style={{
                          textDecoration: "none",
                          letterSpacing: "1px",
                          fontSize: "14px",
                          color: "rgb(59, 59, 224)",
                          borderBottom: "1px solid rgb(59, 59, 224)",
                          // fontWeight:'500'
                        }}
                      >
                        {" "}
                        Return Policy{" "}
                      </Link>{" "}
                      <span> |</span>{" "}
                      <Link
                        to="/delivery-policy"
                        className={styles["hoverableSubtitle"]}
                        style={{
                          textDecoration: "none",
                          letterSpacing: "1px",
                          fontSize: "14px",
                          color: "rgb(59, 59, 224)",
                          borderBottom: "1px solid rgb(59, 59, 224)",
                          // fontWeight:'500'
                        }}
                      >
                        Shipping Policy
                      </Link>
                    </span>
                    {/* Commented by - Ashish Dewangan on 17-02-2023
                  Reason - To hide unnecessary details and have simple UI */}
                    {/* <div className={styles["chatBoxContainer"]}>
                    <input
                      type="text"
                      id="chatBox"
                      placeholder="Know more about the product..."
                      maxLength={100}
                      className={` ${styles["chatInputBox"]} `}
                    />
                    <button
                      className={` ${styles["chatButton"]} `}
                      onClick={startChat}
                    >
                      CHAT WITH US
                    </button>
                  </div> */}
                    {/* End of comment */}
                  </div>
                </div>
              </div>
            </div>
            {/* <div className={styles['container13']}>
            <span className={styles['text28']}>Text</span> 
              </div> */}
            {/* Modification and addition by Om Shrivastava on 17-06-2024
          Reason : No need to show this related image section */}

            {/* <div className={styles.gal}>
            <div className={styles.image_gallery}>
             
              {details.img_sub1 ? (
                
                <div className={styles.column}>
                  <div className={styles.image_item}>
                    {details.img_sub1 != "/media/null" ? (
                      <InnerImageZoom
                        className={styles.img}
                        src={config.staticBaseURL + details.img_sub1}
                        zoomSrc={config.staticBaseURL + details.img_sub1}
                      />
                    ) : null}
                  </div>
                </div>
              ) : 
              null}
              

             
              {details.img_sub2 ? (
                <div className={styles.column}>
                  <div className={styles.image_item}>
                    {details.img_sub2 != "/media/null" ? (
                      <InnerImageZoom
                        className={styles.img}
                        src={config.staticBaseURL + details.img_sub2}
                        zoomSrc={config.staticBaseURL + details.img_sub2}
                      />
                    ) : null}
                  </div>
                </div>
              ) :
              null}
              
              {details.img_sub3 ? (
                // End of addition by Om Shrivastava on 24-12-23
                // Reason : When no image is present then no need to show this block
                <div className={styles.column}>
                  <div className={styles.image_item}>
                    {details.img_sub3 != "/media/null" ? (
                      <InnerImageZoom
                        className={styles.img}
                        src={config.staticBaseURL + details.img_sub3}
                        zoomSrc={config.staticBaseURL + details.img_sub3}
                      />
                    ) : null}
                  </div>
                </div>
              ) :
              null}
            </div>
          </div> */}
            {/* End of modification and addition by Om Shrivastava on 17-06-2024
          Reason : No need to show this related image section */}
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

            <div style={{ width: "100%", zIndex: "1" }}>
              <Slider2 scrollTop={scrolling} />
              <Slider scrollTop={scrolling} />
            </div>
            {/* // Commented by Om Shrivastava on 14-06-2024
                  // Reason : No need to show this section */}
            {/* <div style={{ marginBottom: "12px", marginTop: "12px" }}>
              <a
                href="/"
                class="btn-flip"
                data-back="Back to Collection"
                data-front="Back to Collection"
              ></a>
            </div> */}
            {/* // Commented by Om Shrivastava on 14-06-2024
            // Reason : No need to show this section */}
            {/* Commented by - Ashish Dewangan on 15-02-2023
            Reason - To hide the text that appear after footer */}
            {/* <div className={styles.foot}> */}
            <Footer />
          </div>

          {/* <Below /> */}
          {/* <Chat/> */}
          {/* </div> */}
          {/* End of comment */}
        </div>
      ) : (
        // "loading"
          <div
                   
                    className={styles.loaderContainer}
                  >
                    {/* <img src="adyant_loader.gif" /> */}
                    <img style={{height:'30vh'}} src={LoaderImg}/>
                  </div>
      )}
    </div>
  );
};

export default Details;
