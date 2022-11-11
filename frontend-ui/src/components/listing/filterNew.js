import React, { useEffect, useState } from 'react'
import { CartState } from '../../context'
import style from './listpage.module.css'
import RangeSlider from './rangeslider';
import MultiRangeSlider from './rangeslider';

const FilterNew = () => {
    const {sizeSelected,setSizeSelected,filterui,setfilterUi,CategoryProduct,setCategoryProduct,tempallpro,settemAllpro,maxValue,setmaxValue,minValue,setminValue,allCategoryAvai,setAllCategoryAvai,allColorAvai,setAllColorAvai,selectedColor,setSelectedColor,tempsprice,setTempsprice}=CartState()
    const[tempprice,setTempprice]=useState([])
    const[tempSize,setTempSize]=useState([])
    const[tempSize2,setTempSize2]=useState([])


 function closeSortPage(){
  setfilterUi(false)
 }
 
 useEffect(()=>{
    setTempprice([...tempallpro])
    tempallpro.map(c=>{
        if(c.category&&!allCategoryAvai.includes(c.category))
        {
            allCategoryAvai.push(c.category)
            setAllCategoryAvai([...allCategoryAvai])
            
        }
    })

    tempallpro.map(c=>{
        if(c.color&&!allColorAvai.includes(c.color.toLowerCase()))
        {
            allColorAvai.push(c.color.toLowerCase())
            setAllColorAvai([...allColorAvai])
            
        }
    })
 },[tempallpro])



//color filter change start

 function toggleselect(e){
  e.currentTarget.parentElement.className=`${style.value} ${style.textdiv}`
  e.currentTarget.nextSibling.className= `${style.cross}`
  selectedColor.push(e.currentTarget.textContent.toLowerCase())
  setSelectedColor([...selectedColor])
  setCategoryProduct([...tempallpro])
  var filtered=tempallpro.filter(c=>selectedColor.includes(c.color))
  setCategoryProduct([...filtered])
  setTempprice([...filtered])
  setTempsprice([...filtered])

 }

 function deleteclass(e){
  e.currentTarget.parentElement.className=`${style.textdiv}`
  e.currentTarget.className=`${style.block}`
  var filtercolor=selectedColor.filter(c=>c!=e.currentTarget.previousSibling.textContent.toLowerCase())
  setSelectedColor([...filtercolor])
  }

  useEffect(()=>{
    var filtered;
    if(selectedColor&&selectedColor.length>0){
     filtered=tempallpro.filter(c=>selectedColor.includes(c.color.toLowerCase()))
    setCategoryProduct([...filtered])
    setTempprice([...filtered])
    setTempsprice([...filtered])

    }
    else{
      setCategoryProduct([...tempallpro])
      setTempprice([...tempallpro])
      setTempsprice([...tempallpro])
     }
     Sizemanipulation()

  
  },[selectedColor])

//color filter end


 

 function toggleselects(e){
  e.currentTarget.parentElement.className=`${style.value} ${style.sizediv}`
  e.currentTarget.nextSibling.className= `${style.cross}`
  // sizeSelected.push(e.currentTarget.innerText)
  setSizeSelected([...sizeSelected,e.currentTarget.innerText])
  var size=e.currentTarget.innerText;
  setTempprice(CategoryProduct.filter(c=>c[`${size}`]>0)) 
 }

 function deleteclasss(e){
  e.currentTarget.parentElement.className=`${style.sizediv}`
  e.currentTarget.className=`${style.block}`
  setSizeSelected(sizeSelected.filter(s=>s!=e.currentTarget.previousSibling.innerText))
  
 }
 
 useEffect(()=>{
  
 Sizemanipulation()

 },[sizeSelected])


function Sizemanipulation(){

  if(sizeSelected&&sizeSelected.length>0){
    var flag=1;
    sizeSelected.filter(s=>{
      if(flag){
         var temp=CategoryProduct.filter(c=>c[`${s}`]>0)
        tempSize.splice(0,tempSize.length)
        tempSize.push(...temp)
        setTempSize([...tempSize])
      }else{
        var temp=tempSize.filter(t=>t[`${s}`]>0)
        tempSize.splice(0,tempSize.length)
        tempSize.push(...temp)
        setTempSize([...tempSize]) 
      
      }
    })
  }
 }

 useEffect(()=>{
    if(tempSize&&tempSize.length>0)
    setCategoryProduct(tempSize)
    
  
 },[tempSize])
 

 function setMinMAx(min,max){
    setmaxValue(max)
    setminValue(min)
    var filtered=tempprice.filter(c=>c.price>min&&c.price<max)
    setCategoryProduct([...filtered])
    setTempsprice([...filtered])

    Sizemanipulation()
    // console.log(minValue,maxValue)
 }



  return (
    <div className={style.contains}>

{/* header part */}
<div className={style.filterContain}>
   <div className={style.filterInner}>
      <div className={style.filterheader}>
        <div className={style.filterHeaderInner} >
          <span className={style.headtitle1}>FILTER BY</span>
          <span>
            <span className={style.headtitle2}>clear All</span>
            <span className={style.headtitle3} style={{marginLeft:"15px"}}>Apply filter</span>
            <span style={{marginLeft:"15px",height:"50px",fontSize:"20px",cursor:"pointer"}} onClick={closeSortPage}>x</span>
          </span>
        </div>  
      </div>

   <div style={{width:"100%",height:"0.01rem",background:"grey"}}></div>  
  </div>
</div>
{/* header part end */}

<div className={style.filterbottomMain} >
    <div className={style.filterbottomMainInner} >
     
     {/* div 1 */}
      <div className={style.filterbottomMainInnerItem} >
        <span className={style.categ}>
            Category
        </span>
      
        <div className={style.iteminner}>
            {allCategoryAvai?
            allCategoryAvai.map(c=>(
                <div className={style.textdiv}>
                <span className={style.text}>{c}</span>
                </div>
                )): 
                <div className={style.textdiv}>
                <span className={style.text}>Loading please wait...</span>
                </div>
            } 

        </div>
      </div>

      {/* div 1 end */}

{/* div item 2   */}

      <div className={style.filterbottomMainInnerItem2}>
      <span className={style.categ}>
          Color
       </span>
       <div className={style.iteminner}>
         
         {allColorAvai?allColorAvai.map(c=>{

      
         if( selectedColor.includes(c)){
          return <div className={`${style.textdiv} ${style.value}`} >
            <span className={style.text} onClick={toggleselect}>{c.toUpperCase()}</span>
             <span onClick={deleteclass} className={style.cross}>X</span>
             </div>
             }
         else{
            return <div className={style.textdiv} >
            <span className={style.text} onClick={toggleselect}>{c.toUpperCase()}</span>
             <span onClick={deleteclass} className={style.block}>X</span>
             </div>
         }
         

         }): <div className={style.textdiv} >
         <span className={style.text} >Loading ...</span>
         </div>
         }


       </div>
      </div>
{/* div item 2 end  */}



{/* div item 3  */}
      <div className={style.filterbottomMainInnerItem}>
        <span className={style.categ}>
            Size
        </span>
        
         <div className={style.iteminner}>

            {sizeSelected.includes('S')?<div className={`${style.sizediv} ${style.value}`}>
                <span className={style.size} onClick={toggleselects}>S</span>
                <span onClick={deleteclasss} className={style.cross}>X</span>
            </div>:<div className={style.sizediv}>
                <span className={style.size} onClick={toggleselects}>S</span>
                <span onClick={deleteclasss} className={style.block}>X</span>
            </div>}

            {sizeSelected.includes('M')?<div className={`${style.sizediv} ${style.value}`}>
                <span className={style.size} onClick={toggleselects}>M</span>
                <span onClick={deleteclasss} className={style.cross}>X</span>
            </div>:<div className={style.sizediv}>
                <span className={style.size} onClick={toggleselects}>M</span>
                <span onClick={deleteclasss} className={style.block}>X</span>
            </div>}


            {sizeSelected.includes('L')?<div className={`${style.sizediv} ${style.value}`}>
                <span className={style.size} onClick={toggleselects}>L</span>
                <span onClick={deleteclasss} className={style.cross}>X</span>
            </div>:<div className={style.sizediv}>
                <span className={style.size} onClick={toggleselects}>L</span>
                <span onClick={deleteclasss} className={style.block}>X</span>
            </div>}


            {sizeSelected.includes('XL')?<div className={`${style.sizediv} ${style.value}`}>
                <span className={style.size} onClick={toggleselects}>XL</span>
                <span onClick={deleteclasss} className={style.cross}>X</span>
            </div>:<div className={style.sizediv}>
                <span className={style.size} onClick={toggleselects}>XL</span>
                <span onClick={deleteclasss} className={style.block}>X</span>
            </div>}

            {sizeSelected.includes('XXL')?<div className={`${style.sizediv} ${style.value}`}>
                <span className={style.size} onClick={toggleselects}>XXL</span>
                <span onClick={deleteclasss} className={style.cross}>X</span>
            </div>:<div className={style.sizediv}>
                <span className={style.size} onClick={toggleselects}>XXL</span>
                <span onClick={deleteclasss} className={style.block}>X</span>
            </div>}
            
         </div>

      </div>
{/* div item 3 end */}

{/* div item 4 */}

      <div className={style.filterbottomMainInnerItem}>
      <MultiRangeSlider
      min={10000}
      max={100000}
      minS={minValue>0?minValue:10000}
      maxS={maxValue>0?maxValue:100000}
      onChange={({ min, max }) => {setMinMAx(min,max)}}
      />
      </div>
{/* div item 4 end  */}



    </div>
</div>


</div>
  )
}

export default FilterNew