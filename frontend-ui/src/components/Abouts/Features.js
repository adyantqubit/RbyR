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
import "./open.css"

import ImageViewer from 'react-simple-image-viewer';

const Features = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const images = [
        image1, image2, image3, image4, image5,image6,image7,image9
    ];

    const openImageViewer = useCallback((index) => {
        setCurrentImage(index);
        setIsViewerOpen(true);
    }, []);

    const closeImageViewer = () => {
        setCurrentImage(0);
        setIsViewerOpen(false);
    };

    
    const widthcheck=useRef()

    useEffect(()=>{
        console.log(widthcheck.current.style.width)

    },[widthcheck.current])



    return (<>
        <Navbar />
        <div className={style.Container}>
            <div className={style.contains} ref={widthcheck}>
                <div className={style.headerText}>FEATURE</div>
                <div className={style.imageContainer} >
                    <div className={style.column}>
                      <img src={image1} className={style.img}/>
                      <img src={image2} className={style.img}/>
                      <img src={image3} className={style.img}/>

                    </div>
                    <div className={style.column}>
                    <img src={image4} className={style.img}/>
                    <img src={image5} className={style.img}/>
                    <img src={image6} className={style.img}/>

                    </div>
                    <div className={style.column} >
                    <img src={image7} className={style.img}/>
                    </div>

                    <div className={style.column}>
                    <img src={image9} className={style.img}/>
                    </div>
                </div>

                {/* <div style={{width:"100%",height:"100vh",background:"aqua",position:"relative"}}>
                   <img src={image1} style={{maxWidth:"390px",position:"relative",top:"0"}}></img>
                   <img src={image2} style={{maxWidth:"390px",position:"relative",top:"0"}}></img>
                   <img src={image3} style={{maxWidth:"390px",position:"relative",top:"0"}}></img>
                   <img src={image4} style={{maxWidth:"390px",position:"relative",top:"0"}}></img>
                   <img src={image5} style={{maxWidth:"390px",position:"relative",top:"0"}}></img>

                </div> */}

            </div>
        </div>

    </>
    )
}

export default Features