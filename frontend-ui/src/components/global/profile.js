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



export const Profile = () => {
    const dispatch= useDispatch();
    const nav=useNavigate()
    const handleLogout = () => {
        dispatch(unSetUserInfo({email:"",name:""}))
        dispatch(unSetUserToken({access_token:null}))
        removeToken()
        localStorage.clear()
        nav('/')
      }



      const {data,isSuccess}=useGetLoggedUserQuery(localStorage.getItem('access_token'))
 const [userdata,setUserData]=useState({
    email:"",
    name:""
  })

  useEffect(()=>{
    if(data&&isSuccess)
    setUserData({
      email:data.email,
      name:data.name,
    })
console.log(userdata)
  },[data,isSuccess])

  return (
    <>
    

    <div className={style.action}>
    <div className={style.profile}>
      <FaUserCircle style={{width:"30px",hieght:"30px",color:"#7c7c7c"}} />
      {/* <img className={style.img} src="./assets/avatar.jpg" /> */}
      </div>
    <div className={style.menu}>
      {localStorage.getItem('access_token')&&userdata?<h3 className={style.h3}>{userdata.name}<br /><span className={style.span}>{userdata.email}</span></h3>:<h3 className={style.h3}>You Are Not Logged In<br /><span className={style.span}>Login Or Register First</span></h3>}
      <ul className={style.ul}>
       
       {localStorage.getItem('access_token')?null:<li  className={style.l} style={{marginLeft:"-30px"}}>
        <BiLogIn className={style.img} style={{color:"red",height:"20px",width:"20px !important"}}/><Link to="/login" className={style.a}>Register/Login</Link>
        </li>} 
        {localStorage.getItem('access_token')?<li className={style.l} style={{marginLeft:"-30px"}}>
          <MdPublishedWithChanges className={style.img} style={{color:"black",height:"20px",width:"20px !important"}}/><Link to="/changePass" className={style.a}>Change Password</Link>
        </li>:null}
        {localStorage.getItem('access_token')? <li className={style.l} style={{marginLeft:"-30px"}}>
          <BiLogOut className={style.img} style={{color:"red",height:"20px",width:"20px !important"}}/><Link to="/" className={style.a} onClick={handleLogout}>Logout</Link>
        </li>:null}
      </ul>
    </div>
    
  </div>
  </>
  )
}
