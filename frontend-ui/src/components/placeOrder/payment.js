import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { cartDeleteApi, invoiceApi } from '../../api/service';
import { CartState } from '../../context';
import { afterColumnTotalOfferAdd } from '../../Redux-manage/services/billing';
import { getToken } from '../../Redux-manage/services/localStorageService';
import styles from './order.module.css'
const Payment = () => {
    const{userdata,checkoutDetails,setCheckoutDetails,cart,setCart,offer,setOffer,taxRate,setTaxRate}=CartState()
    const nav=useNavigate()
    var[tick,setTick]=useState(false)
    var[tickop,setTickop]=useState(false)

    const{access_token,refresh_token}=getToken()


    function onSelect(){
      tick=!tick
      setTick(tick)
      if(tick==true){
      checkoutDetails['payment']="cod"
      document.getElementsByClassName('order_boxpay__5BlKK')[0].style.border="1px solid black"
      document.getElementsByClassName('order_boxpay__5BlKK')[1].style.border="1px solid black"

      tickop=false
      setTickop(tickop)
      }
      else
      checkoutDetails['payment']=""
    }

    function selectop(){
      tickop=!tickop
      setTickop(tickop)
      if(tickop==true){
      checkoutDetails['payment']="onlinepay"
      document.getElementsByClassName('order_boxpay__5BlKK')[0].style.border="1px solid black"
      document.getElementsByClassName('order_boxpay__5BlKK')[1].style.border="1px solid black"
      tick=false;
      setTick(tick)  
      }
      else
      checkoutDetails['payment']=""

    }

    async function submitAll(){
        if(checkoutDetails['payment']&&checkoutDetails['payment'].length>0){
           checkoutDetails['cart']=cart
           checkoutDetails['CouponDiscount']=afterColumnTotalOfferAdd(offer,cart,taxRate).coupon
           checkoutDetails['ShippingCharges']=afterColumnTotalOfferAdd(offer,cart,taxRate).shipping
           checkoutDetails['SubTotal']=afterColumnTotalOfferAdd(offer,cart,taxRate).subtotal
           checkoutDetails['tax']=afterColumnTotalOfferAdd(offer,cart,taxRate).tax
           checkoutDetails['grand']=afterColumnTotalOfferAdd(offer,cart,taxRate).Grand
           await invoiceApi(checkoutDetails,access_token).then(r=>{
            checkoutDetails['orderno']=r.order_no
            })
           sessionStorage.setItem('checkoutDetails',JSON.stringify(checkoutDetails))
           deleteFromCart()  
           nav("/billing")
        }
        else{
            document.getElementsByClassName('order_boxpay__5BlKK')[0].style.border="1px solid red"
            document.getElementsByClassName('order_boxpay__5BlKK')[1].style.border="1px solid red"
        }
    }

    async function deleteFromCart(){ 
      var access=localStorage.getItem('access_token')
      await cartDeleteApi({access}).then(r=>setCart([]))
    }  
  return (
    <div className={styles.columnitem3} style={{marginTop:"20px"}}>
          <div className={styles.columnitem1head}>3. PAYMENT</div>
          <div className={styles.boxpay}>
          <div style={{display:"flex",justifyContent:"space-between"}} onClick={onSelect}>
            <span className={styles.userinfoText}>Cash On Dilevery</span>
          {tick?
          <i class="fa-solid fa-check" style={{color:"black"}}></i>
          :
            null}

            </div>
          </div>
          <div className={styles.boxpay}>
          <div style={{display:"flex",justifyContent:"space-between"}} onClick={selectop}>
            <span className={styles.userinfoText}>Pay Online</span>
          {tickop?
          <i class="fa-solid fa-check" style={{color:"black"}}></i>
          :
            null}

            </div>
          </div>
          <button className={styles.userInfoButton} onClick={submitAll}>
            PLACE YOUR ORDER
          </button>
    </div>  )
}

export default Payment