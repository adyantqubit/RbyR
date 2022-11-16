import { Button, Drawer } from 'antd';
import React, { useEffect, useState } from 'react';
import { CartState } from '../../context';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import CartCard from './cartCard';
import style from './cartCard.module.css'
import styles from '../Cart/cart.module.css'
import { Modal, Space } from 'antd';

import './cart.css'
import { BsCartFill } from 'react-icons/bs';
import { useCartBuyAllMutation } from '../../Redux-manage/services/userAuthapi';
import { useNavigate } from 'react-router-dom';
import { CouponCheck, TaxGet } from '../../api/orderApis';
import { afterColumnTotalOfferAdd } from '../../Redux-manage/services/billing';
import { Typography } from '@mui/material';



const Cart= () => {

  
  const {openCartdrawer, setCartDrawer,cart} = CartState();

 
  const showDrawer = () => {
    setCartDrawer(true);
  };

  const onClose = () => {
    setCartDrawer(false);
  };

  const nav=useNavigate()
  function openCart( ){
    nav("/cart")
  }

  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [drawerwidth,setDrawerwidth]=useState(600)


  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [window.innerWidth]);

  function getWindowSize() {
    const {innerWidth, innerHeight} = window;
    return {innerWidth, innerHeight};
  }

  useEffect(()=>{
    if(windowSize.innerWidth<500)
     setDrawerwidth(380)
   else if(windowSize.innerWidth<800)
     setDrawerwidth(450)
    else if(windowSize.innerWidth>800)
    setDrawerwidth(600)
  },[windowSize])


  return (
    <>
      
    {/* < BsCartFill style={{marginTop:"10px",fontSize:"20px",color:"#7c7c7c"}} /> */}
    <span style={{height:"20px",overflow:"hidden"}}>
    {cart&&cart.length>0?<span class='badge badge-warning' id='lblCartCount'>{cart.length}</span>:null}
    {/* <i class="fa" >&#xf07a;</i> */}
    {cart&&cart.length>0?
    <i class="fa-solid fa-bag-shopping" style={{fontSize:"20px",position:"relative",bottom:"15px",color:"grey"}} onClick={openCart}></i>
    :
    <i class="fa-solid fa-bag-shopping" style={{fontSize:"20px",position:"relative",top:"10px",color:"grey"}} onClick={openCart}></i>
}
    </span>
      {/* <Button type="primary" onClick={showDrawer}>
        Open
      </Button> */}
      <Drawer title={<span style={{width:"100%",display:"flex",justifyContent:"center",fontSize: "18px",lineHeight: "26px",letterSpacing: "2.5px"}}>Shopping cart</span>} width={drawerwidth} placement="right" onClose={onClose} open={openCartdrawer} >
      <CartCard/>

      </Drawer>
    </>
  );
};

export default Cart;


export function DrawerFooter(){
 const {cart,setCartDrawer,currency,offer,setOffer,taxRate,setTaxRate}=CartState()
 const [UploadCartApi,{isLoading}]=useCartBuyAllMutation()
 const [cond,setCond]=useState([])
 const [error,setError]=useState(null)
 const [ShowCoupon,setCoupon]=useState(false)


const getTotalPrice=()=>{
  var p=0;
  cart.map(c=>p+=c.price*c.quantity)
  return p
}

useEffect(()=>{
  GetTAXapi()
  },[])

const getTotalQuantity=()=>{
  var q=0;
  cart.map(c=>q+=c.quantity);
  return q;
}

const erro = (r) => {
  Modal.error({
    title: r.error
  });

};

const nav=useNavigate();

 const BuyAll=async()=>{

  var data=cart;
  var access_token=localStorage.getItem('access_token')
   await UploadCartApi({data,access_token}).then(r=>console.log(r))
 }

 async function ApplyPromo(){
  var promocode=document.getElementsByClassName('promoCode')[0].value
  if(promocode.length>0)
  await CouponCheck(promocode).then(r=>{
    if(r.error){
      setError(r)
       erro(r) 
    }  
    else{
    setOffer(r)
    setError(null)
    setCoupon(true)
  }
  })

}

async function GetTAXapi(){
  await TaxGet().then(r=>setTaxRate(r.tax_rate))
}

function resetCoupon(){
  setOffer({discount_percentage: 0, maximum_discount_price: 1000, expiry_date: '2022-11-30'})
  setCoupon(false)
}

useEffect(()=>{
 console.log(afterColumnTotalOfferAdd(offer,cart,taxRate).coupon)
},[offer,taxRate])



 return (
    <>
    {cart.length>0?<div className={style.footerCon}>
      {/* <span>Total:</span><span>{getTotalPrice()}</span><span>Qty:</span><span>{getTotalQuantity()}</span><button onClick={BuyAll}>Buy ALl</button> */}
      <div className={style.inner}>

       <div className={style.summ} >
        Shopping Summary
       </div>
        
        <div className={style.subTotal}>
         <span style={{marginLeft:"15px",textTransform:"uppercase",fontWeight:"600"}}>SubTotal</span>
         <span style={{marginRight:"15px",fontWeight:"600"}}>₹ {getTotalPrice()}</span>

        </div>
        <div className={style.subTotal}>
         <span style={{marginLeft:"15px",fontWeight:"600"}}>Shipping</span>
         <span style={{marginRight:"15px",fontWeight:"600"}}>₹ {afterColumnTotalOfferAdd(offer,cart,taxRate).shipping}</span>
        </div>

        <div className={style.subTotal}>
         <span style={{marginLeft:"15px",fontWeight:"600"}}>GST Charges</span>
         <span style={{marginRight:"15px",fontWeight:"600"}}>₹ {afterColumnTotalOfferAdd(offer,cart,taxRate).tax}</span>
        </div>

        <div className={style.promo}>
         {!ShowCoupon? <> <input className="promoCode" type="text" style={{width:"60%",padding:"10px",height:"30px",marginLeft:"15px",border:"1px solid #dfdbdb",outline:"#fff"}} placeholder="Have a promocode" onChange={e=>setError(null)}></input>
          <button className={style.apply} onClick={ApplyPromo}>Apply</button>
          </>
         :<>
         <div className={styles.successMsg}>
          <span><i class="fa fa-check"></i>
          Applied</span>
          <span>₹ {afterColumnTotalOfferAdd(offer,cart,taxRate).coupon} off 
          <span style={{marginLeft:"10px",textDecoration:"underline",cursor:"pointer"}} onClick={resetCoupon}>Remove</span></span>
        </div>
       
       </>
        }
        </div>

        {error!=null?<Typography style={{marginTop:"-10px",color:"red",fontSize:"14px",marginLeft:"15px"}}>{error.error}</Typography>:null}

       {ShowCoupon?<div className={style.subTotal}>
        <span style={{marginLeft:"15px",fontWeight:"600"}}>Coupon Discount</span>
        <span style={{marginRight:"15px",fontWeight:"600"}}>- ₹ {afterColumnTotalOfferAdd(offer,cart,taxRate).coupon}</span>
       </div>:null}
        
        <hr style={{color:"black"}}></hr>
        <div className={style.subTotal} style={{marginTop:"25px"}}>
         <span style={{marginLeft:"15px",fontWeight:"600"}}>Total</span>
         <span style={{fontSize: "20px",fontWeight:"600",marginRight:"15px",fontSize: "21px",lineHeight: "32px",letterSpacing: "3px"}}>₹ {afterColumnTotalOfferAdd(offer,cart,taxRate).Grand}</span>
        </div>

         <div className={style.buttons} >
            <button className={style.shopbtn1} onClick={e=>setCartDrawer(false)}>Continue Shopping</button>
            <buton className={style.shopbtn2} onClick={e=>{nav('/placeorder');setCartDrawer(false)}}>Go To Checkout</buton>
         </div>
      </div>
    </div>:null}
    
    </>
  )
}