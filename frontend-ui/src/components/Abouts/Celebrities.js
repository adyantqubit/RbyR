import React, { useState, useCallback } from 'react'
import Navbar from '../global/NavHeader'
import style from "./celebrities.module.css"
import image from "./example.jpg"

import ImageViewer from 'react-simple-image-viewer';


const Celebrities = () => {

    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const images = [
        image,
        image, image, image, image,
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

            {images.map((i,index)=>
                 <div className={style.card}>
                 <div style={{ position: "relative" }}>
                     <img 
                     src={i} 
                     onClick={() => openImageViewer(index)}/>
                     {/* <div className={style.overlay}>
                         <div className={style.text}>
                             <button className={style.button}>SHOP NOW</button>
                         </div>
                     </div> */}
                 </div>
                 <div className={style.celeb}>DEEPIKA PADUKON</div>
                 <div className={style.product}>STARCHED METALLIC DRESSED</div>
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

    </>
    )
}

export default Celebrities