import { Typography, CircularProgress,FormControlLabel, Checkbox, } from '@mui/material';
import {useLoginUserMutation,useRegisterUserMutation} from "../../Redux-manage/services/userAuthapi"
import { getToken, storeToken } from '../../Redux-manage/services/localStorageService';
import { setUserToken } from '../../Redux-manage/features/authSlice';
import { useNavigate,NavLink, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import React,{useState,useEffect} from 'react'
import Navbar from '../global/NavHeader'
import './login.css'
import { Alert } from '@mui/material';
import Popup from 'reactjs-popup';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import {AiFillEyeInvisible,AiFillEye} from "react-icons/ai"
import { CartState } from '../../context';
import { notification } from 'antd';
import { GuestCartRequest } from '../../api/orderApis';

const Login = () => {
	const {setCart,setLike,firstTimeLoadFunctions,cart}=CartState()
	const [error, setError] = useState({})
	let{access_token}=getToken()
	const dispatch=useDispatch()
	const navigate = useNavigate(); 
	const [value, setValue] = useState("+91 ")
	const [showNewPass,setNewPass]=useState(false)
	const [visiblepassReg,setVisiblePassreg]=useState(false)
	const [showNewPass2,setNewPass2]=useState(false)
	const [visiblepassReg2,setVisiblePassreg2]=useState(false)
	const [showNewPass3,setNewPass3]=useState(false)
	const [visiblepassReg3,setVisiblePassreg3]=useState(false)


	useEffect(()=>{
      window.scrollTo(0,0)
	},[])

	//For login User
	const[loginUser,{isLoading}]=useLoginUserMutation()
	const handleSubmit = async(e) => {
		
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		
		const actualData = {
		  email: data.get('email').toLowerCase(),
		  password: data.get('pswd'),
		}
	
		const res=await loginUser(actualData)

		console.log(res)
		
		if(res.error){
		  setError(res.error.data.errors)
		}


		if(res.data){

		  storeToken(res.data.token)
		  let {access_token}=getToken();
		  dispatch(setUserToken({access_token:access_token}))
		//   window.location.reload(); 
		console.log(res.data.token.access)
		await GuestCartRequest(cart).then(r=>localStorage.removeItem('cart'))
		  setCart([])
		  setLike([])
		  if(JSON.parse(localStorage.getItem("cart")))
		  setCart([...JSON.parse(localStorage.getItem("cart"))])
		  notification.error({
			message: <div style={{fontSize:"18px",color:"black"}}>Successfully Logged In. </div>,
			description:
			`You Are Logged In`,
			className:"custom-class",
			style: { backgroundColor:"#8c8c8c",color:"black",marginTop:"10vh"},
			duration:2,
			key:1
		  });
		  firstTimeLoadFunctions()
		  navigate(-1)	  
		}
	  }

	  useEffect(()=>{
		dispatch(setUserToken({access_token:access_token}))
	  },[access_token,dispatch])
	


	  //For Resigtration user
	  const [server_error,setServerError]=useState({});
	  const [registerUser,{isLoading2}]=useRegisterUserMutation();
	  const handleSubmit2 = async(e) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
        
        console.log(!value.length>5)
         
		if(value.split(" ").join("").length<11){
           setServerError({"contact_number":["Minimum 8 digits are required."]})
		}
		else{
		const actualData = {
		  name: data.get('txt'),
		  email: data.get('email').toLowerCase(),
		  contact_number:value,
		  password: data.get('pswd'),
		  password2: data.get('pswd2'),
		  tc: data.get('tc'),
		}
	
		const res=await registerUser(actualData)

		console.log(res)
		if(res.error){
		  setServerError(res.error.data.errors)
		}
		if(res.data){
			notification.error({
				message: <div style={{fontSize:"18px",color:"black"}}>Successfully Logged In. </div>,
				description:
				`You Are Logged In`,
				className:"custom-class",
				style: { backgroundColor:"#8c8c8c",color:"black",marginTop:"10vh"},
				duration:2,
				key:1
			  });
		  storeToken(res.data.token)
		  navigate('/')
	
		}
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

                    <div style={{fontSize:"14px",marginLeft:"15%"}}>Name *</div>
					<input  class="inpu2" type="text" name="txt" placeholder="User name" required/>

					{/* <Popup trigger={<button style={{border:"white",background:"#e0dede"}} >{server_error.name?<i class="fa-solid fa-circle-exclamation" style={{color:"red",marginTop:"8px"}}/>:null}</button>} 
                    position="bottom center">
					
					</Popup>
					</span> */}
					<div style={{height:"20px"}}>
					{server_error.name?<Typography style={{color:"red",fontSize:"14px",marginBottom:"10px",marginLeft:"15%"}}>{server_error.name[0]}</Typography>:" "}

					</div>
					
                    <div style={{fontSize:"14px",marginLeft:"15%"}}>Email *</div>
					<input class="inpu2"type="email" name="email" placeholder="Email" required/>
					<div style={{height:"20px"}}>
                    {server_error.email?<Typography style={{color:"red",fontSize:"14px",marginBottom:"10px",marginLeft:"15%"}}>
						{server_error.email[0]}
						</Typography>
						:" "}

					</div>

					{/* {server_error.email?
					<Popup trigger={<button style={{border:"white",background:"#e0dede"}} >{server_error.email?<i class="fa-solid fa-circle-exclamation" style={{color:"red",marginTop:"8px"}}/>:null}</button>} 
                     defaultOpen={true}
					position="top right">
					{server_error.email?<Typography style={{color:"red",fontSize:"14px"}}>{server_error.email[0]}</Typography>:" "}
					</Popup>:null} */}
					{/* </span> */}

					{/* <span class="inpu"> */}
                    <div style={{fontSize:"14px",marginLeft:"15%"}}>Phone Number *</div>
					<PhoneInput
					international
					placeholder="phone number"
					value={value}
					defaultCountry="IN"
					style={{width:"70%",marginLeft:"15%"}}
					onChange={e=>{setValue(e)}} 
					limitMaxLength={10}
				
					/>
					<div style={{minHeight:"20px"}}>
					{server_error.contact_number?<Typography style={{color:"red",fontSize:"14px",marginLeft:"15%",width:"70%"}}>{server_error.contact_number[0]}</Typography>:" "}
					</div>

					{/* <input class="inpu2" type="tel" name="telphone" onKeyPress={validates} placeholder="888 888 8888" maxlength="10"  title="Ten digits code" required/> 
					{server_error.contact_number?
					<Popup trigger={<button style={{border:"white",background:"#e0dede"}} >{server_error.contact_number?<i class="fa-solid fa-circle-exclamation" style={{color:"red",marginTop:"8px"}}/>:null}</button>} 
                    defaultOpen={true}
					position="bottom right">
					{server_error.contact_number?<Typography style={{color:"red",fontSize:"14px"}}>{server_error.contact_number[0]}</Typography>:" "}
					</Popup>:null} */}
					{/* </span> */}
                    <div style={{fontSize:"14px",marginLeft:"15%"}}>Password *</div>
					<span class="inpu3" style={{marginBottom:"0",flexDirection:"column",height:"auto",paddingLeft:"0px",gap:"10px"}}>
						<span class="inpu4" style={{width:"100%"}}>
							<input class="inpu4" type={showNewPass2?"text":"password"} name="pswd" placeholder="Password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
						 required style={{width:"90%",border:"none"}}       
						 onChange={e=>{if(e.target.value.length>0)setVisiblePassreg2(true); else setVisiblePassreg2(false)}}/>
						 {/* {server_error.password?<Popup trigger={<button style={{border:"white",background:"#e0dede"}} >{server_error.password?<i class="fa-solid fa-circle-exclamation" style={{color:"red",marginTop:"8px"}}/>:null}</button>} 
							defaultOpen={true}
							position="top center">
							{server_error.password?<Typography style={{color:"red",fontSize:"14px"}}>{server_error.password[0]}</Typography>:" "}
							</Popup>:null} */}
			             {visiblepassReg2?showNewPass2?<AiFillEye style={{marginTop:"5px"}} onClick={e=>setNewPass2(false)}/>:<AiFillEyeInvisible style={{marginTop:"5px"}} onClick={e=>setNewPass2(true)}/>:null}
						</span>
						<span class="inpu4" style={{width:"100%"}}>
							<input class="inpu4" type={showNewPass?"text":"password"} name="pswd2" placeholder="Confirm Password"   required 
							style={{width:"90%",border:"none"}}
							onChange={e=>{if(e.target.value.length>0)setVisiblePassreg(true); else setVisiblePassreg(false)}}/>
							{/* {server_error.password2?<Popup trigger={<button style={{border:"white",background:"#e0dede"}} >{server_error.name?<i class="fa-solid fa-circle-exclamation" style={{color:"red",marginTop:"8px"}}/>:null}</button>} 
							defaultOpen={true}
							position="top center">
							{server_error.password2?<Typography style={{color:"red",fontSize:"14px"}}>{server_error.password2[0]}</Typography>:" "}
							</Popup>:null} */}
			            {visiblepassReg?showNewPass?<AiFillEye style={{marginTop:"5px"}} onClick={e=>setNewPass(false)}/>:<AiFillEyeInvisible style={{marginTop:"5px"}} onClick={e=>setNewPass(true)}/>:null}

						</span>

					</span>
					
					{server_error.password?<Typography style={{color:"red",fontSize:"14px",marginLeft:"15%"}}>{server_error.password[0]}</Typography>:" "}

					{server_error.tc?<span style={{color:"red",fontSize:"14px",marginLeft:"15%"}}>Please accept terms and conditions</span>:" "}


					{/* {server_error.password2?<Typography style={{color:"red",paddingLeft:10,fontSize:10,position:"absolute",top:"310px",left:"150px",right:"0",fontSize:"0.8rem"}}>{server_error.password2[0]}</Typography>:" "} */}

					<FormControlLabel style={{paddingLeft:"70px"}} control={<Checkbox value={true}  name="tc" id="tc" />} label={<span style={{ fontSize: '0.8rem' }}>
						{/* {server_error.tc?
						<Popup trigger={<button style={{border:"white",background:"rgba(0,0,0,0)",marginRight:"10px"}} >{server_error.name?<i class="fa-solid fa-circle-exclamation" style={{color:"red",marginTop:"8px"}}/>:null}</button>} 
						defaultOpen={true}
						position="top center">
						{server_error.tc?<span style={{color:"red",fontSize:"0.8rem"}}>check term and condition</span>:" "}
					</Popup>:null} */}
						<Link to="/terms" onCLick={(e)=>{
					      window.open("/terms").onload(e=>document.title="terms")
						}} target="_blank" title='Terms and Condition' style={{fontSize:"12px",letterSpacing:"1.2px"}}> I accept terms and conditions.</Link>   
					</span>} />

					{isLoading?<CircularProgress style={{margin:"20px",marginLeft:"140px"}}/>:<button style={{paddingTop:"0",marginTop:"0"}} class="butto" type='submit'>Sign up</button>}

					
				</form>
			</div>

			<div class="logi">
				<form onSubmit={handleSubmit}>

					<label class="labe" htmlFor="ch" aria-hidden="true" tabIndex={-1} onClick={e=>window.scrollTo(0,0)}>Login</label>
					{/* {error.none_field_errors? <Alert severity="error"  style={{margin:"0 45px"}}>{error.none_field_errors[0]}</Alert>:" "} */}

					<input class="inpu" type="email" tabIndex={-1} style={{marginBottom:"0",background:"transparent"}} name="email" placeholder="E-mail*" required=""/>
					{error.email?<Typography style={{color:"red",paddingLeft:"50px",fontSize:"12px",}}>{error.email[0]}</Typography>:" "}
					{error.none_field_errors? <Typography style={{color:"red",width:"80%",paddingLeft:"50px",marginTop:"5px",fontSize:"12px",lineHeight:"12px"}}>{error.none_field_errors[0]}
					<Link to="/custom"style={{color:"blue",fontSize:"12px",textDecoration:"underline"}}> Contact us</Link></Typography>:" "}

                    <span class="inpu3" tabIndex={-1} style={{marginTop:"20px",height:"40px",marginLeft:"15%",background:"#e0dede",border:"1px solid black"}}>
					<input class="inpu4" tabIndex={-1} type={showNewPass3?"text":"password"} style={{width:"90%",background:"transparent",height:"40px",border:"none"}} name="pswd" placeholder="Password*" required="" onChange={e=>{if(e.target.value.length>0)setVisiblePassreg3(true); else setVisiblePassreg3(false)}}/>
					{visiblepassReg3?showNewPass3?<AiFillEye style={{marginTop:"10px",marginRight:"5px"}} onClick={e=>setNewPass3(false)}/>:<AiFillEyeInvisible style={{marginTop:"10px",marginRight:"5px"}} onClick={e=>setNewPass3(true)}/>:null}
					</span>
					{error.password?<Typography style={{color:"red",paddingLeft:"50px",fontSize:"12px"}}>{error.password[0]}</Typography>:" "}
					<Link to='/sendemail' tabIndex={-1} style={{marginLeft:"50%",fontSize:"1em",color:"blue"}} class="underlineput">Forgot Password ?</Link>

					{isLoading?<CircularProgress style={{margin:"20px",marginLeft:"140px"}}/>:<button tabIndex={-1} class="butto" type='submit'>Login</button>}
					<label tabIndex={-1} style={{width:"100%",textAlign:"center"}}>OR</label>
					<label tabIndex={-1} class="labe underlineput" style={{}} htmlFor="ch" aria-hidden="true" onClick={e=>window.scrollTo(0,0)}>Signup</label>
   
				</form>
			</div>
	</div>
  </div>
    </>
  )
}

export default Login