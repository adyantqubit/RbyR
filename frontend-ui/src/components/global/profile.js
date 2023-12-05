import React, { useEffect, useState } from 'react'
import style from './NavHeader.module.css'
import { FaUserCircle,FaUser  } from 'react-icons/fa'

import { BiLogOut, BiLogIn } from 'react-icons/bi'
import { MdPublishedWithChanges } from 'react-icons/md'

import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { unSetUserInfo } from '../../Redux-manage/features/userSlice'
import { unSetUserToken } from '../../Redux-manage/features/authSlice'
import { removeToken } from '../../Redux-manage/services/localStorageService'
import { useGetLoggedUserQuery } from '../../Redux-manage/services/userAuthapi'
import { CartState } from '../../context'
import { notification, Popconfirm } from 'antd'

import { Button, message } from 'antd';
import { BsCardText, BsEnvelope, BsMessenger, BsPerson } from 'react-icons/bs'
import { MdOutlineEmail } from 'react-icons/md';

const text = 'Are you sure you want to logout?';

export const Profile = () => {

  const [messageApi, contextHolder, setCart, setLike] = message.useMessage();

  const dispatch = useDispatch();
  const { userdata, setUserData, firstTimeLoadFunctions } = CartState()
  const nav = useNavigate()
  const handleLogout = () => {
    dispatch(unSetUserInfo({ email: "", name: "" }))
    dispatch(unSetUserToken({ access_token: null }))
    removeToken()
    localStorage.clear()
    nav('/')
    firstTimeLoadFunctions()
    localStorage.setItem('logout', true);
    window.location.reload(false)

  }



  const { data, isSuccess } = useGetLoggedUserQuery(localStorage.getItem('access_token'))
  const [logoutaction, seLogoutAction] = useState(false)

  useEffect(() => {
    if (data && isSuccess)
      setUserData({
        email: data?.email,
        name: data?.name,
        contact: data?.contact_number
      })
  }, [data, isSuccess])

  const access_token=localStorage.getItem('access_token')

  return (
    <>
    {/* {console.log(userdata.email.length)} */}
      <div className={access_token && userdata.email.length!=0?style.action:style.action2} onClick={e=>{
        if(userdata.email.length==0)
        nav("/login")
      }} >
        <div className={style.profile} >
          <FaUserCircle style={{ width: "30px", hieght: "30px",color:"var(--iconsColor)"}} />
          {/* <img className={style.img} src="./assets/avatar.jpg" /> */}
        </div>
        <div className={style.menu2} style={{padding:'2px'}}>
          <Popconfirm placement="bottomLeft" title={text} onConfirm={e => handleLogout()} onCancel={e => seLogoutAction(false)} okText="OK" cancelText="Cancel" open={logoutaction}>
          </Popconfirm>
          {localStorage.getItem('access_token') && userdata ?
          <div style={{marginTop:"15px",marginBottom:"15px",fontSize:"14px",fontWeight:"500",display:'flex',flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
            <FaUser style={{ width: "40px", hieght: "40px",color:"var(--iconsColor)",fontWeight:"bold"}}/>
            <div className={style.span} style={{whiteSpace:"nowrap", overflow:"hidden",textOverflow:"ellipsis",width:"100%",textAlign:"center"}}>{userdata.name}
              </div>
              <div  className={style.span} style={{whiteSpace:"nowrap", overflow:"hidden",textOverflow:"ellipsis",width:"100%",textAlign:"center"}}>{userdata.email}
            </div>
            </div>
            :
            <h3 style={{fontSize:'14px'}} className={style.h3}>You Are Not Logged In<br />
              <span style={{fontSize:'14px'}} className={style.span}>Login Or Register First</span></h3>}
          <ul className={style.ul}>

            {localStorage.getItem('access_token') ?
              null :
              <li className={style.l} style={{ marginLeft: "-30px",padding:'2px' }}>
                <BiLogIn className={style.img} style={{ color: "red", height: "20px", width: "20px !important" }} /><Link to="/login" className={style.a}>Register/Login</Link>
              </li>}

            {localStorage.getItem('access_token') ? <li className={style.l} style={{ marginLeft: "-30px",padding:'2px' }}>
              <Link to="/userprofile" className={style.a} style={{fontSize:'14px',padding:'2px'}}>My Profile</Link>
            </li> : null}


            {localStorage.getItem('access_token') ? <li className={style.l} style={{ marginLeft: "-30px",padding:'2px' }}>
              <Link to="/shippindprofile" className={style.a} style={{fontSize:'14px',padding:'2px'}}>Shipping Details</Link>
            </li> : null}

            {localStorage.getItem('access_token') ? <li className={style.l} style={{ marginLeft: "-30px",padding:'2px' }}>
              <Link to="/profile" className={style.a} style={{fontSize:'14px',padding:'2px'}}>My Orders</Link>
            </li> : null}

            {/* {localStorage.getItem('access_token')?<li className={style.l} style={{marginLeft:"-30px"}}>
        <Link to="/changePass" className={style.a}>Change Password</Link>
        </li>:null} */}

            {/* <div className={style.column1text}><Link to="/shippindprofile" style={{textDecoration:"none",color:"#8c8c8c"}}>MY SHIPPING DETAILS</Link></div> */}

            {localStorage.getItem('access_token') ? <li className={style.l} style={{ marginLeft: "-30px",cursor:"pointer" ,padding:'2px'}}>

              <span style={{fontSize:'14px',padding:'2px'}} className={style.a}  onClick={e => seLogoutAction(true)} >Logout</span>

            </li> : null}


          </ul>
        </div>

      </div>
    </>
  )
}
