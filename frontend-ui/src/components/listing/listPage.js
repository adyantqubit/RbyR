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
import { nextIndexPage } from '../../api/orderApis';

const ListPage = () => {


  const {product,condition,like,setLike,reload,setReload,htl,lth,availablitySelect,latestSelect,cart,allColorAvai,tempallpro,settemAllpro,currency,setAllColorAvai,setCurrency,setCart,CategoryProduct,setCategoryProduct,sortui,setSortUi,filterui,setfilterUi}=CartState()
  const [saveLikeApi,{isLoading}]=useLikedUpdateMutation()
  const [cartsaveApi,{isLoad}]=useCartUpdateMutation()
  let {access_token}=getToken();
  const nav=useNavigate();
  var [pageIndex,setPageIndex]=useState(0)


 const{category}=useParams()
 
//  useEffect(()=>{
//   console.log("page load first time__",CategoryProduct)
//  PageLoad()
//  },[])

 useEffect(()=>{
  console.log("on reload change call___",reload,CategoryProduct)
    if(reload==false){
      PageLoad()
      Apicall()
    }
 },[reload])

//  Commented by Rohan
//  reason- Navlinks are not working on reclick when when i am in this page.
//  Jira issue- RBYR229

useEffect(()=>{
  ApiReSet()
 },[category,htl,lth,availablitySelect,latestSelect])

//  useEffect(()=>{
//   console.log("on page index call",reload,CategoryProduct)
//   if(reload==false)
//   Apicall()

//  },[pageIndex])

// end of the code


async function ApiReSet(){
  console.log("On category change call-----------",CategoryProduct,reload)
  setCategoryProduct([])
  settemAllpro([])
  setPageIndex(1)
  const data={
    "pageIndex":1,
    "category":category,
    "lth":lth,
    "htl":htl,
    "latest":latestSelect,
    "availablity":availablitySelect
  }

  await nextIndexPage(data).then(r=>{
    console.log("response from backend_______",r)
    setTimeout(() => { 
      if(r.error){
        setReload(false);
        setLoading(false);
      }
      if(r&&r.products.length>0){
      console.log(CategoryProduct)  
      setCategoryProduct([...r.products])
      settemAllpro([...r.products])
      setReload(true);
      setAllColorAvai(r.colors)
      }
     
    }, 1000)
  })
}

 const catApi=async()=>{
  await getCategoryProduct(category).then(r=>{setCategoryProduct([...r.category]);settemAllpro([...r.category]);console.log(r.category) })
 }
 
//Commented By Rohan 
//Reason - Garbage function no need to use like and cart functionality in list page

//   //Like Concept

//   const LikedSave=async(product)=>{

//     if(access_token){
      
//     }
  
//     const data={
//       item:product.id
//     }
//     const resp=await saveLikeApi({data,access_token});
    
//         if(like.filter(l=>l.id===product.id).length>0){
//           const p=like.filter(i=>i.id!==product.id)
//           setLike(p)
//         }else{
//           setLike([...like,product])
//         }
//     }             
//  //like


//  //cart
//  const cartSave=async(product)=>{
  
//   const data={
//     product_no:product.id
//   }
//   const resp=await cartsaveApi({data,access_token});
//       if(cart.filter(l=>l.id===product.id).length>0){
//         const p=cart.filter(i=>i.id!==product.id)
       
//         setCart(p)
//       }else{
//         const cartData={
//           id:product.id,
//           title:product.title,
//           about:product.about,
//           price:product.price,
//           img_main:product.img_main,
//           quantity:1,
//           size:"Medium"
//         }
//         setCart([...cart,cartData])
//         localStorage.setItem('cart',JSON.stringify(cart))
//       }
//   }             
//  //cart

//  var temp =1
//End of Garbage code


function openDetail(id){
  nav(`detail/${id}`)
}



const lestref=useRef()
var [loading,setLoading]=useState(false)
const handleScroll = (e) => {
  var listHeight=lestref.current.scrollHeight
  // console.log(`scrollHeight-${e.target.scrollHeight}, scrollTop-${e.target.scrollTop},client height-${e.target.clientHeight},footerHeight-${footerHeight}`)
  //     const bottom = e.target.scrollHeight-e.target.clientHeight-footerHeight <e.target.scrollTop &&  e.target.scrollHeight-e.target.clientHeight-footerHeight+300>e.target.scrollTop;
    
  var bottom=e.target.scrollTop>listHeight-300;
  // setLoading(true)
  if (bottom&&reload) { 
    setReload(false)
    setLoading(true)
  }
  
}

async function PageLoad(){
  pageIndex=pageIndex+1;
  setPageIndex(pageIndex)
  console.log(pageIndex)

}


async function Apicall(){
  const data={
    "pageIndex":pageIndex,
    "category":category,
    "lth":lth,
    "htl":htl,
    "latest":latestSelect,
    "availablity":availablitySelect

  }

  await nextIndexPage(data).then(r=>{
    console.log("response from backend_______",r)
    setTimeout(() => { 
      if(r.error){
        setReload(false);
        setLoading(false);
      }
      if(r&&r.products.length>0){
      console.log(CategoryProduct)  
      setCategoryProduct([...CategoryProduct,...r.products])
      settemAllpro([...tempallpro,...r.products])
      setAllColorAvai(r.colors)
      setReload(true);
      }
     
    }, 200)
  })
}



return (

  <>
  
  <div className={style.Container} onScroll={handleScroll}>
    <div className={style.bottom}></div>
    <div className={style.bottom} >
        {CategoryProduct?
        <>
        <span className={style.TopContent} style={{paddingLeft:"80px"}}>{category.split("_").join(" ")}</span>
        <span className={style.filter} style={{paddingRight:"40px",fontWeight:"600px"}}>
          <span style={{paddingRight:"15px",color:"grey",cursor:"pointer"}}  onClick={e=>setSortUi(true)}>Sort by</span><span style={{cursor:"pointer"}}onClick={e=>setfilterUi(true)}>Filter BY</span>
        </span>
        </> :null}  
      </div>


<div className={style.slab} ref={lestref}>

{CategoryProduct?CategoryProduct.map((p,i)=>(

  <div className={style.item}>
    <img src={config.apiBaseURL+p.img_main} onClick={e=>openDetail(p.id)}></img>
    <div className={style.title} ><span>{p.title}</span></div>  
    <div className={style.price} >{currency.sign} {(p.price*currency.value).toFixed(2)}</div>
  </div>

)):""}


</div>


{sortui?
  <Sort/>:null
}

{filterui?
  <FilterNew/>
:null
}

{loading?
  <div style={{width:"100%",background:"white"}}>
<div class = "centered">
	<div class = "blob-1"></div>
	<div class = "blob-2"></div>
</div>
</div>:null}


<div  >
<Footer/>
<Below/>
</div>
</div>



  </>
 
  )
}


export default ListPage;
