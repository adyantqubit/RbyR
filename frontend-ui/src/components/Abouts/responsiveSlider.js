import style from './ItDesign.module.css'
import ImageSlider, { Slide } from "react-auto-image-slider";
import React, { useEffect, useState } from 'react'
import config from '../../api/config';


const ResponsiveSlider = (props) => {
    const [windowSize, setWindowSize] = useState(getWindowSize());
    const [drawerwidth, setDrawerwidth] = useState(false)
  
  
    useEffect(() => {
      function handleWindowResize() {
        setWindowSize(getWindowSize());
      }
      window.addEventListener('resize', handleWindowResize);
  
      return () => {
        window.removeEventListener('resize', handleWindowResize);
      };
  
  
    }, [window.innerWidth]);
  
    function getWindowSize() {
      const { innerWidth, innerHeight } = window;
      return { innerWidth, innerHeight };
    }
  
    useEffect(() => {
      if (windowSize.innerWidth < 800)
        setDrawerwidth(true)
      else if (windowSize.innerWidth > 800)
        setDrawerwidth(false)
    }, [windowSize])


  return (
    <div className={style.TextContainer}>
    <div className={style.InnerImgContainer}>

    {drawerwidth?
    <>
    <ImageSlider 
    effectDelay={1000} 
    autoPlayDelay={2000}
    >
        <Slide>
            <img alt="img2" className={style.sliderImg} src={props.response=="frontend"?props.img1:config.staticBaseURL+props.img1}/>
        </Slide>
        <Slide>   
            <img alt="img2" className={style.sliderImg} src={props.response=="frontend"?props.img2:config.staticBaseURL+props.img2} />
        </Slide>
        <Slide>
            <img alt="img1" className={style.sliderImg} src={props.response=="frontend"?props.img3:config.staticBaseURL+props.img3} />
        </Slide>
        </ImageSlider>
        </>
        :<>
        {/* Modified by - Ashish Dewangan on 16-12-2023
        Reason - If image was not provided then blank default pic was showing */}
        {/* <img className={style.sliderImg} src={props.response=="frontend"?props.img1:config.staticBaseURL+props.img1}></img>
        <img className={style.sliderImg} src={props.response=="frontend"?props.img2:config.staticBaseURL+props.img2}></img>
        <img className={style.sliderImg} src={props.response=="frontend"?props.img3:config.staticBaseURL+props.img3}></img> */}
        {props.img1 && <img className={style.sliderImg} src={props.response=="frontend"?props.img1:config.staticBaseURL+props.img1}></img>}
        {props.img2 && <img className={style.sliderImg} src={props.response=="frontend"?props.img2:config.staticBaseURL+props.img2}></img>}
        {props.img3 && <img className={style.sliderImg} src={props.response=="frontend"?props.img3:config.staticBaseURL+props.img3}></img>}
        {/* End of modification by - Ashish Dewangan on 16-12-2023
        Reason - If image was not provided then blank default pic was showing */}
        </>
        }
    </div>
</div>
  )
}

export default ResponsiveSlider