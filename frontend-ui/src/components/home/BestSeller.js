import React, { useEffect, useState } from 'react'
import style from "./bestseller.module.css"
import image from "../../assets/photos/model.jpg"
import Carousel from 'react-grid-carousel'
import { CartState } from '../../context'
import image2 from "../../assets/photos/best.jpg"
import { useNavigate } from 'react-router-dom'
import config from '../../api/config'
// import Carousel from 'react-grid-carousel'

const BestSeller = () => {
    const { product, setProduct,currency } = CartState()
    const [bestProducts, setbest] = useState([])
    const [imageSwap, setImageSwap] = useState(false)
    const nav = useNavigate()
    useEffect(() => {
        setbest(product.filter(p => p.bestSeller == true))
    }, [product])


    function swapImage(i) {
        let temp = bestProducts[i].img_main;
        bestProducts[i].img_main = bestProducts[i].img_sub1
        bestProducts[i].img_sub1 = temp
        setbest(bestProducts)
        setImageSwap(!imageSwap)

    }
    return (
        <>
            <div className={style.container}>


                <div className={style.branding}>
                    {/* <img src={image2} className={style.bestImg}/> */}
                    <div className={style.paragraph}>
                        Our products
                    </div>
                    <div className={style.heading}> Best seller </div>

                </div>
                <div className={style.sliderContainer}>

                    {/* <Carousel cols={2} rows={1} gap={10}> */}

                    {/* {bestProducts.map(m=>console.log(m))} */}
                    {imageSwap ? bestProducts.map((m, i) => {
                        if (i < 12)
                            return <div className={style.card}
                                onMouseEnter={e => swapImage(i)}
                                onMouseLeave={e => swapImage(i)}
                                onClick={e => {  nav(`/listing/${m.menu}/${m.category}/detail/${m.id}`) }}
                            >
                                <img
                                    src={config.apiBaseURL + m.img_main}
                                    className={style.img}
                                    onMouseEnter={e => swapImage(i)}
                                    onMouseLeave={e => swapImage(i)} />
                                <div className={style.absolute}>
                                    <div className={style.name}>{m.title}</div>
                                    <div className={style.name}>{currency.sign}{m.price*currency.value}</div>
                                </div>
                            </div>
                        // <Carousel.Item
                        //     className={style.card}
                        // >

                        // </Carousel.Item>
                    }) : bestProducts.map((m, i) => {
                        if (i < 12)
                            return <div className={style.card}
                                onMouseEnter={e => swapImage(i)}
                                onMouseLeave={e => swapImage(i)}
                                onClick={e => { nav(`/listing/${m.menu}/${m.category}/detail/${m.id}`) }}
                            >
                                <img
                                    src={config.apiBaseURL + m.img_main}
                                    className={style.img}
                                />
                                <div className={style.absolute}>
                                    <div className={style.name}>{m.title}</div>
                                    <div className={style.name}>{currency.sign}{m.price*currency.value}</div>
                                </div>
                            </div>
                    })}



                    {/* </Carousel> */}
                </div>
                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    {bestProducts.length > 12 ?
                        <button onClick={e => nav(`/listing/best seller/0`)} className={`${style.button_arounder} ${style.button_b}`}>View More</button> :
                        null}
                </div>

            </div>


            {/* <div className={style.categoryContainer}>
        <div className={style.contain}>
            <img src={image} style={{ width: "100%", height: "100%" }}></img>
            <div className={style.absolute3}>
                <div className={style.head}>what the topic written here</div>
            </div>

            <div className={style.absolute2}>
                <button className={style.button2}>Shop Now</button>
            </div>
        </div>
        <div className={style.contain}></div>
        <div className={style.contain}></div>
        <div className={style.contain}></div>

    </div> */}
        </>)
}

export default BestSeller