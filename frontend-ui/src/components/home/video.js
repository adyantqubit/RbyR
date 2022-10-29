import React,{useState,useEffect} from 'react'
import { getCardHomeImagesApi } from '../../api/service';
const src = "https://www.youtube.com/embed/m_LfH48sTmY";

const Video = () => {
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
    <div style={{width:"100%",alignItems:"center",marginTop:"50px"}}>
      <div style={{margin:"0 150px",width:"100%",borderRadius:"20px",position:"relative",right:"0",left:"80px"}}> 
      {iamges?<iframe width="70%" height="450px" style={{borderRadius:"20px"}} src={iamges.video_url} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>:null}
      </div> 
    </div>
   
  )
}

export default Video;