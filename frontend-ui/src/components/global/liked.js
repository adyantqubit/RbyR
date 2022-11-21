import { Button, Drawer } from "antd";
import React, { useState } from "react";
import { CartState } from "../../context";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import LikeCard from "./likeCard";
import { AiFillHeart } from "react-icons/ai";
import {MdOutlineArrowBack} from 'react-icons/md';
import "./liked.css"
const LikeDrawer = () => {
  const { openLikedrawer, setLikeDrawer } = CartState();

  const showDrawer = () => {
    setLikeDrawer(true);
  };

  const onClose = () => {
    setLikeDrawer(false);
  };

  return (
    <>
      {/* <Button type="primary" onClick={showDrawer}>
        Open
      </Button> */}
      <AiFillHeart
        style={{ marginTop: "10px", fontSize: "20px", color: "#7c7c7c" }}
        onClick={showDrawer}
        type="primary"
      />
      {/* Commented and modified by Ashish Dewangan on 20-11-2022
      Reason - To show wishlist title instead of likes */}
      {/* <Drawer width={600} title="Likes" placement="right" onClose={onClose} open={openLikedrawer}></Drawer> */}
      <Drawer
        width={window.innerWidth > 768 ? 650 : "100%"}
        title={<div className="likeTitle">Wishlist</div>}
        // title="Wishlist"
        placement="right"
        onClose={onClose}
        closeIcon={<MdOutlineArrowBack className="likeSVG"/>}
        open={openLikedrawer}
        headerStyle={{ height: "200px", backgroundColor: "white" }}
        style={{ display: "flex", justifyContent: "center" }}
      >
        {/* End of code modification */}
        <LikeCard />
      </Drawer>
    </>
  );
};

export default LikeDrawer;
