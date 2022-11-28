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


import {AiOutlineClose} from 'react-icons/ai'

const ShippingProfile = () => {

    const [shippingAddress,setShippingAddress,]=useState([])
    const {defaultShiping,setDefaultShipping,shipEditcond,setshipEditCond,setShowEditable}=CartState()
    var [ isAlertVisiblepin, setIsAlertVisiblepin ] = React.useState(false);
var [ isAlertVisiblenum, setIsAlertVisiblenum ] = React.useState(false);
var [numerror,setnumerror]=useState("")
var [pinerror,setpinerror]=useState("")
const [value, setValue] = useState("India")
const [value2, setValue2] = useState("India")


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
      
    }

    function jumpToEdit(){
        setDefaultShipping(shippingAddress.filter(s=>s.isSelected==true)[0])
        setshipEditCond(!shipEditcond)
    }

   async function shipTick(id){
        await shippingTick(id).then(r=>setShippingAddress(r))
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


    if(!isAlertVisiblenum&&!isAlertVisiblepin){

        var access=localStorage.getItem('access_token')
       await ShippingUpdateApi({access,billingData}).then(r=>{
        //if any response come this update shipping detail and re call shipping api to update new list
            if(r)
             {
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
                console.log(r)
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
        
    
  return (
    <>
    <Navbar/>
    <div className={style.Container}>
        <div className={style.centerContainer}>
          <div className={style.containerHeader}><Link to="/"  className={style.containerHeader}>Homepage</Link>/ My Account</div>
          <div className={style.main}>
            <div className={style.column1}>
              <div className={style.column1header} >MY ACCOUNT</div>
              <hr style={{color:"black"}}></hr>
              <div className={style.column1text} onClick={e=>setShowEditable(!true)}><Link to="/userprofile" style={{textDecoration:"none",color:"#8c8c8c"}}>MY PROFILE</Link></div>
              <div className={style.column1text} onClick={e=>setshipEditCond(true)}><Link to="/shippindprofile" style={{textDecoration:"none",color:"#8c8c8c"}} >MY SHIPPING DETAILS</Link></div>
              <div className={style.column1text}><Link to="/profile" style={{textDecoration:"none",color:"#8c8c8c"}}>MY ORDERS</Link></div>

            </div>
            <div className={style.column2}>
            <div className={style.column2header} >
                <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                    <span>SHIPPING DETAILS</span>
                   
                    {shippingAddress!=null&&shippingAddress.length>0?
                     <span className={styles.userinfoText} onClick={e=>jumpToEdit()}>{shipEditcond?"Edit Configuration":null}
                    </span> :
                    null}
                </div>
            </div>
            <hr style={{color:"black"}}></hr>

            

            {shipEditcond?<div className={styles.columnitem1_1} style={{marginTop:"20px"}}>
            <div className={styles.columnitem1content1}>

                {shippingAddress!=null&&shippingAddress.length>0?

                shippingAddress.map((s,i)=>(
                    <div className={styles.columnFirstName} onClick={e=>setAddress(s)}>
                        {i+1}
                        <div className={styles.boxAddress}>
                           
                            <div className={styles.addressInformation}>
                            <div ><span className={styles.userinfoText}> {s.firstname} {s.lastname}</span></div>
                            <div ><span className={styles.userinfoText}>{s.street} </span><span className={styles.userinfoText2}>{s.houseno},</span></div>
                            <div ><span className={styles.userinfoText}>{s.city} - </span><span className={styles.userinfoText2}>{s.zipcode},</span></div>
                            <div ><span className={styles.userinfoText}>{s.state} </span></div>
                            <div ><span className={styles.userinfoText}>{s.country}</span></div>
                            <div ><span className={styles.userinfoText}>{s.number}</span></div>
                            </div>
                            <div className={styles.adressTick}>
                            {/* <span className={styles.userinfoText2} style={{textDecoration:"underline"}}>Edit</span> */}
                            {s.isSelected? <TiTick style={{fontSize:"25",color:"black",fontWeight:"20"}}/> :null}   
                            </div> 
                        </div>
                 </div>
                ))
                :
                <div style={{width:"100%",height:"40%",display:"flex",justifyContent:"center",textAlign:"center"}}>
                No Shipping History Found, 
              </div>
                 }      
                </div>
          </div>  
          
          
          :

            <>
            <form onSubmit={e=>handleSubmit(e,defaultShiping.id)}>
            <div className={styles.columnitem1content1} >
                <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='first'>FIRST NAME *</label>
      
                        <input className={styles.firstInput} defaultValue={defaultShiping.firstname} onKeyPress={validate} name='firstb' required/>
                        
                    </div>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='b'>LAST NAME *</label>
                        <input className={styles.firstInput} name='lastb' onKeyPress={validate} defaultValue={defaultShiping.lastname} required/>
                    </div>
                </div>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFullName}>
                        
                        <label className={styles.firstName} htmlFor='street'>Street name *</label>

                        <input className={styles.firstInput} name='streetb' defaultValue={defaultShiping.street} required/>
                    </div>
                </div>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFullName}>
                        <label className={styles.firstName} htmlFor='street'>House/Apartment number *</label>

                        <input className={styles.firstInput} name='flatnob' maxLength={10} defaultValue={defaultShiping.houseno} required/>
                        
                    </div>
                </div>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='first'>City *</label>

                        <input className={styles.firstInput} name='cityb' defaultValue={defaultShiping.city} required/>
                        
                    </div>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='last'>State / Province</label>
                        <input className={styles.firstInput} name='stateb' defaultValue={defaultShiping.state} required/>
                    </div>
                </div>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='first'>Zip-code *</label> 
                        <input className={styles.firstInput} name='pincodeb' onKeyPress={validatesPin} maxLength={6} defaultValue={defaultShiping.zipcode} required/>
                        {isAlertVisiblepin&&<span asp-validation-for="Code" class="text-danger col-sm-4">{pinerror} </span>}

                    </div>
                    <div className={styles.columnFirstName}>
                    <label className={styles.firstName} htmlFor='last'>Country *</label>
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
                        <label className={styles.firstName} htmlFor='street'>Phone Number *</label>
                       
                        <input className={styles.firstInput} name='numberb' onKeyPress={validatesNum} maxlength={10} defaultValue={defaultShiping.number} required/>
                        {isAlertVisiblenum&&<span asp-validation-for="Code" class="text-danger col-sm-4">{numerror}</span>}

                    </div>
                </div>

                <div><button className={styles.userInfoButton} type='submit'>
                    ADD SHiPPING
                </button>
                {/* <button className={styles.userInfoButton} style={{marginLeft:"10px"}} onClick={e=>shippingDelete(e,defaultShiping.id)}>
                    DELETE 
                </button> */}
                <span className={styles.userInfoButton} style={{marginLeft:"10px"}} onClick={e=>setshipEditCond(true)}>
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
    <Footer/>
    </>
  )
}

export default ShippingProfile