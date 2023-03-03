import { dividerClasses, getTableSortLabelUtilityClass } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import config from '../../api/config'
import { cartDeleteApi, getQrDetailApi, getStoreLocatorDetail, InvoiveSingleGetApi } from '../../api/service'
import { CartState } from '../../context'
import Footer from '../global/footer'
import Navbar from '../global/NavHeader'
import style from "./profile.module.css"
import { Button, Modal } from 'antd';
import parse from 'html-react-parser'
import styles from '../placeOrder/billing.module.css'
import { afterColumnTotalOfferAdd } from '../../Redux-manage/services/billing'
import { useCartUpdateMutation } from '../../Redux-manage/services/userAuthapi'
import { notification } from 'antd';
import { SizeGetter } from '../global/getSize'


const InsideOrder = () => {
  // notification.destroy()
  var { orders, setOrder, product, checkoutDetails, currency, taxRate, offer, cart, setCart, setshipEditCond, setShowEditable } = CartState()
  var { orderid } = useParams()
  var [states, setState] = useState([])
  var [allData, setAllData] = useState(null)
  var [onlineDetail, setonlineDetail] = useState(null)
  const nav = useNavigate()
  const [cartsaveApi, { isLoad }] = useCartUpdateMutation()


  const [storeLocatorDetails, setStoreLocator] = useState(null);
  useEffect(() => {
    getStoreLocator();
  }, []);

  const getStoreLocator = async () => {
    const storeLocatorData = await getStoreLocatorDetail();
    if (storeLocatorData) {
      setStoreLocator(storeLocatorData);
    }
  };

  async function invoiceapi() {
    var access = localStorage.getItem('access_token')
    var data = {
      order: orderid
    }
    await InvoiveSingleGetApi({ access, data }).then(r => {
      setState(r.history)
      allData = r
      console.log(allData)
      setAllData(allData)
    })

  }
  useEffect(() => {
    invoiceapi()
    qrDetails()
  }, [])


  function getPrice(orde) {
    var t = 0;
    states.map(o =>
      t += o.price * o.quantity)

    return t;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  async function qrDetails() {
    await getQrDetailApi().then(r => {
      try {
        const data = {
          name: r.name,
          account_number: r.account_number,
          bank_name: r.bank_name,
          qr_img: r.qr_img,
          upi_id: r.upi_id
        }
        setonlineDetail(data)
      }
      catch {
        setonlineDetail(null)
      }
    })
  }

  async function cartAdd() {

    cart = []

    var access = localStorage.getItem("access_token")

    await cartDeleteApi({ access }).then(r => console.log(r))


    for (const details of allData.history) {
      var detail=product.filter(p=>p.id==details.product_id)[0]
      const NewCartData = {
        ...detail,
        quantity: 1,
        size: `${details.size}`
      }


      const data = {
        product_no: details.product_id,
        size: `${details.size}`
      }


      var access_token = localStorage.getItem("access_token")

      cart.push(NewCartData)
      const resp = await cartsaveApi({ data, access_token }).then(r => console.log(r));

    }
    
    setCart(cart)
    nav("/cart")

  }


  useEffect(() => {
    if (allData != null) {
      var billingData = {
        firstname: allData.shipping.firstname,
        lastname: allData.shipping.lastname,
        street: allData.shipping.street,
        houseno: allData.shipping.houseno,
        city: allData.shipping.city,
        state: allData.shipping.state,
        zipcode: allData.shipping.zipcode,
        country: allData.shipping.country,
        number: allData.shipping.number
      }




      var shippingData = {
        firstname: allData.billing.firstname,
        lastname: allData.billing.lastname,
        street: allData.billing.street,
        houseno: allData.billing.houseno,
        city: allData.billing.city,
        state: allData.billing.state,
        zipcode: allData.billing.zipcode,
        country: allData.billing.country,
        number: allData.billing.number
      }
      checkoutDetails['shippingData'] = shippingData;
      checkoutDetails['billingData'] = billingData;
      checkoutDetails['userInfo'] = {
        "firstname": allData.billing.firstname,
        "lastname": allData.billing.lastname,
        "email": "dummy"
      }

      var car = []
      for (const produc of allData.history) {
        var p = product.filter(p => p.id == produc.product_id)[0]
        var pro = { ...p, "size": produc.size, "quantity": produc.quantity }
        car.push(pro)
      }
      checkoutDetails['cart'] = car
      checkoutDetails['CouponDiscount'] = allData.transaction.coupon_discount
      checkoutDetails['ShippingCharges'] = allData.transaction.shipping_price
      checkoutDetails['SubTotal'] = allData.transaction.subtotal_price
      checkoutDetails['tax'] = allData.transaction.tax
      checkoutDetails['grand'] = allData.transaction.grand_total
      checkoutDetails['payment'] = allData.history[0].payment_mode
      checkoutDetails['orderno'] = allData.history[0].order_no
      checkoutDetails['currency_sign'] = allData.history[0].selected_currency_sign
      checkoutDetails['currency_value'] = allData.history[0].selected_currency_value
      checkoutDetails['date']=allData.history[0].date
    }



    sessionStorage.setItem('checkoutDetails', JSON.stringify(checkoutDetails))
  }, [allData])

      

  return (
    <div className={style.scrolling} >
      <Navbar />
      <div className={style.Container}>
        <div className={style.centerContainer}>
          <div className={style.containerHeader}><Link to="/" className={style.containerHeader}>Homepage</Link> / My Account</div>
          <div className={style.main}>
            <div className={style.column1}>
              <div className={style.column1header}>MY ACCOUNT</div>
              <hr style={{ color: "black" }}></hr>
              <div className={style.column1text} onClick={e => setShowEditable(!true)}><Link to="/userprofile" style={{ textDecoration: "none", color: "#8c8c8c" }}>MY PROFILE</Link></div>
              <div className={style.column1text} onClick={e => setshipEditCond(true)}><Link to="/shippindprofile" style={{ textDecoration: "none", color: "#8c8c8c" }} >MY SHIPPING DETAILS</Link></div>
              <div className={style.column1text}><Link to="/profile" style={{ textDecoration: "none", color: "#8c8c8c" }}>MY ORDERS</Link></div>

            </div>
            <div className={style.column2}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className={style.column2header}>
                  MY ORDERS 
                </div>
                <div className={style.column2header1} style={{ whiteSpace: "nowrap", textAlign: 'end', color: "#8c8c8cc", textDecoration: "underline", fontSize: "14px", cursor: "pointer" }} onClick={cartAdd}>
                  REORDER
                </div>
              </div>
              <hr style={{ color: "black" }}></hr>
              <div className={style.resDetail}>
                <span className={style.details}>
                  <span className={style.userinfoText} >Date:<span className={style.userinfoText2}> {states != null && states.length > 0 ? states[0].date.split("-").reverse().join("-") : null}</span></span>   
                  <span className={style.userinfoText}>Order No:<span className={style.userinfoText2}> {orderid}</span></span>   
                </span>
                <span style={{alignSelf:"end"}}>
                  <Button className={style.userInfoButton} onClick={showModal}>
                    UPI Scanner
                  </Button>
                  <Modal title="Scan To Pay" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <div style={{ background: "white",width:'100%' }}>
                      {onlineDetail != null ?
                        <div className={styles.payBox} style={{width:"100%"}}>
                          <img src={config.apiBaseURL + onlineDetail.qr_img}
                            className={styles.img} />
                          <div className={styles.payTitle}>
                            <div>
                              <div ><span className={styles.userinfoText}>Name:</span><span className={styles.userinfoText2} >{onlineDetail.name}</span ></div>
                              <div ><span className={styles.userinfoText}>Bank Name:</span><span className={styles.userinfoText2}>{onlineDetail.bank_name}</span></div>
                              <div ><span className={styles.userinfoText} style={{ whiteSpace: "nowrap" }}>Account Number:</span><span className={styles.userinfoText2}>{onlineDetail.account_number}</span></div>
                              <div ><span className={styles.userinfoText}>UPI ID:</span><span className={styles.userinfoText2}>{onlineDetail.upi_id}</span></div>
                            </div>
                            <div style={{ height: "60px", width: "100%" }}><span className={styles.userinfoText2} style={{ lineBreak: "normal", wordBreak: 'keep-all' }}> Please Confirm To admin After paying  at {storeLocatorDetails != null ? parse("PHONE:"+storeLocatorDetails[0].phoneNumber) : null}</span></div>

                          </div>

                        </div>
                        : <div>The qr Code getting error</div>
                      }
                    </div>
                  </Modal>
                </span>
              </div>

              <div className={style.table} style={{ border: "1px solid white", marginTop: "20px" }}>
                <div className={style.tablerowhead2}>
                  <div className={style.rowitem1} style={{ justifyContent: "start", color: "black" }}>Product Name</div>
                  <div className={style.rowitem2} style={{ color: "black" }}>Status</div>
                  <div className={style.rowitem2} style={{ color: "black" }}>Price</div>
                  <div className={style.rowitem2} style={{ color: "black" }}>Qty</div>
                  <div className={style.rowitem2} style={{ color: "black" }}>SubTotal</div>
                </div>
                <hr style={{ color: "black" }}></hr>


                {states?.map((s, i) => {
                  var p = product.filter(p => p.id == s.product_id)[0]

                  if((typeof p)==='undefined'){
                   console.log("something went wrong")
                  }else
                  return <div className={style.tablerowhead} style={i % 2 == 0 ? { marginTop: "10px" } : { marginTop: "10px" }}>
                    <div className={style.rowitem3}>
                  
                    <img src={(typeof p.img_main)==='undefined'?null: config.apiBaseURL + p.img_main} className={style.imgresponsive} onClick={e=>nav(`/listing/${p.menu}/${p.category}/detail/${p.id}`)} />
                  
                      <span className={style.imgTitle}>
                        {p.title} ({SizeGetter(s.size)})
                      </span>
                    </div>
                    <div className={style.rowitem2} ><span className={style.userinfoTextHIDE} style={{whiteSpace:"nowrap",width:"auto"}}  >Order Status:- </span><span className={style.userinfoText3} style={{whiteSpace:"nowrap"}} >{s.order_status}</span></div>
                    <div className={style.rowitem2} ><span className={style.userinfoTextHIDE} style={{whiteSpace:"nowrap"}} >Price :- </span><span className={style.userinfoText3} style={{whiteSpace:"nowrap"}} >{s.selected_currency_sign} {(s.price * s.selected_currency_value).toFixed(2)}</span></div>
                    <div className={style.rowitem2} ><span className={style.userinfoTextHIDE} style={{whiteSpace:"nowrap"}} >Quantity :- </span><span className={style.userinfoText3} > {s.quantity} </span></div>
                    <div className={style.rowitem2} ><span className={style.userinfoTextHIDE} style={{whiteSpace:"nowrap"}} >Total :-</span><span className={style.userinfoText3} style={{whiteSpace:"nowrap"}} >{s.selected_currency_sign} {(p.price * s.quantity * s.selected_currency_value).toFixed(2)}</span></div>
                  </div>
                }
                )}



                <div className={style.totalBox} >
                  {allData != null ?
                    <div className={style.box} style={{ borderTop: "1px solid black" }}>
                      <div className={style.textlight1}><span className={style.userinfoText} style={{ width: "50%", textAlign: "start" }}>Sub Total</span><span className={style.userinfoText2} style={{ width: "50%", textAlign: "end" }}>{states[0].selected_currency_sign}{(allData.transaction.subtotal_price * states[0].selected_currency_value).toFixed(2)}</span></div>
                      <div className={style.textlight1}><span className={style.userinfoText} style={{ width: "50%", textAlign: "start" }}>Shipping Charges</span><span className={style.userinfoText2} style={{ width: "50%", textAlign: "end" }}>{states[0].selected_currency_sign}{(allData.transaction.shipping_price * states[0].selected_currency_value).toFixed(2)}</span></div>
                      <div className={style.textlight1}><span className={style.userinfoText} style={{ width: "50%", textAlign: "start" }}>Tax</span><span className={style.userinfoText2} style={{ width: "50%", textAlign: "end" }}>{states[0].selected_currency_sign}{(allData.transaction.tax * states[0].selected_currency_value).toFixed(2)}</span></div>
                      {/* Commented by - Ashish Dewangan on 15-02-2023
                      End of comment */}
                      {/* <div className={style.textlight1}><span className={style.userinfoText} style={{ width: "50%", textAlign: "start" }}>Coupon Discount</span><span className={style.userinfoText2} style={{ width: "50%", textAlign: "end" }}> - {states[0].selected_currency_sign} {(allData.transaction.coupon_discount * states[0].selected_currency_value).toFixed(2)}</span></div> */}
                      {/* End of comment */}
                      <hr style={{ color: "black" }}></hr>
                      <div className={style.textlight1}>
                        <span style={{ fontWeight: "600", width: "50%", textAlign: "start" }}>Total</span><span style={{ fontWeight: "600", width: "50%", textAlign: "end" }}> {states[0].selected_currency_sign} {(allData.transaction.grand_total * states[0].selected_currency_value).toFixed(2)}</span>
                      </div>
                      <Button type="primary" className={style.userInfoButton} style={{ width: "100%", marginTop: "15px" }} onClick={e => nav("/billing")}>
                        Get Invoice
                      </Button>
                    </div> : null}

                </div>


                <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap", marginTop: '150px', gap: "20px" }}>

                  <div className={styles.addressInformation} style={{ minWidth: "150px", maxWidth: "150px" }}>
                    <div ><span className={styles.userinfoText} >Shipping Address</span></div>
                    {allData != null ? <>
                      <div ><span className={styles.userinfoText} style={{ color: "black" }}>{allData.shipping.firstname} {allData.shipping.lastname}</span></div>
                      <div ><span className={styles.userinfoText} style={{ color: "black" }}>{allData.shipping.street} </span><span className={styles.userinfoText2} style={{ color: "black" }}>{allData.shipping.houseno},</span></div>
                      <div ><span className={styles.userinfoText} style={{ color: "black" }}>{allData.shipping.city} - </span><span className={styles.userinfoText2} style={{ color: "black" }}>{allData.shipping.zipcode},</span></div>
                      <div ><span className={styles.userinfoText} style={{ color: "black" }}>{allData.shipping.state} </span></div>
                    </>
                      : null}
                  </div>

                  <div className={styles.addressInformation} style={{ minWidth: "150px", maxWidth: "150px" }}>
                    <div ><span className={styles.userinfoText} >Billing Address</span></div>

                    {allData != null ? <>
                      <div ><span className={styles.userinfoText} style={{ color: "black" }}>{allData.billing.firstname} {allData.billing.lastname}</span></div>
                      <div ><span className={styles.userinfoText} style={{ color: "black" }}>{allData.billing.street} </span><span className={styles.userinfoText2} style={{ color: "black" }}>{allData.billing.houseno},</span></div>
                      <div ><span className={styles.userinfoText} style={{ color: "black" }}>{allData.billing.city} - </span><span className={styles.userinfoText2} style={{ color: "black" }}>{allData.billing.zipcode},</span></div>
                      <div ><span className={styles.userinfoText} style={{ color: "black" }}>{allData.billing.state} </span></div>
                    </>
                      : null}
                  </div>

                  <div className={styles.addressInformation} style={{ minWidth: "150px", maxWidth: "150px" }}>
                    <div ><span className={styles.userinfoText} >Shipping Method</span></div>
                    <div style={{ maxWidth: "150px" }}><span className={styles.userinfoText2} style={{ color: "black" }}>Standard shipping </span></div>
                  </div>

                  <div className={styles.addressInformation} style={{ minWidth: "150px", maxWidth: "150px" }}>
                    {allData != null ? <>
                      <div ><span className={styles.userinfoText} >Payment Status</span></div>
                      <div ><span className={styles.userinfoText} style={{ color: "black" }}>{allData.history[0].payment_mode}-{allData.transaction.payment_status}</span></div>
                    </> : null}
                  </div>

                </div>

              </div>

              <div style={{ height: "60px", width: "100%", marginTop: "40px" }}><span className={styles.userinfoText2} style={{ lineBreak: "normal", wordBreak: 'keep-all' }}> Please Confirm To admin After paying  at {storeLocatorDetails != null ? parse("PHONE:"+storeLocatorDetails[0].phoneNumber) : null}</span></div>


            </div>
          </div>
        </div>

      </div>
      <div className={style.foot}>
      <Footer />
      </div>
    </div>

  )
}

export default InsideOrder