// created by Rohan on- 17/2/23
// working - All parent menu of submenu shown in this page and user can able see their images also. 


import React, { useEffect, useState } from 'react'
import Navbar from '../global/NavHeader'
import style from './category.module.css'
import image from '../../assets/photos/model.jpg'
import config from '../../api/config'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CartState } from '../../context'
import Footer from '../global/footer'


const Categories = () => {
    const { menus } = CartState()
    const { parent } = useParams()
    const [list, setList] = useState(null)
    const nav = useNavigate()
    const [nullPage,setNullPage] = useState(false)

    /**
     * Added by - Ashish Dewangan on 11-12-2023
     * Reason - To render category after deciding wherter to show menu as images or as instant filter
     */
    const [renderCategory,setRenderCategory] = useState(false)
    /**
     * End of code addition by - Ashish Dewangan on 11-12-2023
     * Reason - To render category after deciding wherter to show menu as images or as instant filter
     */

    // extracting all child menu of parent menu from menu list 
    useEffect(() => {
        setList(menus?.filter(m => Object.keys(m)[0] === parent)[0])
        window.scrollTo(0,0)
    }, [parent, menus])


    /**
     * Added by - Ashish Dewangan on 11-12-2023
     * Reason - Method to decide wherter to show menu as images or as instant filter 
     */
    useEffect(()=>{
        if(list!=null){
          if(list.shownInstFilter==true){
            nav(`/Listing/${parent}/${0}`)
          }else{
            setRenderCategory(true)
          }
        }

        /**
         * Added by - Ashish Dewangan on 29-12-2023
         * Reason - if items inside submenu is zero or submenu inside menu is zero then show no product found text
         */
        if(list==null || list==undefined){
            setNullPage(true)
        }else{
            if(list!=null && list!=undefined && list[`${parent}`]?.length==0){
                setNullPage(true)
            }else{
                setNullPage(false)
            }
        }
        /**
         * End of comment by - Ashish Dewangan on 29-12-2023
         * Reason - if items inside submenu is zero or submenu inside menu is zero then show no product found text
         */
        
      },[list])
    /**
     * End of code addition by - Ashish Dewangan on 11-12-2023
     * Reason - Method to decide wherter to show menu as images or as instant filter 
     */

    // jump into product listing page according to menu instant filter showing condition
    function jumpIntoProductPage(s){
        // if(list.shownInstFilter)
        // nav(`/listing/${parent}/0`)
        // else
        nav(`/listing/${parent}/${s.category}`)

    }

    return (
        <>
            <Navbar />
            <div className={style.container}>
                {/* <div className={style.heading}>
                    ALL COLLECTIONS
                </div> */}

                <div 
                style={{display:'flex',
                // paddingLeft:'5%',
                // flexDirection:'row',justifyContent:
                // 'space-around',
                paddingTop:'2.5%'
            }}
                 className={style.heading}>
                    <div className={style.headingSection} > 
                    {/* Modification and addition by Om shrivastava on 13-12-23
                    Reason : Need to show the parent name */}
                    {/* ALL COLLECTIONS */}
                  {parent}
                   {/* End of modification and addition by Om shrivastava on 13-12-23
                    Reason : Need to show the parent name */}
                    </div>
                    <div></div>
                </div>

                <div className={style.listContainer}>
                    <div className={style.cardContainer}>

                        {/* listing all category of parent menu */}
                        {/*
                        * Added by - Ashish Dewangan on 11-12-2023
                        * Reason - To render category after deciding wherter to show menu as images or as instant filter
                        */}
                        {/* {list != null ? list[`${parent}`]?.map(s => */}
                        {renderCategory==true &&  list != null ? list[`${parent}`]?.map(s =>
                        /*
                        * End of code addition by - Ashish Dewangan on 11-12-2023
                        * Reason - To render category after deciding wherter to show menu as images or as instant filter
                        */
                            <div className={style.card}>
                                <img className={style.img} src={ config.staticBaseURL+ s.img} />
                                <div className={style.absoluteBox}>
                                    {/* Modifed by - Ashish Dewangan on 14-12-2023
                                    Reason - To handle long text */}
                                    {/* <div className={style.menu} >{s.category}</div> */}
                                    <div className={style.menu} style={{width:"70%", overflowWrap:"break-word",wordWrap:"break-word",wordBreak:"break-all"}}>{s.category}</div>
                                    {/* End of code modification by - Ashish Dewangan on 14-12-2023
                                    Reason - To handle long text */}
                                    <button className={style.button} onClick={e => jumpIntoProductPage(s)}>View Products</button>
                                </div>
                            </div>
                        /**
                         * Modified by - Ashish Dewangan on 29-12-2023
                         * Reason - To hide loader if products not found and show no product found text
                         */
                        // ) : <div style={{ width: "100%" }}>
                        // <div class="centered">
                        //     <div class="blob-1"></div>
                        //     <div class="blob-2"></div>
                        // </div>
                        // </div>}    
                        ) : nullPage?null: <div style={{ width: "100%" }}>
                            <div class="centered">
                                <div class="blob-1"></div>
                                <div class="blob-2"></div>
                            </div>
                        </div>}
                        {/* Modified by - Ashish Dewangan on 29-12-2023
                        Reason - To hide loader if products not found and show no product found text */}
                         
                        {/* Added by - Ashish Dewangan on 29-12-2023
                        Reason - To show no product found text */}
                        {nullPage ? (
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
                        {/* End of code addition by - Ashish Dewangan on 29-12-2023
                        Reason - To show no product found text */}

                    </div>
                </div>

            </div>
            
            <div className={style.foot}>
            <Footer />
            </div>

        </>
    )
}

export default Categories

// End of page