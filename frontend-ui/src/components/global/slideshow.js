import React, { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";
import config from "../../api/config";
import { getCardHomeImagesApi, picApi, SlideShowApi } from "../../api/service";
import { CartState } from "../../context";
import BestSeller from "../home/BestSeller";
import Card from "../home/card";
import CArd2 from "../home/card2";
import Video from "../home/video";
//import Test from "../test/Test";
import Below from "./below";
import Footer2 from "./footer2";
import style from "./slideshow.module.css";

function Slideshow() {
  const [index, setIndex] = useState(0);
  const {video,setVideo} = CartState()
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  }; 

  const [pay2, setpay2] = useState([]);
  const [pay, setpay] = useState([]);
  const [gif,setGif]=useState(null)
  const [normal,setnormal]=useState(null)


  useEffect(() => {
    fun();
    // images()
  }, []);

  const fun = async () => {
    await picApi().then((r) => {
      setpay([...r.j]);
      setpay2([...r.h]);
      setGif(r.Gif)
      setVideo(r.video)
      setnormal(r.Normal)
    });
  };

  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [visible,setVisibleImg]=useState([])

  // async function images() {
  //   await getCardHomeImagesApi().then((r) => 
  //   {
  //     // setIamges(r.response);
         
  //   })
  // }


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
    const {innerWidth, innerHeight} = window;
    return {innerWidth, innerHeight};
  }

  useEffect(()=>{
    if(windowSize.innerWidth<800)
     setVisibleImg(pay2)
    else if(windowSize.innerWidth>800)
    setVisibleImg(pay)

  },[windowSize,pay,pay2])


  if (visible != null && visible.length > 0) {
    return (  
          
      <div className={style.car}>
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
      >
        {visible.map((item) => (
          <Carousel.Item>
            <Link to={`/listing/${item.category}/0`}>
              <img
                className={style.dblock}
                // src={pay[0].src}

                src={config.apiBaseURL + item.src}
                alt="First slide"
              />
            </Link>
            
          </Carousel.Item>
        ))}
      </Carousel>
      {/* <Card imgArray={gif}/>
      <CArd2 imgArray={normal}/> 
       <Video url={video}/> */}
       <BestSeller/>
       
      {/* Commented by - Ashish Dewangan on 15-02-2023
      Reason - To hide text that appear after footer */}
      {/* <Below /> */}
      {/* End of comment */}
      </div>
    );
  }
}

export default Slideshow;
