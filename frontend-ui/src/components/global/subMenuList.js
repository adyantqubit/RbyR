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

  // extracting all child menu of parent menu from menu list
  useEffect(() => {
    setList(menus?.filter((m) => Object.keys(m)[0] === parent)[0]);
    window.scrollTo(0, 0);
  }, [parent, menus]);

  useEffect(() => {
    if (list != null) {
      if (list.shownInstFilter == true) {
        nav(`/Listing/${parent}/${0}`);
      } else {
        setRenderCategory(true);
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
                style={{ height: "40px", paddingTop: "0px" }}
                onMouseEnter={openc}
                onMouseLeave={closec}
              >
                <Link
                  className={style.al}
                  style={{ fontSize: "20px" }}

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
          style={{paddingTop:'15%',border:'1px solid var(--backgroundColorPrimary)'}}
        >
          {/* <ul className={style.ul} > */}
            {/* <li
              className={style.l}
              style={{ padding: "2px" }}
            > */}
              
                {renderCategory == true && list != null
                  ? list[`${parent}`]?.map((s) => (
                      <div className={style.card} style={{borderBottom:'2px solid var(--backgroundColorPrimary)'}}>
                        <div
                          style={{ cursor: "pointer",padding:'4px',paddingLeft:'5%',fontSize:'17px',fontFamily: "var(--pagesFontFamily)"}}
                          // className={style.menu}
                          onClick={(e) => jumpIntoProductPage(s)}
                        >
                          {s.category}
                        </div>
                      </div>
                    ))
                  : nullPage}
                  {/* hello */}
             
            {/* </li> */}
          {/* </ul> */}
        </div>
      </div>
    </>
  );
};


