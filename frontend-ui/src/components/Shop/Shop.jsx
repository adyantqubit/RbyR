import React, { useEffect, useState, useRef } from "react";
import Footer from "../global/footer";
import NavHeader from "../global/NavHeader";
import style from "./shop.module.css";
import parse from "html-react-parser";
import { notification } from "antd";
import { CartState } from "../../context";
import { useNavigate } from "react-router-dom";
import config from "../../api/config";
import logo from "../../assets/photos/rts-icon.svg";

import "../../context.css";
import Navbar from "../global/NavHeader";

const Shop = () => {
  const {
    product,
    nullpage,
    setNullPage,
    setProduct,
    currency,
    setCategorySelected,
    reload,
    setReload,
  } = CartState();
  var [loading, setLoading] = useState(false);
  var [oldscroll, setoldScroll] = useState(0);
  var [showOptions, setShowOptions] = useState(false);
  const nav = useNavigate();
  const lastref = useRef();

  const handleScroll = (e) => {
    var listHeight = lastref.current.scrollHeight;

    var bottom = e.target.scrollTop > listHeight - 300;

    if (bottom && reload) {
      setReload(false);
      setLoading(true);
    }

    if (oldscroll > e.target.scrollTop) {
      setShowOptions(true);
      setoldScroll(e.target.scrollTop);
    } else {
      setShowOptions(false);
      setoldScroll(e.target.scrollTop);
    }
  };
  function openDetail(id) {
    if (id.category.length)
      nav(`/listing/${id.menu}/${id.category}/detail/${id.id}`);
    else {
      nav(`/listing/${id.menu}/0/detail/${id.id}`);
    }
  }
  console.log(product);
  return (
    <>
      <Navbar />
      <div className={style.Container} id="scrolled" onScroll={handleScroll}>
        <div className={style.divContainer}>
          <div className={style.bottom}></div>
          <div className={style.bottom}>
            <div className={style.category}>
              <span
                className={style.TopContent}
                style={{
                  // paddingLeft: "5%",
                  fontWeight: "550",
                  whiteSpace: "nowrap",
                }}
              >
                Shop
              </span>
            </div>
          </div>

          <div className={style.row}>
            <div className={style.cardContainer} ref={lastref}>
              {product.length > 0 ? (
                product.map((p, i) => {
                  return (
                    <>
                      {p.is_active == true ? (
                        <div
                          className={style.card}
                          onClick={(e) => openDetail(p)}
                        >
                          <img
                            src={config.staticBaseURL + p.img_main}
                            // src='https://cdn.pixelbin.io/v2/black-bread-289bfa/81ub5U/t.resize(w:1000)/manish-product/MM-P-PR-TUOLD-43355-PL_C-XS/300/MM-P-PR-TUOLD-43355-PL_C-XS_1_8295.webp'
                            className={style.bestSellerImage}
                          ></img>
                          
                          <div className={style.title}>
                            <span>{p.title.toLowerCase()}</span>
                          </div>
                          <div className={style.price}>
                            {p.is_sale == true ? (
                              <>
                                <strike>
                                  {" "}
                                  {currency.sign}{" "}
                                  {(p.price * currency.value).toLocaleString(
                                    "en-IN"
                                  )}
                                </strike>
                                <div>
                                  {" "}
                                  {currency.sign}{" "}
                                  {(
                                    p.price *
                                    (1 - p.sale_discount_percentage / 100) *
                                    currency.value
                                  ).toLocaleString("en-IN")}
                                </div>
                              </>
                            ) : (
                              <>
                                {currency.sign}{" "}
                                {(p.price * currency.value).toLocaleString(
                                  "en-IN"
                                )}
                              </>
                            )}
                          </div>
                          {p.ready_to_ship ? (
                            <div className={style.readyContainer}>
                              <div className={style.readyBox}>
                                {/* <img src={logo} className={style.readyIcon} /> */}
                                Ready To Ship
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </>
                  );
                })
              ) : nullpage ? null : (
                <div style={{ width: "100%" }}>
                   {/* Modification and addition by Om Shrivastava on 06-07-2024
                  Reason : Change the loader  */}
                  {/* <div class="centered">
                    <div class="blob-1"></div>
                    <div class="blob-2"></div>
                  </div> */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img src="adyant_loader.gif" />
                  </div>
                  {/* End of modification and addition by Om Shrivastava on 06-07-2024
                  Reason : Change the loader  */}
                </div>
              )}

              {nullpage && product.length == 0 ? (
                <div style={{ width: "100%", textAlign: "center" }}>
                  <div
                    className={style.noresult}
                    style={{ width: "100%", textAlign: "center" }}
                  >
                    No products found !
                  </div>
                  <span
                    style={{
                      fontSize: "14px",
                      fontFamily: "sans-serif",
                      letterSpacing: "1px",
                    }}
                  >
                    Please change Your search criteria and try again. If still
                    not finding anything relevant, please visit the Home page
                    and try out some of our catalogs!
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {loading ? (
            // <div style={{ width: "100%", background: "white" }}>
            <div className={style.loader}>
              {/* Modification and addition by Om Shrivastava on 06-07-2024
                  Reason : Change the loader  */}
                  {/* <div class="centered">
                    <div class="blob-1"></div>
                    <div class="blob-2"></div>
                  </div> */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img src="adyant_loader.gif" />
                  </div>
                  {/* End of modification and addition by Om Shrivastava on 06-07-2024
                  Reason : Change the loader  */}
            </div>
          ) : null}

          <div className={style.foot}>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
