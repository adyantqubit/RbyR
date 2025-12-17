/**Code added by Unnati on 15-07-2024
 * Reason -To have Return and Exchange page
 */
import React, { useEffect, useState, useContext } from "react";
import { getReturnsAndExchanges } from "../../Api/services";
import styles from "./ReturnsAndExchanges.module.css";
import parse from "html-react-parser";
import NavigationPath from "../../components/NavigationPath/NavigationPath";
import { GlobalContext } from "../../context/Context";

const ReturnsAndExchanges = () => {
  const [returnsandExchanges, setReturnandExchanges] = useState({});
  /**Code added by Unnati on 28-08-2024
   * Reason-To have navigation path
   */
  const { navigationPath, setNavigationPath } = useContext(GlobalContext);
  useEffect(() => {
    setNavigationPath([
      { name: "Home", path: "/" },
      { name: "Returns And Exchange", path: "/returns-and-exchanges" },
    ]);
    window.scrollTo(0, 0);
  }, [setNavigationPath]);
  /**End of code addition by Unnati on 28-08-2024
   * Reason-To have navigation path
   */
  /**Code added by Unnati Bajaj on 15-07-2024
   * Reason -To scroll to the top when component loads
   */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  /**End of code addition by Unnati Bajaj on 15-07-2024
   * Reason -To scroll to the top when component loads
   */
  /**Code added by Unnati Bajaj on 15-07-2024
   * Reason -To get return and exchange description when the component loads
   */
  useEffect(() => {
    const fetchReturnAndExchange = async () => {
      try {
        const data = await getReturnsAndExchanges();
        setReturnandExchanges(data.returnsAndExchanges);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchReturnAndExchange();
  }, []);
  /**End of code addition by Unnati Bajaj on 15-07-2024
   * Reason -To get return and exchange description when the component loads
   */
  const scrollDoc = () => {
    window.scrollTo(0, 0);
  };
  return (
    <div>
      <div className={styles.pageFrame}>
        <div className={styles.pageContainer}>
          {/**Code added by Unnati on 28-08-2024
           * Reason-To have navigation path
           */}
          <NavigationPath navigationPathArray={navigationPath} />
          {/**End of code addition by Unnati on 28-08-2024
           * Reason-To have navigation path
           */}
          <h2 className={styles.pageHeading}>Return and Exchange</h2>
          {returnsandExchanges && returnsandExchanges.description ? (
            <div>
              {/* Make sure the description is a string before parsing */}
              <div>{parse(returnsandExchanges.description)}</div>
            </div>
          ) : (
            <p>No content found</p>
          )}
        </div>
      </div>
      {scrollDoc()}
    </div>
  );
};

export default ReturnsAndExchanges;
/**End of code addition by Unnati on 15-07-2024
 * Reason -To have Return and Exchange page
 */
