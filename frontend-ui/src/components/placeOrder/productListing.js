import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import config from '../../api/config'
import { CartState } from '../../context'
import { afterColumnTotalOfferAdd } from '../../Redux-manage/services/billing'
import { SizeGetter } from '../global/getSize'
import styles from './order.module.css'

const ProductListing = () => {
  const { userdata, checkoutDetails, setCheckoutDetails, cart, currency, offer, setOffer, taxRate, setTaxRate } = CartState()
  const getTotalPrice = () => {
    var p = 0;
    cart.map(c => p += c.price * c.quantity)
    return p
  }

  const nav = useNavigate()

  useEffect(() => {
    if (typeof checkoutDetails.CouponDiscount != 'undefined') {

    }
    else
      nav("/cart")


  }, [])


  return (
    <div className={styles.column2}>

      <div className={styles.listHead}>
        <div className={styles.columnitem1head} >ORDER SUMMARY</div>
        <hr style={{ color: "black" }}></hr>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className={styles.sub}>Subtotal</div>
          <div className={styles.sub}>{currency.sign}{(afterColumnTotalOfferAdd(offer, cart, taxRate).subtotal * currency.value).toFixed(2)}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
          <div className={styles.sub}>Shipping Charges</div>
          <div className={styles.sub}>{currency.sign}{(afterColumnTotalOfferAdd(offer, cart, taxRate).shipping * currency.value).toFixed(2)}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
          <div className={styles.sub}>GST Charges</div>
          <div className={styles.sub}>{currency.sign}{(afterColumnTotalOfferAdd(offer, cart, taxRate).tax * currency.value).toFixed(2)}</div>
        </div>
        {/* Commented by - Ashish on 15-02-2023
        Reason - To hide coupen/promocode */}
        {/* <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
          <div className={styles.sub}>Offer Discount</div>
          <div className={styles.sub}>{currency.sign}{(afterColumnTotalOfferAdd(offer, cart, taxRate).coupon * currency.value).toFixed(2)}</div>
        </div> */}
        {/* ENd of comment */}
        <hr style={{ color: "black" }}></hr>
        <div style={{ marginTop: "-5px", display: "flex", justifyContent: "space-between" }}>
          <div className={styles.columnitem1head} style={{ marginTop: "-5px" }}>TOTAL</div>
          <div className={styles.columnitem1head} style={{ marginTop: "-5px" }} >{currency.sign}{(afterColumnTotalOfferAdd(offer, cart, taxRate).Grand * currency.value).toFixed(2)}</div>
        </div>
        <div className={styles.columnitem1head}>TOTAL ITEMS ({cart.length})</div>
        <hr style={{ color: "black" }}></hr>

        {cart.map(c =>
          <div className={styles.cartBox}>
            <img src={config.apiBaseURL + c.img_main} className={styles.img}></img>
            <div className={styles.productInfo}>
              <span className={styles.titlepro}>{c.title}</span>
              <span className={styles.userinfoText} style={{ color: "black" }}>{currency.sign}{(c.price * currency.value).toFixed(2)}</span>
              <div ><span className={styles.userinfoText}>Qty:</span><span className={styles.userinfoText2}> {c.quantity}</span></div>
              <div ><span className={styles.userinfoText}>Size:</span><span className={styles.userinfoText2}> {SizeGetter(c.size)}</span></div>
            </div>
          </div>
        )}

      </div>

    </div>
  )
}

export default ProductListing