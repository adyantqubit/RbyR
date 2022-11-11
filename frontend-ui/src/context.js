import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { check2, getCart, getLike, LikeUpdate, regenaratingTokenApi } from "./api/service";
import { unSetUserToken } from "./Redux-manage/features/authSlice";
import { unSetUserInfo } from "./Redux-manage/features/userSlice";
import { getToken, removeToken, storeToken } from "./Redux-manage/services/localStorageService";
import { useGetCartProductQuery, useGetLikedProductQuery } from "./Redux-manage/services/userAuthapi";

const Cart = createContext();


const Context = ({ children }) => {
  
  const [product,setProduct]=useState([]);
  const [condition,setCondition]=useState(false)
 const [cart,setCart]=useState([])
 const [CategoryProduct,setCategoryProduct]=useState([]);
  const [image,setImage]=useState([]);
  const [like,setLike]=useState([])
  const [con,setcon]=useState(false)
  const [userdata,setUserData]=useState({
    email:"",
    name:""
  })


  // use in filter new js file inside listing component
  const [allCategoryAvai,setAllCategoryAvai]=useState([])
  const [allColorAvai,setAllColorAvai]=useState([])
  const [selectedColor,setSelectedColor]=useState([])
  const [minValue,setminValue]=useState(0)
  const [maxValue,setmaxValue]=useState(0)
  const[sortui,setSortUi]=useState(false)
  const [tempallpro,settemAllpro]=useState([])
  const[filterui,setfilterUi]=useState(false)
  const[tempsprice,setTempsprice]=useState([])
  const [sizeSelected,setSizeSelected]=useState([])
  const [checkoutDetails,setCheckoutDetails]=useState({})
  const [shippingflow,setShipingflow]=useState(false)
  const [paymentflow,setPaymentflow]=useState(false)
  const [defaultShiping,setDefaultShipping]=useState([])

  const [lth,setLth]=useState(false)
  const [htl,sethtl]=useState(false)
  const[latestSelect,setLatestSelect]=useState(false)
  const[availablitySelect,setAvailablity]=useState(false)

  const [currency,setCurrency]=useState({value:1,sign:"₹"});
  const [to,setTo]=useState("INR")
 
  let {access_token,refresh_token}=getToken()
  const nav=useNavigate()

  const [openLikedrawer, setLikeDrawer] = useState(false);
  
  const [openCartdrawer, setCartDrawer] = useState(false);

  var [orders,setOrder]=useState([])



  //product updation
  useEffect(()=>{
    productApi()
    TokenManage()
    
    if(access_token){
    setInterval(TokenManage,6000)}
    if (JSON.parse(window.localStorage.getItem('cart'))&&(!localStorage.getItem('access_token')))
    setCart([...JSON.parse(window.localStorage.getItem('cart'))]) 
    if (JSON.parse(window.localStorage.getItem('cart'))&&(!localStorage.getItem('access_token')))
    setLike([...JSON.parse(window.localStorage.getItem('like'))])
  },[])

  useEffect(()=>{
    cartApi()  
    likeGetApi()
    
  },[product])


  
useEffect(()=>{
      window.localStorage.setItem('cart',JSON.stringify(cart))
 },[cart])
 useEffect(()=>{
  window.localStorage.setItem('like',JSON.stringify(like))
},[like])


  const productApi = async () => {
    await check2().then(r=>{
      setProduct(r.product); 
    })
  }


  async function TokenManage(){
    const data={
      "refresh":localStorage.getItem('refresh_token')
    }
  await regenaratingTokenApi(data).then(r=>{
    if(r.error){
      this.clearInterval()
      removeToken()

      window.location.reload()
      localStorage.clear()
    }
    else
    {
    const token={
      access:r.access,
      refresh:r.refresh
    }
    storeToken(token)
  }
  })
}



  //product 

  //cart data
  
  const cartApi = async () => {

    if(localStorage.getItem('access_token')){
    await getCart(access_token).then(r=>{
            r.cart.map((lke,i)=>{
               const p= product.filter(p=>p.id===lke.product_no)
               
               if(p.length>0){ 
                const cartData={
                  id:[...p][0].id,
                  title:[...p][0].title,
                  about:[...p][0].about,
                  price:[...p][0].price,
                  img_main:[...p][0].img_main,
                  quantity:lke.quantity,
                  category:[...p][0].category,
                  size:lke.size
                }
                
                // if(cart.filter(i=>{if(i.id==cartData.id)if(i.size!=cartData.size)return i}).length==0)
                cart.push(cartData)
               }
               setCart([...cart]);
    })
  })
}
}

//cart Data



  //liked data
  async function likeGetApi(){

    if(localStorage.getItem('access_token')){
    await LikeUpdate(access_token).then(r=>{
      r.liked.map((lke,i)=>{
        const p= product.filter(p=>p.id===lke.item) 
        if(p.length>0){
          if(like.filter(l=>l.id===p[0].id).length==0)  
         like.push(...p)
        }
   })
   console.log(r.liked)
   setLike([...like])

    })
  }
  }
  //liked


 




//filter
  const navigate=useNavigate()
  const [checked1, setCheckBoxChecked] = useState(false);
  const [checked2,setCheckBoxChecked2]=useState(false);
  const setcheck=(e)=>{
    console.log(e.target.checked)
    if(e.target.value==1){
     setCheckBoxChecked(true)
     setCheckBoxChecked2(false)
     setCategoryProduct([...CategoryProduct.sort(function(a,b){return b.price-a.price})]);
    
    }
    if(e.target.value==2){
      setCheckBoxChecked2(true)
      setCheckBoxChecked(false)
      setCategoryProduct([...CategoryProduct.sort(function(a,b){return a.price-b.price})]);
    }
   }
   //filter
  return (
    <Cart.Provider value={{availablitySelect,setAvailablity,latestSelect,setLatestSelect,defaultShiping,setDefaultShipping,orders,setOrder,paymentflow,setPaymentflow,shippingflow,setShipingflow,checkoutDetails,setCheckoutDetails,userdata,setUserData,to,setTo,currency,setCurrency,sizeSelected,setSizeSelected,con,setcon,htl,sethtl,lth,setLth,tempsprice,setTempsprice,filterui,setfilterUi,maxValue,setmaxValue,minValue,setminValue,allCategoryAvai,setAllCategoryAvai,allColorAvai,setAllColorAvai,selectedColor,setSelectedColor,tempallpro,settemAllpro, sortui,setSortUi,product,cart,setCart,setProduct,setcheck,checked1,checked2, image,setImage,like,setLike,setCondition,condition,openLikedrawer, setLikeDrawer,openCartdrawer, setCartDrawer,CategoryProduct,setCategoryProduct}}>
      {children}
    </Cart.Provider>
  );
};

export const CartState = () => {
  return useContext(Cart);
};

export default Context;
