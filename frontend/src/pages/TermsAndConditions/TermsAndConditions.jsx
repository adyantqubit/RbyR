/**Code added by Unnati Bajaj on 10-06-2024
 * Reason- To have terms and conditions page
 */

import React, { useEffect, useState, useContext } from "react";
import termsAndconditionsStyle from "./TermsAndConditions.module.css";
import { getTermsAndConditions } from "../../Api/services";
import parse from "html-react-parser";
import { GlobalContext } from "../../context/Context";
import NavigationPath from "../../components/NavigationPath/NavigationPath";
/**Code added by Unnati Bajaj on 10-06-2024
 * Reason -To scroll to the top when component loads
 */
const TermsAndConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  /**End of code addition by Unnati Bajaj on 10-06-2024
   * Reason -To scroll to the top when component loads
   */
  const [termsAndConditions, setTermsAndConditions] = useState([]);
  /**Code added by Unnati Bajaj on 10-06-2024
   * Reason -To get terms and conditions when the component loads
   */
  useEffect(() => {
    const fetchTermsAndConditions = async () => {
      try {
        const data = await getTermsAndConditions();
        setTermsAndConditions(data.TermsAndConditions);
      } catch (error) {
        console.error(error.message);
      } 
    };
    fetchTermsAndConditions();
  }, []);
  /**End of code addition by Unnati Bajaj on 10-06-2024
   * Reason -To get terms and conditions when the component loads
   */
  /**Code added by Unnati on 18-10-2024
   * Reason-Added navigation link
   */
  const { navigationPath, setNavigationPath } = useContext(GlobalContext);
  useEffect(() => {
    setNavigationPath([
      { name: "Home", path: "/" },
      { name: "Terms And Condition", path: "/terms-and-conditions" },
    ]);
    window.scrollTo(0, 0);
  }, [setNavigationPath]);
  /**End of code addition by Unnati on 18-10-2024
   * Reason-Added navigation link
   */
  return (
    <div className={termsAndconditionsStyle.pageFrame}>
      {/**Code added by Unnati on 18-10-2024
       *Reason-Code commented and added navigation link */}
      {/* <div className={termsAndconditionsStyle.coloredBackground}> */}
      <div className={termsAndconditionsStyle.pageContainer}>
        <NavigationPath navigationPathArray={navigationPath} />
        <h2 className={termsAndconditionsStyle.pageHeading}>
          Terms And Conditions
        </h2>
        {/*End of code addition by Unnati on 18-10-2024
         *Reason-Code commented and added navigation link */}
        {termsAndConditions.length === 0 ? (
          <p>No content found</p>
        ) : (
          termsAndConditions.map((section, index) => (
            <div key={index}>
              {/**Code commented by Unnati on 18-10-2024
               *Reason-Added heading */}
              {/* <h2 className={termsAndconditionsStyle.subHeading}>
                {parse(section.heading)}
              </h2> */}
              {/**End of code commented by Unnati on 18-10-2024
               *Reason-Added heading */}
              <div>{parse(section.description)}</div>
            </div>
          ))
        )}
      </div>
      {/* </div> */}
    </div>
  );
};

export default TermsAndConditions;
/**End of code addition by Unnati Bajaj on 10-06-2024
 * Reason- To have terms and conditions page
 */