/**Code added by Unnati on 05-10-2024
 * Reason-To have a sale products page
 */
import React, { useState, useContext, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import SaleProductStyle from "./SaleProduct.module.css";
import NavigationPath from "../../components/NavigationPath/NavigationPath";
import { GlobalContext } from "../../context/Context";
import config from "../../Api/config";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import {
  addToWishListAPI,
  getSaleProducts,
  getSortedProductsAPI,
  removeProductFromWishListAPI,
  checkIfProductExistsInCart,
  updateCart,
  addToCart,
  getProductDetails,
} from "../../Api/services";
import { calculateDiscountFromProduct } from "../../utils/discountedPrices";
import ReactStars from "react-stars";
import Rating from "../../components/Rating/Rating";
import notificationObject from "../../components/Widgets/Notification/Notification";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { checkIsEmpty } from "../../utils/validations";
import { IoCloseSharp } from "react-icons/io5";
const SaleProduct = () => {
  const location = useLocation();
  const id = location.state;
  const [viewType, setViewType] = useState("grid");
  const [saleProduct, setSaleProduct] = useState([]);
  const [sortOrder, setSortOrder] = useState("default");
  {
    /*
     *Code added by Unnati on 05-10-2024
     * Reason-Added navigation link path
     */
  }
  const {
    navigationPath,
    setNavigationPath,
    // Added by - Ashlekh on 18-11-2024
    // Reason - To import variables from context
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
    // End of code - Ashlekh on 18-11-2024
    // Reason - To import variables from context
    // Added by - Ashlekh on 27-11-2024
    // Reason - To import wishlist & user from context
    user,
    setUser,
    wishListData,
    setWishListData,
    // End of code - Ashlekh on 27-11-2024
    // Reason - To import wishlist & user from context
  } = useContext(GlobalContext);
  const [listPerPage, setListPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
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
  const { refreshCartData, setCartData } = useContext(GlobalContext);
  const [notAvaible,setNotAvaible]= useState("");
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
    if(selectedProduct?.is_free_size){
      setSelectedSize("free_size")
    }
    if(!selectedProduct?.is_free_size)
    {
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
    setAvailabilityMessage("");
    setQuantityMessage("");
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
    //   security_batches: false,
    //   // Added by - Ashlekh on 20-02-2025
    //   // Reason - To add customization
    //   security_id_on_back: false,
    //   printed_id: false,
    //   // End of code - Ashlekh on 20-02-2025
    //   // Reason - To add customization
    //   embroider: false,
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
      setSelectedSize("free_size");
      handleSelectChange("free_size");
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
      setSelectedSize("free_size");
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
    } else {
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

    
    if(selectedProduct.sale_percentage){
      basePrice = selectedProduct?.sales_rate - ((selectedProduct?.sales_rate * selectedProduct?.sale_percentage)/100)

      
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
              setSelectedSize("free_size");
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
              setSelectedSize("free_size");
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
                after_customization_product_price: parseFloat(
                  cartItem.after_customization_product_price
                ),
                customization_comment: productDetail.customization_comment,
              };
            }
            return cartItem;
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
        setSelectedSize("");
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
      setSelectedSize("");
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
  useEffect(() => {
    window.scrollTo(0, 0);
    setNavigationPath([
      { name: "Home", path: "/" },
      { name: "SaleProduct", path: "/saleproducts" },
    ]);
  }, []);
  /**Code added by Unnati on 05-10-2024
   * Reason-To scroll to the top
   */
  const scrollDoc = () => {
    window.scrollTo(0, 0);
  };
  /**End of code addition by Unnati on 05-10-2024
   * Reason-To scroll to the top
   */
  {
    /**End of code addition by Unnati on 05-10-2024
     * Reason-Added navigation link path
     */
  }

  /**Code added by Unnati Bajaj on 05-10-2024
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
  /**End of code addition by Unnati Bajaj on 05-10-2024
   * Reason -To handle sort change
   */
  /**Code added by Unnati on 05-10-2024
   * Reason-To get saleProducts when components loads
   */
  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        /**Code added by Unnati on 05-12-2024
         * Reason-Added sortorder
         */
        const response = await getSaleProducts(id, sortOrder);
        /**End of code additon by Unnati on 05-12-2024
         * Reason-Added sortorder
         */
        setSaleProduct(response.sale_product);
      } catch (error) {
        console.error("Error fetching product:", error.message);
      }
    };

    fetchSaleProducts();
    /**Code added by Unnati on 05-12-2024
     * Reason-Added sortorder
     */
  }, [id, sortOrder]);
  /**End of code additon by Unnati on 05-12-2024
   * Reason-Added sortorder
   */
  /**End of code addition by Unnati on 05-10-2024
   * Reason-To get saleProducts when components loads
   */
  /**
   * Added by - Ashlekh on 18-11-2024
   * Reason - For applying sorting
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
  /**
   * End of code - Ashlekh on 18-11-2024
   * Reason - For applying sorting
   */

  /**
   * Added by - Ashlekh on 18-11-2024
   * Reason - API for sorting products
   */
  /**code comment by Unnati on 05-12-2024
   * Reason-Not in use
   */
  // useEffect(() => {
  //   const fetchSortedProduct = async() => {
  //     try{
  //       const response = await getSortedProductsAPI(
  //         id, // This is banner id
  //         sortOrder,
  //         currentPage,
  //         listPerPage,
  //       );
  //       setSaleProduct(response.product);
  //     } catch(error) {
  //       console.error("Error in fetching product:", error.message);
  //     }
  //   };
  //   fetchSortedProduct();
  // }, [
  //   sortOrder,
  //   currentPage,
  //   listPerPage,
  // ]);
  /*End of code comment by Unnati on 05-12-2024
   * Reason-Not in use
   */
  /**
   * End of code - Ashlekh on 18-11-2024
   * Reason - API for sorting products
   */

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
  return (
    <div className={SaleProductStyle.pageFrame}>
      <div className={SaleProductStyle.coloredBackground}>
        <div className={`${SaleProductStyle.pageContainer}`}>
          <NavigationPath navigationPathArray={navigationPath} />

          {/* Added by jhamman on 14-10-2024
          Reason - Show message when product are not available*/}
          {saleProduct?.length === 0 ? (
            <div className={SaleProductStyle.noProductsFound}>
              <h4>No product available</h4>
            </div>
          ) : (
            /* End of addition by jhamman on 14-10-2024
          Reason - Show message when product are not available*/
            <div className={SaleProductStyle.productContainer}>
              {/* <div className={SaleProductStyle.viewToggleButtons}>
              <div className={SaleProductStyle.viewButtons}>
                <p onClick={() => setViewType("grid")}></p>
              </div> */}
              {/**Code added by Unnati on 26-10-2024
               *Reason-Added condition to show sort by */}
              {saleProduct?.length > 1 ? (
                <div className={SaleProductStyle.sortContainer}>
                  <p className={SaleProductStyle.sortTitle}>Sort By</p>
                  <select value={sortOrder} onChange={handleSortChange}>
                    <option value="default">Default</option>
                    <option value="lowToHigh">Price: Low to High</option>
                    <option value="highToLow">Price: High to Low</option>
                  </select>
                  <div className={SaleProductStyle.iconWrapper}>
                    {" "}
                    {getIcon()}{" "}
                  </div>
                </div>
              ) : (
                " "
              )}
              {/**End of code addition by Unnati on 26-10-2024
               *Reason-Added condition to show sort by */}
              {/* </div> */}
              <div
                className={
                  viewType === "grid"
                    ? SaleProductStyle.gridContainer
                    : SaleProductStyle.listContainer
                }
              >
                {/**Code added by Unnati 05-10-2024
                 *Reason-To have map sale products */}
                {saleProduct &&
                  saleProduct.map((product) => (
                    <div
                      key={product.id}
                      className={
                        viewType === "grid"
                          ? SaleProductStyle.gridCard
                          : SaleProductStyle.listCard
                      }
                    >
                      {/* Code commented by - Ashlekh on 27-11-2024
                        Reason - To add wishlist icon in bottom of card (while clicking on wishlist icon user was navigating in product detail page) */}
                      {/* <Link
                        to={`/productdetail/${product.product_id}`}
                        className={SaleProductStyle.productLink}> */}

                      {/* End of code - Ashlekh on 27-11-2024
                            Reason - To add wishlist icon in bottom of card (while clicking on wishlist icon user was navigating in product detail page) */}
                      <div
                        className={
                          viewType === "grid"
                            ? SaleProductStyle.gridImageContainer
                            : SaleProductStyle.listImageContainer
                        }
                      >
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
                            className={`${SaleProductStyle.imageAndOfferLogoContainer}`}
                          >
                            {product.sale_percentage ? (
                              <div className={SaleProductStyle.offerContainer}>
                                <p className={SaleProductStyle.offerPercentage}>
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
                                  ? SaleProductStyle.gridImage
                                  : SaleProductStyle.listImage
                              }
                            />
                          </div>
                        </Link>
                        <button
                          className={
                            viewType === "grid"
                              ? SaleProductStyle.addToCartButton
                              : SaleProductStyle.listaddToCartButton
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
                            className={`${SaleProductStyle.productModalOverlay}`}
                            onClick={closeModal}
                          >
                            <div
                              className={`${SaleProductStyle.productModalContent}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                className={`${SaleProductStyle.closeButton}`}
                                onClick={closeModal}
                              >
                              <IoCloseSharp />
                              </button>
                              {/**Code added by Unnati on 23-01-2025
                                *Reason-Added classname */}
                               {/* {selectedProduct?.name} */}
                               <div className={SaleProductStyle.name}> {selectedProduct?.name}</div>
                                {/**End of code addition by Unnati on 23-01-2025
                                *Reason-Added classname */}
                              <div className={SaleProductStyle.saleRate}>
                                {selectedProduct?.sale_percentage ? (
                                  <div
                                    className={SaleProductStyle.productPrice}
                                  >
                                    $
                                    {calculateDiscountFromProduct(
                                      selectedProduct?.sales_rate,
                                      selectedProduct?.sale_percentage
                                    )}
                                  </div>
                                ) : (
                                  <div
                                    className={SaleProductStyle.productPrice}
                                  >
                                    ${selectedProduct?.sales_rate}
                                  </div>
                                )}
                                {selectedProduct?.sale_percentage ? (
                                  <div
                                    className={`${SaleProductStyle.cardPrice}`}
                                  >
                                    <p
                                      className={SaleProductStyle.mrpPriceText}
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
                                  className={
                                    SaleProductStyle.productOfferContainer
                                  }
                                >
                                  <p
                                    className={
                                      SaleProductStyle.productOfferPercentage
                                    }
                                  >
                                    {selectedProduct?.sale_percentage}% off
                                  </p>
                                </div>
                              ) : null}
                              <div className={SaleProductStyle.productColors}>
                                {/**Code added by Unnati on 20-12-2024
                                 *Reason-To map product to according to its color*/}
                                {uniqueColors.map((color) => (
                                  <div
                                    key={color}
                                    className={`${
                                      SaleProductStyle.colorOption
                                    } ${
                                      selectedColor === color
                                        ? SaleProductStyle.activeColorOption
                                        : ""
                                    }`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => handleColorSelect(color)}
                                  ></div>
                                ))}
                                {/**End of code addition by Unnati on 20-12-2024
                                 *Reason-To map product to according to its color*/}
                              </div>
                              {!selectedProduct?.is_free_size ? (
                                <div className={SaleProductStyle.sizeMessage}>
                                  <label htmlFor="sizeBoxes">Size</label>

                                  <p
                                    className={
                                      SaleProductStyle.availabilityMessage
                                    }
                                  >
                                    {availabilityMessage}
                                  </p>
                                </div>
                              ) : null}
                              {/**Code added by Unnati on 02-01-2025
                               *Reason-Added condition for free size*/}
                              {!selectedProduct?.is_free_size && (
                                <div className={SaleProductStyle.sizeBoxes}>
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
                                      className={`${SaleProductStyle.sizeBox} ${
                                        selectedSize === size
                                          ? SaleProductStyle.selectedSizeBox
                                          : ""
                                      } ${
                                        !isSizeAvailable(size)
                                          ? SaleProductStyle.unavailableSizeBox
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
                              // Added by - Ashlekh on 06-03-2025
                              // Reason - To add customization
                              // && (selectedProduct?.logo_price || selectedProduct?.patches_price || selectedProduct?.security_batches_price || selectedProduct?.embroider_price)
                              && (selectedProduct?.logo_price || selectedProduct?.patches_price || selectedProduct?.security_batches_price || selectedProduct?.security_id_on_back_price || selectedProduct?.printed_id_price || selectedProduct?.embroider_price)
                              // End of code - Ashlekh on 06-03-2025
                              // Reason - To add customization
                              // End of code - Ashlekh on 16-01-2025
                              // Reason - To check condition for logo patches security embroider
                              ? (
                                <h5
                                  className={`${SaleProductStyle.popupContent}`}
                                >
                                  Customization Options
                                </h5>
                              ) : null}
                              <div className={SaleProductStyle.checkboxGroup}>
                                {/* Added by - Ashlekh on 16-01-2025
                                Reason - To check condition for logo */}
                                {/* {selectedProduct?.logo_price  */}
                                {selectedProduct?.show_patches_and_embroider_on_UI
                                && (selectedProduct.logo_price)
                                // End of code - Ashlekh on 16-01-2025
                                // Reason - To check condition for logo
                                ? (
                                  <label className={SaleProductStyle.reason}>
                                    <input
                                      type="checkbox"
                                      name="logo"
                                      checked={formData.logo}
                                      onChange={handleChange}
                                      // Added by - Ashlekh on 07-03-2025
                                      // Reason - To add class name
                                      className={`${SaleProductStyle.checkBox}`}
                                      // End of code - Ashlekh on 07-03-2025
                                      // Reason - To add class name
                                    />{" "}
                                    Logo + ${selectedProduct?.logo_price}
                                  </label>
                                ) : null}
                                {/* Added by - Ashlekh on 16-01-2025
                                Reason - To check condition for patches */}
                                {/* {selectedProduct?.patches_price  */}
                                {selectedProduct?.show_patches_and_embroider_on_UI
                                && (selectedProduct.patches_price)
                                // End of code - Ashlekh on 16-01-2025
                                // Reason - To check condition for patches
                                ? (
                                  <label className={SaleProductStyle.reason}>
                                    <input
                                      type="checkbox"
                                      name="patches"
                                      checked={formData.patches}
                                      onChange={handleChange}
                                      // Added by - Ashlekh on 07-03-2025
                                      // Reason - To add class name
                                      className={`${SaleProductStyle.checkBox}`}
                                      // End of code - Ashlekh on 07-03-2025
                                      // Reason - To add class name
                                    />{" "}
                                    Patches / Batches + $
                                    {selectedProduct?.patches_price}
                                  </label>
                                ) : null}
                                {/* Added by - Ashlekh on 16-01-2025
                                Reason - To check condition for security batches */}
                                {/* {selectedProduct?.security_batches_price  */}
                                {selectedProduct?.show_patches_and_embroider_on_UI
                                && (selectedProduct.security_batches_price)
                                // End of code - Ashlekh on 16-01-2025
                                // Reason - To check condition for security batches
                                ? (
                                  <label className={SaleProductStyle.reason}>
                                    <input
                                      type="checkbox"
                                      name="security_batches"
                                      checked={formData.security_batches}
                                      onChange={handleChange}
                                      // Added by - Ashlekh on 07-03-2025
                                      // Reason - To add class name
                                      className={`${SaleProductStyle.checkBox}`}
                                      // End of code - Ashlekh on 07-03-2025
                                      // Reason - To add class name
                                    />{" "}
                                    {/* Code changed by - Ashlekh on 18-02-2025
                                    Reason - To change customization name */}
                                    {/* Security id + $ */}
                                    Security ID on Back and Chest + $
                                    {/* End of code - Ashlekh on 18-02-2025
                                    Reason - To change customization name */}
                                    {selectedProduct?.security_batches_price}
                                  </label>
                                ) : null}
                                {/* Added by - Ashlekh on 20-02-2025
                                Reason - To add customization */}
                                {selectedProduct?.show_patches_and_embroider_on_UI
                                && (selectedProduct.security_id_on_back_price)
                                ? (
                                  <label className={SaleProductStyle.reason}>
                                    <input
                                      type="checkbox"
                                      name="security_id_on_back"
                                      checked={formData.security_id_on_back}
                                      onChange={handleChange}
                                      // Added by - Ashlekh on 07-03-2025
                                      // Reason - To add class name
                                      className={`${SaleProductStyle.checkBox}`}
                                      // End of code - Ashlekh on 07-03-2025
                                      // Reason - To add class name
                                    />{" "}
                                    Security ID on Back + $
                                    {selectedProduct?.security_id_on_back_price}
                                  </label>
                                ) : null}
                                {selectedProduct?.show_patches_and_embroider_on_UI
                                && (selectedProduct.printed_id_price)
                                ? (
                                  <label className={SaleProductStyle.reason}>
                                    <input
                                      type="checkbox"
                                      name="printed_id"
                                      checked={formData.printed_id}
                                      onChange={handleChange}
                                      // Added by - Ashlekh on 07-03-2025
                                      // Reason - To add class name
                                      className={`${SaleProductStyle.checkBox}`}
                                      // End of code - Ashlekh on 07-03-2025
                                      // Reason - To add class name
                                    />{" "}
                                    Printed ID + $
                                    {selectedProduct?.printed_id_price}
                                  </label>
                                ) : null}
                                {/* End of code - Ashlekh on 20-02-2025
                                Reason - To add customization */}
                                {/* Code changed by - Ashlekh on 16-01-2025
                                Reason - To check condition for embroider */}
                                {/* {selectedProduct?.embroider_price  */}
                                {selectedProduct?.show_patches_and_embroider_on_UI
                                && (selectedProduct.embroider_price)
                                // End of code - Ashlekh on 16-01-2025
                                // Reason - To check condition for embroider
                                ? (
                                  <label className={SaleProductStyle.reason}>
                                    <input
                                      type="checkbox"
                                      name="embroider"
                                      checked={formData.embroider}
                                      onChange={handleChange}
                                      // Added by - Ashlekh on 07-03-2025
                                      // Reason - To add class name
                                      className={`${SaleProductStyle.checkBox}`}
                                      // End of code - Ashlekh on 07-03-2025
                                      // Reason - To add class name
                                    />{" "}
                                    Embroider + $
                                    {selectedProduct?.embroider_price}
                                  </label>
                                ) : null}
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
                              // Added by - Ashlekh on 16-01-2025
                              // Reason - To check condition for logo patches security embroider
                              // Added by - Ashlekh on 06-03-2025
                              // Reason - To add customization
                              // && (selectedProduct?.logo_price || selectedProduct?.patches_price || selectedProduct?.security_batches_price || selectedProduct?.embroider_price)
                              && (selectedProduct?.logo_price || selectedProduct?.patches_price || selectedProduct?.security_batches_price || selectedProduct?.security_id_on_back_price || selectedProduct?.printed_id_price || selectedProduct?.embroider_price)
                              // End of code - Ashlekh on 06-03-2025
                              // Reason - To add customization
                              // End of code - Ashlekh on 16-01-2025
                              // Reason - To check condition for logo patches security embroider
                              ? (
                                <div className={SaleProductStyle.commentBox}>
                                  <textarea
                                    name="customization_comment"
                                    placeholder="Comment"
                                    className={SaleProductStyle.commentInput}
                                    value={formData.customization_comment}
                                    onChange={handleChange}
                                  />
                                </div>
                              ) : null}
                               { /**Code added by Unnati on 12-01-2025
                                                              * Reason-To clear message and close popup
                                                              */}
                                                            <p className={SaleProductStyle.availabilityMessage}>{notAvaible}</p>
                                                            { /**End of cdoe addition by Unnati on 12-01-2025
                                                              * Reason-To clear message and close popup
                                                              */}
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              ></div>
                              <div
                                className={SaleProductStyle.quantityContainer}
                              >
                                {/* Addition by Om Shrivastava on 18-12-2024
                                                                      Reason : Add div section  */}
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "8px",
                                    alignItems: "center",
                                  }}
                                >
                                  <div className={SaleProductStyle.quantity}>
                                    <label>Qty</label>
                                  </div>
                                  <div
                                    className={SaleProductStyle.quantityInput}
                                    onClick={QuantityMessage}
                                  >
                                    <p
                                      className={
                                        SaleProductStyle.quantityButton
                                      }
                                      onClick={handleDecrement}
                                    >
                                      -
                                    </p>
                                    <input
                                      type="number"
                                      inputMode="numeric"
                                      className={
                                        SaleProductStyle.quantityNumber
                                      }
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
                                      className={
                                        SaleProductStyle.quantityButton
                                      }
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
                                <div
                                  className={
                                    SaleProductStyle.addToCartPhoneView
                                  }
                                >
                                  <button
                                    className={SaleProductStyle.addToCartButton}
                                    onClick={handleSubmit}
                                  >
                                    Add to Cart
                                  </button>
                                </div>
                                <p
                                  className={
                                    SaleProductStyle.availabilityMessage
                                  }
                                >
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
                            ? SaleProductStyle.gridContent
                            : SaleProductStyle.listContent
                        }
                      >
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
                            Reason - To add wishlist icon in bottom of card (while clicking on wishlist icon user was navigating in product detail page)To add wishlist icon in bottom of card (while clicking on wishlist icon user was navigating in product detail page) */}
                          {/* Code changed by - Ashlekh on 28-11-2024
                              Reason - To change h3 to div */}
                          {/* <h3
                                className={
                                  viewType === "grid"
                                  ? SaleProductStyle.brandName
                                  : SaleProductStyle.listBrandName
                                  }> */}
                          {/* End of code - Ashlekh on 27-11-2024
                              Reason - To change h3 to div */}
                          <div
                            className={
                              viewType === "grid"
                                ? SaleProductStyle.brandName
                                : SaleProductStyle.listBrandName
                            }
                          >
                            {product.name.length > 50
                              ? `${product.name.substring(0, 50)}...`
                              : product.name}
                            {/* Code changed by - Ashlekh on 28-11-2024
                                Reason - To change h3 to div */}
                            {/* </h3> */}
                            {/* End of code - Ashlekh on 28-11-2024
                                Reason - To change h3 to div */}
                          </div>
                        </Link>
                        {/* Added by - Ashlekh on 28-11-2024
                            Reason - To add rating */}
                        <div className={`${SaleProductStyle.rating}`}>
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
                        {/* <h4
                              className={
                                viewType === "grid"
                                  ? SaleProductStyle.cardTitle
                                  : SaleProductStyle.listCardTitle
                              }>
                              {product.description.length > 50
                                ? `${product.description.substring(0, 50)}...`
                                : product.description}
                            </h4>
                          </Link> */}
                        {/* End of comment - Ashlekh on 28-11-2024
                          Reason - To remove description */}
                        {/* Modified by Jhamman on 10-10-2024
                          Reason - Added mrp price and price after discount*/}
                        {/* <p
                          className={
                            viewType === "grid"
                              ? SaleProductStyle.cardPrice
                              : SaleProductStyle.listCardPrice
                          }>
                          ${product.sales_rate}
                          </p> */}
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
                          <div className={SaleProductStyle.priceContainer}>
                            {product.sale_percentage ? (
                              <div
                                className={
                                  viewType === "grid"
                                    ? SaleProductStyle.cardPrice
                                    : SaleProductStyle.listCardPrice
                                }
                              >
                                <p
                                  className={
                                    SaleProductStyle.discountedPriceText
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
                              className={
                                viewType === "grid"
                                  ? SaleProductStyle.cardPrice
                                  : SaleProductStyle.listCardPrice
                              }
                            >
                              <p
                                className={SaleProductStyle.mrpPriceText}
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
                                        color: "red",
                                        // End of code - Ashlekh on 28-11-2024
                                        // Reason - To change color
                                      }
                                }
                              >
                                ${product.sales_rate}
                              </p>
                            </div>
                          </div>
                        </Link>
                        {/**Code added by Unnati on 17-10-2024
                         *Reason-Added star rating
                         */}
                        <div
                          className={SaleProductStyle.productDetailContainer}
                        >
                          {/* Added by - Ashlekh on 27-11-2024
                              Reason - To display wishlist icon */}
                          {user.id != undefined && (
                            <div
                              className={`${SaleProductStyle.wishListIconContainer}`}
                            >
                              {wishlistStatus[
                                `${product.product_id}-${product.color}`
                              ] ? (
                                <MdFavorite
                                  onClick={() =>
                                    handleToggleWishList(user, product)
                                  }
                                  className={`${SaleProductStyle.wishListIcon1}`}
                                />
                              ) : (
                                <MdFavoriteBorder
                                  onClick={() =>
                                    handleToggleWishList(user, product)
                                  }
                                  className={`${SaleProductStyle.wishListIcon2}`}
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
                                      className={SaleProductStyle.star}
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
                          {/* End of code - Ashlekh on 28-11-2024
                               Reason - To remove rating */}
                        </div>
                        {/**End of code addition by Unnati on 17-10-2024
                         *Reason-Added star rating
                         */}
                        {/* End of modification by Jhamman on 10-10-2024
                        Reason - Added mrp price and price after discount*/}
                      </div>
                      {/* Commented by - Ashlekh on 27-11-2024
                        Reason - To add wishlist icon in bottom of card (while clicking on wishlist icon user was navigating in product detail page) */}
                      {/* </Link> */}
                      {/* End of code - Ashlekh on 27-11-2024
                      Reason - To add wishlist icon in bottom of card (while clicking on wishlist icon user was navigating in product detail page) */}
                    </div>
                  ))}
                {/**End of code addition by Unnati 05-10-2024
                 *Reason-To have map sale products */}
              </div>
            </div>
          )}
        </div>
      </div>
      {scrollDoc()}
    </div>
  );
};

export default SaleProduct;
/**End of code addition by Unnati on 05-10-2024
 * Reason-To have sale products page
 */
