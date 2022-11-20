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
import { CartState } from '../../context'

const UserProfile = () => {
 var {userdata}=CartState()

 function hasWhiteSpace(s) {
  var i=s.indexOf(' ');
  if(i==-1){
      return s.length
  }
  else{
      return i
  }
}

function hasWhiteSpaceforLast(s) {
  var i=s.indexOf(' ');
  if(i==-1){
      return 0;
  }
  else{
      return i
  }
}



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
       <div className={styles.columnitem1}>
            <div className={styles.columnitem1head}>1. USER DETAILS</div>
            <form>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='first'>FIRST NAME*</label>
                     
                        <input className={styles.firstInput} type="text" defaultValue={userdata.name.substring(0,hasWhiteSpace(userdata.name))} name="first" />
                       
                    </div>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='last'>LAST NAME*</label>
                   
                        <input className={styles.firstInput} type="text" defaultValue={userdata.name.substring(hasWhiteSpaceforLast(userdata.name),userdata.name.length)} name="last" />
                        
                    </div>
                </div>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='email'>Email ADDRESS*</label>
                     
                        <input className={styles.firstInput} type="email"  defaultValue={userdata.email} name="email"/>
                        
                    </div>
                </div>
                <button className={styles.userInfoButton}>
                    UPDATE PROFILE
                </button>
            </form>
        </div>
  </>
            </div>
          </div>
        </div>
      
    </div>
    <Footer/>
    </>
  )
}

export default UserProfile