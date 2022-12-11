import { style } from "@mui/system";
import { Button, Drawer, message } from "antd";
import React, { useState } from "react";
import {  BsSearch } from "react-icons/bs";
import {AiOutlineClosee} from 'react-icons/ai'
import {GrClose} from 'react-icons/gr'
import { useNavigate } from "react-router-dom";
import config from "../../api/config";
import { getSearchedProducts } from "../../api/service";
import { CartState } from "../../context";
import styles from "./search.module.css";
import "./search.css"
import { notification } from "antd";
const Search = () => {
  notification.destroy()
  const [open, setOpen] = useState(false);
  const { product } = CartState();

// Added by Ashish dewangan on 18-11-2022
// Reason - to have cross button on search icon more width
// Jira issue no - RBYR -141
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [msg,setMsg]=useState(null);

  function searchProductAfterEnterPressed(event) {
    if(event.keyCode === 13){
      searchProduct();
    }
  }

  const searchProduct = async () => {
    var searchBox = document.getElementById("searchBox");
    const searchedData = await getSearchedProducts(searchBox.value);
    if(searchedData&&searchedData.length>0){
      setFilteredPersons(searchedData);
      setMsg(null);
      console.log(searchedData)

    }else{

      console.log(searchedData)
      setMsg("Result not found!");
      setFilteredPersons([]);
    }
  };
// End of code addition

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    document.getElementById("searchBox").value="";
    setFilteredPersons([]);
    setMsg(null)
    setOpen(false);
  };

  const nav = useNavigate();
  function openDetail(id) {}

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
              height: "52px",
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
              placeholder="Type what you are looking for..."
              onKeyUp={searchProductAfterEnterPressed}
            ></input>
          </div>
          {/* <button onClick={searchProduct}>search</button> */}
        </div>

        <div className={styles.slab}>
          {filteredPersons.length > 0 ? (
            <>
              {filteredPersons.map((p) => {
                return (
                  <div className={styles.item}>
                    <a href={`/listing/${p.category}/detail/${p.id}`}>
                      <img
                        className={styles.searchedImage}
                        src={config.apiBaseURL + p.img_main}
                        onClick={(e) => openDetail(p)}
                      ></img>
                    </a>
                    <div className={styles.title}>
                      <span>{p.title}</span>
                    </div>
                    <div className={styles.price}> {p.category}</div>
                    <div className={styles.price}>₹ {p.price}</div>
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
