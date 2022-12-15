import { notification } from 'antd';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { cartStockRecheck } from '../../api/orderApis';
import { cartDeleteApi, invoiceApi } from '../../api/service';
import { CartState } from '../../context';
import { afterColumnTotalOfferAdd } from '../../Redux-manage/services/billing';
import { getToken } from '../../Redux-manage/services/localStorageService';
import styles from './order.module.css'
import {IoMdCheckmark} from 'react-icons/io'
const Payment = () => {
    var{userdata,checkoutDetails,setCheckoutDetails,cartEnd,currency,cart,setCart,offer,setOffer,taxRate,setTaxRate}=CartState()
    const nav=useNavigate()
    var[tick,setTick]=useState(false)
    var[tickop,setTickop]=useState(false)

    const{access_token,refresh_token}=getToken()


    function onSelect(){
      tick=!tick
      setTick(tick)
      if(tick==true){
      checkoutDetails['payment']="cod"
      document.getElementById('cash').style.border="1px solid black"
      document.getElementById('online').style.border="1px solid black"
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
      document.getElementById('cash').style.border="1px solid black"
      document.getElementById('online').style.border="1px solid black"
      tick=false;
      setTick(tick)  
      }
      else
      checkoutDetails['payment']=""

    }

    async function cartChecking(){
      await cartStockRecheck(cart).then(r=>{
    
        if(r.error){
          console.log("error occurs")
        cartEnd=r.error
        cartEnd.map(c=>{
          notification.error({
            message: <div style={{fontSize:"18px",color:"white"}}>Out of stock</div>,
            description:
            `Product ${c.name} size ${c.size} is out of stock `,
            style: { backgroundColor:"#D2042D",color:"white"},
            duration:20,
          });
        })
      }
      else{
        console.log("all done")
        submitAll()
      }
      })
    }

    async function submitAll(){
        if(checkoutDetails['payment']&&checkoutDetails['payment'].length>0){
           checkoutDetails['cart']=cart
          //  checkoutDetails['CouponDiscount']=afterColumnTotalOfferAdd(offer,cart,taxRate).coupon
           checkoutDetails['ShippingCharges']=afterColumnTotalOfferAdd(offer,cart,taxRate).shipping
           checkoutDetails['SubTotal']=afterColumnTotalOfferAdd(offer,cart,taxRate).subtotal
           checkoutDetails['tax']=afterColumnTotalOfferAdd(offer,cart,taxRate).tax
           checkoutDetails['grand']=afterColumnTotalOfferAdd(offer,cart,taxRate).Grand
           checkoutDetails['currency_sign']=currency.sign
           checkoutDetails['currency_value']=currency.value
           checkoutDetails['date']=new Date().toISOString().slice(0, 10)
           console.log(checkoutDetails)


           await invoiceApi(checkoutDetails,access_token).then(r=>{

            if(r.error){
              notification.error({
                message: <div style={{fontSize:"18px",color:"white"}}>Sorry! Something went wrong. </div>,
                description:
                `Facing issue on generating bill please contact to Admin `,
                style: { backgroundColor:"#D2042D",color:"white"},
                duration:20,
              });
            }else{
            checkoutDetails['orderno']=r.order_no
            console.log(r)
            sessionStorage.setItem('checkoutDetails',JSON.stringify(checkoutDetails))
              deleteFromCart()  
              nav("/billing")
            }

            })
           
        }
        else{
          document.getElementById('cash').style.border="1px solid red"
          document.getElementById('online').style.border="1px solid red"
        }
    }

    async function deleteFromCart(){ 
      var access=localStorage.getItem('access_token')
      await cartDeleteApi({access}).then(r=>setCart([]))
    }  
  return (
    <div className={styles.columnitem3} style={{marginTop:"20px"}}>
          <div className={styles.columnitem1head}>3. PAYMENT METHOD</div>
          <div className={styles.boxpay} id="cash">
          <div style={{display:"flex",justifyContent:"space-between"}} onClick={onSelect}>
            <span className={styles.userinfoText}>Cash On Delivery</span>
          {tick?
          <IoMdCheckmark style={{fontSize:"25",color:"black",fontWeight:"20",backgroundColor:"white",border:"none"}}/>
          :
            null}

            </div>
          </div>
          <div className={styles.boxpay} id="online">
          <div style={{display:"flex",justifyContent:"space-between"}} onClick={selectop}>
            <span className={styles.userinfoText}>Pay via Scanner</span>
          {tickop?
          <IoMdCheckmark style={{fontSize:"25",color:"black",fontWeight:"20",backgroundColor:"white",border:"none"}}/>
          :
            null}

            </div>
          </div>

          <div className={styles.boxpay} >
          
            <strike className={styles.userinfoText}>Pay via debit/credit cards</strike>
            <h6 style={{fontSize:"12px"}}>(Currently not available)</h6>
        
          </div>
          <button className={styles.userInfoButton} onClick={e=>cartChecking()}>
            PLACE YOUR ORDER
          </button>
    </div>  )
}

export default Payment