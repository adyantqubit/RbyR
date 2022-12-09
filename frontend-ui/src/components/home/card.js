import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import config from "../../api/config";
import { getCardHomeImagesApi } from "../../api/service";
import ImageChageComponent2, { ImageSwapper } from "./AutoChange";
import AutoCard from "./AutoChange";
import ImageSwapper2 from "./AutoChange2";
import style from "./card.module.css";

const Card = () => {
  const [iamges, setIamges] = useState({});
  useEffect(() => {
    images();
  }, []);

  async function images() {
    await getCardHomeImagesApi().then((r) => setIamges(r.response));
  }
  return (
    <div className={style.container}>
      {iamges ? (
        <ul className={style.main}>
          <li className={style.cardli}>
            {/* Commented and modified by Ashish on 20-111-2022
            Reason- To make card responsive */}
            {/* <div
            // style={{ width: "auto", height: "auto", borderRadius: "10px"}}
              // style={{ width: "auto", height: "auto"}}
            > */}
            {/* <div className={style.text}></div> */}
              <Link to={`listing/${iamges.category_top1}`}>
                <ImageSwapper />
                <div className={style.text}><a className={style.linkText}  href={`listing/${iamges.category_top1}`}>{iamges.category_top1}</a></div>

              </Link>

            {/* </div> */}
          </li>
          <li className={style.cardli}>
            {/* <div
            // style={{ width: "auto", height: "auto", borderRadius: "10px" }}
              // style={{ width: "auto", height: "auto"}}
            > */}
            {/* <div className={style.text}>{iamges.category_top2}</div> */}
              <Link to={`listing/${iamges.category_top2}`}>
                <ImageSwapper2 />
                <div className={style.text}><a className={style.linkText}  href={`listing/${iamges.category_top2}`}>{iamges.category_top2}</a></div>
              </Link>

            {/* </div> */}
          </li>
        </ul>
      ) : null}
    </div>
  );
};

export default Card;
