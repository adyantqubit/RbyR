import React from 'react'
import Navbar from '../global/NavHeader'
import './login.css'
import { Box, TextField, Button, Alert,Typography } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getToken } from '../../Redux-manage/services/localStorageService';
import { useChangeUserPasswordMutation } from '../../Redux-manage/services/userAuthapi';



const ChngPass = () => {
	const [error, setError] = useState({});
	const [changeUserPassword]=useChangeUserPasswordMutation()
	let{access_token}=getToken()
  
  
	const handleSubmit = async(event) => {
	  event.preventDefault();
	  const data = new FormData(event.currentTarget);
	  const actualData = {
		oldPass:data.get('oldpswd'),
		password: data.get('pswd'),
		password2: data.get('pswd2'),
	  }
	  const res=await changeUserPassword({actualData,access_token});
	  if(res.error){
		console.log(res.data)
		setError(res.error.data.errors)
	  }else{
		const msg={
			msg:"suxccesfully Done"
		}
		setError(msg)


	  }
	  if(res.data){
		 console.log(res.data)
		 setError(res.data)
		 document.getElementById("password-change-form").reset();
	  }
	  
	};
  
	const myData=useSelector(state=>state.user)
  return (
    <>
    <Navbar/>
    <div class="bod">
    <div class="mai" style={{height:"65vh"}}>  	
			<div class="signu" style={{marginTop:"5vh"}}>
				<form  id="password-change-form" onSubmit={handleSubmit}>
					<label class="labe" aria-hidden="true" style={{fontSize:"1.6rem"}}>Change Password</label>
					{error.non_field_errors? <Alert severity="error"  style={{margin:"0 45px"}}>Something went wrong please recheck</Alert> : ""}
                    {error.msg ? <Alert severity="success" style={{margin:"0 45px"}}>successfully updated</Alert> : ""}
					
					<input style={{marginBottom:"0"}} class="inpu" type="password" name="oldpswd" placeholder="Old Password" required=""/>

					<input style={{marginBottom:"0"}} class="inpu" type="password" name="pswd" placeholder="New Password" required=""/>
					{error.password?<Typography style={{color:"red",paddingLeft:"70px",fontSize:10}}>{error.password[0]}</Typography>:" "}

					<input style={{marginBottom:"0"}} class="inpu" type="password" name="pswd2" placeholder="Confirm New Password" required=""/>
					{error.password2?<Typography style={{color:"red",paddingLeft:"70px",fontSize:10}}>{error.password2[0]}</Typography>:" "}

					<button class="butto" style={{backgroundColor:"black",}} type='submit'>Change</button>
				</form>
			</div>
	</div>
  </div>
    </>
  )
}

export default ChngPass