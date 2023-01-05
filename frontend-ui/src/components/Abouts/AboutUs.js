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
        await WorldOfRR().then(r=>setResponse(r.ItDesign))
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
                        <iframe className={style.img1} frameborder="0" allowfullscreen="1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" title="Redux Toolkit Tutorial – JavaScript State Management Library" width="100%" height="100%" src="https://www.youtube.com/embed/bbkBuqC1rU4?autoplay=1&amp;controls=0&amp;showinfo=0&amp;modestbranding=1&amp;&rel=1&amp;" id="widget2"></iframe>
                            {/* <ReactPlayer className={style.img1} url='https://youtu.be/bbkBuqC1rU4' /> */}
                            <img className={style.img2} src={image2}></img>
                        </div>
                    </div>


                    {/* Paragraph 1*/}

                    <div className={style.TextContainer} style={{ marginBottom: "4%" }}>
                        <div className={style.InnerImgContainer}>
                            <div className={style.AboutContent} >
                                <div className={style.headerText}>ABOUT AA</div>
                                <br />
                                <div className={style.para}>
                                    Amit Aggarwal’s ideas about form and structure took shape growing up in a family
                                    of engineers and scientists. His childhood days were spent observing his father
                                    work on engineering projects. He has always been greatly inspired by science,
                                    which is evident in his design ideology today. He graduated from the National
                                    Institute of Fashion Technology in the year 1999. His graduation collection was
                                    showcased at fashion weeks internationally. In his early career, he worked with the
                                    leading design houses of the country.
                                </div>
                            </div>
                        </div>
                    </div>


                    <ResponsiveSlider response="frontend" img1={imag1} img2={imag2} img3={imag3} />

                    <div className={style.TextContainer} style={{ margin: "4% 0%" }}>
                        <div className={style.InnerImgContainer}>
                            <div className={style.AboutContent} >
                                <div className={style.headerText}>BRAND PHILOSOPHY</div>
                                <br />
                                <div className={style.para}>
                                    Our brand has an established tradition of creating designs inspired
                                    by natural forms, articulating them through unique silhouettes. We
                                    believe in making clothing that is sculpted to enhance the elegant form
                                    of a body. Each ensemble is an amalgamation of femininity and structural
                                    movement.Our light-weight clothing with voluminous shapes and surface details
                                    is made with experimental textiles and techniques. Both traditional and modern
                                    craftsmanship, using recycled materials allows the wearer to effortlessly carry
                                    the grandeur of the garment.When designing, we visualise the new age woman. She
                                    is strong, independent and bold in her choices. Our vision is met through
                                    innovative patterns combined with intricate fabrications. Together they create
                                    a new and inimitable couture language for the modern Indian woman.
                                </div>
                            </div>
                        </div>
                    </div>

                    <ResponsiveSlider response="frontend" img1={img4} img2={img5} img3={img6} />
                    <div className={style.TextContainer} style={{ margin: "4% 0%" }}>
                        <div className={style.InnerImgContainer}>
                            <div className={style.AboutContent} >
                                <div className={style.headerText}>FLAGSHIP STORE MUMBAI</div>
                                <br />
                                <div className={style.para}>
                                    This experiential store is immersed in culture and history against a sound track
                                    of the ocean's shifting moods. The store is inspired by Bombay’s sea, sand and
                                    breeze. The expanse layout of the space and the iridescent textiles used for
                                    the décor reflects the ever-evolving shades of the sea from dusk to dawn. The
                                    dark grey matte floors, metallic grey walls and sandy concrete furnishing accents
                                    the inspiration of sand giving the space a language of tomorrow. The store is a
                                    thoughtful amalgamation of walls with smooth curves-no edges and custom built
                                    amorphous furniture, all bringing in the lightness of a pleasant breeze.
                                </div>
                                <div className={style.para} style={{ marginTop: "20px" }}>
                                    This store is the story of my return to Mumbai and the center installation
                                    is a solicitous objectification of the very moment. It showcases a school
                                    of amorphous creatures- all unique, yet in harmonious rhythm. Each floating
                                    together to form a whole. In designing this space I have used my signature
                                    textiles, including metallic polymers and remnant malleable industrial
                                    materials, as an homage to this old and evolved city.
                                </div>
                                <div className={style.para} style={{ marginTop: "20px" }}>
                                    The store is a house of signature classics made with unique and experimental
                                    textiles, couture, pret-a-couture, ready to wear and menswear collections.
                                </div>
                                <div className={style.para} style={{ marginTop: "20px" }}>
                                    Join me as I celebrate Bombay- her people, her waters, her old and her
                                    evolution.
                                </div>
                            </div>
                        </div>
                    </div>

                    <ResponsiveSlider response="frontend" img1={img7} img2={img8} img3={img9}/>
                    <div className={style.TextContainer} style={{ margin: "4% 0%" }}>
                        <div className={style.InnerImgContainer}>
                            <div className={style.AboutContent} >
                                <div className={style.headerText}>FLAGSHIP STORE DELHI</div>
                                <br />
                                <div className={style.para}>
                                The Amit Aggarwal flagship store is located in the heart of city, 
                                at The Kila, New Delhi, overlooking the beautiful Qutub Minar. The 
                                flagship store is a reflection of the Amit Aggarwal world as we imagine it.
                                </div>
                                <div className={style.para} style={{ marginTop: "20px" }}>
                                The walls of the store are designed as scales created out of reflective
                                 materials.
                                </div>
                                <div className={style.para} style={{ marginTop: "20px" }}>
                                Through the different curvature and spacing of the panels, they create light 
                                reflections with varying opacities and transparencies, depending on the point 
                                of view of the visitor. While moving across the spaces, the visitors 
                                experience passing silhouettes, fleeting glimpses and exaggerated and 
                                diminished reflections. The structural layout of the store drew it’s 
                                inspiration from the skeletal form of the stingray.
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