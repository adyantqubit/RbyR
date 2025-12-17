/**
 * Created by - Ashlekh on 08-10-2024
 * Reason - To have Privacy policy section
 */

import { useContext, useEffect, useState } from "react";
import { getPrivacyPolicyDetailsAPI } from "../../Api/services";
import privacyPolicyStyle from "./privacyPolicy.module.css";
import parse from "html-react-parser";
import NavigationPath from "../../components/NavigationPath/NavigationPath";
import { GlobalContext } from "../../context/Context";

const PrivacyPolicy = () => {
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const { navigationPath, setNavigationPath } = useContext(GlobalContext);
  // Added by - Ashlekh on 08-10-2024
  // Reason - This useEffect will executes when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
    privacyPolicyDetails();
  }, []);
  //   End of code - Ashlekh on 08-10-2024
  //   Reason - This useEffect will executes when page loads
  //   Added by - Ashlekh on 08-10-2024
  //   Reason - To display navigation path
  useEffect(() => {
    setNavigationPath([
      { name: "Home", path: "/" },
      { name: "Privacy Policy", path: "/privacy_policy" },
    ]);
    window.scrollTo(0, 0);
  }, [setNavigationPath]);
  //   End of code - Ashlekh on 08-10-2024
  //   Reason - To display navigation path
  //   Added by - Ashlekh on 08-10-2024
  //   Reason - To get details from backend
  const privacyPolicyDetails = async () => {
    try {
      const response = await getPrivacyPolicyDetailsAPI();
      setPrivacyPolicy(response?.policy?.privacyPolicy);
    } catch (error) {
      console.error(error.message);
    }
  };
  //   End of code - Ashlekh on 08-10-2024
  //   Reason - To get details from backend
  return (
    <div className={privacyPolicyStyle.pageFrame}>
      <div className={privacyPolicyStyle.pageContainer}>
        <NavigationPath navigationPathArray={navigationPath} />
        <h2 className={privacyPolicyStyle.pageHeading}>Privacy Policy</h2>
        {privacyPolicy != null && privacyPolicy?.trim()?.length > 0 ? (
            <div className={`${privacyPolicyStyle.privacyPolicyDescription}`}>{parse(privacyPolicy)}</div>
        ) : (
          <p>No content found</p>
        )}
      </div>
    </div>
  );
};
export default PrivacyPolicy;
