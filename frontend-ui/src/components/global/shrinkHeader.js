
//Commented by Rohan kansari - 27/11/22
//reason - this header work for mobile screens and big header hide below 768px
//jira story point - rbyr222

import { React, useEffect, useState } from 'react'
import Drawer from 'react-modern-drawer'
import { GiHamburgerMenu } from 'react-icons/gi'
import { CgProfile } from "react-icons/cg";
//import styles 👇
import 'react-modern-drawer/dist/index.css'
import style from './shrinkHeader.module.css'
import { AiOutlineRight, AiOutlineClose } from 'react-icons/ai'
import { RiArrowLeftLine } from 'react-icons/ri'
import { BsWhatsapp } from 'react-icons/bs'
import Search from './search';
import styles from './NavHeader.module.css'
import Cart from './cart';

import { profile, submenus } from './header_links.js'
import { Link, useNavigate, useParams } from 'react-router-dom';
import LikeDrawer from './liked';
import { useDispatch } from 'react-redux';
import { CartState } from '../../context';
import { unSetUserInfo } from '../../Redux-manage/features/userSlice';
import { unSetUserToken } from '../../Redux-manage/features/authSlice';
import { removeToken } from '../../Redux-manage/services/localStorageService';
import { notification, Popconfirm } from 'antd';
import { getWhatsappContactDetail } from '../../api/service';
import Converter from '../concepts/convertCurrency';
import { useGetLoggedUserQuery } from '../../Redux-manage/services/userAuthapi';
import { getLogoAndCover } from "../../api/service";
import config from '../../api/config';
const text = 'Are you sure you want to logout?';


const ShrinkHeader = () => {
  const { menus} = CartState()
  const [menu, setMenu] = useState(null)
  const nav = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [category, setcategory] = useState(null)
  const [parentmenu,setparentMenu]=useState("")
  const [logo, setLogo] = useState("https://res.cloudinary.com/dzzdidhrq/image/upload/v1665666532/imageedit_1_8617192145_tkdkvr-removebg-preview_vu0nj5.jpg");

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState)
  }

  const [isOpen2, setIsOpen2] = useState(false)

  const toggleDrawer2 = () => {
    setIsOpen2((prevState) => !prevState)
    seLogoutAction(false)

  }

  useEffect(() => {
    getWhatsappContactNumber()
    // getLogoAndCoverDetail();
  }, [])

  const [whatsappContactNumber, setWhatsappContactNumber] = useState(false);

  // const getLogoAndCoverDetail = async () => {

  //   const coverAndLogoData = await getLogoAndCover();
  //   if (coverAndLogoData) {
  //     setLogo(coverAndLogoData[0].logo);
  //   }
  // };

  const getWhatsappContactNumber = async () => {
    const whatsappContactNumberData = await getWhatsappContactDetail();
    if (whatsappContactNumberData) {
      setWhatsappContactNumber(whatsappContactNumberData[0]?.whatsappNmber);
      setLogo(whatsappContactNumberData[0]?.logo);

    }
  };

  const dispatch = useDispatch();
  const { userdata, setUserData, firstTimeLoadFunctions, setCategorySelected } = CartState()
  const handleLogout = () => {
    dispatch(unSetUserInfo({ email: "", name: "" }))
    dispatch(unSetUserToken({ access_token: null }))
    removeToken()
    localStorage.clear()

    firstTimeLoadFunctions()
    localStorage.setItem('logout', true);
    window.location.reload(false)

  }

  const [logoutaction, seLogoutAction] = useState(false)
  const { data, isSuccess } = useGetLoggedUserQuery(localStorage.getItem('access_token'))

  useEffect(() => {
    if (data && isSuccess)
      setUserData({
        email: data.email,
        name: data.name,
        contact: data.contact_number
      })
  }, [data, isSuccess])


  function settingMenus(menuName, index) {
    if (menus[index][`${menuName[0]}`].length > 0) {
      setcategory(menus[index][`${menuName[0]}`])
      setparentMenu(menuName[0])
      toggleDrawer2()
      setMenu(null)
    }
    else {
      toggleDrawer()
    }

  }

  return (
    <div className={style.responsiveHeader}>
      <div className={style.topText}>FOR CUSTOMIZATIONS OR PERSONAL ASSISTANCE, WHATSAPP US AT +91
        {/* Commented and modified by - Ashish Dewanan on 15-02-2023
      Reason - To open link in new tab */}
        {/* <a href={`https://wa.me/+91${whatsappContactNumber}?text=Hi! Could you help me with a few queries!`} className={style.number} >{whatsappContactNumber ? whatsappContactNumber : "Not Added"}</a></div> */}
        <a href={`https://wa.me/+91${whatsappContactNumber}?text=Hi! Could you help me with a few queries!`} className={style.number}
          target="_blank" >{whatsappContactNumber ? whatsappContactNumber : "Not Added"}</a></div>
      {/* End of code modification */}
      <div className={style.headerContainer}>

        <div style={{ display: "flex" }}>
          <div className={style.humbergerDiv}>
            <GiHamburgerMenu onClick={toggleDrawer} fontSize="30px" color='var(--iconsColor)' />
          </div>
          <div className={style.logo}>
            <Converter />
            <Link to="/">
              {/* <img alt="header" src="https://res.cloudinary.com/dzzdidhrq/image/upload/v1665666532/imageedit_1_8617192145_tkdkvr-removebg-preview_vu0nj5.jpg" className={style.img}></img> */}
               {/* Modification and addition by Om Shrivastava on 19-10-23
            Reason : Need to set the path of the store locator image */}
              {/* <img src={config.staticBaseURL + logo} alt="Logo" className={style.img} /> */}
              <img src={config.staticBaseURL +'media/'+ logo} alt="Logo" className={style.img} />
          {/* End of modification and addition by Om Shrivastava on 19-10-23
          Reason : Need to set the path of the store locator image */}
            </Link>
          </div>

          <div className={style.headerMenu}>
            {/* <div className={style.headerMenuitem} >
             
            </div> */}
            <div className={style.headerMenuitem} >
              <Search className={styles.icons} fontSize={24} />
            </div>
            <div className={style.headerMenuitem} >
              {/* Commented and modified by - Ashish Dewangan on 15-02-2023
                  Reason - To open external links in new browser tab */}
              {/* <a
                href={`https://wa.me/+91${whatsappContactNumber}?text=Hi! Could you help me with a few queries!`}
              > */}
              <a
                href={`https://wa.me/+91${whatsappContactNumber}?text=Hi! Could you help me with a few queries!`}
                target="_blank">
                {/* End of code modification */}
                <BsWhatsapp className={styles.icons} fontSize={24} />
              </a>
            </div>
            <div className={style.headerMenuitem} >
              <LikeDrawer />
            </div>
            <div className={style.headerMenuitem} style={{ paddingTop: "10px", width: "20px" }} >
              <Cart style={{ display: "none" }} />
            </div>

          </div>
        </div>
      </div>

      <Drawer
        size="90%"
        open={isOpen}
        onClose={e => { toggleDrawer() }}
        direction='left'
      >
        <div className={style.main} >

          <div className={style.drawerhead}>

            <div className={style.drawerMenu} style={{ height: "50px" }}>
              <div className={style.drawerClose}>
                <div></div>
                <AiOutlineClose onClick={toggleDrawer} color="var(--iconsColor)" fontSize={20} /></div>
            </div>

          </div>

          {/* Added by -Rohan 30/12/22
              Reason- showing parent menu coming from backend */}
          <Link to="/" className={style.drawerMenu} onClick={toggleDrawer}>
            Home
          </Link>
          {
            menus?.map((m, i) => {
              var parent = Object.keys(m)

              return <Link to={
                  m.shownMenuNImg &&m[`${parent[0]}`]?.length>0? `/categories/${parent[0]}` :
                  m.shownInstFilter ? `/listing/${parent[0]}/0` :
                  `/listing/${parent[0]}/0`
              } className={style.drawerMenu}>
                <div style={{ justifyContent: "space-between", width: "100%", display: "flex" }} onClick={e => {toggleDrawer(); setCategorySelected([])}}><span>{parent[0]}</span></div>
              </Link>

              // commented by Rohan-on- 17/2/23
              // Reason - removing second drawer and directly showing category
              // if (m[`${parent[0]}`].length > 0){
              //   return <Link to="#" className={style.drawerMenu}>
              //            <div style={{ justifyContent: "space-between", width: "100%", display: "flex" }} onClick={e => settingMenus(parent, i)}><span>{parent[0]}</span> <AiOutlineRight /></div>
              //          </Link>
              // }
              // else{
              //   return <Link to={`/listing/${parent[0]}/0`} className={style.drawerMenu}>
              //            <div style={{ justifyContent: "space-between", width: "100%", display: "flex" }} onClick={e => settingMenus(parent, i)}><span>{parent[0]}</span></div>
              //          </Link>
              // }
            })
          }

          <Link to={`/listing/ready to ship/0`} className={style.drawerMenu}>
            <div style={{ justifyContent: "space-between", width: "100%", display: "flex" }} onClick={e => { toggleDrawer() }}>
              <span>Ready to ship</span> <AiOutlineRight />
            </div>
          </Link>

          {/* Commented and modified by - Ashish Dewangan on 15-02-2023
          Reason - To hide submenu of world of rbyr */}
          {/* <Link to="#" className={style.drawerMenu}>
            <div style={{ justifyContent: "space-between", width: "100%", display: "flex" }} onClick={e => { toggleDrawer2(); setMenu(submenus) }}>
              <span>WORLD OF RbyR</span> <AiOutlineRight />
            </div>
          </Link> */}
          <Link to="/AboutRR" className={style.drawerMenu}>
            <div style={{ justifyContent: "space-between", width: "100%", display: "flex" }} onClick={e => { toggleDrawer() }}>
              <span>World of RbyR</span> <AiOutlineRight />
            </div>
          </Link>
          {/* End of code modification */}
          {/* End of code */}

          
          <Link to='/custom' className={style.drawerMenu} onClick={toggleDrawer}>
            <div style={{ justifyContent: "space-between", width: "100%", display: "flex" }}><span> Contact us</span> </div>
          </Link>

          <div className={style.drawerMenu} >
            <div style={{ justifyContent: "space-between", width: "100%", display: "flex" }} onClick={e => {
              if (localStorage.getItem("access_token")) {
                setMenu(profile);
                toggleDrawer2()
                setcategory(null)
              }
              else {
                nav("/login")
                toggleDrawer()
              }
            }}>
              <span> My account</span><AiOutlineRight />
            </div>
          </div>
        </div>
      </Drawer>

      <Drawer
        size="90%"
        open={isOpen2}
        onClose={e => { toggleDrawer2(); toggleDrawer() }}
        direction='left'
      >
        {/* commented and modified by - Ashish Dewangan on 16-02-2023
        Reason - To have styling in seperate file */}
        {/* <div style={{ width: "100%", height: "100%", background: "white", padding: "10%" }}> */}
        <div className={style.drawerContainer} >
          {/* End of code modification */}
          <div className={style.drawerhead}>

            <div className={style.drawerMenu}>
              <div className={style.drawerClose}>
                <div><RiArrowLeftLine fontSize={24} onClick={toggleDrawer2} color="var(--iconsColor)" /></div>
                <AiOutlineClose onClick={e => { toggleDrawer(); toggleDrawer2() }} fontSize={24} color="var(--iconsColor)" />
              </div>
            </div>

          </div>

          {/* Added by Rohan - 30/12/22 
             Reason - showing menu comes from backend according to parent menu selected*/}
          {menu == null ?
            <Link to={`/listing/${parentmenu}/0`} className={style.drawerMenu} >
              <div style={{ justifyContent: "space-between", width: "100%", display: "flex" }} onClick={e => { toggleDrawer(); toggleDrawer2(); setCategorySelected([]) }} >
                <span style={{ color: "black", letterSpacing: "1.2px" }}>VIEW ALL</span>
              </div>
            </Link>
            : null}


          {category?.map(m =>
            <Link to={`/listing/${parentmenu}/${m.category}`} className={style.drawerMenu} >

              <div style={{ justifyContent: "space-between", width: "100%", display: "flex" }} onClick={e => { toggleDrawer(); toggleDrawer2(); setCategorySelected([]) }} >
                <span style={{ color: "black", letterSpacing: "1.2px" }}>{m.category}</span>
              </div>
            </Link>
          )}



          {/* End of code */}


          {/* This show username and email if profile drawer is open and user logged in already */}
          {menu?.filter(f => f.name == "LOGOUT").length > 0 ?
            <Link to="" className={style.drawerMenu} >
              <div style={{ width: "100%" }} >
                <div style={{ color: "var(--textColorPrimary)", letterSpacing: "1.2px", width: "100%", textAlign: "center" }}> <CgProfile style={{ margin: "0 10px 0 0" }} />{userdata.name}</div>
                <div style={{ color: "var(--textColorSecondary)", letterSpacing: "1.2px", width: "100%", textAlign: "center" }}>{userdata.email}</div>
              </div>
            </Link> : null}


          {/* This shown MY ACCOUNT menus if user is already logged in. */}
          {menu?.map(m => <>

            <Link to={m.link} className={style.drawerMenu} >
              {m.name == "LOGOUT" ?
                <div style={{ justifyContent: "space-between", width: "100%", display: "flex" }} onClick={e => { seLogoutAction(true); }}>
                  <span>{m.name}</span> <AiOutlineRight />
                </div>
                : <div style={{ justifyContent: "space-between", width: "100%", display: "flex" }} onClick={e => { toggleDrawer(); toggleDrawer2(); setCategorySelected([]) }} >
                  <span style={{ color: "var(--textColorPrimary)", letterSpacing: "1.2px" }}>{m.name}</span> <AiOutlineRight />
                </div>}

            </Link>
          </>
          )}


          <Popconfirm placement="bottomLeft" title={text} onConfirm={e => handleLogout()} onCancel={e => seLogoutAction(false)} okText="OK" cancelText="Cancel" open={logoutaction}>
          </Popconfirm>

        </div>
      </Drawer>
    </div>
  )
}

export default ShrinkHeader

//End Of the code