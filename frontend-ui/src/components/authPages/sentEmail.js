import React, { useEffect } from 'react'
import './login.css';
import { Grid, TextField, Button, Box, Alert,Typography, CircularProgress } from "@mui/material";
import { useState } from 'react';
import { useSendPasswordResetEmailMutation } from "../../Redux-manage/services/userAuthapi";
import Navbar from '../global/NavHeader';
import { notification } from 'antd';

const SentEmail = () => {
  notification.destroy()
    const [error, setError] = useState({})
  const [msg, setMsg] = useState({})

  const[sendPasswordResetEmail,{isLoading}]=useSendPasswordResetEmailMutation()


  const handleSubmit = async(e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      email: data.get('email').toLowerCase(),
    }
  
    const res=await sendPasswordResetEmail(actualData)
  
    if(res.error){
      setMsg({})
      setError(res.error.data.errors)
    }
    if(res.data){
     setError({})
     setMsg(res.data)
     document.getElementById('password-reset-email-form').reset()
    }
  }

  
  return (
    <>
    <Navbar/>
    <div class="bod">
    <div class="mai" style={{height:"50vh"}}>  	
			<div class="signu" style={{marginTop:"5vh"}}>
				<form  id="password-reset-email-form" onSubmit={handleSubmit}>
					<label class="labe" aria-hidden="true" style={{fontSize:"1.6rem"}}>Change Password</label>
					{error.non_field_errors? <Alert severity="error" style={{margin:"0 60px"}}>{error.non_field_errors[0]}</Alert> : ""}
                    {msg.msg ? <Alert severity="success" style={{margin:"0 60px"}}>Sent Successfully,Please Check your 
                    <a href="https://mail.google.com/" style={{fontSize:"16px",textDecoration:"underline",color:"blue"}}> Mail</a>
                    </Alert> : ""}
					
					<input style={{marginBottom:"0"}} class="inpu" type="email" name="email" placeholder=" Registered Email" required="" onChange={e=>setMsg({})}/>
					{error.email?<Typography style={{color:"red",paddingLeft:"70px",fontSize:"0.8rem"}}>{error.email[0]}</Typography>:" "}

					{isLoading?
          <span class="butto" style={{backgroundColor:"#000000",textAlign:"center",padding:"8px 0",cursor:"not-allowed"}} >Send Email</span>
          :
          <button class="butto" style={{backgroundColor:"#573b8a",}} type='submit'>Send Email</button>}

					
				</form>
			</div>
	</div>
  </div>
    </>
  )
}

export default SentEmail;