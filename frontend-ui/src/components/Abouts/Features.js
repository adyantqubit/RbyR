import React, { useState, useCallback, useRef, useEffect } from 'react'
import Navbar from '../global/NavHeader'
import style from "./Features.module.css"
import image from "./assets/example.jpg"
import image1 from "./assets/f1.jpg"
import image2 from "./assets/f2.jpg"
import image3 from "./assets/f3.jpg"
import image4 from "./assets/f4.jpg"
import image5 from "./assets/f5.jpg"
import image6 from "./assets/f6.jpg"
import image7 from "./assets/f7.jpg"
import image9 from "./assets/fea9.jpg"
import image10 from "./assets/example.jpg"
import image11 from "./assets/f1.jpg"
import image12 from "./assets/f2.jpg"
import image13 from "./assets/f3.jpg"
import image14 from "./assets/f4.jpg"
import image15 from "./assets/f5.jpg"
import image16 from "./assets/f6.jpg"
import image17 from "./assets/f7.jpg"
import image19 from "./assets/fea9.jpg"
import "./open.css"

import ImageViewer from 'react-simple-image-viewer';

const Features = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const images = [
        image,image1, image2, image3, image4, image5,image6,image7,image9
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
            <div className={style.contains} >
                <div className={style.headerText}>FEATURE</div>
                <div className={style.imageContainer} >

                  <img src={image} className={style.img}/>
                  <img src={image1} className={style.img}/>
                  <img src={image2} className={style.img}/>
                  <img src={image3} className={style.img}/>
                  <img src={image4} className={style.img}/>
                  <img src={image5} className={style.img}/>
                  <img src={image6} className={style.img}/>
                  <img src={image7} className={style.img}/>
                  <img src={image9} className={style.img}/>
                  <img src={image10} className={style.img}/>
                  <img src={image11} className={style.img}/>
                  <img src={image12} className={style.img}/>
                  <img src={image13} className={style.img}/>
                  <img src={image14} className={style.img}/>
                  <img src={image15} className={style.img}/>
                  <img src={image16} className={style.img}/>
                  <img src={image17} className={style.img}/>
                  <img src={image19} className={style.img}/>

                </div>

            </div>
        </div>

    </>
    )
}

export default Features