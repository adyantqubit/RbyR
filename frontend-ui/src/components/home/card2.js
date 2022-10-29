import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import config from '../../api/config';
import { getCardHomeImagesApi } from '../../api/service';
const CArd2 = () => {
  const [iamges,setIamges]=useState({})
  useEffect(()=>{

    images()
  },[])


async function images(){
  await getCardHomeImagesApi().then(r=>setIamges(r.response))

}
  return (
    <div style={{width:"100%",marginTop:"40px",padding:"0 100px"}}>
      {iamges?
    <ul style={{width:"100%",display:"flex",flexDirection:"row",justifyContent:"space-around"}}>
      <li style={{width:"33%",borderRadius:"10px",display:"flex",justifyContent:"center"}}>
        <div style={{width:"auto",borderRadius:"10px"}}>
          <div style={{width:"auto",height:"auto",borderRadius:"10px"}}>
          <div style={{position:"relative",top:"490px",left:"0px",right:"80px",width:"100%",background:"rgba(0,0,0,0.7)",fontSize:"2rem",color:"white",letterSpacing:"2px",fontFamily:"Rawson-regular",fontWeight:"400",textAlign:"center"}}>{iamges.category_top3}</div>

          <a href={`listing/${iamges.category_top3}`}>
            <img alt="" style={{width:"400px",height:"500px",borderRadius:"10px"}} src={config.apiBaseURL+iamges.img_top3} />
            </a>
            </div>          
        </div>
      </li>
      <li style={{width:"33%",borderRadius:"10px",display:"flex",justifyContent:"center"}}>
        <div style={{width:"100%",borderRadius:"10px"}}>
          <div style={{width:"100%",height:"auto",borderRadius:"10px"}}>
          <div style={{position:"relative",top:"490px",left:"0px",right:"80px",width:"100%",background:"rgba(0,0,0,0.7)",fontSize:"2rem",color:"white",letterSpacing:"2px",fontFamily:"Rawson-regular",fontWeight:"400",textAlign:"center"}}>{iamges.category_top4}</div>

          <a href={`listing/${iamges.category_top4}`}>
          <img alt="" style={{width:"400px",height:"500px",borderRadius:"10px"}} src={config.apiBaseURL+iamges.img_top4} />
            </a>
            </div>          
        </div>
      </li>
      
    </ul>:null}
  </div>
  )
}

export default CArd2