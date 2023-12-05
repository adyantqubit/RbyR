import React, { useEffect, useRef, useState } from "react";

import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsCartX, BsDot } from "react-icons/bs";
import { MdClose } from "react-icons/md";

import style from "../global/cartCard.module.css";
import {
  useCartUpdateMutation,
  useGetLikedProductQuery,
} from "../../Redux-manage/services/userAuthapi";
import { CartState } from "../../context";
import { getToken } from "../../Redux-manage/services/localStorageService";
import config from "../../api/config";
import { display } from "@mui/system";
import { TiDeleteOutline } from "react-icons/ti";
import { CartQuantityApi } from "../../api/service";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { BsWindowSidebar } from "react-icons/bs";
import { DrawerFooter } from "../global/cart";
import styles from "./cart.module.css";
import Msg from "../concepts/msgConfirm";
import { Popconfirm, message, notification } from "antd";
import Navbar from "../global/NavHeader";
import Footer2 from "../global/footer2";
import { HiMinus, HiPlus } from "react-icons/hi";
import Below from "../global/below";
import { Modal, Space } from "antd";

import Footer from "../global/footer";
import Slider from "../expandDetailt/slider";
import {
  cartStockRecheck,
  CouponCheck,
  ImpotantRuleGet,
  increamentCheck,
  shippingTickGet,
  TaxGet,
} from "../../api/orderApis";
import {
  afterColumnTotalOfferAdd,
  columnSubtotal,
} from "../../Redux-manage/services/billing";
import { Typography } from "@mui/material";

import { blue } from "@mui/material/colors";
import { SizeGetter } from "../global/getSize";
import Chat from "../expandDetailt/chat";
import { TokenManage } from "../../hooks/globalFunctionUser";
import '../../context.css'

const text =
  "Are you sure you would like to remove this item from the Shopping Cart?";

const CartSItem = (props) => {
  notification.destroy();
  var {
    cart,
    setCart,
    setUserData,
    firstTimeLoadFunctions,
    CategoryProduct,
    userdata,
    checkoutDetails,
    currency,
    offer,
    setOffer,
    taxRate,
    setTaxRate,
    cartEnd,
    setCartEnd,
  } = CartState();

  const [cartsaveApi, { isLoad }] = useCartUpdateMutation();
  let textInput = React.createRef();
  var [con, setcon] = useState(true);
  const [sizeno, setSizeno] = useState(0);
  const [error, setError] = useState(null);
  const [ShowCoupon, setCoupon] = useState(false);
  const [ImportantRules, setImportantRules] = useState(null);
  var [cartSuccess, setCartSuccess] = useState(false);

  useEffect(() => {
    GetTAXapi();
    ruleText();
    notification.destroy();
    window.scrollTo(0, 0);
    // document.getElementById("scrolled").scrollTop=0
  }, []);

  async function ruleText() {
    await ImpotantRuleGet().then((r) => setImportantRules(r));
  }

  const erro = (r) => {
    Modal.error({
      title: "No More Stock Available",
      style: { top: "30vh" },
    });
  };

  const decreament = (CartProduct) => {
    document.getElementById(
      `style${CartProduct.id}${CartProduct.size}`
    ).style.display = "none";

    var index = cart.findIndex((p, i) => {
      if (p.id === CartProduct.id)
        if (p.size == CartProduct.size) {
          return i + 1;
        }
    });
    var AllCartProduct = cart;

    if (CartProduct.size == "Extra Extra Large") {
      if (CartProduct.quantity <= CartProduct.XXL + 1) {
        document.getElementById(
          `style${CartProduct.id}${CartProduct.size}`
        ).style.display = "none";
      }
    } else if (CartProduct.size == "Extra Large") {
      if (CartProduct.quantity <= CartProduct.XL + 1) {
        document.getElementById(
          `style${CartProduct.id}${CartProduct.size}`
        ).style.display = "none";
      }
    } else if (CartProduct.size == "Large") {
      if (CartProduct.quantity <= CartProduct.L + 1) {
        document.getElementById(
          `style${CartProduct.id}${CartProduct.size}`
        ).style.display = "none";
      }
    } else if (CartProduct.size == "Medium") {
      if (CartProduct.quantity <= CartProduct.M + 1) {
        document.getElementById(
          `style${CartProduct.id}${CartProduct.size}`
        ).style.display = "none";
      }
    } else if (CartProduct.size == "Short") {
      if (CartProduct.quantity <= CartProduct.S + 1) {
        document.getElementById(
          `style${CartProduct.id}${CartProduct.size}`
        ).style.display = "none";
      }
    }

    if (AllCartProduct[index].quantity != 1) {
      AllCartProduct[index].quantity -= 1;
      increamentApi(CartProduct);
      setCart([...AllCartProduct]);
    }
  };

  async function increamentApiMethodCall({ CartProduct, data }) {
    await increamentCheck(data).then((r) => {
      if (r.success == true) {
        con = true;
      } else if (r.error) {
        // document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display="block";
        notification.error({
          message: (
            <div style={{  color: "black",fontSize:'13px',fontWeight:'600' }}>
              Out Of Stock.{" "}
            </div>
          ),
          description: `No More Stock Available`,
         // Modification and addition by Om shrivastava on 01-12-23
        // REason : Create the popup class to apply the designing
        className:'popupClass',
        // style:{marginTop:"20px"},
        // style:{backgroundColor: "#f1cdd9",
        // padding:'0px 5px 5px 5px',borderRadius:'10px',width:'200px'},
        // End of modification and addition by Om shrivastava on 01-12-23
        // REason : Create the popup class to apply the designing
          duration: 2,
          key: 1,
        });
        con = false;
      }
    });
  }

  const increament = async (CartProduct) => {
    con = true;

    if (CartProduct.size == "Extra Extra Large") {
      var data = {
        id: CartProduct.id,
        quantity: CartProduct.quantity,
        size: "XXL",
      };
      await increamentApiMethodCall({ CartProduct, data });

      /* commented on 11/11/22  
        purpose- becuse it check only from frontend only. if want to re-implement then just put size on if condition
        becuse i am removing it from all if else condition
      */
      // if(CartProduct.quantity>CartProduct.XXL){
      //   document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display="block";
      //   con=false
      // }
    } else if (CartProduct.size == "Extra Extra Extra Large") {
      var data = {
        id: CartProduct.id,
        quantity: CartProduct.quantity,
        size: "XXXL",
      };
      await increamentApiMethodCall({ CartProduct, data });
    } else if (CartProduct.size == "Extra Large") {
      var data = {
        id: CartProduct.id,
        quantity: CartProduct.quantity,
        size: "XL",
      };
      await increamentApiMethodCall({ CartProduct, data });
    } else if (CartProduct.size == "Large") {
      var data = {
        id: CartProduct.id,
        quantity: CartProduct.quantity,
        size: "L",
      };
      await increamentApiMethodCall({ CartProduct, data });
    } else if (CartProduct.size == "Medium") {
      var data = {
        id: CartProduct.id,
        quantity: CartProduct.quantity,
        size: "M",
      };
      await increamentApiMethodCall({ CartProduct, data });
    } else if (CartProduct.size == "Short") {
      var data = {
        id: CartProduct.id,
        quantity: CartProduct.quantity,
        size: "S",
      };
      await increamentApiMethodCall({ CartProduct, data });
    } else if (CartProduct.size == "Extra Short") {
      var data = {
        id: CartProduct.id,
        quantity: CartProduct.quantity,
        size: "XS",
      };
      await increamentApiMethodCall({ CartProduct, data });
    }

    if (con) {
      var index = cart.findIndex((p, i) => {
        if (p.id === CartProduct.id)
          if (p.size == CartProduct.size) {
            return i + 1;
          }
      });
      var AllCartProduct = cart;
      AllCartProduct[index].quantity++;
      setCart([...AllCartProduct]);
      increamentApi(CartProduct);
    }
  };

  const cartSave = async (product) => {
    const data = {
      product_no: product.id,
      size: product.size,
    };
    var access_token = localStorage.getItem("access_token");
    const resp = await cartsaveApi({ data, access_token });

    if (cart.filter((l) => l.id === product.id).length > 0) {
      var p = cart.filter((i) => {
        if (i.id == product.id) {
          if (i.size != product.size) return i;
        } else return i;
      });
      setCart([...p]);
      document.getElementById("style").style.display = "none";
    } else {
      setCart([...cart, product]);
    }
  };

  const nav = useNavigate();
  function openDetail(id) {
    nav(`/listing/${id.menu}/${id.category}/detail/${id.id}`);
    // window.location.reload(false)
  }

  async function increamentApi(data) {
    var access_token = localStorage.getItem("access_token");
    await CartQuantityApi({ data, access_token }).then((r) => console.log(""));
  }
  const confirm = (pro) => {
    cartSave(pro);
  };

  const getTotalPrice = () => {
    var p = 0;
    cart.map((c) => (p += c.price * c.quantity));
    return p;
  };

  async function ApplyPromo() {
    var promocode = document.getElementsByClassName("promoCode")[0].value;
    var token = localStorage.getItem("access_token");

    var data = {
      usertoken: token,
      promochar: promocode,
    };

    if (promocode.length > 0) {
      await CouponCheck(data).then((r) => {
        if (r.error) {
          setError(r);
        } else {
          setOffer(r);
          setError(null);
          setCoupon(true);
        }
      });
    } else {
      setError({ error: "Please enter coupon code." });
    }
  }

  async function GetTAXapi() {
    await TaxGet().then((r) => setTaxRate(r.tax_rate));
  }

  function resetCoupon() {
    setOffer({
      discount_percentage: 0,
      maximum_discount_price: 1000,
      expiry_date: "2022-11-30",
    });
    setCoupon(false);
  }

  async function cartChecking() {
    if (userdata.email.length == 0) {
      nav("/login");
    } else {
      const data = {
        email: userdata.email,
        cart: cart,
      };

      await cartStockRecheck(data).then((r) => {
        if (r.error_cart) {
          cartEnd = r.error_cart;
          cartEnd.map((c) => {
            notification.error({
              message: (
                <div style={{  color: "black",fontSize:'13px',fontWeight:'500' }}>
                  Out of stock
                </div>
              ),
              description: (
                <span style={{  color: "black",fontSize:'13px',fontWeight:'500' }}>
                  Product {c.name.toLowerCase()} size {c.size} is out of stock <br />
                  Please move this item to Wishlist.
                </span>
              ),
             // Modification and addition by Om shrivastava on 01-12-23
        // REason : Create the popup class to apply the designing
        // className:'popupClass',
        style:{backgroundColor:"#f1cdd9"},
        // style:{backgroundColor: "#f1cdd9",
        // padding:'0px 5px 5px 5px',borderRadius:'10px',width:'200px'},
        // End of modification and addition by Om shrivastava on 01-12-23
        // REason : Create the popup class to apply the designing
              duration: 20,
            });
          });
        } else if (r.error_user) {
          // setUserData({
          //   email: "",
          //   name: "",
          //   contact:""
          // })
          // setCart([])
          notification.error({
            message: (
              <div style={{ fontSize: "18px", color: "white" }}>
                <br />
              </div>
            ),
            description: (
              <span>
                Your account is disabled! please contact to the our customer
                support.
              </span>
            ),
            style: {
              backgroundColor: "var(--backgroundColorPrimary)",
              color: "#212121",
            },
            duration: 20,
            key: 1,
          });
          //  firstTimeLoadFunctions()
          // nav("/login")
        } else {
          checkoutDetails["CouponDiscount"] = afterColumnTotalOfferAdd(
            offer,
            cart,
            taxRate
          ).coupon;
          DefaultShipping();
          nav("/placeorder");
        }
      });

      return cartSuccess;
    }
  }

  async function DefaultShipping() {
    checkoutDetails["shippingData"] = {};
    await shippingTickGet().then((r) =>
      r.map((s) => {
        if (s.isSelected) {
          // console.log("------------------------------", checkoutDetails);

          const shippingData = {
            firstname: s.firstname,
            lastname: s.lastname,
            street: s.street,
            houseno: s.houseno,
            city: s.city,
            state: s.state,
            zipcode: s.zipcode,
            country: s.country,
            number: s.number,
          };

          checkoutDetails["shippingData"] = shippingData;
        }
      })
    );
  }

  function validateWhitespace(evt, id) {
    var theEvent = evt || window.event;
    var key = 0;
    // Handle paste
    if (theEvent.type === "paste") {
      key = evt.clipboardData.getData("text/plain");
    } else {
      // Handle key press
      key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(key);
    }

    var regex = /\s/;
    if (
      document.getElementById(`${id}`).value.trim().length > 0 ||
      !regex.test(key)
    ) {
    } else {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) theEvent.preventDefault();
    }
  }

  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [drawerwidth, setDrawerwidth] = useState(600);

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [window.innerWidth]);

  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }

  useEffect(() => {
    if (windowSize.innerWidth < 500) setDrawerwidth(360);
    else if (windowSize.innerWidth < 800) setDrawerwidth(450);
    else if (windowSize.innerWidth > 800) setDrawerwidth(600);
  }, [windowSize]);

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.main}>
          {cart.length > 0 ? (
            <div className={styles.heading}>SHOPPING CART</div>
          ) : (
            <div style={{ marginTop: "70px" }}></div>
          )}

          {cart.length > 0 ? (
            cart.map((pro) => {
              var result = 0;
              if (cartEnd.length > 0)
                result = cartEnd.find((i) => i.id == pro.id);

              return (
                <div
                  style={{
                    borderBottom: "1px solid var(--borderColorPrimary)",
                    marginBottom: "25px",
                  }}
                >
                  {result ? (
                    <div
                      style={{
                        width: "100%",
                        marginBottom: "20px",
                        paddingLeft: "15px",
                        display: "flex",
                        background: "WHITE",
                      }}
                    >
                      <div className={styles.column1}>
                        <img
                          src={config.staticBaseURL + pro.img_main}
                          // style={{ width: "100%" }}
                          // Modification and addition by Om Shrivastava on 04-12-23
                          // Reason : Set the width and height 
                          // style={{ width: "140px",height:'170px' }} 
                          style={{ width:"135px",height:'165px' }} 
                          // End of Modification and addition by Om Shrivastava on 04-12-23
                          // Reason : Set the width and height 

                          onClick={(e) => openDetail(pro)}
                        ></img>
                      </div>
                      <div className={styles.column2}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <h3
                            className={style.heading}
                            style={{
                              width: "80%",
                              fontSize: "16px",
                              lineHeight: "26px",
                              letterSpacing: "2.5px",
                            }}
                          >
                            {pro.title}
                          </h3>
                          {/* <span className={style.delete} style={{fontSize:"32px",alignSelf:"start"}} onClick={e=>cartSave(pro)}>x</span> */}
                          <Popconfirm
                            placement="bottomLeft"
                            title={text}
                            onConfirm={(e) => confirm(pro)}
                            okText="OK"
                            cancelText="Cancel"
                          >
                            <span
                              className={style.delete}
                              style={{ fontSize: "25px", alignSelf: "start" }}
                            >
                              x
                            </span>
                          </Popconfirm>
                        </div>

                        <div
                          style={{
                            color: "var(--textColorPrimary)",
                            marginLeft: "20px",
                          }}
                          className={style.price}
                        >
                          {" "}
                          {currency.sign}{" "}
                          {(pro.price * currency.value).toFixed(2)}
                        </div>
                        <div
                          style={{
                            color: "black",
                            marginLeft: "20px",
                            marginTop: "8px",
                          }}
                        >
                          <span
                            className={style.size}
                            style={{ color: "var(--textColorPrimary)" }}
                          >
                            Size :
                          </span>
                          <span
                            className={style.showSize}
                            style={{ color: "var(--textColorPrimary)" }}
                          >
                            {" "}
                            {SizeGetter(pro.size)}
                          </span>
                        </div>
                        <div
                          style={{
                            color: "black",
                            marginLeft: "20px",
                            letterSpacing:'1.5px' ,lineHeight:'10px',paddingBottom:'4px',
                            marginTop: "4px",
                          }}
                        >
                          <span className={style.shipping} style={{fontSize:'12px',paddingBottom:'10px'}}>
                            Standard Shipping:
                          </span>
                          {/* {pro.ready_to_ship?
                <span className={style.shipping}> {pro.ready_to_ship_days}</span>:
                <span className={style.shipping}> {pro.shipping_days}</span>} */}
                        </div>

                        <div
                          style={{
                            height: "100px",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        ></div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          {/* <div style={{ color: "black", alignSelf: "start", marginLeft: "20px", color: "#8c8c8c" }}> Quantity</div> */}
                          <div
                            style={{
                              height: "20px",
                              width: "100px",
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <div style={{ width: "20px", marginRight: "10px" }}>
                              <div
                                className={styles.increament}
                                onClick={(e) => decreament(pro)}
                              >
                                <div
                                  style={{ cursor: "pointer", height: "auto" }}
                                >
                                  -
                                </div>
                              </div>
                            </div>
                            <input
                              type="text"
                              class="form-control"
                              style={{
                                width: "30px",
                                height: "20px",
                                border: "none",
                                padding: "4px",
                                textAlign: "center",
                              }}
                              value={pro.quantity}
                              ref={textInput}
                            />
                            <div style={{ width: "20px" }}>
                              <div
                                className={styles.increament}
                                onClick={(e) => increament(pro)}
                              >
                                <div
                                  style={{ cursor: "pointer", height: "auto" }}
                                >
                                  +
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          id={`style${pro.id}${pro.size}`}
                          style={{
                            display: "flex",
                            justifyContent: "end",
                            margin: "0 5%",
                            fontSize: ".8rem",
                            color: "red",
                            display: "none",
                          }}
                        >
                          No more stock Available
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={styles.columnContainer}
                      style={{
                        width: "100%",
                        marginBottom: "20px",
                        paddingLeft: "15px",
                        display: "flex",
                      }}
                    >
                      <div className={styles.column1}>
                        <img
                          src={config.staticBaseURL + pro.img_main}
                          // style={{ width: "100%" }}
                          // style={{ width: "140px",height:'170px' }}
                          style={{ width:"135px",height:'165px' }} 
                          onClick={(e) => openDetail(pro)}
                        ></img>
                      </div>
                      <div className={styles.column2}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <h3
                            className={style.heading}
                            style={{
                              maxWidth: "80%",
                              color: "black",
                              fontSize: "16px",
                              whiteSpace:
                                windowSize.innerWidth < 768
                                  ? "nowrap"
                                  : "normal",
                              lineHeight: "26px",
                              letterSpacing: "1px",
                              overflow:
                                windowSize.innerWidth < 768 ? "hidden" : "none",
                              textOverflow:
                                windowSize.innerWidth < 768
                                  ? "ellipsis"
                                  : "normal",
                            }}
                          >
                            {/* Modification and addition by Om Shirvastava on 02-12-23
                Reason : Add the lowercase property */}
                            {/* {pro.title} */}
                            {pro.title.toLowerCase()}
    {/*End of Modification and addition by Om Shirvastava on 02-12-23
                Reason : Add the lowercase property */}
                          </h3>
                          {/* <span className={style.delete} style={{fontSize:"32px",alignSelf:"start"}} onClick={e=>cartSave(pro)}>x</span> */}
                          <Popconfirm
                            placement="bottomLeft"
                            title={text}
                            onConfirm={(e) => confirm(pro)}
                            okText="OK"
                            cancelText="Cancel"
                          >
                            <MdClose fontSize={24} className={style.delete} />
                            {/* <span className={style.delete} style={{ fontSize: "25px", alignSelf: "start" }} >x</span> */}
                          </Popconfirm>
                        </div>

                        <div
                          style={{ color: "black", marginLeft: "20px" }}
                          className={style.price}
                        >
                          {" "}
                          {currency.sign}{" "}
                          {(pro.price * currency.value).toFixed(2)}
                        </div>
                        <div
                          style={{
                            color: "black",
                            marginLeft: "20px",
                            marginTop: "8px",
                          }}
                        >
                          <span className={style.size}>Size :</span>
                          <span className={style.showSize}>
                            {" "}
                            {SizeGetter(pro.size)}
                          </span>
                        </div>
                        <div
                          style={{
                            color: "black",
                            marginLeft: "20px",
                            letterSpacing:'1.5px' ,lineHeight:'10px',paddingBottom:'4px',
                            marginTop: "4px",
                          }}
                        >
                          <span className={style.shipping} style={{fontSize:'12px',paddingBottom:'10px'}}>
                            Standard Shipping:
                          </span>
                          {pro.ready_to_ship ? (
                            <span className={style.shipping} style={{fontSize:'12px',letterSpacing:'0.5px'}}>
                              {" "}
                              {pro.ready_to_ship_days}
                            </span>
                          ) : (
                            <span className={style.shipping} style={{fontSize:'12px',letterSpacing:'0.5px'}}>
                              {" "}
                              {pro.shipping_days}
                            </span>
                          )}
                        </div>

                        <div className={styles.gaping}></div>
                        {/* <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                      <div style={{ color: "black", alignSelf: "start", marginLeft: "20px", color: "#8c8c8c" }}> Quantity</div>
                      <div style={{ height: "20px", width: "100px", display: "flex", flexDirection: "row" }}>
                        <div style={{ width: "20px", height: "100%" }}>
                          <div className={styles.increament} onClick={e => decreament(pro)}>
                            <div style={{ cursor: "pointer", height: "auto" }}>-</div>
                          </div>
                        </div>
                        <input type="text" class="form-control" style={{ width: "30px", height: "100%", border: "none", padding: "4px", textAlign: "center" }} value={pro.quantity} ref={textInput} />
                        <div style={{ width: "20px", height: "100%" }}>
                          <div className={styles.increament} onClick={e => increament(pro)}>
                            <div style={{ cursor: "pointer", height: "auto" }}>+</div>
                          </div>
                        </div>
                      </div>
                    </div> */}
                        <div className={styles.qtyContainer}>
                          <div className={styles.operatorContainer}>
                            <span
                              className={styles.radius}
                              onClick={(e) => decreament(pro)}
                            >
                              <HiMinus fontSize={15} />
                            </span>
                            <span className={styles.quantity}>
                              {pro.quantity}
                            </span>
                            <span
                              className={styles.radius}
                              onClick={(e) => increament(pro)}
                            >
                              <HiPlus fontSize={15} />
                            </span>
                          </div>
                        </div>

                        <div
                          id={`style${pro.id}${pro.size}`}
                          style={{
                            display: "flex",
                            justifyContent: "end",
                            margin: "0 5%",
                            fontSize: ".8rem",
                            color: "red",
                            display: "none",
                          }}
                        >
                          No more stock Available
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div >
              {/* <div style={{ fontSize: "20px", color: "#7c7c7c", height: "100%", display: "flex", justifyContent: "center" }}>
              <span>Your Bag Is Empty</span>
               <div className={style.buttons} style={{ flexDirection: "column", background: "white" }}>
                <buton className={style.shopbtn2} style={{ width: "100%", margin: "5px" }} onClick={e => cartChecking()} >Go To Checkout</buton>
              </div> 
            </div> */}
<div className={style.cartEmptyImage}>
                <BsCartX  style={{width:'80px',height:'100px'}}/>
              </div>
              <div
                style={{
                  width: "100%",
                  // minHeight: "60vh",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignContent: "center",
                  marginTop:'4% auto'
                }}
              >
                <span
                  style={{
                    textAlign: "center",
                    fontSize: "15px",
                    lineHeight: "24px",
                    letterSpacing: "0.75px",
                    fontWeight: "500",
                  }}
                  className={styles.font}
                >
                  Your Shopping Cart is Empty.
                </span>
                <buton
                  className={styles.shopbtn2}
                  style={{
                    width: "70%",
                    margin: "1% auto",
                    fontSize: "14px",
                    cursor: "pointer",
                    letterSpacing: "2px",
                    textAlign: "center",
                    opacity: "1",
                    fontWeight: "700",
                    position: "relative",
                    fontWeight: "normal",
                    textTransform: "uppercase",
                    padding: "10px 18px",
                    fontFamily : 'var(--fontFamily)'
                  }}
                  onClick={(e) => nav("/")}
                >
                  BROWSE OUR CATALOG
                </buton>
              </div>
              
            </div>
          )}

          {cart.length > 0 ? (
            <div className={style.footerCon} style={{ width: "100%" }}>
              {/* <span>Total:</span><span>{getTotalPrice()}</span><span>Qty:</span><span>{getTotalQuantity()}</span><button onClick={BuyAll}>Buy ALl</button> */}
              <div className={style.inner}>
                {/* <div className={style.summ} >
                  SHOPPING SUMMARY
                </div> */}

                <div className={style.subTotal}>
                  <span
                    style={{
                      marginLeft: "15px",
                      textTransform: "uppercase",
                      fontWeight: "600",
                    }}
                  >
                    SubTotal
                  </span>
                  <span style={{ marginRight: "15px", fontWeight: "600" }}>
                    {currency.sign}{" "}
                    {(
                      afterColumnTotalOfferAdd(offer, cart, taxRate).subtotal *
                      currency.value
                    ).toFixed(2)}
                  </span>
                </div>
                <div className={style.subTotal}>
                  <span style={{ marginLeft: "15px", fontWeight: "600" }}>
                    SHIPPING CHARGES
                  </span>
                  <span style={{ marginRight: "15px", fontWeight: "600" }}>
                    {currency.sign}{" "}
                    {(
                      afterColumnTotalOfferAdd(offer, cart, taxRate).shipping *
                      currency.value
                    ).toFixed(2)}
                  </span>
                </div>

                {/* <div className={style.subTotal}>
                  <span style={{ marginLeft: "15px", fontWeight: "600" }}>GST CHARGES</span>
                  <span style={{ marginRight: "15px", fontWeight: "600" }}>{currency.sign} {(afterColumnTotalOfferAdd(offer, cart, taxRate).tax * currency.value).toFixed(2)}</span>
                </div> */}

                {/* Commented by - Ashish Dewangan on 15-02-2023
                Reason - To hide coupon/promocode functionality */}
                {/* <div className={style.promo}>

                  {!ShowCoupon && !offer.discount_percentage > 0 ? <> <input className="promoCode" id="prormos" type="text" onKeyPress={e => validateWhitespace(e, "prormos")} style={{ width: "90%", height: "35px", padding: "10px", marginLeft: "15px", border: "1px solid #dfdbdb", outline: "#fff" }} placeholder="Have a promocode" onChange={e => setError(null)}></input>
                    <button className={style.shopbtn2} style={{ marginRight: "15px", marginTop: "0px", height: "35px", textAlign: "center", letterSpacing: "2px", fontSize: "14px", fontWeight: "600",padding:"0" }} onClick={ApplyPromo}>APPLY</button>
                  </>
                    :
                    <div className={styles.successMsg}>
                      <span><i class="fa fa-check"></i>
                        Applied</span>
                      <span>{currency.sign} {(afterColumnTotalOfferAdd(offer, cart, taxRate).coupon * currency.value).toFixed(2)} off
                        <span style={{ marginLeft: "10px", textDecoration: "underline", cursor: "pointer" }} onClick={resetCoupon}>Remove</span></span>
                    </div>}

                </div>
                {error != null ? <Typography style={{ marginTop: "-10px", color: "red", fontSize: "14px", marginLeft: "15px" }}>{error.error}</Typography> : null} */}
                {/* End of comment */}
                {ShowCoupon ? (
                  <div className={style.subTotal}>
                    <span style={{ marginLeft: "15px", fontWeight: "600" }}>
                      Coupon Discount
                    </span>
                    <span style={{ marginRight: "15px", fontWeight: "600" }}>
                      - {currency.sign}{" "}
                      {(
                        afterColumnTotalOfferAdd(offer, cart, taxRate).coupon *
                        currency.value
                      ).toFixed(2)}
                    </span>
                  </div>
                ) : null}

                <div
                  className={style.subTotal}
                  style={{
                    marginTop: "10px",
                    paddingTop: "15px",
                    borderTop: "1px solid #f2f2f2",
                  }}
                >
                  <span
                    style={{
                      marginLeft: "15px",
                      fontWeight: "600",
                      fontSize: "20px",
                    }}
                  >
                    Total
                  </span>
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "600",
                      marginRight: "15px",
                      fontSize: "21px",
                      lineHeight: "32px",
                      letterSpacing: "3px",
                    }}
                  >
                    {currency.sign}{" "}
                    {(
                      afterColumnTotalOfferAdd(offer, cart, taxRate).Grand *
                      currency.value
                    ).toFixed(2)}
                  </span>
                </div>

                <div
                  className={styles.buttons}
                  style={{ flexDirection: "column" }}
                >
                  <buton
                    className={style.shopbtn1} 
                    style={{ width: "100%", margin: "5px" }}
                    onClick={(e) => cartChecking()}
                  >
                    GO TO CHECKOUT 
                  </buton>
                  <button
                    className={style.shopbtn1}
                    style={{ width: "100%", margin: "5px" }}
                    onClick={(e) => {
                      nav("/");
                    }}
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>


      </div>

      <div className={style.footerCon} style={{ width: "100%" }}>
        {/* <span>Total:</span><span>{getTotalPrice()}</span><span>Qty:</span><span>{getTotalQuantity()}</span><button onClick={BuyAll}>Buy ALl</button> */}
        <div className={style.inner}>
          {ImportantRules != null ? (
            <div
              className={styles.importantRules}
              // style={{ borderTop: "1px solid rgba(140,140,140,0.7)" }}
            >
              <h6
                style={{
                  fontSize: "14px",
                  lineHeight: "22px",
                  letterSpacing: "1.2px",
                  marginLeft: "40px",
                  color: "var(--textColorSecondary)",
                }}
              >
                IMPORTANTS
              </h6>
              <ul
                style={{
                  listStyleType: "disc",
                  listStylePosition: "outside",
                  marginRight: "15px",
                }}
              >
                {/* Addition by Om Shrivastava on 09-11-23
                Reason : Apply the condition when data is not show there */}
                {ImportantRules.point1 ? (
                  <div style={{ display: "flex" }}>
                    <BsDot
                      fontSize={20}
                      style={{ minWidth: "20px", minHeight: "20px" }}
                    />
                    <li
                      style={{
                        color: "var(--textColorSecondary)",
                        fontSize: "13px",
                        lineHeight: "20px",
                        letterSpacing: "1px",
                      }}
                    >
                      {ImportantRules.point1}
                    </li>
                  </div>
                ) : null}
                {/* End of addition by Om Shrivastava on 09-11-23
                Reason : Apply the condition when data is not show there */}
                 {/* Addition by Om Shrivastava on 09-11-23
                Reason : Apply the condition when data is not show there */}
                {ImportantRules.point2 ? (
                  <div style={{ display: "flex" }}>
                    <BsDot
                      fontSize={20}
                      style={{ minWidth: "20px", minHeight: "20px" }}
                    />
                    <li
                      style={{
                        color: "var(--textColorSecondary)",
                        fontSize: "13px",
                        lineHeight: "20px",
                        letterSpacing: "1px",
                      }}
                    >
                      {ImportantRules.point2}
                    </li>
                  </div>
                ) : null}
                 {/* End of addition by Om Shrivastava on 09-11-23
                Reason : Apply the condition when data is not show there */}
                 {/* Addition by Om Shrivastava on 09-11-23
                Reason : Apply the condition when data is not show there */}
                {ImportantRules.point3 ? (
                  <div style={{ display: "flex" }}>
                    <BsDot
                      fontSize={20}
                      style={{ minWidth: "20px", minHeight: "20px" }}
                    />
                    <li
                      style={{
                        color: "var(--textColorSecondary)",
                        fontSize: "13px",
                        lineHeight: "20px",
                        letterSpacing: "1px",
                      }}
                    >
                      {ImportantRules.point3}
                    </li>
                  </div>
                ) : null}
                {/* End of addition by Om Shrivastava on 09-11-23
                Reason : Apply the condition when data is not show there */}
                <div style={{ display: "flex" }}>
                  <BsDot
                    fontSize={20}
                    style={{ minWidth: "20px", minHeight: "20px" }}
                  />
                  <li
                    style={{
                      color: "var(--textColorSecondary)",
                      fontSize: "13px",
                      lineHeight: "20px",
                      letterSpacing: "1px",
                    }}
                  >
                    <Link
                      to="/custom"
                      style={{
                        color: "blue",
                        textDecoration: "underline",
                        fontSize: "13px",
                        lineHeight: "20px",
                        letterSpacing: "1px",
                      }}
                    >
                      Contact Us
                    </Link>{" "}
                    |{" "}
                    <Link
                      to="/delivery-policy"
                      style={{
                        color: "blue",
                        textDecoration: "underline",
                        fontSize: "13px",
                        lineHeight: "20px",
                        letterSpacing: "1px",
                      }}
                    >
                      Shipping Policy
                    </Link>
                  </li>
                </div>
              </ul>
            </div>
          ) : null}
        </div>
      </div>
      <div className={styles.sliderShow} style={{ marginTop: "-80px" }}>
        <div
          className={styles.columnContainer}
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          {JSON.parse(localStorage.getItem("recentview")) &&
          JSON.parse(localStorage.getItem("recentview")).length > 0 ? (
            <div
              className={styles.columnContainer}
              style={{
                width: "100vw",
                // Commented by Om shrivastava on 25-11-23
                // Reason : Need to remove the height of the div
                // height: "90vh",
                // End of commented code Commented by Om shrivastava on 25-11-23
                // Reason : Need to remove the height of the div
                marginBottom: "50px",
                zIndex: "0",
              }}
            >
              <>
                <Slider />
              </>
            </div>
          ) : null}
        </div>
        <div className={styles.foot}>
          <Footer />
          {/* Commented by - Ashish Dewangan on 15-02-2023
          Reason - To hide the text that appear below footer */}
          {/* <Below /> */}
          {/* End of comment */}
          {/* <Chat/> */}
        </div>
      </div>
    </>
  );
};

CartSItem.defaultProps = {
  image_src: "https://play.teleporthq.io/static/svg/default-img.svg",
  image_alt: "image",
  heading: "Heading",
  text: "Text",
  heading1: "Heading",
  button: "Button",
};

CartSItem.propTypes = {
  image_src: PropTypes.string,
  image_alt: PropTypes.string,
  heading: PropTypes.string,
  text: PropTypes.string,
  heading1: PropTypes.string,
  button: PropTypes.string,
};

export default CartSItem;
