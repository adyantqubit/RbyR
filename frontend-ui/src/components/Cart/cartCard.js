import React, { useRef, useState } from 'react'

import PropTypes from 'prop-types'
import "bootstrap/dist/css/bootstrap.min.css";


import style from '../global/cartCard.module.css'
import { useCartUpdateMutation, useGetLikedProductQuery } from '../../Redux-manage/services/userAuthapi'
import { CartState } from '../../context'
import { getToken } from '../../Redux-manage/services/localStorageService';
import config from '../../api/config';
import { display } from '@mui/system';
import{TiDeleteOutline} from 'react-icons/ti'
import { CartQuantityApi } from '../../api/service';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { BsWindowSidebar } from 'react-icons/bs';
import { DrawerFooter } from '../global/cart';

import Msg from '../concepts/msgConfirm';
import { Popconfirm,message } from 'antd';
import Navbar from '../global/NavHeader';
import Footer2 from '../global/footer2';
import Below from '../global/below';
import Footer from '../global/footer';


const text = 'are you sure to delete?';



const CartSItem = (props) => {

 const {cart,setCart}=CartState()
 
 const [cartsaveApi,{isLoad}]=useCartUpdateMutation()
 let textInput = React.createRef();
 const[con,setcon]=useState(true)
 const [sizeno,setSizeno]=useState(0)


const decreament=(CartProduct)=>{
 
  var index=cart.findIndex((p,i)=>{if(p.id===CartProduct.id)if(p.size==CartProduct.size){return i+1;}})
  var AllCartProduct=cart;

if(CartProduct.size=="Extra Extra Large"){
  if(CartProduct.quantity<=CartProduct.XXL+1){
    document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display="none"; 
  }
}
else if(CartProduct.size=="Extra Large"){
  if(CartProduct.quantity<=CartProduct.XL+1){
    document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display="none"; 
  }
  }
else if(CartProduct.size=="Large"){
  if(CartProduct.quantity<=CartProduct.L+1)
  {
    document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display="none"; 
    
  }
}
else if(CartProduct.size=="Medium"){
  if(CartProduct.quantity<=CartProduct.M+1){
    document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display="none"; 
  }
}
else if(CartProduct.size=="Short"){
  if(CartProduct.quantity<=CartProduct.S+1){
    document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display="none"; 
  }
}

if(AllCartProduct[index].quantity!=1){
  AllCartProduct[index].quantity-=1;
  increamentApi(CartProduct)
  setCart([...AllCartProduct])  
}
}


const increament=(CartProduct)=>{
  setcon(true)

  if(CartProduct.size=="Extra Extra Large"){
    if(CartProduct.quantity>=CartProduct.XXL){
      document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display="block"; 
      setcon(false)
    }
  }
  else if(CartProduct.size=="Extra Large"){
    if(CartProduct.quantity>=CartProduct.XL){
      document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display="block"; 
      setcon(false)
    }
    }
  else if(CartProduct.size=="Large"){
    if(CartProduct.quantity>=CartProduct.L)
    {
      document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display="block"; 
      setcon(false)
    }
  }
  else if(CartProduct.size=="Medium"){
    if(CartProduct.quantity>=CartProduct.M){
      document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display="block"; 
      setcon(false)
    }
  }
  else if(CartProduct.size=="Short"){
    if(CartProduct.quantity>=CartProduct.S){
      document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display="block"; 
      setcon(false)
    }
  }

  if(con){
  var index=cart.findIndex((p,i)=>{if(p.id===CartProduct.id)if(p.size==CartProduct.size){return i+1;}})
  var AllCartProduct=cart;
  AllCartProduct[index].quantity++
  setCart([...AllCartProduct])
  increamentApi(CartProduct)

}
}

 const cartSave=async(product)=>{
  
  const data={
    product_no:product.id,
    size:product.size
  }
  var access_token=localStorage.getItem('access_token')
  const resp=await cartsaveApi({data,access_token});

      if(cart.filter(l=>l.id===product.id).length>0){
       var p=cart.filter(i=>{if(i.id==product.id){if(i.size!=product.size)return i}else return i});
       setCart([...p])
       document.getElementById('style').style.display="none";
      
      }else{
        setCart([...cart,product])
      }

  }   

 

  const nav=useNavigate()
  function openDetail(id){
    nav(`/listing/${id.category}/detail/${id.id}`)
    window.location.reload(false)
  }


  async function increamentApi(data){
    var access_token=localStorage.getItem('access_token')
    await CartQuantityApi({data,access_token})
  }
  const confirm = (pro) => {
    cartSave(pro)
  };

  return (
    <> 
    <Navbar/>
    <div style={{width:"100%",background:"white",display:"flex",flexDirection:"row",justifyContent:"center",background:"#f2f2f2"}}>
    <div style={{width:"38%",background:"white"}}>
   
    <div style={{width:"100%",height:"10%",background:"#f2f2f2",display:"flex",flexDirection:"column",justifyContent:"center"}}>
    jdjdjkdkdk
    </div>
  {cart.length>0?cart.map(pro=>(
   
  
    
    <div  style={{width:"100%",height:"230px",marginBottom:"20px",paddingLeft:"15px",display:"flex",background:"#f2f2f2"}}>
    <img src={config.apiBaseURL+pro.img_main} style={{width:"30%",height:'230px'}} onClick={e=>openDetail(pro)}></img>
     <div style={{width:"65%",display:"flex",flexDirection:"column"}}>
             <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}> 
                <h3 className={style.heading} style={{color:"black",fontSize: "18px",lineHeight: "26px",letterSpacing: "2.5px"}}>{pro.title}</h3>
                {/* <span className={style.delete} style={{fontSize:"32px",alignSelf:"start"}} onClick={e=>cartSave(pro)}>x</span> */}
                <Popconfirm placement="bottomLeft" title={text} onConfirm={e=>confirm(pro)} okText="Yes" cancelText="No">
                 <span className={style.delete} style={{fontSize:"32px",alignSelf:"start"}} >x</span>
                </Popconfirm>
             </div>

              <div style={{color:"black",marginLeft:"20px"}} className={style.price}> ₹ {pro.price}</div>
              <div style={{color:"black",marginLeft:"20px",marginTop:"8px"}}>
                <span className={style.size}>Size :</span>
                <span className={style.showSize}> {pro.size}</span>  
              </div>
              <div style={{color:"black",marginLeft:"20px",marginTop:"8px"}}>
              {/* {pro.ready_to_ship?
                <span className={styles.shipping}> {pro.ready_to_ship_days}</span>:
                <span className={styles.shipping}> {pro.shipping_days}</span>} */}
              </div>

              <div style={{height:"100px",display:"flex",flexDirection:"column"}}></div>
              <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                    <div style={{color:"black",alignSelf:"start",marginLeft:"20px",color:"#8c8c8c"}}> Quantity</div>
                        <div style={{height:"20px",width:"100px",display:"flex",flexDirection:"row"}}>
                            <div style={{height:"20px",width:"10px",marginRight:"10px"}}>
                              <div style={{height:"6px",textAlign:"center",border:"2px solid white",background:"#ededed",borderRadius:"5px",padding:"0.5rem"}} onClick={e=>decreament(pro)}>
                                <span style={{position:"relative",top:"-25px",right:"4px",cursor:"pointer",fontSize:"30px"}}>-</span>
                              </div>
                            </div>
                            <input type="text" class="form-control" style={{width:"30px",height:"20px",border:"2px solid white",padding:"4px",textAlign:"center"}} value={pro.quantity} ref={textInput} />
                            <div style={{height:"20px",width:"10px"}}>
                                <div style={{height:"6px",textAlign:"center",border:"2px solid white",borderRadius:"5px",background:"#ededed",padding:"0.5rem"}} onClick={e=>increament(pro)}>
                                  <span style={{position:"relative",top:"-18px",right:"5px",cursor:"pointer",fontSize:"20px"}}>+</span>
                                </div>
                            </div>
                        </div>           
                  </div>
              <div id={`style${pro.id}${pro.size}`} style={{display:"flex",justifyContent:"end",margin:"0 5%",fontSize:".8rem",color:"red",textDecoration:"line-through",display:"none"}}>Out of stock
                  </div>
 
          </div>
    </div>

 
    
  )):<div style={{fontSize:"20px",color:"#7c7c7c",height:"100%",display:"flex",justifyContent:"center"}}><span>Your Bag Is Empty</span></div>}
          
    {cart.length>0?
    <div className={style.footerCon} style={{width:"100%"}}>
      {/* <span>Total:</span><span>{getTotalPrice()}</span><span>Qty:</span><span>{getTotalQuantity()}</span><button onClick={BuyAll}>Buy ALl</button> */}
      <div className={style.inner} >

       <div className={style.summ} >
        Shopping Summary
       </div>
        
        <div className={style.subTotal}>
         <span style={{marginLeft:"15px",textTransform:"uppercase"}}>SubTotal</span>
         <span style={{marginRight:"15px"}}>₹ 3000</span>

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
         <span style={{fontSize: "20px",marginRight:"15px",fontSize: "21px",lineHeight: "32px",letterSpacing: "3px"}}>₹ 4000</span>
        </div>

         <div className={style.buttons} >
            <button className={style.shopbtn1} >Continue Shopping</button>
            <buton className={style.shopbtn2} onClick={e=>{nav('/checkOut')}}>Go To Checkout</buton>
         </div>
      </div>
    </div>:null}
    
    
   
    </div>
    
    </div>
   
    </>
  )
}

CartSItem.defaultProps = {
  image_src: 'https://play.teleporthq.io/static/svg/default-img.svg',
  image_alt: 'image',
  heading: 'Heading',
  text: 'Text',
  heading1: 'Heading',
  button: 'Button',
}

CartSItem.propTypes = {
  image_src: PropTypes.string,
  image_alt: PropTypes.string,
  heading: PropTypes.string,
  text: PropTypes.string,
  heading1: PropTypes.string,
  button: PropTypes.string,
}

export default CartSItem 