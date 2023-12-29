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
    // console.log('checkkkkkkkkk')
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

        {/* Modified by - Ashish Dewangan on 28-12-2023
        Reason - To make clear filter look as button */}
        {/* <div style={{display:'flex',width:"100%",marginTop:'4%'}}>
        <div style={{fontSize:'18px'}} className={style.heading}>FILTER</div>
        <div style={{color:'blue'}} className={style.removeFilterBtn} >     */}
        <div style={{display:'flex',width:"100%",marginTop:'4%',flexDirection:"column"}}>
          <div style={{fontSize:'18px',alignSelf:"center",marginBottom:"10px"}} className={style.heading}>FILTER</div>
          <div style={{color:'blue',alignSelf:"center",backgroundColor:"#4e4e4e",color:"white",borderRadius:"5px",padding:"1px"}} className={style.removeFilterBtn} >
        {/* End of code modification by - Ashish Dewangan on 28-12-2023
        Reason - To make clear filter look as button */}    
            <span style={{cursor:'pointer'}} onClick={removeFilter}> Clear filter
            </span> 
          </div >
        </div>
      <div
        className={style.container}
        style={{
          overflowWrap: "break-word",
          wordWrap: "break-word",
          wordBreak: "break-word",
        }}
      >
        {/* <div className={style.heading}>FILTER</div> */}

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
          {/* Commented by Om Shrivastava on 20-12-23
          Reason : Redesign the clear button */}
             {/* <button className={style.removeFilterBtn} onClick={removeFilter}>
            Clear
          </button> */}
           {/* Commented by Om Shrivastava on 20-12-23
          Reason : Redesign the clear button */}
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
