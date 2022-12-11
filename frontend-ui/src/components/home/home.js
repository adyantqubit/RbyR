import React, { useEffect, useState } from "react";
import NavHeader from "../global/NavHeader";
import Slideshow from "../global/slideshow";
import Card from "./card";
import Autocard from "./Autocard";
import Footer from "../global/footer";
import Video from "./video";
import Below from "../global/below";
import CArd2 from "./card2";
import Chat from "../expandDetailt/chat";
import Footer2 from "../global/footer2";
import { getLogoAndCover } from "../../api/service";
import { notification } from "antd";
export const Home = () => {
  // const [logoAndCover, setLogoAndCover] = useState([]);

  // useEffect(() => {
  //   getLogoAndCoverDetail();
  // }, []);

  // const getLogoAndCoverDetail = async () => {
  //   const coverAndLogoData = await getLogoAndCover();
  //   alert(JSON.stringify(coverAndLogoData))
  //   setLogoAndCover(coverAndLogoData);
   
  // };
  notification.destroy()
  return (
    <>
      <NavHeader/>
      <Slideshow />

      <Card />
      <CArd2 />
      <Video />
      <Footer2 />
      <Below />
      
      {/* <Chat/> */}
    </>
  );
};
