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
import Slider from '../expandDetailt/slider';


const text = 'are you sure to delete?';



const CartSItem = (props) => {

 const {cart,setCart,CategoryProduct,currency}=CartState()
 
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
    await CartQuantityApi({data,access_token}).then(r=>console.log(r))
  }
  const confirm = (pro) => {
    cartSave(pro)
  };

  const getTotalPrice=()=>{
    var p=0;
    cart.map(c=>p+=c.price*c.quantity)
    return p
  }

  return (
    <> 
    <Navbar/>
 <div style={{position:"relative",top:"26vh",width:"100%",background:"white",display:"flex",justifyContent:"center"}}>
    <div style={{width:"50%",background:"white"}}>
   
    <div style={{width:"100%",height:"80px",marginBottom:"50px",background:"white",display:"flex",flexDirection:"column",justifyContent:"center",fontSize:"18px",lineHeight:"26px",letterSpacing: "2.5px",fontWeight:"500",borderBottom:"1px solid black"}}>
    SHOPPING CART
    </div>
  {cart.length>0?cart.map(pro=>(
   
    <div  style={{width:"100%",height:"230px",marginBottom:"20px",paddingLeft:"15px",display:"flex",background:"white"}}>
    <img src={config.apiBaseURL+pro.img_main} style={{width:"25%"}} onClick={e=>openDetail(pro)}></img>
     <div style={{width:"75%",display:"flex",flexDirection:"column"}}>
             <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}> 
                <h3 className={style.heading} style={{width:"80%",color:"black",fontSize: "16px",lineHeight: "26px",letterSpacing: "2.5px"}}>{pro.title}</h3>
                {/* <span className={style.delete} style={{fontSize:"32px",alignSelf:"start"}} onClick={e=>cartSave(pro)}>x</span> */}
                <Popconfirm placement="bottomLeft" title={text} onConfirm={e=>confirm(pro)} okText="Yes" cancelText="No">
                 <span className={style.delete} style={{fontSize:"25px",alignSelf:"start"}} >x</span>
                </Popconfirm>
             </div>

              <div style={{color:"black",marginLeft:"20px"}} className={style.price}> {currency.sign} {pro.price*currency.value}</div>
              <div style={{color:"black",marginLeft:"20px",marginTop:"8px"}}>
                <span className={style.size}>Size :</span>
                <span className={style.showSize}> {pro.size}</span>  
              </div>
              <div style={{color:"black",marginLeft:"20px",marginTop:"8px"}}>
                <span className={style.shipping}>Standard Shiping:</span>
                <span className={style.shipping}> 2 Weeks</span>  
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
    <div className={style.footerCon} style={{width:"100%",marginBottom:"150px",background:"white"}}>
      {/* <span>Total:</span><span>{getTotalPrice()}</span><span>Qty:</span><span>{getTotalQuantity()}</span><button onClick={BuyAll}>Buy ALl</button> */}
      <div className={style.inner} >

       <div className={style.summ} >
        Shopping Summary
       </div>
        
        <div className={style.subTotal}>
         <span style={{marginLeft:"15px",textTransform:"uppercase"}}>SubTotal</span>
         <span style={{marginRight:"15px"}}>{currency.sign} {getTotalPrice()*currency.value}</span>

        </div>
        <div className={style.subTotal}>
         <span style={{marginLeft:"15px"}}>Shipping</span>
         <span style={{marginRight:"15px"}}>₹ 0</span>
        </div>

        <div className={style.promo}>
          <input type="text" style={{width:"90%",height:"30px",marginLeft:"15px",border:"1px solid #dfdbdb",outline:"#fff"}} placeholder="Have a promocode"></input>
          <button className={style.shopbtn1} style={{marginRight:"15px",height:"30px",textAlign:"center",backgroundColor:"black",color:"white"}}>Apply</button>
        </div>

        <div className={style.subTotal} style={{marginTop:"25px"}}>
         <span style={{marginLeft:"15px"}}>Total</span>
         <span style={{fontSize: "20px",marginRight:"15px",fontSize: "21px",lineHeight: "32px",letterSpacing: "3px"}}>{currency.sign} {getTotalPrice()*currency.value}</span>
        </div>

         <div className={style.buttons} style={{flexDirection:"column",background:"white"}}>
            <button className={style.shopbtn1} style={{width:"100%"}}>Continue Shopping</button>
            <buton className={style.shopbtn2} style={{width:"100%"}} onClick={e=>{nav('/placeorder')}} >Go To Checkout</buton>
         </div>
      </div>
    </div>:null}

    <div style={{height:"300px",width:"100%",marginLeft:"15px"}}>
      <h6 style={{fontSize:"14px",lineHeight: "22px",letterSpacing: "1.2px",marginLeft:"15px"}}>IMPORTANTS</h6>
      <ul style={{  listStyleType: "disc",listStylePosition:"outside"}}>
        <li style={{color:"#8c8c8c",fontSize:"13px",lineHeight:"20px",letterSpacing: "1px"}}>
        Once your order has been placed no subsequent changes can be made in it.
        </li>
        <li style={{color:"#8c8c8c",fontSize:"13px",lineHeight:"20px",letterSpacing: "1px"}}>
        Shipping cost may vary depending on the delivery destination.
        </li>
        <li style={{color:"#8c8c8c",fontSize:"13px",lineHeight:"20px",letterSpacing: "1px"}}>
        Please check the final amount on the order summary.
        </li>
        <li style={{color:"#8c8c8c",fontSize:"13px",lineHeight:"20px",letterSpacing: "1px"}}>
        Contact Us | Shipping Policy
        </li>
      </ul>
    </div>
    </div>
    </div>
   
    <div style={{marginTop:"160px"}}>

     <div style={{width:"100%",display:"flex",justifyContent:'center',background:"white"}}>
     <div style={{width:"80vw",height:"70vh",marginBottom:"50px",background:"white",zIndex:"0"}}>
        <div style={{fontSize:"1.3rem",marginBottom:"20px",color:"black"}}>Recently Viewed Product</div>
        <Slider/>
    </div>
    </div> 
    
    <Footer/>
    <Below/>
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