/**Code added by Unnati on 10-06-2024
 * Reason - To have about us page
 */
import React, { useEffect, useState, useContext } from "react";
import AboutStyle from "./AboutUs.module.css";
import parse from "html-react-parser";
import { getAboutUs } from "../../Api/services";
import NavigationPath from "../../components/NavigationPath/NavigationPath";
import { GlobalContext } from "../../context/Context";
/**Code added by Unnati Bajaj on 10-06-2024
 * Reason -To scroll to the top when component loads
 */
const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  /**End of code addition by Unnati Bajaj on 10-06-2024
   * Reason -To scroll to the top when component loads
   */
  const [aboutus, setAboutus] = useState({});

  // const [banner, setBanner] = useState([]);
  const { navigationPath, setNavigationPath } = useContext(GlobalContext);
  useEffect(() => {
    setNavigationPath([
      { name: "Home", path: "/" },
      { name: "About Us", path: "/aboutus" },
    ]);
    window.scrollTo(0, 0);
  }, [setNavigationPath]);
  /**Code added by Unnati Bajaj on 10-06-2024
   * Reason -To get About us when the component loads
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAboutUs();
        setAboutus(data.aboutUs);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, []);
  /**End of code addition by Unnati Bajaj on 10-06-2024
   * Reason -To get About us when the component loads
   */

  /**Code added by Unnati Bajaj on 10-06-2024
   * Reason -To getsetting details when the component loads
   */
  // useEffect(() => {
  //   const fetchBanner = async () => {
  //     try {
  //       const data = await getSettings();
  //       setBanner(data.contact_info);
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   };
  //   fetchBanner();
  // }, []);
  /**Code added by Unnati Bajaj on 10-06-2024
   * Reason -To getsetting details when the component loads
   */
  const scrollDoc = () => {
    window.scrollTo(0, 0);
  };
  return (
    <div className={AboutStyle.pageFrame}>
      <div className={AboutStyle.pageContainer}>
        <NavigationPath navigationPathArray={navigationPath} />
        <h2 className={AboutStyle.pageHeading}>About Us</h2>
        {/**Code commented by Unnati on 17-07-2024
         *Reason-This code is not in use because UI is changed */}
        {/* <div className={`${AboutStyle.bannerContainer}`}>
            <img src={`${config.baseURL}${banner.aboutUsBanner}`} alt="E-commerce Banner" className={`${AboutStyle.bannerImage}`} />
            <h1 className={`${AboutStyle.bannerHeading}`}>About Us</h1>
          </div>
          <div className={`${AboutStyle.pageContent}`}>

            {section1 && section1.map((item, index) => (
              <div key={index}>
                {item.heading && parse(item.heading)}
                {item.description && parse(item.description)}
              </div>
            ))}
            {section2 && section2.map((item, index) => (
              <div key={index}>
                <div className={`${AboutStyle.imageDescription}`}>
                  {index % 2 === 0 ? (
                    <div className={`${AboutStyle.imageContainer}`}>
                      <img src={`${config.baseURL}${item.image}`} alt="E-commerce Banner" className={`${AboutStyle.image}`} />
                    </div>
                  ) : (
                    <div className={`${AboutStyle.section2description}`}>
                      <p className={`${AboutStyle.heading}`}>{item.heading}</p>
                      <p>{item.description}</p>
                    </div>
                  )}
                  {index % 2 === 0 ? (
                    <div className={`${AboutStyle.section2description}`}>
                      <p className={`${AboutStyle.heading}`}>{item.heading}</p>
                      <p>{item.description}</p>
                    </div>
                  ) : (
                    <div className={`${AboutStyle.imageContainer}`}>
                      <img src={`${config.baseURL}${item.image}`} alt="E-commerce Banner" className={`${AboutStyle.image}`} />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {section3 && section3.map((item, index) => (
              <div key={index}>
                {parse(item.section3)}
              </div>
            ))}
            {section4 && section4.map((item, index) => (
              <div key={index}>
                {item.heading && parse(item.heading)}
                {item.description && (
                  <div className={`${AboutStyle.description}`}>
                    {parse(item.description)}
                  </div>
                )}
                {item.video && (
                  <div className={`${AboutStyle.videoContainer}`}>
                    {parse(item.video)}
                  </div>
                )}
              </div>
            ))}
          </div> */}
        {/**End of code addition by Unnati on 17-07-2024
         *Reason-This code is not in use because UI is changed */}
        {/**Code added by Unnati on 17-07-2024
         *Reason-To map about us description */}
        {aboutus && aboutus.description ? (
          <div>
            {/* Make sure the description is a string before parsing */}
            <div>{parse(aboutus.description)}</div>
          </div>
        ) : (
          <p>No content found</p>
        )}
        {/**End of code addition by Unnati on 17-07-2024
         *Reason-To map about us description */}
      </div>
      {scrollDoc()}
    </div>
  );
};
export default AboutUs;
/**End of code addition by Unnati on 10-06-2024
 * Reason - To have about us page
 */
