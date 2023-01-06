import style from './aboutus.module.css'
import React, { useEffect, useState } from 'react'
import Footer from '../global/footer'
import Navbar from '../global/NavHeader'
import "./open.css"
import config from '../../api/config'
import image2 from './assets/profile-img.jpg'
import image1 from './assets/amit7.jpg'

import imag1 from './assets/img1.jpg'
import imag2 from './assets/img2.jpg'
import imag3 from './assets/img3.jpg'
import img4 from './assets/img4.jpg'
import img5 from './assets/img5.jpg'
import img6 from './assets/img6.jpg'
import img7 from './assets/img7.jpg'
import img8 from './assets/img8.jpg'
import img9 from './assets/img9.jpg'
import ResponsiveSlider from './responsiveSlider'
import ReactPlayer from 'react-player'
import { WorldOfRR } from '../../api/orderApis'










const AboutUs = () => {
    const [response,setResponse]=useState(null)
    
    useEffect(()=>{
     GetWorldOfRRContent()
    },[])

    async function GetWorldOfRRContent(){
        await WorldOfRR().then(r=>setResponse(r.about))
    }

    
    

    if(response!=null)
    return (
        <>
            <Navbar />
            <div className={style.container}>
                <div className={style.contain}>

                    {/* Top content video and images */}
                    <div className={style.Top2Images}>
                        <div className={style.InnerImgContainer}>
                        <iframe className={style.img1} frameborder="0" 
                        allowfullscreen="1"
                        width="100%" height="100%" 
                        src={`${response.video_url}?autoplay=1&amp;controls=0&amp;showinfo=0&amp;modestbranding=1&amp;&rel=1&amp;`} id="widget2"></iframe>
                            {/* <ReactPlayer className={style.img1} url='https://youtu.be/bbkBuqC1rU4' /> */}
                            <img className={style.img2} src={config.apiBaseURL+response.top_image}></img>
                        </div>
                    </div>


                    {/* Paragraph 1*/}

                    <div className={style.TextContainer} style={{ marginBottom: "4%" }}>
                        <div className={style.InnerImgContainer}>
                            <div className={style.AboutContent} >
                                <div className={style.headerText}>{response.title1}</div>
                                <br />
                                <div className={style.para}>
                                    {response.description1}
                                </div>
                            </div>
                        </div>
                    </div>


                    <ResponsiveSlider img1={response.img1} img2={response.img2} img3={response.img3} />

                    <div className={style.TextContainer} style={{ margin: "4% 0%" }}>
                        <div className={style.InnerImgContainer}>
                            <div className={style.AboutContent} >
                                <div className={style.headerText}>{response.title2}</div>
                                <br />
                                <div className={style.para}>
                                   {response.description2}
                                </div>
                            </div>
                        </div>
                    </div>

                    <ResponsiveSlider  img1={response.img4} img2={response.img5} img3={response.img6} />
                    <div className={style.TextContainer} style={{ margin: "4% 0%" }}>
                        <div className={style.InnerImgContainer}>
                            <div className={style.AboutContent} >
                                <div className={style.headerText}>{response.title3}</div>
                                <br />
                                <div className={style.para}>
                                   {response.description3}
                                </div>
                                <div className={style.para} style={{ marginTop: "20px" }}>
                                {response.description4}
                                </div>
                                <div className={style.para} style={{ marginTop: "20px" }}>
                                {response.description5}
                                </div>
                                <div className={style.para} style={{ marginTop: "20px" }}>
                                {response.description6}
                                </div>
                            </div>
                        </div>
                    </div>

                    <ResponsiveSlider response="frontend" img1={img7} img2={img8} img3={img9}/>
                    <div className={style.TextContainer} style={{ margin: "4% 0%" }}>
                        <div className={style.InnerImgContainer}>
                            <div className={style.AboutContent} >
                                <div className={style.headerText}>{response.title4}</div>
                                <br />
                                <div className={style.para}>
                                {response.description7}
                                </div>
                                <div className={style.para} style={{ marginTop: "20px" }}>
                                {response.description8}
                                </div>
                                <div className={style.para} style={{ marginTop: "20px" }}>
                                {response.description9}
                                </div>
                            </div>
                        </div>
                    </div>


                </div>


            </div>
            <div className={style.foot}>
                <Footer />
            </div>
        </>
    )
}

export default AboutUs