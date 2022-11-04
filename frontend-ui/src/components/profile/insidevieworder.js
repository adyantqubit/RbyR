import { getTableSortLabelUtilityClass } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import config from '../../api/config'
import { InvoiveSingleGetApi } from '../../api/service'
import { CartState } from '../../context'
import Footer from '../global/footer'
import Navbar from '../global/NavHeader'
import style from "./profile.module.css"

const InsideOrder = () => {
   const{orders,setOrder,product}=CartState()
   var{orderid}=useParams()
   var [states,setState]=useState([])
   async function invoiceapi(){
    var access=localStorage.getItem('access_token')
     var data={
        order:orderid
     }
    await InvoiveSingleGetApi({access,data}).then(r=>
        {
            console.log(r)
            setState(r)
        })

   }
   useEffect(()=>{
      invoiceapi()
   },[])

   
   function getPrice(orde){
    var t=0;
    states.map(o=>
        t+=o.price*o.quantity)

    return t;    
}

  return (
    <>
    <Navbar/>
    <div className={style.Container} style={{marginBottom:"26vh"}}>
        <div className={style.centerContainer}>
          <div className={style.containerHeader}>Homepage / My Account</div>
          <div className={style.main}>
            <div className={style.column1}>
              <div className={style.column1header}>MY ACCOUNT</div>
              <hr style={{color:"black"}}></hr>
              <div className={style.column1text}><Link to="/userprofile" style={{textDecoration:"none",color:"#8c8c8c"}}>MY PROFILE</Link></div>
              <div className={style.column1text}><Link to="/shippindprofile" style={{textDecoration:"none",color:"#8c8c8c"}}>MY SHIPPING DETAILS</Link></div>
              <div className={style.column1text}><Link to="/profile" style={{textDecoration:"none",color:"#8c8c8c"}}>MY ORDERS</Link></div>


            </div>
            <div className={style.column2}>
            <div className={style.column2header}> MY ORDERS #{orderid}</div>
            <hr style={{color:"black"}}></hr>
            <div ><span className={style.userinfoText}>Date:</span><span className={style.userinfoText2}> {states!=null&&states.length>0?states[0].date:null}</span></div>

             <div className={style.table} style={{border:"1px solid white",marginTop:"20px"}}>
                  <div className={style.tablerowhead}>
                    <div className={style.rowitem1} style={{justifyContent:"start",color:"black"}}>Product Name</div>
                    <div className={style.rowitem2} style={{color:"black"}}>price</div>
                    <div className={style.rowitem2} style={{color:"black"}}>Qty</div>
                    <div className={style.rowitem2} style={{color:"black"}}>SubTotal</div>
                  </div>
                <hr style={{color:"black"}}></hr>


                    {states.map(s=>{
                        var p= product.filter(p=>p.id==s.product_id)[0]
                        
                    return <div className={style.tablerowhead} style={{marginTop:"10px"}}>
                    <div className={style.rowitem1}>
                        <img src={config.apiBaseURL+p.img_main} style={{width:"30%"}}>
                        </img>
                        <span style={{marginLeft:"10px",minHeight:"100%",width:"60%",display:"flex",flexDirection:"column",justifyContent:"center"}}>
                        {p.title} ({s.size})
                        </span>
                    </div>
                    <div className={style.rowitem2}>{p.price}</div>
                    <div className={style.rowitem2}>{s.quantity}</div>
                    <div className={style.rowitem2}>{p.price*s.quantity}</div>

                </div>
                    }
                        )}
                  


                <div className={style.totalBox} >
                   <div className={style.box} style={{borderTop:"1px solid black"}}>
                     <div className={style.textlight1}><span className={style.userinfoText} style={{width:"50%"}}>sub total</span><span  className={style.userinfoText2} style={{width:"50%"}}>{getPrice()}</span></div>
                     <div className={style.textlight1}><span  className={style.userinfoText} style={{width:"50%"}}>Shipping</span><span  className={style.userinfoText2} style={{width:"50%"}}>0</span></div>
                     <div className={style.textlight1}><span  className={style.userinfoText} style={{width:"50%"}}>Tax</span><span  className={style.userinfoText2} style={{width:"50%"}}>0</span></div>
                     <hr style={{color:"black"}}></hr>
                     <div className={style.textlight1}><span style={{fontWeight:"600",width:"50%"}}>Total</span><span style={{fontWeight:"600",width:"50%"}}>{getPrice()}</span></div>
                   </div>
                </div>
                  

{/*                 
                  <div className={style.tablerowhead}>
                    <div className={style.rowText}>Order ID</div>
                    <div className={style.rowText}>Order ID</div>
                    <div className={style.rowText}>Order ID</div>
                    <div className={style.rowText}>Order ID</div>
                    <div className={style.rowText}>Order ID</div>
                    <div className={style.rowText}>Order ID</div>
                    <div className={style.rowText}></div>
                    
                  </div> */}
             </div>
            </div>
          </div>
        </div>
      
    </div>
    <Footer/>
    </>
  
  )
}

export default InsideOrder