import React, { useState } from 'react';
import { AiFillAlert } from 'react-icons/ai';
import { FaArrowCircleUp } from 'react-icons/fa';
import { Button } from './Styles';
import "./styles.css"


const ScrollButton = () => {


  const scrollToTop = (element) => {

    // Get the bounding rectangle of target
    if (element.target.scrollTop > 500)
      element.target.scrollTop = 0

    // var  elemRect = 
    // alert('Element is ' +element.target.scrollTop+ ' vertical pixels from <body>');
  };



  return (
    <>
      <div style={{ maxHeight: "100vh", width: "100vw", background: "grey", diaplay: "flex", justifyContent: "end", overflow: "scroll" }} id="den" onScroll={scrollToTop} >
        <div style={{ minHeight: "10000px", width: "80vw", background: "white" }} >
          sknanksakl
        </div>
      </div>


    </>
  );
}

export default ScrollButton;