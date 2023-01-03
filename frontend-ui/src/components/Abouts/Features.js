import React, { useState, useCallback } from 'react'
import Navbar from '../global/NavHeader'
import style from "./Features.css"
import image from "./example.jpg"
import image1 from "./assets/fea1.jpg"
import image2 from "./assets/fea4.jpg"
import image3 from "./assets/fea5.jpg"
import image4 from "./assets/fea7.jpg"
import image5 from "./assets/fea9.jpg"


import ImageViewer from 'react-simple-image-viewer';


const Features = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const images = [
        image,
        image1, image2, image3, image4,image5
    ];

    const openImageViewer = useCallback((index) => {
        setCurrentImage(index);
        setIsViewerOpen(true);
    }, []);

    const closeImageViewer = () => {
        setCurrentImage(0);
        setIsViewerOpen(false);
    };

    return (<>
        <Navbar />
         <div className={style.Container}>
             <div className={style.contains}> 
              {images.map(i=>{
                return <img src={i} className="img"></img>
              })}
            </div>
        
            {/* <div class="img" style={{backgroundImage:`url(${image})`}}></div>
            <div class="img" style={{backgroundImage:`url(${image2})`}}></div>
            <div class="img" style={{backgroundImage:`url(${image3})`}}></div> */}
        </div>

    </>
    )
}

export default Features