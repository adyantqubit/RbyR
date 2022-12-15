import React, { useEffect, useRef, useState } from 'react'

import PropTypes from 'prop-types'
import "bootstrap/dist/css/bootstrap.min.css";

import style from '../global/cartCard.module.css'
import { useCartUpdateMutation, useGetLikedProductQuery } from '../../Redux-manage/services/userAuthapi'
import { CartState } from '../../context'
import { getToken } from '../../Redux-manage/services/localStorageService';
import config from '../../api/config';
import { display } from '@mui/system';
import { TiDeleteOutline } from 'react-icons/ti'
import { CartQuantityApi } from '../../api/service';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { BsWindowSidebar } from 'react-icons/bs';
import { DrawerFooter } from '../global/cart';
import styles from './cart.module.css'
import Msg from '../concepts/msgConfirm';
import { Popconfirm, message, notification } from 'antd';
import Navbar from '../global/NavHeader';
import Footer2 from '../global/footer2';
import Below from '../global/below';
import { Modal, Space } from 'antd';

import Footer from '../global/footer';
import Slider from '../expandDetailt/slider';
import { cartStockRecheck, CouponCheck, ImpotantRuleGet, increamentCheck, shippingTickGet, TaxGet } from '../../api/orderApis';
import { afterColumnTotalOfferAdd, columnSubtotal } from '../../Redux-manage/services/billing';
import { Typography } from '@mui/material';


import { blue } from '@mui/material/colors';

const text = 'Are you sure you would like to remove this item from the shopping cart?';

const CartSItem = (props) => {
  notification.destroy()
  var { cart, setCart, CategoryProduct, checkoutDetails, currency, offer, setOffer, taxRate, setTaxRate, cartEnd, setCartEnd } = CartState()

  const [cartsaveApi, { isLoad }] = useCartUpdateMutation()
  let textInput = React.createRef();
  var [con, setcon] = useState(true)
  const [sizeno, setSizeno] = useState(0)
  const [error, setError] = useState(null)
  const [ShowCoupon, setCoupon] = useState(false)
  const [ImportantRules, setImportantRules] = useState(null)
  var [cartSuccess, setCartSuccess] = useState(false)


  useEffect(() => {
    GetTAXapi()
    ruleText()
    notification.destroy()

    // document.getElementById("scrolled").scrollTop=0
  }, [])

  async function ruleText() {
    await ImpotantRuleGet().then(r => setImportantRules(r))
  }

  const erro = (r) => {
    Modal.error({
      title: "No More Stock Available",
      style: { top: "30vh" }
    });

  };


  const decreament = (CartProduct) => {
    document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display = "none";

    var index = cart.findIndex((p, i) => { if (p.id === CartProduct.id) if (p.size == CartProduct.size) { return i + 1; } })
    var AllCartProduct = cart;

    if (CartProduct.size == "Extra Extra Large") {
      if (CartProduct.quantity <= CartProduct.XXL + 1) {
        document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display = "none";
      }
    }
    else if (CartProduct.size == "Extra Large") {
      if (CartProduct.quantity <= CartProduct.XL + 1) {
        document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display = "none";
      }
    }
    else if (CartProduct.size == "Large") {
      if (CartProduct.quantity <= CartProduct.L + 1) {
        document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display = "none";

      }
    }
    else if (CartProduct.size == "Medium") {
      if (CartProduct.quantity <= CartProduct.M + 1) {
        document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display = "none";
      }
    }
    else if (CartProduct.size == "Short") {
      if (CartProduct.quantity <= CartProduct.S + 1) {
        document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display = "none";
      }
    }

    if (AllCartProduct[index].quantity != 1) {
      AllCartProduct[index].quantity -= 1;
      increamentApi(CartProduct)
      setCart([...AllCartProduct])
    }
  }

  async function increamentApiMethodCall({ CartProduct, data }) {

    await increamentCheck(data).then(r => {
      if (r.success == true) {
        con = true;
        console.log("present in stock", r)
      }
      else if (r.error) {
        // document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display="block"; 
        notification.error({
          message: <div style={{ fontSize: "18px", color: "black" }}>Out Of Stock. </div>,
          description:
            `No More Stock Available`,
          className: "custom-class",
          style: { backgroundColor: "#8c8c8c", color: "black", marginTop: "10vh" },
          duration: 2,
          key: 1
        });
        con = false;
        console.log("stock is not present", r)
      }

    })


  }

  const increament = async (CartProduct) => {
    con = true;

    if (CartProduct.size == "Extra Extra Large") {

      var data = {
        id: CartProduct.id,
        quantity: CartProduct.quantity,
        size: "XXL"
      }
      await increamentApiMethodCall({ CartProduct, data })

      /* commented on 11/11/22  
        purpose- becuse it check only from frontend only. if want to re-implement then just put size on if condition
        becuse i am removing it from all if else condition
      */
      // if(CartProduct.quantity>CartProduct.XXL){
      //   document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display="block"; 
      //   con=false
      // }
    }
    else if (CartProduct.size == "Extra Large") {
      var data = {
        id: CartProduct.id,
        quantity: CartProduct.quantity,
        size: "XL"
      }
      await increamentApiMethodCall({ CartProduct, data })

    }
    else if (CartProduct.size == "Large") {
      var data = {
        id: CartProduct.id,
        quantity: CartProduct.quantity,
        size: "L"
      }
      await increamentApiMethodCall({ CartProduct, data })

    }
    else if (CartProduct.size == "Medium") {
      var data = {
        id: CartProduct.id,
        quantity: CartProduct.quantity,
        size: "M"
      }
      await increamentApiMethodCall({ CartProduct, data })

    }
    else if (CartProduct.size == "Short") {
      var data = {
        id: CartProduct.id,
        quantity: CartProduct.quantity,
        size: "S"
      }
      await increamentApiMethodCall({ CartProduct, data })

    }

    if (con) {
      var index = cart.findIndex((p, i) => { if (p.id === CartProduct.id) if (p.size == CartProduct.size) { return i + 1; } })
      var AllCartProduct = cart;
      AllCartProduct[index].quantity++
      setCart([...AllCartProduct])
      increamentApi(CartProduct)
    }

  }

  const cartSave = async (product) => {

    const data = {
      product_no: product.id,
      size: product.size
    }
    var access_token = localStorage.getItem('access_token')
    const resp = await cartsaveApi({ data, access_token });

    if (cart.filter(l => l.id === product.id).length > 0) {
      var p = cart.filter(i => { if (i.id == product.id) { if (i.size != product.size) return i } else return i });
      setCart([...p])
      document.getElementById('style').style.display = "none";

    } else {
      setCart([...cart, product])
    }

  }

  const nav = useNavigate()
  function openDetail(id) {
    nav(`/listing/${id.category}/detail/${id.id}`)
    // window.location.reload(false)
  }


  async function increamentApi(data) {
    var access_token = localStorage.getItem('access_token')
    await CartQuantityApi({ data, access_token }).then(r => console.log(r))
  }
  const confirm = (pro) => {
    cartSave(pro)
  };

  const getTotalPrice = () => {
    var p = 0;
    cart.map(c => p += c.price * c.quantity)
    return p
  }

  async function ApplyPromo() {
    var promocode = document.getElementsByClassName('promoCode')[0].value

    if (promocode.length > 0) {
      await CouponCheck(promocode).then(r => {
        if (r.error) {
          setError(r)
          console.log(r)
        }
        else {
          setOffer(r)
          setError(null)
          setCoupon(true)
        }
      })
    }
    else {
      setError({ "error": "Please enter coupon code" })
    }
  }

  async function GetTAXapi() {
    await TaxGet().then(r => setTaxRate(r.tax_rate))

  }

  function resetCoupon() {
    setOffer({ discount_percentage: 0, maximum_discount_price: 1000, expiry_date: '2022-11-30' })
    setCoupon(false)
  }

  useEffect(() => {
    console.log(afterColumnTotalOfferAdd(offer, cart, taxRate).coupon)
  }, [offer, taxRate])


  async function cartChecking() {
    await cartStockRecheck(cart).then(r => {

      if (r.error) {
        cartEnd = r.error
        cartEnd.map(c => {
          notification.error({
            message: <div style={{ fontSize: "18px", color: "white" }}>Out of stock</div>,
            description:
              <span>Product ${c.name} size ${c.size} is out of stock <br />
                Please move this item  to Wishlist.</span>,
            style: { backgroundColor: "#D2042D", color: "white" },
            duration: 20,

          });
        })
      }
      else {
        checkoutDetails['CouponDiscount'] = afterColumnTotalOfferAdd(offer, cart, taxRate).coupon
        DefaultShipping()
        nav("/placeorder")

      }
    })

    return cartSuccess;
  }


  async function DefaultShipping() {
    await shippingTickGet().then(r => r.map(s => {
      if (s.isSelected) {
        const shippingData = {
          firstname: s.firstname,
          lastname: s.lastname,
          street: s.street,
          houseno: s.houseno,
          city: s.city,
          state: s.state,
          zipcode: s.zipcode,
          country: s.country,
          number: s.number
        }

        checkoutDetails['shippingData'] = shippingData;
      }
    }
    ))
  }



  function validateWhitespace(evt, id) {
    var theEvent = evt || window.event;
    var key = 0
    // Handle paste
    if (theEvent.type === 'paste') {
      key = evt.clipboardData.getData('text/plain');
    } else {
      // Handle key press
      key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(key);
    }


    var regex = /\s/
    if (document.getElementById(`${id}`).value.trim().length > 0 || !regex.test(key)) {

    } else {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) theEvent.preventDefault();
    }
  }



  return (
    <>
      <Navbar />
      <div className={styles.container} >
        <div className={styles.main}>

          <div className={styles.heading}>
            SHOPPING CART
          </div>
          {cart.length > 0 ? cart.map(pro => {

            var result = 0
            if (cartEnd.length > 0)
              result = cartEnd.find(i => i.id == pro.id)


            return (
              <div >
                {result ? <div style={{ width: "100%", marginBottom: "20px", paddingLeft: "15px", display: "flex", background: 'WHITE' }}>

                  <img src={config.apiBaseURL + pro.img_main} className={styles.column1} onClick={e => openDetail(pro)}></img>
                  <div className={styles.column2}>


                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                      <h3 className={style.heading} style={{ width: "80%", color: "black", fontSize: "16px", lineHeight: "26px", letterSpacing: "2.5px" }}>{pro.title}</h3>
                      {/* <span className={style.delete} style={{fontSize:"32px",alignSelf:"start"}} onClick={e=>cartSave(pro)}>x</span> */}
                      <Popconfirm placement="bottomLeft" title={text} onConfirm={e => confirm(pro)} okText="OK" cancelText="Cancel">
                        <span className={style.delete} style={{ fontSize: "25px", alignSelf: "start" }} >x</span>
                      </Popconfirm>
                    </div>

                    <div style={{ color: "black", marginLeft: "20px" }} className={style.price}> {currency.sign} {(pro.price * currency.value).toFixed(2)}</div>
                    <div style={{ color: "black", marginLeft: "20px", marginTop: "8px" }}>
                      <span className={style.size}>Size :</span>
                      <span className={style.showSize}> {pro.size}</span>
                    </div>
                    <div style={{ color: "black", marginLeft: "20px", marginTop: "8px" }}>
                      <span className={style.shipping}>Standard Shipping:</span>
                      {/* {pro.ready_to_ship?
                <span className={style.shipping}> {pro.ready_to_ship_days}</span>:
                <span className={style.shipping}> {pro.shipping_days}</span>} */}
                    </div>

                    <div style={{ height: "100px", display: "flex", flexDirection: "column" }}></div>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                      <div style={{ color: "black", alignSelf: "start", marginLeft: "20px", color: "#8c8c8c" }}> Quantity</div>
                      <div style={{ height: "20px", width: "100px", display: "flex", flexDirection: "row" }}>
                        <div style={{ width: "20px", marginRight: "10px" }}>
                          <div className={styles.increament} onClick={e => decreament(pro)}>
                            <div style={{ cursor: "pointer", height: "auto" }}>-</div>
                          </div>
                        </div>
                        <input type="text" class="form-control" style={{ width: "30px", height: "20px", border: "none", padding: "4px", textAlign: "center" }} value={pro.quantity} ref={textInput} />
                        <div style={{ width: "20px" }}>
                          <div className={styles.increament} onClick={e => increament(pro)}>
                            <div style={{ cursor: "pointer", height: "auto" }}>+</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div id={`style${pro.id}${pro.size}`} style={{ display: "flex", justifyContent: "end", margin: "0 5%", fontSize: ".8rem", color: "red", display: "none" }}>No more stock Available
                    </div>

                  </div>
                </div> : <div style={{ width: "100%", marginBottom: "20px", paddingLeft: "15px", display: "flex", background: "white" }}>

                  <img src={config.apiBaseURL + pro.img_main} className={styles.column1} onClick={e => openDetail(pro)}></img>
                  <div className={styles.column2}>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                      <h3 className={style.heading} style={{ width: "80%", color: "black", fontSize: "16px", lineHeight: "26px", letterSpacing: "2.5px" }}>{pro.title}</h3>
                      {/* <span className={style.delete} style={{fontSize:"32px",alignSelf:"start"}} onClick={e=>cartSave(pro)}>x</span> */}
                      <Popconfirm placement="bottomLeft" title={text} onConfirm={e => confirm(pro)} okText="OK" cancelText="Cancel">
                        <span className={style.delete} style={{ fontSize: "25px", alignSelf: "start" }} >x</span>
                      </Popconfirm>
                    </div>

                    <div style={{ color: "black", marginLeft: "20px" }} className={style.price}> {currency.sign} {(pro.price * currency.value).toFixed(2)}</div>
                    <div style={{ color: "black", marginLeft: "20px", marginTop: "8px" }}>
                      <span className={style.size}>Size :</span>
                      <span className={style.showSize}> {pro.size}</span>
                    </div>
                    <div style={{ color: "black", marginLeft: "20px", marginTop: "8px" }}>
                      <span className={style.shipping}>Standard Shipping:</span>
                      {pro.ready_to_ship ?
                        <span className={style.shipping}> {pro.ready_to_ship_days}</span> :
                        <span className={style.shipping}> {pro.shipping_days}</span>}
                    </div>

                    <div className={styles.gaping}></div>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
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
                    </div>
                    <div id={`style${pro.id}${pro.size}`} style={{ display: "flex", justifyContent: "end", margin: "0 5%", fontSize: ".8rem", color: "red", display: "none" }}>No more stock Available
                    </div>

                  </div>
                </div>}

              </div>
            )



          }) :
            <div style={{ fontSize: "20px", color: "#7c7c7c", height: "100%", display: "flex", justifyContent: "center" }}><span>Your Bag Is Empty</span></div>}

          {cart.length > 0 ?
            <div className={style.footerCon} style={{ width: "100%", background: "white" }}>
              {/* <span>Total:</span><span>{getTotalPrice()}</span><span>Qty:</span><span>{getTotalQuantity()}</span><button onClick={BuyAll}>Buy ALl</button> */}
              <div className={style.inner} >

                <div className={style.summ} >
                  Shopping Summary
                </div>

                <div className={style.subTotal}>
                  <span style={{ marginLeft: "15px", textTransform: "uppercase", fontWeight: "600" }}>SubTotal</span>
                  <span style={{ marginRight: "15px", fontWeight: "600" }}>{currency.sign} {(afterColumnTotalOfferAdd(offer, cart, taxRate).subtotal * currency.value).toFixed(2)}</span>
                </div>
                <div className={style.subTotal}>
                  <span style={{ marginLeft: "15px", fontWeight: "600" }}>Shipping Charges</span>
                  <span style={{ marginRight: "15px", fontWeight: "600" }}>{currency.sign} {(afterColumnTotalOfferAdd(offer, cart, taxRate).shipping * currency.value).toFixed(2)}</span>
                </div>

                <div className={style.subTotal}>
                  <span style={{ marginLeft: "15px", fontWeight: "600" }}>GST Charges</span>
                  <span style={{ marginRight: "15px", fontWeight: "600" }}>{currency.sign} {(afterColumnTotalOfferAdd(offer, cart, taxRate).tax * currency.value).toFixed(2)}</span>
                </div>

                <div className={style.promo}>

                  {!ShowCoupon && !offer.discount_percentage > 0 ? <> <input className="promoCode" id="prormos" type="text" onKeyPress={e => validateWhitespace(e, "prormos")} style={{ width: "90%", height: "35px", padding: "10px", marginLeft: "15px", border: "1px solid #dfdbdb", outline: "#fff" }} placeholder="Have a promocode" onChange={e => setError(null)}></input>
                    <button className={style.shopbtn1} style={{ marginRight: "15px", marginTop: "0px", height: "35px", textAlign: "center", backgroundColor: "black", color: "white", letterSpacing: "2px", fontSize: "14px", fontWeight: "600" }} onClick={ApplyPromo}>Apply</button>
                  </>
                    :
                    <div className={styles.successMsg}>
                      <span><i class="fa fa-check"></i>
                        Applied</span>
                      <span>{currency.sign} {(afterColumnTotalOfferAdd(offer, cart, taxRate).coupon * currency.value).toFixed(2)} off
                        <span style={{ marginLeft: "10px", textDecoration: "underline", cursor: "pointer" }} onClick={resetCoupon}>Remove</span></span>
                    </div>}

                </div>
                {error != null ? <Typography style={{ marginTop: "-10px", color: "red", fontSize: "14px", marginLeft: "15px" }}>{error.error}</Typography> : null}

                {ShowCoupon ? <div className={style.subTotal}>
                  <span style={{ marginLeft: "15px", fontWeight: "600" }}>Coupon Discount</span>
                  <span style={{ marginRight: "15px", fontWeight: "600" }}>- {currency.sign} {(afterColumnTotalOfferAdd(offer, cart, taxRate).coupon * currency.value).toFixed(2)}</span>
                </div> : null}

                <div className={style.subTotal} style={{ marginTop: "25px" }}>
                  <span style={{ marginLeft: "15px", fontWeight: "600" }}>Total</span>
                  <span style={{ fontSize: "20px", fontWeight: "600", marginRight: "15px", fontSize: "21px", lineHeight: "32px", letterSpacing: "3px" }}>{currency.sign} {(afterColumnTotalOfferAdd(offer, cart, taxRate).Grand * currency.value).toFixed(2)}</span>
                </div>

                <div className={style.buttons} style={{ flexDirection: "column", background: "white" }}>
                  <button className={style.shopbtn1} style={{ width: "100%", margin: "5px" }} onClick={e => { nav('/') }}>Continue Shopping</button>

                  <buton className={style.shopbtn2} style={{ width: "100%", margin: "5px" }} onClick={e => cartChecking()} >Go To Checkout</buton>
                </div>
              </div>
            </div> : null}

        </div>

      </div>



      <div className={style.footerCon} style={{ width: "100%", background: "white",paddingTop:"20vh" }}>
        {/* <span>Total:</span><span>{getTotalPrice()}</span><span>Qty:</span><span>{getTotalQuantity()}</span><button onClick={BuyAll}>Buy ALl</button> */}
        <div className={style.inner} >

          {ImportantRules != null ?
            <div  className={styles.importantRules}>
              <h6 style={{ fontSize: "14px", lineHeight: "22px", letterSpacing: "1.2px", marginLeft: "15px" }}>IMPORTANTS</h6>
              <ul style={{ listStyleType: "disc", listStylePosition: "outside" }}>
                <li style={{ color: "#8c8c8c", fontSize: "13px", lineHeight: "20px", letterSpacing: "1px" }}>
                  {ImportantRules.point1}
                </li>
                <li style={{ color: "#8c8c8c", fontSize: "13px", lineHeight: "20px", letterSpacing: "1px" }}>
                  {ImportantRules.point2}
                </li>
                <li style={{ color: "#8c8c8c", fontSize: "13px", lineHeight: "20px", letterSpacing: "1px" }}>
                  {ImportantRules.point3}
                </li>
                <li style={{ color: "#8c8c8c", fontSize: "13px", lineHeight: "20px", letterSpacing: "1px" }}>
                  <Link to="/custom" style={{ color: "#8c8c8c", fontSize: "13px", lineHeight: "20px", letterSpacing: "1px" }}>Contact Us </Link> | <Link to="/delivery-policy" style={{ color: "#8c8c8c", fontSize: "13px", lineHeight: "20px", letterSpacing: "1px" }}>Shipping Policy</Link>
                </li>
              </ul>
            </div> : null}

        </div>
      </div>


      <div className={styles.sliderShow}>

        <div style={{ width: "100%", display: "flex", justifyContent: 'center', background: "white" }}>
          <div style={{ width: "100vw", height: "90vh", marginBottom: "50px", background: "white", zIndex: "0" }}>
            {JSON.parse(localStorage.getItem("recentview")) && JSON.parse(localStorage.getItem("recentview")).length > 0 ?
              <>
                <Slider />
              </>
              : null
            }
          </div>
        </div>
        <div className={styles.foot}>
          <Footer />
          <Below />
        </div>
      </div>
    </>
  )
}

CartSItem.defaultProps = {
  image_src: 'https://play.teleporthq.io/static/svg/default-img.svg',
  image_alt: 'image',
  heading: 'Heading',
  text: 'Text',
  heading1: 'Heading',
  button: 'Button',
}

CartSItem.propTypes = {
  image_src: PropTypes.string,
  image_alt: PropTypes.string,
  heading: PropTypes.string,
  text: PropTypes.string,
  heading1: PropTypes.string,
  button: PropTypes.string,
}

export default CartSItem 