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

const ShippingProfile = () => {

    const [shippingAddress,setShippingAddress]=useState([])
    const {defaultShiping,setDefaultShipping}=CartState()
    const [cond,setCond]=useState([])

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
        setCond(!cond)
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
            country:data.get('countryb'),
            number:data.get('numberb')
        }
        var access=localStorage.getItem('access_token')
       await ShippingUpdateApi({access,billingData}).then(r=>{
        //if any response come this update shipping detail and re call shipping api to update new list
            if(r)
             {
                setCond(!cond)
                shippingDetails()
             }
       })
    }

    async function shippingDelete(e,id){
        e.preventDefault();
        var access=localStorage.getItem('access_token')
        await ShippingDeleteApi({access,id}).then(r=>
            {
                console.log(r)
                shippingDetails()
                setCond(!cond)
            }
            )
        }

  return (
    <>
    <Navbar/>
    <div className={style.Container} style={{marginBottom:"26vh"}}>
        <div className={style.centerContainer}>
          <div className={style.containerHeader}>Homepage / My Account</div>
          <div className={style.main}>
            <div className={style.column1}>
              <div className={style.column1header} >MY ACCOUNT</div>
              <hr style={{color:"black"}}></hr>
              <div className={style.column1text}><Link to="/userprofile" style={{textDecoration:"none",color:"#8c8c8c"}}>MY PROFILE</Link></div>
              <div className={style.column1text}><Link to="/shippindprofile" style={{textDecoration:"none",color:"#8c8c8c"}}>MY SHIPPING DETAILS</Link></div>
              <div className={style.column1text}><Link to="/profile" style={{textDecoration:"none",color:"#8c8c8c"}}>MY ORDERS</Link></div>

            </div>
            <div className={style.column2}>
            <div className={style.column2header} ><div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}><span>SHIPPING DETAILS</span><span className={styles.userinfoText} onClick={e=>jumpToEdit()}>Edit Configuration</span></div></div>
            <hr style={{color:"black"}}></hr>

            

            {cond?<div className={styles.columnitem1_1} style={{marginTop:"20px"}}>
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
            null
                 }      
                </div>
          </div>  
          
          
          :

            <>
            <form onSubmit={e=>handleSubmit(e,defaultShiping.id)}>
            <div className={styles.columnitem1content1} >
                <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='first'>FIRST NAME *</label>
      
                        <input className={styles.firstInput} defaultValue={defaultShiping.firstname} name='firstb' required/>
                        
                    </div>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='b'>LAST NAME *</label>
                        <input className={styles.firstInput} name='lastb' defaultValue={defaultShiping.lastname} required/>
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

                        <input className={styles.firstInput} name='flatnob' defaultValue={defaultShiping.houseno} required/>
                        
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
                        <input className={styles.firstInput} name='pincodeb' defaultValue={defaultShiping.zipcode} required/>
                    </div>
                    <div className={styles.columnFirstName}>
                        <label className={styles.firstName} htmlFor='last'>Country *</label>
                        <input className={styles.firstInput} name='countryb'  defaultValue={defaultShiping.country} required/>
                    </div>
                </div>
                <div className={styles.columnitem1content1}>
                    <div className={styles.columnFullName}>
                        <label className={styles.firstName} htmlFor='street'>Phone Number *</label>
                       
                        <input className={styles.firstInput} name='numberb' defaultValue={defaultShiping.number} required/>
                    
                    </div>
                </div>

                <div><button className={styles.userInfoButton} type='submit'>
                    ADD SHiPPING
                </button>
                {/* <button className={styles.userInfoButton} style={{marginLeft:"10px"}} onClick={e=>shippingDelete(e,defaultShiping.id)}>
                    DELETE 
                </button> */}
                <span className={styles.userInfoButton} style={{marginLeft:"10px"}} onClick={setAddress}>
                    CANCLE
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