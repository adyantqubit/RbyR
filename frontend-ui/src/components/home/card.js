import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import config from '../../api/config';
import { getCardHomeImagesApi } from '../../api/service';
import ImageChageComponent2, { ImageSwapper } from './AutoChange';
import AutoCard from './AutoChange';
import ImageSwapper2 from './AutoChange2';
import style from './card.module.css'

const Card = () => {

  const [iamges,setIamges]=useState({})
  useEffect(()=>{

    images()
  },[])

async function images(){
  await getCardHomeImagesApi().then(r=>setIamges(r.response))

}
  return (
   
      <div className={style.container}>
        {iamges?
    <ul className={style.main}>
    <li className={style.cardli}>
        <div style={{width:"auto",height:"auto",borderRadius:"10px"}}>
          <div className={style.text}>{iamges.category_top1}</div>
          <a href={`listing/${iamges.category_top1}`}>
          <ImageSwapper/>
          </a>
        </div>          
        
      </li>
      <li className={style.cardli}>
          <div style={{width:"auto",height:"auto",borderRadius:"10px"}}>
          <div className={style.text}>{iamges.category_top2}</div>

          <a href={`listing/${iamges.category_top2}`}>
             <ImageSwapper2/>
            </a>
            </div>          
      </li>
      
    </ul>:null}
  </div>
  )

}


export default Card;