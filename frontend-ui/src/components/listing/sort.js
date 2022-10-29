import React, { useEffect, useState } from 'react'
import { CartState } from '../../context'
import style from './listpage.module.css'
import RangeSlider from './rangeslider';
import MultiRangeSlider from './rangeslider';

const Sort = () => {
    const {htl,sethtl,lth,setLth,sortui,setSortUi,CategoryProduct,setCategoryProduct,tempallpro,settemAllpro,tempsprice,setTempsprice}=CartState()
  


 function closeSortPage(){
  setSortUi(false)
 }
 
 useEffect(()=>{
  if(!tempsprice.length>0)
  {
    setTempsprice([...tempallpro])
  }

 }
 ,[])


//color filter change start

 function toggleselect(e){


  var filtered=CategoryProduct.sort((a,b)=>a.price-b.price)
  setCategoryProduct([...filtered])
  console.log(filtered)
  console.log(tempsprice)
  sethtl(false)
 }

 function deleteclass(e){

  setCategoryProduct([...tempsprice])

  }

  


  function toggleselect2(e){

    var filtered=CategoryProduct.sort((a,b)=>b.price-a.price)
    setCategoryProduct([...filtered])
    console.log(filtered)
    console.log(tempsprice)
    setLth(false)
   }
  
   function deleteclass2(e){
  
    setCategoryProduct([...tempsprice])
  
    }




  return (
    <div className={style.containsSort} >

{/* header part */}
<div className={style.filterContain}>
   <div className={style.filterInner}>
      <div className={style.filterheader}>
        <div className={style.filterHeaderInner} >
          <span className={style.headtitle1}>SORT BY</span>
          <span>
            {/* <span className={style.headtitle2}>clear All</span> */}
            <span className={style.text} style={{marginLeft:"15px",color:"#8c8c8c",fontWeight:"600"}} onClick={closeSortPage}>Close</span>
            {/* <span style={{marginLeft:"15px",height:"50px",fontSize:"20px",cursor:"pointer"}} onClick={closeSortPage}>x</span> */}
          </span>
        </div>  
      </div>

   <div style={{width:"100%",height:"0.01rem",background:"grey"}}></div>  
  </div>
</div>
{/* header part end */}

<div className={style.filterbottomMain} >
    <div className={style.filterbottomMainInner} style={{height:"25vh",top:"8vh"}}>

    <div className={style.filterbottomMainInnerItem} style={{width:"100%"}}>
       
      
        <div className={style.iteminner}> 
            <div className={style.textdiv} style={{width:"12%"}}>
             <span className={style.text}>category</span>
            </div>
            <div className={style.textdiv} style={{width:"12%"}}>
             <span className={style.text}>category</span>
            </div>
            {lth?<div className={`${style.textdiv} ${style.value}`} style={{width:"15%",display:"flex",justifyContent:"space-between"}}>
             <span className={style.text} onClick={e=>{setLth(false);deleteclass(e)}} style={{color:'black'}}>PRICE: LOW TO HIGH</span>
             <span onClick={e=>{setLth(false);deleteclass(e)}} className={style.cross}>✔</span>
            </div>:<div className={style.textdiv} style={{width:"15%"}}>
             <span className={style.text} onClick={e=>{setLth(true);toggleselect(e)}} >PRICE: LOW TO HIGH</span>
            </div>}
            
            {htl?<div className={`${style.textdiv} ${style.value}`} style={{width:"15%",display:"flex",justifyContent:"space-between"}}>
             <span className={style.text} onClick={e=>{sethtl(false);deleteclass2(e)}} style={{color:'black'}}>PRICE: HIGH TO LOW</span>
             <span onClick={e=>{sethtl(false);deleteclass2(e)}} className={style.cross}>✔</span>
            </div>:<div className={style.textdiv} style={{width:"15%"}}>
             <span className={style.text}  onClick={e=>{sethtl(true);toggleselect2(e)}} >PRICE: HIGH TO LOW</span>
            </div>}
           
        </div>
       
        
       
      </div>
             
    </div>
    </div>

</div>
  )
}

export default Sort