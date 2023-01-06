import React from 'react'
import Footer from '../global/footer'
import Navbar from '../global/NavHeader'
import style from './ItDesign.module.css'

const Blank = () => {
  return (
    <>
      <Navbar />
      <div style={{ height: "90vh", width: "auto",paddingTop:"153px",background:"#323232",color:"white" ,display:"flex",flexDirection:"column",justifyContent:"center",textAlign:"center" }}>
       <div className={style.headerText}>NOTHING FOUNDS !</div> 
      </div>
      <div className={style.foot}>
        <Footer />
      </div>
    </>
  )
}

export default Blank