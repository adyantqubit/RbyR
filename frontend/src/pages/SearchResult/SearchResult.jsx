/**Code added by Unnati on 01-09-2024
 * Reason-To have search result page
 */

import React, { useEffect, useContext, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import styles from "./SearchResult.module.css";
import config from "../../Api/config";
import { calculateDiscountFromProduct } from "../../utils/discountedPrices";
import Rating from "../../components/Rating/Rating";
import { GlobalContext } from "../../context/Context";
import {
  addToWishListAPI,
  removeProductFromWishListAPI,
  updateCart,
  addToCart,
  checkIfProductExistsInCart,
  getProductDetails,
} from "../../Api/services";
import notificationObject from "../../components/Widgets/Notification/Notification";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import NavigationPath from "../../components/NavigationPath/NavigationPath";
import { checkIsEmpty } from "../../utils/validations";
import { IoCloseSharp } from "react-icons/io5";
const SearchResult = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const location = useLocation();
  const scrollDoc = () => {
    window.scrollTo(0, 0);
  };
  // Added by - Ashlekh on 27-11-2024
  // Reason - To add variable from context
  const { user, setUser, wishListData, setWishListData } =
    useContext(GlobalContext);
  // End of code - Ashlekh on 27-11-2024
  // Reason - To add variable from context
  // Added by - Ashlekh on 27-11-2024
  // Reason - useState for wishlist
  const [wishlistStatus, setWishlistStatus] = useState({});
  const navigate = useNavigate();
  // End of code - Ashlekh on 27-11-2024
  // Reason - useState for wishlist
  /**Code added by Unnati on 01-09-2024
   * Reason-To get searched products through location
   */
  const { products, query } = location.state || "";
  /**End of code addition by Unnati on 01-09-2024
   * Reason-To get searched products through location
   */
  const [showProductModal, setShowProductModal] = useState(false);
  const [product, setProduct] = useState([]);
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
    // End of code - Ashlekh on 19-02-2025
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
    console.log("colorsss>>>>>>>>>>>>>>>>>",color)
    setSelectedColor(color);
    const selectedProduct = product.find((product) => product.color === color);
    console.log("....prodcut",selectedProduct)
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
      security_batches : false,
      // Added by - Ashlekh on 20-02-2025
      // Reason - To add customization
      security_id_on_back: false,
      printed_id: false,
      // End of code - Ashlekh on 20-02-2025
      // Reason - To add customization
      embroider : false,
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
   */
  /**Code added by Unnati on 06-01-2025
   * Reason-To handle product modal
   */
  const handleProductModal = async (product_id, color) => {
    setShowProductModal(true);
    setSelectedItem(product_id);
    const response = await getProductDetails(product_id, color);
    setProduct(response.products);
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
  const uniqueColors = [...new Set(product.map((p) => p.color))];
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

    if (selectedProduct.sale_percentage) {
      basePrice =
        selectedProduct?.sales_rate -
        (selectedProduct?.sales_rate * selectedProduct?.sale_percentage) / 100;
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

        after_customization_product_price: formattedCustomizationPrice,
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
        security_batches_price:
          parseFloat(selectedProduct?.security_batches_price) || "0.00",
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
    // setShowProductModal(false);
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
  // Reason - To add navigation path
  const { navigationPath, setNavigationPath } = useContext(GlobalContext);
  useEffect(() => {
    setNavigationPath([
      { name: "Home", path: "/" },
      { name: "Search Result", path: "/searchresults" },
    ]);
    window.scrollTo(0, 0);
  }, [setNavigationPath]);
  // End of code - Ashlekh on 09-12-2024
  // Reason - To add navigation path
  return (
    <div className={styles.pageFrame}>
      <div className={styles.coloredBackground}>
        <div className={styles.pageContainer}>
          {/* Added by - Ashlekh on 09-12-2024
          Reason - To add navigation path */}
          <NavigationPath navigationPathArray={navigationPath} />
          {/* End of code - Ashlekh on 09-12-2024
          Reason - To add navigation path */}
          {/**Code added by Unnati on 03-10-2024
           *Reason-Added a div tag */}
          <div className={styles.pageTitle}>
            <h2>Search Results for "{query}"</h2>
          </div>
          {/**End of code addition by Unnati on 03-10-2024
           *Reason-Added a div tag */}
          <div className={styles.gridContainer}>
            {/**Code added by Unnati on 01-09-2024
             *Reason-To map product details */}
            {products?.map((product) => (
              <div key={product.id} className={styles.gridCard}>
                {/* Code commented by - Ashlekh on 27-11-2024
                Reason - To add wishlist icon in bottom of card (while clicking on wishlist icon user was navigating in product detail page) */}
                {/* <Link
                  to={`/productdetail/${product.product_id}`}
                  className={styles.productLink}
                > */}

                {/* End of code - Ashlekh on 27-11-2024
                  Reason - To add wishlist icon in bottom of card (while clicking on wishlist icon user was navigating in product detail page) */}
                <div className={styles.gridImageContainer}>
                  {/* Added by Jhamman on 11-10-2024
                    Reason - Added offer logo */}
                  <Link
                    to={`/productdetail/${product.product_id}`}
                    /**Code added by Unnati on 05-12-2024
                     *Reason-Send color through state */
                    state={product.color}
                    /**End of code addition by Unnati on 05-12-2024
                     *Reason-Send color through state */
                  >
                    <div className={`${styles.imageAndOfferLogoContainer}`}>
                      {product.sale_percentage ? (
                        <div className={styles.offerContainer}>
                          <p className={styles.offerPercentage}>
                            {product.sale_percentage}% off
                          </p>
                        </div>
                      ) : null}

                      {/* End of addition by Jhamman on 11-10-2024
                        Reason - Added offer logo */}
                      <img
                        src={`${config.baseURL}${product.image1}`}
                        alt={product.name}
                        className={styles.gridImage}
                      />
                    </div>
                  </Link>
                  <button
                    className={styles.addToCartButton}
                    /**Code added by Unnati on 06-01-2025
                     *Reason-Added on click functionaity */
                    onClick={() =>
                      handleProductModal(product.product_id, product.color)
                    }
                    /**End of code addition by Unnati on 06-01-2025
                     *Reason-Added on click functionaity */
                  >
                    Add to Cart
                  </button>
                </div>
                {/**Code added by Unnati on 06-01-2025
                 *Reason-Added product modal */}
                {showProductModal && selectedItem == product.product_id && (
                  <div
                    className={`${styles.productModalOverlay}`}
                    onClick={closeModal}
                  >
                    <div
                      className={`${styles.productModalContent}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className={`${styles.closeButton}`}
                        onClick={closeModal}
                      >
                        <IoCloseSharp />
                      
                      </button>
                      {/**Code added by Unnati on 23-01-2025
                      *Reason-Added classname */}
                      {/* {selectedProduct?.name} */}
                       <div className={styles.name}> {selectedProduct?.name}</div>
                       {/**End of code addition by Unnati on 23-01-2025
                      *Reason-Added classname */}
                      <div className={styles.saleRate}>
                        {selectedProduct?.sale_percentage ? (
                          <div className={styles.productPrice}>
                            $
                            {calculateDiscountFromProduct(
                              selectedProduct?.sales_rate,
                              selectedProduct?.sale_percentage
                            )}
                          </div>
                        ) : (
                          <div className={styles.productPrice}>
                            ${selectedProduct?.sales_rate}
                          </div>
                        )}
                        {selectedProduct?.sale_percentage ? (
                          <div className={`${styles.cardPrice}`}>
                            <p
                              className={styles.mrpPriceText}
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
                        <div className={styles.productOfferContainer}>
                          <p className={styles.productOfferPercentage}>
                            {selectedProduct?.sale_percentage}% off
                          </p>
                        </div>
                      ) : null}
                      <div className={styles.productColors}>
                        {/**Code added by Unnati on 20-12-2024
                         *Reason-To map product to according to its color*/}
                        {uniqueColors.map((color) => (
                          <div
                            key={color}
                            className={`${styles.colorOption} ${
                              selectedColor === color
                                ? styles.activeColorOption
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
                        <div className={styles.sizeMessage}>
                          <label htmlFor="sizeBoxes">Size</label>

                          <p className={styles.availabilityMessage}>
                            {availabilityMessage}
                          </p>
                        </div>
                      ) : null}
                      {/**Code added by Unnati on 02-01-2025
                       *Reason-Added condition for free size*/}
                      {!selectedProduct?.is_free_size && (
                        <div className={styles.sizeBoxes}>
                          {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map(
                            (size) => (
                              <div
                                key={size}
                                className={`${styles.sizeBox} ${
                                  selectedSize === size
                                    ? styles.selectedSizeBox
                                    : ""
                                } ${
                                  !isSizeAvailable(size)
                                    ? styles.unavailableSizeBox
                                    : ""
                                }`}
                                onClick={() =>
                                  isSizeAvailable(size) &&
                                  handleSelectChange(size)
                                }
                              >
                                {size}
                              </div>
                            )
                          )}
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
                        <h5 className={`${styles.popupContent}`}>
                          Customization Options
                        </h5>
                      ) : null}
                      <div className={styles.checkboxGroup}>
                        {/* Added by - Ashlekh on 16-01-2025
                        Reason - To check condition for logo */}
                        {/* {selectedProduct?.logo_price  */}
                        {selectedProduct?.show_patches_and_embroider_on_UI
                        && (selectedProduct.logo_price)
                        // End of code - Ashlekh on 16-01-2025
                        // Reason - To check condition for logo
                        ? (
                          <label className={styles.reason}>
                            <input
                              type="checkbox"
                              name="logo"
                              checked={formData.logo}
                              onChange={handleChange}
                              // Added by - Ashlekh on 07-03-2025
                              // Reason - To add class name
                              className={`${styles.checkBox}`}
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
                          <label className={styles.reason}>
                            <input
                              type="checkbox"
                              name="patches"
                              checked={formData.patches}
                              onChange={handleChange}
                              // Added by - Ashlekh on 07-03-2025
                              // Reason - To add class name
                              className={`${styles.checkBox}`}
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
                          <label className={styles.reason}>
                            <input
                              type="checkbox"
                              name="security_batches"
                              checked={formData.security_batches}
                              onChange={handleChange}
                              // Added by - Ashlekh on 07-03-2025
                              // Reason - To add class name
                              className={`${styles.checkBox}`}
                              // End of code - Ashlekh on 07-03-2025
                              // Reason - To add class name
                            />{" "}
                            Security id + $
                            {selectedProduct?.security_batches_price}
                          </label>
                        ) : null}
                        {/* Added by - Ashlekh on 20-02-2025
                        Reason - To add customization */}
                        {selectedProduct?.show_patches_and_embroider_on_UI
                        && (selectedProduct.security_id_on_back_price)
                        ? (
                          <label className={styles.reason}>
                            <input
                              type="checkbox"
                              name="security_id_on_back"
                              checked={formData.security_id_on_back}
                              onChange={handleChange}
                              // Added by - Ashlekh on 07-03-2025
                              // Reason - To add class name
                              className={`${styles.checkBox}`}
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
                          <label className={styles.reason}>
                            <input
                              type="checkbox"
                              name="printed_id"
                              checked={formData.printed_id}
                              onChange={handleChange}
                              // Added by - Ashlekh on 07-03-2025
                              // Reason - To add class name
                              className={`${styles.checkBox}`}
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
                          <label className={styles.reason}>
                            <input
                              type="checkbox"
                              name="embroider"
                              checked={formData.embroider}
                              onChange={handleChange}
                              // Added by - Ashlekh on 07-03-2025
                              // Reason - To add class name
                              className={`${styles.checkBox}`}
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
                        <div className={styles.commentBox}>
                          <textarea
                            name="customization_comment"
                            placeholder="Comment"
                            className={styles.commentInput}
                            value={formData.customization_comment}
                            onChange={handleChange}
                          />
                        </div>
                      ) : null}
                       { /**Code added by Unnati on 12-01-2025
                                                      * Reason-To clear message and close popup
                                                      */}
                                                    <p className={styles.availabilityMessage}>{notAvaible}</p>
                                                    { /**End of cdoe addition by Unnati on 12-01-2025
                                                      * Reason-To clear message and close popup
                                                      */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      ></div>
                      <div className={styles.quantityContainer}>
                        {/* Addition by Om Shrivastava on 18-12-2024
                                                            Reason : Add div section  */}
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "center",
                          }}
                        >
                          <div className={styles.quantity}>
                            <label>Qty</label>
                          </div>
                          <div
                            className={styles.quantityInput}
                            onClick={QuantityMessage}
                          >
                            <p
                              className={styles.quantityButton}
                              onClick={handleDecrement}
                            >
                              -
                            </p>
                            <input
                              type="number"
                              inputMode="numeric"
                              className={styles.quantityNumber}
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
                              className={styles.quantityButton}
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
                        <div className={styles.addToCartPhoneView}>
                          <button
                            className={styles.addToCartButton}
                            onClick={handleSubmit}
                          >
                            Add to Cart
                          </button>
                        </div>
                        <p className={styles.availabilityMessage}>
                          {quantityMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {/**End of code adddition by Unnati on 06-01-2025
                 *Reason-Added product modal */}

                <div className={styles.gridContent}>
                  {/* Added by - Ashlekh on 27-11-2024
                    Reason - To add wishlist icon in bottom of card (while clicking on wishlist icon user was navigating in product detail page) */}
                  <Link to={`/productdetail/${product.product_id}`}>
                    {/* End of code - Ashlekh on 27-11-2024
                      Reason - To add wishlist icon in bottom of card (while clicking on wishlist icon user was navigating in product detail page) */}
                    {/* Code changed by - Ashlekh on 28-11-2024
                      Reason - To change h3 to div tag */}
                    {/* <h3 className={styles.brandName}> */}
                    <div className={styles.brandName}>
                      {/**Code added by Unnati on 16-10-2024
                       */}
                      {product.name.length > 40
                        ? `${product.name.substring(0, 40)}...`
                        : product.name}
                      {/* </h3> */}
                    </div>
                    {/* End of code - Ashlekh on 28-11-2024
                      Reason - To change h3 to div tag */}
                  </Link>
                  {/* Added by - Ashlekh on 28-11-2024
                    Reason - To add rating */}
                  <div className={`${styles.rating}`}>
                    {product.rating > 0 && <Rating value={product.rating} />}
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
                  {/* <h4 className={styles.cardTitle}>
                        {product.description.length > 40
                          ? `${product.description.substring(0, 40)}...`
                          : product.description}
                      </h4>
                    </Link> */}
                  {/**End of code addition by Unnati on 16-10-2024
                   */}
                  {/* End of code - Ashlekh on 28-11-2024
                    Reason - To remove description */}
                  {/* Added by - Ashlekh on 27-11-2024
                    Reason - To add wishlist icon in bottom of card (while clicking on wishlist icon user was navigating in product detail page) */}
                  <Link to={`/productdetail/${product.product_id}`}>
                    {/* End of code - Ashlekh on 27-11-2024
                      Reason - To add wishlist icon in bottom of card (while clicking on wishlist icon user was navigating in product detail page) */}
                    {/* Modified by Jhamman on 05-10-2024
                      Reason- calculate sale price */}
                    {/* <p className={styles.cardPrice}>${product.sales_rate}</p> */}

                    <div className={styles.priceContainer}>
                      {product.sale_percentage ? (
                        <div className={styles.cardPrice}>
                          <p className={styles.discountedPriceText}>
                            $
                            {calculateDiscountFromProduct(
                              product.sales_rate,
                              product.sale_percentage
                            )}
                          </p>
                        </div>
                      ) : null}
                      <div className={`${styles.cardPrice}`}>
                        <p
                          className={styles.mrpPriceText}
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
                    {/*Code by Unnati on 17-10-2024
                     *Reason-added star rating
                     */}
                  </Link>
                  <div className={styles.productDetailContainer}>
                    {/* Added by - Ashlekh on 27-11-2024
                      Reason - To display wishlist icon */}
                    {user.id != undefined && (
                      <div className={`${styles.wishListIconContainer}`}>
                        {wishlistStatus[
                          `${product.product_id}-${product.color}`
                        ] ? (
                          <MdFavorite
                            onClick={() => handleToggleWishList(user, product)}
                            className={`${styles.wishListIcon1}`}
                          />
                        ) : (
                          <MdFavoriteBorder
                            onClick={() => handleToggleWishList(user, product)}
                            className={`${styles.wishListIcon2}`}
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
                    {
                      /**Code commented by Unnati on 18-10-2024
                       *Reason-Commented star component*/
                      /* <ReactStars
                                className={styles.star}
                                count={5}
                                value={product.rating}
                                size={15}
                                color2={"#ffd700"}
                                edit={false}
                              /> */
                      /**End of code comment by Unnati on 18-10-2024
                       *Reason-Commented star component*/
                      /**Code added by Unnati on 18-10-2024
                       *Reason-Calling component*/
                      // <Rating value={product.rating} />
                      /**End of code addition by Unnati on 18-10-2024
                       *Reason-Calling component*/
                    }
                    {/* End of code - Ashlekh on 28-11-2024
                           Reason - To remove rating */}
                  </div>
                  {/*End of code addition on 17-10-2024
                   *Reason-added star rating
                   */}
                  {/* End of modification by Jhamman on 05-10-2024
                              Reason- calculate sale price */}
                </div>
                {/* Code commented by - Ashlekh on 27-11-2024
                  Reason - To add wishlist icon in bottom of card (while clicking on wishlist icon user was navigating in product detail page) */}
                {/* </Link> */}
                {/* End of code - Ashlekh on 27-11-2024
                Reason - To add wishlist icon in bottom of card (while clicking on wishlist icon user was navigating in product detail page) */}
              </div>
            ))}
            {/**End of code addition by Unnati on 01-09-2024
             *Reason-To map product details */}
          </div>
        </div>
      </div>
      {scrollDoc()}
    </div>
  );
};

export default SearchResult;
/**End of code addition by Unnati on 01-09-2024
 * Reason-To have search result page
 */
