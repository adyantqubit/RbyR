/**Code added by Unnati on 11-08-2024
 * Reason-To have shipping page
 */

import React, { useEffect, useState, useContext } from "react";
import ShippingStyle from "./Shipping.module.css";
import parse from "html-react-parser";
import { getShipping } from "../../Api/services";
import NavigationPath from "../../components/NavigationPath/NavigationPath";
import { GlobalContext } from "../../context/Context";
const Shipping = () => {
  /**Code added by Unnati Bajaj on 11-08-2024
   * Reason -To scroll to the top when component loads
   */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [shipping, setShipping] = useState({});
  /**Code added by Unnati on 28-08-2024
   * Reason-To have navigation path
   */
  const { navigationPath, setNavigationPath } = useContext(GlobalContext);
  useEffect(() => {
    setNavigationPath([
      { name: "Home", path: "/" },
      { name: "Shipping", path: "/shipping" },
    ]);
    window.scrollTo(0, 0);
  }, [setNavigationPath]);
  /**End of code addition by Unnati on 28-08-2024
   * Reason-To have navigation path
   */
  /**Code added by Unnati Bajaj on 11-08-2024
   * Reason -To get About us when the component loads
   */
  useEffect(() => {
    const fetchShipping = async () => {
      try {
        const data = await getShipping();
        setShipping(data.shipping);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchShipping();
  }, []);
  /**End of code addition by Unnati Bajaj on 11-08-2024
   * Reason -To get About us when the component loads
   */
  /**End of code addition by Unnati Bajaj on 11-08-2024
   * Reason -To scroll to the top when component loads
   */
  const scrollDoc = () => {
    window.scrollTo(0, 0);
  };
  return (
    <div className={ShippingStyle.pageFrame}>
      <div className={ShippingStyle.pageContainer}>
        {/**Code added by Unnati on 28-08-2024
         * Reason-To have navigation path
         */}
        <NavigationPath navigationPathArray={navigationPath} />
        {/**End of code addition by Unnati on 28-08-2024
         * Reason-To have navigation path
         */}
        <h2 className={ShippingStyle.pageHeading}>Shipping</h2>
        {/**Code added by Unnati on 11-08-2024
         *Reason-Mappig data coming from backend */}
        {shipping && shipping.description ? (
          <div>
            {/* Make sure the description is a string before parsing */}
            <div>{parse(shipping.description)}</div>
          </div>
        ) : (
          <p>No content found</p>
        )}
        {/**End of code addition by Unnati on 11-08-2024
         *Reason-Mappig data coming from backend */}
      </div>
      {scrollDoc()}
    </div>
  );
};

export default Shipping;
/**End of code addition by Unnati on 11-08-2024
 * Reason-To have shipping page
 */
