import React, { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import config from "../../api/config";
import { picApi, SlideShowApi } from "../../api/service";
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


  useEffect(() => {
    fun();
  }, []);

  const fun = async () => {
    await picApi().then((r) => {
      setpay([...r.j]);
      setpay2([...r.h])
      console.log(r);
    });
  };

  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [visible,setVisibleImg]=useState([])


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
            <a href={`listing/${item.category}`}>
              {" "}
              <img
                className={style.dblock}
                // src={pay[0].src}
                src={config.apiBaseURL + item.src}
                alt="First slide"
              />
            </a>
            
          </Carousel.Item>
        ))}
      </Carousel>
      <Card/>
      <CArd2/>
      <Video/>
      <Footer2 />
      <Below />
      </div>
    );
  }
}

export default Slideshow;
