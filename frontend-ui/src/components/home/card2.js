import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import config from "../../api/config";
import { getCardHomeImagesApi } from "../../api/service";
import style from "./card.module.css";

const CArd2 = (props) => {
  // const [iamges, setIamges] = useState(null);
  // useEffect(() => {
  //   images();
  // }, []);

  // async function images() {
  //   await getCardHomeImagesApi().then((r) => 
  //   {
  //     // setIamges(r.response);
  //        console.log(r)
  //   })
  // }
  return (
    <div className={style.container}>
      {props.imgArray ? (
        <ul className={style.main}>
          <li className={style.cardli}>
            {/* Commented and modified by Ashish on 20-111-2022
            Reason- To make card responsive */}
            {/* <div
            // style={{ width: "auto", height: "auto", borderRadius: "10px" }}
              style={{ width: "auto", height: "auto" }}
            > */}
              {/* <div className={style.text}><a className={style.linkText}  href={`listing/${props.imgArray[0].menu}/${props.imgArray[0].category}`}>{props.imgArray[0].category}</a></div> */}
              <Link to={`/RRDesign`}>
                {/* <div> */}
                  <img
                    alt=""
                    className={style.imgswap}
                    src={config.staticBaseURL +props.imgArray[0].image}
                  />
                {/* </div> */}

              </Link>

            {/* </div> */}
          </li>
          <li className={style.cardli}>
          {/* <div style={{ width: "auto", borderRadius: "10px" }}> */}
            {/* <div style={{ width: "auto"}}> */}
              {/* <div
              // style={{ width: "auto", height: "auto", borderRadius: "10px" }}
                style={{ width: "auto", height: "auto"}}
              > */}
              {/* <div className={style.text}><a className={style.linkText}  href={`listing/${props.imgArray[1].menu}/${props.imgArray[1].category}`}>{props.imgArray[1].category}</a></div> */}
                <Link to={`/store-locator`}>
                  {/* <div> */}
                    <img
                      alt=""
                      className={style.imgswap}
                      src={config.staticBaseURL + props.imgArray[1].image}
                    />
                  {/* </div> */}

                </Link>

              {/* </div> */}
            {/* </div> */}
          </li>
        </ul>
      ) : null}
    </div>
  );
};

export default CArd2;
