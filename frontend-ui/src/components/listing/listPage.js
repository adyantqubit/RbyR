import React, { createRef, useEffect, useRef, useState } from 'react'
import { CircularProgress } from '@mui/material';
import { getToken } from '../../Redux-manage/services/localStorageService';
import style from './listpage.module.css'
import {AiOutlineHeart,AiFillHeart} from 'react-icons/ai'
import { getCategoryProduct, getQrDetailApi } from '../../api/service'
import Filter from './filter';
import { CartState } from '../../context';
import { useCartUpdateMutation, useLikedUpdateMutation } from '../../Redux-manage/services/userAuthapi';
import { useParams,Link, useNavigate } from 'react-router-dom';
import config from '../../api/config';
import Footer from '../global/footer';
import Below from '../global/below';
import Slider from 'react-rangeslider'
 
// To include the default styles
import 'react-rangeslider/lib/index.css'

import FilterNew from './filterNew';
import Sort from './sort';

const ListPage = () => {


  const {product,condition,like,setLike,cart,tempallpro,settemAllpro,currency,setCurrency,setCart,CategoryProduct,setCategoryProduct,sortui,setSortUi,filterui,setfilterUi}=CartState()
  const [saveLikeApi,{isLoading}]=useLikedUpdateMutation()
  const [cartsaveApi,{isLoad}]=useCartUpdateMutation()
  let {access_token}=getToken();
  const nav=useNavigate();
  



 const{category}=useParams()
 
 useEffect(()=>{
 

 catApi()
 window.scrollTo(0,0)
 },[])


 const catApi=async()=>{
  await getCategoryProduct(category).then(r=>{setCategoryProduct([...r.category]);settemAllpro([...r.category]);console.log(r.category) })
 }
 

  //Like Concept

  const LikedSave=async(product)=>{

    if(access_token){
      
    }
  
    const data={
      item:product.id
    }
    const resp=await saveLikeApi({data,access_token});
    
        if(like.filter(l=>l.id===product.id).length>0){
          const p=like.filter(i=>i.id!==product.id)
          setLike(p)
        }else{
          setLike([...like,product])
        }
    }             
 //like


 //cart
 const cartSave=async(product)=>{
  
  const data={
    product_no:product.id
  }
  const resp=await cartsaveApi({data,access_token});
      if(cart.filter(l=>l.id===product.id).length>0){
        const p=cart.filter(i=>i.id!==product.id)
       
        setCart(p)
      }else{
        const cartData={
          id:product.id,
          title:product.title,
          about:product.about,
          price:product.price,
          img_main:product.img_main,
          quantity:1,
          size:"Medium"
        }
        setCart([...cart,cartData])
        localStorage.setItem('cart',JSON.stringify(cart))
      }
  }             
 //cart

function openDetail(id){
  nav(`detail/${id}`)
}


return (

  <>
  <div className={style.Container} >
<div className={style.bottom}></div>
<div className={style.bottom} >
     {CategoryProduct?
     <>
     <span className={style.TopContent} style={{paddingLeft:"80px"}}>{category}</span>
     <span className={style.filter} style={{paddingRight:"40px",fontWeight:"600px"}}>
      <span style={{paddingRight:"15px",color:"grey",cursor:"pointer"}}  onClick={e=>setSortUi(true)}>Sort by</span><span style={{cursor:"pointer"}}onClick={e=>setfilterUi(true)}>Filter BY</span>
     </span>
     </> :null}  
  </div>


<div className={style.slab}>

{CategoryProduct?CategoryProduct.map((p,i)=>(

  <div className={style.item}>
    <img src={config.apiBaseURL+p.img_main} onClick={e=>openDetail(p.id)}></img>
    <div className={style.title} ><span>{p.title}</span></div>  
    <div className={style.price} >{currency.sign} {(p.price*currency.value).toFixed(2)}</div>
  </div>

)):""}


</div>
<Footer/>
<Below/>

{sortui?
  <Sort/>:null
}

{filterui?
  <FilterNew/>
:null
}


</div>
 
  </>
 
  )
}


export default ListPage;
