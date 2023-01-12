import { style } from "@mui/system";
import { Button, Drawer, message } from "antd";
import React, { useEffect, useState } from "react";
import {  BsSearch } from "react-icons/bs";
import {AiOutlineClosee} from 'react-icons/ai'
import {GrClose} from 'react-icons/gr'
import { Link, useNavigate } from "react-router-dom";
import config from "../../api/config";
import { getSearchedProducts } from "../../api/service";
import { CartState } from "../../context";
import styles from "./search.module.css";
import "./search.css"
import { notification } from "antd";
import { stringify } from "rc-field-form/es/useWatch";
const Search = () => {
  notification.destroy()
  const [open, setOpen] = useState(false);
  const { product,allResult,setAllResult ,currency,filteredPersons, setFilteredPersons,searchmsg,setSearchMsg,allCategory,setAllCategory} = CartState();

// Added by Ashish dewangan on 18-11-2022
// Reason - to have cross button on search icon more width
// Jira issue no - RBYR -141
  const [msg,setMsg]=useState(null);

  function searchProductAfterEnterPressed(event) {
    
    if(event.keyCode === 13){
      searchProduct();
    }
  }

  useEffect(()=>{
     setSearchMsg(localStorage.getItem("searchkey"))
     setFilteredPersons(JSON.parse(localStorage.getItem("searchproduct")))
     setAllCategory(JSON.parse(localStorage.getItem('searchcategory')))
  },[])

  const searchProduct = async () => {
    var searchBox = document.getElementById("searchBox");
    setSearchMsg(searchBox.value)
    const searchedData = await getSearchedProducts(searchBox.value);
    if(searchedData.result&&searchedData.result.length>0){
      setAllResult(searchedData.result);
      setFilteredPersons(searchedData.result);
      setMsg(null); 
      setAllCategory(searchedData.categories)
      localSaveproduct(searchedData.result,searchedData.categories)
    }else{
      setMsg("Result not found!");
      setFilteredPersons([]);
    }
  };
// End of code addition

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    // document.getElementById("searchBox").value="";
    // setFilteredPersons([]);
    setMsg(null)
    setOpen(false);
  };

  const nav = useNavigate();
  function openDetail(id) {}


  function localSavekey(name){
    localStorage.setItem("searchkey",name)
  }

  function localSaveproduct(product,category){
    localStorage.setItem("searchproduct",JSON.stringify(product))
    localStorage.setItem("searchcategory",JSON.stringify(category))
  }

  // Added on - 11/1/23 by Rohan
  // Adding category filter functionality
  const [selectedCategory,setSelectedCategory]= useState([])
  useEffect(()=>{
     if(selectedCategory.length>0){

      setFilteredPersons(allResult.filter(a=>
        selectedCategory.includes(a.category)||selectedCategory.includes(a.menu)
        ))

     }
  },[selectedCategory])

  function filter(){
    setFilteredPersons(allResult.filter(a=>
      selectedCategory.includes(a.category)||selectedCategory.includes(a.menu)
      ))

      console.log(selectedCategory.length)
      if(selectedCategory.length==0)
      setFilteredPersons(allResult)
  }

  // End of code
  return (
    <>
      <BsSearch
        style={{ fontSize: "22px", marginTop: "10px", color: "#7c7c7c" }}
        type="primary"
        onClick={showDrawer}
      />

      <Drawer
        width={window.innerWidth>768 ? 650 : "100%"}
        closeIcon={<GrClose className="searchSVG"/>}
       
        headerStyle={{ height: "200px", backgroundColor: "white" }}
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
              width: "90%",
              height: "auto",
              padding:"10px 0px",
              borderBottom: "1px solid black",
            }}
          >
            <BsSearch
            onClick={searchProduct}
              style={{
                marginRight: "20px",
                fontSize: "20px",
                color: "#7c7c7c",
                width:"1em",
                height:"1em",
              }}
            />
            <input
              type="text"
              id="searchBox"
              style={{
                outline: "0px",
                height: "50px",
                border: "none",
                fontFamily: "Arial, FontAwesome",
                fontSize: "15px",
                color: "#7c7c7c",
                width: "80%",
                paddingLeft:"10px"
              }}
              value={searchmsg}
              onChange={e=>{setSearchMsg(e.target.value); localSavekey(e.target.value)}}
              placeholder="Type what you are looking for..."
              onKeyUp={searchProductAfterEnterPressed}
            ></input>
          </div>
          {/* <button onClick={searchProduct}>search</button> */}
        </div>

        {/* Added by Rohan - on 11/1/23
         Reason-category selection ui and functionality */}

        <div className={styles.categoryContainer}>
            <div className={styles.filterTitle}>FILTER BY CATEGORIES</div>

            <div className={styles.categoryItems}>
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
            </div>
        </div>

        {/* End of code */}
        <div className={styles.slab}>
          {filteredPersons&&filteredPersons.length > 0 ? (
            <>
              {filteredPersons.map((p) => {
                return (
                  <div className={styles.item}>
                    <Link to={`/listing/${p.menu}/${p.category}/detail/${p.id}`}>
                      <img
                        className={styles.searchedImage}
                        src={config.apiBaseURL + p.img_main}
                        onClick={(e) => openDetail(p)}
                      ></img>
                    </Link>
                    <div className={styles.title}>
                      <span>{p.title}</span>
                    </div>
                    <div className={styles.price}> {p.category}</div>
                    <div className={styles.price}>{currency.sign} {(p.price*currency.value).toFixed(2)}</div>
                  </div>
                );
              })}
            </>
          ) : (
            <div>{msg}</div>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default Search;
