import { Button, Drawer } from 'antd';
import React, { useState } from 'react';
import { CartState } from '../../context';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import CartCard from './cartCard';
import style from './cartCard.module.css'
import './cart.css'
import { BsCartFill } from 'react-icons/bs';
import { useCartBuyAllMutation } from '../../Redux-manage/services/userAuthapi';
import { useNavigate } from 'react-router-dom';



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
      <Drawer title={<span style={{width:"100%",display:"flex",justifyContent:"center",fontSize: "18px",lineHeight: "26px",letterSpacing: "2.5px"}}>Shopping cart</span>} width={600} placement="right" onClose={onClose} open={openCartdrawer} >
      <CartCard/>

      </Drawer>
    </>
  );
};

export default Cart;


export function DrawerFooter(){
 const {cart,setCartDrawer}=CartState()
 const [UploadCartApi,{isLoading}]=useCartBuyAllMutation()
 const [cond,setCond]=useState([])



const getTotalPrice=()=>{
  var p=0;
  cart.map(c=>p+=c.price*c.quantity)
  return p
}

const getTotalQuantity=()=>{
  var q=0;
  cart.map(c=>q+=c.quantity);
  return q;
}

const nav=useNavigate();

 const BuyAll=async()=>{

  var data=cart;
  var access_token=localStorage.getItem('access_token')
   await UploadCartApi({data,access_token}).then(r=>console.log(r))
 }

 return (
    <>
    {cart.length>0?<div className={style.footerCon}>
      {/* <span>Total:</span><span>{getTotalPrice()}</span><span>Qty:</span><span>{getTotalQuantity()}</span><button onClick={BuyAll}>Buy ALl</button> */}
      <div className={style.inner}>

       <div className={style.summ} >
        Shopping Summary
       </div>
        
        <div className={style.subTotal}>
         <span style={{marginLeft:"15px",textTransform:"uppercase"}}>SubTotal</span>
         <span style={{marginRight:"15px"}}>₹ {getTotalPrice()}</span>

        </div>
        <div className={style.subTotal}>
         <span style={{marginLeft:"15px"}}>Shipping</span>
         <span style={{marginRight:"15px"}}>₹ 0</span>
        </div>

        <div className={style.promo}>
          <input type="text" style={{width:"70%",height:"40px",marginLeft:"15px",border:"1px solid #dfdbdb",outline:"#fff"}} placeholder="Have a promocode"></input>
          <button className={style.shopbtn1} style={{marginRight:"15px"}}>Apply</button>
        </div>

        <div className={style.subTotal} style={{marginTop:"25px"}}>
         <span style={{marginLeft:"15px"}}>Total</span>
         <span style={{fontSize: "20px",marginRight:"15px",fontSize: "21px",lineHeight: "32px",letterSpacing: "3px"}}>₹ {getTotalPrice()}</span>
        </div>

         <div className={style.buttons} >
            <button className={style.shopbtn1} onClick={e=>setCartDrawer(false)}>Continue Shopping</button>
            <buton className={style.shopbtn2} onClick={e=>{nav('/checkOut')}}>Go To Checkout</buton>
         </div>
      </div>
    </div>:null}
    
    </>
  )
}