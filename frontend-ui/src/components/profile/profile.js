import React, { useEffect, useState } from 'react'
import { InvoiveGetApi, TransactionGetApi } from '../../api/service'
import Footer from '../global/footer'
import Navbar from '../global/NavHeader'
import style from "./profile.module.css"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { getOptionsFromChildren } from '@mui/base'
import { Link, useNavigate } from 'react-router-dom'

const MyOrders = () => {
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
                console.log(r)
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
                
                {console.log(r)
                 settran(r.response.reverse())
                 setName(r.name)
                })
        }

        useEffect(()=>{
          console.log(orders)
          console.log(tran)
        },[tran,orders])


        function getPrice(orde){
            var t=0;
            orde.map(o=>
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
            <div className={style.column2header}>MY ORDERS</div>
            <hr style={{color:"black"}}></hr>

             <div className={style.table}>
                <div className={style.tablerowhead}>
                  <div className={style.rowheadText}>Order ID</div>
                  <br style={{color:"blue"}}></br>
                  <div className={style.rowheadText}>Date and time</div>

                  <div className={style.rowheadText}>Author</div>
                  <div className={style.rowheadText}>Value</div>
                  <div className={style.rowheadText}>Type</div>
                  <div className={style.rowheadText}>Status</div>
                  <div className={style.rowheadText}></div>
                </div>
                <hr style={{color:"black"}}></hr>

                {orders&&orders.length>0&&tran!=null&&tran.length>0?

                orders.map((o,i)=>
                  <div className={style.tablerowhead}>
                    <div className={style.rowText}>{o[0].order_no}</div>
                    <div className={style.rowText}>{o[0].date}</div>
                    <div className={style.rowText}>{name}</div>
                    <div className={style.rowText}>{getPrice(o)}</div>
                    <div className={style.rowText}>{o[0].payment_mode}</div>
                    <div className={style.rowText}>{tran[i].payment_status}</div>
                    <div className={style.rowText} onClick={e=>nav(`/insideorder/${o[0].order_no}`)}>...
                    </div>
                    
                  </div>)
                
              :
              null
                }
                
             </div>
            </div>
          </div>
        </div>
      
    </div>
    <Footer/>
    </>
  )
}

export default MyOrders