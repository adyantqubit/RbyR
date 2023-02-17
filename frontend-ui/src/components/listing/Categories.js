import React from 'react'
import Navbar from '../global/NavHeader'
import style from './category.module.css'
const Categories = () => {
    return (
        <>
            <Navbar />
            <div className={style.container}>
                <div className={style.heading}>
                    ALL COLLECTIONS
                </div>

                <div className={style.listContainer}>

                </div>

            </div>

        </>
    )
}

export default Categories