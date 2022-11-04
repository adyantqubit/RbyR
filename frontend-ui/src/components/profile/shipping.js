import React, { useEffect, useState } from 'react'
import { InvoiveGetApi, TransactionGetApi } from '../../api/service'
import Footer from '../global/footer'
import Navbar from '../global/NavHeader'
import style from "./profile.module.css"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { getOptionsFromChildren } from '@mui/base'
import { Link, useNavigate } from 'react-router-dom'
import styles from "../placeOrder/order.module.css"

const ShippingProfile = () => {

  return (
    <>
    <Navbar/>
    <div className={style.Container} style={{marginBottom:"26vh"}}>
        <div className={style.centerContainer}>
          <div className={style.containerHeader}>Homepage / My Account</div>
          <div className={style.main}>
            <div className={style.column1}>
              <div className={style.column1header}>MY ACCOUNT</div>
              <hr style={{color:"black"}}></hr>
              <div className={style.column1text}><Link to="/userprofile" style={{textDecoration:"none",color:"#8c8c8c"}}>MY PROFILE</Link></div>
              <div className={style.column1text}><Link to="/shippindprofile" style={{textDecoration:"none",color:"#8c8c8c"}}>MY SHIPPING DETAILS</Link></div>
              <div className={style.column1text}><Link to="/profile" style={{textDecoration:"none",color:"#8c8c8c"}}>MY ORDERS</Link></div>

            </div>
            <div className={style.column2}>
            <div className={style.column2header}>SHIPPING DETAILS</div>
            <hr style={{color:"black"}}></hr>

            <>
                <div className={styles.columnitem1content1}>
                <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='first'>FIRST NAME *</label>
      
                        <input className={styles.firstInput} name='firstb' required/>
                        
                    </div>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='b'>LAST NAME *</label>
                        <input className={styles.firstInput} name='lastb' required/>
                    </div>
                </div>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFullName}>
                        
                        <label className={styles.firstName} htmlFor='street'>Street name *</label>

                        <input className={styles.firstInput} name='streetb' required/>
                    </div>
                </div>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFullName}>
                        <label className={styles.firstName} htmlFor='street'>House/Apartment number *</label>

                        <input className={styles.firstInput} name='flatnob' required/>
                        
                    </div>
                </div>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='first'>City *</label>

                        <input className={styles.firstInput} name='cityb' required/>
                        
                    </div>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='last'>State / Province</label>
                        <input className={styles.firstInput} name='stateb' required/>
                    </div>
                </div>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='first'>Zip-code *</label> 
                        <input className={styles.firstInput} name='pincodeb' required/>
                    </div>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='last'>Country *</label>
                        <input className={styles.firstInput} name='countryb' required/>
                    </div>
                </div>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFullName}>
                        <label className={styles.firstName} htmlFor='street'>Phone Number *</label>
                       
                        <input className={styles.firstInput} name='numberb' required/>
                    
                    </div>
                </div>
                <button className={styles.userInfoButton} type='submit'>
                    ADD SHiPPING
                </button>
                </>
            </div>
          </div>
        </div>
      
    </div>
    <Footer/>
    </>
  )
}

export default ShippingProfile