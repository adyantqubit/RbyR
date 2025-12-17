/**Code added by Unnati on 10-06-2024
 * Reason- To have Our Policies page
 */

import React, { useEffect, useState } from "react";
import { getOurPolicies } from "../../Api/services";
import OurPoliciesStyle from "./OurPolicies.module.css";
import parse from "html-react-parser";

/**Code added by Unnati Bajaj on 10-06-2024
 * Reason -To scroll to the top when component loads
 */
const OurPolicies = () => {
  const [policies, setPolicies] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  /**End of by Unnati Bajaj on 10-06-2024
   * Reason -To scroll to the top when component loads
   */

  /**Code added by Unnati Bajaj on 10-06-2024
   * Reason -To get policies when the component loads
   */
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const data = await getOurPolicies();
        setPolicies(data.Policies);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchPolicies();
  }, []);
  /**End of code addition by Unnati Bajaj on 10-06-2024
   * Reason -To get policies when the component loads
   */
  return (
    <div className={OurPoliciesStyle.pageFrame}>
      <div className={OurPoliciesStyle.coloredBackground}>
        <div className={OurPoliciesStyle.pageContainer}>
          <div>
            <h1 className={OurPoliciesStyle.mainHeading}>Our Policies</h1>
            {/**Code added by Unnati on 17-06-2024
             *Reason- To check whether values are received or not */}
            {policies.length === 0 ? (
              <p>No content found</p>
            ) : (
              /**End of code addition by Unnati on 17-06-2024
               *Reason- To check whether values are received or not */
              <div>
                <div>
                  <h2 className={OurPoliciesStyle.subHeading}>
                    Privacy Policy
                  </h2>
                  <div>
                    {policies.privacyPolicy && parse(policies.privacyPolicy)}
                  </div>
                </div>
                <div>
                  <h2 className={OurPoliciesStyle.subHeading}>
                    Shipping Policy
                  </h2>
                  <div>
                    {policies.shippingPolicy && parse(policies.shippingPolicy)}
                  </div>
                </div>
                <div>
                  <h2 className={OurPoliciesStyle.subHeading}>Return Policy</h2>
                  <div>
                    {policies.returnPolicy && parse(policies.returnPolicy)}
                  </div>
                </div>
                <div>
                  <h2 className={OurPoliciesStyle.subHeading}>
                    Cancellation Policy
                  </h2>
                  <div>
                    {policies.cancellationPolicy &&
                      parse(policies.cancellationPolicy)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurPolicies;
/**End of code addition by Unnati on 10-06-2024
 * Reason- To have Our Policies page
 */
