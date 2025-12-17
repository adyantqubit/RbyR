/**Code added by Unnati on 16-11-2024
 * Reason-To have coming soon page
 */

import React from "react";
import ComingSoonStyle from "./ComingSoon.module.css";

const ComingSoon = () => {
  return (
    <div className={`${ComingSoonStyle.pageFrame}`}>
      <div className={`${ComingSoonStyle.coloredBackground}`}>
        <div className={`${ComingSoonStyle.pageContainer}`}>
          <div className={`${ComingSoonStyle.container}`}>
            <div className={ComingSoonStyle.noProductsFound}>
            {/**Code modified by Unnati on 15-01-2025
            *Reaso-Added coming soon banner */}
              {/* <h4>Coming soon....</h4> */}
              <div className={`${ComingSoonStyle.comingSoonBanner}`}>
                <img
                  src="/comingsoon.png"
                  alt={`Banner`}
                  className={`${ComingSoonStyle.comingSoonBannerImage}`}
                />
              </div>
              {/**End of code modification by Unnati on 15-01-2025
            *Reaso-Added coming soon banner */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
/**End of code addition by Unnati on 16-11-2024
 * Reason-To have coming soon page
 */
