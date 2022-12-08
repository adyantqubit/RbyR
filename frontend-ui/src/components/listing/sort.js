import React, { useEffect, useState } from 'react'
import { CartState } from '../../context'
import style from './listpage.module.css'
import RangeSlider from './rangeslider';
import MultiRangeSlider from './rangeslider';

const Sort = () => {
  const { availablitySelect, setReload, setAvailablity, latestSelect, setLatestSelect, htl, sethtl, lth, setLth, sortui, setSortUi, CategoryProduct, setCategoryProduct, tempallpro, settemAllpro, tempsprice, setTempsprice } = CartState()



  function closeSortPage() {
    console.log("hit")
    setSortUi(false)
  }

  useEffect(() => {
    if (!tempsprice.length > 0) {
      setTempsprice([...tempallpro])
    }

  }
    , [])


  //color filter change start

  function toggleselect(e) {
    // var filtered=CategoryProduct.sort((a,b)=>a.price-b.price)
    // setCategoryProduct([...filtered])
    sethtl(false)
    setLatestSelect(false)

  }

  function deleteclass(e) {
    // if (availablitySelect==true){
    //   setCategoryProduct([...tempsprice.filter(t=>t.available==true)])
    // }
    // else{
    //   setCategoryProduct([...tempsprice])

    // }
  }


  function toggleselect2(e) {
    // var filtered=CategoryProduct.sort((a,b)=>b.price-a.price)
    // setCategoryProduct([...filtered])
    setLth(false)
    setLatestSelect(false)

  }



  /*commented by Rohan -date 7/8/2022
  purpose- adding latest sorting functionality it will show with date and check availablity of product
*/


  function selectLatest() {
    setLatestSelect(true)
    // console.log(CategoryProduct)
    // var sort= CategoryProduct.sort((a, b) =>
    // b.date.split('-').join().localeCompare(a.date.split('-').join()));
    // setCategoryProduct([...sort])
    setLth(false)
    sethtl(false)
    // console.log(sort)
  }

  function deselectLatest() {
    setLatestSelect(false)
    // if (availablitySelect==true){
    //   setCategoryProduct([...tempsprice.filter(t=>t.available==true)])
    // }
    // else{
    //   setCategoryProduct([...tempsprice])

    // }
  }

  function uncheckAvailablity() {
    setAvailablity(false)
    // setCategoryProduct(tempallpro)
  }

  function checkAvailablity() {
    setAvailablity(true)
    // setCategoryProduct(CategoryProduct.filter(c=>c.available==true))
  }

  //end -- Rohan date-07-08-2022

  return (
    <div className={style.containsSort} style={{ zIndex: "50" }}>

      {/* header part */}
      <div className={style.filterContain} >
        <div className={style.filterInner}>
          <div className={style.filterheader}>
            <div className={style.filterHeaderInner} >
              <span className={style.headtitle1}>SORT BY</span>
              <span>
                {/* <span className={style.headtitle2}>clear All</span> */}
                <span className={style.text} style={{ marginLeft: "15px", color: "#8c8c8c", fontWeight: "600" }} onClick={closeSortPage}>Close</span>
                {/* <span style={{marginLeft:"15px",height:"50px",fontSize:"20px",cursor:"pointer"}} onClick={closeSortPage}>x</span> */}
              </span>
            </div>
          </div>

          <div style={{ width: "100%", height: "0.01rem", background: "grey" }}></div>
        </div>
      </div>
      {/* header part end */}

      <div className={style.mainsort} >

        <div className={style.filterbottomMainInnerSort} >

          <div className={style.filterbottomMainInnerItem} style={{ width: "100%" }}>


            <div className={style.iteminner} >

              {latestSelect ? <div className={`${style.textdiv} ${style.value}`} style={{ minWidth: "0", width: "auto", whiteSpace: "nowrap", display: "flex", justifyContent: "space-between" }}>
                <span className={style.text} onClick={e => { deselectLatest();setReload(true) }} >Latest</span>
                <span onClick={e => { deselectLatest(); settemAllpro([]); setCategoryProduct([]) }} className={style.cross}>✔</span>
              </div> :
                <div className={style.textdiv} style={{ minWidth: "0", width: "auto", whiteSpace: "nowrap" }} onClick={e => { settemAllpro([]); setCategoryProduct([]) }}>
                  <span className={style.text} onClick={e => { selectLatest(); setReload(true) }} >Latest</span>
                </div>
              }

              {availablitySelect ? <div className={`${style.textdiv} ${style.value}`} style={{ minWidth: "0", width: "auto", whiteSpace: "nowrap", display: "flex", justifyContent: "space-between" }}>
                <span className={style.text} onClick={e => { uncheckAvailablity(); settemAllpro([]); setCategoryProduct([]); setReload(true) }} >Availablity</span>
                <span onClick={e => { uncheckAvailablity() }} className={style.cross}>✔</span>
              </div> :
                <div className={style.textdiv} style={{ minWidth: "0", width: "auto", whiteSpace: "nowrap" }} onClick={e => { settemAllpro([]); setCategoryProduct([]) ;setReload(true)}}>
                  <span className={style.text} onClick={e => { checkAvailablity(); setReload(true) }} >Availablity</span>
                </div>
              }

              {lth ? <div className={`${style.textdiv} ${style.value}`} style={{ minWidth: "0", width: "auto", whiteSpace: "nowrap", display: "flex", justifyContent: "space-between" }}>
                <span className={style.text} onClick={e => { setLth(false); deleteclass(e); settemAllpro([]); setCategoryProduct([]); setReload(true) }} style={{ color: 'black' }}>PRICE: LOW TO HIGH</span>
                <span onClick={e => { setLth(false); deleteclass(e); settemAllpro([]); setCategoryProduct([]) }} className={style.cross}>✔</span>
              </div> : <div className={style.textdiv} style={{ minWidth: "0", width: "auto", whiteSpace: "nowrap" }} onClick={e => { settemAllpro([]); setCategoryProduct([]);setReload(true) }}>
                <span className={style.text} onClick={e => { setLth(true); toggleselect(e) }} >PRICE: LOW TO HIGH</span>
              </div>}

              {htl ? <div className={`${style.textdiv} ${style.value}`} style={{ minWidth: "0", width: "auto", whiteSpace: "nowrap", display: "flex", justifyContent: "space-between" }}>
                <span className={style.text} onClick={e => { sethtl(false); deleteclass(e); settemAllpro([]); setCategoryProduct([]);setReload(true) }} style={{ color: 'black' }}>PRICE: HIGH TO LOW</span>
                <span onClick={e => { sethtl(false); deleteclass(e) }} className={style.cross}>✔</span>
              </div> : <div className={style.textdiv} style={{ minWidth: "0", width: "auto", whiteSpace: "nowrap" }} onClick={e => { settemAllpro([]); setCategoryProduct([]);setReload(true) }}>
                <span className={style.text} onClick={e => { sethtl(true); toggleselect2(e) }} >PRICE: HIGH TO LOW</span>
              </div>}

            </div>



          </div>

        </div>

      </div>

    </div>

    
  )
}

export default Sort