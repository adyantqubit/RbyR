import { Button, Drawer, notification } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { CartState } from '../../context';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import CartCard from './cartCard';
import style from './cartCard.module.css'
import styles from '../Cart/cart.module.css'
import { Modal, Space } from 'antd';

import './cart.css'
import { BsCartFill } from 'react-icons/bs';
import { useCartBuyAllMutation } from '../../Redux-manage/services/userAuthapi';
import { useNavigate } from 'react-router-dom';
import { cartStockRecheck, CouponCheck, shippingTickGet, TaxGet } from '../../api/orderApis';
import { afterColumnTotalOfferAdd } from '../../Redux-manage/services/billing';
import { Typography } from '@mui/material';
import { MdOutlineArrowBack } from 'react-icons/md';
import '../../context.css'


const Cart = () => {


  const { openCartdrawer, setCartDrawer, cart,userdata } = CartState();


  const showDrawer = () => {
    setCartDrawer(true);
  };

  const onClose = () => {
    setCartDrawer(false);
  };

  const nav = useNavigate()
  function openCart() {
    nav("/cart")
  }

  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [drawerwidth, setDrawerwidth] = useState(600)


  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };


  }, [window.innerWidth]);

  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }

  useEffect(() => {
    if (windowSize.innerWidth < 500)
      setDrawerwidth(330)
    else if (windowSize.innerWidth < 800)
      setDrawerwidth(450)
    else if (windowSize.innerWidth > 800)
      setDrawerwidth(600)


  }, [windowSize])


  return (
    <>

      {/* < BsCartFill style={{marginTop:"10px",fontSize:"20px",color:"#7c7c7c"}} /> */}
      <span style={{ height: "20px",width:"20px" }} onClick={openCart}>
        {cart && cart.length > 0 ? <span class='badge badge-warning' id='lblCartCount'>{cart.length}</span> : null}
        {/* <i class="fa" >&#xf07a;</i> */}
        {cart && cart.length > 0 ?
          <i class="fa-solid fa-bag-shopping" style={{ fontSize: "20px", position: "relative", color: "yellow" }} ></i>
          :
          <i class="fa-solid fa-bag-shopping" style={{ fontSize: "20px", position: "relative", color: "yellow" }}></i>
        }
      </span>
      {/* <Button type="primary" onClick={showDrawer}>
        Open
      </Button> */}
      <Drawer title={<div className="likeTitle" style={{ whiteSpace: "nowrap" }}>Shopping Cart</div>}
        // title="Wishlist"
        width={drawerwidth}
        placement="right"
        onClose={onClose}
        closeIcon={<MdOutlineArrowBack className="likeSVG" />}
        open={openCartdrawer}
        headerStyle={{ height: "200px" ,backgroundColor:"var(--backgroundColorSecondary)"}}
        style={{ display: "flex", justifyContent: "center" }}
       bodyStyle={{backgroundColor:"var(--backgroundColorSecondary)"}}
        >
        <CartCard />

      </Drawer>
    </>
  );
};

export default Cart;


export function DrawerFooter() {
  var { cart, setCartDrawer, currency,userdata, offer, setOffer, taxRate, setTaxRate, cartEnd, setCartEnd, checkoutDetails } = CartState()
  const [UploadCartApi, { isLoading }] = useCartBuyAllMutation()
  const [cond, setCond] = useState([])
  const [error, setError] = useState(null)
  const [ShowCoupon, setCoupon] = useState(false)


  const getTotalPrice = () => {
    var p = 0;
    cart.map(c => p += c.price * c.quantity)
    return p
  }

  useEffect(() => {
    GetTAXapi()
  }, [])



  const getTotalQuantity = () => {
    var q = 0;
    cart.map(c => q += c.quantity);
    return q;
  }


  const nav = useNavigate();

  const BuyAll = async () => {

    var data = cart;
    var access_token = localStorage.getItem('access_token')
    await UploadCartApi({ data, access_token })
  }

  const promos = useRef()


  async function ApplyPromo() {

    var promocode = promos.current.value
    var token = localStorage.getItem("access_token")

    var data = {
      usertoken: token,
      promochar: promocode
    }

    if (promocode.length > 0) {
      await CouponCheck(data).then(r => {
        if (r.error) { 
          setError(r)
        }
        else {
          setOffer(r)
          setError(null)
          setCoupon(true)
        }
      })
    }
    else {
      setError({ "error": "Please enter coupon code." })
    }

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

  async function GetTAXapi() {
    await TaxGet().then(r => setTaxRate(r.tax_rate))
  }

  function resetCoupon() {
    setOffer({ discount_percentage: 0, maximum_discount_price: 1000, expiry_date: '2022-11-30' })
    setCoupon(false)
  }

 
  

  async function cartChecking() {
  

    if(userdata.email.length==0){
      nav("/login")
      setCartDrawer(false)
      // console.log('if parttt')
    }
    else{

    const data={
      email:userdata.email,
      cart:cart
    }

    
    await cartStockRecheck(data).then(r => {
      
      if (r.error_cart) {
        cartEnd = r.error_cart
        cartEnd.map(c => {
          notification.error({
            message: <div style={{  color: "black",fontSize:'13px',fontWeight:'500' }}>Out of stock</div>,
            description:
              <span style={{  color: "black",fontSize:'13px',fontWeight:'500' }}>Product {c.name.toLowerCase()} size {c.size} is out of stock <br />
                Please move this item  to Wishlist.</span>,
            // style: { backgroundColor: "var(--bannerColor)", color: "black" },
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
        })
      // console.log('if parttt')

      }
      else if(r.error_user){
        notification.error({
          message: <div style={{ fontSize: "18px", color: "white" }}><br/></div>,
          description:
            <span>Your account is disabled! please contact to the our customer support.</span>,
          style: { backgroundColor: "var(--bannerColor)", color: "#212121" },
          duration: 20,
          key:1

        });
        //  firstTimeLoadFunctions()
        // nav("/login")
      // console.log('else if parttt')

      }
      else {

        setCartDrawer(false)
        checkoutDetails['CouponDiscount'] = afterColumnTotalOfferAdd(offer, cart, taxRate).coupon
        DefaultShipping()
        nav("/placeorder")
        // console.log('else if else parttt')

      }
    })

  }
  }


  async function DefaultShipping() {
    checkoutDetails['shippingData'] = {};
    await shippingTickGet().then(r => r.map(s => {
      if (s.isSelected) {

        // console.log("------------------------------",s)
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

  return (
    <>
      {cart.length > 0 ? <div className={style.footerCon}>
        {/* <span>Total:</span><span>{getTotalPrice()}</span><span>Qty:</span><span>{getTotalQuantity()}</span><button onClick={BuyAll}>Buy ALl</button> */}
        <div className={style.inner}>

          <div className={style.summ} >
            Shopping Summary
          </div>

          <div className={style.subTotal}>
            <span style={{ marginLeft: "15px", fontWeight:'400' }}>SubTotal</span>
            <span style={{ marginRight: "15px",fontWeight: "600" }}>{currency.sign} {(getTotalPrice() * currency.value).toFixed(2)}</span>

          </div>
          <div className={style.subTotal}>
            <span style={{ marginLeft: "15px",fontWeight:'400'   }}>Shipping Charges</span>
            <span style={{ marginRight: "15px", fontWeight: "600" }}>{currency.sign} {(afterColumnTotalOfferAdd(offer, cart, taxRate).shipping * currency.value).toFixed(2)}</span>
          </div>
{/* 
          <div className={style.subTotal}>
            <span style={{ marginLeft: "15px", textTransform: "uppercase", fontWeight: "600" }}>GST Charges</span>
            <span style={{ marginRight: "15px", fontWeight: "600" }}>{currency.sign} {(afterColumnTotalOfferAdd(offer, cart, taxRate).tax * currency.value).toFixed(2)}</span>
          </div> */}
          {/* Commented by - Ashish Dewangan on 15-02-2023
          Reason - To hide promocode/offer functionality from cart drawer  */}
          {/* <div className={style.promo}>
            {!ShowCoupon && !offer.discount_percentage > 0 ? <> <input className="promoCode" id="prormos" type="text" onKeyPress={e => validateWhitespace(e, "prormos")} style={{ width: "60%", padding: "10px", height: "35px", marginLeft: "15px", border: "1px solid #dfdbdb", outline: "#fff" }} placeholder="Have a promocode" ref={promos} onChange={e => setError(null)}></input>
              <button className={style.shopbtn1} style={{ marginRight: "15px", marginTop: "0px", height: "35px", maxWidth: "35%", textAlign: "center", letterSpacing: "2px", fontSize: "14px", fontWeight: "600", padding: "0" }} onClick={ApplyPromo}>APPLY</button>
            </>
              : <>
                <div className={styles.successMsg}>
                  <span><i class="fa fa-check"></i>
                    Applied</span>
                  <span>{currency.sign} {afterColumnTotalOfferAdd(offer, cart, taxRate).coupon * currency.value} off
                    <span style={{ marginLeft: "10px", textDecoration: "underline", cursor: "pointer" }} onClick={resetCoupon}>Remove</span></span>
                </div>
              </>
            }
          </div>

          {error != null ? <Typography style={{ marginTop: "-10px", color: "red", fontSize: "14px", marginLeft: "15px" }}>{error.error}</Typography> : null}

          {ShowCoupon ? <div className={style.subTotal}>
            <span style={{ marginLeft: "15px", fontWeight: "600" }}>Coupon Discount</span>
            <span style={{ marginRight: "15px", fontWeight: "600" }}>- {currency.sign} {afterColumnTotalOfferAdd(offer, cart, taxRate).coupon * currency.value}</span>
          </div> : null} */}
          {/* End of comment */}
          <hr style={{ color: "black" }}></hr>
          <div className={style.subTotal}
           style={{
            // Commented by Om on 26-11-23 Reason : No need to show the gap
            //  marginTop: "25px",
            // End of Commented by Om on 26-11-23 Reason : No need to show the gap Reason 
           fontSize:"16px" }}>
            <span style={{ marginLeft: "15px", fontWeight: "600",fontSize:"18px" }}>Total</span>
            <span style={{ fontSize: "20px", fontWeight: "600", marginRight: "15px", fontSize: "21px", lineHeight: "32px", letterSpacing: "2px" }}>{currency.sign} {(afterColumnTotalOfferAdd(offer, cart, taxRate).Grand * currency.value).toFixed(2)}</span>
          </div>

          <div className={style.buttons} >
            <button className={style.shopbtn1} onClick={e => setCartDrawer(false)}>CONTINUE SHOPPING</button>
            <buton className={style.shopbtn1} onClick={e => { cartChecking() }}>GO TO CHECKOUT </buton>
          </div>
        </div>
      </div> : null}

    </>
  )
}