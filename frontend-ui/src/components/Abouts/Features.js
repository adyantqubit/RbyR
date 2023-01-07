import React, { useState, useCallback, useRef, useEffect } from 'react'
import Navbar from '../global/NavHeader'
import style from "./Features.module.css"
import "./open.css"

import ImageViewer from 'react-simple-image-viewer';
import { WorldOfRR } from '../../api/orderApis'
import config from '../../api/config'

const Features = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [images,setImages] = useState([])


    const openImageViewer = useCallback((index) => {
        setCurrentImage(index);
        setIsViewerOpen(true);
    }, []);

    const closeImageViewer = () => {
        setCurrentImage(0);
        setIsViewerOpen(false);
    };


    const [response,setResponse]=useState(null)
    
    useEffect(()=>{
     GetWorldOfRRContent()
    },[])

    async function GetWorldOfRRContent(){
        await WorldOfRR().then(r=>setResponse(r.feature))
    }

    useEffect(()=>{
        if(response!=null){
        var arr=[]
         response.map(m=>{
           var i=config.apiBaseURL+m.magzine_img
           arr.push(i)
         })
   
         setImages(arr)
       }
       },[response])

    
    return (<>
        <Navbar />
        <div className={style.Container}>
            <div className={style.contains} >
                <div className={style.headerText}>FEATURE</div>
                <div className={style.imageContainer} >

                 {response?.map((i,index)=>
                 <img src={config.apiBaseURL+i.magzine_img} className={style.img} onClick={()=>{openImageViewer(index)}}/>
                 )}
                 
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

            </div>
        </div>

    </>
    )
}

export default Features