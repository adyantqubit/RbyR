import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { CartState } from '../../context';
import Navbar from '../global/NavHeader';
import styles from './order.module.css'
import Payment from './payment';
import ProductListing from './productListing';
import UserInfo from './userInfo'
import UsserAdresses from './usserAdresses';
import { useLocation } from 'react-router-dom'
import Footer from '../global/footer';
import Below from '../global/below';

const Orderpage = () => {
  const{userdata,checkoutDetails,setCheckoutDetails,paymentflow,cart,setPaymentflow,shippingflow,setShipingflow}=CartState()
  const nav=useNavigate()
 

  useEffect(()=>{
    if(!localStorage.getItem("access_token"))
     nav("/login")
  },[])

  return (
    <>
    <Navbar/>
    <div className={styles.responsive}>
    <div className={styles.head}>
     <span className={styles.headText} onClick={e=> nav(-1)}>{`< Back To Cart`}</span> 
    </div>
    <div className={styles.row} >
       <div className={styles.column1} >
              <UserInfo/>

            {shippingflow?
              <UsserAdresses />
              :
              <>
              <hr style={{color:"black"}}></hr>

              <div className={styles.upnextForm} >
                2. SHIPPING INFO
              </div>
              <hr style={{color:"black"}}></hr>
              </>
            } 

            {paymentflow?
              <Payment/>
              :
              <>
                 <div className={styles.upnextForm} >
                 3. PAYMENT
                </div>
                <hr style={{color:"black"}}/>
              </>
           
            }
        
        </div>
        <ProductListing/>
    </div>

    <div className={styles.foot} >
     <Footer/>
     <Below/>
    </div>
    </div>
    </>   
  )
}

export default Orderpage