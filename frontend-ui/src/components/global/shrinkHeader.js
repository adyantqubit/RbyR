
//Commented by Rohan kansari - 27/11/22
//reason - this header work for mobile screens and big header hide below 768px
//jira story point - rbyr222

import {React, useEffect, useState} from 'react'
import Drawer from 'react-modern-drawer'
import { GiHamburgerMenu } from 'react-icons/gi'
import { BsSearch } from "react-icons/bs";
//import styles 👇
import 'react-modern-drawer/dist/index.css'
import style from './shrinkHeader.module.css'
import { AiOutlineRight, AiOutlineClose } from 'react-icons/ai'
import { RiArrowLeftLine } from 'react-icons/ri'
import {BsWhatsapp} from 'react-icons/bs'
import Search from './search';
import styles from './NavHeader.module.css'
import Cart from './cart';

import {profile,menus} from './header_links.js'
import { Link, useNavigate } from 'react-router-dom';
import LikeDrawer from './liked';
import { useDispatch } from 'react-redux';
import { CartState } from '../../context';
import { unSetUserInfo } from '../../Redux-manage/features/userSlice';
import { unSetUserToken } from '../../Redux-manage/features/authSlice';
import { removeToken } from '../../Redux-manage/services/localStorageService';
import { notification, Popconfirm } from 'antd';
import { getWhatsappContactDetail } from '../../api/service';

const text = 'Are you sure you want to logout?';


const ShrinkHeader = () => {
 const [menu,setMenu]=useState([...profile])   
const nav=useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState)
  }

  const [isOpen2, setIsOpen2] = useState(false)

  const toggleDrawer2 = () => {
    setIsOpen2((prevState) => !prevState)

  }

  useEffect(()=>{
getWhatsappContactNumber()
  },[])

  const [whatsappContactNumber, setWhatsappContactNumber] = useState(false);

  const getWhatsappContactNumber = async () => {
    const whatsappContactNumberData = await getWhatsappContactDetail();
    if (whatsappContactNumberData) {
      setWhatsappContactNumber(whatsappContactNumberData[0].whatsappNmber);
    }
  };

  const dispatch= useDispatch();
    const{userdata,setUserData,firstTimeLoadFunctions}=CartState()
    const handleLogout = () => {
        dispatch(unSetUserInfo({email:"",name:""}))
        dispatch(unSetUserToken({access_token:null}))
        removeToken()
        localStorage.clear()
        nav('/')
        firstTimeLoadFunctions()
        localStorage.setItem('logout',true);
        window.location.reload(false)

      }

      const [logoutaction,seLogoutAction]=useState(false)

  return (
    <div className={style.responsiveHeader}>
      <div className={style.topText}>FOR CUSTOMIZATIONS OR PERSONAL ASSISTANCE, WHATSAPP US AT <a href={`https://wa.me/${whatsappContactNumber}?text=Hi! Could you help me with a few queries!`} className={style.number} >+91 7865435434</a></div>


      <div className={style.headerContainer}>

        <div style={{ display: "flex" }}>
          <div className={style.humbergerDiv}>
            <GiHamburgerMenu onClick={toggleDrawer} fontSize="30px" color='#7c7c7c' />
          </div>
          <div className={style.logo}>
           <Link to="/"><img alt="header" src="https://res.cloudinary.com/dzzdidhrq/image/upload/v1665666532/imageedit_1_8617192145_tkdkvr-removebg-preview_vu0nj5.jpg" className={style.img}></img></Link> 
          </div>

          <div className={style.headerMenu}>
            <div className={style.headerMenuitem} >
            <Search className={styles.icons} fontSize={24}/>
            </div>
            <div className={style.headerMenuitem} >
            <a
            href={`https://wa.me/${whatsappContactNumber}?text=Hi! Could you help me with a few queries!`}
            >
            <BsWhatsapp className={styles.icons} fontSize={24}/>
            </a>
            </div>
            <div className={style.headerMenuitem} >
            <LikeDrawer/>
            </div>
            <div className={style.headerMenuitem}  >
            <Cart style={{display:"none"}}/>
            </div>
            
          </div>
        </div>
      </div>

      <Drawer
        open={isOpen}
        onClose={e => { toggleDrawer() }}
        direction='left'
      >
        <div className={style.main} >

          <div className={style.drawerhead}>

            <div className={style.drawerMenu}>
              <div className={style.drawerClose}>
                <div></div>
                <AiOutlineClose onClick={toggleDrawer} fontSize={24} /></div>
            </div>

          </div>

          
          <Link to="/" className={style.drawerMenu}>
            Home
          </Link>
          
            <div className={style.drawerMenu}>
            <div style={{ justifyContent: "space-between", width: "100%", display: "flex" }} onClick={e=>{toggleDrawer2(); setMenu(menus)}}><span>Ethnic</span> <AiOutlineRight /></div>
            </div>
          <Link to='/listing/luxurypret' className={style.drawerMenu}>
            <div style={{ justifyContent: "space-between", width: "100%", display: "flex" }}><span>Luxury Pret</span> </div>
          </Link>
          <Link to='/listing/readytowear' className={style.drawerMenu}>
            <div style={{ justifyContent: "space-between", width: "100%", display: "flex" }}><span> Ready To wear</span> </div>
          </Link>
          <Link to='/listing/worldofrr' className={style.drawerMenu}>
            <div style={{ justifyContent: "space-between", width: "100%", display: "flex" }}><span> World of RbyR</span> </div>
          </Link>
          <Link to='/custom' className={style.drawerMenu}>
            <div style={{ justifyContent: "space-between", width: "100%", display: "flex" }}><span> Contact Us</span> </div>
          </Link>
          
          <div className={style.drawerMenu}>
            <div style={{ justifyContent: "space-between", width: "100%", display: "flex" }} onClick={e=>{
                if(localStorage.getItem("access_token")){
                    setMenu(profile)
                    toggleDrawer2()
                }
                else
                nav("/login")
            }}>
               <span> My Account</span><AiOutlineRight />
            </div>
          </div>
        </div>
      </Drawer>

      <Drawer
        open={isOpen2}
        onClose={e => { toggleDrawer2(); toggleDrawer() }}
        direction='left'
      >
        <div style={{ width: "100%", height: "100%", background: "#323232", padding: "10%" }}>

          <div className={style.drawerhead}>

            <div className={style.drawerMenu}>
              <div className={style.drawerClose}>
                <div><RiArrowLeftLine fontSize={24} onClick={toggleDrawer2} color="#7c7c7c" /></div>
                <AiOutlineClose onClick={e => { toggleDrawer(); toggleDrawer2() }} fontSize={24} color="#7c7c7c" />
              </div>
            </div>

          </div>

          {menu.map(m=>     <>     
           
            <Link to={m.link} className={style.drawerMenu}>
              {m.name=="Logout"?
             <div style={{ justifyContent: "space-between", width: "100%", display: "flex"}} onClick={e=>seLogoutAction(true)}>
              <span>{m.name}</span> <AiOutlineRight />
              </div>
              :<div style={{ justifyContent: "space-between", width: "100%", display: "flex"}}  >
                <span>{m.name}</span> <AiOutlineRight />
              </div>}
              
                
            </Link>
            </> 
            )}
          
          <Popconfirm placement="bottomLeft" title={text} onConfirm={e=>handleLogout()} onCancel={e=>seLogoutAction(false)} okText="OK" cancelText="Cancel" open={logoutaction}>
    </Popconfirm>
          {/* <div className={style.drawerMenu}>
            Partywear
          </div>
          <div className={style.drawerMenu}>
            <div style={{ justifyContent: "space-between", width: "100%", display: "flex" }} ><span>Casual</span> <AiOutlineRight /></div>
          </div>
          <div className={style.drawerMenu}>
            <div style={{ justifyContent: "space-between", width: "100%", display: "flex" }}><span>Kurti</span> </div>
          </div>
          <div className={style.drawerMenu}>
            <div style={{ justifyContent: "space-between", width: "100%", display: "flex" }}><span> Wedding wear</span> </div>
          </div>
          <div className={style.drawerMenu}>
            <div style={{ justifyContent: "space-between", width: "100%", display: "flex" }}><span> Formal</span> </div>
          </div> */}
        </div>
      </Drawer>
    </div>
  )
}

export default ShrinkHeader

//End Of the code