import style from "./aboutus.module.css";
import React, { useEffect, useState } from "react";
import Footer from "../global/footer";
import Navbar from "../global/NavHeader";
import "./open.css";
import config from "../../api/config";

import image2 from "./assets/profile-img.jpg";
import image1 from "./assets/amit7.jpg";

import imag1 from "./assets/img1.jpg";
import imag2 from "./assets/img2.jpg";
import imag3 from "./assets/img3.jpg";
import img4 from "./assets/img4.jpg";
import img5 from "./assets/img5.jpg";
import img6 from "./assets/img6.jpg";
import img7 from "./assets/img7.jpg";
import img8 from "./assets/img8.jpg";
import img9 from "./assets/img9.jpg";
import ResponsiveSlider from "./responsiveSlider";
import ReactPlayer from "react-player";
import { WorldOfRR } from "../../api/orderApis";
import stylee from "../footer pages/globalFooterFile.module.css";
import "../../context.css";

const AboutUs = () => {
  const [response, setResponse] = useState(null);
  const [response2, setResponse2] = useState(null);

  const [playVideo, setVideo] = useState({});
  const [vidRef, setVidRef] = useState(null);

  function setVideoPlayingToggle(id) {
    var key = `video${id}`;
    setVideo({ [key]: !playVideo[`video${id}`] });
  }

  useEffect(() => {
    GetWorldOfRRContent();
    setVidRef(document.querySelector(".react-player"));
  }, []);

  async function GetWorldOfRRContent() {
    await WorldOfRR().then((r) => {
      setResponse(r.about.content);
      setResponse2(r.about.row);
    });
  }

  console.log(response);

  if (response != null)
    return (
      <>
        <Navbar />
        <div
          className={style.container}
          //  style={{border:'2px solid black'}}
        >
          <div className="headingFooter" style={{ paddingTop: "2%" }}>
            {" "}
            {/* Modification and addition by Om Shrivastava on 13-06-2024
                    Reason : Change the name  */}
            {/* World of RbyR */}
            About us
            {/* End of modification and addition by Om Shrivastava on 13-06-2024
                    Reason : Change the name  */}
          </div>
          <div className={style.contain}>
            {/* Paragraph 1*/}
            {response.top_image && (
              <div className={`${style.TextContainer} ${style.Top2Images}`}>
                <div
                  className={style.InnerImgContainer}
                  style={{
                    display: "flex",
                    width: "100%",
                    marginBottom: "15px",
                  }}
                >
                  <div className={style.AboutContent}>
                    <div className={style.headerText}>{response.title1}</div>
                    <br />
                    <div className={style.para}>{response.description1}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Top content video and images */}
            {response.top_image && (
              <div className={style.TextContainer}>
                <div
                  // className={style.InnerImgContainer}
                  className={
                    response.video_url
                      ? `${style.InnerImgContainer}`
                      : `${style.InnerImgDisableContainer}`
                  }
                >
                  {
                    response.video_url ? (
                      // Modification and addition by Om Shrivastava on 04-01-24
                      // Reason : Need to change the library because need to remove the whatsapp icon
                      // <iframe
                      //   className={style.img1}
                      //   frameborder="0"
                      //   allowfullscreen="1"
                      //   width="100%"
                      //   height="100%"
                      //   src={response.video_url ?  `${response.video_url}autoplay=1&amp;controls=0&amp;showinfo=0&amp;modestbranding=1&amp;&rel=1&amp;`:null}
                      //   id="widget2"
                      // ></iframe>

                      <div
                        // className="iframeContainer"
                        className={style.img1}
                        onClick={(e) => {
                          setVideoPlayingToggle(response.id);
                        }}
                      >
                        <ReactPlayer
                          ref={vidRef}
                          className="react-player"
                          height="100%"
                          width="100%"
                          url={`${response.video_url}?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`}
                          playing={playVideo[`video${response.id}`]}
                        />
                      </div>
                    ) : (
                      // End of modification and addition by Om Shrivastava on 04-01-24
                      // Reason : Need to change the library because need to remove the whatsapp icon
                      // Addition and modification by Om shrivastava on 27-11-23
                      // Reason : Set the height and width
                      <div
                      // className={stylee.footerPrivacyNullContent}
                      // style={{height:'35vh'}}
                      >
                        <div
                        // style={{border:'1px solid black'}}
                        >
                          {/* World Of RbyR Details Are Not Available */}
                        </div>
                      </div>
                    )
                    // End of addition and modification by Om shrivastava on 27-11-23
                    // Reason : Set the height and width
                  }
                  {/* <ReactPlayer className={style.img1} url='https://youtu.be/bbkBuqC1rU4' /> */}
                  {/* // Modification and addition by Om Shrivastava on 20-10-23
                                // Reason : When image is not show then certain div is not shown  */}

                  {/* Added by - Ashish Dewangan on 15-12-2023
                Reason - To show image if image url is not null */}
                  {response.top_image ? (
                    /* End of code addition by - Ashish Dewangan on 15-12-2023
                Reason - To show image if image url is not null */
                    <img
                      className={style.img2}
                      // Modification and addition by Om Shrivastava on 20-10-23
                      // Reason : When image is not show then certain div is not shown
                      // src={config.staticBaseURL + response.top_image}
                      src={
                        response.top_image
                          ? config.staticBaseURL + response.top_image
                          : null
                      }
                      // Endd of modification and addition by Om Shrivastava on 20-10-23
                      // Reason : When image is not show then certain div is not shown
                    ></img>
                  ) : (
                    <></>
                  )}
                  {/* // End of modification and addition by Om Shrivastava on 20-10-23
                                // Reason : When image is not show then certain div is not shown  */}
                </div>
              </div>
            )}

            {/* commented by Rohan
                            on- 16/2/23 
                            Reason-Commenting all fixed row and making dynamic row. so, admin should able to add multiple row. */}

            {/* <div className={style.TextContainer} style={{ margin: "4% 0%" }}>
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

                    <ResponsiveSlider img1={response.img1} img2={response.img2} img3={response.img3} />

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

                    <ResponsiveSlider  img1={response.img4} img2={response.img5} img3={response.img6} /> */}
            {/* end of code 16/2/23 */}

            {/* commented by rohan
                            on- 16/2/23
                            reason- mapping all row for dynamic row  */}
            {response2?.map((r) => (
              <>
                <div
                  className={style.TextContainer}
                  style={{ margin: "2% 0%" }}
                >
                  <div className={style.InnerImgContainer}>
                    <div className={style.AboutContent}>
                      {/* Modified by - Ashish Dewangan on 15-12-2023
                  Reason - Handle empty space on UI if data is not added in backend */}
                      {/* <div className={style.headerText}>{r.title}</div>
                      <br />
                      <div className={style.para}>{r.description1}</div>
                      <div className={style.para} style={{ marginTop: "20px" }}>
                        {r.description2}
                      </div> */}
                      {r.title.trim().length > 0 && (
                        <div className={style.headerText}>{r.title}</div>
                      )}
                      {r.title.trim().length > 0 && <br />}
                      {r.description1.trim().length > 0 && (
                        <div className={style.para}>{r.description1}</div>
                      )}
                      {/* commented by Rohan
                                        on - 16/2/23
                                        reason- hidding 1 paragaraph and showing only 2 */}
                      {/* <div className={style.para} style={{ marginTop: "20px" }}>
                                        {response.description8}
                                        </div> */}
                      {/* end of code */}
                      {
                        r.description2.trim().length > 0 && (
                          <div
                            className={style.para}
                            style={{ marginTop: "20px" }}
                          >
                            {r.description2}
                          </div>
                        )
                        /* End of modification by - Ashish Dewangan on 15-12-2023
                        Reason - Handle empty space on UI if data is not added in backend */
                      }
                    </div>
                  </div>
                </div>
                {/* commented by rohan - on 18/2/23
                            reason - response frontend is for hardcode images but for backend immage we dont need frontend string */}

                {/* Modified by - Ashish Dewangan on 15-12-2023
                  Reason - To show slider if any of the three image is not null */}
                {/* <ResponsiveSlider
                  // response="frontend"
                  img1={r.img1}
                  img2={r.img2}
                  img3={r.img3}
                />             */}
                {(r.img1 != null || r.img2 != null || r.img3 != null) && (
                  <ResponsiveSlider
                    // response="frontend"
                    img1={r.img1}
                    img2={r.img2 != null ? r.img2 : null}
                    img3={r.img3 != null ? r.img3 : null}
                  />
                )}
                {/* End of code modification by - Ashish Dewangan on 15-12-2023
                Reason - To show slider if any of the three image is not null */}
                {/* end of code */}
              </>
            ))}
          </div>
        </div>

        <div className={style.foot} style={{ marginBottom: "-10%" }}>
          <Footer />
        </div>
      </>
    );
};

export default AboutUs;
