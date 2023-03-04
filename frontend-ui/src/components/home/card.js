import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import config from "../../api/config";
import { getCardHomeImagesApi } from "../../api/service";
import ImageChageComponent2, { ImageSwapper } from "./AutoChange";
import AutoCard from "./AutoChange";
import ImageSwapper2 from "./AutoChange2";
import style from "./card.module.css";

const Card = (props) => {
  // const [iamges, setIamges] = useState(1);
  // useEffect(() => {
  //   images();
  // }, []);

  // async function images() {
  //   await getCardHomeImagesApi().then((r) => setIamges(r.response));
  // }
  return (
    <div className={style.container}>
      {props.imgArray ? (
        <ul className={style.main}>
          <li className={style.cardli}>
        
              <Link to={`listing/${props.imgArray[0].menu}/${props.imgArray[0].category}`}>
              <img
                    alt=""
                    className={style.imgswap}
                    src={config.apiBaseURL +  props.imgArray[0].Gif_image}
                  />
              <div className={style.text}>
                <a className={style.linkText}  href={`listing/${props.imgArray[0].menu}/${props.imgArray[0].category}`}>
                  {props.imgArray[0].category}
                </a>
                <h3 className={style.belowTitle}>SHOP NOW</h3>
              </div>
              </Link>

          </li>
          <li className={style.cardli}>             
              <Link to={`listing/${props.imgArray[1].menu}/${props.imgArray[1].category}`}>
                {/* Commented by ROhan -on 31/12/22 
                    Reason beasuse Now We are getting gif image so no need to swap */}
                {/* <ImageSwapper2 /> */}
              
                <img
                    alt=""
                    className={style.imgswap}
                    src={config.apiBaseURL + props.imgArray[1].Gif_image}
                  />

                {/* End of comment */}
                <div className={style.text}>
                  <a className={style.linkText}  href={`listing/${props.imgArray[1].menu}/${props.imgArray[1].category}`}>
                    {props.imgArray[1].category}
                  </a>
                  <h3 className={style.belowTitle}>SHOP NOW</h3>
                </div>
              </Link>

          </li>
        </ul>
      ) : null}
    </div>
  );
};

export default Card;
