import { notification, Typography } from 'antd';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { cartStockRecheck } from '../../api/orderApis';
import { cartDeleteApi, invoiceApi } from '../../api/service';
import { CartState } from '../../context';
import { afterColumnTotalOfferAdd } from '../../Redux-manage/services/billing';
import { getToken } from '../../Redux-manage/services/localStorageService';
import * as Icon from "react-icons/fi";
import style from "../global/cartCard.module.css"
import styles from './order.module.css'
import { IoMdCheckmark } from 'react-icons/io'
import Checkbox from "react-custom-checkbox";

const Payment = () => {
  var { userdata, checkoutDetails, setCheckoutDetails, cartEnd, currency, cart, setCart, offer, setOffer, taxRate, setTaxRate } = CartState()
  const nav = useNavigate()
  var [tick, setTick] = useState(false)
  var [tickop, setTickop] = useState(false)
  const [billingInfo, setBillingInfo] = useState(true)
  const [required, setRequired] = useState(false)

  const [buttonchng, setButtonchange] = useState(false)

  const { access_token, refresh_token } = getToken()


  function onSelect() {
    tick = !tick
    setTick(tick)
    if (tick == true) {
      checkoutDetails['payment'] = "cod"
      document.getElementById('cash').style.border = "1px solid black"
      document.getElementById('online').style.border = "1px solid black"
      setButtonchange(true)
      tickop = false
      setTickop(tickop)
    }
    else
      checkoutDetails['payment'] = ""
  }

  function selectop() {
    // tickop = !tickop
    tickop = true
    //added by - rohan -on -21/2/23
    //reason- To set by default cash option selected 
    setTickop(tickop)
    if (tickop == true) {
      checkoutDetails['payment'] = "onlinepay"
      document.getElementById('cash').style.border = "1px solid black"
      document.getElementById('online').style.border = "1px solid black"
      setButtonchange(true)

      tick = false;
      setTick(tick)
    }
    else
      checkoutDetails['payment'] = ""

  }

  async function cartChecking() {

    //commented by Rohan- 18/12/22
    //reason- adding -terms and condition check functionality
    if (billingInfo == false) {
      setRequired(true)
    } else {
      await cartStockRecheck(cart).then(r => {

        if (r.error) {
          console.log("error occurs")
          cartEnd = r.error
          cartEnd.map(c => {
            notification.error({
              message: <div style={{ fontSize: "18px", color: "white" }}>Out of stock</div>,
              description:
                `Product ${c.name} size ${c.size} is out of stock `,
              style: { backgroundColor: "#D2042D", color: "white" },
              duration: 20,
            });
          })
        }
        else {
          console.log("all done")
          submitAll()
        }
      })
    }
  }

  async function submitAll() {
    // if (checkoutDetails['payment'] && checkoutDetails['payment'].length > 0) {
    checkoutDetails['payment'] = "onlinepay"
    checkoutDetails['cart'] = cart
    //  checkoutDetails['CouponDiscount']=afterColumnTotalOfferAdd(offer,cart,taxRate).coupon
    checkoutDetails['ShippingCharges'] = afterColumnTotalOfferAdd(offer, cart, taxRate).shipping
    checkoutDetails['SubTotal'] = afterColumnTotalOfferAdd(offer, cart, taxRate).subtotal
    checkoutDetails['tax'] = afterColumnTotalOfferAdd(offer, cart, taxRate).tax
    checkoutDetails['grand'] = afterColumnTotalOfferAdd(offer, cart, taxRate).Grand
    checkoutDetails['currency_sign'] = currency.sign
    checkoutDetails['currency_value'] = currency.value
    checkoutDetails["promocode"] = offer.promocode
    checkoutDetails['date'] = new Date().toISOString().slice(0, 10)
    console.log(checkoutDetails)


    await invoiceApi(checkoutDetails, access_token).then(r => {

      if (r.error) {
        notification.error({
          message: <div style={{ fontSize: "18px", color: "white" }}>Sorry! Something went wrong. </div>,
          description:
            `Facing issue on generating bill please contact to Admin or again try to checkout `,
          style: { backgroundColor: "#D2042D", color: "white" },
          duration: 20,
        });
        nav("/cart")
        window.localStorage.clear()
      } else {
        checkoutDetails['orderno'] = r.order_no
        console.log(r)
        sessionStorage.setItem('checkoutDetails', JSON.stringify(checkoutDetails))
        deleteFromCart()
        nav("/billing")
      }

    })

    //commented by - Rohan
    //Reason - Commenting warning to select options
    // }
    // else {
    //   document.getElementById('cash').style.border = "1px solid red"
    //   document.getElementById('online').style.border = "1px solid red"
    // }
  }

  async function deleteFromCart() {
    var access = localStorage.getItem('access_token')
    await cartDeleteApi({ access }).then(r => setCart([]))
  }
  return (
    <div className={styles.columnitem3} style={{ marginTop: "20px" }}>
      <div className={styles.columnitem1head}>3. PAYMENT METHOD</div>

      <div className={styles.boxpay} id="online">
        <div style={{ display: "flex", justifyContent: "space-between" }} onClick={selectop}>
          <span className={styles.userinfoText}>Pay via Scanner</span>
          {/* {tickop ? */}
          {true ?
            <IoMdCheckmark style={{ fontSize: "25", color: "black", fontWeight: "20", backgroundColor: "transparent", border: "none" }} />
            :
            null}
        </div>
      </div>
      {/*commenting by -rohan Changing position of cash and online option */}

      <div className={styles.boxpay} id="cash">
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }} onClick={onSelect}>
          <strike className={styles.userinfoText}>Cash On Delivery</strike>
          <h6 style={{ fontSize: "12px" }}>(Currently not available)</h6>

          {tick ?
            <IoMdCheckmark style={{ fontSize: "25", color: "black", fontWeight: "20", backgroundColor: "transparent", border: "none" }} />
            :
            null}

        </div>
      </div>


      <div className={styles.boxpay} >

        <strike className={styles.userinfoText}>Pay via debit/credit cards</strike>
        <h6 style={{ fontSize: "12px" }}>(Currently not available)</h6>

      </div>


      <div className={styles.columnitem1content1} style={{ margin: "20px 0", justifyContent: "flex-start" }}>
        <Checkbox
          icon={<Icon.FiCheck color="white" size={16} style={{ background: "black" }} />}
          name="my-input"
          checked={billingInfo}
          onChange={(value, event) => {
            // console.log(billingInfo)
            setBillingInfo(value)
            setRequired(false)
          }}
          borderColor="#000"
          style={{ cursor: "pointer", width: "17px", marginLeft: "10px" }}
          labelStyle={{ marginLeft: 5, userSelect: "none" }}
          label={<label className={styles.firstName} htmlFor='street'
            style={{ fontSize: "14px", fontStyle: "bold", letterSpacing: "1.5px", paddingBottom: "2px" }}>
            I agree to {` `}
          </label>
          }
        />
        <Link to="/terms" target="_blank" style={{ fontSize: "15px", textDecoration: "underline", paddingTop: "5px" }}>
          {" "} Terms and conditions</Link>
        {required ? <Typography style={{ color: "red", fontSize: "13px", marginLeft: "30px" }}>Please accept terms and conditions.</Typography> : null}
      </div>


      <button className={buttonchng ? styles.userInfoButton3 : styles.userInfoButton} style={{ margin: "15px 5px", width: "300px", minHeight: "50px" }} onClick={e => cartChecking()}>
        PLACE YOUR ORDER
      </button>
    </div>)
}

export default Payment