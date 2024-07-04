import React, { useEffect, useState } from "react";

import style from "./NavHeader.module.css";
import { FaUserCircle, FaUser } from "react-icons/fa";

import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { CartState } from "../../context";
import { useRef } from "react";

export const SubMenuList = () => {
  const {
    menus,

    setCategorySelected,
  } = CartState();
  const nav = useNavigate();
  const [cl, setClass] = useState(false);
  const [open, setOpen] = useState(false);
  var refc = useRef();
  const { parent } = useParams();
  const [list, setList] = useState(null);
  const [nullPage, setNullPage] = useState(false);

  //   const categories = menus[0].Festival.map((item) => item.category);
  const openc = () => {
    setClass(true);
  };

  const closec = () => {
    setClass(false);
  };

  const [renderCategory, setRenderCategory] = useState(false);

  const [parentName, setParentName] = useState('');

  useEffect(() => {
    if (menus && menus.length > 0) {
      const parent = Object.keys(menus[0]); 
      setParentName(parent[0]);
    }
  }, [menus]); // Run this effect whenever menus changes

  // extracting all child menu of parent menu from menu list
  console.log(parentName,'check parent ')

  useEffect(() => {
    setList(menus?.filter((m) => Object.keys(m)[0] === parentName)[0]);
    window.scrollTo(0, 0);
  }, [ parentName,menus]);

  useEffect(() => {
    if (list != null) {
      if (list.shownInstFilter == true) {
        nav(`/Listing/${parent}/${0}`);
        // nav('/')
      } else {
        setRenderCategory(true);
        // nav('/')

      }
    }

    if (list == null || list == undefined) {
      setNullPage(true);
    } else {
      if (list != null && list != undefined && list[`${parent}`]?.length == 0) {
        setNullPage(true);
      } else {
        setNullPage(false);
      }
    }
  }, [list]);

  // jump into product listing page according to menu instant filter showing condition
  function jumpIntoProductPage(s) {
    nav(`/listing/${parent}/${s.category}`);
  }

  console.log(list,'check list ')
  return (
    <>
      <div className={style.subMenuConatiner2}>
        <div className={style.menuName}>
          {menus?.map((m, i) => {
            var parent = Object.keys(m);
            console.log(menus, "hjhjkhjjh");

            return (
              <li
                id={`li${i}`}
                ref={refc}
                style={{ height: "40px", paddingTop: "3px" }}
                onMouseEnter={openc}
                onMouseLeave={closec}
              >
                <Link
                  className={style.al}
                  style={{ fontSize: "15px" }}

                  to={
                    // checking length on menu if 0 then not showing submenu with image page
                    m.shownMenuNImg && m[`${parent[0]}`]?.length > 0
                      ? `/categories/${parent[0]}`
                      : m.shownInstFilter
                      ? `/listing/${parent[0]}/0`
                      : `/listing/${parent[0]}/0`
                  }
                  onClick={(e) => setCategorySelected([])}
                >
                  {parent[0].toLowerCase()}
                </Link>
              </li>
            );
          })}{" "}
        </div>
        <div
          className={style.subMenuList}
          style={{paddingTop:'15%'}}
        >
          {/* {console.log(list)} */}
              
                {renderCategory == true && list != null
                  ? list[`${parentName}`]?.map((s) => (
                  // ? list["Collection"]?.map((s) => (

                      <div className={style.card} style={{borderBottom:'1px solid rgba(0, 0, 0, 0.05)'}}>
                        {/* {console.log("PARENT :",list[`${parent}`])} */}
                        <div
                          style={{ cursor: "pointer",padding:'4px',paddingLeft:'5%',fontSize:'15px',fontFamily: "var(--pagesFontFamily)"}}
                          // className={style.menu}
                          onClick={(e) => jumpIntoProductPage(s)}
                        >
                          {s.category}
                        </div>
                      </div>
                    ))
                  : 'No categories show'}
                  {/* hello */}
             
            {/* </li> */}
          {/* </ul> */}
        </div>
      </div>
    </>
  );
};


