// Created by rohan- on -18/2/23
// Reason - instant category filter shown

import React from "react";
import { CartState } from "../../context";
import style from "./instantFilter.module.css";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { TiTick } from "react-icons/ti";

const InstantFilter = () => {
  const {
    selectedCategory,
    setCategorySelected,
    CategoryProduct,
    setCategoryProduct,
    tempallpro,
    settemAllpro,
    allCategoryAvai,
    setAllCategoryAvai,
  } = CartState();

  //this function is toggle category select and changing product according to category in context
  function toggleSelect(e) {
    if (
      selectedCategory.indexOf(e.currentTarget.textContent.toLowerCase()) == -1
    ) {
      // console.log(selectedCategory)
      // selectedCategory.push(e.currentTarget.textContent.toLowerCase())
      // console.log(selectedCategory)
      setCategorySelected([
        ...selectedCategory,
        e.currentTarget.textContent.toLowerCase(),
      ]);
    } else {
      setCategorySelected(
        selectedCategory.filter(
          (s) => s !== e.currentTarget.textContent.toLowerCase()
        )
      );
    }
  }
function removeFilter(){
    console.log('checkkkkkkkkk')
    setCategorySelected('')
}
// console.log(selectedCategory,'checkkkkkk')

  return (
    <>
      {/* Modified by - Ashish Dewangan on 14-12-2023
        Reason - To hand long text size */}
      {/* <div className={style.container}>
                <div className={style.heading}>FILTER</div>

                {allCategoryAvai ?
                    allCategoryAvai.map(c => {
                        return selectedCategory.indexOf(c.toLowerCase()) == -1 ?
                            <div className={style.category} onClick={e => toggleSelect(e)}><span className={style.BlnkCircle}/>{c}</div> :
                            <div className={style.pointedCategory} onClick={e => toggleSelect(e)}><div className={style.BlnkCircle}><TiTick style={{fontSize:"20px",width:"10px",height:"10px"}}/></div>{c}</div>
                    }
                    ) : null}

            </div> */}
      <div
        className={style.container}
        style={{
          overflowWrap: "break-word",
          wordWrap: "break-word",
          wordBreak: "break-word",
        }}
      >
        <div className={style.heading}>FILTER</div>

        {allCategoryAvai
          ? allCategoryAvai.map((c) => {
              return selectedCategory.indexOf(c.toLowerCase()) == -1 ? (
                <div
                  className={style.category}
                  onClick={(e) => toggleSelect(e)}
                >
                  <div className={style.BlnkCircle}>
                    <MdOutlineCheckBoxOutlineBlank
                      style={{
                        color: "transparent",
                        fontSize: "20px",
                        width: "10px",
                        height: "10px",
                      }}
                    />
                  </div>
                  {c}
                </div>
              ) : (
                <div
                  className={style.pointedCategory}
                  onClick={(e) => toggleSelect(e)}
                >
                  <div className={style.BlnkCircle}>
                    <TiTick
                      style={{
                        fontSize: "20px",
                        width: "10px",
                        height: "10px",
                      }}
                    />
                  </div>
                  {c}
                </div>
              );
            })
          : null}
          {/* Addition by Om Shrivastava on 15-12-23
          Reason : Add the remove filter option */}
             <button className={style.removeFilterBtn} onClick={removeFilter}>
            Clear
          </button>
          {/* End of addition by Om Shrivastava on 15-12-23
          Reason : Add the remove filter option  */}
      </div>
      {/* End of code modification by - Ashish Dewangan on 14-12-2023
            Reason - To hand long text size */}
         
    </>
  );
};

export default InstantFilter;

// end of page
