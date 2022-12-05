import React, { useEffect, useState } from 'react'
import { InvoiveGetApi, TransactionGetApi } from '../../api/service'
import Footer from '../global/footer'
import Navbar from '../global/NavHeader'
import style from "./profile.module.css"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { getOptionsFromChildren } from '@mui/base'
import { Link, useNavigate } from 'react-router-dom'
import { CartState } from '../../context'

const MyOrders = () => {
  var {setshipEditCond,showEditable,setShowEditable,currency}=CartState()
     var [orders,setOrder]=useState([])
     var [tran,settran]=useState([])
     var [name,setName]=useState([])
     const nav=useNavigate()

     useEffect(() => {
      orderget()
      tranget()
     }, [])
     

   async function orderget(){
    var access=localStorage.getItem('access_token')
        await InvoiveGetApi({access}).then(r=>
            {
                var filtered=[];
                r.filter(data=>{
                    if(!filtered[`${data.order_no}`])
                     filtered[`${data.order_no}`]=[data]
                    else
                      filtered[`${data.order_no}`].push(data) 
                })
               
                orders=filtered;
                setOrder(orders.reverse());
            })


    }

    async function tranget(){
        var access=localStorage.getItem('access_token')
            await TransactionGetApi({access}).then(r=>
                
                {
                 settran(r.response.reverse())
                 setName(r.name)
                })
        }


        function getPrice(orde){
            var t=0;
            orde.map(o=>
                t+=o.price*o.quantity)

            return t;    
        }


  return (
    <>
    <Navbar/>
    <div className={style.Container} >
        <div className={style.centerContainer}>
          <div className={style.containerHeader}><Link to="/"  className={style.containerHeader}>Homepage</Link> / My Account</div>
          <div className={style.main}>
            <div className={style.column1}>
              <div className={style.column1header}>MY ACCOUNT</div>
              <hr style={{color:"black"}}></hr>
              <div className={style.column1text} onClick={e=>setShowEditable(!true)}><Link to="/userprofile" style={{textDecoration:"none",color:"#8c8c8c"}}>MY PROFILE</Link></div>
              <div className={style.column1text} onClick={e=>setshipEditCond(true)}><Link to="/shippindprofile" style={{textDecoration:"none",color:"#8c8c8c"}} >MY SHIPPING DETAILS</Link></div>
              <div className={style.column1text}><Link to="/profile" style={{textDecoration:"none",color:"#8c8c8c"}}>MY ORDERS</Link></div>

            </div>
            <div className={style.column2}>
            <div className={style.column2header}>MY ORDERS</div>
            <hr style={{color:"black"}}></hr>

            {orders&&orders.length>0&&tran!=null&&tran.length>0? <div className={style.table}>
                <div className={style.tablerowheadtable}>
                  <div className={style.rowheadText}>Order ID</div>
                  <br style={{color:"blue"}}></br>
                  <div className={`${style.rowheadText} ${style.rowtexthide}`}>Date and time</div>

                  <div className={`${style.rowheadText} ${style.rowtexthide}`}>Name</div>
                  <div className={`${style.rowheadText} ${style.rowtexthide}`}>Price</div>
                  <div className={`${style.rowheadText} ${style.rowtexthide}`}>Payment Type</div>
                  <div className={`${style.rowheadText} ${style.rowtexthide}`}>Status</div>
                  <div className={`${style.rowheadText} ${style.rowtexthide}`}></div>
                </div>
                <hr style={{color:"black"}}></hr>

                
               { orders.map((o,i)=>
                  <div className={style.tablerowheadtable}>
                    <div className={style.rowText}>{o[0].order_no}</div>
                    <div className={`${style.rowText} ${style.rowtexthide}`}>{o[0].date}</div>
                    
                    <div className={`${style.rowText} ${style.rowtexthide}`}>{tran[i].firstname} {tran[i].lastname}</div>
                    <div className={`${style.rowText} ${style.rowtexthide}`}>{o[0].selected_currency_sign}{(getPrice(o)*o[0].selected_currency_value).toFixed(2)}</div>
                    <div className={`${style.rowText} ${style.rowtexthide}`}>{o[0].payment_mode}</div>
                    <div className={`${style.rowText} ${style.rowtexthide}`}>{tran[i].payment_status}</div>
                    <div className={style.rowText} style={{textDecoration:"underline",color:"blue",fontSize:"14px",cursor:"pointer",whiteSpace:"nowrap",overflow:"hidden",width:"80px",marginRight:"10px"}} onClick={e=>nav(`/insideorder/${o[0].order_no}`)}>View Order
                    </div>
                    
                  </div>)}
                  
                
             </div>:
             <div style={{width:"100%",height:"40%",display:"flex",justifyContent:"center",textAlign:"center"}}>
               No History Found, <Link to="\" style={{fontSize:"14px",textDecoration:"underline",marginTop:"5px",marginLeft:"5px"}}>Continue Shopping</Link> 
             </div>
               }
            </div>
          </div>
        </div>
      
    </div>
    <Footer/>
    </>
  )
}

export default MyOrders