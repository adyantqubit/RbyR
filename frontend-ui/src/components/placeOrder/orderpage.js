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
import {AiOutlineLeft} from 'react-icons/ai'
import { notification } from 'antd';
const Orderpage = (props) => {
  // notification.destroy()
  const { userdata, checkoutDetails, setCheckoutDetails, paymentflow, cart, setPaymentflow, shippingflow, setShipingflow } = CartState()
  const nav = useNavigate()


  useEffect(() => {
    if (!localStorage.getItem("access_token"))
      nav("/login")

   window.scrollTo(0,0)   
  }, [])

  const scroller = useRef()
  


  // const [windowSize, setWindowSize] = useState(getWindowSize());
  


  // useEffect(() => {
  //   function handleWindowResize() {
  //     setWindowSize(getWindowSize());
  //   }
  //   window.addEventListener('resize', handleWindowResize);

  //   return () => {
  //     window.removeEventListener('resize', handleWindowResize);
  //   };
  // }, [window.innerWidth]);

  // function getWindowSize() {
  //   const {innerWidth, innerHeight} = window;
  //   return {innerWidth, innerHeight};
  // }

  // useEffect(()=>{
    
  //   if(windowSize.innerWidth<800)
  //     document.getElementById("scrolled").style.top="12vh";
  //   else if(windowSize.innerWidth>800)
  //     document.getElementById("scrolled").style.top="23vh";

  // },[windowSize])


  return (
    <>
      <Navbar />
      <div className={styles.responsive}    >
        <div className={styles.head} ref={scroller}>
          <span className={styles.headText} onClick={e => nav("/cart")}><AiOutlineLeft style={{marginBottom:"2.5px"}}/> {` BACK TO CART`}</span>
        </div>
        <div className={styles.row} >
          <div className={styles.column1} >
            <UserInfo />

            {shippingflow ?
              <UsserAdresses />
              :
              <>
                <hr style={{ color: "black" }}></hr>
                <div className={styles.upnextForm} >
                  2. SHIPPING INFO
                </div>
                <hr style={{ color: "black" }}></hr>
              </>
            }

            {paymentflow ?
              <Payment  />
              :
              <>
                <div className={styles.upnextForm} >
                  3. PAYMENT METHOD
                </div>
                <hr style={{ color: "black" }} />
              </>
            }

          </div>
          <ProductListing />
        </div>

        <div className={styles.foot} >
          <Footer />
          <Below />
        </div>
      </div>
    </>
  )
}

export default Orderpage