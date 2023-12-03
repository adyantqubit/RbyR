import React, { useEffect, useState } from "react";
import Footer from "../global/footer";
import Navbar from "../global/NavHeader";
import style from "./StoreLocator.module.css";
import parse from "html-react-parser";
import { getStoreLocatorDetail } from "../../api/service";
import config from "../../api/config";
import { notification } from 'antd';
import stylee from './globalFooterFile.module.css'


const StoreLocator = () => {
  notification.destroy()
  const [storeLocatorDetails, setStoreLocator] = useState([]);
  useEffect(() => {
    getStoreLocator();
    window.scrollTo(0,0)
  }, []);

  const getStoreLocator = async () => {
    const storeLocatorData = await getStoreLocatorDetail();
    if (storeLocatorData) {
      setStoreLocator(storeLocatorData);
    }
  };

  return (
    <div>
      <Navbar />
      <div className={style.storeContainer}>
      <div className='headingFooter'
      > Store Locator</div>
        <div className={style.row}>
          {storeLocatorDetails.length > 0 ? (
            <>
              {storeLocatorDetails.map((storeLocatorDetail) => {
                return (
                  <div className={style.column}>
                    <div className={style.item}>
                      <div className={style.itemTitle}>{parse(""+storeLocatorDetail.city)}</div>
                      <div className={style.itemContent}>
                        {/* Modification and addition by Om Shrivastava on 19-10-23
                        Reason : Need to set the path of the store locator image */}
                        {/* <img className={style.itemImage} 
                        src={config.staticBaseURL+storeLocatorDetail.storeImage}
                        /> */}
                        <img className={style.itemImage} 
                        src={config.staticBaseURL+'media/'+storeLocatorDetail.storeImage}
                        />
                         {/* End of modification and addition by Om Shrivastava on 19-10-23
                        Reason : Need to set the path of the store locator image */}
                        <div className={style.itemBody}>
                          <div className={style.itemText}>
                          {parse(""+storeLocatorDetail.address)}
                          </div>
                          <div className={style.itemText}>
                          {parse(""+storeLocatorDetail.phoneNumber)}
                          </div>
                          <div className={style.itemText}>
                          {parse(""+storeLocatorDetail.email)}
                          </div>
                          <div className={style.itemText}>
                          {parse(""+storeLocatorDetail.timing)}
                          </div>
                          <div style={{border:'1px solid black'}} className={style.itemButton}><a className={style.itemButton} href={`https://www.google.com/maps/search/?api=1&query=${storeLocatorDetail.address.replace( /(<([^>]+)>)/ig, '')}`}>GET DIRECTIONS</a></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            // Addition and modification by Om shrivastava on 27-11-23
          // Reason : Set the height and width
          <div className={stylee.footerRefundNullContent}
          // style={{height:'35vh'}}
          >
            
            <div 
            // style={{border:'1px solid black'}}
            >
            Store Locator Details Are Not Available
            </div>
            </div>
            // End of addition and modification by Om shrivastava on 27-11-23
          // Reason : Set the height and width

          )}
          {/* <div className={style.item}>
              <div className={style.itemTitle}>RAIPUR</div>
              <div className={style.itemContent}>
                <img className={style.itemImage} />
                <div className={style.itemBody}>
                  <div className={style.itemText}>
                    C-179 SHAILENDRA NAGAR, KATORA TALAB
                  </div>
                  <div className={style.itemText}>
                    Raipur, Chhattisgarh, India 492001
                  </div>
                  <div className={style.itemText}>PHONE: 0771-4349744</div>
                  <div className={style.itemText}>adyant.org@gmail.com</div>
                  <div className={style.itemText}>TIMING: 11 am to 7 pm</div>
                  <div className={style.itemButton}>GET DIRECTIONS</div>
                </div>
              </div>
            </div> */}
          {/* 
          <div className={style.column}>
            <div className={style.item}>
              <div className={style.itemTitle}>RAIPUR</div>
              <div className={style.itemContent}>
                <img className={style.itemImage} />
                <div className={style.itemBody}>
                  <div className={style.itemText}>
                    C-179 SHAILENDRA NAGAR, KATORA TALAB
                  </div>
                  <div className={style.itemText}>
                    Raipur, Chhattisgarh, India 492001
                  </div>
                  <div className={style.itemText}>PHONE: 6268571516</div>
                  <div className={style.itemText}>info@adyant.co.in</div>
                  <div className={style.itemText}>TIMING: 11 am to 7 pm</div>
                  <div className={style.itemButton}>GET DIRECTIONS</div>
                </div>
              </div>
            </div>
          </div> */}
        </div>

        <div style={{ paddingTop: "100px",backhround:"#323232" }}>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default StoreLocator;
