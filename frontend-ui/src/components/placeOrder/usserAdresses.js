import React, { useState, useMemo, useEffect, useRef } from 'react'
import styles from './order.module.css'
import { TiTick } from 'react-icons/ti'
import { IoIosCheckmarkCircle } from 'react-icons/io'
import { IoMdCheckmark } from 'react-icons/io'
import style from '../global/cartCard.module.css'
import Checkbox from "react-custom-checkbox";
import * as Icon from "react-icons/fi";
import { CartState } from '../../context';
import { Typography } from '@mui/material';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { ShippingGetApi, billingcheckApi, shpingcheckApi } from '../../api/service';
import { getToken } from '../../Redux-manage/services/localStorageService';
import { Modal, notification } from 'antd';
import Select from 'react-select'
import countryList from 'react-select-country-list'
import list from './data.json'
import { shippingTickGet } from '../../api/orderApis';



const UsserAdresses = () => {

    const { userdata, checkoutDetails, setCheckoutDetails, paymentflow, setPaymentflow } = CartState()
    const [cond, setCond] = useState(true)
    const [billingInfo, setBillingInfo] = useState(false)
    const { access_token } = getToken()
    const [error, setError] = useState({})
    const [checkFlow, setCheckFlow] = useState(false)

    var [isAlertVisiblepin, setIsAlertVisiblepin] = React.useState(false);
    var [isAlertVisiblenum, setIsAlertVisiblenum] = React.useState(false);
    var [numerror, setnumerror] = useState("")
    var [pinerror, setpinerror] = useState("")

    const [value, setValue] = useState("India")
    const [value2, setValue2] = useState("India")
    const [required, setRequired] = useState({})


    const options = countryList().getData()

    /**
     * Added by - Ashish Dewangan on 03-12-2023
     * Reason - To set default shipping address
     */
    const [selectedShippingAddress,setSelectedShippingAddress]=useState({})

    useEffect(()=>{
        fillDefaultShippingAddress()
    },[])

    const fillDefaultShippingAddress = async ()=>{
        var access=localStorage.getItem('access_token')
        const response = await ShippingGetApi({access})
       
        if(response && response?.length>0){
           setSelectedShippingAddress( response.filter(s=>s.isSelected==true)[0])
        }
    }
    /**
     * End of code addition by - Ashish Dewangan on 03-12-2023
     * Reason - To set default shipping address
     */


    const changeHandler = value => {
        setValue(value.target.value)
    }
    const changeHandler2 = value => {
        setValue2(value.target.value)
    }

    const handleButtonClickpin = (msg) => {
        isAlertVisiblepin = true
        setIsAlertVisiblepin(true);
        pinerror = msg
        setpinerror(pinerror)
        setTimeout(() => {
            isAlertVisiblepin = false
            setIsAlertVisiblepin(false);

        }, 7000);
    }

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



    //Commented by Rohan kansari - 18/12/22
    //Reason-Showing field required validation same as requirement.
    function RequiredValidate(e) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        var action = true;
        // firstname:data.get('first'),
        //     lastname:data.get('last'),
        //     street:data.get('street'),
        //     houseno:data.get('flatno'),
        //     city:data.get('city'),
        //     state:data.get('state'),
        //     zipcode:data.get('pincode'),
        //     country:value,
        //     number:data.get('number')

        if (data.get('first').length == 0) {
            setRequired({ "first": "This field is required." })
            document.getElementById('first').focus()
            // document.getElementById('first').scrollTop(-100)
            action = false
        }
        else if (data.get('last').length == 0) {
            setRequired({ "last": "This field is required." })
            document.getElementById('last').focus()
            // document.getElementById('first').scrollTop(0)
            action = false

        }
        else if (data.get('street').length == 0) {
            setRequired({ 'street': "This field is required." })
            document.getElementById('street').focus()
            // document.getElementById('first').scrollTop(0)
            action = false

        }
        else if (data.get('flatno').length == 0) {
            setRequired({ 'flatno': "This field is required." })
            document.getElementById('flatno').focus()
            // document.getElementById('first').scrollTop(0)
            action = false

        }
        else if (data.get('city').length == 0) {
            setRequired({ 'city': "This field is required." })
            document.getElementById('city').focus()
            // document.getElementById('first').scrollTop(0)
            action = false

        }
        else if (data.get('state').length == 0) {
            setRequired({ 'state': "this field is required." })
            document.getElementById('state').focus()
            // document.getElementById('first').scrollTop(0)
            action = false

        }
        else if (data.get('pincode').length == 0) {
            setRequired({ 'pincode': "This field is required." })
            document.getElementById('pincode').focus()
            // document.getElementById('pincode').scrollTop(0)
            action = false

        }
        else if (data.get('number').length == 0) {
            setRequired({ "number": "This field is required." })
            document.getElementById('number').focus()
            // document.getElementById('number').scrollTop(0)
            action = false
        }

        if (billingInfo) {
            if (data.get('firstb').length == 0) {
                setRequired({ "firstb": "This field is required." })
                document.getElementById('firstb').focus()
                // document.getElementById('first').scrollTop(-100)
                action = false
            }
            else if (data.get('lastb').length == 0) {
                setRequired({ "lastb": "This field is required." })
                document.getElementById('lastb').focus()
                // document.getElementById('first').scrollTop(0)
                action = false

            }
            else if (data.get('streetb').length == 0) {
                setRequired({ 'streetb': "This field is required." })
                document.getElementById('streetb').focus()
                // document.getElementById('first').scrollTop(0)
                action = false

            }
            else if (data.get('flatnob').length == 0) {
                setRequired({ 'flatnob': "This field is required." })
                document.getElementById('flatnob').focus()
                // document.getElementById('first').scrollTop(0)
                action = false

            }
            else if (data.get('cityb').length == 0) {
                setRequired({ 'cityb': "This field is required." })
                document.getElementById('cityb').focus()
                // document.getElementById('first').scrollTop(0)
                action = false

            }
            else if (data.get('stateb').length == 0) {
                setRequired({ 'stateb': "this field is required." })
                document.getElementById('stateb').focus()
                // document.getElementById('first').scrollTop(0)
                action = false

            }
            else if (data.get('pincodeb').length == 0) {
                setRequired({ 'pincodeb': "This field is required." })
                document.getElementById('pincodeb').focus()
                // document.getElementById('pincode').scrollTop(0)
                action = false

            }
            else if (data.get('numberb')?.length == 0) {
                setRequired({ "numberb": "This field is required." })
                document.getElementById('numberb').focus()
                // document.getElementById('number').scrollTop(0)
                action = false
            }
        }


        if (action == true) {
            handleSubmit(e)
        }

    }

    const handleSubmit = async (e) => {
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

        if (data.get('pincode').length < 6) {
            var dta = " Minimum 6 digit required"
            handleButtonClickpin(dta)
        }
        else {
            isAlertVisiblepin = false
        }
        if (data.get('number').split(" ").join("").length < 11) {
            var dta = " Minimum 8 digit required"
            handleButtonClicknum(dta)
        }
        else {
            isAlertVisiblenum = false
        }

        if (billingInfo) {
            if (data.get('pincodeb').length < 6) {
                var dta = " Minimum 6 digit required"
                handleButtonClickpin(dta)
            }
            else {
                isAlertVisiblepin = false
            }
            if (data.get('numberb').split(" ").join("").length < 11) {
                var dta = " Minimum 8 digit required"
                handleButtonClicknum(dta)
            }
            else {
                isAlertVisiblenum = false
            }
        }


        const shippingData = {
            firstname: data.get('first'),
            lastname: data.get('last'),
            street: data.get('street'),
            houseno: data.get('flatno'),
            city: data.get('city'),
            state: data.get('state'),
            zipcode: data.get('pincode'),
            country: value,
            number: data.get('number')
        }


        var billingData;
        if (!billingInfo) {
            billingData = shippingData;
        }
        else {
            billingData = {
                firstname: data.get('firstb'),
                lastname: data.get('lastb'),
                street: data.get('streetb'),
                houseno: data.get('flatnob'),
                city: data.get('cityb'),
                state: data.get('stateb'),
                zipcode: data.get('pincodeb'),
                country: value2,
                number: data.get('numberb')
            }
        }

        if (!isAlertVisiblenum && !isAlertVisiblepin) {
            checkoutDetails['shippingData'] = shippingData;
            checkoutDetails['billingData'] = billingData;
            setCheckoutDetails(checkoutDetails)

            await shpingcheckApi(shippingData, access_token).then(e => {
                checkoutDetails['shipping_id'] = e.shipping_id;
                setCheckoutDetails(checkoutDetails)
                setCond(false)
                setPaymentflow(true)
            })


            await billingcheckApi(billingData, access_token).then(e => {
                checkoutDetails['billing_id'] = e.billing_id;
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
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    }

    function validatesPin(evt) {
        var theEvent = evt || window.event;

        // Handle paste
        if (theEvent.type === 'paste') {
            alert("slkls")
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
            var data = "Please enter only digits"
            handleButtonClickpin(data)
        }

        evt.target.value = evt.target.value.replace(/[^\d]/g,'');
        return false;

    }


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


    function validateWhitespace(evt, id) {
        var theEvent = evt || window.event;
        var key = 0
        // Handle paste
        if (theEvent.type === 'paste') {
            key = evt.clipboardData.getData('text/plain');
        } else {
            // Handle key press
            key = theEvent.keyCode || theEvent.which;
            key = String.fromCharCode(key);
        }


        var regex = /\s/
        if (document.getElementById(`${id}`).value.trim().length > 0 || !regex.test(key)) {

        } else {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    }

    useEffect(()=>{
        if(billingInfo){
        var input= document.getElementsByClassName('PhoneInputInput')[1];
        input.style.background="#fff"
        input.setAttribute('name','numberb')
        input.setAttribute('id','numberb')}
    },[billingInfo])


    return (
        <>
            {cond ?
                <div className={styles.columnitem2} style={{ marginTop: "20px" }} onLoad={e=>{
                   var input= document.getElementsByClassName('PhoneInputInput')[0];
                   input.style.background="#fff"
                   input.setAttribute('name','number')
                   input.setAttribute('id','number')
                   
                
                }}>
                    <div className={styles.columnitem1head}>2. SHIPPING INFO</div>
                    <form onSubmit={RequiredValidate} autocomplete="off">
                        <div className={styles.columnitem1content1}>
                            <div className={styles.columnFirstName}>
                                <label className={styles.firstName} htmlFor='first'>First Name<span style={{color:'red'}}>*</span></label>
                                {checkoutDetails.shippingData ?
                                    <>
                                        <input className={styles.firstInput} name='first' autocomplete="nope" id="first" maxLength={19} onKeyPress={validate} onChange={e=>setRequired({})} defaultValue={checkoutDetails.shippingData.firstname} />
                                        {required.first ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}
                                    </>
                                    :
                                    <>
                                        <input className={styles.firstInput} maxLength={19} autocomplete="nope" name='first' id="first" onKeyPress={validate} onChange={e=>setRequired({})} defaultValue={selectedShippingAddress.firstname}/>
                                        {required.first ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}

                                        {/* {error.efirst?<Typography style={{color:"red",fontSize:"13px"}}>This Field is required</Typography>:null} */}
                                    </>
                                }
                            </div>
                            <div className={styles.columnFirstName}>
                                <label className={styles.firstName} htmlFor='b'>Last Name<span style={{color:'red'}}>*</span></label>
                                {checkoutDetails.shippingData ?
                                    <>
                                        <input className={styles.firstInput} name='last' autocomplete="nope" id='last' maxLength={19} onKeyPress={validate} onChange={e=>setRequired({})} defaultValue={checkoutDetails.shippingData.lastname} />
                                        {required.last ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}
                                    </>
                                    :
                                    <>
                                        <input className={styles.firstInput} name='last' autocomplete="nope" id='last' maxLength={19} onChange={e=>setRequired({})} onKeyPress={validate} defaultValue={selectedShippingAddress.lastname} />
                                        {required.last ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}
                                    </>
                                }
                            </div>
                        </div>
                        <div className={styles.columnitem1content1}>
                            <div className={styles.columnFullName}>

                                <label className={styles.firstName} htmlFor='street'>Street Name<span style={{color:'red'}}>*</span></label>
                                {checkoutDetails.shippingData ?
                                    <>
                                        <input className={styles.firstInput} id="street" autocomplete="nope" maxLength={180} onKeyPress={e => validateWhitespace(e, "street")} onChange={e=>setRequired({})} name='street' defaultValue={checkoutDetails.shippingData.street} />
                                        {required.street ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}

                                    </>
                                    :
                                    <>
                                        <input className={styles.firstInput} id="street" autocomplete="nope" maxLength={180} onKeyPress={e => validateWhitespace(e, "street")} onChange={e=>setRequired({})} name='street' defaultValue={selectedShippingAddress.street}/>
                                        {required.street ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}
                                    </>}
                            </div>
                        </div>
                        <div className={styles.columnitem1content1}>
                            <div className={styles.columnFullName}>
                                <label className={styles.firstName} htmlFor='street'>House/Apartment Number<span style={{color:'red'}}>*</span></label>
                                {checkoutDetails.shippingData ?
                                    <>
                                        <input className={styles.firstInput} id="flatno" autocomplete="nope" name='flatno' onKeyPress={e => validateWhitespace(e, "flatno")} onChange={e=>setRequired({})} maxLength={10} defaultValue={checkoutDetails.shippingData.houseno} />
                                        {required.flatno ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}
                                    </>
                                    :
                                    <>
                                        <input className={styles.firstInput} id="flatno" autocomplete="nope" onKeyPress={e => validateWhitespace(e, "flatno")} onChange={e=>setRequired({})} name='flatno' maxLength={10} defaultValue={selectedShippingAddress.houseno}/>
                                        {required.flatno ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}
                                    </>
                                }
                            </div>
                        </div>
                        <div className={styles.columnitem1content1}>
                            <div className={styles.columnFirstName}>
                                <label className={styles.firstName} htmlFor='first'>City<span style={{color:'red'}}>*</span></label>
                                {checkoutDetails.shippingData ?
                                    <>
                                        <input className={styles.firstInput} id="city" maxLength={29} autocomplete="nope" onKeyPress={e => validateWhitespace(e, "city")} onChange={e=>setRequired({})} name='city' defaultValue={checkoutDetails.shippingData.city} />
                                        {required.city ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}
                                    </>
                                    :
                                    <>
                                        <input className={styles.firstInput} id="city" maxLength={29} autocomplete="nope" onKeyPress={e => validateWhitespace(e, "city")} onChange={e=>setRequired({})} name='city' defaultValue={selectedShippingAddress.city}/>
                                        {required.city ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}
                                    </>
                                }
                            </div>
                            <div className={styles.columnFirstName}>
                                <label className={styles.firstName} htmlFor='last'>State / Province<span style={{color:'red'}}>*</span></label>
                                {checkoutDetails.shippingData ?
                                    <>
                                        <input className={styles.firstInput} id="state" maxLength={29} autocomplete="nope" onKeyPress={e => validateWhitespace(e, "state")} onChange={e=>setRequired({})} name='state' defaultValue={checkoutDetails.shippingData.state} />
                                        {required.state ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}
                                    </>
                                    :
                                    <>
                                        <input className={styles.firstInput} id="state" maxLength={29} autocomplete="nope" onKeyPress={e => validateWhitespace(e, "state")} onChange={e=>setRequired({})} name='state' defaultValue={selectedShippingAddress.state}/>
                                        {required.state ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}

                                    </>
                                }
                            </div>
                        </div>
                        <div className={styles.columnitem1content1}>
                            <div className={styles.columnFirstName}>
                                <label className={styles.firstName} htmlFor='first'>Zip-Code<span style={{color:'red'}}>*</span></label>
                                {checkoutDetails.shippingData ?
                                    <> <input className={styles.firstInput} name='pincode' id='pincode' autocomplete="nope" onKeyPress={validatesPin} onKeyUp={validatesPin} onChange={e=>setRequired({})} maxLength={6} defaultValue={checkoutDetails.shippingData.zipcode} />
                                        {required.pincode ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}
                                        {isAlertVisiblepin && <span asp-validation-for="Code" class="text-danger col-sm-4" style={{fontSize:"14px"}}>{pinerror} </span>}
                                    </>
                                    :
                                    <>
                                        <input className={styles.firstInput} name='pincode' id='pincode' autocomplete="nope" onKeyPress={validatesPin} onKeyUp={validatesPin} onChange={e=>setRequired({})} maxLength={6} defaultValue={selectedShippingAddress.zipcode}/>
                                        {required.pincode ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}
                                        {isAlertVisiblepin && <span asp-validation-for="Code" class="text-danger col-sm-4" style={{fontSize:"14px"}}>{pinerror}</span>}
                                    </>
                                }
                            </div>
                            <div className={styles.columnFirstName}>
                                <label className={styles.firstName} htmlFor='last'>Country<span style={{color:'red'}}>*</span></label>
                                {checkoutDetails.shippingData ?
                                    <select className={styles.countrypicker} autocomplete="nope" defaultValue={value} onChange={changeHandler}>
                                        {list.map(l => {
                                            return <option value={l.label}>{l.label}</option>
                                        })}
                                    </select>
                                    :
                                    <select className={styles.countrypicker} autocomplete="nope" defaultValue={value} onChange={changeHandler}>
                                        {list.map(l => {
                                            return <option value={l.label}>{l.label}</option>
                                        })}
                                    </select>
                                    // <input className={styles.firstInput} name='country' required/>}
                                }
                            </div>
                        </div>
                        <div className={styles.columnitem1content1}>
                            <div className={styles.columnFullName}>
                                <label className={styles.firstName} htmlFor='street'>Phone Number<span style={{color:'red'}}>*</span></label>
                                {checkoutDetails.shippingData ?
                                    <>
                                    <PhoneInput
                                        international
                                        placeholder="Phone number"
                                        value={`${checkoutDetails.shippingData.number}`}
                                        defaultCountry="IN"
                                        className={styles.firstInput}
                                        // style={{width:"70%",marginLeft:"15%"}}
                                        onChange={e=>{validatesNum(e)}} 
                                        limitMaxLength={15}
                                        
                                        />
                                        {/* <input className={styles.firstInput} name='number' id='number' onKeyPress={validatesNum} maxlength={10} defaultValue={checkoutDetails.shippingData.number} /> */}
                                        {isAlertVisiblenum && <span asp-validation-for="Code" class="text-danger col-sm-4" style={{fontSize:"14px"}}>{numerror}</span>}
                                        {required.number ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}
                                    </>
                                    :
                                    <>
                                    <PhoneInput
                                        international
                                        placeholder="phone number"
                                        value={selectedShippingAddress.number}
                                        defaultCountry="IN"
                                        className={styles.firstInput}
                                        // style={{width:"70%",marginLeft:"15%"}}
                                        onChange={e=>{validatesNum(e)}} 
                                        limitMaxLength={15}
                                        
                                        />
                                        {/* <input className={styles.firstInput} name='number' id='number' onKeyPress={validatesNum} maxLength={10} /> */}
                                        {isAlertVisiblenum && <span asp-validation-for="Code" class="text-danger col-sm-4" style={{fontSize:"14px"}}>{numerror}</span>}
                                        {required.number ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}
                                    </>
                                }
                            </div>
                        </div>


                        <div className={styles.columnitem1content1} style={{margin:"15px 0"}}>
                            <Checkbox
                                icon={<Icon.FiCheck color="white" size={16} style={{ background: "#57b957" }} />}
                                name="my-input"
                                checked={!billingInfo}
                                onChange={(value, event) => {
                                    // console.log(billingInfo)
                                    setBillingInfo(!value)
                                    setRequired(false)
                                }}
                                borderColor="#000"
                                style={{ cursor: "pointer", width: "17px", marginLeft: "10px" }}
                                labelStyle={{ marginLeft: 5, userSelect: "none" }}
                                label={<label className={styles.firstName} htmlFor='street'>Billing Address Is Same As Shipping Address</label>}
                            />

                        </div>


                        {/* billing info form */}

                        {billingInfo ?
                            <>
                                <div className={styles.columnitem1content1}>
                                    <div className={styles.columnFirstName}>
                                        <label className={styles.firstName} htmlFor='first'>First Name<span style={{color:'red'}}>*</span></label>
                                        {checkoutDetails.billingData ?
                                            <>
                                                <input className={styles.firstInput} autocomplete="nope" name='firstb' id="firstb" maxLength={19} onKeyPress={validate} defaultValue={checkoutDetails.billingData.firstname} />
                                                {required.firstb ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}
                                            </>
                                            :
                                            <>
                                                <input className={styles.firstInput} autocomplete="nope" name='firstb' id="firstb" maxLength={19} onKeyPress={validate} />
                                                {required.firstb ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}
                                            </>
                                        }
                                    </div>
                                    <div className={styles.columnFirstName}>
                                        <label className={styles.firstName} htmlFor='b'>Last Name<span style={{color:'red'}}>*</span></label>
                                        {checkoutDetails.billingData ?
                                            <>
                                                <input className={styles.firstInput} autocomplete="nope" name='lastb' id="firstb" maxLength={19} onKeyPress={validate} defaultValue={checkoutDetails.billingData.lastname} />
                                                {required.lastb ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}
  
                                            </>
                                            :
                                            <>
                                                <input className={styles.firstInput} autoComplete='off' name='lastb' id="firstb" maxLength={19} onKeyPress={validate} />
                                                {required.lastb ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}
                                            </>}
                                    </div>
                                </div>
                                <div className={styles.columnitem1content1}>
                                    <div className={styles.columnFullName}>

                                        <label className={styles.firstName} htmlFor='street'>Street Name<span style={{color:'red'}}>*</span></label>
                                        {checkoutDetails.billingData ?
                                            <>
                                                <input className={styles.firstInput} autocomplete="nope" name='streetb' maxLength={180} id="streetb" onKeyPress={e => validateWhitespace(e, "streetb")} defaultValue={checkoutDetails.billingData.street} />
                                                {required.streetb ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}
                                            </>
                                            :
                                            <>
                                                <input className={styles.firstInput} autocomplete="nope" name='streetb' maxLength={180} id="streetb" onKeyPress={e => validateWhitespace(e, "streetb")} />
                                                {required.streetb ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}
                                            </>}
                                    </div>
                                </div>
                                <div className={styles.columnitem1content1}>
                                    <div className={styles.columnFullName}>
                                        <label className={styles.firstName} htmlFor='street'>House/Apartment Number<span style={{color:'red'}}>*</span></label>
                                        {checkoutDetails.billingData ?
                                            <>
                                                <input className={styles.firstInput} autocomplete='nope' name='flatnob' maxLength={19} id="flatb" onKeyPress={e => validateWhitespace(e, "flatb")} defaultValue={checkoutDetails.billingData.houseno} />
                                                {required.flatnob ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}
                                            </>
                                            :
                                            <>
                                                <input className={styles.firstInput} autocomplete="nope" name='flatnob' maxLength={19} id="flatb" onKeyPress={e => validateWhitespace(e, "flatb")} />
                                                {required.flatnob ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}
                                            </>
                                        }
                                    </div>
                                </div>
                                <div className={styles.columnitem1content1}>
                                    <div className={styles.columnFirstName}>
                                        <label className={styles.firstName} htmlFor='first'>City<span style={{color:'red'}}>*</span></label>
                                        {checkoutDetails.billingData ?

                                            <>
                                                <input className={styles.firstInput} autocomplete="nope" name='cityb' maxLength={19} id="cityb" onKeyPress={e => validateWhitespace(e, "cityb")} defaultValue={checkoutDetails.billingData.city} />
                                                {required.cityb ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}
                                            </>
                                            :
                                            <>
                                                <input className={styles.firstInput} autocomplete="nope" name='cityb' maxLength={19} id="cityb" onKeyPress={e => validateWhitespace(e, "cityb")} />
                                                {required.cityb ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}

                                            </>
                                        }
                                    </div>
                                    <div className={styles.columnFirstName}>
                                        <label className={styles.firstName} htmlFor='last'>State / Province</label>
                                        {checkoutDetails.billingData ?
                                            <>
                                                <input className={styles.firstInput} autocomplete="nope" name='stateb' maxLength={29} id="stateb" onKeyPress={e => validateWhitespace(e, "stateb")} defaultValue={checkoutDetails.billingData.state} />
                                                {required.stateb ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}

                                            </>
                                            :
                                            <>
                                                <input className={styles.firstInput} autocomplete="nope" name='stateb' maxLength={29} id="stateb" onKeyPress={e => validateWhitespace(e, "stateb")} />
                                                {required.stateb ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}
                                            </>
                                        }
                                    </div>
                                </div>
                                <div className={styles.columnitem1content1}>
                                    <div className={styles.columnFirstName}>
                                        <label className={styles.firstName} htmlFor='first'>Zip-Code<span style={{color:'red'}}>*</span></label>
                                        {checkoutDetails.billingData ?
                                            <>
                                                <input className={styles.firstInput} autocomplete="nope" name='pincodeb' id="pincodeb" onKeyPress={validatesPin} maxLength={6} defaultValue={checkoutDetails.billingData.zipcode} />
                                                {isAlertVisiblepin && <span asp-validation-for="Code" class="text-danger col-sm-4" style={{fontSize:"14px"}}>{pinerror} </span>}
                                                {required.pincodeb ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}

                                            </>
                                            :
                                            <>
                                                <input className={styles.firstInput} autocomplete="nope" name='pincodeb' id="pincodeb" onKeyPress={validatesPin} maxLength={6} />
                                                {isAlertVisiblepin && <span asp-validation-for="Code" class="text-danger col-sm-4" style={{fontSize:"14px"}}>{pinerror} </span>}
                                                {required.pincodeb ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}

                                            </>}
                                    </div>
                                    <div className={styles.columnFirstName}>
                                        <label className={styles.firstName} htmlFor='last'>Country<span style={{color:'red'}}>*</span></label>
                                        {checkoutDetails.billingData ?
                                            <select className={styles.countrypicker} defaultValue={value2} onChange={changeHandler2}>
                                                {list.map(l => {
                                                    return <option value={l.label}>{l.label}</option>
                                                })}
                                            </select>
                                            :
                                            <select className={styles.countrypicker} defaultValue={value2} onChange={changeHandler2}>
                                                {list.map(l => {
                                                    return <option value={l.label}>{l.label}</option>
                                                })}
                                            </select>
                                        }
                                    </div>
                                </div>
                                <div className={styles.columnitem1content1}>
                                    <div className={styles.columnFullName}>
                                        <label className={styles.firstName} htmlFor='street'>Phone Number<span style={{color:'red'}}>*</span></label>
                                        {checkoutDetails.billingData ?
                                            <>
                                            <PhoneInput
                                        international
                                        placeholder="phone number"
                                        value={`${checkoutDetails.billingData.number}`}
                                        defaultCountry="IN"
                                        className={styles.firstInput}
                                        // style={{width:"70%",marginLeft:"15%"}}
                                        onChange={e=>{validatesNum(e)}} 
                                        limitMaxLength={15}
                                        
                                        />
                                                {/* <input className={styles.firstInput} name='numberb' id="numberb" onKeyPress={validatesNum} maxlength={10} defaultValue={checkoutDetails.billingData.number} /> */}
                                                {isAlertVisiblenum && <span asp-validation-for="Code" class="text-danger col-sm-4" style={{fontSize:"14px"}}>{numerror}</span>}
                                                {required.numberb ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}
                                            </>
                                            :
                                            <>
                                               <PhoneInput
                                        international
                                        placeholder="phone number"
                                        value={`+91`}
                                        defaultCountry="IN"
                                        className={styles.firstInput}
                                        // style={{width:"70%",marginLeft:"15%"}}
                                        onChange={e=>{validatesNum(e)}} 
                                        limitMaxLength={15}
                                        
                                        />
                                                {/* <input className={styles.firstInput} name='numberb' id="numberb" onKeyPress={validatesNum} maxlength={10} /> */}
                                                {isAlertVisiblenum && <span asp-validation-for="Code" class="text-danger col-sm-4" style={{fontSize:"14px"}}>{numerror}</span>}
                                                {required.numberb ? <Typography style={{ color: "red", fontSize: "13px" }}>This field is required</Typography> : null}
                                            </>
                                        }
                                    </div>
                                </div>
                            </>
                            : null}

                        <button className={styles.shopbtn2} style={{margin:"15px 5px",width:"300px",minHeight:"50px"}} type='submit'>
                            PROCEED TO PAYMENT
                        </button>
                    </form>
                </div>

                :
                <div className={styles.columnitem1_1} style={{ marginTop: "20px" }}>
                    <div 
                    // Modification and addition by Om Shrivastava on 30-11-23
                    // Reason : Set the width and height 
                    // className={styles.columnitem1head}
                    className={`${styles.columnitem1head} ${styles.setWidth}`}
                    // End of Modification and addition by Om Shrivastava on 30-11-23
                    // Reason : Set the width and height  
                    >

                        <span>2. SHIPPING INFO
                            <IoIosCheckmarkCircle style={{
                                fontSize: "37px", color: "#57b957", backgroundColor: "transparent"
                                , marginLeft: "15px", position: "relative", bottom: "5px"
                            }} />
                        </span>
                        <span className={styles.change}
                            onClick={e => setCond(true)}>Edit</span>
                    </div>

                    <div className={styles.columnitem1head} style={{marginTop:"0px",marginBottom:"0px"}}>
                        <span className={styles.ship}> SHIPPING ADDRESS
                            {/* <IoIosCheckmarkCircle style={{fontSize:"37px",color:"black",background:"white",marginLeft:"15px",position:"relative",bottom:"5px"}}/>     */}
                        </span>
                        <span style={{ alignSelf: "flex-end", fontSize: "13px", lineHeight: "20px", letterSpacing: "1px" }}></span>
                    </div>
                    <div className={styles.columnitem1content1}>
                        <div className={styles.columnFirstName}>
                            <div className={styles.boxAddress}>
                                <div className={styles.addressInformation}>
                                    <div ><span className={styles.userinfoText3}>{checkoutDetails.shippingData.firstname} {checkoutDetails.shippingData.lastname}</span></div>
                                    <div ><span className={styles.userinfoText3}>{checkoutDetails.shippingData.street} </span><span className={styles.userinfoText2}>{checkoutDetails.shippingData.houseno},</span></div>
                                    <div ><span className={styles.userinfoText3}>{checkoutDetails.shippingData.city} - </span><span className={styles.userinfoText2}>{checkoutDetails.shippingData.zipcode},</span></div>
                                    <div ><span className={styles.userinfoText3}>{checkoutDetails.shippingData.state} </span></div>
                                    <div ><span className={styles.userinfoText3}>{checkoutDetails.shippingData.country} </span></div>
                                    <div ><span className={styles.userinfoText3}>{checkoutDetails.shippingData.number} </span></div>
                                </div>
                                <div className={styles.adressTick}>
                                    <IoMdCheckmark style={{ fontSize: "25", color:"#323232", fontWeight: "20", backgroundColor: "transparent", border: "none" }} />

                                </div>
                            </div>
                        </div>

                    </div>
                    <div className={styles.columnitem1head} style={{marginTop:"5px",marginBottom:"5px"}}>
                        <span className={styles.ship}> BILLING ADDRESS
                            {/* <IoIosCheckmarkCircle style={{fontSize:"37px",color:"black",background:"white",marginLeft:"15px",position:"relative",bottom:"5px"}}/>     */}
                        </span>
                        <span style={{ alignSelf: "flex-end", fontSize: "13px", lineHeight: "20px", letterSpacing: "1px" }}></span>
                    </div>
                    <div className={styles.columnitem1content1}>
                        <div className={styles.columnFirstName}>
                            <div className={styles.boxAddress}>
                                <div className={styles.addressInformation}>
                                    <div ><span className={styles.userinfoText3}>{checkoutDetails.billingData.firstname} {checkoutDetails.billingData.lastname}</span></div>
                                    <div ><span className={styles.userinfoText3}>{checkoutDetails.billingData.street} </span><span className={styles.userinfoText2}>{checkoutDetails.billingData.houseno},</span></div>
                                    <div ><span className={styles.userinfoText3}>{checkoutDetails.billingData.city} - </span><span className={styles.userinfoText2}>{checkoutDetails.billingData.zipcode},</span></div>
                                    <div ><span className={styles.userinfoText3}>{checkoutDetails.billingData.state} </span></div>
                                    <div ><span className={styles.userinfoText3}>{checkoutDetails.billingData.country} </span></div>
                                    <div ><span className={styles.userinfoText3}>{checkoutDetails.billingData.number} </span></div>
                                </div>
                                <div className={styles.adressTick}>
                                    <IoMdCheckmark style={{ fontSize: "25", color:"#323232", fontWeight: "20",backgroundColor: "transparent", border: "none" }} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            }
        </>)
}

export default UsserAdresses