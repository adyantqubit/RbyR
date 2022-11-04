import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cartDeleteApi } from '../../api/service'
import { CartState } from '../../context'
import { getToken } from '../../Redux-manage/services/localStorageService'
import Navbar from '../global/NavHeader'
import styles from './billing.module.css'






const Billing = () => {
    var{userdata,checkoutDetails,setCheckoutDetails,cart}=CartState()
    const nav=useNavigate()
    var [cond,setCon]=useState(false)
    

    // useEffect(()=>{
    // //   checkoutDetails=JSON.parse(sessionStorage.getItem('checkoutDetails'))
    // //   setCheckoutDetails(checkoutDetails)
    // //   console.log(JSON.parse(sessionStorage.getItem('checkoutDetails')))

    // },[])

    const getTotalPrice=(cart2)=>{
        var p=0;
        cart2.map(c=>p+=c.price*c.quantity)
        return p
      }

      const alertUser = (e) => {
        e.preventDefault();
        nav("/")
        e.returnValue = "";
      };

      useEffect(() => {
        console.log(checkoutDetails)

        window.onpopstate = e => {
          nav("/")
        };

        if(cart&&cart.length==0)
        nav("/")
        deleteFromCart()
      },[]);

      async function deleteFromCart(){ 
        var access=localStorage.getItem('access_token')
        await cartDeleteApi({access}).then(r=>cart=[])
      }     

  return (
    <>
    <Navbar/>
    <div className={styles.container}>
    <div className={styles.main} >
       {checkoutDetails.payment=="onlinepay"?
       <div className={styles.payBox}>
       <img src="https://res.cloudinary.com/dzzdidhrq/image/upload/v1667477149/download_1_ixxa8k.png"
       className={styles.img}/>
       <div className={styles.payTitle}>
       <div ><span className={styles.userinfoText}>Name:</span><span className={styles.userinfoText2} > Rohan kansari</span ></div>
       <div ><span className={styles.userinfoText}>Bank Name:</span><span className={styles.userinfoText2}> Rohan kansari</span></div>
       <div ><span className={styles.userinfoText}>Account Number:</span><span className={styles.userinfoText2}> 76839484738394</span></div>
       <div ><span className={styles.userinfoText}>UPI ID:</span><span className={styles.userinfoText2}> 6264170187@ybl</span></div>
       </div>
      </div>   
       :
       null
       } 
    </div>
    <div className={styles.main}>
        {checkoutDetails.userInfo?<div className={styles.invoice}>

            <div className={styles.head}>
              <div className={styles.headIn}>INVOICE</div>
            </div>

            <div className={styles.header}>
                <div className={styles.headerTexts}>
                    <div className={styles.columnitem1head}>BILLING To</div>
                    <hr style={{color:"black"}}></hr>
                    <div><span className={styles.userinfoText2} > {checkoutDetails.userInfo.firstname} {checkoutDetails.userInfo.lastname}</span></div>
                    <div><span className={styles.userinfoText2}> {checkoutDetails.billingData.street}, {checkoutDetails.billingData.houseno}</span><span className={styles.userinfoText2}> {checkoutDetails.billingData.city}, </span></div>
                    <div><span className={styles.userinfoText2}> {checkoutDetails.billingData.state}, </span><span className={styles.userinfoText2}> {checkoutDetails.billingData.country}, </span></div>
                    <div><span className={styles.userinfoText2}> {checkoutDetails.billingData.number}</span></div>
                </div>

                <div className={styles.headerTexts}>
                    <div className={styles.columnitem1head}>BILLING DETAILS</div>
                    <hr style={{color:"black"}}></hr>
                    <div><span className={styles.userinfoText}> Invoice Date: </span><span className={styles.userinfoText2}>{new Date().toISOString().slice(0, 10)}</span></div>
                    <div><span className={styles.userinfoText}>Order No:</span><span className={styles.userinfoText2}>{checkoutDetails.orderno}</span></div>
                </div>

                <div className={styles.headerTexts}>
                    <div className={styles.columnitem1head}>RByR The Shop, 123 , wall of street, Budhapara, Raipur</div>
                    <div><span className={styles.userinfoText}>+91 7867657678</span></div>
                    <div><span className={styles.userinfoText}>rbyr.official@gmail.com</span></div>
                </div>
            </div>

            <div className={styles.billingmain}>
                <div className={styles.billingheader}>
                   <span className={`${styles.columnitem1head} ${styles.header1}`} > Item Description</span>
                   <span className={`${styles.columnitem1head} ${styles.header2}`} > Quantity</span>
                   <span className={`${styles.columnitem1head} ${styles.header2}`} style={{borderRight:"1px solid black"}}> Price</span>
                </div>
                {checkoutDetails.cart.map(c=>
                     <div className={styles.billingheader2} style={{marginTop:"5px",background:"white"}}>
                     <span className={styles.protitle} > {c.title} ({c.size})</span>
                     <span className={styles.protitle2} > {c.quantity}</span>
                     <span className={styles.protitle2} style={{borderRight:"1px solid white"}}> {c.price*c.quantity}</span>
                  </div>
                    )}
               
                <div className={styles.billingfooter}>
                   <span className={`${styles.columnitem1head}`} style={{color:"white"}} >Subtotal -</span>
                   <span className={`${styles.columnitem1head} ${styles.header2}`} style={{borderRight:"1px solid black"}}>{getTotalPrice(checkoutDetails.cart)}</span>
                </div>

                <div className={styles.billingtexts}>
                   <span className={`${styles.columnitem1head}`}  >Discount -</span>
                   <span className={`${styles.columnitem1head} ${styles.header2}`} style={{color:"black"}} > 0</span>
                </div>
                <div className={styles.billingtexts}>
                   <span className={`${styles.columnitem1head}`}  >Shipping charges -</span>
                   <span className={`${styles.columnitem1head} ${styles.header2}`} style={{color:"black"}} > 0</span>
                </div>
                <div className={styles.billingtexts}>
                   <span className={`${styles.columnitem1head}`}  style={{color:"black",borderBottom:"1px solid black"}}></span>
                   <span className={`${styles.columnitem1head} ${styles.header2}`} style={{color:"black",borderBottom:"1px solid black"}} ></span>
                </div>
                <div className={styles.diffTotal}>
                <div className={styles.billingtexts2} >
                        <span className={`${styles.columnitem1head}`} >Payment Mode -</span>
                    <span className={`${styles.columnitem1head} ${styles.header2}`}  style={{color:"black"}}>{checkoutDetails.payment}</span>
                    </div>
                    <div className={styles.billingtexts2}>
                        <span className={`${styles.columnitem1head}`}  >Total -</span>
                    <span className={`${styles.columnitem1head} ${styles.header2}`} style={{color:"black"}} >{getTotalPrice(checkoutDetails.cart)}</span>
                    </div>
                </div>
                <div className={styles.billingheader} style={{height:"30px"}}>
                   
                </div>

            </div>

        </div>:null}
    </div>
  </div>
    </>
   
  )
}

export default Billing