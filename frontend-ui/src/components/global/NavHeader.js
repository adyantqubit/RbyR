import React, { useEffect, useState } from 'react';
// import { FiMenu, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import style from './NavHeader.module.css';
import { Button, CssBaseline, Grid, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { unSetUserToken } from '../../Redux-manage/features/authSlice';
import { setUserInfo, unSetUserInfo } from '../../Redux-manage/features/userSlice';
import { getToken, removeToken } from '../../Redux-manage/services/localStorageService';
import { useGetLoggedUserQuery } from '../../Redux-manage/services/userAuthapi';
import Drawer from 'react-modern-drawer'

import {BsWhatsapp,BsSearch} from 'react-icons/bs'
//import styles 👇
import 'react-modern-drawer/dist/index.css'
import Liked from './liked';
import LikedDrawer from './liked';
import Cart from './cart';
import { Profile } from './profile';
import Search from './search';
import Slideshow from './slideshow';



const Navbar = () => {

	const[cl,setClass]=useState(false);
	const [open, setOpen] = useState(false);

  const{access_token,refresh_token}= getToken()


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
  const dispatch= useDispatch();
  const {data,isSuccess}=useGetLoggedUserQuery(access_token)
  const [userdata,setUserData]=useState({
    email:"",
    name:""
  })

  const handleLogout = () => {
    dispatch(unSetUserInfo({email:"",name:""}))
    dispatch(unSetUserToken({access_token:null}))
    removeToken()
    localStorage.clear()
    navigate('/login')
  }

  useEffect(()=>{
    if(data&&isSuccess)
    setUserData({
      email:data.email,
      name:data.name,
    })

  },[data,isSuccess])

  useEffect(()=>{
    if(data&&isSuccess)
    dispatch(setUserInfo({
      email:data.email,
      name:data.name,
    }))
  },[data,isSuccess,dispatch])

  const nav=useNavigate()
  function openHome(){
     nav("/")
  }
  function openCart( ){
    nav("/cart")
  }


	return (
		<>
		<div className={style.contain} style={{borderBottom:"1px solid white"}}>
      <div style={{background:"#000",color:"white",display:"flex",justifyContent:"center",fontSize:".8rem"}}>FOR CUSTOMIZATIONS OR PERSONAL ASSISTANCE, WHATSAPP US AT <a href='https://wa.me/916264170187' style={{textDecoration:"none",outline:"none",color:"white",fontSize:".9rem"}}>+91 7865435434</a></div>
     
        <div className={style.logo}>
          <img src="https://res.cloudinary.com/dzzdidhrq/image/upload/v1665666532/imageedit_1_8617192145_tkdkvr-removebg-preview_vu0nj5.jpg" alt="Logo" onClick={openHome}/>
        </div>
          <nav className={style.navbar}>

            <ul className={style.nav_links} style={{marginBottom:"3px",marginTop:"20px"}}>
            
              <input type="checkbox" id="checkbox_toggle" />
              <label htmlFor="checkbox_toggle" className={style.hamburger}>&#9776;</label>
              
              <div className={style.menu}>
                
                <li style={{height:"40px"}}><a className={style.al} href="/">Home</a></li>
                <li className={style.services} onMouseEnter={openc} onMouseLeave={closec}>
                  <span  className={style.al} href="/" style={{fontWeight:"450",fontSize:"16px"}}>Ethnic</span>
                
                
                  <ul className={style.dropdown}>
                    <li  style={{padding:"0",width:"40px",margin:"20px 15px"}}><a className={style.al2} href="/listing/partywear" >Partywear</a></li>
                    <li  style={{padding:".1em",width:"auto",margin:"20px 15px"}}><a className={style.al2} href="/listing/casual">Casual</a></li>
                    <li  style={{padding:".1em",width:"auto",margin:"20px 15px"}}><a className={style.al2} href="/listing/kurti">Kurti</a></li>
                    <li  style={{padding:".1em",width:"auto",margin:"20px 15px"}}><a className={style.al2} href="/listing/weddingwear">Weddingwear</a></li>
                    <li style={{padding:".1em",width:"auto",margin:"20px 15px"}}><a className={style.al2}  href="/listing/formal">Formal</a></li>
                  </ul>    
                </li>


                <li className={style.services} >
                  <a  className={style.al} href="/listing/luxurypret">Luxury Pret</a>
                </li>

                <li className={style.services} >
                  <a  className={style.al} href="/listing/readytowear">Ready To wear</a>
                </li>

                <li className={style.services} >
                  <a  className={style.al} href="/listing/worldofrr">World of RbyR</a>
                </li>

              
                {/* {access_token?<li><a className={style.al} href="/changePass">Change Password</a></li>:<li><Link to="/login">Register/Login</Link></li>}
                {access_token?<li><span  className={style.al}  onClick={handleLogout}>Logout</span></li>:null} */}

                <div className={style.system}>
                  <div><Search className={style.icons}/></div>
                  <div><BsWhatsapp className={style.icons}/></div>
                  <div><LikedDrawer /></div>
                  <div ><Cart style={{display:"none"}}/></div>
                  <div><Profile /></div>
                </div>

              </div>            

            </ul>

          </nav>
        
          <div className={cl?style.drops:style.out}></div>
         
    </div>
  
	</>
	);
};

export default Navbar;