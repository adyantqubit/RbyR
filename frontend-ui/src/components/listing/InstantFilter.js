// Created by rohan- on -18/2/23
// Reason - instant category filter shown

import React from 'react'
import { CartState } from '../../context'
import style from './instantFilter.module.css'

const InstantFilter = () => {
    const { selectedCategory, setCategorySelected, CategoryProduct, setCategoryProduct, tempallpro, settemAllpro, allCategoryAvai, setAllCategoryAvai } = CartState()


    //this function is toggle category select and changing product according to category in context
    function toggleSelect(e) {

        if (selectedCategory.indexOf(e.currentTarget.textContent.toLowerCase()) == -1) {
            selectedCategory.push(e.currentTarget.textContent.toLowerCase())
            setCategorySelected([e.currentTarget.textContent.toLowerCase()])
        }
        else {
            setCategorySelected(selectedCategory.filter(s => s !== e.currentTarget.textContent.toLowerCase()))
        }
        console.log(selectedCategory)
    }

    return (
        <>
            <div className={style.container}>
                <div className={style.heading}>FILTER</div>

                {/* mapping all available category */}
                {allCategoryAvai ?
                    allCategoryAvai.map(c => {
                        return selectedCategory.indexOf(c.toLowerCase()) == -1 ?
                            <div className={style.category} onClick={e => toggleSelect(e)}>{c}</div> :
                            <div className={style.pointedCategory} onClick={e => toggleSelect(e)}><div className={style.circle}></div>{c}</div>
                    }
                    ) : null}

            </div>
        </>
    )
}

export default InstantFilter

// end of page