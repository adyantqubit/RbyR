import React, { useEffect, useState } from 'react'
import { InvoiveGetApi, ShippingDeleteApi, ShippingGetApi, ShippingUpdateApi, TransactionGetApi } from '../../api/service'
import Footer from '../global/footer'
import Navbar from '../global/NavHeader'
import style from "./profile.module.css"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { TiTick } from 'react-icons/ti'
import { getOptionsFromChildren } from '@mui/base'
import { Link, useNavigate } from 'react-router-dom'
import styles from "../placeOrder/order.module.css"
import { CartState } from '../../context'
import { shippingTick } from '../../api/orderApis'
import list from '../placeOrder/data.json'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'


import {AiOutlineClose} from 'react-icons/ai'
import { notification } from 'antd';

const ShippingProfile = () => {
    // notification.destroy()
    const [shippingAddress,setShippingAddress]=useState([])
    const {defaultShiping,setDefaultShipping,shipEditcond,setshipEditCond,setShowEditable}=CartState()
    var [ isAlertVisiblepin, setIsAlertVisiblepin ] = React.useState(false);
var [ isAlertVisiblenum, setIsAlertVisiblenum ] = React.useState(false);
var [numerror,setnumerror]=useState("")
var [pinerror,setpinerror]=useState("")
const [value, setValue] = useState("India")
const [value2, setValue2] = useState("India")

/**
 * Added by - Ashish Dewangan on 09-12-2023
 * Reason - To add serial number to address list
 */
var sno=0;
/**
 * End of code addition by - Ashish Dewangan on 09-12-2023
 * Reason - To add serial number to address list
 */

useEffect(()=>{
    window.scrollTo(0,0)
},[])

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

    useEffect(()=>{
       shippingDetails()
    },[])

    //this api update list of shipping address
   async function shippingDetails(){
    var access=localStorage.getItem('access_token')
    await ShippingGetApi({access}).then(r=>setShippingAddress(r))
    }

    // this functionality open and close editadress page
    function setAddress(s){
         shipTick(s.id)
        // setCond(!cond)
        setDefaultShipping(s)
        // setShippingAddress(shippingAddress.sort((a,b)=>b.id-a.id))
        // console.log(shippingAddress.sort((a,b)=>a.id-b.id))
    }


    function jumpToEdit(){
        setDefaultShipping(shippingAddress.filter(s=>s.isSelected==true)[0])
        setshipEditCond(!shipEditcond)
    }

   async function shipTick(id){
        await shippingTick(id).then(r=>setShippingAddress(r.sort((a,b)=>a.id-b.id)))
    }


    async function handleSubmit(event,id){
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        var billingData={
            id:id,
            firstname:data.get('firstb'),
            lastname:data.get('lastb'),
            street:data.get('streetb'),
            houseno:data.get('flatnob'),
            city:data.get('cityb'),
            state:data.get('stateb'),
            zipcode:data.get('pincodeb'),
            country:value,
            number:data.get('numberb')
        }

        if(data.get('pincodeb').split(" ").join("").length<6)
    {  var dta=" Minimum 6 digit required"
        handleButtonClickpin(dta)
    }
    else{
        isAlertVisiblepin=false
    }
    if(data.get('numberb').split(" ").join("").length<11)
    {
        var dta="Minimum 8 digit required"
        handleButtonClicknum(dta)
    }
    else{
        isAlertVisiblenum=false
    }


    if(!isAlertVisiblenum&&!isAlertVisiblepin){

        var access=localStorage.getItem('access_token')
       await ShippingUpdateApi({access,billingData}).then(r=>{
        //if any response come this update shipping detail and re call shipping api to update new list
            if(r)
             {   window.scrollTo(0,0)
                setshipEditCond(!shipEditcond)
                shippingDetails()
             }
       })
    }

}
    
    async function shippingDelete(e,id){
        e.preventDefault();
        var access=localStorage.getItem('access_token')
        await ShippingDeleteApi({access,id}).then(r=>
            {
                shippingDetails()
                setshipEditCond(!shipEditcond)
            }
            )
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
                     
          }
        
          // Addition by Om Shrivastava on 19-11-23
        // Reason : Need to add the function, when user change the contact number then now page is blank so I fixed issue
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
         // End of addition by Om Shrivastava on 19-11-23
        // Reason : Need to add the function, when user change the contact number then now page is blank so I fixed issue

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

// function scroll(e){
// e.scrollTop=0
// }

function validatesNum(evt) { 
    var theEvent = evt || window.event;

    // Handle paste
    // if (theEvent.type === 'paste') {
    //     key = evt.clipboardData.getData('text/plain');
    // } else {
    //     // Handle key press
    //     var key = theEvent.keyCode || theEvent.which;
    //     key = String.fromCharCode(key);
    // }
    // var regex = /^0|[1-9]\d*$/
    // var regExp = /[a-zA-Z]/g;
     
    // console.log(regExp.test(evt))

    // if (!regex.test(evt)) {
    //     theEvent.returnValue = false;
    //     if (theEvent.preventDefault) theEvent.preventDefault();
    //     var data = "Please Enter Only Number"
    //     handleButtonClicknum(data)
    // }


}
    
    
  return (
    <div className={style.scrolling} >
    <Navbar/>
    <div className={style.Container} >
        <div className={style.centerContainer}>
          <div className={style.containerHeader}>
          <div style={{paddingTop:'12px',display:'flex',flexDirection:'row'}}>
            <Link to="/"  className={style.containerHeader}>Homepage</Link>/ My Account
            </div>
            </div>
          <div className={style.main}>
            <div className={style.column1}>
              <div className={style.column1header} >MY ACCOUNT</div>
              <hr style={{color:"black"}}></hr>
              <div className={style.column1text} onClick={e=>setShowEditable(!true)}><Link to="/userprofile" style={{textDecoration:"none",color:"#212121"}}>MY PROFILE</Link></div>
              <div className={style.column1text} onClick={e=>setshipEditCond(true)}><Link to="/shippindprofile" style={{textDecoration:"none",color:"#212121"}} >MY SHIPPING DETAILS</Link></div>
              <div className={style.column1text}><Link to="/profile" style={{textDecoration:"none",color:"#212121"}}>MY ORDERS</Link></div>

            </div>
            <div className={style.column2}>
            <div className={style.column2header} >
                <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                    <span style={{fontWeight:'600'}}>SHIPPING DETAILS</span>
                   
                    {shippingAddress!=null&&shippingAddress.length>0?
                     <span className={styles.userinfoText} style={{
                        // textDecoration:"underline",
                        cursor:"pointer",color:'blue'}} onClick={e=>jumpToEdit()}>
                        {shipEditcond&&shippingAddress.filter(s=>s.isSelected==true).length>0?"EDIT CONFIGURATION":null}
                    </span> :
                    null}
                </div>
            </div>
            <hr style={{color:"black"}}></hr>

            

            {shipEditcond?<div className={styles.columnitem1_1} style={{marginTop:"20px"}}>

            {/* <div className={styles.columnitem1content1}>

            {shippingAddress!=null&&shippingAddress.length>0?

            shippingAddress.map((s,i)=>(
                <div className={styles.columnFirstName} >
                    <div className={styles.boxAddress} onClick={e=>setAddress(s)}>
                    
                        <div className={styles.addressInformation} >
                        <div className={styles.userinfoText} style={{whiteSpace:"nowrap", overflow:"hidden",textOverflow:"ellipsis"}}> {s.firstname} {s.lastname}</div>
                        <div className={styles.userinfoText} style={{whiteSpace:"nowrap", overflow:"hidden",textOverflow:"ellipsis"}}> {s.street} {s.houseno}</div>
                        <div className={styles.userinfoText} style={{whiteSpace:"nowrap", overflow:"hidden",textOverflow:"ellipsis"}}>{s.city} - {s.zipcode},</div>
                        <div className={styles.userinfoText} style={{whiteSpace:"nowrap", overflow:"hidden",textOverflow:"ellipsis"}}>{s.state} </div>
                        <div className={styles.userinfoText} style={{whiteSpace:"nowrap", overflow:"hidden",textOverflow:"ellipsis"}}>{s.country}</div>
                        <div className={styles.userinfoText} style={{whiteSpace:"nowrap", overflow:"hidden",textOverflow:"ellipsis"}}>{s.number}</div>
                        </div>
                        <div className={styles.adressTick}>
                        {s.isSelected? <TiTick style={{fontSize:"25",color:"black",fontWeight:"20"}}/> :null}   
                        </div> 
                    </div>
            </div>
            ))
            :
            <div style={{width:"100%",height:"40%",display:"flex",justifyContent:"center",textAlign:"center"}}>
            No Shipping History Found.
            </div>
            }      
            </div>
            </div> */}

            <div className={styles.columnitem1content1} >

                {shippingAddress!=null&&shippingAddress.length>0?
                <div className={styles.addressContainer} >

                   <b> Primary Address </b>
                    {shippingAddress.map((s,i)=>(
                        s.isSelected?
                            <div className={styles.columnFirstName} style={{marginBottom:"20px",width:"100%"}} >
                            <div className={styles.boxAddress} onClick={e=>setAddress(s)} style={{maxWidth:"100%"}}>
                                <div className={styles.addressInformation}  >
                                    <div className={styles.userinfoText} style={{whiteSpace:"nowrap", overflow:"hidden",textOverflow:"ellipsis"}}> {s.firstname} {s.lastname}</div>
                                    <div className={styles.userinfoText} style={{whiteSpace:"nowrap", overflow:"hidden",textOverflow:"ellipsis"}}> {s.street} {s.houseno}</div>
                                    <div className={styles.userinfoText} style={{whiteSpace:"nowrap", overflow:"hidden",textOverflow:"ellipsis"}}>{s.city} - {s.zipcode},</div>
                                    <div className={styles.userinfoText} style={{whiteSpace:"nowrap", overflow:"hidden",textOverflow:"ellipsis"}}>{s.state} </div>
                                    <div className={styles.userinfoText} style={{whiteSpace:"nowrap", overflow:"hidden",textOverflow:"ellipsis"}}>{s.country}</div>
                                    <div className={styles.userinfoText} style={{whiteSpace:"nowrap", overflow:"hidden",textOverflow:"ellipsis"}}>{s.number}</div>
                                </div>
                                <div className={styles.adressTick}>
                                {/* <span className={styles.userinfoText2} style={{textDecoration:"underline"}}>Edit</span> */}
                                {s.isSelected? <TiTick style={{fontSize:"25",color:"black",fontWeight:"20"}}/> :null}   
                                </div> 
                            </div>
                    </div>
                            :
                            null
                    ))}
                    
                
                    {shippingAddress.map((s,i)=>(
                        
                        s.isSelected==false?
                            <div className={styles.columnFirstName} style={{marginBottom:"20px",width:"100%"}} >
                              <b>  Address {++sno} </b>
                            <div className={styles.boxAddress} onClick={e=>setAddress(s)} style={{maxWidth:"100%"}}>
                                <div className={styles.addressInformation}  >
                                    <div className={styles.userinfoText} style={{whiteSpace:"nowrap", overflow:"hidden",textOverflow:"ellipsis"}}> {s.firstname} {s.lastname}</div>
                                    <div className={styles.userinfoText} style={{whiteSpace:"nowrap", overflow:"hidden",textOverflow:"ellipsis"}}> {s.street} {s.houseno}</div>
                                    <div className={styles.userinfoText} style={{whiteSpace:"nowrap", overflow:"hidden",textOverflow:"ellipsis"}}>{s.city} - {s.zipcode},</div>
                                    <div className={styles.userinfoText} style={{whiteSpace:"nowrap", overflow:"hidden",textOverflow:"ellipsis"}}>{s.state} </div>
                                    <div className={styles.userinfoText} style={{whiteSpace:"nowrap", overflow:"hidden",textOverflow:"ellipsis"}}>{s.country}</div>
                                    <div className={styles.userinfoText} style={{whiteSpace:"nowrap", overflow:"hidden",textOverflow:"ellipsis"}}>{s.number}</div>
                                </div>
                                <div className={styles.adressTick}>
                                </div> 
                            </div>
                    </div>
                            :
                            null
                    ))}

                </div>
                
                :
                <div style={{width:"100%",height:"40%",display:"flex",justifyContent:"center",textAlign:"center"}}>
                    No Shipping History Found.
                </div>
                 }      
            </div>
          </div>  
          
          :

            <>
            <form onSubmit={e=>handleSubmit(e,defaultShiping.id)} onLoad={e=>
            {
                var input= document.getElementsByClassName('PhoneInputInput')[0];
                input.style.background="#fff"
                input.setAttribute('name','numberb')
                input.setAttribute('id','numberb')
            }}>
            <div className={styles.columnitem1content1} >
                <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='first'>First Name<span style={{color:'red'}}>*</span></label>
      
                        <input className={styles.firstInput} defaultValue={defaultShiping.firstname} onKeyPress={validate} name='firstb' required maxLength={20}/>
                        
                    </div>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='b'>Last Name<span style={{color:'red'}}>*</span></label>
                        <input className={styles.firstInput} name='lastb' onKeyPress={validate} defaultValue={defaultShiping.lastname} required maxLength={20}/>
                    </div>
                </div>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFullName}>
                        
                        <label className={styles.firstName}  htmlFor='street'>Street Name<span style={{color:'red'}}>*</span></label>

                        <input className={styles.firstInput} id="street" onKeyPress={e=>validateWhitespace(e,"street")} name='streetb' defaultValue={defaultShiping.street} required maxLength={200}/>
                    </div>
                </div>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFullName}>
                        <label className={styles.firstName} htmlFor='street'>House/Apartment Number<span style={{color:'red'}}>*</span></label>

                        <input className={styles.firstInput} id="house" onKeyPress={e=>validateWhitespace(e,"house")} name='flatnob'  defaultValue={defaultShiping.houseno} required maxLength={20}/>
                        
                    </div>
                </div>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='first'>City<span style={{color:'red'}}>*</span></label>

                        <input className={styles.firstInput} id="city" onKeyPress={e=>validateWhitespace(e,"city")} name='cityb' defaultValue={defaultShiping.city} required maxLength={30}/>
                        
                    </div>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='last'>State / Province<span style={{color:'red'}}>*</span></label>
                        <input className={styles.firstInput} id="state" onKeyPress={e=>validateWhitespace(e,"state")}  name='stateb' defaultValue={defaultShiping.state} required maxLength={30}/>
                    </div>
                </div>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='first'>Zip-code<span style={{color:'red'}}>*</span></label> 
                        <input className={styles.firstInput} name='pincodeb' onKeyPress={validatesPin} maxLength={6} defaultValue={defaultShiping.zipcode} required/>
                        {isAlertVisiblepin&&<span asp-validation-for="Code" class="text-danger col-sm-4">{pinerror} </span>}

                    </div>

                    <div className={styles.columnFirstName}>
                    <label className={styles.firstName} htmlFor='last'>Country<span style={{color:'red'}}>*</span></label>
                        {defaultShiping.zipcode? <select className={styles.firstInput} defaultValue={defaultShiping.country} onChange={changeHandler}>
                         {list.map(l=>{
                             return <option value={l.label}>{l.label}</option>
                         })}
                         </select>
                        : 
                        <select className={styles.firstInput} defaultValue={defaultShiping.country} onChange={changeHandler}>
                            {list.map(l=>{
                                return <option value={l.label}>{l.label}</option>
                            })}
                            </select>
                        // <input className={styles.firstInput} name='country' required/>}
                       }
                        {/* <label className={styles.firstName} htmlFor='last'>Country *</label>
                        <input className={styles.firstInput} name='countryb' defaultValue={defaultShiping.zipcode}  required/> */}

                    </div>
                </div>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFullName}>
                        <label className={styles.firstName} htmlFor='street'>Phone Number<span style={{color:'red'}}>*</span></label>
                       
                        <PhoneInput
                            international
                            placeholder="phone number"
                            value={`${defaultShiping.number}`}
                            defaultCountry="IN"
                            className={styles.firstInput}
                            // style={{width:"70%",marginLeft:"15%"}}
                            limitMaxLength={15}
                            // Addition by Om Shrivastava on 19-11-23
                            // Reason : Need to add the onchange, when user change the contact number then now page is blank so I fixed issue
                            onChange={e=>{validatesNum(e)}}
                            // End of Addition by Om Shrivastava on 19-11-23
                            // Reason : Need to add the onchange, when user change the contact number then now page is blank so I fixed issue
                            />
                        {/* <input className={styles.firstInput} name='numberb' onKeyPress={validatesNum} maxlength={10} defaultValue={defaultShiping.number} required/> */}
                        {isAlertVisiblenum&&<span asp-validation-for="Code" class="text-danger col-sm-4">{numerror}</span>}

                    </div>
                </div>

                <div style={{display:"flex",flexWrap:"wrap",gap:"20px",marginLeft:'1%'}}>
                    <button style={{width:'48%'}} className={styles.userInfoButton} type='submit'>
                    UPDATE SHiPPING
                    </button>
                {/* <button className={styles.userInfoButton} style={{marginLeft:"10px"}} onClick={e=>shippingDelete(e,defaultShiping.id)}>
                    DELETE 
                </button> */}
                <span style={{width:'48%'}} className={styles.userInfoButton} onClick={e=>{
                    setshipEditCond(true)
                    window.scrollTo(0,0)
                    }}>
                    CANCEL
                </span>
                </div>
                </form>
            </>
            }
                
                
            </div>
          </div>
        </div>
        
    </div>

    <div className={style.foot}>

    <Footer/>

    </div>

    </div>
  )
}

export default ShippingProfile