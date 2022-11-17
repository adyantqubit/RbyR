import React, { useState } from 'react'
import styles from './order.module.css'
import {TiTick} from 'react-icons/ti'
import { CartState } from '../../context'

const UserInfo = () => {
    const{userdata,checkoutDetails,setCheckoutDetails,shippingflow,setShipingflow}=CartState()
    const [cond,setCond]=useState(false)

    checkoutDetails['userInfo']={"firstname":userdata.name.substring(0,hasWhiteSpace(userdata.name)),"lastname":userdata.name.substring(hasWhiteSpaceforLast(userdata.name),userdata.name.length),"email":userdata.email}
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


    const handleSubmit = async(e) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);

        const userData={
            "firstname":data.get('first'),
            "lastname":data.get('last'),
            "email":data.get('email')
        }
        checkoutDetails['userInfo']=userData;     
        setCheckoutDetails(checkoutDetails)   
        setCond(true)
        setShipingflow(true)
    }

  return (
  <>
  {true?
  <>
   {/* when user info is sibmitted then this will appear */}
   <div className={styles.columnitem1_1}>
        <div className={styles.columnitem1head}>
            
            <span>1. USER DETAILS
            <TiTick style={{fontSize:"25px",color:"white",background:"black",borderRadius:"20px",marginLeft:"15px",position:"relative",bottom:"5px"}}/>    
            </span>

            {/* comment on 17/11/22-Rohan Kansari 
                purpose - hide changable functionality */}
            {/* <span style={{alignSelf:"flex-end",fontSize:"13px",lineHeight:"20px",letterSpacing:"1px"}} onClick={e=>setCond(false)}>change</span> */}
        
        </div>
        <div className={styles.usedetailShow}>
            <div ><span className={styles.userinfoText}>Username:</span><span className={styles.userinfoText2}> {checkoutDetails.userInfo.firstname} {checkoutDetails.userInfo.lastname}</span></div>
            <div ><span className={styles.userinfoText}>Email Address:</span><span className={styles.userinfoText2}> {checkoutDetails.userInfo.email}</span></div>
        </div>
    </div>
</>
  :
  <>
       <div className={styles.columnitem1}>
            <div className={styles.columnitem1head}>1. USER DETAILS</div>
            <form onSubmit={handleSubmit}>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='first'>FIRST NAME*</label>
                        {checkoutDetails.userInfo?
                        <input className={styles.firstInput} type="text" name="first" defaultValue={checkoutDetails.userInfo.firstname} required/>
                        :
                        <input className={styles.firstInput} type="text" name="first" defaultValue={userdata.name.substring(0,hasWhiteSpace(userdata.name))} required/>
                        }
                    </div>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='last'>LAST NAME*</label>
                        {checkoutDetails.userInfo?
                        <input className={styles.firstInput} type="text" name="last" defaultValue={checkoutDetails.userInfo.lastname} required/>
                        :
                        <input className={styles.firstInput} type="text" name="last" defaultValue={userdata.name.substring(hasWhiteSpaceforLast(userdata.name),userdata.name.length)} required/>
                        }
                    </div>
                </div>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='email'>Email ADDRESS*</label>
                        {checkoutDetails.userInfo?
                        <input className={styles.firstInput} type="text" name="email" defaultValue={checkoutDetails.userInfo.email} required/>
                        :
                        <input className={styles.firstInput} type="email" name="email" defaultValue={userdata.email} required/>
                        }
                    </div>
                </div>
                <button className={styles.userInfoButton}>
                    PROCEED TO SHIPPING
                </button>
            </form>
        </div>
  </>
  }
   
       
  </>
  )
}

export default UserInfo