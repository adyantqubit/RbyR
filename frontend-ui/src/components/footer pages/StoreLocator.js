import React, { useEffect, useState } from "react";
import Footer from "../global/footer";
import Navbar from "../global/NavHeader";
import style from "./StoreLocator.module.css";
import parse from "html-react-parser";
import { getStoreLocatorDetail } from "../../api/service";
import config from "../../api/config";

const StoreLocator = () => {
  const [storeLocatorDetails, setStoreLocator] = useState([]);
  useEffect(() => {
    getStoreLocator();
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
        <div className={style.row}>
          {storeLocatorDetails.length > 0 ? (
            <>
              {storeLocatorDetails.map((storeLocatorDetail) => {
                return (
                  <div className={style.column}>
                    <div className={style.item}>
                      <div className={style.itemTitle}>{parse(""+storeLocatorDetail.city)}</div>
                      <div className={style.itemContent}>
                        <img className={style.itemImage} src={config.apiBaseURL+storeLocatorDetail.storeImage}/>
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
                          <div className={style.itemButton}><a className={style.itemButton} href={`https://www.google.com/maps/search/?api=1&query=${storeLocatorDetail.address.replace( /(<([^>]+)>)/ig, '')}`}>GET DIRECTIONS</a></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div>Store details currently not available</div>
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

        <div style={{ marginTop: "5vh" }}>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default StoreLocator;
