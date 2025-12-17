/**Code added by Unnati on 22-08-2024
 * Reason-To have blog detail page
 */

import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import Styles from "./BlogDetails.module.css";
import parse from "html-react-parser";
import { getBlog } from "../../Api/services";
import NavigationPath from "../../components/NavigationPath/NavigationPath";
import { GlobalContext } from "../../context/Context";
import { DateFormatter } from "../../utils/DateFormat";

const BlogDetails = () => {
  const [blogDetail, setBlogDetail] = useState([]);
  const [blog, setBlog] = useState([]);
  const { id } = useParams();
  {
    /**Code added by Unnati on 28-08-2024
     * Reason-Added navigation link path
     */
  }
  const { navigationPath, setNavigationPath } = useContext(GlobalContext);
  useEffect(() => {
    setNavigationPath([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      // Code changed by - Ashlekh on 12-02-2025
      // Reason - To fix path of Blog Detail
      // { name: "Blog Detail", path: "/blog/:id" },
      { name: "Blog Detail", path: `/blog/${id}` },
      // End of code - Ashlekh on 12-02-2025
      // Reason - To fix path of Blog Detail
    ]);
    window.scrollTo(0, 0);
  }, [setNavigationPath]);
  {
    /**End of code addition by Unnati on 28-08-2024
     * Reason-Added navigation link path
     */
  }

  /**Code added by Unnati Bajaj on 22-08-2024
   * Reason -To get blog details when the component loads
   */

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlog(id);
        const details = await getBlog();
        setBlogDetail(data.blog);
        setBlog(details.blog);
      } catch (error) {
        console.error("Error fetching blog detail:", error.message);
      }
    };

    fetchBlog();
  }, [id]);

  /**End of code addition by Unnati Bajaj on 22-08-2024
   * Reason -To get blog details when the component loads
   */

  return (
    <div className={Styles.pageFrame}>
      {/**Code added by Unnati on 28-08-2024
       * Reason-Added navigation link path
       */}
      <NavigationPath navigationPathArray={navigationPath} />
      {/**End of code addition by Unnati on 28-08-2024
       * Reason-Added navigation link path
       */}
      <div className={Styles.blogPage}>
        <div className={Styles.mainContent}>
          {/**Code added by Unnati on 22-08-2024
           *Reason-Mapped blog data */}
          <h2>{blogDetail?.title}</h2>
          {/* Modified by by jhamman on 19-10-2024
          Reason - added function to format date from yyyy-mm-dd */}
          {/* <p className={Styles.date}>{blogDetail?.date}</p> */}
          {/* Added by - Ashlekh on 12-02-2025
          Reason - To check null condition for date */}
          {blogDetail?.date != null && (
          // End of code - Ashlekh on 12-02-2025
          // Reason - To check null condition for date
            <p className={Styles.date}>{DateFormatter(blogDetail?.date)}</p>
          )}
          {/* End of modification by jhamman on 19-10-2024
          Reason - added function to format date from yyyy-mm-dd */}
          <p>
            {parse(
              blogDetail?.description
                ? blogDetail?.description
                : "No Description Available"
            )}
          </p>
          {/**End of code addition by Unnati on 22-08-2024
           *Reason-Mapped blog data */}
        </div>
        <div className={Styles.sidebar}>
          {/* <div className={Styles.searchbox}>
          <input type="text" placeholder="Search posts here..." />
          <button type="submit">🔍</button>
        </div> */}
          <div className={Styles.recentPosts}>
            <h3>Recent Posts</h3>
            <ul className={Styles.recentPostsList}>
              {blog.map((item, index) => (
                <Link to={`/blog/${item.id}`}>
                  <li key={index}>{item?.title}</li>
                </Link>
              ))}
            </ul>
          </div>
          {/* <div className={Styles.archive}>
          <h3>Archive</h3>
          <ul>
          {blog.map((item, index) => (
              <Link to={`/blog/${item.id}`}>
                <li key={index}>{item.date}</li>
              </Link>
            ))}
          </ul>
        </div> */}
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
/**End of code addition by Unnati on 22-08-2024
 * Reason-To have blog detail page
 */
