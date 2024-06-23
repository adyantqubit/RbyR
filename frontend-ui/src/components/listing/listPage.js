import React, { createRef, useEffect, useRef, useState } from "react";
import { CircularProgress } from "@mui/material";
import { getToken } from "../../Redux-manage/services/localStorageService";
import style from "./listpage.module.css";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { getCategoryProduct, getQrDetailApi } from "../../api/service";
import Filter from "./filter";
import { CartState } from "../../context";
import {
  useCartUpdateMutation,
  useLikedUpdateMutation,
} from "../../Redux-manage/services/userAuthapi";
import { useParams, Link, useNavigate } from "react-router-dom";
import config from "../../api/config";
import Footer from "../global/footer";
import Below from "../global/below";
import Slider from "react-rangeslider";
import logo from "../../assets/photos/rts-icon.svg";

// To include the default styles
import "react-rangeslider/lib/index.css";
import NavHeader from "../global/NavHeader";

import FilterNew from "./filterNew";
import Sort from "./sort";
import { nextIndexPage } from "../../api/orderApis";
import { CgEnter } from "react-icons/cg";
import Chat from "../expandDetailt/chat";
import InstantFilter from "./InstantFilter";

const ListPage = () => {
  var {
    menus,
    nullpage,
    setNullPage,
    setCategorySelected,
    setLike,
    setAllCategoryAvai,
    allCategoryAvai,
    reload,
    setReload,
    htl,
    lth,
    availablitySelect,
    latestSelect,
    cart,
    allColorAvai,
    tempallpro,
    settemAllpro,
    currency,
    setAllColorAvai,
    setCurrency,
    setCart,
    CategoryProduct,
    setCategoryProduct,
    sortui,
    setSortUi,
    filterui,
    setfilterUi,
    productCount,
    setProductCount,
  } = CartState();
  const [saveLikeApi, { isLoading }] = useLikedUpdateMutation();
  const [cartsaveApi, { isLoad }] = useCartUpdateMutation();
  let { access_token } = getToken();
  const nav = useNavigate();
  var [pageIndex, setPageIndex] = useState(0);

  const { category, parent } = useParams();

  var [dataCount, setDatacount] = useState([]);

  // extracting selected parent menu sub list
  const [list, setList] = useState(null);
  useEffect(() => {
    setList(menus?.filter((m) => Object.keys(m)[0] === parent)[0]);
  }, [parent, menus]);

  /**
   * Added by - Ashish Dewangan on 11-12-2023
   * Reason - Method to decide wherter to show menu as images or as instant filter
   */
  useEffect(() => {
    if (list != null) {
      if (list.shownInstFilter == false) {
        if (!category || category == "0") {
          nav(`/categories/${parent}`);
        }
      }
    }
  }, [list]);
  /**
   * End of code addition by - Ashish Dewangan on 11-12-2023
   * Reason - Method to decide wherter to show menu as images or as instant filter
   */

  useEffect(() => {
    window.scrollTo(0, 0);
    window.onpopstate = () => {
      setCategorySelected([]);
    };
  }, []);

  // console.log(CategoryProduct, "category productt");
  useEffect(() => {
    // console.log(category, parent);
    // console.log("on reload change call___", reload, CategoryProduct);
    if (reload == false) {
      PageLoad();
      Apicall();
    }
  }, [reload]);

  //  Commented by Rohan
  //  reason- Navlinks are not working on reclick when when i am in this page.
  //  Jira issue- RBYR229

  useEffect(() => {
    setNullPage(false);
    setReload(true);
    ApiReSet();

    // catApi();

    // console.log(parent);
    document.getElementById("scrolled").scrollTop = 0;
  }, [category, parent, htl, lth, availablitySelect, latestSelect]);

  async function ApiReSet() {
    // console.log("On category change call-----------", CategoryProduct, reload);
    setPageIndex(0);
    CategoryProduct = [];
    setCategoryProduct(CategoryProduct);
    settemAllpro([]);
  }

  const lastref = useRef();
  var [loading, setLoading] = useState(false);
  var [oldscroll, setoldScroll] = useState(0);
  var [showOptions, setShowOptions] = useState(false);
  console.log(CategoryProduct,'oooooooo')

  const handleScroll = (e) => {
    var listHeight = lastref.current.scrollHeight;
    // console.log(`scrollHeight-${e.target.scrollHeight}, scrollTop-${e.target.scrollTop},client height-${e.target.clientHeight},footerHeight-${footerHeight}`)
    //     const bottom = e.target.scrollHeight-e.target.clientHeight-footerHeight <e.target.scrollTop &&  e.target.scrollHeight-e.target.clientHeight-footerHeight+300>e.target.scrollTop;

    var bottom = e.target.scrollTop > listHeight - 300;

    if (bottom && reload) {
      setReload(false);
      setLoading(true);
      // console.log("inside scroll call");
    }

    // console.log("----------", e.target.scrollTop, oldscroll);

    if (oldscroll > e.target.scrollTop) {
      setShowOptions(true);
      setoldScroll(e.target.scrollTop);
    } else {
      setShowOptions(false);
      setoldScroll(e.target.scrollTop);
    }
  };

  async function PageLoad() {
    pageIndex = pageIndex + 1;
    setPageIndex(pageIndex);
  }

  async function Apicall() {
    const data = {
      pageIndex: pageIndex,
      category: category,
      parent: parent,
      lth: lth,
      htl: htl,
      latest: latestSelect,
      availablity: availablitySelect,
    };

    // console.log("next page call", pageIndex);

    await nextIndexPage(data).then((r) => {
      // console.log("response from backend_______", r);
      setTimeout(() => {
        if (r.error) {
          setReload(false);
          setLoading(false);

          if (CategoryProduct.length == 0) setNullPage(true);
        } else {
          // console.log(CategoryProduct);
          setAllCategoryAvai([...r.categories]);
          var temp = r.products.filter(
            (c) => CategoryProduct.filter((g) => g.id == c.id).length == 0
          );
          var temp2 = r.products.filter(
            (c) => tempallpro.filter((g) => g.id == c.id).length == 0
          );
          setCategoryProduct([...CategoryProduct, ...temp]);
          settemAllpro([...tempallpro, ...temp2]);
          setAllColorAvai(r.colors);
          setReload(true);

          setProductCount(r.productsCount);
        }
      }, 200);
    });
  }
  // console.log(productCount,'productcounnn')
  function scrollTop() {
    // console.log("top");
    document.getElementById("scrolled").scrollTop = 0;
  }

  const catApi = async () => {
    await getCategoryProduct(category).then((r) => {
      setCategoryProduct([...r.category]);
      settemAllpro([...r.category]);
      console.log(r.category);
    });

    // console.log(dataCount,'check')
  };

  function openDetail(id) {
    // added by rohan on - 18/2/23
    // Reason - jumping into detail page according to category presence
    if (id.category.length)
      nav(`/listing/${id.menu}/${id.category}/detail/${id.id}`);
    else {
      nav(`/listing/${id.menu}/0/detail/${id.id}`);
    }
  }

  // Modification and addition by Om Shirvastava on 05-12-23
  // Reason : Show the count, I need to change this logic
  // console.log(CategoryProduct)
  // let counter = 0;
  // for (const obj of CategoryProduct) {
  //   counter++;
  // }

  let countTrueValues = CategoryProduct.reduce((count, obj) => {
    return count + (obj.is_active === true ? 1 : 0);
  }, 0);
  // console.log(countTrueValues);
  // End of modification and addition by Om Shirvastava on 05-12-23
  // Reason : Show the count, I need to change this logic

  // Addition by Om Shrivastava on 24-12-23
  // Reason : Need to arrange the product name to increasing order
  const categoryProAscending = [...CategoryProduct].sort((a, b) => a.id - b.id);
  // End of addition by Om Shrivastava on 24-12-23
  // Reason : Need to arrange the product name to increasing order

  return (
    <>
      {/* {showOptions?<NavHeader/>:null} */}
      <NavHeader />
      <div className={style.Container} id="scrolled" onScroll={handleScroll}>
      <div  className={style.divContainer} >

        <div
          className={style.bottom}
          // style={sortui?{opacity:"0.7"}:null}
        ></div>
        <div
          className={style.bottom}
          // style={sortui?{opacity:"0.7",}:null}
        >
          {CategoryProduct ? (
            <div className={style.category}>
              {category != "0" ? (
                <span
                  className={style.TopContent}
                  style={{
                    // paddingLeft: "5%",
                    fontWeight: "550",
                    whiteSpace: "nowrap",
                  }}
                >
                  {category.split("_").join(" ")}
                  {/* categoryyyyy */}
                </span>
              ) : (
                <div
                  className={style.TopContent}
                  style={{
                    // paddingLeft: "5%",
                    fontWeight: "550",
                    whiteSpace: "nowrap",
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <div>{parent.split("_").join(" ")}</div>
                  <div className={style.totalProduct}>
                    {CategoryProduct && CategoryProduct.length > 0 ? (
                      <span
                        className={style.totalProduct}
                        // style={{
                        //   fontSize: "17px",
                        //   fontWeight: "lighter",
                        //   textTransform: "capitalize",
                        //   paddingLeft: "20px",
                        // }}
                      >
                        {" "}
                        Products ({productCount})
                      </span>
                    ) : (
                      <span></span>
                    )}
                  </div>
                </div>
              )}

              {/* commented by -rohan- on - 18/2/23
                  Reason - Hidding  */}
              {/* <span className={`${style.filter} ${style.sortfilterres}`} style={{ paddingRight: "40px", height: "100%", fontWeight: "600px", whiteSpace: "nowrap" }}>
                <span style={{ paddingRight: "15px", color: "grey", cursor: "pointer" }} onClick={e => setSortUi(true)}>Sort by</span>
                <span style={{ cursor: "pointer", fontWeight: "600" }} onClick={e => setfilterUi(true)}>Filter BY</span>
              </span> */}
              {/* end of code- 18/2/23 */}
            </div>
          ) : null}
        </div>

        {/* Commented by Om Shrivastava on 23-11-23
Reason : Need to comment the filter functionality  */}
        {/* <div
          className={style.filterContainres}
          style={{
            zIndex: "0",
            height: showOptions ? "8%" : "0",
            transition: "all .2s ease-out",
          }}
        >
          <div className={style.filterInner}>
            <div className={style.filterheader}>
              <div
                className={style.filterHeaderInner}
                style={{ margin: "10px 0" }}
              >
                {/* <span className={style.shopbtn1}
                  onClick={e => setSortUi(true)}>SORT BY</span> */}
        {/* <span
                  className={style.shopbtn1}
                  onClick={(e) => setfilterUi(true)}
                >
                  FILTER
                </span>
              </div>
            </div>
          </div>
        </div> */}
        {/* */}

        {/* End of commented code by Om Shrivastava on 23-11-23
Reason : Need to comment the filter functionality */}

        {/* Added by rohan - on -18/2/23
            Reason- spliting content into two columns one for fliter and one for showing product */}
        <div className={style.row}>
          {/* this row is used to show all instant filter option */}
          {list != null ? (
            list.shownInstFilter && allCategoryAvai.length > 1 ? (
              <div className={style.instFilter}>
                <InstantFilter />
              </div>
            ) : null
          ) : null}

          {/* second row for showing all product list */}
          <div
            className={style.cardContainer}
            // style={sortui?{opacity:"0.7"}:null}
            ref={lastref}
          >
            {CategoryProduct.length > 0 ? (
              // Modification and addition by Om Shrivastava on 24-12-23
              // Reason : Arrange the product name according to their id
              // CategoryProduct.map((p, i) => {
              categoryProAscending.map((p, i) => {
                console.log(categoryProAscending, "hhhhhhhhhh");
                // End of modification and addition by Om Shrivastava on 24-12-23
                // Reason : Arrange the product name according to their id

                var temp = false;
                if (parent != "ready to ship" && parent != "best seller")
                  if (category != 0) {
                    if (p.category == category) {
                      temp = true;
                    } else {
                      temp = false;
                    }
                  } else {
                    if (p.menu == parent) {
                      temp = true;
                    } else {
                      temp = false;
                    }
                  }
                else {
                  temp = true;
                }

                if (temp)
                  return (
                    <>
                      {p.is_active == true ? (
                        <div
                          className={style.card}
                          onClick={(e) => openDetail(p)}
                        >
                          <img
                            src={config.staticBaseURL + p.img_main}
                            // Modification and addition by Om Shrivastava on 15-11-23
                            // Reason : Need to add the classname of the image
                            // className={style.img}
                            className={style.bestSellerImage}
                            // End of modification and addition by Om Shrivastava on 15-11-23
                            // Reason : Need to add the classname of the image
                          ></img>
                          <div className={style.title}>
                            {/* <span>{p.title}</span> */}
                            <span>{p.title.toLowerCase()}</span>
                          </div>
                          <div className={style.price}>
                            {/* Modification and addition by Om Shrivastava on 18-06-2024
                      Reason : Remove the commas and decimal value  */}
                            {/* {(p.price * currency.value).toFixed(2)} */}
                            {/* Modification and addition by Om Shrivastava on 20-06-2024
                            Reason : Show the discountant amount which product on_sale  */}
                            {/* {(p.price * currency.value).toLocaleString("en-IN")} */}
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
                            {/* End of Modification and addition by Om Shrivastava on 20-06-2024
                            Reason : Show the discountant amount which product on_sale  */}
                            {/* Modification and addition by Om Shrivastava on 18-06-2024
                      Reason : Remove the commas and decimal value  */}
                          </div>
                          {p.ready_to_ship ? (
                            <div className={style.readyContainer}>
                              <div className={style.readyBox}>
                                <img src={logo} className={style.readyIcon} />
                                Ready To Ship
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ) : // <div style={{ width: "100%", textAlign: "center" }}>
                      //   <div
                      //     className={style.noresult}
                      //     style={{ width: "100%", textAlign: "center" }}
                      //   >
                      //     No products found !
                      //   </div>
                      //   <span style={{ fontSize: "14px" }}>
                      //     Please change Your search criteria and try again. If
                      //     still not finding anything relevant, please visit
                      //     the Home page and try out some of our bestsellers!
                      //   </span>
                      // </div>
                      null}
                    </>
                  );
              })
            ) : nullpage ? null : (
              <div style={{ width: "100%" }}>
                <div class="centered">
                  <div class="blob-1"></div>
                  <div class="blob-2"></div>
                </div>
              </div>
            )}

            {nullpage && CategoryProduct.length == 0 ? (
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
                  Please change Your search criteria and try again. If still not
                  finding anything relevant, please visit the Home page and try
                  out some of our bestsellers!
                </span>
              </div>
            ) : null}
          </div>
        </div>
        {/* End of code -18/2/23 */}

        {sortui ? <Sort /> : null}

        {filterui ? <FilterNew scrolling={scrollTop} /> : null}

        {loading ? (
          // <div style={{ width: "100%", background: "white" }}>
          <div className={style.loader}>
            <div class="centered">
              <div class="blob-1"></div>
              <div class="blob-2"></div>
            </div>
          </div>
        ) : null}

        <div className={style.foot}>
          <Footer />
          {/* Commented by - Ashish Dewangan on 15-02-2023
          Reason - To hide text that appear below footer */}
          {/* <Below /> */}
          {/* End of comment */}
        </div>
      </div>
      </div>

    </>
  );
};

export default ListPage;
