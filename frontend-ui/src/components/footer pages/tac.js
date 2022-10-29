import React from 'react'
import Footer from '../global/footer'
import Navbar from '../global/NavHeader'
import style from './contact.module.css'

const Terms = () => {
  return (
    <>
    <Navbar/>
    <div className={style.contact} >

            <div className={style.contain}>

             {/* <div className={style.column}>
                <span className={style.head}>CONTACT US</span>
                <span className={style.body}>For all queries, email us at: customercare@Raggarwal.com</span>
             
                <span className={style.head2} style={{marginTop:"40px"}}>FLAGSHIP STORE</span>
                <span className={style.body}>The white Space Block, martox way, 544376, uxehen honkong,china</span>
             
                <span className={style.head2} style={{marginTop:"40px"}}>HEAD OFFICE</span>
                <span className={style.body}>Town Place ,22 Road Heaven united place, sohaon, japan 766654</span>
             </div>
             <div className={style.column}>
                <img src="https://res.cloudinary.com/dzzdidhrq/image/upload/v1665734636/contact_us_vx1uy6.jpg"></img>
             </div> */}

            </div>

           <div style={{marginTop:"80px"}}>
           <Footer />
           </div>
           
    </div>
    
    </>
  )
}

export default Terms