/**Code added by Unnati on 01-06-2024
 *Reason -To have header
 */
import React, { useEffect, useState, useContext, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import {
  getCategory,
  getSearchedProduct,
  removeItem,
  getCartItem,
  userDetails,
  getLatestDetailsOfCartItems,
} from "../../Api/services";
import styles from "./header1.module.css";
import { Link } from "react-router-dom";
import config from "../../Api/config";
import { RxHamburgerMenu } from "react-icons/rx";
import { GiBasket } from "react-icons/gi";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaLock } from "react-icons/fa";
import { GlobalContext } from "../../context/Context";
import { useLocation, useNavigate } from "react-router-dom";
import notificationObject from "../../components/Widgets/Notification/Notification";
import { BiSolidRightArrow } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import Marquee from "react-fast-marquee";
import { calculateDiscountFromProduct } from "../../utils/discountedPrices";
import { MdArrowBack, MdCancel, MdFavoriteBorder, MdSearch } from "react-icons/md";

import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import "./slider.css";
import { IoBagCheckOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const Header1 = () => {
  const [category, setCategory] = useState([]);
  const [dropdown, setDropdown] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [SearchProduct, setSearchProduct] = useState([]);
  const { cartData, setCartData, settingInfo } = useContext(GlobalContext);
  const [cartItem, setCartItem] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("0");
  const navigate = useNavigate();
  const { isUserLoading, social } = useContext(GlobalContext);
  const [loginWithCheckoutButton, setLoginWithCheckoutButton] = useState(false);
  // Added by - Ashlekh on 24-02-2025
  // Reason - useState for cart suggestion
  const [isCartOpen, setIsCartOpen] = useState(false);
  // End of code - Ashlekh on 24-02-2025
  // Reason - useState for cart suggestion
  /**Code commented by Unnati on 24-06-2024
   * Reason-These variables are not in use
   */
  // Addition by Om Shrivastava on 03-12-2024
  // Reason : Add the loader
  const [isLoading, setIsLoading] = useState(true);
  // End of addition by Om Shrivastava on 03-12-2024
  // Reason : Add the loader
  const [productCount, setProductCount] = useState();

  const { user, setUser } = useContext(GlobalContext);
  const [loggedOut, setLoggedOut] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEnter, setIsEnter] = useState(false);
  // Addition by Om Shrivastava on 14-12-2024
  // Reason : Set the search in phone view 
  const [isSearchActive, setSearchActive] = useState(false);

  const [scrolled, setScrolled] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredSubCategory, setHoveredSubCategory] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const locationHome = useLocation();

  // Check if current path is homepage
  const isHomePage = locationHome.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
       if (!isHomePage) return; 
      if (window.scrollY > 50) { // 50px scroll ke baad color change
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);


  const handleSearchClick = () => {
    setSearchActive(true);
  };

  const handleBackClick = () => {
    setSearchActive(false);
  };
  // End of addition by Om Shrivastava on 14-12-2024
  // Reason : Set the search in phone view 
  const dropdownRef = useRef(null);
  // const [isModalVisible, setIsModalVisible] = useState(false);
  // const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

  /**End of code commented by Unnati on 24-06-2024
   * Reason-These variables are not in use
   */
  /**Code added by Unnati on 25-10-2024
   * Reason-To handle checkout button click
   */
  const handleCheckoutClick = async () => {
    // Added by - Ashlekh on 24-02-2025
    // Reason - To close cart suggestion
    setIsCartOpen(false);
    // End of code - Ashlekh on 24-02-2025
    // Reason - To close cart suggestion
    if (user.id) {
      try {
        const response = await userDetails(localStorage.getItem("access"));
        if (response.code == "user_inactive") {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          setUser({});
          /**Code added by Unnati on 26-10-2024
           * Reason-Added notification
           */
          notificationObject.error("User is inactive.Please contact admin.");
          /**End of code addition by Unnati on 26-10-2024
           * Reason-Added notification
           */
          navigate("/login");
        } else {
          navigate("/checkout");
        }
      } catch (error) {
        console.error("Error fetching user details:", error.message);
      }
    }
  };
  /**End of code addition by Unnati on 25-10-2024
   * Reason-To handle checkout button click
   */
  /**Code added by Unnati on 30-10-2024
   * Reason-Added function to handle checkout when user is not logged in
   */
  const handleLoginWithCheckout = async () => {
    setLoginWithCheckoutButton(true);
    navigate("/login", { state: { loginWithCheckoutButton: true } });
  };
  /**End of code addition by Unnati on 30-10-2024
   * Reason-Added function to handle checkout when user is not logged in
   */

  /**Code commented by Unnati on 24-06-2024
   * Reason-Profile section is not displayed in header
   */
  // const handleProfileModalOk = () => {
  //   setIsProfileModalVisible(false);
  // };

  // const handleProfileModalCancel = () => {
  //   setIsProfileModalVisible(false);
  // };
  /**End of code commented by Unnati on 24-06-2024
   * Reason-Profile section is not displayed in header
   */

  /**Code commented by Unnati on 24-06-2024
   * Reason-Logout option is not displayed in the header
   */
  // const showModal = () => {
  //   setIsModalVisible(!isModalVisible);
  // };
  // const handleOk = () => {
  //   setIsModalVisible(!isModalVisible);
  //   handleLogout();
  // };

  // const handleCancel = () => {
  //   setIsModalVisible(!isModalVisible);
  // };
  /**End of code commented by Unnati on 24-06-2024
   * Reason-Logout option is not displayed in the header
   */

  /**Code commented by Unnati on 24-06-2024
   * Reason-Logout option is not displayed in the header
   */

  /* Added by jhamman on 17-10-2024
  Reason - to clear search term*/
  useEffect(() => {
    setSearchTerm("");
  }, [navigate]);
  /* End of addition by jhamman on 17-10-2024
  Reason - to clear search term*/

  const handleLogout = () => {
    localStorage.clear();
    setUser({});
    notificationObject.success("Successfully logged out");

    setLoggedOut(true);
    setCartData([]);
    /**
     * Added by - Ashish Dewangan on 13-12-2024
     * Reason - To forcefully navigate to home page
     */
    window.location = "/"
    /**
     * End of addition by - Ashish Dewangan on 13-12-2024
     * Reason - To forcefully navigate to home page
     */

  };
  /**
   * Uncommented by - Ashish Dewangan on 12-12-2024
   * Reason - To navigate to homepage when user loggs out
   */
  // useEffect(() => {
  //   if (loggedOut) {
  //     navigate("/");
  //   }
  // }, [loggedOut]);
  /**
 * End of uncomment by - Ashish Dewangan on 12-12-2024
 * Reason - To navigate to homepage when user loggs out
 */
  /**End of code comment by Unnati on 24-06-2024
   * Reason-Logout option is not displayed in the header
   */

  /* Added by jhamman on 30-10-2024
  Reason - Added breakpoint for category item as per screen size*/

  const [sliderRef, instanceRef] = useKeenSlider({
    breakpoints: {
      "(min-width: 300px)": {
        slides: { perView: 3 },
      },
      "(min-width:400px)": {
        slides: { perView: 4 },
      },
      "(min-width:500px)": {
        slides: { perView: 5 },
      },
      "(min-width:600px)": {
        slides: { perView: 6 },
      },
      "(min-width: 720px)": {
        slides: { perView: 6 },
      },
      "(min-width: 800px)": {
        slides: { perView: 7 },
      },
      "(min-width: 900px)": {
        slides: { perView: 7 },
      },
      "(min-width: 1000px) and (max-width: 1050px)": {
        slides: { perView: 8 },
      },
      "(min-width: 1120px)": {
        slides: { perView: 10 },
      },
      "(min-width: 1200px)": {
        slides: { perView: 10 },
      },
      "(min-width: 1300px)": {
        slides: { perView: 11 },
      },
      "(min-width: 1400px)": {
        slides: { perView: 12 },
      },
    },
    loop: false,
  });

  /* End of addition by jhamman on 30-10-2024
  Reason - Added breakpoint for category item as per screen size*/

  const performSearclickOnSearchModelButton = () => { };

  /**Code added by Unnati on 01-06-2024
   * Reason- To map categories and their sub categories
   */
  const SubCategories = ({ subcategories }) => {
    return (
      /**Code added by Unnati on 09-08-2024
       * Reason-Added classname in ul tag
       */
      <ul className={styles.allCategories}>
        {/**End of code addition by Unnati on 09-08-2024
         * Reason-Added classname in ul tag
         */}
        {subcategories.map((subcat) => (
          <li className={styles.dropdown} key={subcat.id}>
            <Link
              to={`/category/`}
              state={subcat.id}
              className={styles.categoryLink}
            >
              {subcat.name}

              {subcat.children && subcat.children.length > 0 && (
                <BiSolidRightArrow className={styles.arrowIcon} />
              )}
            </Link>
            {subcat.children && (
              <ul>
                {subcat.children?.map((subItem) => (
                  <li className={styles.dropdown} key={subItem.id}>
                    <Link
                      to={`/category/${subItem.id}`}
                      className={styles.SubCategorycategoryLink}
                    >
                      {subItem.name}

                      {subItem.children && subItem.children.length > 0 && (
                        <BiSolidRightArrow className={styles.arrowIcon} />
                      )}
                    </Link>
                    {subItem.children && (
                      <ul>
                        {subItem.children?.map((subSubItem) => (
                          <li key={subSubItem.id}>
                            <Link
                              to={`/category/${subSubItem.id}`}
                              className={styles.subSubCategorycategoryLink}
                            >
                              {subSubItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    );
  };
  /**End of code addition by Unnati on 01-06-2024
   * Reason- To map categories and their sub categories
   */

  /**Code added by Unnati Bajaj on 01-06-2024
   * Reason -To get categories when the component loads
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategory();
        setCategory(data.categoryList);
        setDropdown(data.dropdown);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchCategories();
  }, []);
  /**End of code addition by Unnati Bajaj on 01-06-2024
   * Reason -To get categories when the component loads
   */

  /**Code commented by Unnati Bajaj on 24-06-2024
   * Reason -To get socialLinks when the component loads
   */
  // useEffect(() => {
  //   const fetchSocialLinks = async () => {
  //     try {
  //       const data = await getSocialLinks();
  //       setSocial(data.social);
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   };
  //   fetchSocialLinks();
  // }, []);
  /**End of code commented by Unnati Bajaj on 24-06-2024
   * Reason -To get socialLinks when the component loads
   */
  /**Code commented by Unnati Bajaj on 26-07-2024
   * Reason -As we do not need to get whole product list in frontend
   */
  // useEffect(() => {
  //   const fetchProductList = async () => {
  //     try {
  //       const data = await getProductList();
  //       setProductList(data.product);
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   };
  //   fetchProductList();
  // }, []);
  /**End of code comment by Unnati Bajaj on 26-07-2024
   * Reason --As we do not need to get whole product list in frontend
   */
  /**Code added by Unnati Bajaj on 24-07-2024
   * Reason -To get searched product
   */
  /**Code modified by Unnati on 18-09-2024
   * Reason-Added is enter value
   */
  const fetchSearchProduct = async (isEnterValue) => {
    try {
      const data = await getSearchedProduct(
        selectedCategoryId,
        searchTerm,
        isEnterValue
      );
      setSearchProduct(data.products);
      setProductCount(data.product_count);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsEnter(false);
    }
  };
  /**End of code modification by Unnati on 18-09-2024
   * Reason-Added is enter value
   */
  /**Code modified by Unnati on 18-09-2024
   * Reason-Added is enter
   */
  useEffect(() => {
    if (searchTerm.length >= 3 || isEnter) {
      fetchSearchProduct(isEnter);
    }
  }, [selectedCategoryId, searchTerm, isEnter]);
  /**End of code modification by Unnati on 18-09-2024
   * Reason-Added is enter
   */
  /**End of code addition by Unnati Bajaj on 24-07-2024
   * Reason -To get searched product
   */
  /**Code added by Unnati Bajaj on 25-06-2024
   * Reason -To map the categories in the search bar dropdown
   */
  const renderOptions = (category, depth = 0) => {
    const prefix = "--".repeat(depth);
    return category?.flatMap((categories) => {
      const nestedOptions = categories.children
        ? renderOptions(categories.children, depth + 1)
        : [];

      return [
        <option key={categories.id} value={categories.id}>
          {prefix}
          {categories.name}
        </option>,
        ...nestedOptions,
      ];
    });
  };
  /**Code added by Unnati on 24-07-2024
   * Reason-To handle category change
   */
  const handleCategoryChange = (event) => {
    setSelectedCategoryId(event.target.value);
  };

  /**End of code addition Unnati on 24-07-2024
   * Reason-To handle category change
   */
  /**End of code addition by Unnati Bajaj on 25-06-2024
   * Reason -To map the categories in the search bar dropdown
   */

  /**Code commented by Unnati Bajaj on 01-06-2024
   * Reason -To get logo when the component loads
   */
  // useEffect(() => {
  //   const fetchlogo = async () => {
  //     try {
  //       const data = await getSettings();
  //       setLogo(data.setting);
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   };
  //   fetchlogo();
  // }, []);
  /**End of code commented by Unnati Bajaj on 01-06-2024
   * Reason -To get logo when the component loads
   */
  /**Code commented by Unnati Bajaj on 25-06-2024
   * Reason -To get brands when the component loads
   */
  // useEffect(() => {
  //   const fetchBrand = async () => {
  //     try {
  //       const data = await getbrand();
  //       setBrand(data.brand);
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   };
  //   fetchBrand();
  // }, []);
  /**End of code comment by Unnati Bajaj on 25-06-2024
   * Reason -To get brands when the component loads
   */

  /**Code added by Unnati on 07-07-2024
   * Reason-To filter not null sizes and map it with quantity
   */
  const getFilteredSizes = (item) => {
    const sizeKeys = ["XS", "S", "M", "L", "XL", "XXL", "XXXL",
      /**Code added by Unnati on 30-12-2024
       * Reason-Added free size
       */
      "free_size"];
    /**End of code addition by Unnati on 30-12-2024
     * Reason-Added free size
     */
    const filterSizeKeys = sizeKeys.filter((key) => item[key] !== null || 0);
    const mapSize = filterSizeKeys.map((key) => [key, item[key]]);
    return mapSize;
  };
  /**End of code addition by Unnati on 07-07-2024
   * Reason-To filter not null sizes and map it with quantity
   */
  /**Code added by Unnati on 12-08-2024
   * Reason-To get total item count in the cart
   */
  const getTotalItemCount = (cartData) => {
    let totalCount = 0;

    /**
     * Modified by - Ashish Dewangan on 01-12-2024
     * Reason - Counting total items in cart differently according to new schema
     */
    // for (let i = 0; i < cartData.length; i++) {
    //   const item = cartData[i];
    //   totalCount += item.XS || 0;
    //   totalCount += item.S || 0;
    //   totalCount += item.M || 0;
    //   totalCount += item.L || 0;
    //   totalCount += item.XL || 0;
    //   totalCount += item.XXL || 0;
    //   totalCount += item.XXXL || 0;
    // }
    for (let i = 0; i < cartData.length; i++) {
      const item = cartData[i];
      totalCount += parseInt(item.quantity ? item.quantity : 0);
    }
    /**
     * End of modification by - Ashish Dewangan on 01-12-2024
     * Reason - Counting total items in cart differently according to new schema
     */

    return totalCount;
  };

  const totalItemCount = getTotalItemCount(cartData);
  /**End of code addition by Unnati on 12-08-2024
   * Reason-To get total item count in the cart
   */

  /**Code commented by Unnati on 10-07-2024
   * Reason -To update cart data and set it in local storage
   */
  // const updateCartData = async (data) => {
  //   try {
  //     const updatedCartData = await updateCart(data);
  //     setCart(updatedCartData);
  //     localStorage.setItem("cartData", JSON.stringify(updatedCartData));
  //   } catch (err) {
  //     console.error("Error updating cart:", err);
  //   }
  // };
  /**End of code comment by Unnati on 10-07-2024
   * Reason -To update cart data and set it in local storage
   */
  /**Code added by Unnati on 07-07-2024
   * Reason-To delete product from my cart and local storage
   */
  const handleDelete = (
    product,
    size,
    logo,
    patches,
    security_batches,
    // Added by - Ashlekh on 19-02-2025
    // Reason - To add customization
    security_id_on_back,
    printed_id,
    // End of code - Ashlekh on 19-02-2025
    // Reason - To add customization
    embroider,
    color
  ) => {
    /**Code added by Unnati on 27-07-2024
     * Reason-To delete item from backend when user is logged in
     */
    if (user.id) {
      const deleteProduct = async () => {
        try {
          const data = await removeItem(
            user.id,
            product,
            size,
            logo,
            patches,
            security_batches,
            // Added by - Ashlekh on 19-02-2025
            // Reason - To add customization
            security_id_on_back,
            printed_id,
            // End of code - Ashlekh on 19-02-2025
            // Reason - To add customization
            embroider,
            color
          );
          localStorage.setItem("cartData", JSON.stringify(data.cartItem));
          setCartData(data.cartItem);
        } catch (error) {
          console.error(error.message);
        }
      };
      deleteProduct();
      /**End of code addition by Unnati on 27-07-2024
       * Reason-To delete item from backend when user is logged in
       */
    } else {
      /**
       * Modified by - Ashish Dewangan on 01-12-2024
       * Reason - Updated the code according to the customization functionality
       */
      // const updatedData = cartData
      //   .map((item) => {
      //     if (item.product === product) {
      //       if (item[size] !== null) {
      //         const updatedItem = { ...item, [size]: null };
      //         const remainingSizes = Object.values(updatedItem);
      //         const filterRemainingSizes = remainingSizes.filter(
      //           (value) => value !== null
      //         );
      //         const remainingSizesLength = filterRemainingSizes.length;
      //         return remainingSizesLength > 1 ? updatedItem : null;
      //       }
      //     }

      //     return item;
      //   })
      //   .filter((item) => item !== null);
      // localStorage.setItem("cartData", JSON.stringify(updatedData));
      // setCartData(updatedData);
      const updatedData = cartData
        .map((item) => {
          if (
            item.product === product &&
            item.logo === logo &&
            item.patches === patches &&
            item.security_batches === security_batches &&
            // Added by - Ashlekh on 19-02-2025
            // Reason - To add customization
            item.security_id_on_back === security_id_on_back &&
            item.printed_id === printed_id &&
            // End of code - Ashlekh on 19-02-2025
            // Reason - To add customization
            item.embroider === embroider &&
            item.size === size &&
            item.color === color
          ) {
            return null;
          } else {
            return item;
          }
        })
        .filter((item) => item !== null);
      localStorage.setItem("cartData", JSON.stringify(updatedData));
      setCartData(updatedData);
      /**
       * End of modification by - Ashish Dewangan on 01-12-2024
       * Reason - Updated the code according to the customization functionality
       */
    }
  };
  /**End of code addition by Unnati on 07-07-2024
   * Reason-To delete product from my cart and local storage
   */
  /**Code commented by Unnati on 12-07-2024
   * Reason-To filter the product according to the search term
   */
  // useEffect(() => {
  //   const filtered = ProductList.filter((product) =>
  //     product.name.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  //   setFilteredProduct(filtered);
  // }, [searchTerm, ProductList]);
  /**End of code comment by Unnati on 12-07-2024
   * Reason-To filter the product according to the search term
   */
  /**Code modified by Unnati on 24-07-2024
   * Reason-To handle search change
   */
  const handleSearchChange = (e) => {
    /**Code added by Unnati on 05-09-2024
     * Reason-To replace double space by single space
     */
    const value = e.target.value.replace(/\s{2,}/g, " ");
    setSearchTerm(value);
    /**End of code addition by Unnati on 05-09-2024
     * Reason-To replace double space by single space
     */
    // const trimmedValue = e.target.value.trim();
    // setSearchTerm(trimmedValue);
    setIsDropdownOpen(value?.trim()?.length >= 3);
  };
  /**Code added by Unnati on 05-09-2024
   * Reason-To handle serach when user intentionally press enter
   */
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      {
        /**Code added by Unnati on 18-09-2024
         *Reason-To setIsEnter value */
      }
      if (searchTerm.trim() === "") {
        e.preventDefault();
        return;
      }
      setIsEnter(true);
      {
        /**End of code addition by Unnati on 18-09-2024
         *Reason-To setIsEnter value */
      }
      setIsDropdownOpen(true);
    }
  };
  const performSearch = () => {
    if (searchTerm.trim().length > 0) {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  };

  /**End of code addition by Unnati on 05-09-2024
   * Reason-To handle serach when user intentionally press enter
   */
  /**End of code modification by Unnati on 24-07-2024
   * Reason-To handle search change
   */

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    // Modification and addition by Om Shrivastava on 30-12-2024
    // Reason : Change the mousedown to click 
    // document.addEventListener("mousedown", handleClickOutside);
    // return () => {
    //   document.removeEventListener("mousedown", handleClickOutside);
    // };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
    // Modification and addition by Om Shrivastava on 30-12-2024
    // Reason : Change the mousedown to click 
  }, []);
  /**Code added by Unnati on 20-09-2024
   * Reason-To close search dropdown when going to another page
   */
  const location = useLocation();
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [location]);
  /**End of code addition by Unnati on 20-09-2024
   * Reason-To close search dropdown when going to another page
   */
  /**Code commented by Unnati on 27-07-2024
   * Reason-This code is not in use
   */
  // const getProductDetails = (productId) => {
  //   return cartItem.find((product) => product.id === productId);
  // };
  /**End of code comment by Unnati on 27-07-2024
   * Reason-This code is not in use
   */
  /**Code commented by Unnati on 18-07-2024
   * Reason-To calculate cart total
   */
  // const calculateCartTotal = (cartData) => {
  //   const total =
  //     cartData &&
  //     cartData.reduce((total, item) => {
  //       const product = getProductDetails(item.productId || item.product) || {};
  //       const sizes = getFilteredSizes(item);
  //       const itemTotal = sizes.reduce((subtotal, [size, quantity]) => {
  //         const salesRate = product.sales_rate || 0;
  //         return subtotal + salesRate * quantity;
  //       }, 0);
  //       return total + itemTotal;
  //     }, 0);

  //   return total;
  // };
  /** End of Code comment by Unnati on 18-07-2024
   * Reason-To calculate cart total
   */

  /**Code commented by Unnati on 26-07-2024
   * Reason-This code is not in use
   */
  // const cartDataToPass =
  //   Array.isArray(cartData) &&
  //   cartData.map((item) => ({
  //     productId: item.productId || item.product,
  //     sizeQuantity: getFilteredSizes(item),
  //     productDetails: getProductDetails(item.productId || item.product),
  //   }));
  /**End of code commented by Unnati on 26-07-2024
   * Reason-This code is not in use
   */
  /**Code added by Unnati on 19-07-2024
   * Reason-To handle viewcart button
   */
  const handleViewCart = () => {
    // Added by - Ashlekh on 24-02-2025
    // Reason - To close cart suggestion
    setIsCartOpen(false);
    // Added by - Ashlekh on 24-02-2025
    // End of code - To close cart suggestion
    /**Code added by Unnati on 03-10-2024
     * Reason-Sending totalItemCount and subtotal through state in navigate
     */
    const subtotal = calculateSubtotal();
    navigate("/viewcart", { state: { totalItemCount, subtotal } });
    /**End of code addition by Unnati on 03-10-2024
     * Reason-Sending totalItemCount and subtotal through state in navigate
     */
  };
  /**End of code addition by Unnati on 19-07-2024
   * Reason-To handle viewcart button
   */
  /**Code added by Unnati on 28-07-2024
   * Reason-To get cart details when hovered in my cart
   */
  /**Code modified by Unnati on 07-12-2024
   * Reason-Added prevent default
   */
  const fetchCartDetails = async (e) => {
    // Added by - Ashlekh on 24-02-2025
    // Reason - To close cart suggestion
    setIsCartOpen(true)
    // Added by - Ashlekh on 24-02-2025
    // Reason - To close cart suggestion
    try {
      e.preventDefault();
      /*End of code addition by Unnati on 07-12-2024
      * Reason-Added prevent default
      */
      const product = cartData.map((item) => item.product);
      /**
       * Modified by - Ashish Dewangan on 12-12-2024
       * Reason - To handle fetch cart for guest user
       */
      // const response = await getCartItem(product);
      if (user && user.id) {
        const response = await getCartItem(product, user.id);
        localStorage.setItem("cartData", JSON.stringify(response.products))
        setCartData(response.products);
      } else {
        
        const response = await getLatestDetailsOfCartItems(cartData)
      
        localStorage.setItem("cartData", JSON.stringify(response.products))
        setCartData(response.products);
      }

     
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching cart details:", error);
    }
  };

  useEffect(() => {
    fetchCartDetails();
  }, [cartData]);
  /**End of code addition by Unnati on 28-07-2024
   * Reason-To get cart details when hovered in my cart
   */
  /**Code added by Unnati on 01-09-2024
   * Reason-To calculate subtotal
   */
  const calculateSubtotal = () => {
    /* Added by jhamman om 09-10-2024
    Reason - showing error cartData.reduce is not a function*/
    if (!Array.isArray(cartData)) {
      return 0;
    }
    /* End of addition by jhamman om 09-10-2024
    Reason - showing error cartData.reduce is not a function*/
    var total = 0;
    cartData.forEach((item) => {
      const price = item.sales_rate
        ? item.sale_percentage
          ? calculateDiscountFromProduct(item.sales_rate, item.sale_percentage)
          : item.sales_rate
        : 0;

      const finalPrice =
        // Code changed by - Ashlekh on 19-02-2025
        // Reason - To add customization
        // item.logo || item.patches || item.security_batches || item.embroider
        item.logo || item.patches || item.security_batches || item.security_id_on_back || item.printed_id || item.embroider
          // End of code - Ashlekh on 19-02-2025
          // Reason - To add customization
          ? item.after_customization_product_price || price
          : price;

      total += finalPrice * item.quantity;
    });
    /**Code modified by Unnati on 07-12-2024
     * Reason-Added to fixed
     */
    // return total;
    return parseFloat(total.toFixed(2));
    /**End of code modification by Unnati on 07-12-2024
    * Reason-Added to fixed
    */
  };

  /*End of code addition by Unnati on 01-09-2024
   * Reason-To calculate subtotal
   */

  /**
   * Added by - Ashlekh on 07-11-2024
   * Reason - To naviagte in wishlist
   */
  const wishListNavigation = () => {
    navigate("/wishlist");
  };
  /**
   * End of code - Ashlekh on 07-11-2024
   * Reason - To navigate in wishlist
   */
  /**
   * Added by - Ashlekh on 02-12-2024
   * Reason - To naviagte in order history and to send orders in state. This will be used to directly open My Order tab
   */
  const navigateMyOrder = () => {
    navigate("/myaccount", { state: { myOrder: "orders" } });
  };
  /**
   * End of code - Ashlekh on 02-12-2024
   * Reason - To naviagte in order history and to send orders in state. This will be used to directly open My Order tab
   */

  return (
    <>
      {/**Code added by Unnati on 24-0-2024
       *Reason-To have a header top */}
      <div className={styles.pageFrame}>
        <header
          className={styles.header} 
          // className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}
      //      className={`${styles.header} ${
      //   isHomePage ? styles.homeHeader : styles.normalHeader
      // } ${scrolled ? styles.scrolled : ""}`}
         >
          <div className={styles.headerTop} 
          // style={{ border: '1px solid red' }}
          >
            <div
              // Code changed by - Ashlekh on 25-02-2025
              // Reason - To apply condition & handle width in css
              // className={styles.headerTopLeftMost}
              className={
                user && user.email
                  ? `${styles.headerTopLeftMost} ${styles.headerTopLeftMostLoggedIn}`
                  : `${styles.headerTopLeftMost} ${styles.headerTopLeftMostLoggedOut}`
              }
            // End of code - Ashlekh on 25-02-2025
            // Reason - To apply condition & handle width in css
            >
              <span className={styles.iconContainer}>
                {social?.map((socialItem, index) => (
                  <Link
                    to={socialItem.social_link}
                    key={index}
                    className={styles.socialIcon}
                    target="_blank"
                    style={{ cursor: "auto" }}
                  >
                    <img
                      className={styles.img}
                      src={config.baseURL + socialItem.icon}
                      alt={socialItem.name}
                    />
                  </Link>
                ))}
              </span>
              {/**Code added by Unnati on 17-07-2024
               *Reason -To add telephone number in the header top that is coming from backend */}
              {/**Code added by Unnati on 04-10-2024
               *Reason-Added marque into headerTop */}
              <Marquee>
                {/**Code added by Unnati on 14-10-2024
                 *Reason-Changed label */}
                {/* Added by - Ashlekh on 17-12-2024
                 Reason - To apply condition in contact number */}
                {settingInfo?.contact_number != null && (
                  // End of code - Ashlekh on 17-12-2024
                  // Reason - To apply condition in contact number
                  <div className={styles.contactNumber}>
                    Contact Number : {settingInfo?.contact_number}
                  </div>
                )}
                {/* Added by - Ashlekh on 17-12-2024
                Reason - To apply condition in email */}
                {settingInfo?.email != null && (
                  // End of code - Ashlekh on 17-12-2024
                  // Reason - To apply condition im email
                  <div className={styles.contactNumber}>
                    Email : {settingInfo?.email}
                  </div>
                )}
                {/**End of code addition by Unnati on 14-10-2024
                 *Reason-Changed label */}
              </Marquee>
              {/**End of code addition by Unnati on 04-10-2024
               *Reason-Added marque into headerTop */}
            </div>
            {/**End of code addition by Unnati on 17-07-2024
             *Reason -To add telephone number in the header top that is coming from backend */}
            <div
              // Code changed by - Ashlekh on 25-02-2025
              // Reason - To apply condition & handle width in css
              // className={styles.icons}
              className={
                user && user.email
                  ? `${styles.icons} ${styles.iconsLoggedIn}`
                  : `${styles.icons} ${styles.iconsLoggedOut}`
              }
            // End of code - Ashlekh on 25-02-2025
            // Reason - To apply condition & handle width in css
            >

              {isUserLoading ? (
                <></>
              ) : user && user.email ? (
                /**Code added by Unnati on 18-09-2024
                 *Reason-Added profile section (name,email and logout) */
                <div className={styles.profileContainer}>
                  <div className={styles.profileIconContainer}>
                    <CgProfile
                      size={30}
                      className={styles.profileIcon}
                      color="white"
                    />
                    <ul className={styles.dropdownContent}>
                      <li>{user.first_name}</li>
                      <li>{user.email}</li>
                      {/* Added by - Ashlekh on 12-12-2024
                      Reason - To add contact us */}
                      <li>
                        <Link to="/contactus" className={`${styles.contactUsContainer}`}>
                          Contact Us
                        </Link>
                      </li>
                      {/* End of code - Ashlekh on 12-12-2024
                      Reason - To add contact us */}
                      <li>
                        <Link
                          onClick={handleLogout}
                          className={styles.logoutButton}
                        >
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                /**End of code addition by Unnati on 18-09-2024
                 *Reason-Added profile section (name,email and logout) */
                <div className={styles.signInContainer}>
                  <div className={styles.lockContainer}>
                    <FaLock size={10} className={styles.signInContainer} />
                  </div>
                  <div>
                    <Link className={styles.signIn} to="/login">
                      {/* Sign In /{" "} */}
                      Log In /{" "}
                    </Link>
                    <Link className={styles.signIn} to="/signup">
                      {/* Create an account */}
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}

              {/**End of code modification by Unnati on 14-09-2024
               *Reason-To check whether user is logged in or not */}
            </div>
          </div>
          {/**End of code addition by Unnati on 24-06-2024
           *Reason-To have a header top */}

          {/**Code added by Unnati on 24-06-2024
           *Reason-To have a header middle */}
          <div className={styles.headerMiddle} >
            <div className={styles.container}>
              <div className={styles.row}>


                <div className={styles.arrowBackIconContainerPhoneview}
                  // Addition by Om Shrivastava on 14-12-2024
                  // Reason : Set the search in phone view 
                  style={{
                    display: isSearchActive ? "block" : "none",
                  }}>
                  {/* // End of addition by Om Shrivastava on 14-12-2024
                // Reason : Set the search in phone view  */}
                  <MdArrowBack
                    className={styles.arrowIconPhoneView}
                    onClick={handleBackClick}
                    style={{ height: "20px", width: "20px" }}
                  />
                </div>

                <div className={styles.col9Search}>
                  <div className={styles.container}>
                    <input
                      type="checkbox"
                      id="menu-bar"
                      className={styles.menuBar}
                    />
                    <label htmlFor="menu-bar" className={styles.label}>
                      <RxHamburgerMenu />
                    </label>
                    <nav className={styles.navbar}>
                      <ul>
                        {category && <SubCategories subcategories={category} />}
                      </ul>
                    </nav>
                  </div>
                  <div className={styles.middleRightContainer}>
                    <div className={styles.searchWrapper}>
                      <div className={styles.searchContainer}>
                        <div className={styles.dropdownSearch}>
                          <select
                            className={styles.selectCategory}
                            onChange={handleCategoryChange}
                            value={selectedCategoryId}
                          >
                            {/**Code modified by Unnati on 24-07-2024
                             *Reason-To set value all categories value as 0*/}
                            <option
                              className={styles.selectCategoryValue}
                              value="0"
                            >
                              <div className={styles.allCategoryText}>
                                All Categories
                              </div>
                            </option>
                            {renderOptions(category)}
                            {/**End of code modification by Unnati on 24-07-2024
                             *Reason-To set value all categories value as 0*/}
                          </select>
                        </div>
                        <div className={styles.searchBarInput}>
                          <input
                            type="text"
                            className={styles.searchBar}
                            placeholder="Search Products..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            /**Code added by Unnati on 05-09-2024
                             * Reason-To handle enter key press
                             */
                            onKeyPress={handleKeyPress}
                          /**End of code addition by Unnati on 05-09-2024
                           * Reason-To handle enter key press
                           */
                          />
                          {isDropdownOpen && (
                            <div
                              className={`${styles.filteredProduct} ${SearchProduct?.length === 0
                                ? styles.noScroll
                                : styles.show
                                }`}
                              ref={dropdownRef}
                            >
                              {Array.isArray(SearchProduct) &&
                                SearchProduct.length > 0 ? (
                                <>
                                  <p className={styles.productCount}>
                                    {/* Modification and addition by Om Shrivastava on 21-12-2024
                                  Reason : Fix the count  */}
                                    {/* Products ({productCount}) */}
                                    Products ({SearchProduct.length})
                                    {/* End of modification and addition by Om Shrivastava on 21-12-2024
                                  Reason : Fix the count  */}
                                  </p>
                                  {SearchProduct.slice(0, 3).map((product) => (
                                    <Link
                                      to={`/productdetail/${product.product_id}`}
                                      /**Code added by Unnati on 05-12-2024
                                        *Reason-Send color through state */
                                      state={product.color}
                                      /**End of code addition by Unnati on 05-12-2024
                                      *Reason-Send color through state */
                                      key={product.id}
                                      onClick={() => setIsDropdownOpen(false)}
                                    >
                                      <div className={styles.productContainer}>
                                        {/* Added by jhamman on 11-10-2024
                                      Reason - to show offer percentage*/}
                                        <div
                                          className={`${styles.imageAndOfferLogoContainer}`}
                                        >
                                          {product.sale_percentage ? (
                                            <div
                                              className={styles.offerContainer}
                                            >
                                              <p
                                                className={
                                                  styles.offerPercentage
                                                }
                                              >
                                                -{product.sale_percentage}%
                                              </p>
                                            </div>
                                          ) : null}
                                          {/* End of addition by jhamman on 11-10-2024
                                          Reason - to show offer percentage*/}
                                          <img
                                            src={`${config.baseURL}${product.image1}`}
                                            alt={product.name}
                                            className={styles.imageSearchSize}
                                          />
                                        </div>
                                        <div className={styles.productInfo}>
                                          {/**Code added by Unnati on 18-11-2024
                                           *Reason-Added condition for handling long name */}
                                          <h4 className={styles.searchName}>
                                            {product.name.length > 50
                                              ? `${product.name.substring(
                                                0,
                                                50
                                              )}...`
                                              : product.name}
                                          </h4>
                                          {/**End of code addition by Unnati on 18-11-2024
                                           *Reason-Added condition for handling long name */}
                                          <p>
                                            {product.description.substring(
                                              0,
                                              100
                                            )}
                                          </p>
                                        </div>
                                        {/* Modified by Jhamman on 11-10-2024
                                        Reason- calculate sale price */}
                                        {/* <div className={styles.productPrice}>
                                          <h4>${product.sales_rate}</h4>
                                        </div> */}
                                        <div className={styles.productPrice}>
                                          {product.sale_percentage ? (
                                            <div className={styles.cardPrice}>
                                              <p
                                                className={
                                                  styles.discountedPriceText
                                                }
                                              >
                                                $
                                                {calculateDiscountFromProduct(
                                                  product.sales_rate,
                                                  product.sale_percentage
                                                )}
                                              </p>
                                            </div>
                                          ) : null}
                                          <div
                                            className={`${styles.cardPrice}`}
                                          >
                                            <p
                                              className={styles.mrpPriceText}
                                              style={
                                                product.sale_percentage
                                                  ? {
                                                    textDecoration:
                                                      "line-through",
                                                    textDecorationColor:
                                                      "#000",
                                                    color: "red",
                                                  }
                                                  : { color: "green" }
                                              }
                                            >
                                              ${product.sales_rate}
                                            </p>
                                          </div>
                                        </div>
                                        {/* End of modification by Jhamman on 11-10-2024
                              Reason- calculate sale price */}
                                      </div>
                                    </Link>
                                  ))}
                                  {SearchProduct.length > 3 && (
                                    <div
                                      className={styles.viewMore}
                                      onClick={() => {
                                        navigate("/searchresults", {
                                          state: {
                                            products: SearchProduct,
                                            query: searchTerm,
                                          },
                                        });
                                        setIsDropdownOpen(false);
                                      }}
                                    >
                                      View More
                                    </div>
                                  )}
                                </>
                              ) : (
                                <p className={styles.noProductFound}>
                                  No products found
                                </p>
                              )}
                            </div>
                          )}
                          {/* Added by - Ashlekh on 21-01-2025
                          Reason - To add cross icon */}
                          {searchTerm && (
                            <button
                              className={`${styles.crossButton}`}
                              onClick={() => {
                                setSearchTerm("");
                                setIsDropdownOpen(false);
                              }}
                            >
                              X
                            </button>
                          )}
                          {/* End of code - Ashlekh on 21-01-2025
                          Reason - To add cross icon */}
                          <button
                            className={styles.searchButton}
                            /**Code added by Unnati on 05-09-2024
                             * Reason-To handle serach
                             */
                            onClick={() => performSearch()}
                          /**End of code addition by Unnati on 05-09-2024
                           * Reason-To handle serach
                           */
                          >
                            <FiSearch />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Addition by Om Shrivastava on 14-12-2024
                  Reason : Show the search in phone view  */}
                  <div className={styles.middleRightContainerPhoneView} style={{
                    display:
                      isSearchActive ? "block" : "none",
                  }}>
                    <div className={styles.searchWrapper}>
                      <div className={styles.searchContainer}>
                        <div className={styles.dropdownSearch}>
                          <select
                            className={styles.selectCategory}
                            onChange={handleCategoryChange}
                            value={selectedCategoryId}
                          >
                            {/**Code modified by Unnati on 24-07-2024
                             *Reason-To set value all categories value as 0*/}
                            <option
                              className={styles.selectCategoryValue}
                              value="0"
                            >
                              <div className={styles.allCategoryText}>
                                All Categories
                              </div>
                            </option>
                            {renderOptions(category)}
                            {/**End of code modification by Unnati on 24-07-2024
                             *Reason-To set value all categories value as 0*/}
                          </select>
                        </div>
                        <div className={styles.searchBarInput}>
                          <input
                            type="text"
                            className={styles.searchBar}
                            placeholder="Search Products..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            /**Code added by Unnati on 05-09-2024
                             * Reason-To handle enter key press
                             */
                            onKeyPress={handleKeyPress}
                          /**End of code addition by Unnati on 05-09-2024
                           * Reason-To handle enter key press
                           */
                          />
                          {isDropdownOpen && (
                            <div
                              className={`${styles.filteredProduct} ${SearchProduct?.length === 0
                                ? styles.noScroll
                                : styles.show
                                }`}
                              ref={dropdownRef}
                            >
                              {Array.isArray(SearchProduct) &&
                                SearchProduct.length > 0 ? (
                                <>
                                  <p className={styles.productCount}>
                                    {/* Modification and addition by Om Shrivastava on 21-12-2024
                                  Reason : Fix the count  */}
                                    {/* Products ({productCount}) */}
                                    Products ({SearchProduct.length})
                                    {/* End of modification and addition by Om Shrivastava on 21-12-2024
                                  Reason : Fix the count  */}

                                  </p>
                                  {SearchProduct.slice(0, 3).map((product) => (
                                    <Link
                                      to={`/productdetail/${product.product_id}`}
                                      /**Code added by Unnati on 05-12-2024
                                        *Reason-Send color through state */
                                      state={product.color}
                                      /**End of code addition by Unnati on 05-12-2024
                                      *Reason-Send color through state */
                                      key={product.id}
                                      onClick={() => setIsDropdownOpen(false)}
                                    >
                                      <div className={styles.productContainer}>
                                        {/* Added by jhamman on 11-10-2024
                                      Reason - to show offer percentage*/}
                                        <div
                                          className={`${styles.imageAndOfferLogoContainer}`}
                                        >
                                          {product.sale_percentage ? (
                                            <div
                                              className={styles.offerContainer}
                                            >
                                              <p
                                                className={
                                                  styles.offerPercentage
                                                }
                                              >
                                                -{product.sale_percentage}%
                                              </p>
                                            </div>
                                          ) : null}
                                          {/* End of addition by jhamman on 11-10-2024
                                          Reason - to show offer percentage*/}
                                          <img
                                            src={`${config.baseURL}${product.image1}`}
                                            alt={product.name}
                                            className={styles.imageSearchSize}
                                          />
                                        </div>
                                        <div className={styles.productInfo}>
                                          {/**Code added by Unnati on 18-11-2024
                                           *Reason-Added condition for handling long name */}
                                          <h4 className={styles.searchName}>
                                            {product.name.length > 50
                                              ? `${product.name.substring(
                                                0,
                                                50
                                              )}...`
                                              : product.name}
                                          </h4>
                                          {/**End of code addition by Unnati on 18-11-2024
                                           *Reason-Added condition for handling long name */}
                                          {/* Commented by Om Shrivastava on 01-01-2025
                                           Reason : Remove the description  */}
                                          {/* <p>
                                            {product.description.substring(
                                              0,
                                              100
                                            )}
                                          </p> */}
                                          {/* End of Commented code by Om Shrivastava on 01-01-2025
                                           Reason : Remove the description  */}
                                        </div>
                                        {/* Modified by Jhamman on 11-10-2024
                                        Reason- calculate sale price */}
                                        {/* <div className={styles.productPrice}>
                                          <h4>${product.sales_rate}</h4>
                                        </div> */}
                                        <div className={styles.productPrice}>
                                          {product.sale_percentage ? (
                                            <div className={styles.cardPrice}>
                                              <p
                                                className={
                                                  styles.discountedPriceText
                                                }
                                              >
                                                $
                                                {calculateDiscountFromProduct(
                                                  product.sales_rate,
                                                  product.sale_percentage
                                                )}
                                              </p>
                                            </div>
                                          ) : null}
                                          <div
                                            className={`${styles.cardPrice}`}
                                          >
                                            <p
                                              className={styles.mrpPriceText}
                                              style={
                                                product.sale_percentage
                                                  ? {
                                                    textDecoration:
                                                      "line-through",
                                                    textDecorationColor:
                                                      "#000",
                                                    color: "red",
                                                  }
                                                  : { color: "green" }
                                              }
                                            >
                                              ${product.sales_rate}
                                            </p>
                                          </div>
                                        </div>
                                        {/* End of modification by Jhamman on 11-10-2024
                              Reason- calculate sale price */}
                                      </div>
                                    </Link>
                                  ))}
                                  {SearchProduct.length > 3 && (
                                    <div
                                      className={styles.viewMore}
                                      onClick={() => {
                                        navigate("/searchresults", {
                                          state: {
                                            products: SearchProduct,
                                            query: searchTerm,
                                          },
                                        });
                                        setIsDropdownOpen(false);
                                      }}
                                    >
                                      View More
                                    </div>
                                  )}
                                </>
                              ) : (
                                <p className={styles.noProductFound}>
                                  No products found
                                </p>
                              )}
                            </div>
                          )}
                          {/* Added by - Ashlekh on 21-01-2025
                          Reason - To add cross icon */}
                          {searchTerm && (
                            <button
                              className={`${styles.clearButton}`}
                              onClick={() => {
                                setSearchTerm("");
                                setIsDropdownOpen(false);
                              }}
                            >
                              X
                            </button>
                          )}
                          {/* End of code - Ashlekh on 21-01-2025
                          Reason - To add cross icon */}
                          <button
                            className={styles.searchButton}
                            /**Code added by Unnati on 05-09-2024
                             * Reason-To handle serach
                             */
                            onClick={() => performSearch()}
                          /**End of code addition by Unnati on 05-09-2024
                           * Reason-To handle serach
                           */
                          >
                            <FiSearch />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.col3Logo}
                  style={{
                    display: isSearchActive ? "none" : "block",
                  }}>

                  <Link to="/">
                    {settingInfo?.logo ? (
                      <img
                        className={styles.logo}
                        src={`${config.baseURL}${settingInfo?.logo}`}
                      />
                    ) : (
                      <div className={styles.logo}></div>
                    )}
                  </Link>

                </div>

                <div className={styles.wishlistAndcart} >
                  <div
                    className={styles.searchIconContainerPhoneview}
                    style={{
                      display: isSearchActive ? "none" : "flex",
                      // border: '1px solid black'
                    }}
                  >
                    <MdSearch
                      className={styles.searchIconPhoneView}
                      onClick={handleSearchClick}
                      style={{ height: "20px", width: "20px" }}
                    />
                  </div>



                  <div className={styles.allIconssContainers}
                    style={{
                      display: isSearchActive ? "none" : "flex",
                      // border: '1px solid black'

                    }}>

                    {user.id != undefined && (
                      <div
                        className={`${styles.myOrderContainer}`}
                        onClick={navigateMyOrder}
                      >
                        <IoBagCheckOutline
                          className={`${styles.myOrderIcon}`}
                        />
                        <div
                          className={`${styles.iconNames}`} // Addition the classname by Om Shrivastava on 12-12-2024
                        >My Orders</div>
                      </div>
                    )}

                    {user.id != undefined && (
                      <div
                        className={styles.wishlistContainer}
                        onClick={wishListNavigation}
                      >
                        <MdFavoriteBorder
                          className={styles.wishlistIcon}
                          style={{ height: "20px", width: "20px" }}
                        />
                        <div
                          className={`${styles.iconNames}`} // Addition the classname by Om Shrivastava on 12-12-2024
                        >Wishlist</div>
                      </div>
                    )}

                    <div className={styles.cartcontainer}
                      onMouseEnter={(e) => fetchCartDetails(e)}
  onMouseLeave={(e) => {
    // Only close if mouse leaves both cart and dropdown
    const related = e.relatedTarget;
    if (!related || !e.currentTarget.contains(related)) {
      setIsCartOpen(false);
    }
  }}
                    >
                      <div className={styles.cartContainer}
                      

                      >
                        <Link className={styles.cart}>
                          <GiBasket className={styles.cartImage} />
                          <div className={styles.cartBadge}>{totalItemCount}</div>
                        </Link>

                        <div className={styles.cartText}>
                          <p
                            className={`${styles.iconNames}`} // Addition the classname by Om Shrivastava on 12-12-2024
                          >
                            My Cart:
                          </p>

                          <p className={styles.dollar}>$.{calculateSubtotal()}</p>
                        </div>

                        {isCartOpen && (
                          <div

                            className={`${styles.cartDropdown} ${cartData &&
                              cartData.length > 0 &&
                              cartData.some(
                                (item) => getFilteredSizes(item).length > 0
                              )
                              ? styles.hasItems
                              : styles.empty
                              }`}
                             onMouseEnter={() => setIsCartOpen(true)}   // 👈 keep open while hovering inside
    onMouseLeave={(e) => {
  setTimeout(() => {
    const related = e.relatedTarget;
    // Check if relatedTarget (new hovered element) is inside cartcontainer or dropdown
    if (!related || !e.currentTarget?.parentNode.contains(related)) {
      setIsCartOpen(false);
    }
  }, 150);  // delay to avoid flicker
}}

                          >

                            {cartData &&
                              cartData.length > 0
                              ? (

                                <>
                                  <ul

                                    style={{
                                      maxHeight: cartData.length > 1 ? "500px" : "150px",
                                      overflow: "auto",
                                      scrollBehavior: "smooth",

                                    }}

                                  >

                                    {isLoading == true ? (
                                      <>
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            minHeight: "30vh",
                                          }}
                                        >
                                          <img
                                            style={{ height: "30vh" }}
                                            // Code changed by - Ashlekh on 18-12-2024
                                            // Reason - Loader was not displaying correctly
                                            // src="adyant_loader.gif"
                                            src="/adyant_loader.gif"
                                          // End of code - Ashlekh on 18-12-2024
                                          // Reason - Loader was not displaying correctly
                                          />

                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        {cartData.map((item) => {
                                          return (
                                            <li
                                              /**
                                               * Modified by - Ashish Dewangan on 07-12-2024
                                               * Reason - Gave unique id to each row for proper react rendering 
                                               */
                                              // key={`${item.product}-${item.size}`}
                                              // Code changed by - Ashlekh on 19-02-2025
                                              // Reason - To add customization
                                              // key={`${item.product}-${item.size}-${item.logo}-${item.patches}-${item.security_batches}-${item.embroider}`}
                                              key={`${item.product}-${item.size}-${item.logo}-${item.patches}-${item.security_batches}-${item.security_id_on_back}-${item.printed_id}-${item.embroider}`}
                                              // End of code - Ashlekh on 19-02-2025
                                              // Reason - To add customization
                                              /**
                                             * End of modification by - Ashish Dewangan on 07-12-2024
                                             * Reason - Gave unique id to each row for proper react rendering 
                                             */
                                              className={styles.cartItem}
                                            >
                                              {/* Added by jhamman on 23-10-2024
                                      Reason - to show offer percentage*/}
                                              <div
                                                className={`${styles.imageAndOfferLogoContainer}`}
                                              >
                                                {item.sale_percentage ? (
                                                  <div
                                                    className={styles.offerContainer}
                                                  >
                                                    <p
                                                      className={
                                                        styles.offerPercentage
                                                      }
                                                    >
                                                      -{item.sale_percentage}%
                                                    </p>
                                                  </div>
                                                ) : null}
                                                {/* End of addition by jhamman on 23-10-2024
                                          Reason - to show offer percentage*/}
                                                <div className={styles.productImage}>
                                                  {item && item.image1 ? (
                                                    // Added by - Ashlekh on 16-11-2024
                                                    // Reason - When user clicks on image then to navigate in product detail page
                                                    <Link
                                                      to={
                                                        item.is_active
                                                          ? `/productdetail/${item.product_id
                                                            ? item.product_id
                                                            : ""
                                                          }`
                                                          : "#"
                                                      }
                                                      /**Code added by Unnati on 28-11-2024
                                                       *Reason-Sending color through state */
                                                      state={item.color}
                                                      /**End of code addition by Unnati on 28-11-2024
                                                       *Reason-Sending color through state */
                                                      // Added by - Ashlekh on 24-02-2025
                                                      // Reason - To close suggestion
                                                      onClick={() => setIsCartOpen(false)}
                                                    // End of code - Ashlekh on 24-02-2025
                                                    // Reason - To close suggestion 
                                                    >
                                                      {/* End of code - Ashlekh on 16-11-2024
                                                Reason - When user clicks on image then to navigate in product detail page */}
                                                      <img
                                                        src={`${config.baseURL}${item.image1}`}
                                                        alt={item.name}
                                                        className={
                                                          styles.productImage
                                                        }
                                                      />
                                                    </Link>
                                                  ) : (
                                              /**Code added by Unnati on 20-10-2024
                                               *Reason-To show availability message */ <p>
                                                      Product not available
                                                    </p>
                                                  )}

                                                  {item.is_active ? (
                                                    " "
                                                  ) : (
                                                    <div
                                                      className={
                                                        styles.unavailableMessage
                                                      }
                                                    >
                                                      Not available
                                                    </div>
                                                  )}

                                                  {/**End of code addition by Unnati on 20-10-2024
                                             *Reason-To show availability message */}
                                                </div>
                                              </div>

                                              <div className={styles.productInfo}>
                                                {/* Added by - Ashlekh on 16-11-2024
                                          Reason - When user clicks on name then to navigate in product detail page */}
                                                <Link
                                                  to={
                                                    item.is_active
                                                      ? `/productdetail/${item.product_id
                                                        ? item.product_id
                                                        : ""
                                                      }`
                                                      : "#"
                                                  }
                                                  // Added by - Ashlekh on 24-02-2025
                                                  // Reason - To close cart suggestion
                                                  onClick={() => setIsCartOpen(false)}
                                                // End of code - Ashlekh on 24-02-2025
                                                // Reason - To close cart suggestion
                                                >
                                                  {/* End of code - Ashlekh on 16-11-2024
                                            Reason - When user clicks on name then to navigate in product detail page */}
                                                  {/* Code changed by - Ashlekh on 23-11-2025
                                            Reason - To add class name */}
                                                  {/* <p>{item.name?.substring(0, 60)}</p> */}
                                                  <p className={`${styles.productName}`}>{item.name?.substring(0, 60)}</p>
                                                  {/* End of code - Ashlekh on 23-11-2025
                                            Reason - To add class name */}
                                                  {/* Addition by Om Shrivastava on 21-11-2024
                                            Reason : Add text of customized product  */}
                                                  {item.logo ||
                                                    item.patches ||
                                                    item.security_batches ||
                                                    // Added by - Ashlekh on 19-02-2025
                                                    // Reason - To add customization
                                                    item.security_id_on_back ||
                                                    item.printed_id ||
                                                    // End of code - Ashlekh on 19-02-2025
                                                    // Reason - To add customization
                                                    item.embroider ? (
                                                    <div
                                                      style={{
                                                        color: "#008000",
                                                        fontSize: "10px",
                                                      }}
                                                    >
                                                      Customized product
                                                    </div>
                                                  ) : null}
                                                  {/* End of addition by Om Shrivastava on 21-11-2024
                                            Reason : Add text of customized product  */}
                                                  {/* Added by - Ashlekh on 07-12-2024
                                            Reason - To display customization comment */}
                                                  {item?.customization_comment != "" && (
                                                    <div className={`${styles.customizationCommentContainer}`}>Customization Comment{" "}: {" "}
                                                      {item?.customization_comment && typeof item.customization_comment === 'string'
                                                        ? item.customization_comment.length > 25
                                                          ? `${item.customization_comment.slice(0, 25)}...`
                                                          : item.customization_comment
                                                        : null}
                                                    </div>
                                                  )}
                                                  {/* End of code - Ashlekh on 07-12-2024
                                            Reason - To display customization comment */}
                                                </Link>

                                                <div className={styles.productDetail}>
                                                  <div
                                                    className={styles.sizeAndQuantity}
                                                  >
                                                    {/* <p>SIZE: {size}</p>
                                              <p>QTY: {quantity}</p> */}
                                                    <p>SIZE: {item.size}</p>
                                                    <p>QTY: {item.quantity}</p>
                                                    {/**Code added by Unnati on 01-09-2024
                                               *Reason-Added remove button */}
                                                    <button
                                                      onClick={() =>
                                                        handleDelete(
                                                          item.product,
                                                          item.size,
                                                          item.logo,
                                                          item.patches,
                                                          item.security_batches,
                                                          // Added by - Ashlekh on 19-02-2025
                                                          // Reason - To add customization
                                                          item.security_id_on_back,
                                                          item.printed_id,
                                                          // End of code - Ashlekh on 19-02-2025
                                                          // Reason - To add customization
                                                          item.embroider,
                                                          item.color
                                                        )
                                                      }
                                                    >
                                                      {/**End of code addition by Unnati on 01-09-2024
                                                 *Reason-Added remove button */}
                                                      Remove
                                                    </button>
                                                  </div>

                                                  {/* Comment by Jhamman on 10-10-2024
                                            Reason - Added discounted price*/}
                                                  {/* <div className={styles.price}>
                                              <p>
                                                {CartItem.sales_rate
                                                  ? `$${CartItem.sales_rate}`
                                                  : "Price not available"}
                                              </p>
                                            </div> */}
                                                  {/* End of commentation by Jhamman on 10-10-2024
                                            Reason - Added discounted price*/}

                                                  {/* Addition by Jhamman on 10-10-2024
                                            Reason- calculate sale price */}

                                                  {/* Modified by jhamman on 23-10-2024
                                            Reason - Added diffrent code beacuse we have to show mrp also now */}
                                                  {/* {CartItem.sales_rate ? (
                                          <div className={styles.price}>
                                            {CartItem.sale_percentage ? (
                                              <div>
                                                $
                                                {calculateDiscountFromProduct(
                                                  CartItem.sales_rate,
                                                  CartItem.sale_percentage
                                                )}
                                              </div>
                                            ) : (
                                              <div
                                                className={`${styles.price}`}
                                              >
                                                ${CartItem.sales_rate}
                                              </div>
                                            )}
                                          </div>
                                        ) : (
                                          "Price not available"
                                        )} */}
                                                  <div className={styles.price}>
                                                    {item.sale_percentage ? (
                                                      <div
                                                        className={
                                                          styles.discountedPriceText
                                                        }
                                                      >
                                                        {/* Modification and addition by Om Shrivastava on 21-11-2024
                                                  Reason : Show the customized price  */}
                                                        {item.logo ||
                                                          item.patches ||
                                                          item.security_batches ||
                                                          // Added by - Ashlekh on 19-02-2025
                                                          // Reason - To add customization
                                                          item.security_id_on_back ||
                                                          item.printed_id ||
                                                          // End of code - Ashlekh on 19-02-2025
                                                          // Reason - To add customization
                                                          item.embroider ? (
                                                          <>
                                                            $
                                                            {
                                                              item?.after_customization_product_price
                                                            }
                                                          </>
                                                        ) : (
                                                          <>
                                                            $
                                                            {calculateDiscountFromProduct(
                                                              item.sales_rate,
                                                              item.sale_percentage
                                                            )}
                                                          </>
                                                        )}
                                                        {/* End of modification and addition by Om Shrivastava on 21-11-2024
                                                  Reason : Show the customized price  */}
                                                      </div>
                                                    ) : (
                                                      <div
                                                        className={
                                                          styles.discountedPriceText
                                                        }
                                                      >
                                                        {item.logo ||
                                                          item.patches ||
                                                          item.security_batches ||
                                                          // Added by - Ashlekh on 19-02-2025
                                                          // Reason - To add customization
                                                          item.security_id_on_back ||
                                                          item.printed_id ||
                                                          // End of code - Ashlekh on 19-02-2025
                                                          // Reason - To add customization
                                                          item.embroider ? (
                                                          <>
                                                            $
                                                            {
                                                              item?.after_customization_product_price
                                                            }
                                                          </>
                                                        ) : (
                                                          <>${item.sales_rate}</>
                                                        )}
                                                      </div>
                                                    )}
                                                    {/* End of modification and addition by Om Shrivastava on 21-11-2024
                                                  Reason : Show the customized price  */}
                                                    {/* {CartItem.sale_percentage ? (
                                                <div
                                                  className={
                                                    styles.discountedPriceText
                                                  }
                                                >
                                                  $
                                                  {calculateDiscountFromProduct(
                                                    CartItem.sales_rate,
                                                    CartItem.sale_percentage
                                                  )}
                                                </div>
                                              ) : CartItem.show_patches_and_embroider_on_UI ? (
                                                <div
                                                  className={
                                                    styles.discountedPriceText
                                                  }
                                                >
                                                  $
                                                  {calculateDiscountFromProduct(
                                                    CartItem.sales_rate,
                                                    CartItem.sale_percentage
                                                  )}
                                                </div>
                                              ) : (
                                                <div
                                                  className={styles.priceText}
                                                >
                                                  $
                                                  {
                                                    CartItem.after_customization_product_price
                                                  }
                                                </div>
                                              )} */}

                                                    {/* End of modification by jhamman on 23-10-2024
                                              Reason - Added diffrent code beacuse we have to show mrp also now */}

                                                    {/* /* Added by jhamman on 23-10-2024
                                             Reason - added mrp price*/}
                                                    {item.sale_percentage ? ( // Modification by Om Shrivastava on 21-11-2024, Change the sales_rate to sale_perecentage
                                                      <div
                                                        className={
                                                          styles.mrpPriceText
                                                        }
                                                        style={
                                                          item.sale_percentage
                                                            ? {
                                                              textDecoration:
                                                                "line-through",
                                                              textDecorationColor:
                                                                "#000",
                                                              color: "red",
                                                            }
                                                            : { color: "green" }
                                                        }
                                                      >
                                                        ${item.sales_rate}
                                                      </div>
                                                    ) : null}
                                                  </div>
                                                  {/* End of addition by jhamman on 23-10-2024
                                        Reason - added mrp price*/}
                                                  {/* End of addition by Jhamman on 10-10-2024
                                            Reason- calculate sale price */}
                                                </div>
                                              </div>
                                            </li>
                                          );
                                        })}
                                      </>
                                    )}
                                    {/* End of addition by Om Shrivastava on 03-12-2024
                            Reason : Add the loader  */}
                                  </ul>
                                  {/* <div className={styles.cartTotal}></div> */}
                                  <div className={styles.cartActions}>
                                    <button
                                      className={styles.viewCartButton}
                                      onClick={handleViewCart}
                                    >
                                      View Cart
                                    </button>
                                    {user.id ? (
                                      <Link to="/checkout">
                                        <button
                                          className={styles.checkoutButton}
                                          /**Code added by Unnati on 26-10-2024
                                           *Reason-To add onclick functionality */
                                          onClick={handleCheckoutClick}
                                        /*End of code addition by Unnati on 26-10-2024
                                         *Reason-To add onclick functionality */
                                        >
                                          Checkout
                                        </button>
                                      </Link>
                                    ) : (
                                      // Code changed by - Ashlekh on 25-11-2024
                                      // Reason - For guest user, if clicks on Checkout then first user will navigate in login page, after login user will directly navigate to checkout page
                                      // <Link to="/login">
                                      //   <button className={styles.checkoutButton}>
                                      //     Checkout
                                      //   </button>
                                      // </Link>
                                      <button
                                        className={styles.checkoutButton}
                                        onClick={handleLoginWithCheckout}
                                      >
                                        Checkout
                                      </button>
                                      // End of code - Ashlekh on 25-11-2024
                                      // Reason - For guest user, if clicks on Checkout then first user will navigate in login page, after login user will directly navigate to checkout page
                                    )}
                                  </div>
                                </>
                              ) : (
                                <p className={styles.noItems}>No items in the cart.</p>
                              )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                    <div
                        className={styles.drawer}
                        onClick={() => setMenuOpen(true)}
                      >
                        <GiHamburgerMenu />
                      </div>

      {/* ===== Overlay ===== */}
      {menuOpen && <div className={styles.overlay} onClick={() => setMenuOpen(false)}></div>}

      {/* ===== Drawer Menu ===== */}
      <div className={`${styles.menuDrawer} ${menuOpen ? styles.open : ""}`}>
        <div className={styles.menuHeader}>
          <button onClick={() => setMenuOpen(false)} className={styles.closeBtn}>
            <RxCross2 /> Close
          </button>
        </div>

        {/* ===== Category View ===== */}
        {!selectedCategory && (
          <div className={styles.categoryList}>
            {category.map((cat) => (
              <div
                key={cat.id}
                className={styles.categoryItem}
                onClick={() => setSelectedCategory(cat)}
              >
                <span>{cat.name}</span>
                <IoIosArrowForward />
              </div>
            ))}
          </div>
        )}

        {/* ===== Subcategory View ===== */}
        {selectedCategory && (
          <div className={`${styles.subCategoryView} ${selectedCategory ? styles.slideIn : ""}`}>
            <div className={styles.backHeader}>
              <button onClick={() => setSelectedCategory(null)} className={styles.backBtn}>
                <IoIosArrowBack /> {selectedCategory.name}
              </button>
            </div>

            <div className={styles.subCategoryList}>
              {selectedCategory.children && selectedCategory.children.length > 0 ? (
                selectedCategory.children.map((sub) => (
                  <div key={sub.id} className={styles.subItem}>
                    <span>{sub.name}</span>
                    <IoIosArrowForward />
                  </div>
                ))
              ) : (
                <p className={styles.emptyText}>No subcategories available</p>
              )}
            </div>

            {/* ===== Image & Description Section ===== */}
            <div className={styles.imageSection}>
              <img
                src={`${config.baseURL}${selectedCategory.image}`}
                alt={selectedCategory.name}
              />
              <p className={styles.desc}>
                {selectedCategory.description ||
                  `Explore our exclusive ${selectedCategory.name} collection.`}
              </p>
            </div>
              </div>
            )}
          </div>
                </div>
              </div>
            </div>
          </div>
         

          <div className={styles.headerBottom} >
            <div className={styles.container}>
              <input type="checkbox" id="menu-bar" className={styles.menuBar} />
              <label htmlFor="menu-bar" className={styles.label}>
                <RxHamburgerMenu />
              </label>

              <nav className={styles.navbar}>
                <ul className={styles.navList}>
                  <div ref={sliderRef} className="keen-slider">
                    {category?.map((cat) => (
                      <div key={cat.id} className={styles.categories} 
                      // style={{border:'1px solid black'}}
                      >
                        <div
                          className={styles.categoryTitle}
                          onMouseEnter={() => setHoveredCategory(cat)}
                          onMouseLeave={() => setHoveredCategory(null)}
                          // style={{border:'1px solid red'}}
                        >
                          <span className={styles.Title}>{cat.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ul>
              </nav>
            </div>
          </div>
          {hoveredCategory && (
            <div
              className={`${styles.megaMenu} ${hoveredCategory ? styles.megaMenuShow : ""}`}
              onMouseEnter={() => setHoveredCategory(hoveredCategory)}
              onMouseLeave={() => {
                setHoveredCategory(null);
                setHoveredSubCategory(null);
              }}
            >
              <div className={styles.megaMenuContent}>
                {/* ===== Left Section: Submenus ===== */}
                <div className={styles.leftSection}>
                  <h4>{hoveredCategory.name}</h4>
                  <ul>
                    {hoveredCategory.children && hoveredCategory.children.length > 0 ? (
                      hoveredCategory.children.map((sub) => (
                        <li
                          key={sub.id}
                          onMouseEnter={() => setHoveredSubCategory(sub)}
                          onMouseLeave={() => setHoveredSubCategory(null)}
                        >
                          <Link to="/category/" state={sub.id}>
                            {sub.name}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li>No subcategories available</li>
                    )}
                  </ul>
                </div>

                {/* ===== Middle Section: Image + Short Description ===== */}
                <div className={styles.middleSection}>
                  <div className={styles.imagePreview}>
                    <img
                      src={`${config.baseURL}${hoveredSubCategory?.image || hoveredCategory.image
                        }`}
                      alt={hoveredSubCategory?.name || hoveredCategory.name}
                      className={styles.previewImage}
                    />
                  </div>
                  <div className={styles.descriptionBox}>
                    <p>
                      {hoveredSubCategory
                        ? `Explore our stunning ${hoveredSubCategory.name} collection crafted with premium fabrics and designs.`
                        : `Discover our exclusive ${hoveredCategory.name} collection — elegance and tradition combined.`}
                    </p>
                  </div>
                </div>

                {/* ===== Right Section: About Category ===== */}
                <div className={styles.aboutSection}>
                  <h5>About
                    &nbsp;{hoveredSubCategory?.name || hoveredCategory.name}

                  </h5>
                  <p>
                    {hoveredSubCategory?.description || hoveredCategory.description}

                  </p>
                </div>
              </div>
            </div>
          )}




        </header>
      </div>
    </>
  );
};

export default Header1;
/**End of code addition Unnati on 01-06-2024
 *Reason -To have header
 */
