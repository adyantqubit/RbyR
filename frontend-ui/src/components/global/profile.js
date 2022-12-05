import React, { useEffect, useState } from 'react'
import style from './NavHeader.module.css'
import {FaUserCircle} from 'react-icons/fa'

import {BiLogOut,BiLogIn} from 'react-icons/bi'
import {MdPublishedWithChanges} from 'react-icons/md'

import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { unSetUserInfo } from '../../Redux-manage/features/userSlice'
import { unSetUserToken } from '../../Redux-manage/features/authSlice'
import { removeToken } from '../../Redux-manage/services/localStorageService'
import { useGetLoggedUserQuery } from '../../Redux-manage/services/userAuthapi'
import { CartState } from '../../context'
import { notification } from 'antd'

import { Button, message } from 'antd';


export const Profile = () => {

  const [messageApi, contextHolder,setCart,setLike] = message.useMessage();

    const dispatch= useDispatch();
    const{userdata,setUserData,firstTimeLoadFunctions}=CartState()
    const nav=useNavigate()
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



 const {data,isSuccess}=useGetLoggedUserQuery(localStorage.getItem('access_token'))


  useEffect(()=>{
    if(data&&isSuccess)
    setUserData({
      email:data.email,
      name:data.name,
    })
  },[data,isSuccess])

  return (
    <>
    <div className={style.action}>
    <div className={style.profile}>
      <FaUserCircle style={{width:"30px",hieght:"30px",color:"#7c7c7c"}} />
      {/* <img className={style.img} src="./assets/avatar.jpg" /> */}
      </div>
    <div className={style.menu}>
      {localStorage.getItem('access_token')&&userdata?
      <h3 className={style.h3}>
        {userdata.name}<br />
        <span className={style.span}>{userdata.email}</span>
        </h3>
        :
        <h3 className={style.h3}>You Are Not Logged In<br />
        <span className={style.span}>Login Or Register First</span></h3>}
      <ul className={style.ul}>
       
       {localStorage.getItem('access_token')?
       null:
       <li  className={style.l} style={{marginLeft:"-30px"}}>
        <BiLogIn className={style.img} style={{color:"red",height:"20px",width:"20px !important"}}/><Link to="/login" className={style.a}>Register/Login</Link>
        </li>} 

        {localStorage.getItem('access_token')? <li className={style.l} style={{marginLeft:"-30px"}}>
         <Link to="/profile" className={style.a}>My Orders</Link>
        </li>:null}

        {localStorage.getItem('access_token')? <li className={style.l} style={{marginLeft:"-30px"}}>
         <Link to="/shippindprofile" className={style.a}>Shipping Details</Link>
        </li>:null}

        {localStorage.getItem('access_token')? <li className={style.l} style={{marginLeft:"-30px"}}>
         <Link to="/userprofile" className={style.a}>My Profile</Link>
        </li>:null}

        {/* {localStorage.getItem('access_token')?<li className={style.l} style={{marginLeft:"-30px"}}>
        <Link to="/changePass" className={style.a}>Change Password</Link>
        </li>:null} */}

        {/* <div className={style.column1text}><Link to="/shippindprofile" style={{textDecoration:"none",color:"#8c8c8c"}}>MY SHIPPING DETAILS</Link></div> */}

        {localStorage.getItem('access_token')? <li className={style.l} style={{marginLeft:"-30px"}}>
         <Link to="/" className={style.a} onClick={handleLogout}>Logout</Link>
        </li>:null}

     
      </ul>
    </div>
    
  </div>
  </>
  )
}
