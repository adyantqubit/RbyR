import React from 'react'
import { Alert,Typography } from "@mui/material";
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useResetPasswordMutation } from "../../Redux-manage/services/userAuthapi";
import Navbar from '../global/NavHeader'
import { notification } from 'antd';


const ResetPassword = () => {
    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [msg, setMsg] = useState({})
  
   const[resetPassword,{isLoading}]= useResetPasswordMutation()
   const{id,token}=useParams()
  
    const handleSubmit = async(e) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      const actualData = {
        password: data.get('pswd'),
        password2: data.get('pswd2'),
      }
  
      const res=await resetPassword({actualData,id,token})
      if(res.error){
        setMsg({})
        setError(res.error.data.errors)
      }
      if(res.data){
       setError(null)
       notification.error({
        message: <div style={{fontSize:"18px",color:"black"}}>Successfully Logged In. </div>,
        description:
        `Successfully Password Update`,
        className:"custom-class",
        style: { backgroundColor:"#8c8c8c",color:"black",marginTop:"5vh"},
        duration:5,
        key:1
        });
       setMsg(res.data)
       navigate("/login")
      }   
    }
  return (
    <>
    <Navbar/>
    <div class="bod">
    <div class="mai" style={{height:"50vh"}}>  	
			<div class="signu" style={{marginTop:"5vh"}}>
				<form  id="password-change-form" onSubmit={handleSubmit}>
					<label class="labe" aria-hidden="true" style={{fontSize:"1.6rem"}}>Change Password</label>
					{error!=null ? <Alert severity="error" style={{margin:"0 60px"}}>{error.non_field_errors}</Alert> : ""}
                    {msg.msg ? <Alert severity="success"  style={{margin:"0 50px"}}>successfully changed</Alert> : ""}
										

					<input style={{marginBottom:"0"}} class="inpu" type="password" name="pswd" placeholder="Password" required=""/>
					{error!=null&&error.password?<Typography style={{color:"red",paddingLeft:"70px",fontSize:10}}>{error.password[0]}</Typography>:" "}

					<input style={{marginBottom:"0"}} class="inpu" type="password" name="pswd2" placeholder="Confirm Password" required=""/>
					{error!=null&&error.password2?<Typography style={{color:"red",paddingLeft:"70px",fontSize:10}}>{error.password2[0]}</Typography>:" "}

					<button class="butto" style={{backgroundColor:"black",}} type='submit'>Change</button>
				</form>
			</div>
	</div>
  </div>
    </>
  )
}

export default ResetPassword