import React, { useEffect, useState } from 'react';
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

import {BsWhatsapp,BsSearch} from 'react-icons/bs'
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
import { getLogoAndCover, getWhatsappContactDetail } from "../../api/service";
import ShrinkHeader from './shrinkHeader';
import { CartState } from '../../context';
import { notification } from 'antd';

const Navbar = () => {
  notification.destroy()
	const[cl,setClass]=useState(false);
	const [open, setOpen] = useState(false);
  const{access_token,refresh_token}= getToken()

  const [logo, setLogo] = useState("https://res.cloudinary.com/dzzdidhrq/image/upload/v1665666532/imageedit_1_8617192145_tkdkvr-removebg-preview_vu0nj5.jpg");
  const {setReload,setCategorySelected}=CartState()


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

  useEffect(() => {
    getLogoAndCoverDetail();
    getWhatsappContactNumber()
  }, []);

  const getLogoAndCoverDetail = async () => {
    
    const coverAndLogoData = await getLogoAndCover();
    if(coverAndLogoData){
      setLogo(coverAndLogoData[0].logo);
    }
  };

  const [whatsappContactNumber, setWhatsappContactNumber] = useState(false);

  const getWhatsappContactNumber = async () => {
    const whatsappContactNumberData = await getWhatsappContactDetail();
    if (whatsappContactNumberData) {
      setWhatsappContactNumber(whatsappContactNumberData[0].whatsappNmber);
    }
  };

	return (
		<>
		<div className={style.contain} style={{borderBottom:"1px solid white"}}>
      <div style={{background:"#000",color:"white",display:"flex",justifyContent:"center",fontSize:".7rem",letterSpacing:"1px",fontStyle:"bold",fontWeight:"600"}}>FOR CUSTOMIZATIONS OR PERSONAL ASSISTANCE, WHATSAPP US AT +<a href={`https://wa.me/${whatsappContactNumber}?text=Hi! Could you help me with a few queries!`} style={{textDecoration:"none",outline:"none",color:"white",fontSize:".75rem"}}>{whatsappContactNumber?whatsappContactNumber:" Not added"}</a></div>
     
        <div className={style.logo}>
        {/* <img src="https://res.cloudinary.com/dzzdidhrq/image/upload/v1665666532/imageedit_1_8617192145_tkdkvr-removebg-preview_vu0nj5.jpg" alt="Logo" onClick={openHome}/> */}

          <img src={config.apiBaseURL+logo}  alt="Logo" onClick={openHome}/>
        </div>

          <nav className={style.navbar}>
            
            <ul className={style.nav_links} style={{marginBottom:"0px"}}>
            
              <input type="checkbox" id="checkbox_toggle" />
              <label htmlFor="checkbox_toggle" className={style.hamburger}>&#9776;</label>
              
              <div style={{display:"flex",justifyContent:"space-around"}}>
              <Converter/>
              <div className={style.menu}>
                <li style={{height:"40px"}}><a className={style.al} href="/">Home</a></li>
                <li className={style.services} onMouseEnter={openc} onMouseLeave={closec}>
                  <span  className={style.al} href="/" style={{fontWeight:"450",fontSize:"16px"}}>Ethnic</span>
                
                  <ul className={style.dropdown}>
                    <li  style={{padding:"0",width:"40px",margin:"20px 15px",border:"none"}}><Link className={style.al2} to="/listing/partywear" onClick={e=>setCategorySelected([])} >Partywear</Link></li>
                    <li  style={{padding:".1em",width:"auto",margin:"20px 15px",border:"none"}}><Link className={style.al2} to="/listing/casual" onClick={e=>setCategorySelected([])}>Casual</Link></li>
                    <li  style={{padding:".1em",width:"auto",margin:"20px 15px",border:"none"}}><Link className={style.al2} to="/listing/kurti" onClick={e=>setCategorySelected([])}>Kurti</Link></li>
                    <li  style={{padding:".1em",width:"auto",margin:"20px 15px",border:"none"}}><Link className={style.al2} to="/listing/wedding_wear"onClick={e=>setCategorySelected([])}>Wedding Wear</Link></li>
                    <li style={{padding:".1em",width:"auto",margin:"20px 15px",border:"none"}}><Link className={style.al2}  to="/listing/formal" onClick={e=>setCategorySelected([])}>Formal</Link></li>
                    <li style={{padding:".1em",width:"auto",margin:"20px 15px",border:"none"}}><Link className={style.al2}  to="/listing/view_all" onClick={e=>setCategorySelected([])}>View All</Link></li>
    
                  </ul>    
                </li>


                <li className={style.services} >
                  <Link  className={style.al} to="/listing/luxury_pret" onClick={e=>setCategorySelected([])}>Luxury Pret</Link>
                </li>

                <li className={style.services} >
                  <Link  className={style.al} to="/listing/ready_to_wear" onClick={e=>setCategorySelected([])}>Ready To wear</Link>
                </li>

                <li className={style.services} >
                  <Link  className={style.al} to="/listing/world_of_rbyr" onClick={e=>setCategorySelected([])}>World of RbyR</Link>
                </li>
                </div>
              
                {/* {access_token?<li><a className={style.al} href="/changePass">Change Password</a></li>:<li><Link to="/login">Register/Login</Link></li>}
                {access_token?<li><span  className={style.al}  onClick={handleLogout}>Logout</span></li>:null} */}

                <div className={style.system}>
                  <div><Search className={style.icons}/></div>
                  <div>
                    <a href={`https://wa.me/${whatsappContactNumber}?text=Hi! Could you help me with a few queries!`}>
                      <BsWhatsapp className={style.icons}/>
                    </a>
                  </div>
                  <div><LikedDrawer /></div>
                  <div style={{position:"relative",top:"10px"}}><Cart/></div>
                  <div><Profile /></div>
                </div>

              </div>            

            </ul>

          </nav>
        
          <div className={cl?style.drops:style.out}></div>
         
    </div>
  <ShrinkHeader/>
	</>
	);
};

export default Navbar;