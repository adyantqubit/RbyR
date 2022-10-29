import style from './footer2.module.css';
import {FaFacebookF,FaTwitter} from 'react-icons/fa'
import {TiSocialInstagram} from 'react-icons/ti'
import {FiArrowRight} from 'react-icons/fi'
import { Link } from 'react-router-dom';


function Footer2() {
  return (
    <div className={style.App}>
        
        
        <div style={{paddingTop:"15px", maxHeight:"240px",display:"flex",flexDirection:"row",WebkitFlexWrap: "wrap",flexWrap:"wrap",gap:"0",justifyContent:"space-around",overflow:"hidden",background:"#323232"}}>
           <div className={style.foottop} style={{display:"flex",flexDirection:"column",textAlign:"center",justifyContent:"center"}}>
            <span style={{ color:"black",fontSize: "24px",lineHeight: "32px",letterSpacing:"3px"}}>FOLLOW US</span>
            <span style={{color:"black",fontSize: "16px",lineHeight: "32px",letterSpacing:"1.7px",fontWeight: "500"}}>ON INSTAGRAM</span>
            </div>
            <div className={style.foottop}>
                <img style={{objectFit:"contain"}} src="https://res.cloudinary.com/dzzdidhrq/image/upload/v1665662804/p1_mjqj81.jpg"></img>
            </div>
            <div className={style.foottop} >
                <img style={{objectFit:"contain"}} src="https://res.cloudinary.com/dzzdidhrq/image/upload/v1665662821/p3_phucn4.jpg"></img>

            </div>
            <div className={style.foottop}>
                <img src="https://res.cloudinary.com/dzzdidhrq/image/upload/v1665662821/p5_jkbgjr.jpg"></img>

            </div>
            <div className={style.foottop}>
            <img src="https://res.cloudinary.com/dzzdidhrq/image/upload/v1665662823/p4jpg_umjcp0.jpg"></img>

            </div>
            <div className={style.foottop}>
            <img src="https://res.cloudinary.com/dzzdidhrq/image/upload/v1665662826/p2_xrghep.jpg"></img>

            </div>
        </div>


      <div style={{height:"40px",borderBottom:"1px solid white"}}></div>
     <div className={style.row}>
      <div className={style.column1}>
       <h1 className={style.heading}>CUSTOMER CARE</h1>
       <a href="/custom" style={{textDecoration:"none",color:"white"}}> <span className={style.span}>Contact Us</span></a>
       <Link to="/terms" style={{textDecoration:"none",color:"white"}}> <span className={style.span}>Term and Conditions</span></Link>
       <Link to="/terms" style={{textDecoration:"none",color:"white"}}> <span className={style.span}>FAQ</span></Link>
       <Link to="/terms" style={{textDecoration:"none",color:"white"}}><span className={style.span}>Bridal</span></Link>

      </div>
      <div className={style.column2}>
      <h1 className={style.heading}>POLICIES</h1>
       <span className={style.span}>Privacy Policy</span>
       <span className={style.span}>Delivery and Shipping Policy</span>
       <span className={style.span}>Refund Policy</span>
       <span className={style.span}>Order Cancellation Policy</span>
      </div>

      <div className={style.column3}>
      <h1 className={style.heading}>THE COMPANY</h1>
       <span className={style.span}>RR EXCLUSIVE</span>
       <span className={style.span}>Store Locator</span>       
      </div>

      <div className={style.column4}>
          <h1 className={style.heading}>FOLLOW US</h1>
          <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
            <div style={{display:"flex",flexDirection:"column",gap:"15px",marginTop:"15px"}}>
                <FaFacebookF style={{color:"grey",fontSize:"25px"}}/>
                <TiSocialInstagram style={{color:"grey",fontSize:"25px"}}/>
                <FaTwitter style={{color:"grey",fontSize:"25px"}}/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"20px",marginTop:"15px"}}>
                <span style={{marginTop:"0"}} className={style.span} > Facebook</span>
                <span style={{marginTop:"0"}} className={style.span}> Instagram</span>
                <span style={{marginTop:"0"}} className={style.span}> Twitter</span>
            </div>
          </div>
      {/* <div className={style.icon}><FaFacebookF style={{color:"grey",fontSize:"25px",marginLeft:"5px"}}/><span style={{marginTop:"0"}}className={style.span} > Facebook</span></div>
      <div className={style.icon}><TiSocialInstagram style={{color:"grey",fontSize:"25px",marginLeft:"5px"}}/><span style={{marginTop:"0"}}className={style.span}> Instagram</span></div>
      <div className={style.icon}><FaTwitter style={{color:"grey",fontSize:"25px",marginLeft:"5px"}}/><span style={{marginTop:"0"}}className={style.span}> Twitter</span></div> */}
      </div>
            <div className={style.column5}>
            <h1 className={style.heading}>SIGN UP FOR UPDATES</h1>
            <div style={{display:"flex",flexDirection:"row",marginTop:"30px"}}>
          <input type="email" style={{width:"70%",height:"30px"}} placeholder="Enter Your Email"/><button style={{width:"25%",background:"#7c7c7c"}}><FiArrowRight style={{fontSize:"25px"}}/></button>
            </div>
            </div>
     </div>

     <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
     <span className={style.span} style={{fontSize:"15px",marginLeft:"10px"}} > © 2022 RR. ALL RIGHTS RESERVED</span>
     <span className={style.span} style={{fontSize:"15px",marginRight:"10px"}}> Powered By <span style={{fontFamily: 'Rawson-Medium',fontSize:"20px",fontWeight:"20",textDecoration:"none"}}>Adyant</span></span>

     </div>
    </div>
  );
}

export default Footer2;