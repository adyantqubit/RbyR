import React from 'react'
import style from "./test.module.css"
import image from "../../assets/photos/model.jpg"
import Carousel from 'react-grid-carousel'

const Test = () => {
    return (
        <>
            <div className={style.container}>

                <div className={style.heading}> Best seller product of RBYR </div>
                <div className={style.sliderContainer}>
                    {/* <Carousel cols={2} rows={2} gap={10}> */}

                        <div
                            className={style.card}
                        >
                            <div style={{ position: "relative" }}>
                                <img src={image} className={style.img}></img>
                                <div className={style.absolute}>
                                    <div className={style.name}>metallic draped dress</div>
                                    <button className={style.button}>{`view product >>`}</button>
                                </div>
                            </div>
                        </div>


                        <div
                            className={style.card}
                        >
                            <div style={{ position: "relative" }}>
                                <img src={image} className={style.img}></img>
                                <div className={style.absolute}>
                                    <div className={style.name}>metallic draped dress</div>
                                    <button className={style.button}>{`view product >>`}</button>
                                </div>
                            </div>
                        </div>


                        <div
                            className={style.card}
                        >
                            <div style={{ position: "relative" }}>
                                <img src={image} className={style.img}></img>
                                <div className={style.absolute}>
                                    <div className={style.name}>metallic draped dress</div>
                                    <button className={style.button}>{`view product >>`}</button>
                                </div>
                            </div>
                        </div>


                        <div
                            className={style.card}
                        >
                            <div style={{ position: "relative" }}>
                                <img src={image} className={style.img}></img>
                                <div className={style.absolute}>
                                    <div className={style.name}>metallic draped dress</div>
                                    <button className={style.button}>{`view product >>`}</button>
                                </div>
                            </div>
                        </div>



                    {/* </Carousel> */}
                </div>

                {/* <div className={style.card}>
                    <img src={image} className={style.img}></img>
                </div>
                <div className={style.card}>
                    <img src={image} className={style.img}></img>
                </div>
                <div className={style.card}>
                    <img src={image} className={style.img}></img>
                </div> */}
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
        </>
    )
}

export default Test