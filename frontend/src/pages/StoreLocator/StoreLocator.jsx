/**Code added by Unnati on 02-06-2024
 * Reason-To have store locator page
 */

import React, { useEffect, useState, useContext } from "react";
import styles from "./StoreLocator.module.css";
import { getStoreLocator, getSettings } from "../../Api/services";
import config from "../../Api/config";
import { Link } from "react-router-dom";
import NavigationPath from "../../components/NavigationPath/NavigationPath";
import { GlobalContext } from "../../context/Context";

const StoreLocator = () => {
  /**Code added by Unnati on 12-06-2024
   * Reason-To have dummy image for store locator
   */
  const dummyImage = "/dummyImage1.jpg";
  /**End of code addition by Unnati on 12-06-2024
   * Reason-To have dummy image for store locator
   */

  /**Code added by Unnati Bajaj on 10-06-2024
   * Reason -To scroll to the top when component loads
   */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  /**End of code addition by Unnati Bajaj on 10-06-2024
   * Reason -To scroll to the top when component loads
   */

  const [stores, setStores] = useState([]);
  /**Code added by Unnati on 28-08-2024
   * Reason-To have navigation path
   */
  const { navigationPath, setNavigationPath } = useContext(GlobalContext);
  useEffect(() => {
    setNavigationPath([
      { name: "Home", path: "/" },
      { name: "Find our store", path: "/storelocator" },
    ]);
    window.scrollTo(0, 0);
  }, [setNavigationPath]);
  /**End of code addition by Unnati on 28-08-2024
   * Reason-To have navigation path
   */
  /**Code commented by Unnati on 19-06-2024
   * Reason-Remove banner from store locator
   */
  // const [banner, setBanner] = useState([]);
  /**End of code comment by Unnati on 19-06-2024
   * Reason-Remove banner from store locator
   */

  /**Code added by Unnati Bajaj on 02-06-2024
   * Reason -To get store details when the component loads
   */
  useEffect(() => {
    const fetchStoreLocator = async () => {
      try {
        const data = await getStoreLocator();
        setStores(data.store || []);
      } catch (error) {
        console.error(error.message);
        setStores([]);
      }
    };
    fetchStoreLocator();
  }, []);
  /**End of code addition by Unnati Bajaj on 02-06-2024
   * Reason -To get store details when the component loads
   */

  /**Code commented by Unnati Bajaj on 19-06-2024
   * Reason -To get banner when the component loads
   */
  // useEffect(() => {
  //   const fetchBanner = async () => {
  //     try {
  //       const data = await getSettings();
  //       setBanner(data.contact_info);
  //       console.log(data)
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   };
  //   fetchBanner();
  // }, []);
  /**End of code comment  by Unnati Bajaj on 19-06-2024
   * Reason -To get banner when the component loads
   */
  return (
    <div className={styles.pageFrame}>
      <div className={styles.coloredBackground}>
        <div className={styles.pageContainer}>
          {/**Code added by Unnati on 28-08-2024
           * Reason-To have navigation path
           */}
          <NavigationPath navigationPathArray={navigationPath} />
          {/**End of code addition by Unnati on 28-08-2024
           * Reason-To have navigation path
           */}
          <div className={styles.headingContainer}>
            {/**Code added by Unnati on 19-06-2024
             *Reason-  To add heading */}
            <h2>Find Our Store</h2>
          </div>
          {/**Code commented by Unnati on 19-06-2024
           *Reason-Remove banner from store locator page*/}
          {/* <div className={styles.bannerContainer}>
            <img src={`${config.baseURL}${banner.storeLocatorBanner}`} alt="E-commerce Banner" className={styles.bannerImage} />
            <h1 className={styles.bannerHeading}>{banner.storeLocatorBannerTitle}</h1>
          </div> */}
          {/**End of code comment by Unnati on 19-06-2024
           *Reason-Remove banner from store locator page*/}

          <div className={styles.pageContent}>
            {stores.map((store, index) => (
              /**Code added by Unnati on 19-06-2024
               *Reason -To add city on the top of card */
              <div key={index}>
                <h3>{store.city}</h3>
                {/**End of code addition by Unnati on 19-06-2024
                 *Reason -To add city on the top of card */}
                <div key={index} className={styles.card}>
                  <img
                    src={
                      store.image
                        ? `${config.baseURL}${store.image}`
                        : dummyImage
                    }
                    alt="Store"
                    className={styles.cardImage}
                  />
                  <div className={styles.cardInfo}>
                    <p>
                      {" "}
                      {store.address},&nbsp;
                      {/**Code added by Unnati on 19-06-2024
                       *Reason -To show city along with address */}
                      {store.city}
                      {/**End of code addition by Unnati on 19-06-2024
                       *Reason -To show city along with address */}
                    </p>
                    <p> {store.contact_number}</p>
                    <p> {store.email}</p>
                    {/**Code added by Unnati on 19-06-2024
                     *Reason -To show timings */}
                    <p> {store.timings}</p>
                    {/**End of code addition by Unnati on 19-06-2024
                     *Reason -To show timings */}
                  </div>
                  <div className={styles.buttonContainer}>
                    <Link
                      to={store.directionLink}
                      target="_blank"
                      className={styles.directionsButton}
                    >
                      Get Directions
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreLocator;
/**End of code addition by Unnati on 02-06-2024
 * Reason-To have store locator page
 */
