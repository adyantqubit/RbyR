import React, { useEffect, useState } from 'react'
import { InvoiveGetApi, TransactionGetApi } from '../../api/service'
import Footer from '../global/footer'
import Navbar from '../global/NavHeader'
import style from "./profile.module.css"
import Popup from 'reactjs-popup';
import style2 from './design.module.css'
import 'reactjs-popup/dist/index.css';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // for React, Vue and Svelte

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getOptionsFromChildren } from '@mui/base'
import { Link, useNavigate } from 'react-router-dom'
import styles from "../placeOrder/order.module.css"
import { CartState } from '../../context'
import { userUpdate } from '../../api/orderApis'
import { message, notification } from 'antd'
import Checkbox from "react-custom-checkbox";
import * as Icon from "react-icons/fi";
import { useChangeUserPasswordMutation } from '../../Redux-manage/services/userAuthapi'
import { getToken } from '../../Redux-manage/services/localStorageService'
import { useSelector } from 'react-redux'
import { Alert, duration, Typography } from '@mui/material'
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai"
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

import {
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
  RadiusUpleftOutlined,
  RadiusUprightOutlined,
} from '@ant-design/icons';




const UserProfile = () => {
  notification.destroy()
  var { userdata, setUserData, shipEditcond, showEditable, setShowEditable, setshipEditCond } = CartState()
  var [changepass, setChangepass] = useState(false)
  const [error, setError] = useState({});
  const [changeUserPassword] = useChangeUserPasswordMutation()
  let { access_token } = getToken()
  const [showNewPass, setNewPass] = useState(false)
  const [visiblepassReg, setVisiblePassreg] = useState(false)
  const [showNewPass2, setNewPass2] = useState(false)
  const [visiblepassReg2, setVisiblePassreg2] = useState(false)
  const [showNewPass3, setNewPass3] = useState(false)
  const [visiblepassReg3, setVisiblePassreg3] = useState(false)


  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleSubmit = async (event, userData) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const actualData = {
      oldPass: data.get('oldpswd'),
      password: data.get('pswd'),
      password2: data.get('pswd2'),
    }
    const res = await changeUserPassword({ actualData, access_token });

    console.log(res)
    if (res.error) {
      setError(res.error.data.errors)
    } else {
      const msg = {
        msg: "suxccesfully Done"
      }
      setError(msg)
    }
    if (res.data) {
      setError(res.data)
      //  document.getElementById("password-change-form").reset();
      await userUpdate(userData).then(r => {

        userData = r;
        setUserData(userData)

        Notify()

        setShowEditable(false)
      })
    }

  };

  const myData = useSelector(state => state.user)

  function hasWhiteSpace(s) {
    var i = s.indexOf(' ');
    if (i == -1) {
      return s.length
    }
    else {
      return i
    }
  }

  function hasWhiteSpaceforLast(s) {
    var i = s.indexOf(' ');
    if (i == -1) {
      return 0;
    }
    else {
      return i
    }
  }

  // commented by Rohan kansari- 14/12/22
  // reason- Antd notification in not working here after notification.destroy method implementation so we are using Toastify.

  function Notify() {

    toast.success(<div style={{ fontSize: "18px", color: "black", letterSpacing: "1.4px" }}>Successfully updated.
      <div style={{ fontSize: "13px", color: "black", letterSpacing: "1.4px" }}>Your User Credentials has been updated</div>
    </div>,
      { position: toast.POSITION.TOP_RIGHT, duration: 1000, style: { top: "20vh", right: "2vw", background: "#9c9c9c" } },
    )
  }

  //End of code


  async function updateProfie(event) {
    event.preventDefault();

    window.scrollTo(0, 0)

    

    var data = new FormData(event.currentTarget);

    if(data.get('number').split(" ").join("").length<11){
      isAlertVisiblenum = true
    setIsAlertVisiblenum(true);
    setnumerror("Minimum 8 digits required")
    return false
    }
    //commented by Rohan- date 14/12/22
    //Reason- Adding Phone number change functionality
    var userData = {
      firstname: data.get('first'),
      lastname: data.get('last'),
      email: data.get('email'),
      contact: data.get('number')
    }
    //end of code

    if (data.get('oldpswd') != null) {
      handleSubmit(event, userData)
    }

    if (!data.get('oldpswd'))
      await userUpdate(userData).then(r => {
        userData = r;
        setUserData(userData);
        // Create an instance of Notyf
        Notify()
        setShowEditable(false)

      })
  }

  var [isAlertVisiblenum, setIsAlertVisiblenum] = React.useState(false);
  var [numerror, setnumerror] = useState("")
  const handleButtonClicknum = (msg) => {
    isAlertVisiblenum = true
    setIsAlertVisiblenum(true);
    numerror = msg;
    setnumerror(msg)
    setTimeout(() => {
      isAlertVisiblenum = false
      setIsAlertVisiblenum(false);
    }, 5000);
  }

  function validatesNum(evt) {
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
      var data = "Please Enter Only Number"
      handleButtonClicknum(data)
    }


  }


  return (
    <div className={style.scrolling} >
      <Navbar />
      {/* commented by Rohan - date 14/12/22
          reason - Here toastify notfication show  */}
      <ToastContainer />
      {/* {end of code} */}

      <div className={style.Container} >
        <div className={style.centerContainer}>
          <div className={style.containerHeader}><Link to="/" className={style.containerHeader}>Homepage</Link> / My Account</div>
          <div className={style.main}>
            <div className={style.column1}>
              <div className={style.column1header}>MY ACCOUNT</div>
              <hr style={{ color: "black" }}></hr>
              <div className={style.column1text} onClick={e => setShowEditable(!true)}><Link to="/userprofile" style={{ textDecoration: "none", color: "#8c8c8c" }}>MY PROFILE</Link></div>
              <div className={style.column1text} onClick={e => setshipEditCond(true)}><Link to="/shippindprofile" style={{ textDecoration: "none", color: "#8c8c8c" }}>MY SHIPPING DETAILS</Link></div>
              <div className={style.column1text}><Link to="/profile" style={{ textDecoration: "none", color: "#8c8c8c" }}>MY ORDERS</Link></div>

            </div>

            <div className={style.column2}>
              <div className={style.column2header}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <span>USER DETAILS</span>
                  <span className={`${styles.userinfoText} ${style.hovers}`} style={{ cursor: "pointer" }} onClick={e => setShowEditable(true)}>{!showEditable ? "EDIT YOUR PROFILE" : null}
                  </span>
                </div>
              </div>
              <hr style={{ color: "black" }}></hr>
              <>
                <div className={styles.columnitem1}>

                  {!showEditable ?
                    <div className={styles.usedetailShow} >
                      <div className={style.box} style={{ border: "0.1rem solid grey", height: "auto", padding: "5px" }}>
                        <div ><span className={styles.userinfoText} style={{ wordBreak: "break-all" }}>{userdata.name}</span></div>
                        <div ><span className={styles.userinfoText} style={{ wordBreak: "break-all" }}> {userdata.email}</span></div>
                      </div>
                    </div>
                    :
                    <>
                      <div className={styles.columnitem1head}>1. USER DETAILS</div>
                      <form onSubmit={e => updateProfie(e)} onLoad={e=>
                      {
                        var input= document.getElementsByClassName('PhoneInputInput')[0];
                        input.style.background="#fff"
                        input.setAttribute('name','number')
                        input.setAttribute('id','number')
                      }}>
                        <div className={styles.columnitem1content1}>
                          <div className={styles.columnFirstName}>
                            <label className={styles.firstName} htmlFor='first'>FIRST NAME*</label>

                            <input className={styles.firstInput} type="text" defaultValue={userdata.name.substring(0, hasWhiteSpace(userdata.name))} name="first" required />

                          </div>
                          <div className={styles.columnFirstName}>
                            <label className={styles.firstName} htmlFor='last'>LAST NAME*</label>

                            <input className={styles.firstInput} type="text" defaultValue={userdata.name.substring(hasWhiteSpaceforLast(userdata.name), userdata.name.length)} name="last" required />

                          </div>
                        </div>
                        <div className={styles.columnitem1content1}>
                          <div className={styles.columnFirstName}>
                            <label className={styles.firstName} htmlFor='email'>EMAIL ADDRESS*</label>

                            <input className={styles.firstInput} type="email" defaultValue={userdata.email} name="email" required />

                          </div>

                          {/* Commented by rohan- date 14/12/22 */}
                          <div className={styles.columnFirstName}>
                            <label className={styles.firstName} htmlFor='last'>Contact Number*</label>

                            <PhoneInput
                            international
                            placeholder="phone number"
                            value={`${userdata.contact}`}
                            defaultCountry="IN"
                            className={styles.firstInput}
                            // style={{width:"70%",marginLeft:"15%"}}
                            onChange={e=>{
                              userdata.contact=e;
                              setIsAlertVisiblenum(false)}} 
                            limitMaxLength={15}
                            />
                            {/* <input className={styles.firstInput} type="text" defaultValue={userdata.contact} name="number" onKeyPress={validatesNum} minLength={10} maxLength={10} required /> */}
                            {isAlertVisiblenum && <span asp-validation-for="Code" class="text-danger col-sm-4">{numerror}</span>}

                          </div>
                          {/* End of code */}

                        </div>
                        <div className={styles.columnitem1content1}>

                          <Checkbox
                            icon={<i class="fa-sharp fa-solid fa-square-check" style={{ width: "20px" }}></i>}
                            name="my-input"

                            checked={changepass}
                            onChange={(value, event) => {
                              setChangepass(value)
                            }}
                            borderColor="#000"

                            style={{ cursor: "pointer", width: "17px", marginLeft: "10px" }}
                            labelStyle={{ marginLeft: 5, userSelect: "none" }}
                            label={<label className={styles.firstName} htmlFor='street' style={{ fontSize: "14px", fontStyle: "bold", letterSpacing: "1.5px", paddingBottom: "2px" }}>Change My Password</label>}
                          />
                        </div>

                        {changepass ? <>


                          <div className={styles.columnitem1content1}>
                            {/* {error.non_field_errors? <Alert severity="error"  style={{margin:"0",width:"100%"}}>{error.non_field_errors[0]}</Alert> : ""} */}
                            <div className={styles.columnFirstName}>
                              <label className={styles.firstName} htmlFor='current'>Current Password*</label>

                              <div className={styles.firstInput} style={{ padding: "0" }}>

                                <input className={styles.inputr} type={showNewPass ? "text" : "password"} name="oldpswd" required onChange={e => { if (e.target.value.length > 0) setVisiblePassreg(true); else setVisiblePassreg(false) }} />

                                {error.non_field_errors && error.non_field_errors[0] == "Old password is Incorrect" ? <Typography style={{ color: "red", fontSize: 12 }}>{error.non_field_errors[0]}</Typography> : ""}

                                {visiblepassReg ? showNewPass ? <AiFillEye style={{ fontSize: "20px" }} onClick={e => setNewPass(false)} /> : <AiFillEyeInvisible style={{ fontSize: "20px" }} onClick={e => setNewPass(true)} /> : null}

                              </div>

                              {/* <input className={styles.firstInput} type={showNewPass?"text":"password"} name="oldpswd" required onChange={e=>{if(e.target.value.length>0)setVisiblePassreg(true); else setVisiblePassreg(false)}}/>
                        {error.non_field_errors&&error.non_field_errors[0]=="Old password is Incorect"? <Typography style={{color:"red",fontSize:12}}>{error.non_field_errors[0]}</Typography> : ""}
                        {visiblepassReg?showNewPass?<AiFillEye style={{marginTop:"5px"}} onClick={e=>setNewPass(false)}/>:<AiFillEyeInvisible style={{marginTop:"5px"}} onClick={e=>setNewPass(true)}/>:null} */}

                            </div>
                          </div>

                          <div className={styles.columnitem1content1}>
                            <div className={styles.columnFirstName}>
                              <label className={styles.firstName} htmlFor='first'>New Password*</label>

                              <div className={styles.firstInput} style={{ padding: "0" }}>

                                <input className={styles.inputr} type={showNewPass2 ? "text" : "password"} name="pswd" required onChange={e => { if (e.target.value.length > 0) setVisiblePassreg2(true); else setVisiblePassreg2(false) }} />
                                {visiblepassReg2 ? showNewPass2 ? <AiFillEye style={{ fontSize: "20px" }} onClick={e => setNewPass2(false)} /> : <AiFillEyeInvisible style={{ fontSize: "20px" }} onClick={e => setNewPass2(true)} /> : null}

                                {error.non_field_errors && error.non_field_errors[0] == "New password should not be matched with old" ? <Typography style={{ color: "red", fontSize: 12 }}>{error.non_field_errors[0]}</Typography> : " "}
                              </div>

                            </div>
                            <div className={styles.columnFirstName}>
                              <label className={styles.firstName} htmlFor='last'>Confirm New Password*</label>
                              <div className={styles.firstInput} style={{ padding: "0" }}>

                                <input className={styles.inputr} type={showNewPass3 ? "text" : "password"} name="pswd2" required onChange={e => { if (e.target.value.length > 0) setVisiblePassreg3(true); else setVisiblePassreg3(false) }} />

                                {visiblepassReg3 ? showNewPass3 ? <AiFillEye style={{ fontSize: "20px" }} onClick={e => setNewPass3(false)} /> : <AiFillEyeInvisible style={{ fontSize: "20px" }} onClick={e => setNewPass3(true)} /> : null}

                                {error.non_field_errors && error.non_field_errors[0] == "New password and confirm password doesn't match" ? <Typography style={{ color: "red", fontSize: 12 }}>{error.non_field_errors[0]}</Typography> : " "}
                              </div>
                              {/* {error.password2?<Typography style={{color:"red",fontSize:10}}>{error.password2[0]}</Typography>:" "} */}

                            </div>
                          </div>

                        </> : null}


                        <div className={styles.cancelButtonWithSubmit}>
                          <button className={styles.userInfoButton} style={{ width: "48%" }} type="submit">
                            UPDATE PROFILE
                          </button>
                          <div className={styles.userInfoButton} 
                            onClick={e =>
                            { setShowEditable(false)
                              window.scrollTo(0,0)
                            }}>
                            CANCEL
                          </div>

                        </div>

                      </form>
                    </>}


                </div>
              </>
            </div>
          </div>
        </div>

      </div>

      <div className={style.foot}>
        <Footer />
      </div>

    </div>
  )
}

export default UserProfile



// import React, { useMemo } from 'react';
// import {
//   RadiusBottomleftOutlined,
//   RadiusBottomrightOutlined,
//   RadiusUpleftOutlined,
//   RadiusUprightOutlined,
// } from '@ant-design/icons';
// import { Button, Divider, notification, Space } from 'antd';
// import type { NotificationPlacement } from 'antd/es/notification/interface';

// const Context = React.createContext({ name: 'Default' });

// const App: React.FC = () => {
//   const [api, contextHolder] = notification.useNotification();

//   const openNotification = (placement: NotificationPlacement) => {
//     api.info({
//       message: `Notification ${placement}`,
//       description: <Context.Consumer>{({ name }) => `Hello, ${name}!`}</Context.Consumer>,
//       placement,
//     });
//   };

//   const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

//   return (
//     <Context.Provider value={contextValue}>
//       {contextHolder}
//       <Space>
//         <Button type="primary" onClick={() => openNotification('topLeft')}>
//           <RadiusUpleftOutlined />
//           topLeft
//         </Button>
//         <Button type="primary" onClick={() => openNotification('topRight')}>
//           <RadiusUprightOutlined />
//           topRight
//         </Button>
//       </Space>
//       <Divider />
//       <Space>
//         <Button type="primary" onClick={() => openNotification('bottomLeft')}>
//           <RadiusBottomleftOutlined />
//           bottomLeft
//         </Button>
//         <Button type="primary" onClick={() => openNotification('bottomRight')}>
//           <RadiusBottomrightOutlined />
//           bottomRight
//         </Button>
//       </Space>
//     </Context.Provider>
//   );
// };

// export default App;