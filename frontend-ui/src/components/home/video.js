// video

import React, { useState, useEffect } from 'react'
import { getCardHomeImagesApi } from '../../api/service';
import image from "../../assets/photos/model.jpg"
import { ImCross } from "react-icons/im"
import Carousel from 'react-grid-carousel'
import styles from "./card.module.css"
import style from './video.module.css'
import { CartState } from '../../context';
const src = "https://www.youtube.com/embed/m_LfH48sTmY";

const Video = (props) => {

  //   const [iamges,setIamges]=useState({})
  //   useEffect(()=>{

  //     images()
  //   },[])


  // async function images(){
  //   await getCardHomeImagesApi().then(r=>setIamges(r.response))

  // }
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
    if (windowSize.innerWidth < 900)
      setDrawerwidth(true)
    else if (windowSize.innerWidth > 900)
      setDrawerwidth(false)
  }, [windowSize])




  const [showVideo, setShow] = useState(false)
  const [url, setUrl] = useState("")

  const Popup = function popup(props) {


    return <div className={style.popupContainer}>

      <div className={style.cancle}>
        <ImCross color='var(--backgroundColorSecondary)' style={{ margin: "auto 0", fontSize: "30px" }} onClick={e => setShow(false)} />
      </div>

      <div className={style.videoContains}>
        <iframe src={`${props.url}?autoplay=1`} style={{ width: "80%", height: "70%", margin: "auto" }} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

      </div>

    </div>
  }


  return (
    <>

      <div className={style.container}>

        {/* <div className={style.heading}> Best seller product of RBYR </div> */}
        <div className={style.sliderContainer}>
          <Carousel cols={drawerwidth?1:3} rows={1} gap="10px">

            {props.url?.map(u => <Carousel.Item
              className={style.card}
            >
              <div style={{ position: "relative", minWidth: "100%", minHeight: "100%", padding: "10px" }}>
                <iframe className={style.video} src={`${u.Video_url}?autoplay=1&showinfo=0&controls=0&modestbranding=1&mute=1`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <div class={style.overlay} onClick={e => { setShow(true); setUrl(u.Video_url); console.log(showVideo); }}></div>
              </div>
            </Carousel.Item>
            )}

          </Carousel>
        </div>
      </div>

      {
        showVideo ?
          <Popup url={url} />
          : null
      }

      {/* <div style={{ width: "100%", display: "flex", justifyContent: "center", zIndex: "-2", marginBottom: "25px", background: "var(--backgroundColorSecondary)" }}>
        {props.url ?
          <iframe width="560" height="315" className={styles.video} src={props.url.Video_url} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          : null}
      </div> */}
    </>
  )
}

export default Video;

function newFunction(props, setShow, setUrl, showVideo, drawerwidth) {
  return;
}

