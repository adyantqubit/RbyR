import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import config from '../../api/config';
import { getCardHomeImagesApi } from '../../api/service';
import style from './card.module.css'

const CArd2 = () => {
  const [iamges,setIamges]=useState({})
  useEffect(()=>{

    images()
  },[])


async function images(){
  await getCardHomeImagesApi().then(r=>setIamges(r.response))

}
  return (
    <div className={style.container} style={{marginTop:"0"}}>
    {iamges?
    <ul className={style.main}>
    <li className={style.cardli}>
    <div style={{width:"auto",height:"auto",borderRadius:"10px"}}>
      <div className={style.text}>{iamges.category_top3}</div>
      <a href={`listing/${iamges.category_top3}`}>
      <div>
        <img alt="" className={style.imgswap} src={config.apiBaseURL+iamges.img_top3} />
       </div>
      </a>
    </div>          
    
    </li>
    <li className={style.cardli}>
    <div style={{width:"auto",borderRadius:"10px"}}>
      <div style={{width:"auto",height:"auto",borderRadius:"10px"}}>
      <div className={style.text}>{iamges.category_top4}</div>
    
      <a href={`listing/${iamges.category_top4}`}>
          <div>
            <img alt="" className={style.imgswap} src={config.apiBaseURL+iamges.img_top4} />
          </div>
        </a>
        </div>          
    </div>
    </li>
    
    </ul>:null}
    </div>
  )
}

export default CArd2

