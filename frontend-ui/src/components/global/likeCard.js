import React from 'react'

import PropTypes from 'prop-types'

// import styles from './likeCard.module.css'
import { useGetLikedProductQuery, useLikedUpdateMutation } from '../../Redux-manage/services/userAuthapi'
import { CartState } from '../../context'
import { getToken } from '../../Redux-manage/services/localStorageService'
import config from '../../api/config'
import styles from './cartCard.module.css'
import{TiDeleteOutline} from 'react-icons/ti'
import { useNavigate } from 'react-router-dom'


const LikeCard = (props) => {

 const {like,setLike}=CartState()
 let{access_token}=getToken()
 const [saveLikeApi,{isLoading}]=useLikedUpdateMutation()

 
 const LikedSave=async(product)=>{
  
  const data={
    item:product.id,
    size:product.size

  }
  
  const resp=await saveLikeApi({data,access_token});

  if(like.filter(l=>l.id===product.id).length>0){
    var p=like.filter(i=>i.id!=product.id);
    setLike([...p])
   }else{
     setLike([...like,product])
   }
  }  

  const nav=useNavigate()
  function openDetail(id){
    nav(`/listing/${id.category}/detail/${id.id}`)
    window.location.reload(false)
  }

  return (
     <>
     {like.length>0?
    like.map((l)=>(
     <>
     <div style={{width:"100%",height:"300px",marginBottom:"20px", display:"flex"}}>
       <img src={config.apiBaseURL+l.img_main} style={{width:"250px",height:"100%",}} onClick={e=>openDetail(l)}></img>
      <div style={{width:"60%",display:"flex",flexDirection:"column"}}>
             <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}> <h3 className={styles.heading} style={{color:"black"}}>{l.title}</h3><TiDeleteOutline className={styles.delete} style={{width:"32px",height:"32px"}} onClick={e=>LikedSave(l)}></TiDeleteOutline></div>
 
               
              
 
              
           <div style={{display:"flex",flexDirection:"column",height:"80%",paddingTop:"30px",justifyContent:"space-between"}}>
           <div style={{color:"black",marginLeft:"20px",marginTop:"10px"}}>
               <span className={styles.size}>Code-37cgbh</span>
               <span className={styles.showSize}> {l.size}</span>  
               </div>
          
           <div style={{color:"black",marginLeft:"20px",marginTop:"10px"}} className={styles.price}> ₹ {l.price}</div>
           </div>
 
        </div>
     </div>
     </>
    )):<div style={{fontSize:"20px",color:"#7c7c7c",height:"100%",display:"flex",justifyContent:"center"}}><span>Your Whishlist Is Empty</span></div>}
    </>
  )
}

LikeCard.defaultProps = {
  image_src: 'https://play.teleporthq.io/static/svg/default-img.svg',
  image_alt: 'image',
  heading: 'Heading',
  text: 'Text',
  heading1: 'Heading',
  button: 'Button',
}

LikeCard.propTypes = {
  image_src: PropTypes.string,
  image_alt: PropTypes.string,
  heading: PropTypes.string,
  text: PropTypes.string,
  heading1: PropTypes.string,
  button: PropTypes.string,
}

export default LikeCard