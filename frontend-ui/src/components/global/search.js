import { style } from "@mui/system";
import { Button, Drawer, message } from "antd";
import React, { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { AiOutlineClosee } from "react-icons/ai";
import { GrClose } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import config from "../../api/config";
import { getSearchedProducts } from "../../api/service";
import { CartState } from "../../context";
import styles from "./search.module.css";
import "./search.css";
import { notification } from "antd";
import { stringify } from "rc-field-form/es/useWatch";
import { MdOutlineArrowBack } from "react-icons/md";
const Search = () => {
  notification.destroy();
  const [open, setOpen] = useState(false);
  const {
    product,
    allResult,
    setAllResult,
    currency,
    filteredPersons,
    setFilteredPersons,
    searchmsg,
    setSearchMsg,
    allCategory,
    setAllCategory,
  } = CartState();

  // Added by Ashish dewangan on 18-11-2022
  // Reason - to have cross button on search icon more width
  // Jira issue no - RBYR -141
  const [msg, setMsg] = useState(null);

  // Addition by Om Shrivastava on 23-11-23
  // Reason : Set the drawer searh width
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [drawerwidth, setDrawerwidth] = useState(600);
  // End of Addition by Om Shrivastava on 23-11-23
  // Reason : Set the drawer searh width

  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }

  useEffect(() => {
    if (windowSize.innerWidth < 500) setDrawerwidth(330);
    else if (windowSize.innerWidth < 800) setDrawerwidth(450);
    else if (windowSize.innerWidth > 800) setDrawerwidth(600);
  }, [windowSize]);

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [window.innerWidth]);

  function searchProductAfterEnterPressed(event) {
    if (event.keyCode === 13) {
      searchProduct();
    }
  }

  useEffect(() => {
    setSearchMsg(localStorage.getItem("searchkey"));
    setFilteredPersons(JSON.parse(localStorage.getItem("searchproduct")));
    setAllCategory(JSON.parse(localStorage.getItem("searchcategory")));
  }, []);

  

  const searchProduct = async () => {
    var searchBox = document.getElementById("searchBox");
    setSearchMsg(searchBox.value);
    const searchedData = await getSearchedProducts(searchBox.value);
    if (searchedData.result && searchedData.result.length > 0) {
      setAllResult(searchedData.result);
      setFilteredPersons(searchedData.result);
      setMsg(null);
      setAllCategory(searchedData.categories);
      localSaveproduct(searchedData.result, searchedData.categories);
    } else {
      setMsg("Result not found!");
      // console.log('iiiiiiii')
      setFilteredPersons([]);
    }
  };

  // Added by Om Shrivastava on 23-11-23
  // Reason : When user refresh the page then search product related data is clear
  useEffect(() => {
    const navigationEntries = window.performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0 && navigationEntries[0].type === 'reload') {
      localStorage.removeItem("searchkey");
      localStorage.removeItem("searchproduct");
      localStorage.removeItem("searchcategory");
      setFilteredPersons([]);
      setSearchMsg("");
    }
  }, []);
  // End of Added by Om Shrivastava on 23-11-23
  // Reason : When user refresh the page then search product related data is clear

  // End of code addition

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    // document.getElementById("searchBox").value="";
    // setFilteredPersons([]);
    setMsg(null);
    setOpen(false);
    // console.log('closeeeeeee')
    // Addition by Om Shrivastava on 23-11-23
    // Reason : Need to remove the localstorage search data
    localStorage.removeItem("searchkey");
    localStorage.removeItem("searchproduct");
    localStorage.removeItem("searchcategory");
    setFilteredPersons([]);
    setSearchMsg("");
    // End of addition  by Om Shrivastava on 23-11-23
    // Reason : Need to remove the localstorage search data
  };

  const nav = useNavigate();
  function openDetail(id) {}

  function localSavekey(name) {
    localStorage.setItem("searchkey", name);
  }

  function localSaveproduct(product, category) {
    localStorage.setItem("searchproduct", JSON.stringify(product));
    localStorage.setItem("searchcategory", JSON.stringify(category));
  }

  // Added on - 11/1/23 by Rohan
  // Adding category filter functionality
  const [selectedCategory, setSelectedCategory] = useState([]);
  useEffect(() => {
    if (selectedCategory.length > 0) {
      setFilteredPersons(
        allResult.filter(
          (a) =>
            selectedCategory.includes(a.category) ||
            selectedCategory.includes(a.menu)
        )
      );
    }
  }, [selectedCategory]);

  function filter() {
    setFilteredPersons(
      allResult.filter(
        (a) =>
          selectedCategory.includes(a.category) ||
          selectedCategory.includes(a.menu)
      )
    );

    if (selectedCategory.length == 0) setFilteredPersons(allResult);
  }


  // End of code
  return (
    <>
      <BsSearch
        style={{
          fontSize: "22px",
          marginTop: "10px",
          color: "var(--iconsColor)",
        }}
        type="primary"
        onClick={showDrawer}
      />

      <Drawer
        // Modification and addition by Om Shrivastava on 23-11-23
        // Reason : Set the drawer search width
        // width={window.innerWidth > 768 ? 650 : "100%"}
        width={drawerwidth}   
        // End of Modification and addition by Om Shrivastava on 23-11-23
        // Reason : Set the drawer search width
        // Modification and addition by Om Shrivastava on 23-11-23
        // Reason :Need to add the padding
        // closeIcon={<GrClose className="searchSVG" />}
        title={<div className="likeTitle">Search</div>}
        closeIcon={<MdOutlineArrowBack className="likeSVG" />}
        // End of Modification and addition by Om Shrivastava on 23-11-23
        // Reason :Need to add the padding

        headerStyle={{
          height: "200px",
          backgroundColor: "var(--backgroundColorPrimary)",
          // Added by Om Shrivastava on 23-11-23
          // Reason :Need to add the padding
          padding: "8px",
          // End of addition by Om Shrivastava on 23-11-23
          // Reason :Need to add the padding
        }}
        placement="right"
        onClose={onClose}
        open={open}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div
          style={{
            width: "100%",
            height: "auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "95%",
              height: "auto",
              // Modi
              // padding: "10px 0px",
              padding: "3px 0px",

              borderBottom: "1px solid black",
            }}
          >
            
            <input
              className={styles.cutomDrawerInput}
              type="text"
              id="searchBox"
              style={{
                outline: "0px",

                // height: "50px",
                height: "20px",

                border: "none",
                fontFamily: "Arial, FontAwesome",
                fontSize: "15px",
                color: "var(--textColorPrimary)",
                width: "91%",
                paddingLeft: "5px",
                paddingRight:'5px',
              }}
              value={searchmsg}
              onChange={(e) => {
                setSearchMsg(e.target.value);
                localSavekey(e.target.value);
              }}
              placeholder="Type what you are looking for..."
              onKeyUp={searchProductAfterEnterPressed}
            ></input>
            <BsSearch
              onClick={searchProduct}
              style={{
                // marginRight: "20px",
                fontSize: "20px",
                color: "var(--textColorPrimary)",
                width: "1em",
                height: "1em",
              }}
            />
          </div>
          {/* <button onClick={searchProduct}>search</button> */}
        </div>

        {/* Added by Rohan - on 11/1/23
         Reason-category selection ui and functionality */}
        {/* Modification and addition by Om Shrivastava on 23-11-23
        Reason : No need to show this field yet */}
        {/* <div className={styles.categoryContainer} style={{border:'1px solid black'}}>
          {/* Commented by Om Shrivastava on 11-11-23 */}
        {/* <div className={styles.filterTitle}>FILTER BY CATEGORIES</div> */}
        {/* End of commented code by Om Shrivastava on 11-11-23 */}
        {/* <div className={styles.categoryItems} style={{border:'2px solid green'}}>
              {allCategory?.map(m=>
               selectedCategory.includes(m)?
               <button className={`${styles.category} ${styles.selected}`} onClick={e=>{setSelectedCategory(selectedCategory.filter(s=>s!=m)); filter(selectedCategory.filter(s=>s!=m))}}>
                 {m}
                </button>
                :
                <button className={`${styles.category}`} onClick={e=>{setSelectedCategory([...selectedCategory,m]); filter()}}>
                {m}
               </button>
                )}
            </div> */}
        {/* </div> */}
        {/* End of modification and addition by Om Shrivastava on 23-11-23
        Reason : No need to show this field yet */}
        {/* End of code */}
        <div className={styles.slab}>
          {filteredPersons && filteredPersons.length > 0 ? (
            <>
              {filteredPersons.map((p) => {
                return (
                  <div className={styles.item}>
                    <Link
                      to={`/listing/${p.menu}/${p.category}/detail/${p.id}`}
                      onClick={onClose}
                    >
                      <img
                        className={styles.searchedImage}
                        src={config.staticBaseURL + p.img_main}
                        onClick={(e) => openDetail(p)}
                      ></img>
                    </Link>
                    <div className={styles.title}>
                      {/* <span className={styles.productName}>{p.title}</span> */}
                      <span className={styles.productName}>{p.title.toLowerCase()}</span>

                    </div>
                    <div className={styles.price}> {p.category}</div>
                    <div className={styles.price}>
                      {/* Modification and addition by Om Shrivastava on 18-06-2024
                      Reason : Remove the commas and decimal value  */}
                      {/* {currency.sign} {(p.price * currency.value).toFixed(2)} */}
                      {/* {currency.sign} {(p.price * currency.value).toLocaleString("en-IN")} */}
                      {/* Modification and addition by Om Shrivastava on 20-06-2024
                            Reason : Show the discountant amount which product on_sale  */}
                      {/* {currency.sign} {(p.price * currency.value).toLocaleString("en-IN")} */}

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

                       {/* End of modification and addition by Om Shrivastava on 18-06-2024
                      Reason : Remove the commas and decimal value  */}

                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            // Modification and addition by Om Shrivastava on 11-11-23
            // Reason : Apply some designing in message
            // <div>{msg}</div>
            <div
            // Modification and addition by Om Shrivastava on 23-11-23
                // Reason : Set the width 
            className={styles.dataNotPresentMessasge}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              //   alignItems: "center",
              //   width: "100vw",
              // }}
              // End of Modification and addition by Om Shrivastava on 23-11-23
                // Reason : Set the width 
            >
              {msg}
            </div>
            // End of modification and addition by Om Shrivastava on 11-11-23
            // Reason : Apply some designing in message
          )}
        </div>
      </Drawer>
    </>
  );
};

export default Search;
