import React, { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";
import config from "../../api/config";
import { getCardHomeImagesApi, picApi, SlideShowApi } from "../../api/service";
import Card from "../home/card";
import CArd2 from "../home/card2";
import Video from "../home/video";
import Below from "./below";
import Footer2 from "./footer2";
import style from "./slideshow.module.css";

function Slideshow() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const [pay2, setpay2] = useState([]);
  const [pay, setpay] = useState([]);
  const [gif,setGif]=useState(null)
  const [normal,setnormal]=useState(null)
  const [video,setVideo]=useState(null)


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
      console.log(r);
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

    console.log(pay,pay2)
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
              {" "}
              {console.log(item.src)}
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
      <Card imgArray={gif}/>
      <CArd2 imgArray={normal}/> 
       <Video url={video}/>
      <Footer2 />
      <Below />
      </div>
    );
  }
}

export default Slideshow;
