/**Code added by Unnati on 02-06-2024
 * Reason- To have FAQ Page
 */
import React, { useState, useEffect, useContext } from "react";
import styles from "./Faq.module.css";
import parse from "html-react-parser";
import { getFaq } from "../../Api/services";
import NavigationPath from "../../components/NavigationPath/NavigationPath";
import { GlobalContext } from "../../context/Context";
/**Code added by Unnati Bajaj on 10-06-2024
 * Reason -To scroll to the top when component loads
 */
const FAQ = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  /**End of code addition by Unnati Bajaj on 10-06-2024
   * Reason -To scroll to the top when component loads
   */
  const [faq, setFaq] = useState([]);
  {
    /**Code added by Unnati on 28-08-2024
     * Reason-Added navigation link path
     */
  }
  const { navigationPath, setNavigationPath } = useContext(GlobalContext);
  useEffect(() => {
    setNavigationPath([
      { name: "Home", path: "/" },
      { name: "Frequently Asked Question", path: "/faq" },
    ]);
    window.scrollTo(0, 0);
  }, [setNavigationPath]);
  {
    /**End of code addition by Unnati on 28-08-2024
     * Reason-Added navigation link path
     */
  }
  // const [banner, setBanner] = useState([]);
  // const [openIndex, setOpenIndex] = useState(-1);
  /**Code added by Unnati on 02-06-2024
   * Reason- To toggle answer when user click on the question
   */
  // const toggleAnswer = (index) => {
  //   setOpenIndex(openIndex === index ? -1 : index);
  // };
  /**End of code addition by Unnati on 02-06-2024
   * Reason- To toggle answer when user click on the question
   */

  /**Code modified by Unnati Bajaj on 12-08-2024
   * Reason -To get FAQ when the component loads
   */
  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const data = await getFaq();
        setFaq(data.faq);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchFaq();
  }, []);
  /**End of code addition by Unnati Bajaj on 12-08-2024
   * Reason -To get FAQ when the component loads
   */

  /**Code added by Unnati Bajaj on 10-06-2024
   * Reason -To get banner when the component loads
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
  /**End of code addition  by Unnati Bajaj on 10-06-2024
   * Reason -To get banner when the component loads
   */
  const scrollDoc = () => {
    window.scrollTo(0, 0);
  };
  return (
    <div className={styles.pageFrame}>
      <div className={styles.pageContainer}>
        {/**Code added by Unnati on 28-08-2024
         * Reason-Added navigation link path
         */}
        <NavigationPath navigationPathArray={navigationPath} />
        {/**End of code addition by Unnati on 28-08-2024
         * Reason-Added navigation link path
         */}
        <h2 className={styles.pageHeading}>Frequently Asked Questions</h2>
        {/* <div className={styles.bannerContainer}>
            <img src={`${config.baseURL}${banner.faqBanner}`} alt="E-commerce Banner" className={styles.bannerImage} />
            <h1 className={styles.bannerHeading}>{banner.faqBannerTitle}</h1>
          </div>
          <div className={styles.pageContent}>
            <div className={styles.faqContainer}>
              {faq.map((item, index) => (
                <div className={styles.faqItem} key={index}>
                  <div className={styles.question} onClick={() => toggleAnswer(index)}>
                    {index + 1}. {item.question}
                    <span className={styles.icon}>
                      {openIndex === index ? <SlMinus color={"var(--button-color)"} size={16} /> : <CgAdd color={"var(--button-color)"} />}
                    </span>
                  </div>
                  {openIndex === index && <div className={styles.answer}>{item.answer}</div>}
                </div>
              ))}
            </div>
          </div> */}
        {faq.length === 0 ? (
          <p>No content found</p>
        ) : (
          faq.map((item, index) => (
            <div key={index}>
              <div>{parse(item.description)}</div>
            </div>
          ))
        )}
      </div>
      {scrollDoc()}
    </div>
  );
};

export default FAQ;
/**End of code addition by Unnati on 02-06-2024
 * Reason- To have FAQ Page
 */
