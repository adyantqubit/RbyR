import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { getCardHomeImagesApi } from '../../api/service';
import ImageChageComponent2 from './AutoChange';
import './card.css'

const Autocard = () => {

 


  return (
    <div style={{width:"100%",marginTop:"100px"}}>
    <ul style={{width:"100%",display:"flex",flexDirection:"row",justifyContent:"space-around"}}>
      <li style={{width:"30%",borderRadius:"10px"}}>
        <div style></div>
        <div style={{width:"100%",borderRadius:"10px"}}>
          <div style={{width:"100%",height:"auto",borderRadius:"10px"}}>
          <a href='/listing/special'>
            <ImageChageComponent2/>
            </a>
            </div>          
        </div>
      </li>
      <li style={{width:"30%",borderRadius:"10px"}}>
        <div style={{width:"100%",borderRadius:"10px"}}>
          <div style={{width:"100%",height:"auto",borderRadius:"10px"}}>
          <a href='/listing/special'>
          <ImageChageComponent2/>
            </a>
            </div>          
        </div>
      </li>
    </ul>
  </div>
  )}
  


export default Autocard;