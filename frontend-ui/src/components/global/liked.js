import { Button, Drawer } from 'antd';
import React, { useState } from 'react';
import { CartState } from '../../context';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import LikeCard from './likeCard';
import { AiFillHeart } from 'react-icons/ai';


const LikeDrawer= () => {


  const {openLikedrawer, setLikeDrawer} = CartState();

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
      <AiFillHeart style={{marginTop:"10px",fontSize:"20px",color:"#7c7c7c"}} onClick={showDrawer} type="primary"/>
      <Drawer width={600} title="Likes" placement="right" onClose={onClose} open={openLikedrawer}>
        <LikeCard/>
      </Drawer>
    </>
  );
};

export default LikeDrawer;