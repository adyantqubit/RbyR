/**Code added by Unnati on 09-08-2024
 * Reason-To have brand page
 */
import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
// import { getBrandItem } from "../../Api/services";
import BrandStyle from "./Brand.module.css";
import config from "../../Api/config";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import NavigationPath from "../../components/NavigationPath/NavigationPath";
import { GlobalContext } from "../../context/Context";
const Brand = () => {
  const { id } = useParams();
  const [viewType, setViewType] = useState("grid");
  const [brand, setBrand] = useState([]);
  const [sortOrder, setSortOrder] = useState("default");
  {
    /**Code added by Unnati on 28-08-2024
     * Reason-Added navigation link path
     */
  }
  const { navigationPath, setNavigationPath } = useContext(GlobalContext);
  useEffect(() => {
    window.scrollTo(0, 0);
    setNavigationPath([
      { name: "Home", path: "/" },
      { name: "Brand", path: "/brand" },
    ]);
  }, []);

  const scrollDoc = () => {
    window.scrollTo(0, 0);
  };
  {
    /**End of code addition by Unnati on 28-08-2024
     * Reason-Added navigation link path
     */
  }

  /**Code added by Unnati Bajaj on 09-08-2024
   * Reason -To get blog when the component loads
   */
  // useEffect(() => {
  //   const fetchBrandItem = async () => {
  //     try {
  //       const response = await getBrandItem(id, sortOrder);
  //       setBrand(response.product);
  //     } catch (error) {
  //       console.error("Error fetching brand item:", error.message);
  //     }
  //   };
  //   fetchBrandItem();
  // }, [id, sortOrder]);
  /*End of code addition by Unnati Bajaj on 09-08-2024
   * Reason -To get blog when the component loads
   */

  /**Code added by Unnati Bajaj on 09-08-2024
   * Reason -To handle sort change
   */
  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const getIcon = () => {
    switch (sortOrder) {
      case "lowToHigh":
        return <FaLongArrowAltUp />;
      case "highToLow":
        return <FaLongArrowAltDown />;
      default:
        return null;
    }
  };
  /**End of code addition by Unnati Bajaj on 09-08-2024
   * Reason -To handle sort change
   */

  return (
    <div className={BrandStyle.pageFrame}>
      <div className={BrandStyle.coloredBackground}>
        <div className={`${BrandStyle.pageContainer}`}>
          {/**Code added by Unnati on 28-08-2024
           * Reason-Added navigation link path
           */}
          <NavigationPath navigationPathArray={navigationPath} />
          {/**End of code adddition by Unnati on 28-08-2024
           * Reason-Added navigation link path
           */}
          <div className={BrandStyle.productContainer}>
            <div className={BrandStyle.pageTitle}>
              {/**Code added by Unnati on 03-10-2024
               *Reason-Modified heading */}
              <h2>Brand</h2>
              {/**End of code addition by Unnati on 03-10-2024
               *Reason-Modified heading */}
            </div>
            <div className={BrandStyle.categoryImage}>
              <img
                src="/sale_banner3.jpeg"
                alt="E-commerce Banner"
                className={`${BrandStyle.bannerImage}`}
              />
            </div>
            <div className={BrandStyle.viewToggleButtons}>
              <div className={BrandStyle.viewButtons}>
                {/* <div
                  className={`${BrandStyle.square} ${
                    viewType === "grid" ? BrandStyle.active : ""
                  }`}
                > */}
                <p
                  // className={`${BrandStyle.squareIcon}`}
                  onClick={() => setViewType("grid")}
                >
                  {/* <BsGrid3X2 /> */}
                </p>
                {/* </div> */}
                {/* <div
                  className={`${BrandStyle.square} ${
                    viewType === "list" ? BrandStyle.active : ""
                  }`}
                >
                  <p
                    className={`${BrandStyle.squareIcon}`}
                    onClick={() => setViewType("list")}
                  >
                    <FaList />
                  </p>
                </div> */}
              </div>

              <div className={BrandStyle.sortContainer}>
                <p className={BrandStyle.sortTitle}>Sort By</p>
                <select value={sortOrder} onChange={handleSortChange}>
                  <option value="default">Default</option>
                  <option value="lowToHigh">Price: Low to High</option>
                  <option value="highToLow">Price: High to Low</option>
                </select>
                <div className={BrandStyle.iconWrapper}> {getIcon()} </div>
              </div>
            </div>
            <div
              className={
                viewType === "grid"
                  ? BrandStyle.gridContainer
                  : BrandStyle.listContainer
              }
            >
              {/**Code added by Unnati 09-08-2024
               *Reason-To have map brand products */}
              {brand &&
                brand.map((product) => (
                  <div
                    key={product.id}
                    className={
                      viewType === "grid"
                        ? BrandStyle.gridCard
                        : BrandStyle.listCard
                    }
                  >
                    <Link
                      to={`/productdetail/${product.product_id}`}
                      className={BrandStyle.productLink}
                    >
                      <div
                        className={
                          viewType === "grid"
                            ? BrandStyle.gridImageContainer
                            : BrandStyle.listImageContainer
                        }
                      >
                        <img
                          src={`${config.baseURL}${product.image1}`}
                          alt={product.name}
                          className={
                            viewType === "grid"
                              ? BrandStyle.gridImage
                              : BrandStyle.listImage
                          }
                        />
                        <button
                          className={
                            viewType === "grid"
                              ? BrandStyle.addToCartButton
                              : BrandStyle.listaddToCartButton
                          }
                        >
                          Add to Cart
                        </button>
                      </div>
                      <div
                        className={
                          viewType === "grid"
                            ? BrandStyle.gridContent
                            : BrandStyle.listContent
                        }
                      >
                        <h3
                          className={
                            viewType === "grid"
                              ? BrandStyle.brandName
                              : BrandStyle.listBrandName
                          }
                        >
                          {product.name.length > 50
                            ? `${product.name.substring(0, 50)}...`
                            : product.name}
                        </h3>
                        <h4
                          className={
                            viewType === "grid"
                              ? BrandStyle.cardTitle
                              : BrandStyle.listCardTitle
                          }
                        >
                          {product.description.length > 50
                            ? `${product.description.substring(0, 50)}...`
                            : product.description}
                        </h4>
                        <p
                          className={
                            viewType === "grid"
                              ? BrandStyle.cardPrice
                              : BrandStyle.listCardPrice
                          }
                        >
                          ${product.sales_rate}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              {/**End of code addition by Unnati 09-08-2024
               *Reason-To have map brand products */}
            </div>
            {/**Code added by Unnati on 27-06-2024
             *Reason-To have pagination in category page */}
            {/* <div className={BrandStyle.viewToggleButtons}>
              <div className={BrandStyle.viewButtons}> */}
            {/* <div
                  className={`${BrandStyle.square} ${
                    viewType === "grid" ? BrandStyle.active : ""
                  }`}
                > */}
            {/* <p
                  className={`${BrandStyle.squareIcon}`}
                  onClick={() => setViewType("grid")}
                > */}
            {/* <BsGrid3X2 /> */}
            {/* </p> */}
            {/* </div> */}
            {/* <div
                  className={`${BrandStyle.square} ${
                    viewType === "list" ? BrandStyle.active : ""
                  }`}
                >
                  <p
                    className={`${BrandStyle.squareIcon}`}
                    onClick={() => setViewType("list")}
                  >
                    <FaList />
                  </p>
                </div> */}
            {/* </div>
            </div> */}
          </div>
        </div>
      </div>
      {scrollDoc()}
    </div>
  );
};

export default Brand;
/**End of code addition by Unnati on 09-08-2024
 * Reason-To have brand page
 */
