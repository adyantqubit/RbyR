/**Code added by Unnati on 28-08-2024
 * Reason-To have navigation path
 */

import { Link } from "react-router-dom";
import navigationPathStyle from "./NavigationPath.module.css";

const NavigationPath = ({ navigationPathArray }) => {
  return (
    <div className={navigationPathStyle.navigationPath}>
      {navigationPathArray.map((nav, index) => {
        return (
          <span key={index}>
            <Link
              to={nav.path || "#"}
              className={navigationPathStyle.navigationLink}
            >
              {index !== 0 && nav.name?.trim()?.length > 0 && (
                <span className={navigationPathStyle.navigationLinkText}>
                  {">"}
                </span>
              )}{" "}
              <span className={navigationPathStyle.navigationLinkText}>
                {nav.name}
              </span>
            </Link>
          </span>
        );
      })}
    </div>
  );
};

export default NavigationPath;
/**End of code addition by Unnati on 28-08-2024
 * Reason-To have navigation path
 */
