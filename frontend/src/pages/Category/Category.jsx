/**Code added by Unnati on 20-06-2024
 * Reason-To have category page
 */
import React, { useState, useEffect, useContext } from "react";
import { Button, Modal } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CategoryStyle from "./Category.module.css";
import {
  getFilterOption, getProduct, getCategory, addToWishListAPI, removeProductFromWishListAPI, getProductDetails,
  checkIfProductExistsInCart,
  updateCart,
  addToCart,
} from "../../Api/services";
import config from "../../Api/config";
import { Range, getTrackBackground } from "react-range";
import { FaLongArrowAltDown } from "react-icons/fa";
import { FaLongArrowAltUp } from "react-icons/fa";
import { GlobalContext } from "../../context/Context";
import { calculateDiscountFromProduct } from "../../utils/discountedPrices";
import Rating from "../../components/Rating/Rating";
import notificationObject from "../../components/Widgets/Notification/Notification";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import NavigationPath from "../../components/NavigationPath/NavigationPath";
import { checkIsEmpty } from "../../utils/validations";
import { IoCloseSharp } from "react-icons/io5";
const Category = () => {
  const location = useLocation();
  const id = location.state;
  const {
    selectedColors,
    setSelectedColors,
    selectedBrands,
    setSelectedBrands,
    priceRange,
    setPriceRange,
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    // Added by - Ashlekh on 27-11-2024
    // Reason - To import wishlist & user from context
    user,
    setUser,
    wishListData,
    setWishListData,
    // End of code - Ashlekh on 27-11-2024
    // Reason - To import wishlist & user from context
  } = useContext(GlobalContext);
  /**Code added by Unnati on 10-08-2024
   * Reason-Added location
   */

  const params = new URLSearchParams(location.search);
  const selectedItemType = params.get("item_type");
  /**End of code addition by Unnati on 10-08-2024
   * Reason-Added location
   */
  /**Code added by Unnati on 05-10-2024
   *Reason-Added variables for category
   */
  const [directParentCategory, setdirectParentCategory] = useState([]);
  /**End of code addition by Unnati on 05-10-2024
   *Reason-Added variables for category
   */
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [colors, setColors] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sortOrder, setSortOrder] = useState("default");
  const [sortedProducts, setSortedProducts] = useState([]);
  const uniqueProducts = [];
  const productIdSet = new Set();
  const [viewType, setViewType] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [category, setCategory] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [listPerPage, setListPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollDoc = () => {
    window.scrollTo(0, 0);
  };
  // Added by - Ashlekh on 27-11-2024
  // Reason - useState for wishlist
  const [wishlistStatus, setWishlistStatus] = useState({});
  const navigate = useNavigate();
  // End of code - Ashlekh on 27-11-2024
  // Reason - useState for wishlist
  const [showProductModal, setShowProductModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [availableSizes, setAvailableSizes] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("free_size");
  const [sizeErrorMessage, setSizeErrorMessage] = useState("");
  const [quantityMessage, setQuantityMessage] = useState("");
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [validationMessage, setValidationMessage] = useState("");
  const [sizeError, setSizeError] = useState("");
  const [patchSelection, setPatchSelection] = useState("");
  const [embroiderSelection, setEmbroiderSelection] = useState("");
  const [colorError, setColorError] = useState("");
  const [notAvaible, setNotAvaible] = useState("");
  const {
    refreshCartData,
    setCartData,
  } = useContext(GlobalContext);
  const [formData, setFormData] = useState({
    logo: false,
    patches: false,
    security_batches: false,
    // Added by - Ashlekh on 20-02-2025
    // Reason - To add customization
    security_id_on_back: false,
    printed_id: false,
    // End of code - Ashlekh on 20-02-2025
    // Reason - To add customization
    embroider: false,
    customization_comment: "",
    logo_price: "",
    patches_price: "",
    security_batches_price: "",
    // Added by - Ashlekh on 20-02-2025
    // Reason - To add customization
    security_id_on_back_price: "",
    printed_id_price: "",
    // End of code - Ashlekh on 20-02-2025
    // Reason - To add customization
    embroider_price: "",
    after_customization_product_price: "",
  });
  let currentTimeAndDate = Date.now();
  /**Code added by Unnati on 06-01-2025
         * Reason-Added handle change 
         */
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (type === "checkbox" && checked) {
      setValidationMessage("");
    }
  };
  /**End of code addition by Unnati on 06-01-2025
   * Reason-Added handle change 
   */
  /**Code added by Unnati on 29-12-2024
    * Reason-To select size by default
    */
  useEffect(() => {
    /**Code modified by Unnati on 30-12-2024
     * Reason-Added sizes XS and S
     */
    const firstAvailableSize = ["M", "L", "XL", "XXL", "XXXL", "S", "XS"].find(
      (size) => isSizeAvailable(size)
    );
    /**End of code addition by Unnati on 30-12-2024
     * Reason-Added sizes XS and S
     */
    /**Code added by Unnati on 12-01-2025
   * Reason-Added condition for free size 
   */
    if (selectedProduct?.is_free_size) {
      setSelectedSize("free_size")
    }
    if (!selectedProduct?.is_free_size) {
      setSelectedSize(null)
    }
    /**End of code addition by Unnati on 12-01-2025
     * Reason-Added condition for free size 
     */
    if (firstAvailableSize) {
      setSelectedSize(firstAvailableSize);
    }
  }, [availableSizes]);
  /**End of code addition by Unnati on 29-12-2024
 * Reason-To select size by default
 */
  /**Code added by Unnati on 06-01-2025
   * Reason-Added handle quantity change 
   */
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    const stock = availableSizes[selectedSize];
    if (!selectedSize) {
      setAvailabilityMessage("Please select a size first.");
      setQuantity(1);
      return;
    }
    if (!isNaN(value) && value > 0) {
      if (value <= stock) {
        setQuantity(value);
        setAvailabilityMessage("");
      } else {
        setAvailabilityMessage(`Only ${stock} items left in ${selectedSize}.`);
      }
    } else {
      setQuantity(1);
      setAvailabilityMessage("Quantity cannot be less than 1.");
    }
  };
  /**End of code addition by Unnati on 06-01-2025
      * Reason-Added handle quantity change 
      */
  /**Code added by Unnati on 06-01-2025
  * Reason-Added handle color select 
  */
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const selectedProduct = products.find((product) => product.color === color);
    setSelectedProduct(selectedProduct);
    const sizes = {
      XS: selectedProduct.XS,
      S: selectedProduct.S,
      M: selectedProduct.M,
      L: selectedProduct.L,
      XL: selectedProduct.XL,
      XXL: selectedProduct.XXL,
      XXXL: selectedProduct.XXXL,
    };

    setAvailableSizes(sizes);
    if (selectedSize) {
      const stock = sizes[selectedSize];
      updateAvailabilityMessage(selectedSize, stock);
      QuantityMessage(selectedSize, stock);

    }
    setSelectedSize("");
    setFormData((prev) => ({
      ...prev,
      logo: false,
      patches: false,
      security_batches: false,
      // Added by - Ashlekh on 20-02-2025
      // Reason - To add customization
      security_id_on_back: false,
      printed_id: false,
      // End of code - Ashlekh on 20-02-2025
      // Reason - To add customization
      embroider: false,
      logo_price: "",
      patches_price: "",
      security_batches_price: "",
      // Added by - Ashlekh on 20-02-2025
      // Reason - To add customization
      security_id_on_back_price: "",
      printed_id_price: "",
      // End of code - Ashlekh on 20-02-2025
      // Reason - To add customization
      embroider_price: "",
      after_customization_product_price: "",
      customization_comment: "",
    }));
    setAvailabilityMessage("")
    setQuantityMessage("")
  };
  /**End of code addition Unnati on 06-01-2025
       * Reason-Added handle color select 
       */
  /**Code added by Unnati on 06-01-2025
   * Reason-Added isSizeAvailable
   */
  const isSizeAvailable = (size) => {
    return availableSizes[size] > 0;
  };
  /**End of code addition by Unnati on 06-01-2025
      * Reason-Added isSizeAvailable
      */
  /**Code added by Unnati on 06-01-2025
  * Reason-Added handle select change
  */
  const handleSelectChange = (size) => {
    setSelectedSize(size);
    setQuantityMessage("");
    setQuantity(1);
    const stock = availableSizes[size];
    updateAvailabilityMessage(size, stock);
    setSizeError("");
    // Code changed by - Ashlekh on 08-03-2025
    // Reason - To keep previous data if size is changed
    // setFormData((prev) => ({
    //   ...prev,
    //   logo: false,
    //   patches: false,
    //   security_batches : false,
    //   // Added by - Ashlekh on 20-02-2025
    //   // Reason - To add customization
    //   security_id_on_back: false,
    //   printed_id: false,
    //   // End of code - Ashlekh on 20-02-2025
    //   // Reason - To add customization
    //   embroider : false,
    //   logo_price: "",
    //   patches_price: "",
    //   security_batches_price: "",
    //   // Added by - Ashlekh on 20-02-2025
    //   // Reason - To add customization
    //   security_id_on_back_price: "",
    //   printed_id_price: "",
    //   // End of code - Ashlekh on 20-02-2025
    //   // Reason - To add customization
    //   embroider_price: "",
    //   after_customization_product_price: "",
    //   customization_comment: "",
    // }));
    setFormData((prev) => ({
      ...prev,
    }));
    // End of code - Ashlekh on 08-03-2025
    // Reason - To keep previous data if size is changed
  };
  /**End of code addition by Unnati on 06-01-2025
   * Reason-Added handle select change
   /**Code added by Unnati on 06-01-2025
* Reason-To handle product modal
*/
  const handleProductModal = async (product_id, color) => {
    setShowProductModal(true);
    setSelectedItem(product_id);
    const response = await getProductDetails(product_id, color);
    setProducts(response.products);
    const distintColor = [
      ...new Set(response.products.map((product) => product.color)),
    ];

    if (distintColor.length > 0) {
      setSelectedColor(distintColor[0]);
    }
    if (response.products.length > 0) {
      const sizes = {
        XS: response.products[0].XS,
        S: response.products[0].S,
        M: response.products[0].M,
        L: response.products[0].L,
        XL: response.products[0].XL,
        XXL: response.products[0].XXL,
        XXXL: response.products[0].XXXL,
        free_size: response.products[0].free_size,
      };
      setAvailableSizes(sizes);
      setSelectedProduct(response.products[0]);
    }
    if (selectedProduct?.is_free_size) {
      setSelectedSize("free_size")
      handleSelectChange("free_size")
    }
  };
  /**End of code addition by Unnati on 06-01-2025
     * Reason-To handle product modal
     */
  /** code addition by Unnati on 06-01-2025
 * Reason-To update availability message
 */
  const updateAvailabilityMessage = (size, stock) => {
    if (stock === 0) {
      setAvailabilityMessage(`${size} is not available`);
    } else if (stock < 10) {
      /**Code modified by Unnati on 30-10-2024
       * Reason-Changed the message
       */
      setAvailabilityMessage(`Only a few quantity left in ${size}`);
      /*End of code modification by Unnati on 30-10-2024
       * Reason-Changed the message
       */
    } else {
      setAvailabilityMessage("");
    }
  };
  /** End of code addition by Unnati on 06-01-2025
       * Reason-To update availability message
       */
  /** code addition by Unnati on 06-01-2025
       * Reason-To have unique colors
       */
  const uniqueColors = [...new Set(products.map((product) => product.color))];
  useEffect(() => {
    if (!selectedColor && uniqueColors.length > 0) {
      setSelectedColor(uniqueColors[0]);
    }
  }, [uniqueColors, selectedColor]);
  /**End of code addition by Unnati on 06-01-2025
     * Reason-To have unique colors
     */

  /** code addition by Unnati on 06-01-2025
     * Reason-To close modal
     */
  const closeModal = () => {
    setShowProductModal(false);
    /**Code added by Unnati on 12-01-2025
     * Reason-To clear message
     */
    setNotAvaible("")
    /**End of code addition by Unnati on 12-01-2025
     * Reason-To clear message
     */
  };
  /**End of code addition by Unnati on 06-01-2025
   * Reason-To close modal
   */
  /** code addition by Unnati on 06-01-2025
   * Reason-To handle increment
   */
  const handleIncrement = () => {

    if (!selectedSize && !selectedProduct.is_free_size) {

      setQuantityMessage("Please select a size before adjusting the quantity.");
      return;
    }

    if (selectedProduct.is_free_size) {
      setSelectedSize("free_size")
    }

    setAvailabilityMessage("");
    const stock = availableSizes[selectedSize];
    if (quantity < stock) {
      setQuantity(quantity + 1);
      setQuantityMessage(" ");
    } else {
      setQuantityMessage(`Only ${stock} items available in ${selectedSize}.`);
    }
  };
  /**End of code addition by Unnati on 06-01-2025
   * Reason-To handle increment while entering quantity
   */
  /**Code added by Unnati on 06-01-2025
   * Reason-To handle decrement while entering quantity
   */
  const QuantityMessage = (size, stock) => {
    if (stock === 0) {
      setQuantityMessage(" ");
    } else if (stock < 10) {
      setQuantityMessage(`Only ${stock} left in ${size}`);
    }
  };
  const handleDecrement = () => {
    if (!selectedSize) {
      setQuantityMessage("Please select a size before selecting the quantity.");
      return;
    }
    setAvailabilityMessage("");
    if (quantity > 1) {
      setQuantity(quantity - 1);
      QuantityMessage(selectedSize, availableSizes[selectedSize]);
    }

    else {
      setQuantityMessage("Quantity cannot be less than 1");
    }

  };
  /**End of code addition by Unnati on 06-01-2025
  * Reason-To handle decrement while entering quantity
  */
  /**Code added by Unnati on 06-01-2025
    * Reason-To check is valid on submit
    */
  const isValidOnSubmit = () => {
    if (checkIsEmpty(selectedColor)) {
      setColorError("Please select a color.");
      return false;
    }

    if (!selectedProduct.is_free_size && checkIsEmpty(selectedSize)) {
      setSizeError("Please select a size.");
      return false;
    }

    if (selectedProduct.is_free_size) {
      if (selectedProduct.free_size <= 0) {
        setSizeError("No stock available.");
        return false;
      }
    }

    return true;
  };
  /*End of code addition by Unnati on 06-01-2025
   * Reason-To check is valid on submit
   */
  /**Code added by Unnati on 06-01-2025
  * Reason-To addTocart details
  */
  const addToCartDetails = async (e) => {
    e.preventDefault();

    /**Code commented by Unnati on 12-01-2025
    * Reason-This code is not in use currently
    */
    // if(selectedProduct.is_free_size){
    //   setSelectedSize("free_size")
    // }
    /**End of code commented by Unnati on 12-01-2025
    * Reason-This code is not in use currently
    */
    const {
      logo,
      patches,
      security_batches,
      // Added by - Ashlekh on 20-02-2025
      // Reason - To add customization
      security_id_on_back,
      printed_id,
      // End of code - Ashlekh on 20-02-2025
      // Reason - To add customization
      embroider,
      customization_comment,
    } = formData;
    let basePrice = parseFloat(selectedProduct?.sales_rate) || 0;


    if (selectedProduct.sale_percentage) {
      basePrice = selectedProduct?.sales_rate - ((selectedProduct?.sales_rate * selectedProduct?.sale_percentage) / 100)


    }
    if (logo) {
      basePrice += parseFloat(selectedProduct.logo_price);
    }

    if (patches) {
      basePrice += parseFloat(selectedProduct.patches_price);
    }

    if (security_batches) {
      basePrice += parseFloat(selectedProduct.security_batches_price);
    }
    // Added by - Ashlekh on 20-02-2025
    // Reason - To add customization
    if (security_id_on_back) {
      basePrice += parseFloat(selectedProduct.security_id_on_back_price);
    }
    if (printed_id) {
      basePrice += parseFloat(selectedProduct.printed_id_price);
    }
    // End of code - Ashlekh on 20-02-2025
    // Reason - To add customization

    if (embroider) {
      basePrice += parseFloat(selectedProduct.embroider_price);
    }
    let customizationPrice = basePrice;
    const formattedCustomizationPrice = isNaN(customizationPrice)
      ? "0.00"
      : customizationPrice.toFixed(2);
    /**Code added by Unnati on 12-01-2025
    * Reason-To show message for unable product
    */
    if (selectedSize == null || selectedSize === undefined) {
      setNotAvaible("Product not available");
    }
    /*End of code addition by Unnati on 12-01-2025
     * Reason-To show message for unable product
     */
    if (isValidOnSubmit()) {
      const data = {
        product: selectedProduct.id,
        XS: selectedSize === "XS" ? quantity : null,
        S: selectedSize === "S" ? quantity : null,
        M: selectedSize === "M" ? quantity : null,
        L: selectedSize === "L" ? quantity : null,
        XL: selectedSize === "XL" ? quantity : null,
        XXL: selectedSize === "XXL" ? quantity : null,
        XXXL: selectedSize === "XXXL" ? quantity : null,

        free_size: selectedSize === "free_size" ? quantity : null,

        user: user && user.id ? user.id : null,
        color: selectedProduct.color,


        sales_rate: selectedProduct.sales_rate,


        image1: selectedProduct.image1,
        name: selectedProduct.name,

        created_at: currentTimeAndDate,
        updated_at: currentTimeAndDate,

        xs_patches:
          selectedSize === "XS"
            ? patchSelection === "Yes"
              ? true
              : false
            : false,
        s_patches:
          selectedSize === "S"
            ? patchSelection === "Yes"
              ? true
              : false
            : false,
        m_patches:
          selectedSize === "M"
            ? patchSelection === "Yes"
              ? true
              : false
            : false,
        l_patches:
          selectedSize === "L"
            ? patchSelection === "Yes"
              ? true
              : false
            : false,
        xl_patches:
          selectedSize === "XL"
            ? patchSelection === "Yes"
              ? true
              : false
            : false,
        xxl_patches:
          selectedSize === "XXL"
            ? patchSelection === "Yes"
              ? true
              : false
            : false,
        xxxl_patches:
          selectedSize === "XXXL"
            ? patchSelection === "Yes"
              ? true
              : false
            : false,

        xs_embroider:
          selectedSize === "XS"
            ? embroiderSelection === "Yes"
              ? true
              : false
            : false,
        s_embroider:
          selectedSize === "S"
            ? embroiderSelection === "Yes"
              ? true
              : false
            : false,
        m_embroider:
          selectedSize === "M"
            ? embroiderSelection === "Yes"
              ? true
              : false
            : false,
        l_embroider:
          selectedSize === "L"
            ? embroiderSelection === "Yes"
              ? true
              : false
            : false,
        xl_embroider:
          selectedSize === "XL"
            ? embroiderSelection === "Yes"
              ? true
              : false
            : false,
        xxl_embroider:
          selectedSize === "XXL"
            ? embroiderSelection === "Yes"
              ? true
              : false
            : false,
        xxxl_embroider:
          selectedSize === "XXXL"
            ? embroiderSelection === "Yes"
              ? true
              : false
            : false,


        after_customization_product_price:
          formattedCustomizationPrice,
        customization_comment: formData.customization_comment,
        logo: formData.logo,
        patches: formData.patches,
        security_batches: formData.security_batches,
        // Added by - Ashlekh on 20-02-2025
        // Reason - To add customization
        security_id_on_back: formData.security_id_on_back,
        printed_id: formData.printed_id,
        // End of code - Ashlekh on 20-02-2025
        // Reason - To add customization
        embroider: formData.embroider,
        logo_price: parseFloat(selectedProduct?.logo_price) || "0.00",
        patches_price: parseFloat(selectedProduct?.patches_price) || "0.00",
        security_batches_price: parseFloat(selectedProduct?.security_batches_price) || "0.00",
        // Added by - Ashlekh on 20-02-2025
        // Reason - To add customization
        security_id_on_back_price: parseFloat(selectedProduct?.security_id_on_back_price) || "0.00",
        printed_id_price: parseFloat(selectedProduct?.printed_id_price) || "0.00",
        // End of code - Ashlekh on 20-02-2025
        // Reason - To add customization
        embroider_price: parseFloat(selectedProduct?.embroider_price) || "0.00",
        size: selectedSize,
        quantity: quantity,
        // is_active : selectedProductDetails.is_active,
      };

      setFormData((prevState) => ({
        ...prevState,
        after_customization_product_price:
          formData.after_customization_product_price,
        customization_comment: formData.customization_comment,
        logo: formData.logo,
        patches: formData.patches,
        security_batches: formData.security_batches,
        // Added by - Ashlekh on 20-02-2025
        // Reason - To add customization
        security_id_on_back: formData.security_id_on_back,
        printed_id: formData.printed_id,
        // End of code - Ashlekh on 20-02-2025
        // Reason - To add customization
        embroider: formData.embroider,
        logo_price: formData.logo_price,
        patches_price: formData.patches_price,
        security_batches_price: formData.security_batches_price,
        // Added by - Ashlekh on 20-02-2025
        // Reason - To add customization
        security_id_on_back_price: formData.security_id_on_back_price,
        printed_id_price: formData.printed_id_price,
        // End of code - Ashlekh on 20-02-2025
        // Reason - To add customization
        embroider_price: formData.embroider_price,
      }));


      if (user && user.id) {
        data.user = user.id;
        try {


          const response = await checkIfProductExistsInCart(
            selectedProduct.id,
            user.id,
            data
          );



          if (response.exists === false) {

            if (selectedProduct.is_free_size) {
              setSelectedSize("free_size")
            }

            const addResponse = await addToCart(data);

            localStorage.setItem("cartData", JSON.stringify(addResponse));

            setCartData(addResponse);

            if (addResponse.success) {
              notificationObject.success("Product added to cart successfully");
              navigate("/checkout");
            } else if (addResponse.error) {
              notificationObject.error("Failed to add product to cart");
            }

          } else {

            if (selectedProduct.is_free_size) {
              setSelectedSize("free_size")
            }

            const updateResponse = await updateCart(data);

            localStorage.setItem(
              "cartData",
              JSON.stringify(updateResponse.cartData)
            );

            setCartData(updateResponse.cartData);

            if (updateResponse.success) {
              notificationObject.success("Cart updated successfully");
              navigate("/checkout");
            } else if (updateResponse.error) {
              notificationObject.error("Failed to update cart");
            }
          }

        } catch (error) {
          notificationObject.error("An error occurred while updating the cart");
        }

      } else {

        const productDetail = {
          sale_percentage: selectedProduct.sale_percentage,
          is_active: selectedProduct.is_active,
          product_id: selectedProduct.product_id,
          product: selectedProduct.id,
          XS: selectedSize === "XS" ? quantity : null,
          S: selectedSize === "S" ? quantity : null,
          M: selectedSize === "M" ? quantity : null,
          L: selectedSize === "L" ? quantity : null,
          XL: selectedSize === "XL" ? quantity : null,
          XXL: selectedSize === "XXL" ? quantity : null,
          XXXL: selectedSize === "XXXL" ? quantity : null,

          free_size: selectedSize === "free_size" ? quantity : null,

          user: user && user.id ? user.id : null,
          color: selectedProduct.color,
          sales_rate: selectedProduct.sales_rate,
          image1: selectedProduct.image1,
          name: selectedProduct.name,

          created_at: currentTimeAndDate,
          updated_at: currentTimeAndDate,

          xs_patches:
            selectedSize === "XS"
              ? patchSelection === "Yes"
                ? true
                : false
              : false,
          s_patches:
            selectedSize === "S"
              ? patchSelection === "Yes"
                ? true
                : false
              : false,
          m_patches:
            selectedSize === "M"
              ? patchSelection === "Yes"
                ? true
                : false
              : false,
          l_patches:
            selectedSize === "L"
              ? patchSelection === "Yes"
                ? true
                : false
              : false,
          xl_patches:
            selectedSize === "XL"
              ? patchSelection === "Yes"
                ? true
                : false
              : false,
          xxl_patches:
            selectedSize === "XXL"
              ? patchSelection === "Yes"
                ? true
                : false
              : false,
          xxxl_patches:
            selectedSize === "XXXL"
              ? patchSelection === "Yes"
                ? true
                : false
              : false,

          xs_embroider:
            selectedSize === "XS"
              ? embroiderSelection === "Yes"
                ? true
                : false
              : false,
          s_embroider:
            selectedSize === "S"
              ? embroiderSelection === "Yes"
                ? true
                : false
              : false,
          m_embroider:
            selectedSize === "M"
              ? embroiderSelection === "Yes"
                ? true
                : false
              : false,
          l_embroider:
            selectedSize === "L"
              ? embroiderSelection === "Yes"
                ? true
                : false
              : null,
          xl_embroider:
            selectedSize === "XL"
              ? embroiderSelection === "Yes"
                ? true
                : false
              : false,
          xxl_embroider:
            selectedSize === "XXL"
              ? embroiderSelection === "Yes"
                ? true
                : false
              : false,
          xxxl_embroider:
            selectedSize === "XXXL"
              ? embroiderSelection === "Yes"
                ? true
                : false
              : false,


          after_customization_product_price: formData.after_customization_product_price,
          customization_comment: formData.customization_comment,
          logo: formData.logo,
          patches: formData.patches,
          security_batches: formData.security_batches,
          // Added by - Ashlekh on 20-02-2025
          // Reason - To add customization
          security_id_on_back: formData.security_id_on_back,
          printed_id: formData.printed_id,
          // End of code - Ashlekh on 20-02-2025
          // Reason - To add customization
          embroider: formData.embroider,
          logo_price: formData.logo_price,
          patches_price: formData.patches_price,
          security_batches_price: formData.security_batches_price,
          embroider_price: formData.embroider_price,
          // Added by - Ashlekh on 20-02-2025
          // Reason - To add customization
          security_id_on_back_price: formData.security_id_on_back_price,
          printed_id_price: formData.printed_id_price,
          // End of code - Ashlekh on 20-02-2025
          // Reason - To add customization
          size: selectedSize,
          quantity: quantity,
        };
        const cartData = localStorage.getItem("cartData")
          ? JSON.parse(localStorage.getItem("cartData"))
          : [];


        const updateCartData = (cartData, productDetail) => {
          let doesItemExist = false;
          var updatedCartData = cartData.map((cartItem) => {

            if (
              cartItem.product === productDetail.product &&
              cartItem.size === productDetail.size &&
              cartItem.logo === productDetail.logo &&
              cartItem.patches === productDetail.patches &&
              cartItem.security_batches === productDetail.security_batches &&
              // Added by - Ashlekh on 20-02-2025
              // Reason - To add customization
              cartItem.security_id_on_back === productDetail.security_id_on_back &&
              cartItem.printed_id === productDetail.printed_id &&
              // End of code - Ashlekh on 20-02-2025
              // Reason - To add customization
              cartItem.embroider === productDetail.embroider &&
              cartItem.color === productDetail.color

            ) {
              doesItemExist = true;
              return {
                ...cartItem,
                logo: productDetail.logo,
                patches: productDetail.patches,
                security_batches: productDetail.security_batches,
                // Added by - Ashlekh on 20-02-2025
                // Reason - To add customization
                security_id_on_back: productDetail.security_id_on_back,
                printed_id: productDetail.printed_id,
                // End of code - Ashlekh on 20-02-2025
                // Reason - To add customization
                embroider: productDetail.embroider,
                size: productDetail.size,
                quantity: cartItem.quantity + productDetail.quantity,
                logo_price: productDetail.logo_price,
                patches_price: productDetail.patches_price,
                security_batches_price: productDetail.security_batches_price,
                // Added by - Ashlekh on 20-02-2025
                // Reason - To add customization
                security_id_on_back_price: productDetail.security_id_on_back_price,
                printed_id_price: productDetail.printed_id_price,
                // End of code - Ashlekh on 20-02-2025
                // Reason - To add customization
                embroider_price: productDetail.embroider_price,
                after_customization_product_price: parseFloat(cartItem.after_customization_product_price),
                customization_comment: productDetail.customization_comment,
              };
            }
            return cartItem


          });


          if (!doesItemExist) {
            return [...cartData, productDetail];
          }
          return updatedCartData;
        };

        const updatedCartData = updateCartData(cartData, productDetail);
        localStorage.setItem("cartData", JSON.stringify(updatedCartData));
        setCartData(updatedCartData);
        refreshCartData();
        notificationObject.success("Product added to cart successfully");
      }

      if (!selectedProduct.is_free_size) {
        setSelectedSize("")
      }
      setFormData((prev) => ({
        ...prev,
        logo: false,
        patches: false,
        security_batches: false,
        // Added by - Ashlekh on 20-02-2025
        // Reason - To add customization
        security_id_on_back: false,
        printed_id: false,
        // End of code - Ashlekh on 20-02-2025
        // Reason - To add customization
        embroider: false,
        logo_price: "",
        patches_price: "",
        security_batches_price: "",
        embroider_price: "",
        // Added by - Ashlekh on 20-02-2025
        // Reason - To add customization
        security_id_on_back_price: "",
        printed_id_price: "",
        // End of code - Ashlekh on 20-02-2025
        // Reason - To add customization
        after_customization_product_price: "",
        customization_comment: "",
      }));
      /**Code added by Unnati on 12-01-2025
      * Reason-To clear message and close popup
      */
      setShowProductModal(false)
      setNotAvaible("")
      /**End of code addition by Unnati on 12-01-2025
       * Reason-To clear message and close popup
       */
    }
    setPatchSelection("");
    setEmbroiderSelection("");
    setQuantity(1);
    if (!selectedProduct.is_free_size) {
      setSelectedSize("")
    }
    setAvailabilityMessage("");
    setQuantityMessage("");
    // setShowProductModal(false)
  };
  /**End of code addition on 06-01-2025
   * Reason-To have add to cart
   */
  /**code addition on 06-01-2025
   * Reason-To have handle submit
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    addToCartDetails(e);
  };
  /**End of code addition on 06-01-2025
 * Reason-To have handle submit
 */
  /**code addition on 06-01-2025
 * Reason-To set free size
 */
  useEffect(() => {
    if (selectedItem && selectedProduct?.is_free_size) {
      setSelectedSize("free_size");
      handleSelectChange("free_size");
    }
  }, [selectedProduct?.is_free_size, selectedItem]);
  /**End of code addition on 06-01-2025
* Reason-To set free size
*/
  /**Code added by Unnati on 27-06-2024
   * Reason -To handle list per page change
   */

  /**End of code addition by Unnati on 27-06-2024
   * Reason -To handle list per page change
   */

  /**Code commented by Unnati on 23-06-2024
   * Reason-Since loader is not working currently
   */
  // const [isLoader, setIsLoader] = useState(true);
  // const [page, setPage] = useState(1);
  // const [hasMore, setHasMore] = useState(true);
  // const observer = useRef();
  /**End of code comment by Unnati on 23-06-2024
   * Reason-Since loader is not working currently
   */

  /* Added by jhamman on 30-10-2024
  Reason - added function for model*/
  const showModal = () => {
    setIsModalOpen(true);
  };

  /* End of addition by jhamman on 30-10-2024
  Reason - added function for model*/

  /**Code added by Unnati on 23-06-2024
   * Reason-To have unique products(It will not again add the same product)
   */
  if (Array.isArray(sortedProducts)) {
    sortedProducts.forEach((product) => {
      if (!productIdSet.has(product.product_id)) {
        productIdSet.add(product.product_id);
        uniqueProducts.push(product);
      }
    });
  }
  /**End of code addition by Unnati on 23-06-2024
   * Reason-To have unique products(It will not again add the same product)
   */

  /**Code added by Unnati on 21-06-2024
   * Reason-To handle slider change in price range
   */
  const handleRangeChange = (values) => {
    setPriceRange(values);
  };

  /**End of code addition by Unnati on 21-06-2024
   * Reason-To handle slider change in price range
   */

  /**Code modified by Unnati on 05-10-2024
   * Reason-To handle color change
   */
  const handleColorChange = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors((prevColors) =>
        prevColors.filter((selectedColor) => selectedColor !== color)
      );
    } else {
      setSelectedColors((prevColors) => [...prevColors, color]);
    }
  };

  /**End of code modification by Unnati on 05-10-2024
   * Reason-To handle color change
   */
  /**Code commented by Unnati on 25-07-2024
   * Reason-To handle brand change
   */
  // const handleBrandChange = (event) => {
  //   const { value, checked } = event.target;
  //   if (checked) {
  //     setSelectedBrands((prevBrands) => [...prevBrands, value]);
  //   } else {
  //     setSelectedBrands((prevBrands) =>
  //       prevBrands.filter((brand) => brand !== value)
  //     );
  //   }
  // };
  /**End of code comment by Unnati on 25-07-2024
   * Reason-To handle brand change
   */
  /**Code added by Unnati on 21-06-2024
   * Reason-To handle apply filter button
   */

  const handleClearFilters = () => {
    setSelectedColors([]);
    setSelectedBrands([]);
    setPriceRange([minPrice, maxPrice]);
    setIsModalOpen(false);
  };

  /**End of code addition by Unnati on 21-06-2024
   * Reason-To handle apply filter button
   */

  /**Code added by Unnati on 21-06-2024
   * Reason-To handle dropdown for applying sort change
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
  /**End of code addition by Unnati on 21-06-2024
   * Reason-To handle dropdown for applying sort change
   */

  /**Code added by Unnati on 21-06-2024
   * Reason-To get default filter option as the page loads
   */
  useEffect(() => {
    const fetchFilterOption = async () => {
      try {
        const response = await getFilterOption(id);
        const filteredColors = response.response.distinct_colors.filter(
          (color) => color !== null
        );
        setColors(filteredColors);
        /**Code added by Unnati on 25-07-2024
         * Reason-To set brands
         */
        setBrands(response.response.distinct_brands);

        /**End of code addition by Unnati on 25-07-2024
         * Reason-To set brands
         */
        /**Code added by Unnati on 22-01-2025
         * Reason-Assign value to the variable
         */
        let maxPriceValue = response.response.max_price;
        if (maxPriceValue == null) {
          maxPriceValue = 0;
        }
        /**End of code addition by Unnati on 22-01-2025
         * Reason-Assign value to the variable
         */
        /**Code modified by Unnati on 22-01-2025
         * Reason-Modified variable name
         */
        // if (response.response.min_price >= response.response.max_price) {
        if (response.response.min_price >= maxPriceValue) {
          //Commented by jhamman on 16-10-2024
          // Reason - want to use default minPrice that is 0
          // setMinPrice(response.response.min_price - 1);
          // End of commentation by jhamman on 16-10-2024
          // Reason - want to use default minPrice that is 0
          // setMaxPrice(response.response.max_price + 1);
          setMaxPrice(maxPriceValue + 1)
          /**End of code modification by Unnati on 22-01-2025
         * Reason-Modified variable name
         */
        } else {
          //Commented by jhamman on 16-10-2024
          // Reason - want to use default minPrice that is 0
          // setMinPrice(response.response.min_price);
          // End of commentation by jhamman on 16-10-2024
          // Reason - want to use default minPrice that is 0
          /**Code modified by Unnati on 22-01-2025
         * Reason-Modified variable name
         */
          // setMaxPrice(response.response.max_price);
          setMaxPrice(maxPriceValue)
          /**End of code modification by Unnati on 22-01-2025
         * Reason-Modified variable name
         */
        }
        setPriceRange([
          //Commented by jhamman on 16-10-2024
          // Reason - want to use default minPrice that is 0
          // (priceRange[0], response.response.min_price),
          (priceRange[0], minPrice),
          // End of commentation by jhamman on 16-10-2024
          // Reason - want to use default minPrice that is 0
          /**Code modified by Unnati on 22-01-2025
         * Reason-Modified variable name
         */
          // (priceRange[1], response.response.max_price),
          (priceRange[1], maxPriceValue),
          /**End of code modification by Unnati on 22-01-2025
         * Reason-Modified variable name
         */
        ]);
        /**Code added by Unnati on 05-10-2024
         * Reason-To set Response in directParentCategory
         */
        // Code changed by - Ashlekh on 22-01-2025
        // Reason - To set parent & sub category from response
        // setdirectParentCategory(response.response.direct_parent_categories);
        setdirectParentCategory(response.response.filtered_categories);
        // End of code - Ashlekh on 22-01-2025
        // Reason - To set parent & sub category from response
        /**End of code addition by Unnati on 05-10-2024
         * Reason-To set Response in directParentCategory
         */
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchFilterOption();
  }, [setMaxPrice, setMinPrice, setPriceRange, id]);

  /**End of code addition by Unnati on 21-06-2024
   * Reason-To get default filter option as the page loads
   */

  /**Code added by Unnati on 21-06-2024
   * Reason-To get filtered products as the page loads
   */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let data;
        // if (filtersApplied) {
        data = await getProduct(
          id,
          selectedColors,
          /**Code added by Unnati on 25-07-2024
           * Reason-To add selected brands
           */
          selectedBrands,
          /**End of code addition by Unnati on 25-07-2024
           * Reason-To add selected brands
           */
          priceRange[0],
          priceRange[1],
          sortBy,
          sortOrder,
          currentPage,
          listPerPage,
          /**Code added by Unnati on 10-08-2024
           * Reason-Added selected Item type
           */
          selectedItemType
          /**End of code addition by Unnati on 10-08-2024
           * Reason-Added selected Item type
           */
        );
        setSortedProducts(data.product);
        setTotalProducts(data.total);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchProduct();
  }, [
    id,
    selectedColors,
    /**Code added by Unnati on 25-07-2024
     * Reason-To add selected brands
     */
    selectedBrands,
    /**End of code addition by Unnati on 25-07-2024
     * Reason-To add selected brands
     */
    priceRange,
    filtersApplied,
    sortBy,
    sortOrder,
    currentPage,
    listPerPage,
    /**Code added by Unnati on 10-08-2024
     * Reason-Added selected Item type
     */
    selectedItemType,
    /**End of code addition by Unnati on 10-08-2024
     * Reason-Added selected Item type
     */
  ]);

  /*End of code addition by Unnati on 21-06-2024
   * Reason-To get filtered products as the page loads
   */

  /**Code added by Unnati on 21-06-2024
   * Reason-To check the sort order and apply sorting
   */
  useEffect(() => {
    let sort_by = "default";
    let sort_order = "asc";

    if (sortOrder === "lowToHigh") {
      sort_by = "sales_rate";
      sort_order = "asc";
    } else if (sortOrder === "highToLow") {
      sort_by = "sales_rate";
      sort_order = "desc";
    }
  }, [sortOrder]);
  /**End of code addition by Unnati on 21-06-2024
   * Reason-To check the sort order and apply sorting
   */

  /**Code added by Unnati on 21-06-2024
   * Reason-To fetch categories for breadcrumbs
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategory();
        setCategory(data.categoryList);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchCategories();
  }, []);
  /**End of code addition by Unnati on 21-06-2024
   * Reason-To fetch categories for breadcrumbs
   */

  /**Code added by Unnati on 25-06-2024
   * Reason-To create path navigation
   */

  const findInChildren = (categoryId, children) => {
    for (const child of children) {
      if (child.id === parseInt(categoryId)) {
        return child;
      }
      if (child.children && child.children.length > 0) {
        const foundChild = findInChildren(categoryId, child.children);
        if (foundChild) return foundChild;
      }
    }
    return null;
  };

  const getCategoryPath = (categoryId, categories) => {
    let category = categories.find((cat) => cat.id === parseInt(categoryId));

    if (!category) {
      for (const cat of categories) {
        category = findInChildren(categoryId, cat.children);
        if (category) break;
      }
    }

    if (category && category.parent_id) {
      const parentCategory = findParentCategory(category.parent_id, categories);
      if (parentCategory) {
        const parentPath = getCategoryPath(parentCategory.id, categories);
        return [...parentPath, { id: category.id, name: category.name }];
      }
    }

    return category ? [{ id: category.id, name: category.name }] : [];
  };

  const findParentCategory = (parentId, categories) => {
    let parentCategory = categories.find((cat) => cat.id === parentId);

    if (!parentCategory) {
      for (const cat of categories) {
        parentCategory = findInChildren(parentId, cat.children);
        if (parentCategory) break;
      }
    }

    return parentCategory;
  };
  const createBreadcrumbs = (categoryId, categories) => {
    const path = getCategoryPath(categoryId, categories);

    const breadcrumbPath = path.map((category, index) => (
      <span key={category.id}>
        <Link
          to={`/category/${category.id}`}
          className={CategoryStyle.categoryHeading}>
          {category.name}
        </Link>
        {index < path.length - 1 && " > "}
      </span>
    ));
    const selectedCategory = path.length > 0 ? path[path.length - 1].name : "";

    return { breadcrumbPath, selectedCategory };
  };

  useEffect(() => {
    if (category.length > 0) {
      const { breadcrumbPath, selectedCategory } = createBreadcrumbs(
        id,
        category
      );

      setBreadcrumbs(breadcrumbPath);
      setSelectedCategory(selectedCategory);
    }
    // Added by - Ashlekh on 06-12-2024
    // Reason - When one color filter is applied in a category and user clicks on another category then filter was not clearing
    handleClearFilters();
    // End of code - Ashlekh on 06-12-2024
    // Reason - When one color filter is applied in a category and user clicks on another category then filter was not clearing
  }, [id, category]);

  /**End of code addition by Unnati on 25-06-2024
   * Reason-To create path navigation
   */
  const handleListsPerPageChange = (event) => {
    setListPerPage(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  /**
   * Added by - Ashlekh on 27-11-2024
   * Reason - To add/remove products in wishlist
   */
  useEffect(() => {
    const newWishlistStatus = {};
    wishListData?.forEach((item) => {
      const key = `${item.product_id}-${item.color}`;
      newWishlistStatus[key] = true;
    });
    setWishlistStatus(newWishlistStatus);
  }, [wishListData]);
  const handleToggleWishList = async (user, product) => {

    if (user.id == null || user.id == undefined) {
      navigate("/login");
      return;
    } else {
      const productKey = `${product.product_id}-${product.color}`;
      try {
        if (wishlistStatus[productKey]) {
          const response = await removeProductFromWishListAPI(
            user.id,
            product?.product_id,
            product?.color
          );
          localStorage.setItem(
            "wishListData",
            JSON.stringify(response.wishlist)
          );
          setWishListData(response.wishlist);
          if (response?.message) {
            setWishlistStatus((prev) => ({
              ...prev,
              [productKey]: false,
            }));
            notificationObject.success(
              "Product successfully removed from wishlist"
            );
          }
        } else {
          const response = await addToWishListAPI(
            user.id,
            product?.product_id,
            product?.color
          );
          localStorage.setItem(
            "wishListData",
            JSON.stringify(response?.wishlist_data)
          );
          setWishListData(response?.wishlist_data);
          if (response?.message == "Success") {
            setWishlistStatus((prev) => ({
              ...prev,
              [productKey]: true,
            }));
            notificationObject.success(
              "Product successfully added to wishlist"
            );
          } else if (response?.message == "Product Already in Wishlist") {
            notificationObject.success("Product is already in your wishlist");
          } else {
            notificationObject.error("Failed to add product to wishlist");
          }
        }
      } catch (error) {
        console.error("Error updating wishlist:", error);
      }
    }
  };
  /**
   * End of code - Ashlekh on 27-11-2024
   * Reason - To add/remove products in wishlist
   */
  // Added by - Ashlekh on 09-12-2024
  // Reason - To display navigation path
  const { navigationPath, setNavigationPath } = useContext(GlobalContext);
  useEffect(() => {
    setNavigationPath([
      { name: "Home", path: "/" },
      { name: "Category", path: "/category" },
    ]);
    window.scrollTo(0, 0);
  }, [setNavigationPath]);
  // End of code - Ashlekh on 09-12-2024
  // Reason - To display navigation path
  // Added by - Ashlekh on 22-01-2025
  // Reason - To convert array of object into array of key value (id, name)
  const filteredCategory = Object.fromEntries(
    directParentCategory.map((cat) => [cat.id, cat.name])
  );
  // End of code - Ashlekh on 22-01-2025
  // Reason - To convert array of object into array of key value (id, name)
  return (
    /**Code added by Unnati on 20-06-2024
     * Reason-To have filter options
     */

    <div className={`${CategoryStyle.pageFrame}`}>
      <div className={`${CategoryStyle.coloredBackground}`}>
        <div className={`${CategoryStyle.breadCrumbs}`}>{breadcrumbs}</div>
        <div className={`${CategoryStyle.pageContainer}`}>
          {/* Added by - Ashlekh on 09-12-2024
          Reason - To display navigation path */}
          <NavigationPath navigationPathArray={navigationPath} />
          {/* End of code - Ashlekh on 09-12-2024
          Reason - To display navigation path */}
          <div className={`${CategoryStyle.container}`}>
            {/**Code added by Unnati on 04-09-2024
             *Reason-To show no rpoduct found  */}
            {uniqueProducts.length === 0 ? (
              /* Code added by Unnati on 03-09-2024
               *Reason- To show no products available in the category message */
              /* Code added by Unnati on 22-01-2025
              *Reason- To show filter options*/
              <>
                <div className={`${CategoryStyle.filterContainer}`}>
                  <h2>SHOP BY</h2>
                  <div className={`${CategoryStyle.mainContent}`}>
                    {/* Filters */}
                    <div className={CategoryStyle.filterContent}>
                      <div className={CategoryStyle.filterGroup}>
                        <div className={CategoryStyle.subtitle}>
                          <h3>Price Range</h3>
                        </div>

                        <div className={CategoryStyle.sliderContainer}>
                          <div className={CategoryStyle.priceLabels}>
                            <div className={CategoryStyle.priceLabelsMinimum}>
                              <span>{`$${priceRange[0]}`}</span>
                            </div>
                            <div className={CategoryStyle.priceLabelsMaximum}>
                              <span>{`$${priceRange[1]}`}</span>
                            </div>
                          </div>
                          <Range
                            values={priceRange}
                            /* Modified by jhamman on 12-10-2024
                            Reason - decrese the range so slider can move properly*/
                            // step={50}
                            step={1}
                            /* End of modification by jhamman on 12-10-2024
                            Reason - decrese the range so slider can move properly*/
                            min={minPrice}
                            max={maxPrice}
                            onChange={handleRangeChange}
                            renderTrack={({ props, children }) => (
                              <div
                                onMouseDown={props.onMouseDown}
                                onTouchStart={props.onTouchStart}
                                className={CategoryStyle.rangeTrackContainer}>
                                <div
                                  ref={props.ref}
                                  style={{
                                    height: "5px",
                                    width: "100%",
                                    borderRadius: "4px",
                                    background: getTrackBackground({
                                      values: priceRange,
                                      /**Code modified by Unnati on 13-10-2024
                                       *Reason-Changed button color
                                       */
                                      colors: [
                                        "#ccc",
                                        "var(--button-color)",
                                        "#ccc",
                                      ],
                                      /**End of code modification by Unnati on 13-10-2024
                                       *Reason-Changed button color
                                       */
                                      min: minPrice,
                                      max: maxPrice,
                                    }),
                                    alignSelf: "center",
                                  }}>
                                  {children}
                                </div>
                              </div>
                            )}
                            renderThumb={({ props, isDragged, key }) => (
                              <div
                                /**Code added by Unnati on 26-10-2024
                                 *Reason-Added key */
                                key={key}
                                /**End of code addition by Unnati on 26-10-2024
                                 *Reason-Added key */
                                {...props}
                                className={`${CategoryStyle.rangeThumb}${isDragged ? " dragged" : ""
                                  }`}>
                                <div
                                  className={CategoryStyle.rangeThumbInner}
                                />
                              </div>
                            )}
                          />
                        </div>
                      </div>
                      <div className={CategoryStyle.filterGroup}>
                        <h3>Color</h3>
                        <div className={CategoryStyle.colorGrid}>
                          {/**Code modified by Unnati on 05-10-2024
                           *Reason-To show color instead of color name*/}
                          {colors.map((color, index) => (
                            <div
                              key={index}
                              className={CategoryStyle.colorBox}
                              style={{
                                backgroundColor: color,
                                border: selectedColors.includes(color)
                                  ? "2px solid #000"
                                  : "1px solid #ccc",
                              }}
                              onClick={() => handleColorChange(color)}
                            />
                            /**End of code modification by Unnati on 05-10-2024
                             *Reason-To show color instead of color name*/
                          ))}
                        </div>
                      </div>
                      {/**Code commented by Unnati on 06-10-2024
                       *Reason-To remove brand */}
                      {/* <div className={CategoryStyle.filterGroup}>
                        <h3>Brands</h3>
                        <div className={CategoryStyle.colorGrid}>
                          {brands.map((brand, index) => (
                            <label
                              key={index}
                              className={CategoryStyle.colorLabel}
                            >
                              <input
                                type="checkbox"
                                value={brand}
                                onChange={handleBrandChange}
                                checked={selectedBrands.includes(brand)}
                              />
                              {brand}
                            </label>
                          ))}
                        </div>
                      </div> */}
                      {/**End of code comment by Unnati on 06-10-2024
                       *Reason-To remove brand */}
                      <button
                        className={CategoryStyle.button}
                        onClick={handleClearFilters}>
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
                {/*End of code addition by Unnati on 22-01-2025
               *Reason- To show filter options*/}
                <div className={CategoryStyle.noProductsFound}>
                  <h4>No products found in this category</h4>
                </div>

                {/* /**End of code addition by Unnati on 04-09-2024
               *Reason-To show no rpoduct found  */}
                {/**End of code addition by Unnati on 03-09-2024
               *Reason- To show no products available in the category message */}


              </>
            ) : (
              <>
                <div className={`${CategoryStyle.filterContainer}`}>
                  <h2>SHOP BY</h2>
                  <div className={`${CategoryStyle.mainContent}`}>
                    {/* Filters */}
                    <div className={CategoryStyle.filterContent}>
                      <div className={CategoryStyle.filterGroup}>
                        <div className={CategoryStyle.subtitle}>
                          <h3>Price Range</h3>
                        </div>

                        <div className={CategoryStyle.sliderContainer}>
                          <div className={CategoryStyle.priceLabels}>
                            <div className={CategoryStyle.priceLabelsMinimum}>
                              <span>{`$${priceRange[0]}`}</span>
                            </div>
                            <div className={CategoryStyle.priceLabelsMaximum}>
                              <span>{`$${priceRange[1]}`}</span>
                            </div>
                          </div>
                          <Range
                            values={priceRange}
                            /* Modified by jhamman on 12-10-2024
                            Reason - decrese the range so slider can move properly*/
                            // step={50}
                            step={1}
                            /* End of modification by jhamman on 12-10-2024
                            Reason - decrese the range so slider can move properly*/
                            min={minPrice}
                            max={maxPrice}
                            onChange={handleRangeChange}
                            renderTrack={({ props, children }) => (
                              <div
                                onMouseDown={props.onMouseDown}
                                onTouchStart={props.onTouchStart}
                                className={CategoryStyle.rangeTrackContainer}>
                                <div
                                  ref={props.ref}
                                  style={{
                                    height: "5px",
                                    width: "100%",
                                    borderRadius: "4px",
                                    background: getTrackBackground({
                                      values: priceRange,
                                      /**Code modified by Unnati on 13-10-2024
                                       *Reason-Changed button color
                                       */
                                      colors: [
                                        "#ccc",
                                        "var(--button-color)",
                                        "#ccc",
                                      ],
                                      /**End of code modification by Unnati on 13-10-2024
                                       *Reason-Changed button color
                                       */
                                      min: minPrice,
                                      max: maxPrice,
                                    }),
                                    alignSelf: "center",
                                  }}>
                                  {children}
                                </div>
                              </div>
                            )}
                            renderThumb={({ props, isDragged, key }) => (
                              <div
                                /**Code added by Unnati on 26-10-2024
                                 *Reason-Added key */
                                key={key}
                                /**End of code addition by Unnati on 26-10-2024
                                 *Reason-Added key */
                                {...props}
                                className={`${CategoryStyle.rangeThumb}${isDragged ? " dragged" : ""
                                  }`}>
                                <div
                                  className={CategoryStyle.rangeThumbInner}
                                />
                              </div>
                            )}
                          />
                        </div>
                      </div>
                      <div className={CategoryStyle.filterGroup}>
                        <h3>Color</h3>
                        <div className={CategoryStyle.colorGrid}>
                          {/**Code modified by Unnati on 05-10-2024
                           *Reason-To show color instead of color name*/}
                          {colors.map((color, index) => (
                            <div
                              key={index}
                              className={CategoryStyle.colorBox}
                              style={{
                                backgroundColor: color,
                                border: selectedColors.includes(color)
                                  ? "2px solid #000"
                                  : "1px solid #ccc",
                              }}
                              onClick={() => handleColorChange(color)}
                            />
                            /**End of code modification by Unnati on 05-10-2024
                             *Reason-To show color instead of color name*/
                          ))}
                        </div>
                      </div>
                      {/**Code commented by Unnati on 06-10-2024
                       *Reason-To remove brand */}
                      {/* <div className={CategoryStyle.filterGroup}>
                        <h3>Brands</h3>
                        <div className={CategoryStyle.colorGrid}>
                          {brands.map((brand, index) => (
                            <label
                              key={index}
                              className={CategoryStyle.colorLabel}
                            >
                              <input
                                type="checkbox"
                                value={brand}
                                onChange={handleBrandChange}
                                checked={selectedBrands.includes(brand)}
                              />
                              {brand}
                            </label>
                          ))}
                        </div>
                      </div> */}
                      {/**End of code comment by Unnati on 06-10-2024
                       *Reason-To remove brand */}
                      <button
                        className={CategoryStyle.button}
                        onClick={handleClearFilters}>
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  className={CategoryStyle.productContainer}
                  style={{ width: "100%" }}>
                  <h2 className={CategoryStyle.categoryMainHeading}>
                    {selectedCategory}
                  </h2>
                  {/**Code added by Unnati on 05-10-2024
                   *Reason-To show subcategories in catgeory page */}
                  <div className={CategoryStyle.subCategories}>
                    {directParentCategory?.map((cat) => (
                      <div
                        key={cat.id}
                        className={`${CategoryStyle.categories}`}>
                        <Link
                          to={`/category/`}
                          state={cat.id}
                          className={CategoryStyle.categoryLink}>
                          <div className={`${CategoryStyle.category}`}>
                            <div className={`${CategoryStyle.ImageContainer}`}>
                              <img
                                src={`${config.baseURL}${cat.image}`}
                                alt={cat.name}
                                className={`${CategoryStyle.categoryImage}`}
                              />
                            </div> 
                            <div className={`${CategoryStyle.categoryTitle}`}>
                              {/* Code changed by - Ashlekh on 22-01-2025
                              Reason - To display category and sub category name */}
                              {/* <span>{cat.name}</span> */}
                              {/* <span>
                                {cat.parent_id != null
                                  ? `${filteredCategory[cat.parent_id] || ''} (${cat.name})`
                                  : cat.name}
                              </span> */}
                              <span>
                                {cat.parent_id != null && filteredCategory[cat.parent_id]
                                  ? `${filteredCategory[cat.parent_id]} (${cat.name})`
                                  : cat.name}
                              </span>
                              {/* End of code - Ashlekh on 22-01-2025
                              Reason - To display category and sub category name */}
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                  {/**End of code addition by Unnati on 05-10-2024
                   *Reason- To show subcategories in catgeory page*/}
                  <div className={CategoryStyle.pageTitle}>
                    {/**Code added by Unnati on 03-10-2024
                     *Reason-Modified heading */}

                    {/**End of code addition by Unnati on 03-10-2024
                     *Reason-Modified heading */}
                  </div>
                  {/* <div className={CategoryStyle.categoryImage}>
                    <img
                      src="/sale_banner3.jpeg"
                      alt="E-commerce Banner"
                      className={`${CategoryStyle.bannerImage}`}
                    />
                  </div> */}
                  {/* <div className={CategoryStyle.viewToggleButtons}>
                    <div className={CategoryStyle.viewButtons}>
                      <div
                        className={`${CategoryStyle.square} ${
                          viewType === "grid" ? CategoryStyle.active : ""
                        }`}
                      >
                        <p onClick={() => setViewType("grid")}> */}
                  {/* <BsGrid3X2 /> */}
                  {/* </p>
                      </div> */}
                  {/* <div
                    className={`${CategoryStyle.square} ${
                      viewType === "list" ? CategoryStyle.active : ""
                    }`}
                   >
                    <p
                      className={`${CategoryStyle.squareIcon}`}
                      onClick={() => setViewType("list")}
                    >
                      <FaList />
                    </p>
                    </div> */}
                  {/* </div>
                    <div className={CategoryStyle.showProduct}>
                      <label className={CategoryStyle.labelViews}>Show </label>
                      <select
                        className={`${CategoryStyle.dropdownpage} `}
                        value={listPerPage}
                        onChange={handleListsPerPageChange}
                      >
                        <option value={5}>5</option>
                        <option value={8}>8</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>

                      <label> per page</label>
                    </div>
                    
                    </div> */}
                  {/* Added by jhamman on 30-10-2024
                Reason - open a model to add filter when screen size is 720px*/}
                  <div className={CategoryStyle.filterAndShortRow}>
                    <div className={CategoryStyle.filterButton}>
                      <Button type="primary" onClick={showModal}>
                        Create Filter
                      </Button>
                    </div>
                    <Modal
                      open={isModalOpen}
                      footer={null}
                      // Added by - Ashlekh on 12-02-2025
                      // Reason - To close popup when user clicks on cross icon
                      onCancel={() => setIsModalOpen(false)}
                      // End of code - Ashlekh on 12-02-2025
                      // Reason - To close popup when user clicks on cross icon
                      className={CategoryStyle.filterModel}>
                      <div className={`${CategoryStyle.popupFilterContainer}`}>
                        <h2>SHOP BY</h2>
                        <div className={`${CategoryStyle.mainContent}`}>
                          <div className={CategoryStyle.filterContent}>
                            <div className={CategoryStyle.filterGroup}>
                              <div className={CategoryStyle.subtitle}>
                                <h3>Price Range</h3>
                              </div>

                              <div className={CategoryStyle.sliderContainer}>
                                <div className={CategoryStyle.priceLabels}>
                                  <div
                                    className={
                                      CategoryStyle.priceLabelsMinimum
                                    }>
                                    <span>{`$${priceRange[0]}`}</span>
                                  </div>
                                  <div
                                    className={
                                      CategoryStyle.priceLabelsMaximum
                                    }>
                                    <span>{`$${priceRange[1]}`}</span>
                                  </div>
                                </div>
                                <Range
                                  values={priceRange}
                                  step={1}
                                  min={minPrice}
                                  max={maxPrice}
                                  onChange={handleRangeChange}
                                  renderTrack={({ props, children }) => (
                                    <div
                                      onMouseDown={props.onMouseDown}
                                      onTouchStart={props.onTouchStart}
                                      className={
                                        CategoryStyle.rangeTrackContainer
                                      }>
                                      <div
                                        ref={props.ref}
                                        style={{
                                          height: "5px",
                                          width: "100%",
                                          borderRadius: "4px",
                                          background: getTrackBackground({
                                            values: priceRange,

                                            colors: [
                                              "#ccc",
                                              "var(--button-color)",
                                              "#ccc",
                                            ],

                                            min: minPrice,
                                            max: maxPrice,
                                          }),
                                          alignSelf: "center",
                                        }}>
                                        {children}
                                      </div>
                                    </div>
                                  )}
                                  renderThumb={({ props, isDragged, key }) => (
                                    <div
                                      key={key}
                                      {...props}
                                      className={`${CategoryStyle.rangeThumb}${isDragged ? " dragged" : ""
                                        }`}>
                                      <div
                                        className={
                                          CategoryStyle.rangeThumbInner
                                        }
                                      />
                                    </div>
                                  )}
                                />
                              </div>
                            </div>
                            <div className={CategoryStyle.filterGroup}>
                              <h3>Color</h3>
                              <div className={CategoryStyle.colorGrid}>
                                {colors.map((color, index) => (
                                  <div
                                    key={index}
                                    className={CategoryStyle.colorBox}
                                    style={{
                                      backgroundColor: color,
                                      border: selectedColors.includes(color)
                                        ? "2px solid #000"
                                        : "1px solid #ccc",
                                    }}
                                    onClick={() => handleColorChange(color)}
                                  />
                                ))}
                              </div>
                            </div>

                            <button
                              className={CategoryStyle.button}
                              onClick={handleClearFilters}>
                              Clear
                            </button>
                          </div>
                        </div>
                      </div>
                    </Modal>
                    {/* End of addition by jhamman on 30-10-2024
                  Reason - open a model to add filter when screen size is 720px*/}
                    {uniqueProducts.length > 1 ? (
                      <div className={CategoryStyle.sortContainer}>
                        <p className={CategoryStyle.sortTitle}>Sort By</p>
                        <select value={sortOrder} onChange={handleSortChange}>
                          <option value="default">Default</option>
                          <option value="lowToHigh">Price: Low to High</option>
                          <option value="highToLow">Price: High to Low</option>
                        </select>
                        <div className={CategoryStyle.iconWrapper}>
                          {" "}
                          {getIcon()}{" "}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div
                    className={
                      viewType === "grid"
                        ? CategoryStyle.gridContainer
                        : CategoryStyle.listContainer
                    }>
                    {uniqueProducts.map((product) => (
                      <div
                        key={product.id}
                        className={
                          viewType === "grid"
                            ? CategoryStyle.gridCard
                            : CategoryStyle.listCard
                        }>
                        {/* Code commented by - Ashlekh on 27-11-2024
                          Reason - To add wishlist icon in bottom of card (while clicking on wishlist icon user was navigating in product detail page) */}
                        {/* <Link
                          to={`/productdetail/${product.product_id}`}
                          className={CategoryStyle.productLink}> */}

                        {/* End of code - Ashlekh on 27-11-2024
                            Reason - To add wishlist icon in bottom of card (while clicking on wishlist icon user was navigating in product detail page) */}
                        <div
                          className={
                            viewType === "grid"
                              ? CategoryStyle.gridImageContainer
                              : CategoryStyle.listImageContainer
                          }>
                          {/* Added by Jhamman on 06-10-2024
                              Reason - Added offer logo */}
                          <Link
                            to={`/productdetail/${product.product_id}`}
                            /**Code added by Unnati on 05-12-2024
                    *Reason-Send color through state */
                            state={product.color}
                          /**End of code addition by Unnati on 05-12-2024
                          *Reason-Send color through state */
                          >
                            <div
                              className={`${CategoryStyle.imageAndOfferLogoContainer}`}>
                              {product.sale_percentage ? (
                                <div className={CategoryStyle.offerContainer}>
                                  <p className={CategoryStyle.offerPercentage}>
                                    {product.sale_percentage}% off
                                  </p>
                                </div>
                              ) : null}
                              {/* End of addition by Jhamman on 06-10-2024
                                  Reason - Added offer logo */}
                              <img
                                src={`${config.baseURL}${product.image1}`}
                                alt={product.name}
                                className={
                                  viewType === "grid"
                                    ? CategoryStyle.gridImage
                                    : CategoryStyle.listImage
                                }
                              />
                            </div>
                          </Link>
                          <button
                            className={
                              viewType === "grid"
                                ? CategoryStyle.addToCartButton
                                : CategoryStyle.listaddToCartButton
                            }
                            /**Code added by Unnati on 06-01-2025
                    *Reason-Added on click functionaity */
                            onClick={() =>
                              handleProductModal(
                                product.product_id,
                                product.color
                              )
                            }
                          /**End of code addition by Unnati on 06-01-2025
                          *Reason-Added on click functionaity */
                          >
                            Add to Cart
                          </button>
                        </div>
                        {/**Code added by Unnati on 06-01-2025
                                                  *Reason-Added product modal */}
                        {showProductModal &&
                          selectedItem == product.product_id && (
                            <div
                              className={`${CategoryStyle.productModalOverlay}`}
                              onClick={closeModal}
                            >
                              <div
                                className={`${CategoryStyle.productModalContent}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  className={`${CategoryStyle.closeButton}`}
                                  onClick={closeModal}
                                >
                                  <IoCloseSharp />
                                </button>
                                {/**Code added by Unnati on 23-01-2025
                                                          *Reason-Added classname */}
                                {/* {selectedProduct?.name} */}
                                <div className={CategoryStyle.name}> {selectedProduct?.name}</div>
                                {/**End of code addition by Unnati on 23-01-2025
                                                            *Reason-Added classname */}
                                <div className={CategoryStyle.saleRate}>
                                  {selectedProduct?.sale_percentage ? (
                                    <div className={CategoryStyle.productPrice}>
                                      {config.currency_icon}
                                      {calculateDiscountFromProduct(
                                        selectedProduct?.sales_rate,
                                        selectedProduct?.sale_percentage
                                      )}
                                    </div>
                                  ) : (
                                    <div className={CategoryStyle.productPrice}>
                                      ${selectedProduct?.sales_rate}
                                    </div>
                                  )}
                                  {selectedProduct?.sale_percentage ? (
                                    <div className={`${CategoryStyle.cardPrice}`}>
                                      <p
                                        className={CategoryStyle.mrpPriceText}
                                        style={{
                                          textDecoration: "line-through",
                                          textDecorationColor: "#000",
                                          color: "red",
                                        }}
                                      >
                                        ${selectedProduct?.sales_rate}
                                      </p>
                                    </div>
                                  ) : null}
                                </div>
                                {/* Added by jhamman on 14-10-2024
                                                                        Reason - Added offer percentage*/}
                                {selectedProduct?.sale_percentage ? (
                                  <div
                                    className={CategoryStyle.productOfferContainer}
                                  >
                                    <p
                                      className={CategoryStyle.productOfferPercentage}
                                    >
                                      {selectedProduct?.sale_percentage}% off
                                    </p>
                                  </div>
                                ) : null}
                                <div className={CategoryStyle.productColors}>
                                  {/**Code added by Unnati on 20-12-2024
                                                             *Reason-To map product to according to its color*/}
                                  {uniqueColors.map((color) => (
                                    <div
                                      key={color}
                                      className={`${CategoryStyle.colorOption} ${selectedColor === color
                                          ? CategoryStyle.activeColorOption
                                          : ""
                                        }`}
                                      style={{ backgroundColor: color }}
                                      onClick={() => handleColorSelect(color)}
                                    ></div>
                                  ))}
                                  {/**End of code addition by Unnati on 20-12-2024
                                                             *Reason-To map product to according to its color*/}
                                </div>
                                {!selectedProduct?.is_free_size ?
                                  <div className={CategoryStyle.sizeMessage}>
                                    <label htmlFor="sizeBoxes">Size</label>

                                    <p className={CategoryStyle.availabilityMessage}>
                                      {availabilityMessage}
                                    </p>
                                  </div> : null}
                                {/**Code added by Unnati on 02-01-2025
                                                           *Reason-Added condition for free size*/}
                                {!selectedProduct?.is_free_size && (
                                  <div className={CategoryStyle.sizeBoxes}>
                                    {[
                                      "XS",
                                      "S",
                                      "M",
                                      "L",
                                      "XL",
                                      "XXL",
                                      "XXXL",
                                    ].map((size) => (
                                      <div
                                        key={size}
                                        className={`${CategoryStyle.sizeBox} ${selectedSize === size
                                            ? CategoryStyle.selectedSizeBox
                                            : ""
                                          } ${!isSizeAvailable(size)
                                            ? CategoryStyle.unavailableSizeBox
                                            : ""
                                          }`}
                                        onClick={() =>
                                          isSizeAvailable(size) &&
                                          handleSelectChange(size)
                                        }
                                      >
                                        {size}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {/**End of code addition by Unnati on 02-01-2025
                                                           *Reason-Added condition for free size*/}
                                {selectedProduct?.show_patches_and_embroider_on_UI
                                  // Added by - Ashlekh on 16-01-2025
                                  // Reason - To check condition for logo patches security embroider
                                  && (selectedProduct?.logo_price || selectedProduct?.patches_price || selectedProduct?.security_batches_price || selectedProduct?.embroider_price)
                                  // End of code - Ashlekh on 16-01-2025
                                  // Reason - To check condition for logo patches security embroider
                                  ? (
                                    <h5
                                      className={`${CategoryStyle.popupContent}`}
                                    >
                                      {/* Customization Options */}
                                    </h5>
                                  ) : null}
                                <div className={CategoryStyle.checkboxGroup}>
                                  {/* {selectedProduct?.show_patches_and_embroider_on_UI
                                    && (selectedProduct.logo_price)
                                    ? (
                                      <label className={CategoryStyle.reason}>
                                        <input
                                          type="checkbox"
                                          name="logo"
                                          checked={formData.logo}
                                          onChange={handleChange}
                                          className={`${CategoryStyle.checkBox}`}
                                        />{" "}
                                        Logo + ${selectedProduct?.logo_price}
                                      </label>
                                    ) : null}
                                  {selectedProduct?.show_patches_and_embroider_on_UI
                                    && (selectedProduct.patches_price)
                                    ? (
                                      <label className={CategoryStyle.reason}>
                                        <input
                                          type="checkbox"
                                          name="patches"
                                          checked={formData.patches}
                                          onChange={handleChange}
                                          className={`${CategoryStyle.checkBox}`}
                                        />{" "}
                                        Patches / Batches + $
                                        {selectedProduct?.patches_price}
                                      </label>
                                    ) : null}
                                  {selectedProduct?.show_patches_and_embroider_on_UI
                                    && (selectedProduct.security_batches_price)
                                    ? (
                                      <label className={CategoryStyle.reason}>
                                        <input
                                          type="checkbox"
                                          name="security_batches"
                                          checked={formData.security_batches}
                                          onChange={handleChange}
                                          className={`${CategoryStyle.checkBox}`}
                                        />{" "}
                                        Security ID on Back and Chest + $
                                        {selectedProduct?.security_batches_price}
                                      </label>
                                    ) : null}
                                  {selectedProduct?.show_patches_and_embroider_on_UI
                                    && (selectedProduct.security_id_on_back_price)
                                    ? (
                                      <label className={CategoryStyle.reason}>
                                        <input
                                          type="checkbox"
                                          name="security_id_on_back"
                                          checked={formData.security_id_on_back}
                                          onChange={handleChange}
                                          className={`${CategoryStyle.checkBox}`}
                                        />{" "}
                                        Security ID on Back + $
                                        {selectedProduct?.security_id_on_back_price}
                                      </label>
                                    ) : null}
                                  {selectedProduct?.show_patches_and_embroider_on_UI
                                    && (selectedProduct.printed_id_price)
                                    ? (
                                      <label className={CategoryStyle.reason}>
                                        <input
                                          type="checkbox"
                                          name="printed_id"
                                          checked={formData.printed_id}
                                          onChange={handleChange}
                                          className={`${CategoryStyle.checkBox}`}
                                        />{" "}
                                        Printed ID + $
                                        {selectedProduct?.printed_id_price}
                                      </label>
                                    ) : null}
                                  {selectedProduct?.show_patches_and_embroider_on_UI
                                    && (selectedProduct.embroider_price)
                                    ? (
                                      <label className={CategoryStyle.reason}>
                                        <input
                                          type="checkbox"
                                          name="embroider"
                                          checked={formData.embroider}
                                          onChange={handleChange}
                                          className={`${CategoryStyle.checkBox}`}
                                        />{" "}
                                        Embroider + $
                                        {selectedProduct?.embroider_price}
                                      </label>
                                    ) : null} */}
                                </div>
                                {validationMessage && (
                                  <div
                                    style={{
                                      color: "red",
                                      marginBottom: "10px",
                                    }}
                                  >
                                    {validationMessage}
                                  </div>
                                )}
                                {selectedProduct?.show_patches_and_embroider_on_UI
                                  && (selectedProduct?.logo_price || selectedProduct?.patches_price || selectedProduct?.security_batches_price || selectedProduct?.embroider_price)
                                  ? (
                                    <div className={CategoryStyle.commentBox}>
                                      <textarea
                                        name="customization_comment"
                                        placeholder="Comment"
                                        className={CategoryStyle.commentInput}
                                        value={formData.customization_comment}
                                        onChange={handleChange}
                                      />
                                    </div>
                                  ) : null}
                                <p className={CategoryStyle.availabilityMessage}>{notAvaible}</p>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                ></div>
                                <div className={CategoryStyle.quantityContainer}>
                                  {/* Addition by Om Shrivastava on 18-12-2024
                                                                      Reason : Add div section  */}
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "8px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <div className={CategoryStyle.quantity}>
                                      <label>Qty</label>
                                    </div>
                                    <div
                                      className={CategoryStyle.quantityInput}
                                      onClick={QuantityMessage}
                                    >
                                      <p
                                        className={CategoryStyle.quantityButton}
                                        onClick={handleDecrement}
                                      >
                                        -
                                      </p>
                                      <input
                                        type="number"
                                        inputMode="numeric"
                                        className={CategoryStyle.quantityNumber}
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        onPaste={(e) => e.preventDefault()}
                                        onCopy={(e) => e.preventDefault()}
                                        // Added by - Ashlekh on 27-11-2024
                                        // Reason - To prevent '-'/'e'/'+' from quantity
                                        onKeyDown={(e) => {
                                          if (
                                            e.key == "+" ||
                                            e.key == "e" ||
                                            e.key == "-"
                                          ) {
                                            e.preventDefault();
                                          }
                                        }}
                                      // End of code - Ashlekh on 27-11-2024
                                      // Reason - To prevent '-'/'e'/'+' from quantity
                                      />
                                      <p
                                        className={CategoryStyle.quantityButton}
                                        onClick={handleIncrement}
                                      >
                                        +
                                      </p>
                                    </div>
                                    {/* End of addition by Om Shrivastava on 18-12-2024
                                                                           Reason : Add div section  */}
                                  </div>
                                  {/* Addition  by Om Shrivastava on 18-12-2024
                                                                        Reason : Add add to cart section and wishlist in phone view  */}
                                  <div className={CategoryStyle.addToCartPhoneView}>
                                    <button
                                      // Code changed by - Ashlekh on 18-01-2025
                                      // Reason - To add multiple class name
                                      // className={CategoryStyle.addToCartButton}
                                      className={`${CategoryStyle.addToCartButton} ${CategoryStyle.addToCartButtonPopup}`}
                                      // End of code - Ashlekh on 18-01-2025
                                      // Reason - To add multiple class name
                                      onClick={handleSubmit}
                                    >
                                      Add to Cart
                                    </button>
                                  </div>
                                  <p className={CategoryStyle.availabilityMessage}>
                                    {quantityMessage}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        {/**End of code adddition by Unnati on 06-01-2025
                                                  *Reason-Added product modal */}

                        <div
                          className={
                            viewType === "grid"
                              ? CategoryStyle.gridContent
                              : CategoryStyle.listContent
                          }>
                          {/* Added by - Ashlekh on 27-11-2024
                              Reason - To add wishlist icon in bottom of card (while clicking on wishlist icon user was navigating in product detail page) */}
                          <Link
                            to={`/productdetail/${product.product_id}`}
                            /**Code added by Unnati on 05-12-2024
                  *Reason-Send color through state */
                            state={product.color}
                          /**End of code addition by Unnati on 05-12-2024
                          *Reason-Send color through state */
                          >
                            {/* End of code - Ashlekh on 27-11-2024
                              Reason - To add wishlist icon in bottom of card (while clicking on wishlist icon user was navigating in product detail page) */}
                            {/* Code changed by - Ashlekh on 28-11-2024
                              Reason - To change h3 to div tag */}
                            {/* <h3
                                className={
                                  viewType === "grid"
                                    ? CategoryStyle.brandName
                                    : CategoryStyle.listBrandName
                                }> */}
                            <div
                              className={
                                viewType === "grid"
                                  ? CategoryStyle.brandName
                                  : CategoryStyle.listBrandName
                              }>
                              {/* End of code - Ashlekh on 28-11-2024
                                Reason - To change h3 to div tag */}
                              {/**Code added by Unnati on 12-09-2024
                                 *Reason-If product name is long then show only 50 characters */}
                              {/**Code added by Unnati on 17-10-2024
                                 *Reason-If product name is long then show only 40 characters */}
                              {product.name.substring(0, 40)}
                              {/**End of code addition Unnati on 17-10-2024
                                 *Reason-If product name is long then show only 40 characters */}
                              {/**End of code addition by Unnati on 12-09-2024
                                 *Reason-If product name is long then show only 50 characters */}
                              {/* Code changed by - Ashlekh on 28-11-2024
                                Reason - To change h3 to div tag */}
                              {/* </h3> */}
                            </div>
                            {/* End of code - Ashlekh on 28-11-2024
                              Reason - To change h3 to div tag */}
                          </Link>
                          {/* Added by - Ashlekh on 28-11-2024
                            Reason - To add rating */}
                          <div className={`${CategoryStyle.rating}`}>
                            {product.rating > 0 && (
                              <Rating value={product.rating} />
                            )}
                          </div>
                          {/* End of code - Ashlekh on 28-11-2024
                            Reason - To add rating */}
                          {/* Added by - Ashlekh on 27-11-2024
                            Reason - To add wishlist icon in bottom of card (while clicking on wishlist icon user was navigating in product detail page) */}
                          {/* Commented by - Ashlekh on 28-11-2024
                            Reason - To remove description */}
                          {/* <Link
                              to={`/productdetail/${product.product_id}`}
                            > */}
                          {/* End of code - Ashlekh on 27-11-2024
                              Reason - To add wishlist icon in bottom of card (while clicking on wishlist icon user was navigating in product detail page) */}
                          {/* <h2
                                className={
                                  viewType === "grid"
                                    ? CategoryStyle.cardTitle
                                    : CategoryStyle.listCardTitle
                                }> */}
                          {/**Code added by Unnati on 17-10-2024
                                 *Reason-If product name is long then show only 40 characters */}
                          {/* {product.description.substring(0, 40)} */}
                          {/**End of code addition Unnati on 17-10-2024
                                 *Reason-If product name is long then show only 40 characters */}
                          {/* </h2>
                            </Link>  */}
                          {/* End of comment - Ashlekh on 28-11-2024
                            Reason - To remove description  */}
                          {/* Added by - Ashlekh on 27-11-2024
                              Reason - To add wishlist icon in bottom of card (while clicking on wishlist icon user was navigating in product detail page) */}
                          <Link
                            to={`/productdetail/${product.product_id}`}
                            /**Code added by Unnati on 05-12-2024
                *Reason-Send color through state */
                            state={product.color}
                          /**End of code addition by Unnati on 05-12-2024
                          *Reason-Send color through state */
                          >
                            {/* End of code - Ashlekh on 27-11-2024
                                Reason - To add wishlist icon in bottom of card (while clicking on wishlist icon user was navigating in product detail page) */}
                            {/* Modified by Jhamman on 05-10-2024
                                  Reason- calculate sale price */}
                            <div className={CategoryStyle.priceContainer}>
                              {product.sale_percentage ? (
                                <div
                                  className={
                                    viewType === "grid"
                                      ? CategoryStyle.cardPrice
                                      : CategoryStyle.listCardPrice
                                  }>
                                  <p
                                    className={
                                      CategoryStyle.discountedPriceText
                                    }>
                                                                        {config.currency_icon}

                                    {calculateDiscountFromProduct(
                                      product.sales_rate,
                                      product.sale_percentage
                                    )}
                                  </p>
                                </div>
                              ) : null}
                              <div
                                className={
                                  viewType === "grid"
                                    ? CategoryStyle.cardPrice
                                    : CategoryStyle.listCardPrice
                                }>
                                {/* Commented by jhamman on 07-10-2024
                                    Reason - Go through many websites there are not mentioned MRP*/}
                                {/* <p className={CategoryStyle.mrpPriceText}>
                                      M.R.P:
                                    </p> */}
                                {/* End of commentation by jhamman on 07-10-2024
                                    Reason - Go through many websites there are not mentioned MRP*/}
                                <p
                                  className={CategoryStyle.mrpPriceText}
                                  style={
                                    product.sale_percentage
                                      ? {
                                        textDecoration: "line-through",
                                        // Code changed by - Ashlekh on 28-11-2024
                                        // Reason - To change color
                                        // textDecorationColor: "#000",
                                        // color: "red",
                                        textDecorationColor: "#888888",
                                        color: "#888888",
                                        // End of code - Ashlekh on 28-11-2024
                                        // Reason - To change color
                                      }
                                      : {
                                        // Code changed by - Ashlekh on 28-11-2024
                                        // Reason - To change color
                                        // color: "green"
                                        color: "red"
                                        // End of code - Ashlekh on 28-11-2024
                                        // Reason - To change color
                                      }
                                  }>
                                                                        {config.currency_icon}
{product.sales_rate}
                                </p>
                              </div>

                              {/* End of modification by Jhamman on 05-10-2024
                                  Reason- calculate sale price */}
                            </div>
                          </Link>
                          {/**Code added by Unnati on 17-10-2024
                             *Reason-Added product rating  */}
                          <div
                            className={CategoryStyle.productDetailContainer}>
                            {/* Added by - Ashlekh on 27-11-2024
                                Reason - To display wishlist icon */}
                            {user.id != undefined && (
                              <div className={`${CategoryStyle.wishListIconContainer}`}>
                                {wishlistStatus[`${product.product_id}-${product.color}`] ? (
                                  <MdFavorite
                                    onClick={() => handleToggleWishList(user, product)}
                                    className={`${CategoryStyle.wishListIcon1}`}
                                  />
                                ) : (
                                  <MdFavoriteBorder
                                    onClick={() => handleToggleWishList(user, product)}
                                    className={`${CategoryStyle.wishListIcon2}`}
                                  />
                                )}
                              </div>
                            )}
                            {/* End of code - Ashlekh on 27-11-2024
                                Reason - To display wishlist icon */}
                            {/* Commented by - Ashlekh on 28-11-2024
                                Reason - To remove rating */}
                            {/* <div>
                                  {product.rating > 0 && (
                                    <Rating value={product.rating} />
                                  )}
                                </div> */}
                            {/**Code commented by Unnati on 18-10-2024
                                     *Reason-Commented star component*/
                                    /* <ReactStars
                                      className={CategoryStyle.star}
                                      count={5}
                                      value={product.rating}
                                      size={12}
                                      color2={"#ffd700"}
                                      edit={false}
                                    /> */
                                    /**End of code comment by Unnati on 18-10-2024
                                     *Reason-Commented star component*/
                                    /**Code added by Unnati on 18-10-2024
                                     *Reason-Calling component*/}
                            {/**End of code addition by Unnati on 18-10-2024
                                      *Reason-Calling component*/}
                            {/* End of comment - Ashlekh on 28-11-2024
                                      Reason - To remove rating */}
                          </div>
                          {/**End of code addition by Unnati on 17-10-2024
                             *Reason-Added product rating  */}
                        </div>
                        {/* Code commented by - Ashlekh on 27-11-2024
                          Reason - To add wishlist icon in bottom of card (while clicking on wishlist icon user was navigating in product detail page) */}
                        {/* </Link> */}
                        {/* End of code - Ashlekh on 27-11-2024
                        Reason - To add wishlist icon in bottom of card (while clicking on wishlist icon user was navigating in product detail page) */}
                        {/* <div className={CategoryStyle.ButtonContainer}>
                    <button className={CategoryStyle.wishlistButton}>
                      <FaRegHeart /> Wishlist
                    </button>
                  </div> */}
                      </div>
                    ))}
                  </div>

                  {/* <div className={CategoryStyle.viewToggleButtons}>
                    <div className={CategoryStyle.viewButtons}>
                      <div
                        className={`${CategoryStyle.square} ${
                          viewType === "grid" ? CategoryStyle.active : ""
                        }`}
                      >
                        <p */}
                  {/* // className={`${CategoryStyle.squareIcon}`}
                          onClick={() => setViewType("grid")}
                        > */}
                  {/* <BsGrid3X2 /> */}
                  {/* </p>
                      </div> */}
                  {/* <div
                    className={`${CategoryStyle.square} ${
                      viewType === "list" ? CategoryStyle.active : ""
                    }`}
                    >
                    <p
                      className={`${CategoryStyle.squareIcon}`}
                      onClick={() => setViewType("list")}
                    >
                      <FaList />
                    </p>
                    </div> */}
                  {/* </div> */}
                  {/* <div className={`${CategoryStyle.pagination}`}>
                      <Pagination
                        current={currentPage}
                        pageSize={listPerPage}
                        total={totalProducts}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                      />
                    </div> */}
                  {/* </div> */}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {scrollDoc()}
    </div>
  );
};

export default Category;
/**End of code addition by Unnati on 20-06-2024
 * Reason-To have category page
 */
