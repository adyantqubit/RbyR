import React, { useState, useMemo, useEffect, useRef } from 'react'
import styles from './order.module.css'
import {TiTick} from 'react-icons/ti'
import {IoIosCheckmarkCircle} from 'react-icons/io'
import {IoMdCheckmark} from 'react-icons/io'
import Checkbox from "react-custom-checkbox";
import * as Icon from "react-icons/fi";
import { CartState } from '../../context';
import { Typography} from '@mui/material';
import { billingcheckApi, shpingcheckApi } from '../../api/service';
import { getToken } from '../../Redux-manage/services/localStorageService';
import { Modal, notification } from 'antd';
import Select from 'react-select'
import countryList from 'react-select-country-list'
import list from './data.json'
import { shippingTickGet } from '../../api/orderApis';


const UsserAdresses = () => {

const{userdata,checkoutDetails,setCheckoutDetails,paymentflow,setPaymentflow}=CartState()
const [cond,setCond]=useState(true)
const [billingInfo,setBillingInfo]=useState(false)
const {access_token}=getToken()
const [error,setError]=useState({})
const [checkFlow,setCheckFlow]=useState(false)

var [ isAlertVisiblepin, setIsAlertVisiblepin ] = React.useState(false);
var [ isAlertVisiblenum, setIsAlertVisiblenum ] = React.useState(false);
var [numerror,setnumerror]=useState("")
var [pinerror,setpinerror]=useState("")

const [value, setValue] = useState("India")
const [value2, setValue2] = useState("India")

const options = countryList().getData()
  

const changeHandler = value => {
  setValue(value.target.value)
}
const changeHandler2 = value => {
    setValue2(value.target.value)
  }

const handleButtonClickpin = (msg) => {
    isAlertVisiblepin=true
    setIsAlertVisiblepin(true);
    pinerror=msg
    setpinerror(pinerror)
      setTimeout(() => {
        isAlertVisiblepin=false
         setIsAlertVisiblepin(false);
         
     }, 7000);
}

const handleButtonClicknum = (msg) => {
    isAlertVisiblenum=true
    setIsAlertVisiblenum(true);
    numerror=msg;
    setnumerror(msg)
      setTimeout(() => {
        isAlertVisiblenum=false
         setIsAlertVisiblenum(false);
     }, 5000);
}

const handleSubmit = async(e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    // if(data.get('first').length==0)
    // {
    //     error['efirst']="this field is required";
    //     setError(error)
    //     console.log(error)
    //     setCheckFlow(false)
    // } 
    // else if(data.get('last').length==0) {
    //     error['elast']="this field is required";
    //     setError(error)
    //     setCheckFlow(false)

    // }
    
    // if(data.get('first').length>0)
    // {
    //     delete error['efirst'];
    //     setError(error)
        
    // }

    if(data.get('pincode').length<6)
    {  var dta=" * minimum 6 digit required"
        handleButtonClickpin(dta)
    }
    else{
        isAlertVisiblepin=false
    }
    if(data.get('number').length<10)
    {
        var dta=" * minimum 10 digit required"
        handleButtonClicknum(dta)
    }
    else{
        isAlertVisiblenum=false
    }

    if(billingInfo){
    if(data.get('pincodeb').length<6)
    {  var dta=" * minimum 6 digit required"
        handleButtonClickpin(dta)
    }
    else{
        isAlertVisiblepin=false
    }
    if(data.get('numberb').length<10)
    {
        var dta=" * minimum 10 digit required"
        handleButtonClicknum(dta)
    }
    else{
        isAlertVisiblenum=false
    }
}


    const shippingData={
        firstname:data.get('first'),
        lastname:data.get('last'),
        street:data.get('street'),
        houseno:data.get('flatno'),
        city:data.get('city'),
        state:data.get('state'),
        zipcode:data.get('pincode'),
        country:value,
        number:data.get('number')
    }


    var billingData;
    if(!billingInfo){
        billingData=shippingData;
    }
    else{
        billingData={
            firstname:data.get('firstb'),
            lastname:data.get('lastb'),
            street:data.get('streetb'),
            houseno:data.get('flatnob'),
            city:data.get('cityb'),
            state:data.get('stateb'),
            zipcode:data.get('pincodeb'),
            country:value2,
            number:data.get('numberb')
        }
    }

    if(!isAlertVisiblenum&&!isAlertVisiblepin){
    checkoutDetails['shippingData']=shippingData;
    checkoutDetails['billingData']=billingData;
    setCheckoutDetails(checkoutDetails)
    console.log(checkoutDetails)

    await shpingcheckApi(shippingData,access_token).then(e=>{
        checkoutDetails['shipping_id']=e.shipping_id;
        console.log(e)
        setCheckoutDetails(checkoutDetails)
        setCond(false)
        setPaymentflow(true)
    })
    

    await billingcheckApi(billingData,access_token).then(e=>{
        checkoutDetails['billing_id']=e.billing_id;
        console.log(e)
        setCheckoutDetails(checkoutDetails)
        setCond(false)
        setPaymentflow(true)
    })

}
}

function validate(evt) {
    var theEvent = evt || window.event;
  
    // Handle paste
    if (theEvent.type === 'paste') {
        key = evt.clipboardData.getData('text/plain');
    } else {
    // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /^[a-zA-Z@]+$/;
    if( !regex.test(key) ) {
      theEvent.returnValue = false;
      if(theEvent.preventDefault) theEvent.preventDefault();
    }
  }

function validatesPin(evt) {
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
        var data="Please Enter Only Number"
        handleButtonClickpin(data)
      }
   
      console.log(key)
  
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
    if( !regex.test(key) ) {
        theEvent.returnValue = false;
        if(theEvent.preventDefault) theEvent.preventDefault();
        var data="Please Enter Only Number"
        handleButtonClicknum(data)
      }

      
  }


  function validateWhitespace(evt,id)
  {var theEvent = evt || window.event;
    var key=0
    // Handle paste
    if (theEvent.type === 'paste') {
        key = evt.clipboardData.getData('text/plain');
    } else {
    // Handle key press
        key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }

    
    var regex = /\s/	
    if( document.getElementById(`${id}`).value.trim().length>0 || !regex.test(key) ) {
        
    }else{
        theEvent.returnValue = false;
        if(theEvent.preventDefault) theEvent.preventDefault();
    }
  }

  return (
<>
{cond?
<div className={styles.columnitem2} style={{marginTop:"20px"}}>
         <div className={styles.columnitem1head}>2. SHIPPING INFO</div>
         <form onSubmit={handleSubmit}>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='first'>FIRST NAME *</label>
                        {checkoutDetails.shippingData?
                        <>
                         <input className={styles.firstInput} name='first' maxLength={19} onKeyPress={validate} defaultValue={checkoutDetails.shippingData.firstname} required/>
                         {/* {!checkFlow?<Typography style={{color:"red",fontSize:"13px"}}>This Field is required</Typography>:null} */}
                         </>
                         :        
                         <>
                        <input className={styles.firstInput} maxLength={19} name='first' onKeyPress={validate} required/>
                        {/* {error.efirst?<Typography style={{color:"red",fontSize:"13px"}}>This Field is required</Typography>:null} */}
                        </>
                        }
                    </div>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='b'>LAST NAME *</label>
                        {checkoutDetails.shippingData?
                         <input className={styles.firstInput} name='last' maxLength={19} onKeyPress={validate} defaultValue={checkoutDetails.shippingData.lastname} required/>
                        : 
                        <input className={styles.firstInput} name='last' maxLength={19} onKeyPress={validate} required/>}
                    </div>
                </div>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFullName}>
                        
                        <label className={styles.firstName} htmlFor='street'>Street name *</label>
                        {checkoutDetails.shippingData?
                         <input className={styles.firstInput} id="street" maxLength={180} onKeyPress={e=>validateWhitespace(e,"street")} name='street' defaultValue={checkoutDetails.shippingData.street} required/>
                        : 
                        <input className={styles.firstInput} id="street" maxLength={180} onKeyPress={e=>validateWhitespace(e,"street")} name='street' required/>}
                    </div>
                </div>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFullName}>
                        <label className={styles.firstName} htmlFor='street'>House/Apartment number *</label>
                        {checkoutDetails.shippingData?
                         <input className={styles.firstInput} id="flatno" name='flatno' onKeyPress={e=>validateWhitespace(e,"flatno")} maxLength={10} defaultValue={checkoutDetails.shippingData.houseno} required/>
                        : 
                        <>
                        <input className={styles.firstInput} id="flatno" onKeyPress={e=>validateWhitespace(e,"flatno")} name='flatno' maxLength={10}  required/>
                        </>
                        }
                    </div>
                </div>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='first'>City *</label>
                        {checkoutDetails.shippingData?
                         <input className={styles.firstInput} id="city" maxLength={29} onKeyPress={e=>validateWhitespace(e,"city")} name='city' defaultValue={checkoutDetails.shippingData.city} required/>
                        : 
                        <input className={styles.firstInput} id="city" maxLength={29} onKeyPress={e=>validateWhitespace(e,"city")} name='city' required/>
                        }
                    </div>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='last'>State / Province</label>
                        {checkoutDetails.shippingData?
                         <input className={styles.firstInput} id="state" maxLength={29} onKeyPress={e=>validateWhitespace(e,"state")} name='state' defaultValue={checkoutDetails.shippingData.state} required/>
                        : 
                        <input className={styles.firstInput} id="state" maxLength={29} onKeyPress={e=>validateWhitespace(e,"state")} name='state' required/>}
                    </div>
                </div>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='first'>Zip-code *</label>
                        {checkoutDetails.shippingData?
                        <> <input className={styles.firstInput}  name='pincode' onKeyPress={validatesPin} maxLength={6} defaultValue={checkoutDetails.shippingData.zipcode} required/>
                         {isAlertVisiblepin&&<span asp-validation-for="Code" class="text-danger col-sm-4">{pinerror} </span>}
                         </>
                         : 
                         <>
                        <input className={styles.firstInput} name='pincode' onKeyPress={validatesPin} maxLength={6} required/>
                        {isAlertVisiblepin&&<span asp-validation-for="Code" class="text-danger col-sm-4">{pinerror}</span>}
                        </>
                        }
                    </div>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='last'>Country *</label>
                        {checkoutDetails.shippingData?
                         <select className={styles.firstInput} defaultValue={value} onChange={changeHandler}>
                         {list.map(l=>{
                             return <option value={l.label}>{l.label}</option>
                         })}
                         </select>
                        : 
                        <select className={styles.firstInput} defaultValue={value} onChange={changeHandler}>
                            {list.map(l=>{
                                return <option value={l.label}>{l.label}</option>
                            })}
                            </select>
                        // <input className={styles.firstInput} name='country' required/>}
                       }
                    </div>
                </div>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFullName}>
                        <label className={styles.firstName} htmlFor='street'>Phone Number *</label>
                        {checkoutDetails.shippingData?
                        <>
                         <input className={styles.firstInput} name='number' onKeyPress={validatesNum} maxlength={10} defaultValue={checkoutDetails.shippingData.number} required/>
                         {isAlertVisiblenum&&<span asp-validation-for="Code" class="text-danger col-sm-4">{numerror}</span>}
                         </>
                         : 
                         <>
                        <input className={styles.firstInput} name='number' onKeyPress={validatesNum} maxLength={10} required/>
                        {isAlertVisiblenum&&<span asp-validation-for="Code" class="text-danger col-sm-4">{numerror}</span>}
                        </>
                        }
                    </div>
                </div>
                

                <div className={styles.columnitem1content1}>
                    <Checkbox
                        icon={<Icon.FiCheck color="white" size={16} style={{background:"black"}}/>}
                        name="my-input"
                        checked={!billingInfo}
                        onChange={(value, event) => {
                         setBillingInfo(!value)
                        }}
                        style={{ cursor: "pointer" }}
                        labelStyle={{ marginLeft: 5, userSelect: "none" }}
                        label={<label className={styles.firstName} htmlFor='street'>Billing Address Is Same as Shipping Address</label>}
                       />
                </div>


{/* billing info form */}

             {billingInfo?
             <>
                <div className={styles.columnitem1content1}>
                <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='first'>FIRST NAME *</label>
                        {checkoutDetails.billingData?
                         <input className={styles.firstInput} name='firstb' maxLength={19}  onKeyPress={validate} defaultValue={checkoutDetails.billingData.firstname} required/>
                        :        
                        <input className={styles.firstInput} name='firstb' maxLength={19} onKeyPress={validate} required/>
                        }
                    </div>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='b'>LAST NAME *</label>
                        {checkoutDetails.billingData?
                         <input className={styles.firstInput} name='lastb' maxLength={19} onKeyPress={validate} defaultValue={checkoutDetails.billingData.lastname} required/>
                        : 
                        <input className={styles.firstInput} name='lastb' maxLength={19} onKeyPress={validate} required/>}
                    </div>
                </div>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFullName}>
                        
                        <label className={styles.firstName} htmlFor='street'>Street name *</label>
                        {checkoutDetails.billingData?
                         <input className={styles.firstInput} name='streetb' maxLength={180}  id="streetb" onKeyPress={e=>validateWhitespace(e,"streetb")}  defaultValue={checkoutDetails.billingData.street} required/>
                        : 
                        <input className={styles.firstInput} name='streetb'maxLength={180}  id="streetb" onKeyPress={e=>validateWhitespace(e,"streetb")}  required/>}
                    </div>
                </div>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFullName}>
                        <label className={styles.firstName} htmlFor='street'>House/Apartment number *</label>
                        {checkoutDetails.billingData?
                         <input className={styles.firstInput} name='flatnob' maxLength={19}  id="flatb" onKeyPress={e=>validateWhitespace(e,"flatb")}  defaultValue={checkoutDetails.billingData.houseno} required/>
                        : 
                        <input className={styles.firstInput} name='flatnob' maxLength={19} id="flatb" onKeyPress={e=>validateWhitespace(e,"flatb")}  required/>
                        }
                    </div>
                </div>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='first'>City *</label>
                        {checkoutDetails.billingData?
                         <input className={styles.firstInput} name='cityb' maxLength={19}  id="cityb" onKeyPress={e=>validateWhitespace(e,"cityb")}  defaultValue={checkoutDetails.billingData.city} required/>
                        : 
                        <input className={styles.firstInput} name='cityb' maxLength={19} id="cityb" onKeyPress={e=>validateWhitespace(e,"cityb")}  required/>
                        }
                    </div>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='last'>State / Province</label>
                        {checkoutDetails.billingData?
                         <input className={styles.firstInput} name='stateb' maxLength={29} id="stateb" onKeyPress={e=>validateWhitespace(e,"stateb")}  defaultValue={checkoutDetails.billingData.state} required/>
                        : 
                        <input className={styles.firstInput} name='stateb' maxLength={29} id="stateb" onKeyPress={e=>validateWhitespace(e,"stateb")}  required/>}
                    </div>
                </div>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='first'>Zip-code *</label>
                        {checkoutDetails.billingData?
                        <>
                         <input className={styles.firstInput} name='pincodeb' onKeyPress={validatesPin} maxLength={6} defaultValue={checkoutDetails.billingData.zipcode} required/>
                         {isAlertVisiblepin&&<span asp-validation-for="Code" class="text-danger col-sm-4">{pinerror} </span>}
                         </>
                         : 
                         <>
                        <input className={styles.firstInput} name='pincodeb' onKeyPress={validatesPin} maxLength={6} required/>
                       {isAlertVisiblepin&&<span asp-validation-for="Code" class="text-danger col-sm-4">{pinerror} </span>}
                       </>}
                    </div>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='last'>Country *</label>
                        {checkoutDetails.billingData?
                         <select className={styles.firstInput} defaultValue={value2} onChange={changeHandler2}>
                         {list.map(l=>{
                             return <option value={l.label}>{l.label}</option>
                         })}
                         </select>
                        : 
                        <select className={styles.firstInput} defaultValue={value2} onChange={changeHandler2}>
                         {list.map(l=>{
                             return <option value={l.label}>{l.label}</option>
                         })}
                         </select>
                         }
                    </div>
                </div>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFullName}>
                        <label className={styles.firstName} htmlFor='street'>Phone Number *</label>
                        {checkoutDetails.billingData?
                        <>
                         <input className={styles.firstInput} name='numberb' onKeyPress={validatesNum} maxlength={10} defaultValue={checkoutDetails.billingData.number} required/>
                         {isAlertVisiblenum&&<span asp-validation-for="Code" class="text-danger col-sm-4">{numerror}</span>}
                         </>
                         : 
                         <>
                        <input className={styles.firstInput} name='numberb' onKeyPress={validatesNum} maxlength={10} required/>
                        {isAlertVisiblenum&&<span asp-validation-for="Code" class="text-danger col-sm-4">{numerror}</span>}
                        </>
                        }
                    </div>
                </div>
                </>
                :null}
                                 
                <button className={styles.userInfoButton} type='submit'>
                    PROCEED TO PAYMENT
                </button>
            </form>
        </div>

        :
        <div className={styles.columnitem1_1} style={{marginTop:"20px"}}>
            <div className={styles.columnitem1head}>
                <span>2. SHIPPING INFO
                <IoIosCheckmarkCircle style={{fontSize:"37px",color:"black",background:"white",marginLeft:"15px",position:"relative",bottom:"5px"}}/>    
                </span>
                <span style={{alignSelf:"flex-end",fontSize:"13px",lineHeight:"20px",letterSpacing:"1px"}} onClick={e=>setCond(true)}>change</span>
            </div>
            <div className={styles.columnitem1content1}>
                    <div className={styles.columnFirstName}>
                        <div className={styles.boxAddress}>
                            <div className={styles.addressInformation}>
                            <div ><span className={styles.userinfoText}>{checkoutDetails.shippingData.firstname} {checkoutDetails.shippingData.lastname}</span></div>
                            <div ><span className={styles.userinfoText}>{checkoutDetails.shippingData.street} </span><span className={styles.userinfoText2}>{checkoutDetails.shippingData.houseno},</span></div>
                            <div ><span className={styles.userinfoText}>{checkoutDetails.shippingData.city} - </span><span className={styles.userinfoText2}>{checkoutDetails.shippingData.zipcode},</span></div>
                            <div ><span className={styles.userinfoText}>{checkoutDetails.shippingData.state} </span></div>
                            <div ><span className={styles.userinfoText}>{checkoutDetails.shippingData.country} </span></div>
                            <div ><span className={styles.userinfoText}>{checkoutDetails.shippingData.number} </span></div>
                            </div>
                            <div className={styles.adressTick}>
                            <IoMdCheckmark style={{fontSize:"25",color:"black",fontWeight:"20",backgroundColor:"white",border:"none"}}/>
                                
                            </div> 
                        </div>
                    </div>
                    
                </div>
                <div className={styles.columnitem1head}>
                <span> BILLING ADDRESS
                <IoIosCheckmarkCircle style={{fontSize:"37px",color:"black",background:"white",marginLeft:"15px",position:"relative",bottom:"5px"}}/>    
                </span>
                <span style={{alignSelf:"flex-end",fontSize:"13px",lineHeight:"20px",letterSpacing:"1px"}}></span>
            </div>
                <div className={styles.columnitem1content1}>
                        <div className={styles.columnFirstName}>
                            <div className={styles.boxAddress}>
                                <div className={styles.addressInformation}>
                                <div ><span className={styles.userinfoText}>{checkoutDetails.billingData.firstname} {checkoutDetails.billingData.lastname}</span></div>
                                <div ><span className={styles.userinfoText}>{checkoutDetails.billingData.street} </span><span className={styles.userinfoText2}>{checkoutDetails.billingData.houseno},</span></div>
                                <div ><span className={styles.userinfoText}>{checkoutDetails.billingData.city} - </span><span className={styles.userinfoText2}>{checkoutDetails.billingData.zipcode},</span></div>
                                <div ><span className={styles.userinfoText}>{checkoutDetails.billingData.state} </span></div>
                                <div ><span className={styles.userinfoText}>{checkoutDetails.billingData.country} </span></div>
                                <div ><span className={styles.userinfoText}>{checkoutDetails.billingData.number} </span></div>
                                </div>
                                <div className={styles.adressTick}>
                                <IoMdCheckmark style={{fontSize:"25",color:"black",fontWeight:"20",backgroundColor:"white",border:"none"}}/>    
                                </div> 
                            </div>
                        </div>
                        
                    </div>
          </div>  
        }
</>  )
}

export default UsserAdresses