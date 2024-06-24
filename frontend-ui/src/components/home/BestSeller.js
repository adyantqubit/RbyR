import React, { useEffect, useState } from "react";
import style from "./bestseller.module.css";
import image from "../../assets/photos/model.jpg";
import Carousel from "react-grid-carousel";
import { CartState } from "../../context";
import image2 from "../../assets/photos/best.jpg";
import { useNavigate } from "react-router-dom";
import config from "../../api/config";
// import Carousel from 'react-grid-carousel'

const BestSeller = () => {
  const { product, setProduct, currency, setCategorySelected } = CartState();
  const [bestProducts, setbest] = useState([]);
  const [imageSwap, setImageSwap] = useState(false);
  const nav = useNavigate();
  useEffect(() => {
    // Modification and addition by Om Shrivastava on 22-10-23
    // Reason : Need to set the is_active feature of this page
    // setbest(product.filter(p => p.bestSeller == true ))
    /**
     * Commented and modified by - Ashish Dewangan on 08-12-2023
     * Reason - To arrange bestseller order according to their id
     */
    // setbest(product.filter(p => p.bestSeller == true && p.is_active==true))
    setbest(
      [].concat(
        product
          .filter((p) => p.bestSeller == true && p.is_active == true)
          .sort((a, b) => (a.id > b.id ? 1 : -1))
      )
    );
    /**
     * End of code modification by - Ashish Dewangan on 08-12-2023
     * Reason - To arrange bestseller order according to their id
     */
    // End of Modification and addition by Om Shrivastava on 22-10-23
    // Reason : Need to set the is_active feature of this page
  }, [product]);

  function swapImage(i) {
    let temp = bestProducts[i].img_main;
    bestProducts[i].img_main = bestProducts[i].img_sub1;
    // Modification and addition by Om Shrivastava on 27-12-23
    // Reason : No need to use this code yet, becuase it effect the hover functionality
    //    let imgg2 = bestProducts[i].img_sub2
    //     bestProducts[i].img_sub1 = imgg2
    //     bestProducts[i].img_sub2= temp
    bestProducts[i].img_sub1 = temp;
    // setbest(bestProducts)
    // setImageSwap(!imageSwap)
    // End of modification and addition by Om Shrivastava on 27-12-23
    // Reason : No need to use this code yet, becuase it effect the hover functionality
  }
  // console.log(bestProducts,'datass')

  const newArray = bestProducts.map(
    ({
      L,
      M,
      S,
      XL,
      XS,
      XXL,
      XXXL,
      is_active,
      available,
      bestSeller,
      careTip,
      category,
      color,
      date,
      description,
      fabric,
      like,
      menu,
      price,
      ready_to_ship,
      ready_to_ship_days,
      search_key,
      shipping_charges,
      shipping_days,
      style_code,
      subMenu,
      title,
      upper_menu,
      made_in,
      ...rest
    }) => rest
  );
  // console.log(newArray);

  return (
    <>
    {bestProducts?.length > 0 ? (
      <div>
        <div className={style.container}>
          {bestProducts?.length > 0 ? (
            <div className={style.branding}>
              <div className={style.heading}> Best Seller </div>
            </div>
          ) : null}

          <div className={style.sliderContainer}>
            {imageSwap
              ? bestProducts.toReversed().map((m, i) => {
                  if (i < 12)
                    return (
                      <div
                        className={style.card}
                        onMouseEnter={(e) => swapImage(i)}
                        onMouseLeave={(e) => swapImage(i)}
                        onClick={(e) => {
                          nav(
                            `/listing/${m.menu}/${m.category}/detail/${m.id}`
                          );
                        }}
                      >
                        <img
                          src={config.staticBaseURL + m.img_main}
                          className={style.img}
                          onMouseEnter={(e) => swapImage(i)}
                          onMouseLeave={(e) => swapImage(i)}
                        />
                        <div className={style.absolute}>
                          <div className={style.name}>
                            {m.title.toLowerCase()}
                          </div>
                          <div className={style.name}>
                            {currency.sign}
                            {(m.price * currency.value).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );
                })
              : bestProducts.toReversed().map((m, i) => {
                  if (i < 12)
                    return (
                      <div
                        className={style.card}
                        onMouseEnter={(e) => swapImage(i)}
                        onMouseLeave={(e) => swapImage(i)}
                        onClick={(e) => {
                          nav(
                            `/listing/${m.menu}/${m.category}/detail/${m.id}`
                          );
                        }}
                      >
                        <img
                          src={config.staticBaseURL + m.img_main}
                          className={style.img}
                        />
                        <div className={style.absolute}>
                          <div className={style.name}>
                            {m.title.toLowerCase()}
                          </div>
                          <div className={style.name}>
                            {currency.sign}
                            {(m.price * currency.value).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );
                })}
          </div>
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            {bestProducts.length > 12 ? (
              <button
                onClick={(e) => {
                  setCategorySelected([]);
                  nav(`/listing/best seller/0`);
                }}
                className={`${style.button_arounder} ${style.button_b}`}
              >
                View More
              </button>
            ) : null}
          </div>
        </div>
      </div>
       ) : null}
    </>
  );
};

export default BestSeller;
