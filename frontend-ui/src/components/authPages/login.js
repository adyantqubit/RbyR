import { Typography, CircularProgress, FormControlLabel, Checkbox, } from '@mui/material';
import { useLoginUserMutation, useRegisterUserMutation } from "../../Redux-manage/services/userAuthapi"
import { getToken, storeToken } from '../../Redux-manage/services/localStorageService';
import { setUserToken } from '../../Redux-manage/features/authSlice';
import { useNavigate, NavLink, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react'
import Navbar from '../global/NavHeader'
import './login.css'
import { Alert } from '@mui/material';
import Popup from 'reactjs-popup';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai"
import { CartState } from '../../context';
import { notification } from 'antd';
import { GuestCartRequest } from '../../api/orderApis';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
	const { setCart, setLike, firstTimeLoadFunctions, cart,redirectionPath,setRedirectionPath, } = CartState()
	const [error, setError] = useState({})
	let { access_token } = getToken()
	const dispatch = useDispatch()
	const navigate = useNavigate();
	const [value, setValue] = useState("+91 ")
	const [showNewPass, setNewPass] = useState(false)
	const [visiblepassReg, setVisiblePassreg] = useState(false)
	const [showNewPass2, setNewPass2] = useState(false)
	const [visiblepassReg2, setVisiblePassreg2] = useState(false)
	const [showNewPass3, setNewPass3] = useState(false)
	const [visiblepassReg3, setVisiblePassreg3] = useState(false)


	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])

	//For login User
	const [loginUser, { isLoading }] = useLoginUserMutation()
	const handleSubmit = async (e) => {

		e.preventDefault();
		const data = new FormData(e.currentTarget);

		const actualData = {
			email: data.get('email').toLowerCase(),
			password: data.get('pswd'),
		}

		const res = await loginUser(actualData)


		if (res.error) {
			setError(res.error.data.errors)
		}


		if (res.data) {
			// 	toast.success(<div style={{ fontSize: "18px", color: "black", letterSpacing: "1.4px" }}>Successfully Logged In.
			// 	<div style={{ fontSize: "13px", color: "black", letterSpacing: "1.4px" }}>You Are Logged In</div>
			// </div>,
			// 	{ position: toast.POSITION.TOP_RIGHT, duration: 1000, style: { top: "20vh", right: "2vw", background: "var(--bannerColor)" } },
			// )

			localStorage.setItem('login', true);
			storeToken(res.data.token)
			let { access_token } = getToken();
			dispatch(setUserToken({ access_token: access_token }))
			//   window.location.reload(); 
			await GuestCartRequest(cart).then(r => localStorage.removeItem('cart'))
			setCart([])
			setLike([])
			if (JSON.parse(localStorage.getItem("cart")))
				setCart([...JSON.parse(localStorage.getItem("cart"))])
			toast.success(<div  
			class='successMsg'
			>Successfully Logged In.
			</div>,
				{ position: toast.POSITION.TOP_RIGHT, duration: 1000,
		    // Modification and addition by Om shrivastava on 01-12-23
        // REason : Create the popup class to apply the designing
        className:'popupClassLoggedIn',
        // style:{marginTop:"20px"},
        // style:{backgroundColor: "#f1cdd9",
        // padding:'0px 5px 5px 5px',borderRadius:'10px',width:'200px'},
        // End of modification and addition by Om shrivastava on 01-12-23
        // REason : Create the popup class to apply the designing
          // style: { top: "20vh", right: "2vw", background: "#f1cdd9" } 					
					},
			)
			firstTimeLoadFunctions()
			/**
			 * Commented and modified by - Ashish Dewangan on 07-12-2023
			 * Reason - To navigate to place order page if login was done from after clicking on checkout button.
			 * 			To navigate to last visited page if login was done from any other page
			 */
			// navigate(-1)
			if(redirectionPath=="/"){
				navigate(-1)
			}else{
				navigate(redirectionPath)
				setRedirectionPath("/")
			}
			/**
			 * End of code modification by - Ashish Dewangan on 07-12-2023
			 * Reason - To navigate to place order page if login was done from after clicking on checkout button.
			 * 			To navigate to last visited page if login was done from any other page
			 */
			
		}
	}

	useEffect(() => {
		dispatch(setUserToken({ access_token: access_token }))
	}, [access_token, dispatch])



	//For Resigtration user
	const [server_error, setServerError] = useState({});
	const [registerUser, { isLoading2 }] = useRegisterUserMutation();
	const handleSubmit2 = async (e) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		// if (value==undefined || value.trim()=="" || value.split(" ").join("").length < 13) {
		// 	setServerError({ "contact_number": ["Minimum 10 digits are required."] })
		// }
		// else {
			const actualData = {
				name: data.get('txt'),
				email: data.get('email').toLowerCase(),
				contact_number: value!=undefined?value:"",
				password: data.get('pswd'),
				password2: data.get('pswd2'),
				tc: data.get('tc'),
			}

			const res = await registerUser(actualData)

			if (res.error) {
				setServerError(res.error.data.errors)
			}
			if (res.data) {

				localStorage.setItem('register', true)

				storeToken(res.data.token)
				navigate('/')

			}
		// }
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
		if (!regex.test(key)) {
			theEvent.returnValue = false;
			if (theEvent.preventDefault) theEvent.preventDefault();
		}
	}


	return (
		<>
			<Navbar />
			<div class="bod">
				<ToastContainer key={1} limit={1} enableMultiContainer={false}/>

			
				<div class="mai">
					<input type="checkbox" id="ch" aria-hidden="true" />
					<div class="signu">
						<form onSubmit={handleSubmit2}>
							<label style={{color:'rgb(59 59 224)'}} class="labe" htmlFor="ch" aria-hidden="true">Sign up</label>

							<div style={{ fontSize: "14px", marginLeft: "15%" }}>Name<span style={{color:'red'}}>*</span></div>
							<input class="inpu2" type="text" name="txt" placeholder="User name" maxLength={99} />

							<div style={{ height: "20px" }}>
								{server_error.name ? <Typography style={{ color: "red", fontSize: "14px", marginBottom: "10px", marginLeft: "15%" }}>{server_error.name[0]}</Typography> : " "}

							</div>

							<div style={{ fontSize: "14px", marginLeft: "15%" }}>Email<span style={{color:'red'}}>*</span></div>
							<input class="inpu2" type="email" name="email" placeholder="Email" maxLength={250} />
							<div style={{ height: "20px" }}>
								{server_error.email ? <Typography style={{ color: "red", fontSize: "14px", marginBottom: "10px", marginLeft: "15%" }}>
									{server_error.email[0]?.toLowerCase().trim()=="This field may not be blank.".toLowerCase().trim()
									?
									<span>{"Please enter email id."}</span>
									:
									server_error.email[0]
									}
								</Typography>
									: " "}

							</div>

							<div style={{ fontSize: "14px", marginLeft: "15%" }}>Phone Number<span style={{color:'red'}}>*</span></div>
							<PhoneInput
								international
								placeholder="phone number"
								value={value}
								defaultCountry="IN"
								style={{ width: "70%", marginLeft: "15%" }}
								onChange={e => { setValue(e) }}
								limitMaxLength={10}

							/>
							<div style={{ minHeight: "20px" }}>
								{server_error.contact_number ? <Typography style={{ color: "red", fontSize: "14px", marginLeft: "15%", width: "70%" }}>{server_error.contact_number[0]}</Typography> : " "}
							</div>

						
							<div style={{ fontSize: "14px", marginLeft: "15%" }}>Password<span style={{color:'red'}}>*</span></div>
							<span class="inpu3" style={{ marginBottom: "0", flexDirection: "column", height: "auto", paddingLeft: "0px", gap: "10px" }}>
								<span class="inpu4" style={{ width: "100%" }}>
									<input class="inpu4" type={showNewPass2 ? "text" : "password"} name="pswd" placeholder="Password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
										 style={{ width: "90%", border: "none" }}
										onChange={e => { if (e.target.value.length > 0) setVisiblePassreg2(true); else setVisiblePassreg2(false) }} maxLength={20}/>
								
									{visiblepassReg2 ? showNewPass2 ? <AiFillEye style={{ marginTop: "5px" }} onClick={e => setNewPass2(false)} /> : <AiFillEyeInvisible style={{ marginTop: "5px" }} onClick={e => setNewPass2(true)} /> : null}
								</span>
								
								<span class="inpu4" style={{ width: "100%" }}>
									<input class="inpu4" type={showNewPass ? "text" : "password"} name="pswd2" placeholder="Confirm Password" 
										style={{ width: "90%", border: "none" }}
										onChange={e => { if (e.target.value.length > 0) setVisiblePassreg(true); else setVisiblePassreg(false) }} maxLength={20}/>
									{visiblepassReg ? showNewPass ? <AiFillEye style={{ marginTop: "5px" }} onClick={e => setNewPass(false)} /> : <AiFillEyeInvisible style={{ marginTop: "5px" }} onClick={e => setNewPass(true)} /> : null}

								</span>

							</span>

							{server_error.password ? <Typography style={{ color: "red", fontSize: "14px", marginLeft: "15%" }}>{server_error.password[0]}</Typography> : " "}

							


							{/* {server_error.password2?<Typography style={{color:"red",paddingLeft:10,fontSize:10,position:"absolute",top:"310px",left:"150px",right:"0",fontSize:"0.8rem"}}>{server_error.password2[0]}</Typography>:" "} */}

							<FormControlLabel style={{ paddingLeft: "70px" }} control={
							/**
							 * Commented and modified by - Ashish Dewangan on 08-12-2023
							 * Reason - To change color of checkbox
							 */
							// <Checkbox style={{color:'green'}} value={true} name="tc" id="tc" />
							<Checkbox  value={true} name="tc" id="tc" />
							/**
							 * End of code modification by - Ashish Dewangan on 08-12-2023
							 * Reason - To change color of checkbox
							 */
							} label={<span style={{ fontSize: '0.8rem' }}>
								<Link to="/termAndCondition#Terms_and_Conditions" target="_blank" title='Terms and Condition' style={{ fontSize: "12px", textDecoration: "underline", letterSpacing: "1.2px",color:'rgb(59 59 224)' }}> I accept terms and conditions.</Link>
							</span>} /><br/>
							{server_error.tc ? <Typography style={{ color: "red", fontSize: "14px", marginLeft: "15%" }}>Please accept terms and conditions</Typography> : " "}

							{isLoading ? <CircularProgress style={{ margin: "20px", marginLeft: "140px" }} /> : <button style={{ paddingTop: "0", marginTop: "0" }} class="butto" type='submit'>Sign up</button>}


						</form>
					</div>

					<div class="logi">
						<form onSubmit={handleSubmit}>

							<label style={{color:'rgb(59 59 224)'}} class="labe" htmlFor="ch" aria-hidden="true" tabIndex={-1} onClick={e => window.scrollTo(0, 0)}>Login</label>
							{/* {error.none_field_errors? <Alert severity="error"  style={{margin:"0 45px"}}>{error.none_field_errors[0]}</Alert>:" "} */}

							<input class="inpu" type="email" tabIndex={-1} style={{ marginBottom: "0", background: "white" }} name="email" placeholder="E-mail*" required="" />
							{error.email ? <Typography style={{ color: "red", paddingLeft: "50px", fontSize: "14px", }}>{error.email[0]}</Typography> : " "}
							{error.none_field_errors ? <Typography style={{ color: "red", width: "80%", paddingLeft: "50px", marginTop: "5px", fontSize: "12px", lineHeight: "12px" }}>{error.none_field_errors[0]}
								<Link to="/custom" style={{ color: "blue", fontSize: "12px", textDecoration: "underline" }}> Contact us</Link></Typography> : " "}

							<span class="inpu3" tabIndex={-1} style={{ marginTop: "20px", height: "40px", marginLeft: "15%", background: "white", border: "1px solid black" }}>
								<input class="inpu4" tabIndex={-1} type={showNewPass3 ? "text" : "password"} style={{ width: "90%", background: "transparent", height: "40px", border: "none" }} name="pswd" placeholder="Password*" required="" onChange={e => { if (e.target.value.length > 0) setVisiblePassreg3(true); else setVisiblePassreg3(false) }} />
								{visiblepassReg3 ? showNewPass3 ? <AiFillEye style={{ marginTop: "10px", marginRight: "5px" }} onClick={e => setNewPass3(false)} /> : <AiFillEyeInvisible style={{ marginTop: "10px", marginRight: "5px" }} onClick={e => setNewPass3(true)} /> : null}
							</span>
							{error.password ? <Typography style={{ color: "red", paddingLeft: "50px", fontSize: "14px" }}>{error.password[0]}</Typography> : " "}
							<Link to='/sendemail' tabIndex={-1} style={{ marginLeft: "50%", fontSize: "1em", color: "rgb(59 59 224)" }} class="underlineput">Forgot Password ?</Link>

							{isLoading ? <CircularProgress style={{ margin: "20px", marginLeft: "140px" }} /> : <button tabIndex={-1} class="butto" type='submit'>Login</button>}
							<label tabIndex={-1} style={{ width: "100%", textAlign: "center" }}>or</label>
							<label style={{color:'rgb(59 59 224)'}} tabIndex={-1} class="labe underlineput"  htmlFor="ch" aria-hidden="true" onClick={e => window.scrollTo(0, 0)}>Signup</label>

						</form>
					</div>
					
				</div>
			</div>
		</>
	)
}

export default Login