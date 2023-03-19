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

    // extracting all child menu of parent menu from menu list 
    useEffect(() => {
        setList(menus?.filter(m => Object.keys(m)[0] === parent)[0])
        window.scrollTo(0,0)
    }, [parent, menus])


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
                <div className={style.heading}>
                    ALL COLLECTIONS
                </div>

                <div className={style.listContainer}>
                    <div className={style.cardContainer}>

                        {/* listing all category of parent menu */}
                        {list != null ? list[`${parent}`]?.map(s =>
                            <div className={style.card}>
                                <img className={style.img} src={ config.staticBaseURL+ s.img} />
                                <div className={style.absoluteBox}>
                                    <div className={style.menu}>{s.category}</div>
                                    <button className={style.button} onClick={e => jumpIntoProductPage(s)}>View Products</button>
                                </div>
                            </div>
                        ) : <div style={{ width: "100%" }}>
                            <div class="centered">
                                <div class="blob-1"></div>
                                <div class="blob-2"></div>
                            </div>
                        </div>}
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