import React,{useState} from 'react'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './filter.css'
import { useNavigate} from 'react-router-dom';
import { FaFilter } from 'react-icons/fa';
import { CartState } from '../../context';

const Filter = () => {

  const{product,setCondition,setProduct,setcheck,checked1,checked2}= CartState()
  

  


  return (
    <div style={{justifyContent:"centre",margin:"auto 0"}} >
    <Popup trigger={<button style={{border:"white"}} ><span style={{width:"30px",height:"30px",fontSize:"1.2rem",fontWeight:"400",letterSpacing:"1.5px",background:"aliceblue"}}>Filter by</span></button>} 
     position="left center">
     <div className="grid-container">

<div className="box">

  {/* <div class="item">
    <div class="checkbox-rect">
      <input type="checkbox" id="checkbox-rect1" name="check"/>
      <label for="checkbox-rect1"></label>
    </div>
  </div> */}

  <div className="item">
    <div className="checkbox-rect2">
      <input type="checkbox" value="1" checked={checked1} id="checkbox-rect2" name="check" onChange={e=>setcheck(e)}/>
      <label className="lab" htmlFor="checkbox-rect2">Low To High</label>
    </div>
  </div>

  <div className="item">
    <div className="checkbox-rect2">
      <input type="checkbox" value="2" checked={checked2} id="checkbox-rect" name="check" onChange={e=>setcheck(e)}/>
      <label className="lab" htmlFor="checkbox-rect">High To Low</label>
    </div>
  </div>

  {/* <div class="item">
    <div class="checkbox-circle">
      <input type="checkbox" id="checkbox-circle1" name="check"/>
      <label for="checkbox-circle1">Check one</label>
    </div>
  </div> */}

  {/* <div class="item">
    <div class="checkbox-circle2">
      <input type="checkbox" id="checkbox-circle2" name="check"/>
      <label for="checkbox-circle2">Check one</label>
    </div>
  </div> */}

</div>



</div>
    </Popup>
  </div>
  )
}

export default Filter