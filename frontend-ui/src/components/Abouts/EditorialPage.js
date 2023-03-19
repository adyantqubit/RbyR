import React, { useState, useCallback, useEffect } from 'react'
import Navbar from '../global/NavHeader'
import style from "./Editorial.module.css"

import ImageViewer from 'react-simple-image-viewer';
import { WorldOfRR } from '../../api/orderApis';
import config from '../../api/config';
import { useNavigate } from 'react-router-dom';
import Footer from '../global/footer';
import Blank from './blank';


const Editorialpage = () => {

    // Showing image if no product is connected to image

    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
  
    var [images,setImages]=useState([])



    const openImageViewer = useCallback((index) => {
        setCurrentImage(index);
        setIsViewerOpen(true);
    }, []);

    const closeImageViewer = () => {
        setCurrentImage(0);
        setIsViewerOpen(false);
    };


    // End of image code

    const [response,setResponse]=useState(null)
    
    useEffect(()=>{
        GetWorldOfRRContent()
    },[])

    useEffect(()=>{
     if(response!=null){
     var arr=[]
      response.map(m=>{
        var i=config.staticBaseURL+m.TopImage1
        arr.push(i)
      })

      setImages(arr)
    }
    },[response])


    async function GetWorldOfRRContent(){
        await WorldOfRR().then(r=>setResponse(r.editorial))
    }

    const nav=useNavigate()
    function openDetail(id,parent,child){
        nav(`/listing/${parent}/${child}/detail/${id}`)
    }

    if(response!=null&&response.length>0){
    return (<>
        <Navbar />
        <div className={style.Container}>
            <div className={style.contains}>

            {response.map((i,index)=>
                 <div className={style.card}>
                 <div style={{ position: "relative" }}>
                     <img 
                     src={config.staticBaseURL +i.TopImage1} 
                     onClick={() => i.product?null:openImageViewer(index)}/>
                     {i.product?
                     <div className={style.overlay}>
                     <div className={style.text}>
                         <button className={style.button} 
                         onClick={()=>openDetail(i.product,i.menu,i.category)}>SHOP NOW</button>
                     </div>
                 </div>:null}
                 </div>
                 <div className={style.celeb}>{i.ModelName}</div>
                 <div className={style.product}>{i.MagzineName}</div>
             </div>)}
            </div>

            {isViewerOpen && (
                <ImageViewer
                    src={images}
                    currentIndex={currentImage}
                    disableScroll={false}
                    closeOnClickOutside={true}
                    onClose={closeImageViewer}
                />
            )}
        </div>

        <div className={style.foot}>
        <Footer/>
        </div>
    </>
    )
}
else{
    return <Blank/>
}
}

export default Editorialpage