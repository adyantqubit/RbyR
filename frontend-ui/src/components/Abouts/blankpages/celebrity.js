import style from '../ItDesign.module.css'
import ImageSlider, { Slide } from "react-auto-image-slider";
import React, { useEffect, useState } from 'react'
import { WorldOfRR } from '../../../api/orderApis'
import config from '../../../api/config'
import Footer from '../../global/footer'
import Navbar from '../../global/NavHeader'
import "../open.css"
import image from "./about.jpg"


const Celebrity = () => {

    const [response,setResponse]=useState(null)
    
    useEffect(()=>{
     GetWorldOfRRContent()
    },[])

    async function GetWorldOfRRContent(){
        await WorldOfRR().then(r=>setResponse(r.ItDesign))
    }

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
      if (windowSize.innerWidth < 500)
        setDrawerwidth(true)
      else if (windowSize.innerWidth > 800)
        setDrawerwidth(false)
    }, [windowSize])


    

    if(response!=null)
    return (<>
       <Navbar/>
        <div className={style.container}>
            {/* Top 2 images shown */}
            <div className={style.Top2Images}>
                <div className={style.InnerImgContainer}>
                    <img className={style.img1} src={image} style={{width:"100%"}}></img>
                    {/* <img className={style.img2} src={config.apiBaseURL+response.TopImage2}></img> */}
                </div>
            </div>

            {/* About Text */}

            <div className={style.TextContainer} style={{marginBottom:"4%"}}>
                <div className={style.InnerImgContainer}>
                    <div className={style.AboutContent} >
                        <div className={style.headerText}>{response.HeaderText}</div>
                        <br />
                        <div className={style.para}>
                            {response.description1}
                        </div>
                        <div className={style.para} style={{ marginTop: "5px" }}>
                           {response.description2}
                        </div>
                        <div className={style.para} style={{ marginTop: "5px" }}>
                           {response.descriptionHighlight}
                        </div>

                    </div>
                </div>
            </div>

          
          
        </div>
        <div className={style.foot}>
        <Footer/>
        </div>
    </>
    )
}

export default Celebrity