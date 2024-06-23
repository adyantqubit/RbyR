import React, { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
// import Carousel from 'react-grid-carousel'
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
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
// Import Swiper styles
// import './styles.css';
// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

function Slideshow() {
  const [index, setIndex] = useState(0);
  const { video, setVideo } = CartState();
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const [pay2, setpay2] = useState([]);
  const [pay, setpay] = useState([]);
  const [gif, setGif] = useState(null);
  const [normal, setnormal] = useState(null);

  useEffect(() => {
    fun();
    // images()
  }, []);

  const fun = async () => {
    await picApi().then((r) => {
      setpay([...r.j]);
      setpay2([...r.h]);
      setGif(r.Gif);
      setVideo(r.video);
      setnormal(r.Normal);
    });
  };

  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [visible, setVisibleImg] = useState([]);

  // async function images() {
  //   await getCardHomeImagesApi().then((r) =>
  //   {
  //     // setIamges(r.response);

  //   })
  // }

  // console.log(visible,'data')

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [window.innerWidth]);

  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }

  useEffect(() => {
    if (windowSize.innerWidth < 800) setVisibleImg(pay2);
    else if (windowSize.innerWidth > 800) setVisibleImg(pay);
  }, [windowSize, pay, pay2]);

  // Commented by Om Shrivastava on 22-10-23
  // Reason : When the user delete the banner then bestseller data is show
  // if (visible != null && visible.length > 0) {
  return (
    <div className={style.car}>
      {/* Addition by Om Shrivastava on 08-12-23
        Reason : Set the condition when data is not present */}
      {visible.length > 0 ? (
        // Modification and addition by Om Shirvastava on 08-12-23
        // Reason : Need to remove the arrow when the content is one
        // <Carousel activeIndex={index} onSelect={handleSelect} slide={false}

        // >
        //   {visible.map((item) => (
        //     <Carousel.Item>
        //       <Link to={`/listing/${item.category}/0`}>
        //         <img
        //           className={style.dblock}
        //           // src={pay[0].src}

        //           src={config.staticBaseURL + item.src}
        //           alt="First slide"
        //         />
        //       </Link>
        //     </Carousel.Item>
        //   ))}
        // </Carousel>
        <Swiper
          style={{
            "--swiper-pagination-color": "white",
            "--swiper-pagination-bullet-inactive-color": "black",
            "--swiper-pagination-bullet-inactive-opacity": "0.6 ",
            "--swiper-pagination-bullet-size": "12px",
            "--swiper-pagination-bullet-horizontal-gap": "5px",
            "--swiper-button-prev-color": "black !important",
            "--swiper-button-prev-background": "red !important",
          }}
          navigation={true}
          loop={true}
          pagination={{
            clickable: true,
          }}
          // autoplay={{
          //   delay: 2500,
          //   disableOnInteraction: false,
          // }}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper"
        >
          {visible.map((item) => (
            <SwiperSlide>
              <Link to={`/listing/${item.category}/0`}>
                <img
                  className={style.dblock}
                  // src={pay[0].src}

                  src={config.staticBaseURL + item.src}
                  // alt="First slide"
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : null}
      {/* //End of modification and addition by Om Shirvastava on 08-12-23
        // Reason : Need to remove the arrow when the content is one */}
      {/* End of addition by Om Shrivastava on 08-12-23
        Reason : Set the condition when data is not present */}
      {/* <Card imgArray={gif}/>
      <CArd2 imgArray={normal}/> 
       <Video url={video}/> */}
      <BestSeller />

      {/* Commented by - Ashish Dewangan on 15-02-2023
      Reason - To hide text that appear after footer */}
      {/* <Below /> */}
      {/* End of comment */}
    </div>
  );
  // }
}

export default Slideshow;
