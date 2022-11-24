import React from 'react'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Navigate, useNavigate } from 'react-router-dom';
import config from '../../api/config';
import { CartState } from '../../context';

import style from '../listing/listpage.module.css'

const Slider = () => {
   const {CategoryProduct,con,setcon}= CartState()
    const responsive = {
        superLargeDesktop: {
          // the naming can be any, depends on you.
          breakpoint: { max: 4000, min: 3000 },
          items: 5
        },
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 3
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1
        }
      };

      const nav=useNavigate()
      function openDetail(id){
        nav(`/listing/${id.category}/detail/${id.id}`)
        setcon(false)
        // window.location.reload(false)
         
         
      //  <Navigate to={`/listing/${id.category}/detail/${id.id}`}/> 
      }

      return(<Carousel responsive={responsive} style={{width:"100%"}}>
       {JSON.parse(localStorage.getItem("recentview"))&&JSON.parse(localStorage.getItem("recentview")).length>0?JSON.parse(localStorage.getItem("recentview")).map((cart,i)=>
        {if (i!=0)
      return(
      <div className={style.card}>
        <div className={style.image} style={{position:"relative"}}>
          {/* <a href={"/listing/"+cart.category}> */}
            <img className={style.img} src={config.apiBaseURL+cart.img_main} style={{width:"350px"}} onClick={e=>openDetail(cart)} />
            {/* </a> */}
          {/* {like.filter(l=>l.id===p.id).length>0?<AiFillHeart style={{position:"relative",marginTop:"-60px",left:"90%",height:"20px",width:"20px"}} onClick={e=>LikedSave(p)}/>:<AiOutlineHeart style={{position:"relative",marginTop:"-60px",left:"90%",height:"20px",width:"20px"}} onClick={e=>LikedSave(p)}/>} */}
        </div>
        
        <div>
      <span>{cart.title}</span>
      </div>

</div>) }):null}

        <div>.</div>

        
      </Carousel>)
      
}

export default Slider