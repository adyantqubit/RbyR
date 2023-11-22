

import React from 'react'
import { Alert,CircularProgress,Typography } from "@mui/material";
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useResetPasswordMutation } from "../../Redux-manage/services/userAuthapi";
import Navbar from '../global/NavHeader'
import { notification } from 'antd';
import {AiFillEye,AiFillEyeInvisible} from 'react-icons/ai'
import '../../../src/root.css'
import './resetPassword.css'


const ResetPassword = () => {
  notification.destroy()
    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [msg, setMsg] = useState({})
    const [showNewPass,setNewPass]=useState(false)
	const [visiblepassReg,setVisiblePassreg]=useState(false)
	const [showNewPass2,setNewPass2]=useState(false)
	const [visiblepassReg2,setVisiblePassreg2]=useState(false)

  
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
        message: <div style={{fontSize:"18px",color:"black"}}>Successfully Password Udated. </div>,
        description:
        `Successfully Password Update`,
        className:"custom-class",
        style: { backgroundColor:"#8c8c8c",color:"black",marginTop:"55vh"},
        duration:5,
        key:1
        });
       setMsg(res.data)
      // alert('settttttttt')

      // console.log('settttttttttt')
       navigate("/")
       navigate("/login")
      }   
    }
  return (
    <>
    <Navbar/>
    <div class="bod parentDiv">
    <div class="mai" style={{height:"50vh"}}>  	
			<div class="signu" 
      // style={{marginTop:"5vh"}}
      >
				<form  id="password-change-form" onSubmit={handleSubmit}>
					<label class="labe" aria-hidden="true" style={{fontSize:"1.6rem",fontFamily:'var(--fontFamily)'}}>Change Password</label>
					{error!=null ? <Alert severity="error" style={{margin:"0 60px"}}>{error.non_field_errors}</Alert> : ""}
                    {msg.msg ? <Alert severity="success"  style={{margin:"0 50px"}}>Successfully changed</Alert> : ""}
										
           <span class="inpu3" style={{margin:"20px 0",marginLeft:"15%",background:"#e0dede"}}>
						<input class="inpu4" type={showNewPass2?"text":"password"} name="pswd" placeholder="Password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
						 required style={{width:"80%",outline:"none",border:"none"}} 
						 onChange={e=>{if(e.target.value.length>0)setVisiblePassreg2(true); else setVisiblePassreg2(false)}}/>
			      {visiblepassReg2?showNewPass2?<AiFillEye style={{marginTop:"5px"}} onClick={e=>setNewPass2(false)}/>:<AiFillEyeInvisible style={{marginTop:"5px"}} onClick={e=>setNewPass2(true)}/>:null}
            {error!=null&&error.password?<Typography style={{color:"red",paddingLeft:"70px",fontSize:10}}>{error.password[0]}</Typography>:" "}
            </span>


					{/* <input style={{marginBottom:"0"}} class="inpu" type="password" name="pswd" placeholder="Password" required=""/> */}


            <span class="inpu3" style={{margin:"20px 0",marginLeft:"15%",background:"#e0dede"}}>
							<input class="inpu4" type={showNewPass?"text":"password"} name="pswd2" placeholder="Confim Password"   required style={{width:"80%",outline:"none",border:"none"}} onChange={e=>{if(e.target.value.length>0)setVisiblePassreg(true); else setVisiblePassreg(false)}}/>
			        {visiblepassReg?showNewPass?<AiFillEye style={{marginTop:"5px"}} onClick={e=>setNewPass(false)}/>:<AiFillEyeInvisible style={{marginTop:"5px"}} onClick={e=>setNewPass(true)}/>:null}
              {error!=null&&error.password2?<Typography style={{color:"red",paddingLeft:"70px",fontSize:10}}>{error.password2[0]}</Typography>:" "}
            </span>
					{/* <input style={{marginBottom:"0"}} class="inpu" type="password" name="pswd2" placeholder="Confirm Password" required=""/> */}

					{isLoading?<CircularProgress style={{margin:"20px",marginLeft:"140px"}}/>:<button class="butto" style={{backgroundColor:"var(--btnBackgroundColorPrimary)",color:'var(--btnTextColorPrimary)',border:'1px solid var(--btnBorderColorPrimary)'}} type='submit'>Change</button>}
				</form>
			</div>
	</div>
  </div>
    </>
  )
}

export default ResetPassword



// import React from 'react'
// import { Alert,Typography } from "@mui/material";
// import { useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useResetPasswordMutation } from "../../Redux-manage/services/userAuthapi";
// import Navbar from '../global/NavHeader'
// import { notification } from 'antd';


// const ResetPassword = () => {
//     const navigate = useNavigate()
//     const [error, setError] = useState(null)
//     const [msg, setMsg] = useState({})
  
//    const[resetPassword,{isLoading}]= useResetPasswordMutation()
//    const{id,token}=useParams()
  
//     const handleSubmit = async(e) => {
//       e.preventDefault();
//       const data = new FormData(e.currentTarget);
//       const actualData = {
//         password: data.get('pswd'),
//         password2: data.get('pswd2'),
//       }
  
//       const res=await resetPassword({actualData,id,token})
//       if(res.error){
//         setMsg({})
//         setError(res.error.data.errors)
//         console.log(res)
//       }
//       if(res.data){
//         console.log(res)
//        setError(null)
//        notification.error({
//         message: <div style={{fontSize:"18px",color:"black"}}>Successfully Logged In. </div>,
//         description:
//         `Successfully Password Update`,
//         className:"custom-class",
//         style: { backgroundColor:"#8c8c8c",color:"black",marginTop:"5vh"},
//         duration:5,
//         key:1
//         });
//        setMsg(res.data)
//        navigate("/login")
//       }   
//     }
//   return (
//     <>
//     <Navbar/>
//     <div class="bod">
//     <div class="mai" style={{height:"50vh"}}>  	
// 			<div class="signu" style={{marginTop:"5vh"}}>
// 				<form  id="password-change-form" onSubmit={handleSubmit}>
// 					<label class="labe" aria-hidden="true" style={{fontSize:"1.6rem"}}>Change Password</label>
// 					{error!=null ? <Alert severity="error" style={{margin:"0 60px"}}>{error.non_field_errors}</Alert> : ""}
//                     {msg.msg ? <Alert severity="success"  style={{margin:"0 50px"}}>successfully changed</Alert> : ""}
										

// 					<input style={{marginBottom:"0"}} class="inpu" type="password" name="pswd" placeholder="Password" required=""/>
// 					{error!=null&&error.password?<Typography style={{color:"red",paddingLeft:"70px",fontSize:10}}>{error.password[0]}</Typography>:" "}

// 					<input style={{marginBottom:"0"}} class="inpu" type="password" name="pswd2" placeholder="Confirm Password" required=""/>
// 					{error!=null&&error.password2?<Typography style={{color:"red",paddingLeft:"70px",fontSize:10}}>{error.password2[0]}</Typography>:" "}

// 					<button class="butto" style={{backgroundColor:"black",}} type='submit'>Change</button>
// 				</form>
// 			</div>
// 	</div>
//   </div>
//     </>
//   )
// }

// export default ResetPassword