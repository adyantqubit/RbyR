import React, { createRef, useEffect, useRef, useState } from 'react'
import { CircularProgress } from '@mui/material';
import { getToken } from '../../Redux-manage/services/localStorageService';
import style from './listpage.module.css'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { getCategoryProduct, getQrDetailApi } from '../../api/service'
import Filter from './filter';
import { CartState } from '../../context';
import { useCartUpdateMutation, useLikedUpdateMutation } from '../../Redux-manage/services/userAuthapi';
import { useParams, Link, useNavigate } from 'react-router-dom';
import config from '../../api/config';
import Footer from '../global/footer';
import Below from '../global/below';
import Slider from 'react-rangeslider'
import logo from "../../assets/photos/rts-icon.svg"


// To include the default styles
import 'react-rangeslider/lib/index.css'
import NavHeader from '../global/NavHeader'

import FilterNew from './filterNew';
import Sort from './sort';
import { nextIndexPage } from '../../api/orderApis';
import { CgEnter } from 'react-icons/cg';
import Chat from '../expandDetailt/chat';

const ListPage = () => {


  var { product, condition, like,nullpage, setNullPage, setLike, setAllCategoryAvai, reload, setReload, htl, lth, availablitySelect, latestSelect, cart, allColorAvai, tempallpro, settemAllpro, currency, setAllColorAvai, setCurrency, setCart, CategoryProduct, setCategoryProduct, sortui, setSortUi, filterui, setfilterUi } = CartState()
  const [saveLikeApi, { isLoading }] = useLikedUpdateMutation()
  const [cartsaveApi, { isLoad }] = useCartUpdateMutation()
  let { access_token } = getToken();
  const nav = useNavigate();
  var [pageIndex, setPageIndex] = useState(0)


  const { category, parent } = useParams()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    console.log(category, parent)
    console.log("on reload change call___", reload, CategoryProduct)
    if (reload == false) {

      PageLoad()
      Apicall()
    }

  }, [reload])

  //  Commented by Rohan
  //  reason- Navlinks are not working on reclick when when i am in this page.
  //  Jira issue- RBYR229

  useEffect(() => {
    setNullPage(false)
    setReload(true)
    ApiReSet()
    console.log(parent)
    document.getElementById('scrolled').scrollTop = 0

  }, [category, parent, htl, lth, availablitySelect, latestSelect])

  //  useEffect(()=>{
  //   console.log("on page index call",reload,CategoryProduct)
  //   if(reload==false)
  //   Apicall()

  //  },[pageIndex])

  // end of the code


  async function ApiReSet() {


    console.log("On category change call-----------", CategoryProduct, reload)
    setPageIndex(0)
    setCategoryProduct([])
    settemAllpro([])



    // const data={
    //   "pageIndex":1,
    //   "category":category,
    //   "lth":lth,
    //   "htl":htl,
    //   "latest":latestSelect,
    //   "availablity":availablitySelect
    // }

    // await nextIndexPage(data).then(r=>{
    //   console.log("response from backend_______",r)
    //   setTimeout(() => { 
    //     if(r.error){
    //       setReload(false);
    //       setLoading(false);
    //       console.log("api reset false statement")

    //     }
    //     else{
    //     setCategoryProduct([...r.products])


    //     console.log("api reset true statement")
    //     settemAllpro([...r.products])
    //     setAllColorAvai(r.colors)

    //     setReload(true);

    //     }

    //   }, 1000)
    // })
  }

  function scrollTop() {
    console.log("top")
    document.getElementById('scrolled').scrollTop = 0
  }

  const catApi = async () => {
    await getCategoryProduct(category).then(r => { setCategoryProduct([...r.category]); settemAllpro([...r.category]); console.log(r.category) })
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


  function openDetail(id) {
    nav(`/listing/${id.menu}/${id.category}/detail/${id.id}`)
  }



  const lastref = useRef()
  var [loading, setLoading] = useState(false)
  var [oldscroll, setoldScroll] = useState(0)
  var [showOptions, setShowOptions] = useState(false)
  const handleScroll = (e) => {
    var listHeight = lastref.current.scrollHeight
    // console.log(`scrollHeight-${e.target.scrollHeight}, scrollTop-${e.target.scrollTop},client height-${e.target.clientHeight},footerHeight-${footerHeight}`)
    //     const bottom = e.target.scrollHeight-e.target.clientHeight-footerHeight <e.target.scrollTop &&  e.target.scrollHeight-e.target.clientHeight-footerHeight+300>e.target.scrollTop;

    var bottom = e.target.scrollTop > listHeight - 300;

    if (bottom && reload) {
      setReload(false)
      setLoading(true)
      console.log("inside scroll call")
    }

    console.log("----------", e.target.scrollTop, oldscroll)

    if (oldscroll > e.target.scrollTop) {
      setShowOptions(true)
      setoldScroll(e.target.scrollTop)
    }
    else {
      setShowOptions(false)
      setoldScroll(e.target.scrollTop)
    }

  }

  async function PageLoad() {
    pageIndex = pageIndex + 1;
    setPageIndex(pageIndex)
  }



  async function Apicall() {


    const data = {
      "pageIndex": pageIndex,
      "category": category,
      "parent": parent,
      "lth": lth,
      "htl": htl,
      "latest": latestSelect,
      "availablity": availablitySelect

    }

    console.log("next page call", pageIndex)

    await nextIndexPage(data).then(r => {
      console.log("response from backend_______", r)
      setTimeout(() => {
        if (r.error) {


          setReload(false);
          setLoading(false);

          if (CategoryProduct.length == 0)
            setNullPage(true)
        }
        else {

          console.log(CategoryProduct)
          setAllCategoryAvai([...r.categories])
          setCategoryProduct([...CategoryProduct, ...r.products])
          settemAllpro([...tempallpro, ...r.products])
          setAllColorAvai(r.colors)
          setReload(true);
        }

      }, 200)
    })
  }



  return (

    <>

      {/* {showOptions?<NavHeader/>:null} */}
      <NavHeader />
      <div className={style.Container}
        id="scrolled"
        onScroll={handleScroll}>
        <div className={style.bottom}
        // style={sortui?{opacity:"0.7"}:null}
        >

        </div>
        <div className={style.bottom}
        // style={sortui?{opacity:"0.7",}:null}
        >
          {CategoryProduct ?
            <div className={style.category}>
              {category!="0" ?
                  <span className={style.TopContent} style={{ paddingLeft: "5%", fontWeight: "550", whiteSpace: "nowrap" }}>{category.split("_").join(" ")}</span>
                :
                <span className={style.TopContent} style={{ paddingLeft: "5%", fontWeight: "550", whiteSpace: "nowrap" }}>{parent.split("_").join(" ")}</span>
                }

              <span className={`${style.filter} ${style.sortfilterres}`} style={{ paddingRight: "40px", height: "100%", fontWeight: "600px", whiteSpace: "nowrap" }}>
                <span style={{ paddingRight: "15px", color: "grey", cursor: "pointer" }} onClick={e => setSortUi(true)}>Sort by</span>
                <span style={{ cursor: "pointer", fontWeight: "600" }} onClick={e => setfilterUi(true)}>Filter BY</span>
              </span>
            </div>
            : null}
        </div>

        <div className={style.filterContainres}
          style={{ zIndex: "0", height: showOptions ? "8%" : "0", transition: "all .2s ease-out" }}>
          <div className={style.filterInner} >
            <div className={style.filterheader}>
              <div className={style.filterHeaderInner} style={{ margin: "10px 0" }}>
                <span className={style.shopbtn1}
                  onClick={e => setSortUi(true)}>SORT BY</span>
                <span className={style.shopbtn1}
                  onClick={e => setfilterUi(true)}>FILTER</span>
              </div>
            </div>
          </div>
        </div>


        <div className={style.slab}
          // style={sortui?{opacity:"0.7"}:null}
          ref={lastref}>

          {CategoryProduct.length > 0 ? CategoryProduct.map((p, i) => (

            <div className={style.item} onClick={e => openDetail(p)}>
              <img src={config.apiBaseURL + p.img_main} className={style.img}></img>
              <div className={style.title} ><span>{p.title}</span></div>
              <div className={style.price} >{currency.sign} {(p.price * currency.value).toFixed(2)}</div>
              {p.ready_to_ship ?
                <div className={style.readyContainer}>
                  <div className={style.readyBox}>
                    <img src={logo} className={style.readyIcon} />
                    Ready To Ship
                  </div>
                </div>
                : null}
            </div>

          )) :
            nullpage ? null : <div style={{ width: "100%", background: "white" }}>
              <div class="centered">
                <div class="blob-1"></div>
                <div class="blob-2"></div>
              </div>
            </div>
          }

          {nullpage ?
            <div style={{ width: "100%", textAlign: "center" }}>
              <div className={style.noresult} style={{ width: "100%", textAlign: "center" }}>No products found !</div>
              <span style={{ fontSize: "14px" }}>
                Please change Your search criteria and try again.
                If still not finding anything relevant,
                please visit the Home page and try out some of our bestsellers!
              </span>
            </div> : null}

        </div>


        {sortui ?
          <Sort /> : null
        }

        {filterui ?
          <FilterNew scrolling={scrollTop} />
          : null
        }

        {loading ?
          <div style={{ width: "100%", background: "white" }}>
            <div class="centered">
              <div class="blob-1"></div>
              <div class="blob-2"></div>
            </div>
          </div> : null}


        <div className={style.foot}>
          <Footer />
          <Below />

        </div>
      </div>



    </>

  )
}


export default ListPage;
