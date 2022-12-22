import { notification } from "antd";
import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { shippingTickGet, TaxGet } from "./api/orderApis";
import { check2, getCart, getLike, LikeUpdate, regenaratingTokenApi } from "./api/service";
import { unSetUserToken } from "./Redux-manage/features/authSlice";
import { unSetUserInfo } from "./Redux-manage/features/userSlice";
import { getToken, removeToken, storeToken } from "./Redux-manage/services/localStorageService";
import { useGetCartProductQuery, useGetLikedProductQuery } from "./Redux-manage/services/userAuthapi";

const Cart = createContext();


const Context = ({ children }) => {

  const [product, setProduct] = useState([]);
  const [condition, setCondition] = useState(false)
  const [cart, setCart] = useState([])
  const [CategoryProduct, setCategoryProduct] = useState([]);
  const [image, setImage] = useState([]);
  const [like, setLike] = useState([])
  const [con, setcon] = useState(false)
  const [userdata, setUserData] = useState({
    email: "",
    name: "",
    contact:""
  })
  


  // use in filter new js file inside listing component
  const [allCategoryAvai, setAllCategoryAvai] = useState([])
  const [allColorAvai, setAllColorAvai] = useState([])
  const [selectedColor, setSelectedColor] = useState([])
  const [minValue, setminValue] = useState(2000)
  const [maxValue, setmaxValue] = useState(200000)
  const [sortui, setSortUi] = useState(false)
  const [tempallpro, settemAllpro] = useState([])
  const [filterui, setfilterUi] = useState(false)
  const [tempsprice, setTempsprice] = useState([])
  const [sizeSelected, setSizeSelected] = useState([])
  const [checkoutDetails, setCheckoutDetails] = useState({})
  const [shippingflow, setShipingflow] = useState(false)
  const [paymentflow, setPaymentflow] = useState(false)
  const [defaultShiping, setDefaultShipping] = useState([])
  const [showEditable, setShowEditable] = useState(false)


  const [lth, setLth] = useState(false)
  const [htl, sethtl] = useState(false)
  const [latestSelect, setLatestSelect] = useState(false)
  const [availablitySelect, setAvailablity] = useState(false)
  var [cartEnd, setCartEnd] = useState([])
  const [shipEditcond, setshipEditCond] = useState(true)

  const [currency, setCurrency] = useState({name:"INR", value: 1, sign: "₹" });
  const [to, setTo] = useState("INR")

  let { access_token, refresh_token } = getToken()
  const nav = useNavigate()

  const [openLikedrawer, setLikeDrawer] = useState(false);

  const [openCartdrawer, setCartDrawer] = useState(false);

  var [orders, setOrder] = useState([])
  var [offer, setOffer] = useState({ discount_percentage: 0, maximum_discount_price: 1000, expiry_date: '2022-11-30' })
  var [taxRate, setTaxRate] = useState(0)
  var [reload, setReload] = useState(true)
  const [selectedCategory, setCategorySelected] = useState([])

  //product updation
  useEffect(() => {
    firstTimeLoadFunctions()
    
  }, [])

  function firstTimeLoadFunctions() {
    productApi()
    TokenManage()
    GetTAXapi()
    DefaultShipping()

    if (localStorage.getItem('logout')) {
      localStorage.removeItem('logout')
      notification.error({
        message: <div style={{ fontSize: "18px", color: "black" }}>Successfully Logged Out. </div>,
        description:
          `You are Log out`,
        className: "custom-class",
        style: { backgroundColor:"#8c8c8c",color:"black",marginTop:"10vh"},
        duration: 2,
        key: 1
      });
    }
    if (access_token) {
      setInterval(TokenManage, 360000)
    }
    if (JSON.parse(window.localStorage.getItem('cart')) && (!localStorage.getItem('access_token')))
      setCart([...JSON.parse(window.localStorage.getItem('cart'))])
    if (JSON.parse(window.localStorage.getItem('cart')) && (!localStorage.getItem('access_token')))
      setLike([...JSON.parse(window.localStorage.getItem('like'))])

  }


  useEffect(() => {
    cartApi()
    likeGetApi()
  }, [product])



  useEffect(() => {
    window.localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])
  useEffect(() => {
    window.localStorage.setItem('like', JSON.stringify(like))
  }, [like])

  async function GetTAXapi() {
    await TaxGet().then(r => setTaxRate(r.tax_rate))

  }


  const productApi = async () => {
    await check2().then(r => {
      setProduct(r.product);
    })
  }


  async function TokenManage(int) {
    const data = {
      "refresh": localStorage.getItem('refresh_token')
    }
    await regenaratingTokenApi(data).then(r => {
      if (r.error) {

       
        removeToken()
        setLike([])
        console.log("token error ---------------")
        this.clearInterval()
        window.location.reload(false)
        
        
      }
      else {
        console.log("token succesfully ---------------")
        const token = {
          access: r.access,
          refresh: r.refresh
        }
        storeToken(token)
      }
    })
  }
  //product 

  //cart data

  const cartApi = async () => {

    if (localStorage.getItem('access_token')) {
      await getCart(access_token).then(r => {
        r.cart.map((lke, i) => {
          const p = product.filter(p => p.id === lke.product_no)

          if (p.length > 0) {
            const cartData = {
              id: [...p][0].id,
              title: [...p][0].title,
              about: [...p][0].about,
              price: [...p][0].price,
              img_main: [...p][0].img_main,
              quantity: lke.quantity,
              category: [...p][0].category,
              size: lke.size,
              shipping_charges: [...p][0].shipping_charges,
              ready_to_ship_days:[...p][0].ready_to_ship_days,
              shipping_days:[...p][0].shipping_days,
              ready_to_ship:[...p][0].ready_to_ship

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
  async function likeGetApi() {

    if (localStorage.getItem('access_token')) {
      await LikeUpdate(access_token).then(r => {
        r.liked.map((lke, i) => {
          const p = product.filter(p => p.id === lke.item)
          if (p.length > 0) {
            if (like.filter(l => l.id === p[0].id).length == 0)
              like.push(...p)
          }
        })
        console.log(r.liked)
        setLike([...like])

      })
    }
  }
  //liked



  //Default Shipping Get

  async function DefaultShipping() {
    await shippingTickGet().then(r => r.map(s => {
      if (s.isSelected) {
        const shippingData = {
          firstname: s.firstname,
          lastname: s.lastname,
          street: s.street,
          houseno: s.houseno,
          city: s.city,
          state: s.state,
          zipcode: s.zipcode,
          country: s.country,
          number: s.number
        }

        checkoutDetails['shippingData'] = shippingData;
      }
    }
    ))
  }

  //end shipping address get



  //filter


  useEffect(() => {

    var filteredProducts = tempallpro

    //color
    if (selectedColor.length > 0)
      filteredProducts = tempallpro.filter(c => selectedColor.includes(c.color.toLowerCase()))

    var tempSize = []
    tempSize = filteredProducts
    //size

    if (sizeSelected.length > 0)
      sizeSelected.filter(s => {
        tempSize = tempSize.filter(c => c[`${s}`] > 0)
      })


    // price
    if (tempSize.length > 0) {
      filteredProducts = tempSize.filter(c => c.price > minValue && c.price < maxValue)
    }
    else {
      filteredProducts = filteredProducts.filter(c => c.price > minValue && c.price < maxValue)
    }


      

     console.log(selectedCategory)
      if (selectedCategory.length > 0)
        selectedCategory.filter(s => {
        filteredProducts= filteredProducts.filter(c => c.category.toLowerCase() == s.toLowerCase())
        })             
    
    console.log(filteredProducts)
    var finalFilter = []
  
    
    if (selectedColor.length > 0 || sizeSelected.length > 0 || filteredProducts.length > 0 || maxValue) {
      if (filteredProducts.length < 8) {
        console.log("page index re hit")
        setReload(!reload)    
        finalFilter = filteredProducts
      }
      else
        finalFilter = filteredProducts
    }
    else
      finalFilter = tempallpro


    //category
    


    setCategoryProduct([...finalFilter])


  }, [tempallpro, selectedColor, sizeSelected, minValue, maxValue, selectedCategory])





  const [checked1, setCheckBoxChecked] = useState(false);
  const [checked2, setCheckBoxChecked2] = useState(false);
  const setcheck = (e) => {
    console.log(e.target.checked)
    if (e.target.value == 1) {
      setCheckBoxChecked(true)
      setCheckBoxChecked2(false)
      setCategoryProduct([...CategoryProduct.sort(function (a, b) { return b.price - a.price })]);

    }
    if (e.target.value == 2) {
      setCheckBoxChecked2(true)
      setCheckBoxChecked(false)
      setCategoryProduct([...CategoryProduct.sort(function (a, b) { return a.price - b.price })]);
    }
  }

  //filter
  return (
    <Cart.Provider value={{ selectedCategory, setCategorySelected, reload, setReload, firstTimeLoadFunctions, showEditable, setShowEditable, shipEditcond, setshipEditCond, cartEnd, setCartEnd, taxRate, setTaxRate, offer, setOffer, availablitySelect, setAvailablity, latestSelect, setLatestSelect, defaultShiping, setDefaultShipping, orders, setOrder, paymentflow, setPaymentflow, shippingflow, setShipingflow, checkoutDetails, setCheckoutDetails, userdata, setUserData, to, setTo, currency, setCurrency, sizeSelected, setSizeSelected, con, setcon, htl, sethtl, lth, setLth, tempsprice, setTempsprice, filterui, setfilterUi, maxValue, setmaxValue, minValue, setminValue, allCategoryAvai, setAllCategoryAvai, allColorAvai, setAllColorAvai, selectedColor, setSelectedColor, tempallpro, settemAllpro, sortui, setSortUi, product, cart, setCart, setProduct, setcheck, checked1, checked2, image, setImage, like, setLike, setCondition, condition, openLikedrawer, setLikeDrawer, openCartdrawer, setCartDrawer, CategoryProduct, setCategoryProduct }}>
      {children}
    </Cart.Provider>
  );
};

export const CartState = () => {
  return useContext(Cart);
};

export default Context;
