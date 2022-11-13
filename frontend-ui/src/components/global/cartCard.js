import React, { useRef, useState } from 'react'

import PropTypes from 'prop-types'
import "bootstrap/dist/css/bootstrap.min.css";


import styles from './cartCard.module.css'
import { useCartUpdateMutation, useGetLikedProductQuery } from '../../Redux-manage/services/userAuthapi'
import { CartState } from '../../context'
import { getToken } from '../../Redux-manage/services/localStorageService';
import config from '../../api/config';
import { display } from '@mui/system';
import{TiDeleteOutline} from 'react-icons/ti'
import { CartQuantityApi } from '../../api/service';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { BsWindowSidebar } from 'react-icons/bs';
import { DrawerFooter } from './cart';
import Msg from '../concepts/msgConfirm';
import { Popconfirm,message } from 'antd';
import { increamentCheck } from '../../api/orderApis';


const text = 'are you sure to delete?';



const CartCard = (props) => {

 const {cart,setCart}=CartState()
 
 const [cartsaveApi,{isLoad}]=useCartUpdateMutation()
 let textInput = React.createRef();
 var [con,setcon]=useState(true)
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

async function increamentApiMethodCall({CartProduct,data}){
  
  await increamentCheck(data).then(r=>{
    if(r.success==true){
    con=true;
    console.log("present in stock",r)
    }
    else if(r.error){
      document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display="block"; 
      con =false;
      console.log("stock is not present",r)
    }
    })
} 

async function increamentApiMethodCall({CartProduct,data}){
  
  await increamentCheck(data).then(r=>{
    if(r.success==true){
    con=true;
    console.log("present in stock",r)
    }
    else if(r.error){
      document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display="block"; 
      con =false;
      console.log("stock is not present",r)
    }
    })
} 

const increament= async (CartProduct)=>{
  con=true;

  if(CartProduct.size=="Extra Extra Large"){

    var data={id:CartProduct.id,
      quantity:CartProduct.quantity,
      size:"XXL"}
    await increamentApiMethodCall({CartProduct,data})  

    /* commented on 11/11/22  
      purpose- becuse it check only from frontend only. if want to re-implement then just put size on if condition
      becuse i am removing it from all if else condition
    */
    // if(CartProduct.quantity>CartProduct.XXL){
    //   document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display="block"; 
    //   con=false
    // }
  }
  else if(CartProduct.size=="Extra Large"){
    var data={id:CartProduct.id,
      quantity:CartProduct.quantity,
      size:"XL"}
    await increamentApiMethodCall({CartProduct,data})  

    }
  else if(CartProduct.size=="Large"){
    var data={id:CartProduct.id,
      quantity:CartProduct.quantity,
      size:"L"}
    await increamentApiMethodCall({CartProduct,data})  

  }
  else if(CartProduct.size=="Medium"){
    var data={id:CartProduct.id,
      quantity:CartProduct.quantity,
      size:"M"}
    await increamentApiMethodCall({CartProduct,data})  

  }
  else if(CartProduct.size=="Short"){
    var data={id:CartProduct.id,
      quantity:CartProduct.quantity,
      size:"S"}
    await increamentApiMethodCall({CartProduct,data})  

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

  return (
    <>
  {cart.length>0?cart.map(pro=>(
   
    <>
    
    <div  style={{width:"100%",height:"230px",marginBottom:"20px",paddingLeft:"15px", display:"flex"}}>
    <img src={config.apiBaseURL+pro.img_main} style={{width:"30%",height:'230px'}} onClick={e=>openDetail(pro)}></img>
     <div style={{width:"65%",display:"flex",flexDirection:"column"}}>
             <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}> 
                <h3 className={styles.heading} style={{color:"black",fontSize: "18px",lineHeight: "26px",letterSpacing: "2.5px"}}>{pro.title}</h3>
                {/* <span className={styles.delete} style={{fontSize:"32px",alignSelf:"start"}} onClick={e=>cartSave(pro)}>x</span> */}
                <Popconfirm placement="bottomLeft" title={text} onConfirm={e=>confirm(pro)} okText="Yes" cancelText="No">
                 <span className={styles.delete} style={{fontSize:"32px",alignSelf:"start"}} >x</span>
                </Popconfirm>
             </div>

              <div style={{color:"black",marginLeft:"20px"}} className={styles.price}> ₹ {pro.price}</div>
              <div style={{color:"black",marginLeft:"20px",marginTop:"8px"}}>
                <span className={styles.size}>Size :</span>
                <span className={styles.showSize}> {pro.size}</span>  
              </div>
              <div style={{color:"black",marginLeft:"20px",marginTop:"8px"}}>
                <span className={styles.shipping}>Standard Shiping:</span>
                <span className={styles.shipping}> 2 Weeks</span>  
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
              <div id={`style${pro.id}${pro.size}`} style={{display:"flex",justifyContent:"end",margin:"0 5%",fontSize:".8rem",color:"red",display:"none"}}>No More Stock Available
                  </div>
 
          </div>
    </div>

 
    </>
  )):<div style={{fontSize:"20px",color:"#7c7c7c",height:"100%",display:"flex",justifyContent:"center"}}><span>Your Bag Is Empty</span></div>}
      <DrawerFooter/>
    </>
  )
}

CartCard.defaultProps = {
  image_src: 'https://play.teleporthq.io/static/svg/default-img.svg',
  image_alt: 'image',
  heading: 'Heading',
  text: 'Text',
  heading1: 'Heading',
  button: 'Button',
}

CartCard.propTypes = {
  image_src: PropTypes.string,
  image_alt: PropTypes.string,
  heading: PropTypes.string,
  text: PropTypes.string,
  heading1: PropTypes.string,
  button: PropTypes.string,
}

export default CartCard