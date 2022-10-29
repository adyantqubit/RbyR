import React,{useState,useEffect} from "react";
import ReactDOM from "react-dom";

import config from '../../api/config';
import { getCardHomeImagesApi } from '../../api/service';



export  function ImageSwapper() {
  const [iamges,setIamges]=useState()
    const [currentImage, setCurrentImage] = useState(null);

    useEffect(()=>{
      images()
    },[])
  
    useEffect(()=>{
      const intervalId = setInterval(() => {
        setCurrentImage(iamges[Math.floor(Math.random() * 2)]);
        
    }, 1000)
    
    return () => clearInterval(intervalId);
    },[iamges])
  
    async function images(){
      await getCardHomeImagesApi().then(r=>setIamges([r.response.img_top1,r.response.img_top1_1]))
    }


  

    return (
      <div>

        <img style={{width:"400px",height:"500px",borderRadius:"10px"}} src={config.apiBaseURL+currentImage} />

      </div>
        
    )
}

export default ImageSwapper