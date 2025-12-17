/**Code added by Unnati on 22-08-2024
 * Reason-To have blog page
 */

import React, { useEffect, useState, useContext } from "react";
import Styles from "./Blog.module.css";
import { getBlog } from "../../Api/services";
import parse from "html-react-parser";
import { Link } from "react-router-dom";
import NavigationPath from "../../components/NavigationPath/NavigationPath";
import { GlobalContext } from "../../context/Context";
import { DateFormatter } from "../../utils/DateFormat";

const Blog = () => {
  const scrollDoc = () => {
    window.scrollTo(0, 0);
  };

  const [blog, setBlog] = useState([]);
  const { navigationPath, setNavigationPath } = useContext(GlobalContext);
  useEffect(() => {
    setNavigationPath([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
    ]);
    window.scrollTo(0, 0);
  }, [setNavigationPath]);

  /**Code added by Unnati Bajaj on 22-08-2024
   * Reason -To get blog when the component loads
   */
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlog();
        setBlog(data.blog);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchBlog();
  }, []);
  /**End of code addition by Unnati Bajaj on 22-08-2024
   * Reason -To get blog when the component loads
   */
  return (
    <div className={Styles.pageFrame}>
      <NavigationPath navigationPathArray={navigationPath} />
      {/* <div className={Styles.blogTitle}>
          <h2>Blog</h2>
        </div> */}
      <div className={Styles.blogPage}>
        {/**Code added by Unnati on 22-08-2024
         *Reason-Mapped blog data */}
        {/* Added by jhamman on 17-10-2024 Reason - added
            condition to print no details availbale*/}
        {blog && blog.length > 0 ? (
          /* End of addition by jhamman on 17-10-2024 
          Reason - added condition to print no details availbale */
          <>
            <div className={Styles.blogFrame}>
              {blog &&
                blog.map((item, index) => (
                  <div className={Styles.content}>
                    <div key={index} className={Styles.mainContent}>
                      <h2>
                        {parse(
                          item.title && item.title?.trim()?.length > 0
                            ? item.title
                            : ""
                        )}
                      </h2>
                      {/* Added by - Ashlekh on 12-02-2025
                      Reason - To check null condition for date */}
                      {item?.date != null && (
                        // End of code - Ashlekh on 12-02-2025
                        // Reason - To check null condition for date
                        <p className={Styles.date}>
                          {/* Modified by by jhamman on 19-10-2024
                          Reason - added function to format date from yyyy-mm-dd */}
                          {/* {parse(
                            item.date && item.date?.trim()?.length > 0
                              ? item.date
                              : ""
                          )} */}
                          {/* {formatDate(item?.date)} */}
                          {DateFormatter(item?.date)}
                          {/* End of modification by jhamman on 19-10-2024
                          Reason - added function to format date from yyyy-mm-dd */}
                        </p>
                      )}
                      <p className={Styles.description}>
                        {parse(
                          item.description &&
                            item.description?.trim()?.length > 0
                            ? item.description.substring(0, 500)
                            : ""
                        )}
                      </p>
                      <Link to={`/blog/${item?.id}`}>
                        <button className={Styles.readMore}>READ MORE</button>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
            {/* /**End of code addition by Unnati on 22-08-2024
             *Reason-Mapped blog data */}
            <div className={Styles.sidebar}>
              {/**Code commented by Unnati on 23-08-2024
               *Reason-This code is not in use currently */}
              {/* <div className={Styles.searchbox}>
          <input type="text" placeholder="Search posts here..." />
          <button type="submit">🔍</button>
        </div> */}
              {/**End of code comment by Unnati on 23-08-2024
               *Reason-This code is not in use currently */}
              <div className={Styles.recentPosts}>
                <h3>Recent Posts</h3>
                <ul className={Styles.recentPostsList}>
                  {blog.map((item, index) => (
                    <Link to={`/blog/${item.id}`}>
                      <li key={index}>{item.title}</li>
                    </Link>
                  ))}
                </ul>
              </div>

              {/* <div className={Styles.archive}>
          <h3>Archive</h3>
          <ul>
            <li>April 2023</li>
            <li>March 2023</li>
            <li>February 2022</li>
          </ul>
        </div> */}
            </div>
          </>
        ) : (
          <h4 className={Styles.noDetailsAvailable}> No details available</h4>
        )}
      </div>
      {scrollDoc()}
    </div>
  );
};

export default Blog;
/**End of code addition by Unnati on 22-08-2024
 * Reason-To have blog page
 */
