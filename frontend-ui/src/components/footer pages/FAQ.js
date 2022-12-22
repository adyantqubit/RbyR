// Created by Ashish on 06-11-2022
// Reason - To have FAQ functionality

import React, { Fragment, useEffect, useState } from "react";
import { getFAQList } from "../../api/service";
import Footer from "../global/footer";
import Navbar from "../global/NavHeader";
import style from "./FAQ.module.css";
import parse from "html-react-parser";
import { notification } from 'antd';

const FAQ = () => {
  notification.destroy()
  const [FAQs,setFAQs]=useState([])
  
  useEffect(()=>{
    getFAQs()
  },[])

  const getFAQs = async () => {
    const responseData = await getFAQList();
    if (responseData) {
        setFAQs(responseData['faqs'])
    }
  }

 

  var serialNumber=1;

  function showHideAnswer(event){
   
    var answer=document.getElementById((event.target.id+'_child'));
   
    if(answer.classList.contains(style.showAnswer)){
      answer.classList.add(style.hideAnswer);
      answer.classList.remove(style.showAnswer);
    }else{
     if(answer.classList.contains(style.hideAnswer)){
      answer.classList.add(style.showAnswer);
      answer.classList.remove(style.hideAnswer);
     }
    }
  }
  return (
    <div>
      <Navbar />
      <div className={style.faqContainer}>
        <div className={style.row}>
            {
              (FAQs.length>0)?
              <>
                {
                 
                 FAQs.map((faq)=>{
                    return (
                      <div className={style.item} key={faq.qno}>
                        <div className={`${style.itemText} ${style.question}`} id={faq.qno} onClick={showHideAnswer}>
                          {serialNumber}. {faq.question}
                        </div>
                        <div className={`${style.itemText} ${style.answer} ${style.hideAnswer}`} id={faq.qno+'_child'}>
                          { parse(faq.answer)}
                          
                        </div>
                        <div style={{display:'none'}}>
                          {serialNumber++}
                        </div>
                      </div>
                    );
                  })
                }
              </>
              :
              <div className={`${style.itemText} ${style.answer} `}>
                No Questions Are Present Currently!
              </div>
            }
        </div>

        <div style={{ paddingTop: "80px",background:"#323232" }}>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default FAQ;
