import React, { useEffect } from 'react'
import './login.css';
import { Grid, TextField, Button, Box, Alert,Typography } from "@mui/material";
import { useState } from 'react';
import { useSendPasswordResetEmailMutation } from "../../Redux-manage/services/userAuthapi";
import Navbar from '../global/NavHeader';


const SentEmail = () => {
    const [error, setError] = useState({})
  const [msg, setMsg] = useState({})

  const[sendPasswordResetEmail,{isLoading}]=useSendPasswordResetEmailMutation()


  const handleSubmit = async(e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      email: data.get('email'),
    }
  
    const res=await sendPasswordResetEmail(actualData)
  
    if(res.error){
      console.log(res)
      setMsg({})
      setError(res.error.data.errors)
    }
    if(res.data){
     console.log(res.data)
     setError({})
     setMsg(res.data)
     document.getElementById('password-reset-email-form').reset()
    }
  }

  useEffect(()=>{
   console.log(error)
  },[error])

  
  return (
    <>
    <Navbar/>
    <div class="bod">
    <div class="mai" style={{height:"50vh"}}>  	
			<div class="signu" style={{marginTop:"5vh"}}>
				<form  id="password-reset-email-form" onSubmit={handleSubmit}>
					<label class="labe" aria-hidden="true" style={{fontSize:"1.6rem"}}>Change Password</label>
					{error.non_field_errors? <Alert severity="error" style={{margin:"0 50px"}}>{error.non_field_errors[0]}</Alert> : ""}
                    {msg.msg ? <Alert severity="success" style={{margin:"0 49px",marginTop:"10px"}}>Sent Successfully</Alert> : ""}
					
					<input style={{marginBottom:"0"}} class="inpu" type="email" name="email" placeholder="Register Email" required=""/>
					{error.email?<Typography style={{color:"red",paddingLeft:"70px",fontSize:"0.8rem"}}>{error.email[0]}</Typography>:" "}

					<button class="butto" style={{backgroundColor:"purple",}} type='submit'>Send Email</button>
				</form>
			</div>
	</div>
  </div>
    </>
  )
}

export default SentEmail;