import { Button, Drawer } from "antd";
import React, { useState,useEffect } from "react";
import { CartState } from "../../context";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import LikeCard from "./likeCard";
import { AiFillHeart } from "react-icons/ai";
import {MdOutlineArrowBack} from 'react-icons/md';
import "./liked.css"
import { notification } from 'antd';

const LikeDrawer = () => {
  notification.destroy()
  const { openLikedrawer, setLikeDrawer } = CartState(); 

  const showDrawer = () => {
    setLikeDrawer(true);
  };

  const onClose = () => {
    setLikeDrawer(false);
  };

  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [drawerwidth,setDrawerwidth]=useState(600)


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
    if(windowSize.innerWidth<500)
     setDrawerwidth(330)
   else if(windowSize.innerWidth<800)
     setDrawerwidth(450)
    else if(windowSize.innerWidth>800)
    setDrawerwidth(600)

    
  },[windowSize])

  return (
    <>
      {/* <Button type="primary" onClick={showDrawer}>
        Open
      </Button> */}
      <AiFillHeart
        style={{ marginTop: "10px", fontSize: "20px", color: "red" }}
        onClick={showDrawer}
        type="primary"
      />
      {/* Commented and modified by Ashish Dewangan on 20-11-2022
      Reason - To show wishlist title instead of likes */}
      {/* <Drawer width={600} title="Likes" placement="right" onClose={onClose} open={openLikedrawer}></Drawer> */}
      <Drawer
        width={drawerwidth}
        title={<div className="likeTitle">Wishlist</div>}   
        // title="Wishlist"
        placement="right"
        onClose={onClose}
        closeIcon={<MdOutlineArrowBack className="likeSVG"/>}  
        open={openLikedrawer}
        headerStyle={{ height: "200px",backgroundColor:"var(--backgroundColorPrimary)" }}
        style={{ display: "flex", justifyContent: "center" }}
        // closable={false}
      >
        {/* End of code modification */}
        <LikeCard />
      </Drawer>
    </>
  );
};

export default LikeDrawer;
