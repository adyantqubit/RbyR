import React, { useEffect, useRef, useState } from "react";
// import { FiMenu, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import style from './NavHeader.module.css';
import { Button, CssBaseline, Grid, SliderThumb, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { unSetUserToken } from '../../Redux-manage/features/authSlice';
import { setUserInfo, unSetUserInfo } from '../../Redux-manage/features/userSlice';
import { getToken, removeToken } from '../../Redux-manage/services/localStorageService';
import { useGetLoggedUserQuery } from '../../Redux-manage/services/userAuthapi';
import Drawer from 'react-modern-drawer'

import { BsWhatsapp, BsSearch } from 'react-icons/bs'
//import styles 👇
import 'react-modern-drawer/dist/index.css'
import Liked from './liked';
import LikedDrawer from './liked';
import Cart from './cart';
import { Profile } from './profile';
import Search from './search';
import Slideshow from './slideshow';
import Converter from '../concepts/convertCurrency';
import config from '../../api/config';
import { getLogoAndCover, getProfileData, getWhatsappContactDetail } from "../../api/service";
import ShrinkHeader from './shrinkHeader';
import { CartState } from '../../context';
import { notification } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logoimg from '../../logo.jfif'

const Navbar = () => {
  notification.destroy()
  const [cl, setClass] = useState(false);
  const [open, setOpen] = useState(false);
  const { access_token, refresh_token } = getToken()

  const { setReload, setCategorySelected, firstTimeLoadFunctions, menus, setMenus ,  whatsappContactNumber, setWhatsappContactNumber,logo, setLogo
  } = CartState()
  const [left, setLeft] = useState(0)


  useEffect(()=>{
    if (localStorage.getItem('login')) {
      toast.success(<div 
        // Modification and addition by Om Shrivastava on 16-11-23
        // Reason : Add the class for show the message
      // style={{ fontSize: "18px", color: "black", letterSpacing: "1.4px" }}
      className={style.alertMsg} 
      // End of modification and addition by Om Shrivastava on 16-11-23
        // Reason : Add the class for show the message
      >Successfully Logged In.
      </div>,
        { position: toast.POSITION.TOP_RIGHT, duration: 1000, style: { top: "20vh", right: "2vw", background: "#f1cdd9" } },
      )   

      localStorage.removeItem('login')
    }

    
    if (localStorage.getItem('register')) {
      toast.success(<div style={{ fontSize: "18px", color: "black", letterSpacing: "1.4px" }}>Successfully Registered.
      </div>,
        { position: toast.POSITION.TOP_RIGHT, duration: 1000, style: { top: "20vh", right: "2vw", background: "var(--bannerColor)" } },
      )   

      localStorage.removeItem('register')
    }
  },[])

  // useEffect(() => {
  //   // getLogoAndCoverDetail();
  //   getWhatsappContactNumber()
  // }, []);
  // Added by Rohan - 30/12/22
  // Reason- Giving dynamic padding to sub menus - means all sub menu shown below parent menus
  // useEffect(() => {
  //   if (document.getElementById(`li0`))
  //     menus.map((m, i) => {
  //       var parent = Object.keys(m)
  //       var leftGap = document.getElementById(`li${i}`).offsetLeft

  //       {
  //         m[`${parent}`].map((s, i) => {
  //           setLeft(leftGap+250)
  //           document.getElementById(`li${i}${parent}`).style.paddingLeft = `${leftGap}px`
  //         })
  //       }

  //       if (document.getElementById(`k${i}`))
  //         document.getElementById(`k${i}`).style.paddingLeft = `${leftGap}px`
  //     })
  // })
  // End of code

  const handleClick = () => {
    setOpen(!open);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  const openc = () => {
    setClass(true)
  };

  const closec = () => {
    setClass(false)
  };



  const navigate = useNavigate()
  const dispatch = useDispatch();
  
  const { data, isSuccess } = useGetLoggedUserQuery(access_token)
  const [userdata, setUserData] = useState({
    email: "",
    name: ""
  })

  // async function profile(){

  //   try{
  //     await getProfileData().then(r=>console.log(r))

  //   }
  //   catch(err){
  //  console.log(err)
  //   }


  // }

  const handleLogout = () => {
    dispatch(unSetUserInfo({ email: "", name: "" }))
    dispatch(unSetUserToken({ access_token: null }))
    removeToken()
    localStorage.clear()
    navigate('/login')
  }

  useEffect(() => {
    if (data && isSuccess)
      setUserData({
        email: data.email,
        name: data.name,
      })

   
  }, [data, isSuccess])

  useEffect(() => {
    if (data && isSuccess)
      dispatch(setUserInfo({
        email: data.email,
        name: data.name,
      }))

    // if(localStorage.getItem("access_token")&& ){
    //   // localStorage.removeItem("access_token")
    //   // localStorage.removeItem("refresh_token")
    //   firstTimeLoadFunctions()
    // }

    // profile()

  }, [data, isSuccess, dispatch])

  const nav = useNavigate()
  function openHome() {
    nav("/")
  }
  function openCart() {
    nav("/cart")
  }

 

  // const getLogoAndCoverDetail = async () => {

  //   const coverAndLogoData = await getLogoAndCover();
  //   if (coverAndLogoData) {
  //     setLogo(coverAndLogoData[0].logo);
  //   }
  // };
  

  var refc = useRef()

  return (
    <div style={{ width: "100%" }} >
      <ToastContainer key={1} limit={1} enableMultiContainer={false}/>
      <div className={style.contain} style={{ borderBottom: "1px solid white" }}>
        <div className={style.whatsappBanner} style={{ color: "white", display: "flex", minHeight: "25px", justifyContent: "center", fontSize: ".75rem", letterSpacing: ".6px", fontStyle: "bold", fontWeight: "600" }}>
          {/* Commented and modified by - Ashish Dewangan on 16-02-2023
          Reason - open link in new tab */}
          {/* <a href={`https://wa.me/+91${whatsappContactNumber}?text=Hi! Could you help me with a few queries!`}
            style={{ textDecoration: "none", textTransform: "uppercase", outline: "none", color: "black", fontSize: ".75rem", fontWeight: "300", marginTop: "8px" }}> */}
          {/* Modification and addition by Om Shrivastava on 28-10-23
            Reason : Change the content when admin can't enter the message */}
          {whatsappContactNumber ? 
          <a href={`https://wa.me/+91${whatsappContactNumber}?text=Hi! Could you help me with a few queries!`}
           /* Modification and addition by Om Shrivastava on 19-10-23
            Reason : Set the color of the content  */
           // style={{ textDecoration: "none", textTransform: "uppercase", outline: "none", color: "black", fontSize: ".85rem", fontWeight: "700", marginTop: "8px" }}
            style={{ textDecoration: "none", textTransform: "uppercase", outline: "none", color: "white", fontSize: ".85rem", fontWeight: "700", marginTop: "8px" }}
            /* End of modification and addition by Om Shrivastava on 19-10-23
            Reason : Set the color of the content  */
            target="_blank"
          >
            {/* End of code modification */}
           
            FOR CUSTOMIZATIONS OR PERSONAL ASSISTANCE, WHATSAPP US AT | +91
            {whatsappContactNumber ? whatsappContactNumber : " Not added"}
            
          </a>
          :"Welcome to RbyR"}
          {/* End of modification and addition by Om Shrivastava on 28-10-23
            Reason : Change the content when admin can't enter the message */}
        </div>

        <div className={style.logo}>
          {/* <img src="https://res.cloudinary.com/dzzdidhrq/image/upload/v1665666532/imageedit_1_8617192145_tkdkvr-removebg-preview_vu0nj5.jpg" alt="Logo" onClick={openHome}/> */}
          {/* Modification and addition by Om Shrivastava on 19-10-23
          Reason : Need to set the path of the store locator image */}
          {/* <img src={config.staticBaseURL + logo} alt="Logo" onClick={openHome} /> */}
          <img src={config.staticBaseURL +'media/'+ logo} alt="Logo" onClick={openHome} />
           {/* <img src={logoimg}  onClick={openHome} /> */}
          {/* End of modification and addition by Om Shrivastava on 19-10-23
          Reason : Need to set the path of the store locator image */}
          
        </div>

        <nav className={style.navbar}>

          <ul className={style.nav_links} style={{ marginBottom: "0px" }}>

            <input type="checkbox" id="checkbox_toggle" />
            <label htmlFor="checkbox_toggle" className={style.hamburger}>&#9776;</label>

            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <Converter />
              <div className={style.menu}>
                {/* <li style={{height:"40px"}}><a className={style.al} href="/">Home</a></li>
                <li className={style.services} onMouseEnter={openc} onMouseLeave={closec}>
                  <span  className={style.al} href="/" style={{fontWeight:"450",fontSize:"16px"}}>ETHNIC</span>
                
                  <ul className={style.dropdown}>
                    <li  style={{padding:"0",width:"40px",margin:"20px 15px",border:"none",whiteSpace:"nowrap"}}><Link className={style.al2} to="/listing/partywear" onClick={e=>setCategorySelected([])} >PARTY WEAR</Link></li>
                    <li  style={{padding:".1em",width:"auto",margin:"20px 15px",border:"none",whiteSpace:"nowrap"}}><Link className={style.al2} to="/listing/casual" onClick={e=>setCategorySelected([])}>CASUAL</Link></li>
                    <li  style={{padding:".1em",width:"auto",margin:"20px 15px",border:"none",whiteSpace:"nowrap"}}><Link className={style.al2} to="/listing/kurti" onClick={e=>setCategorySelected([])}>KURTI</Link></li>
                    <li  style={{padding:".1em",width:"auto",margin:"20px 15px",border:"none",whiteSpace:"nowrap"}}><Link className={style.al2} to="/listing/wedding_wear"onClick={e=>setCategorySelected([])}>WEDDING WEAR</Link></li>
                    <li style={{padding:".1em",width:"auto",margin:"20px 15px",border:"none",whiteSpace:"nowrap"}}><Link className={style.al2}  to="/listing/formal" onClick={e=>setCategorySelected([])}>FORMAL</Link></li>
                    <li style={{padding:".1em",width:"auto",margin:"20px 15px",border:"none",whiteSpace:"nowrap"}}><Link className={style.al2}  to="/listing/view_all" onClick={e=>setCategorySelected([])}>VIEW ALL</Link></li>
    
                  </ul>    
                </li>


                <li className={style.services} >
                  <Link  className={style.al} to="/listing/luxury_pret" onClick={e=>setCategorySelected([])}>Luxury Pret</Link>
                </li>

                <li className={style.services} >
                  <Link  className={style.al} to="/listing/rbyr_man" onClick={e=>setCategorySelected([])} style={{textTransform:"none"}}>RbyR MEN</Link>
                </li>

                <li className={style.services} >
                  <Link  className={style.al} to="/listing/ready_to_wear" onClick={e=>setCategorySelected([])}>Ready To wear</Link>
                </li>

                <li className={style.services} >
                  <Link  className={style.al} to="/listing/world_of_rbyr" onClick={e=>setCategorySelected([])} style={{textTransform:"none"}}>WORLD OF RbyR</Link>
                </li> */}
                <li className={style.services}>
                  <Link className={style.al} to="/" style={{ fontSize: "16px" }}>Home</Link>
                </li>

                {menus?.map((m, i) => {
                  var parent = Object.keys(m)

                  return <li id={`li${i}`} ref={refc} style={{ height: "40px" }} className={style.services} onMouseEnter={openc} onMouseLeave={closec}>
                    <Link className={style.al} to={
                      // checking length on menu if 0 then not showing submenu with image page
                      m.shownMenuNImg && m[`${parent[0]}`]?.length > 0 ? `/categories/${parent[0]}` :
                        m.shownInstFilter ? `/listing/${parent[0]}/0` :
                          `/listing/${parent[0]}/0`
                    } onClick={e => setCategorySelected([])}>{parent[0]}</Link>

                    {/* <span id={`${parent}${i+1}`}  className={style.al} href="/" style={{fontWeight:"450",fontSize:"16px"}}>{parent}</span> */}
                    {/* <ul className={style.dropdown} style={{ padding: m[`${parent}`].length > 0 ? "20px 0" : null }}>

                      {m[`${parent}`].map((s, j) => (
                      <>
                        <li id={`li${j}${parent}`} style={{ margin: "0px 15px", border: "none", whiteSpace: "nowrap", position: "relative", left: "auto", }} >
                          <Link className={style.al2} to={`/listing/${parent}/${s}`} onClick={e => setCategorySelected([])}>{s}</Link>
                        </li>
                      </>
                      ))}

                      {m[`${parent}`].length > 0 ?
                        <li id={`k${i}`} style={{ margin: "8px 15px", border: "none", whiteSpace: "nowrap", position: "relative", left: "auto", }} >
                          <Link className={style.al2} to={`/listing/${parent}/0`} onClick={e => setCategorySelected([])}>VIEW ALL</Link>
                        </li> : null}

                    </ul> */}
                  </li>




                })}

                <li className={style.services}>
                  <Link className={style.al} to="/listing/ready to ship/0" style={{ fontSize: "16px" }} onClick={e => setCategorySelected([])}>Ready to ship</Link>
                </li>

                <li className={style.services}>
                  <Link className={style.al} to="/aboutRR" style={{ fontSize: "16px" }}>World of RbyR</Link>
                  {/* Commented by - Ashish Dewangan on 15-02-2023
                  Reason - To hide submenu of world of rbyr */}
                  {/*                 
                  <ul className={style.dropdown}>
                  <li  style={{padding:".1em",width:"auto",margin:"20px 15px",border:"none",whiteSpace:"nowrap",paddingLeft:`${left}px`}}>
                      <Link className={style.al2} to="/aboutRR" onClick={e=>setCategorySelected([])}>ABOUT RbyR</Link>
                    </li>
                    <li  style={{padding:"0",width:"40px",margin:"20px 15px",border:"none",whiteSpace:"nowrap",paddingLeft:`${left}px`}}>
                      <Link className={style.al2} to="/RRDesign">RbyR Design</Link>
                    </li>
                    <li  style={{padding:".1em",width:"auto",margin:"20px 15px",border:"none",whiteSpace:"nowrap",paddingLeft:`${left}px`}}>
                      <Link className={style.al2} to="/celebRR" onClick={e=>setCategorySelected([])}>CELEBRITIES IN RbyR</Link>
                    </li>
                    <li  style={{padding:".1em",width:"auto",margin:"20px 15px",border:"none",whiteSpace:"nowrap",paddingLeft:`${left}px`}}>
                      <Link className={style.al2} to="/features"onClick={e=>setCategorySelected([])}>FEATURES</Link>
                    </li>
                    <li style={{padding:".1em",width:"auto",margin:"20px 15px",border:"none",whiteSpace:"nowrap",paddingLeft:`${left}px`}}>
                      <Link className={style.al2}  to="/editorial" onClick={e=>setCategorySelected([])}>EDITORIALS</Link>
                    </li>
                  </ul>     
                  */}
                  {/* End of comment */}
                </li>

              </div>

              {/* {access_token?<li><a className={style.al} href="/changePass">Change Password</a></li>:<li><Link to="/login">Register/Login</Link></li>}
                {access_token?<li><span  className={style.al}  onClick={handleLogout}>Logout</span></li>:null} */}

              <div className={style.system}>
                <div><Search className={style.icons} /></div>
                <div>
                  {/* Commented and modified by - Ashish Dewangan on 15-02-2023
                  Reason - To open external links in new browser tab */}
                  {/* <a href={`https://wa.me/+91${whatsappContactNumber}?text=Hi! Could you help me with a few queries!`} > */}
                  <a href={`https://wa.me/+91${whatsappContactNumber}?text=Hi! Could you help me with a few queries!`} target="_blank">
                    {/* End of code modification */}
                    <BsWhatsapp className={style.icons} />
                  </a>
                </div>
                <div><LikedDrawer /></div>
                <div className={style.cart}><Cart /></div>
                <div><Profile /></div>
              </div>

            </div>

          </ul>

        </nav>

        {/* // <div className={cl?style.drops:style.out}></div> */}

      </div>
      <ShrinkHeader />
    </div>
  );
};

export default Navbar;