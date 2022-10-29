import { Typography, CircularProgress,FormControlLabel, Checkbox, } from '@mui/material';
import {useLoginUserMutation,useRegisterUserMutation} from "../../Redux-manage/services/userAuthapi"
import { getToken, storeToken } from '../../Redux-manage/services/localStorageService';
import { setUserToken } from '../../Redux-manage/features/authSlice';
import { useNavigate,NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import React,{useState,useEffect} from 'react'
import Navbar from '../global/NavHeader'
import './login.css'
import { Alert } from 'antd';
import Popup from 'reactjs-popup';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'


import { CartState } from '../../context';

const Login = () => {
	const {setCart,setLike}=CartState()
	const [error, setError] = useState({})
	let{access_token}=getToken()
	const dispatch=useDispatch()
	const navigate = useNavigate(); 
	const [value, setValue] = useState()



	//For login User
	const[loginUser,{isLoading}]=useLoginUserMutation()
	const handleSubmit = async(e) => {
		
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		
		const actualData = {
		  email: data.get('email'),
		  password: data.get('pswd'),
		}
	
		const res=await loginUser(actualData)
		if(res.error){
			console.log(res.error.data.errors)
		  setError(res.error.data.errors)
		}
		if(res.data){
		  storeToken(res.data.token)
		  let {access_token}=getToken();
		  dispatch(setUserToken({access_token:access_token}))
		  window.location.reload(); 
		  setCart([])
		  setLike([])
		  console.log(JSON.parse(localStorage.getItem("cart")))
		  if(JSON.parse(localStorage.getItem("cart")))
		  setCart([...JSON.parse(localStorage.getItem("cart"))])
		  navigate('/')

		}
	  }

	  useEffect(()=>{
		dispatch(setUserToken({access_token:access_token}))
	  },[access_token,dispatch])
	


	  //For Resigtration user
	  const [server_error,setServerError]=useState({});
	  const [registerUser,{isLoading2}]=useRegisterUserMutation();
	  const handleSubmit2 = async(e) => {
		console.log(value)
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		const actualData = {
		  name: data.get('txt'),
		  email: data.get('email'),
		  contact_number:value,
		  password: data.get('pswd'),
		  password2: data.get('pswd2'),
		  tc: data.get('tc'),
		}
	
		const res=await registerUser(actualData)
		if(res.error){
			console.log(res.error.data.errors)
		  setServerError(res.error.data.errors)
		}
		if(res.data){
		  storeToken(res.data.token)
		  navigate('/')
	
		}
	  }

	  function validates(evt) {
		var theEvent = evt || window.event;
	  
		// Handle paste
		if (theEvent.type === 'paste') {
			key = evt.clipboardData.getData('text/plain');
		} else {
		// Handle key press
			var key = theEvent.keyCode || theEvent.which;
			key = String.fromCharCode(key);
		}
		var regex = /^0|[1-9]\d*$/	
		if( !regex.test(key) ) {
		  theEvent.returnValue = false;
		  if(theEvent.preventDefault) theEvent.preventDefault();
		}
	  }

	
  return (
    <>
    <Navbar/>
    <div class="bod">
	{/* {server_error.name?<Alert
					message="Warning Text Warning Text Warning TextW arning Text Warning Text Warning TextWarning Text"
					type="warning"
					closable
					style={{position:"absolute",zIndex:'50',top:"30px",right:"0px"}}
					/>:" "} */}
    <div class="mai">  	
		<input type="checkbox" id="ch" aria-hidden="true"/>
			<div class="signu">
				<form onSubmit={handleSubmit2}>
					<label class="labe" htmlFor="ch" aria-hidden="true">Sign up</label>
					{/* {server_error.non_field_errors?<Alert severity='error'>{server_error.non_field_errors[0]}</Alert>:" "} */}

					<span class="inpu"><input  class="inpu2" type="text" name="txt" placeholder="User name" required/>
					<Popup trigger={<button style={{border:"white",background:"#e0dede"}} >{server_error.name?<i class="fa-solid fa-circle-exclamation" style={{color:"red",marginTop:"8px"}}/>:null}</button>} 
                    position="bottom center">
                    {server_error.name?<Typography style={{color:"red",fontSize:"14px"}}>{server_error.name[0]}</Typography>:" "}
					
					</Popup>
					</span>

					

					<span class="inpu"><input class="inpu2"type="email" name="email" placeholder="Email" required/>
					<Popup trigger={<button style={{border:"white",background:"#e0dede"}} >{server_error.email?<i class="fa-solid fa-circle-exclamation" style={{color:"red",marginTop:"8px"}}/>:null}</button>} 
                    position="bottom center">
					{server_error.email?<Typography style={{color:"red",fontSize:"14px"}}>{server_error.email[0]}</Typography>:" "}
					</Popup>
					</span>

					<span class="inpu">
					<PhoneInput
					placeholder="phone number"
					value={value}
					defaultCountry="IN"
					onChange={setValue}   
					limitMaxLength={10}
					/>
					{/* <input class="inpu2" type="tel" name="telphone" onKeyPress={validates} placeholder="888 888 8888" maxlength="10"  title="Ten digits code" required/>  */}
					<Popup trigger={<button style={{border:"white",background:"#e0dede"}} >{server_error.contact_number?<i class="fa-solid fa-circle-exclamation" style={{color:"red",marginTop:"8px"}}/>:null}</button>} 
                    position="bottom center">
					{server_error.contact_number?<Typography style={{color:"red",fontSize:"14px"}}>{server_error.contact_number[0]}</Typography>:" "}
					</Popup>
					</span>

					<span class="inpu3" style={{marginBottom:"0"}}>
						<span class="inpu4"><input class="inpu4" type="password" name="pswd" placeholder="Password" required style={{width:"80%"}}/>
							<Popup trigger={<button style={{border:"white",background:"#e0dede"}} >{server_error.name?<i class="fa-solid fa-circle-exclamation" style={{color:"red",marginTop:"8px"}}/>:null}</button>} 
							position="bottom center">
							{server_error.password?<Typography style={{color:"red",fontSize:"14px"}}>{server_error.password[0]}</Typography>:" "}
							</Popup>
						</span>
						<span class="inpu4">
							<input class="inpu4" type="password" name="pswd2" placeholder="Confim Password"  required style={{width:"80%"}}/>
							<Popup trigger={<button style={{border:"white",background:"#e0dede"}} >{server_error.name?<i class="fa-solid fa-circle-exclamation" style={{color:"red",marginTop:"8px"}}/>:null}</button>} 
							position="bottom center">
							{server_error.password2?<Typography style={{color:"red",fontSize:"14px"}}>{server_error.password2[0]}</Typography>:" "}
							</Popup>
						</span>
					</span>
					{/* {server_error.password2?<Typography style={{color:"red",paddingLeft:10,fontSize:10,position:"absolute",top:"310px",left:"150px",right:"0",fontSize:"0.8rem"}}>{server_error.password2[0]}</Typography>:" "} */}

					<FormControlLabel style={{paddingLeft:"70px",color:"white"}} control={<Checkbox value={true} color="primary" name="tc" id="tc" />} label={<span style={{ fontSize: '0.8rem' }}>
						<Popup trigger={<button style={{border:"white",background:"rgba(0,0,0,0)",marginRight:"10px"}} >{server_error.name?<i class="fa-solid fa-circle-exclamation" style={{color:"red",marginTop:"8px"}}/>:null}</button>} 
							position="bottom center">
							{server_error.tc?<span style={{color:"red",fontSize:"0.8rem"}}>check term and condition</span>:" "}
						</Popup>
						i agree to term and condition.   
					</span>} />
					{isLoading?<CircularProgress style={{margin:"20px",marginLeft:"140px"}}/>:<button style={{paddingTop:"0",marginTop:"0"}} class="butto" type='submit'>Sign up</button>}

					
				</form>
			</div>

			<div class="logi">
				<form onSubmit={handleSubmit}>
					<label class="labe" htmlFor="ch" aria-hidden="true">Login</label>
					{error!=null&&error.none_field_errors?<Alert severity='error' style={{margin:"0 40px"}}>{error.none_field_errors[0]}</Alert>:" "}

					<input class="inpu"type="email" style={{marginBottom:"0"}} name="email" placeholder="Email" required=""/>
					{error!=null&&error.email?<Typography style={{color:"red",paddingLeft:"70px",fontSize:10}}>{error.email[0]}</Typography>:" "}

					<input class="inpu"type="password" style={{marginBottom:"0"}} name="pswd" placeholder="Password" required=""/>
					{error!=null&&error.password?<Typography style={{color:"red",paddingLeft:"70px",fontSize:10}}>{error.password[0]}</Typography>:" "}
					<NavLink to='/sendemail' style={{marginLeft:"50%",fontSize:"1rem"}} >Forgot Password ?</NavLink>

					{isLoading?<CircularProgress style={{margin:"20px",marginLeft:"140px"}}/>:<button class="butto" type='submit'>Login</button>}
					
				</form>
			</div>
	</div>
  </div>
    </>
  )
}

export default Login