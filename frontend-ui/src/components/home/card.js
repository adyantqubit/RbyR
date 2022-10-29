import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import config from '../../api/config';
import { getCardHomeImagesApi } from '../../api/service';
import ImageChageComponent2, { ImageSwapper } from './AutoChange';
import AutoCard from './AutoChange';
import ImageSwapper2 from './AutoChange2';

const Card = () => {

  const [iamges,setIamges]=useState({})
  useEffect(()=>{

    images()
  },[])

  useEffect(()=>{

    console.log(iamges)
  },[iamges])

async function images(){
  await getCardHomeImagesApi().then(r=>setIamges(r.response))

}
  return (
   
      <div style={{width:"100%",marginTop:"150px",padding:"0 100px"}}>
        {iamges?
    <ul style={{width:"100%",display:"flex",flexDirection:"row",justifyContent:"space-around"}}>
    <li style={{width:"33%",borderRadius:"10px",display:"flex",justifyContent:"center"}}>
        <div style={{width:"auto",borderRadius:"10px"}}>
          <div style={{width:"auto",height:"auto",borderRadius:"10px"}}>
          <div style={{position:"relative",top:"490px",left:"0px",right:"80px",width:"100%",background:"rgba(0,0,0,0.7)",fontSize:"2rem",color:"white",letterSpacing:"2px",fontFamily:"Rawson-regular",fontWeight:"400",textAlign:"center"}}>{iamges.category_top1}</div>
          <a href={`listing/${iamges.category_top1}`}>
          <ImageSwapper/>
            </a>
            </div>          
        </div>
      </li>
      <li style={{width:"33%",borderRadius:"10px",display:"flex",justifyContent:"center"}}>
        <div style={{width:"auto",borderRadius:"10px"}}>
          <div style={{width:"auto",height:"auto",borderRadius:"10px"}}>
          <div style={{position:"relative",top:"490px",left:"0px",right:"80px",width:"100%",background:"rgba(0,0,0,0.7)",fontSize:"2rem",color:"white",letterSpacing:"2px",fontFamily:"Rawson-regular",fontWeight:"400",textAlign:"center"}}>{iamges.category_top2}</div>

          <a href={`listing/${iamges.category_top2}`}>
             <ImageSwapper2/>
            </a>
            </div>          
        </div>
      </li>
      
    </ul>:null}
  </div>
  )

}


export default Card;