import React,{useState,useEffect} from 'react'
import { getCardHomeImagesApi } from '../../api/service';
import style from './card.module.css'
const src = "https://www.youtube.com/embed/m_LfH48sTmY";

const Video = () => {
  const [iamges,setIamges]=useState({})
  useEffect(()=>{

    images()
  },[])


async function images(){
  await getCardHomeImagesApi().then(r=>setIamges(r.response))

}
  return (
     <>
     <div style={{width:"100%",display:"flex",justifyContent:"center"}}>
      {iamges?<iframe className={style.video} src={iamges.video_url}></iframe>:null}
     </div>
  </>
  )
}

export default Video;