import React, { useRef, useState } from 'react'

import PropTypes from 'prop-types'
import "bootstrap/dist/css/bootstrap.min.css";
import {HiMinus,HiPlus} from 'react-icons/hi'
import {MdClose} from 'react-icons/md'

import styles from './cartCard.module.css'
import { useCartUpdateMutation, useGetLikedProductQuery } from '../../Redux-manage/services/userAuthapi'
import { CartState } from '../../context'
import { getToken } from '../../Redux-manage/services/localStorageService';
import config from '../../api/config';
import { display } from '@mui/system';
import { TiDeleteOutline } from 'react-icons/ti'
import { CartQuantityApi } from '../../api/service';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { BsCurrencyBitcoin, BsWindowSidebar } from 'react-icons/bs';
import { DrawerFooter } from './cart';
import Msg from '../concepts/msgConfirm';
import { Popconfirm, message, Modal, notification } from 'antd';
import { increamentCheck } from '../../api/orderApis';
import { SizeGetter } from './getSize';
import '../../context.css'


const text = 'Are you sure you would like to remove this item from the Shopping Cart?';



const CartCard = (props) => {

  const { cart, setCart, currency } = CartState()

  const [cartsaveApi, { isLoad }] = useCartUpdateMutation()
  let textInput = React.createRef();
  var [con, setcon] = useState(true)
  const [sizeno, setSizeno] = useState(0)



  const decreament = (CartProduct) => {

    var index = cart.findIndex((p, i) => { if (p.id === CartProduct.id) if (p.size == CartProduct.size) { return i + 1; } })
    var AllCartProduct = cart;

    if (CartProduct.size == "Extra Extra Large") {
      if (CartProduct.quantity <= CartProduct.XXL + 1) {
        document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display = "none";
      }
    }
    else if (CartProduct.size == "Extra Large") {
      if (CartProduct.quantity <= CartProduct.XL + 1) {
        document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display = "none";
      }
    }
    else if (CartProduct.size == "Large") {
      if (CartProduct.quantity <= CartProduct.L + 1) {
        document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display = "none";
      }
    }
    else if (CartProduct.size == "Medium") {
      if (CartProduct.quantity <= CartProduct.M + 1) {
        document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display = "none";
      }
    }
    // else if (CartProduct.size == "Short") {
    else if (CartProduct.size == "Small") {

      if (CartProduct.quantity <= CartProduct.S + 1) {
        document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display = "none";
      }
    }

    if (AllCartProduct[index].quantity != 1) {
      AllCartProduct[index].quantity -= 1;
      increamentApi(CartProduct)
      setCart([...AllCartProduct])
    }
  }

  const erro = (r) => {
    Modal.error({
      title: "No More stock Is Available",
      style: { top: "30vh" }

    });

  };

  async function increamentApiMethodCall({ CartProduct, data }) {

    await increamentCheck(data).then(r => {
      if (r.success == true) {
        con = true;
      }
      else if (r.error) {
        document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display = "block";
        con = false;
        notification.error({
          message: <div style={{ fontSize: "13px", color: "black" }}>Out Of Stock. </div>,
          description:
            `No More Stock Available`,
          // className: "custom-class",
          // style: { backgroundColor: "#8c8c8c", color: "black", marginTop: "0vh" },
           // Modification and addition by Om shrivastava on 01-12-23
        // REason : Create the popup class to apply the designing
        className:'popupClass',
        // style:{marginTop:"20px"},
        // style:{backgroundColor: "#f1cdd9",
        // padding:'0px 5px 5px 5px',borderRadius:'10px',width:'200px'},
        // End of modification and addition by Om shrivastava on 01-12-23
        // REason : Create the popup class to apply the designing
          duration: 2,
          key: 1
        });
      }
    })
  }



  async function increamentApiMethodCall({ CartProduct, data }) {

    await increamentCheck(data).then(r => {
      if (r.success == true) {
        con = true;
      }
      else if (r.error) {
        // document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display="block"; 
        con = false;
        notification.error({
          message: <div style={{ fontSize: "13px", color: "black",fontWeight:'600' }}>Out Of Stock. </div>,
          description:
            `No More Stock Available`,
          // className: "custom-class",
          // style: { backgroundColor: "var(--bannerColor)", color: "black", marginTop: "0vh" },
           // Modification and addition by Om shrivastava on 01-12-23
        // REason : Create the popup class to apply the designing
        className:'popupClass',
        // style:{marginTop:"20px"},
        // style:{backgroundColor: "#f1cdd9",
        // padding:'0px 5px 5px 5px',borderRadius:'10px',width:'200px'},
        // End of modification and addition by Om shrivastava on 01-12-23
        // REason : Create the popup class to apply the designing
          duration: 2,
          key: 1
        });
        con = false;
      }

    })
  }





  const increament = async (CartProduct) => {
    con = true;

    if (CartProduct.size == "Extra Extra Large") {

      var data = {
        id: CartProduct.id,
        quantity: CartProduct.quantity,
        size: "XXL"
      }
      await increamentApiMethodCall({ CartProduct, data })

      /* commented on 11/11/22  
        purpose- becuse it check only from frontend only. if want to re-implement then just put size on if condition
        becuse i am removing it from all if else condition
      */
      // if(CartProduct.quantity>CartProduct.XXL){
      //   document.getElementById(`style${CartProduct.id}${CartProduct.size}`).style.display="block"; 
      //   con=false
      // }
    }
    else if (CartProduct.size == "Extra Extra Extra Large") {
      var data = {
        id: CartProduct.id,
        quantity: CartProduct.quantity,
        size: "XXXL"
      }
      await increamentApiMethodCall({ CartProduct, data })

    }
    else if (CartProduct.size == "Extra Large") {
      var data = {
        id: CartProduct.id,
        quantity: CartProduct.quantity,
        size: "XL"
      }
      await increamentApiMethodCall({ CartProduct, data })

    }
    else if (CartProduct.size == "Large") {
      var data = {
        id: CartProduct.id,
        quantity: CartProduct.quantity,
        size: "L"
      }
      await increamentApiMethodCall({ CartProduct, data })

    }
    else if (CartProduct.size == "Medium") {
      var data = {
        id: CartProduct.id,
        quantity: CartProduct.quantity,
        size: "M"
      }
      await increamentApiMethodCall({ CartProduct, data })

    }
    // else if (CartProduct.size == "Short") {
    else if (CartProduct.size == "Small") {

      var data = {
        id: CartProduct.id,
        quantity: CartProduct.quantity,
        size: "S"
      }
      await increamentApiMethodCall({ CartProduct, data })

    }
    else if (CartProduct.size == "Extra Short") {
      var data = {
        id: CartProduct.id,
        quantity: CartProduct.quantity,
        size: "XS"
      }
      await increamentApiMethodCall({ CartProduct, data })

    }

    if (con) {
      var index = cart.findIndex((p, i) => { if (p.id === CartProduct.id) if (p.size == CartProduct.size) { return i + 1; } })
      var AllCartProduct = cart;
      AllCartProduct[index].quantity++
      setCart([...AllCartProduct])
      increamentApi(CartProduct)

    }
  }

  const cartSave = async (product) => {

    const data = {
      product_no: product.id,
      size: product.size
    }
    var access_token = localStorage.getItem('access_token')
    const resp = await cartsaveApi({ data, access_token });

    if (cart.filter(l => l.id === product.id).length > 0) {
      var p = cart.filter(i => { if (i.id == product.id) { if (i.size != product.size) return i } else return i });
      setCart([...p])
      document.getElementById('style').style.display = "none";

    } else {
      setCart([...cart, product])
    }

  }



  const nav = useNavigate()
  function openDetail(id) {
    nav(`/listing/${id.menu}/${id.category}/detail/${id.id}`)
    // window.location.reload(false)
  }


  async function increamentApi(data) {
    var access_token = localStorage.getItem('access_token')
    await CartQuantityApi({ data, access_token })
  }
  const confirm = (pro) => {
    cartSave(pro)
  };

  return (
    <>
      {cart.length > 0 ? cart.map(pro => (

        <>
          <div style={{ width: "100%", height: "auto", marginBottom: "30px", paddingLeft: "15px", display: "flex",backgroundColor:"var(--backgroundColorSecondary)" }}>
          <div className={styles.column1}>
            {/* Modification and addition by Om Shrivastava on 19-11-23
            Reason : Need to add the height of the image */}
            {/* <img src={config.staticBaseURL + pro.img_main} style={{width:"100%"}} onClick={e => openDetail(pro)}></img> */}
            <img src={config.staticBaseURL + pro.img_main} style={{width:"135px",height:'165px'}} onClick={e => openDetail(pro)}></img>
         {/* End of Modification and addition by Om Shrivastava on 19-11-23
            Reason : Need to add the height of the image  */}
         </div>
            <div className={styles.column2} >
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                {/* Modification and addition by Om Shirvastava on 02-12-23
                Reason : Add the lowercase property */}
                {/* <h3 className={styles.heading}>{pro.title}</h3> */}
                <h3 className={styles.heading}>{pro.title.toLowerCase()}</h3>
                {/* End of  Modification and addition by Om Shirvastava on 02-12-23
                Reason : Add the lowercase property  */}
                {/* <span className={styles.delete} style={{fontSize:"32px",alignSelf:"start"}} onClick={e=>cartSave(pro)}>x</span> */}
                <Popconfirm placement="bottomLeft" title={text} onConfirm={e => confirm(pro)} okText="OK" cancelText="Cancel">
                  {/* <span className={styles.delete} style={{ fontSize: "28px", alignSelf: "start" }} >x</span> */}
                  <MdClose fontSize={24}  className={styles.delete}/>
                </Popconfirm>
              </div>

              <div style={{ color: "black", marginLeft: "20px" }} className={styles.price}> {currency.sign}{(pro.price * currency.value).toFixed(2)}</div>
              {/* Modification and addition by Om Shrivastava on 19-11-23
              Reason : Need to remove the margintop */}
              {/* <div style={{ color: "black", marginLeft: "20px", marginTop: "8px" }}> */}
              <div style={{ color: "black", marginLeft: "20px",marginTop: "2px" }}>
              {/* End of addition by Om Shrivastava on 19-11-23 
              Reason : Need to remove the margintop*/}
                <span className={styles.size}>Size :</span>
                <span className={styles.showSize}> {SizeGetter(pro.size)}</span>
              </div>
              {/* <div style={{ color: "black", marginLeft: "20px", marginTop: "8px" }}> */}
              <div style={{ color: "black", marginLeft: "20px",letterSpacing:'1.5px' ,lineHeight:'10px',paddingBottom:'4px'}}>

                <span className={styles.shipping} style={{fontSize:'12px',paddingBottom:'10px'}}>Standard Shipping:</span>
                {pro.ready_to_ship ?
                  <span style={{fontSize:'12px',letterSpacing:'0.5px'}} className={styles.shipping}> {pro.ready_to_ship_days}</span> :
                  <span style={{fontSize:'12px',letterSpacing:'0.5px'}} className={styles.shipping}> {pro.shipping_days}</span>}

              </div>
              <div className={styles.gaping} ></div>
              <div className={styles.qtyContainer}>
                <div className={styles.operatorContainer}>
                  <span className={styles.radius} onClick={e => decreament(pro)}><HiMinus fontSize={15} /></span>
                  <span className={styles.quantity}>{pro.quantity}</span>
                  <span className={styles.radius} onClick={e => increament(pro)}><HiPlus fontSize={15} /></span>
                </div>
              </div>
              <div id={`style${pro.id}${pro.size}`} style={{ display: "flex", justifyContent: "end", margin: "0 5%", fontSize: ".8rem", color: "red", display: "none" }}>No More Stock Available
              </div>

            </div>
          </div>
        </>
      )) : <div style={{ fontSize: "20px", color: "#7c7c7c", height: "100%", display: "flex", justifyContent: "center" }}><span>Your Bag Is Empty</span></div>}
      <DrawerFooter />
    </>
  )
}

CartCard.defaultProps = {
  image_src: 'https://play.teleporthq.io/static/svg/default-img.svg',
  image_alt: 'image',
  heading: 'Heading',
  text: 'Text',
  heading1: 'Heading',
  button: 'Button',
}

CartCard.propTypes = {
  image_src: PropTypes.string,
  image_alt: PropTypes.string,
  heading: PropTypes.string,
  text: PropTypes.string,
  heading1: PropTypes.string,
  button: PropTypes.string,
}

export default CartCard