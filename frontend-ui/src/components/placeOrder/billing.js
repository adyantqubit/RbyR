import React, { useEffect, useState, useRef} from 'react'
import { MdStackedLineChart } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import config from '../../api/config'
import { cartDeleteApi, getQrDetailApi, getStoreLocatorDetail } from '../../api/service'
import { CartState } from '../../context'
import { afterColumnTotalOfferAdd } from '../../Redux-manage/services/billing'
import { getToken } from '../../Redux-manage/services/localStorageService'
import Navbar from '../global/NavHeader'
import styles from './billing.module.css'
import style from '../global/cartCard.module.css'
import ReactToPrint from 'react-to-print';
import parse from "html-react-parser";
import Footer from '../global/footer'
import Below from '../global/below'






const Billing = () => {
    var{userdata,checkoutDetails,setCheckoutDetails,cart,setCart,currency,offer,setOffer,taxRate,setTaxRate}=CartState()
    const nav=useNavigate()
    var [cond,setCon]=useState(false)
    var [onlineDetail,setonlineDetail]=useState({})
    const componentRef = useRef();

    const [storeLocatorDetails, setStoreLocator] = useState(null);
    useEffect(() => {
      getStoreLocator();
    }, []);
  
    const getStoreLocator = async () => {
      const storeLocatorData = await getStoreLocatorDetail();
      if (storeLocatorData) {
        setStoreLocator(storeLocatorData);
      }
    };

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
        qrDetails()

        window.onpopstate = e => {
          nav("/")
        };

        // if(cart&&cart.length==0)
        //   nav("/")

      },[]);

      async function qrDetails(){
        await getQrDetailApi().then(r=>{
          try{
            const data={
              name:r.name,
              account_number:r.account_number,
              bank_name:r.bank_name,
              qr_img:r.qr_img,
              upi_id:r.upi_id
            }
          setonlineDetail(data)
          }
          catch{
            setonlineDetail(null)
          }
        })
       }

    

  return (
    < >
    <Navbar/>
    <div className={styles.container} >
     <div className={styles.main}>
        {checkoutDetails.payment=="onlinepay"?
          onlineDetail!=null?
        <div className={styles.payBox}>
        <img src={config.apiBaseURL+onlineDetail.qr_img}
        className={styles.img}/>
        <div className={styles.payTitle}>
        <div >
          <div ><span className={styles.userinfoText}>Name:</span><span className={styles.userinfoText2} >{onlineDetail.name}</span ></div>
          <div ><span className={styles.userinfoText}>Bank Name:</span><span className={styles.userinfoText2}>{onlineDetail.bank_name}</span></div>
          <div ><span className={styles.userinfoText}>Account Number:</span><span className={styles.userinfoText2}>{onlineDetail.account_number}</span></div>
          <div ><span className={styles.userinfoText}>UPI ID:</span><span className={styles.userinfoText2}>{onlineDetail.upi_id}</span></div>
        </div>
        <div style={{height:"60px",width:"100%"}}><span className={styles.userinfoText2} style={{lineBreak:"normal",wordBreak:'keep-all'}}> Please Confirm To admin After paying  at {storeLocatorDetails!=null? parse(storeLocatorDetails[0].phoneNumber):null}</span></div>
        </div>
        </div>  : <div>The qr Code getting error</div>
        :
        null
        } 
     </div>   
    <ReactToPrint
        trigger={() =><div style={{width:"100%",display:"flex",justifyContent:"center",background:"#f2f2f2"}}> <button className={style.shopbtn1} style={{width:"50%"}} onClick={e=>nav('/')}>Print this out</button> </div>}     
        content={() => componentRef.current}
      />

    <div className={styles.main}  >
        {checkoutDetails.userInfo?<div className={styles.invoice} >
          <div  ref={componentRef}>
            <div className={styles.head}>
              <div className={styles.headIn}>INVOICE</div>
            </div>

            <div className={styles.header}>
                <div className={styles.headerTexts}>
                    <div className={styles.columnitem1head}>BILLING To</div>
                    <hr style={{color:"black"}}></hr>
                    <div><span className={styles.userinfoText2} > {checkoutDetails.billingData.firstname} {checkoutDetails.billingData.lastname}</span></div>
                    <div><span className={styles.userinfoText2}> {checkoutDetails.billingData.street}, {checkoutDetails.billingData.houseno}</span><span className={styles.userinfoText2}> {checkoutDetails.billingData.city}, </span></div>
                    <div><span className={styles.userinfoText2}> {checkoutDetails.billingData.state}, </span><span className={styles.userinfoText2}> {checkoutDetails.billingData.country}, </span></div>
                    <div><span className={styles.userinfoText2}> {checkoutDetails.billingData.number}</span></div>
                </div>
 
                <div className={styles.headerTexts}>
                    <div className={styles.columnitem1head}>BILLING DETAILS</div>
                    <hr style={{color:"black"}}></hr>
                    <div><span className={styles.userinfoText}> Invoice Date: </span><span className={styles.userinfoText2}>{new Date().toISOString().slice(0, 10)}</span></div>
                    <div><span className={styles.userinfoText}>Order No:</span><span className={styles.userinfoText2}>{checkoutDetails.orderno}</span></div>
                    <div><span className={styles.userinfoText}>Payment Mode:</span><span className={styles.userinfoText2}>{checkoutDetails.payment}</span></div>
                </div>

               {storeLocatorDetails!=null?
               <div className={styles.headerTexts}>
               <div className={styles.columnitem1head}>{parse(storeLocatorDetails[0].address)}</div>
               <div><span className={styles.userinfoText}>{parse(storeLocatorDetails[0].phoneNumber)}</span></div>
               <div><span className={styles.userinfoText}>{parse(storeLocatorDetails[0].email)}</span></div>
           </div>:null}
                
            </div>

            <div style={{width:"100%",textAlign:"center",padding:"15px"}}>
              <span className={styles.columnitem1head}>
                Shipping To-
              </span>
              <span className={styles.userinfoText2}>{checkoutDetails.shippingData.firstname} {checkoutDetails.shippingData.lastname}, {checkoutDetails.shippingData.street} {checkoutDetails.shippingData.houseno}, {checkoutDetails.shippingData.city} -{checkoutDetails.shippingData.zipcode}, {checkoutDetails.shippingData.state} {checkoutDetails.shippingData.country}, {checkoutDetails.shippingData.number} 
              </span>
            </div>

            <div className={styles.billingmain}>
                <div className={styles.billingheader}>
                   <span className={`${styles.columnitem1head} ${styles.header1}`} > Item Description</span>
                   <span className={`${styles.columnitem1head} ${styles.header2}`} > Quantity</span>
                   <span className={`${styles.columnitem1head} ${styles.header2}`} > Price</span>
                   <span className={`${styles.columnitem1head} ${styles.header2}`} style={{borderRight:"1px solid black"}}>Total</span>

                </div>
                {checkoutDetails.cart.map(c=>
                     <div className={styles.billingheader2} style={{marginTop:"5px",background:"white"}}>
                     <span className={styles.protitle} > {c.title} ({c.size})</span>
                     <span className={styles.protitle2} > {c.quantity}</span>
                     <span className={styles.protitle2} >{currency.sign} {(c.price*currency.value).toFixed(2)}</span>
                     <span className={styles.protitle2} style={{borderRight:"1px solid white"}}> {currency.sign}{(c.price*c.quantity*currency.value).toFixed(2)}</span>
                  </div>
                    )}
               
                <div className={styles.billingfooter}> 
                   <span className={`${styles.columnitem1head}`} style={{color:"white"}} >Subtotal -</span>
                   <span className={`${styles.columnitem1head} ${styles.header2}`} style={{borderRight:"1px solid black", whiteSpace:"nowrap"}}>{currency.sign} {(afterColumnTotalOfferAdd(offer,checkoutDetails.cart,taxRate).subtotal *currency.value).toFixed(2)}</span>
                </div>

                <div className={styles.billingtexts}>
                   <span className={`${styles.columnitem1head}`}  >Discount -</span>
                   <span className={`${styles.columnitem1head} ${styles.header2}`} style={{color:"black"}} >- {currency.sign} {checkoutDetails.CouponDiscount?checkoutDetails.CouponDiscount:(afterColumnTotalOfferAdd(offer,checkoutDetails.cart,taxRate).coupon *currency.value).toFixed(2)}</span>
                </div>
                <div className={styles.billingtexts}>
                   <span className={`${styles.columnitem1head}`}  >Shipping charges -</span>
                   <span className={`${styles.columnitem1head} ${styles.header2}`} style={{color:"black"}} > {currency.sign} {(afterColumnTotalOfferAdd(offer,checkoutDetails.cart,taxRate).shipping *currency.value).toFixed(2)}</span>
                </div>
                <div className={styles.billingtexts}>
                   <span className={`${styles.columnitem1head}`}  >GST Charges -</span>
                   <span className={`${styles.columnitem1head} ${styles.header2}`} style={{color:"black",whiteSpace:"nowrap"}} > {currency.sign} {(afterColumnTotalOfferAdd(offer,checkoutDetails.cart,taxRate).tax *currency.value).toFixed(2)}</span>
                </div>
                <div className={styles.billingtexts}>
                   <span className={`${styles.columnitem1head}`}  style={{color:"black",borderBottom:"1px solid black"}}></span>
                   <span className={`${styles.columnitem1head} ${styles.header2}`} style={{color:"black",borderBottom:"1px solid black"}} ></span>
                </div>
               
                   <div className={styles.billingtexts}>
                      <span className={`${styles.columnitem1head}`}  >Grand Total - </span>
                      <span className={`${styles.columnitem1head} ${styles.header2}`} style={{color:"black",whiteSpace:"nowrap"}} > {currency.sign} {(afterColumnTotalOfferAdd(offer,checkoutDetails.cart,taxRate).Grand *currency.value).toFixed(2)}</span>
                   </div>
                
                <div className={styles.billingheader} style={{height:"30px"}}>
                   
                </div>

            </div>

           
            </div>
        </div>:null}
    </div>

     <div style={{width:"100%",display:"flex",justifyContent:"center",background:"#f2f2f2"}}> <button className={style.shopbtn1} style={{width:"50%"}} onClick={e=>nav('/')}>Continue Shopping</button>
   
     </div>

     <div className={styles.foot} >
     <Footer/>
     <Below/>
    </div>
  </div >
    </>
   
  )
}

export default Billing