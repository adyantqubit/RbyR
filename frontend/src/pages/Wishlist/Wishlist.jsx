/**
 * Created by - Ashlekh on 04-11-2024
 * Reason - To create Wishlist page
 */
import React, { useEffect, useState, useContext } from "react";
import wishListStyle from "./wishlist.module.css";
import { GlobalContext } from "../../context/Context";
import NavigationPath from "../../components/NavigationPath/NavigationPath";
import {
  addProductInCartAPI,
  getWishListDetailsAPI,
  removeProductFromWishListAPI,
} from "../../Api/services";
import config from "../../Api/config";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Modal } from "antd";
import notificationObject from "../../components/Widgets/Notification/Notification";
import { calculateDiscountFromProduct } from "../../utils/discountedPrices";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";

const Wishlist = () => {
  const [wishListItems, setWishListItems] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productItems, setProductItems] = useState([]);
  const {
    navigationPath,
    setNavigationPath,
    wishListData,
    setWishListData,
    user,
    setUser,
    cartData,
    setCartData,
  } = useContext(GlobalContext);
  // Added by - Ashlekh on 03-12-2024
  // Reason - Validation message for customization
  const [validationMessage, setValidationMessage] = useState("");
  // End of code - Ashlekh on 03-12-2024
  // Reason - Validation message for customization
  // Added by - Ashlekh on 03-12-2024
  // Reason - useState for storing customized data
  const [formData, setFormData] = useState({
    size: "",
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
  const initialFormData = {
    size: "",
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
  };
  // End of code - Ashlekh on 03-12-2024
  // Reason - useState for storing customized data

  const [sizeSelectionError,setSizeSelectionError]=useState("")

  const [selectedProduct, setSelectedProduct] = useState(null);
  useEffect(() => {
    setNavigationPath([
      { name: "Home", path: "/" },
      { name: "WishList", path: "/wishlist" },
    ]);
  }, [setNavigationPath]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (wishListData?.length > 0) {
      getProductDetails(wishListData);
    }
  }, [wishListData]);
  // Added by - Ashlekh on 04-11-2024
  // Reason - To get product details from backend
  const getProductDetails = async (wishListData) => {
    try {
      const response = await getWishListDetailsAPI(wishListData);
      setWishListItems(response?.matched_products);
    } catch (error) {
      console.error("Error in fetching Details in wishlist: ", error);
    }
  };
  // End of code - Ashlekh on 04-11-2024
  // Reason - To get product details from backend
  const handleMoveToCart = (item) => {
    setProductItems(item);
    setIsModalVisible(true);
    setSelectedProduct(item);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    /**
     * Added by - Ashish Dewangan on 16-12-2024
     * Reason - To reset selections and error on popup close
     */
    setSizeSelectionError("")
    setFormData((prev) => ({
      ...prev,
      size: "",
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
    }));
    /**
     * End of addition by - Ashish Dewangan on 16-12-2024
     * Reason - To reset selections and error on popup close
     */
  };
  // Commented by - Ashlekh on 04-12-2024
  // Reason - This code was used when we were selecting size. After customization we have set size formData
  // const handleSize = async (size) => {
  //   if (user.id != null || user.id != undefined) {
  //     const response = await addProductInCartAPI(
  //       user?.id,
  //       productItems?.product_id,
  //       productItems?.color,
  //       size,
  //       1
  //     );
  //     if (response.cartData && response.wishlist) {
  //       localStorage.setItem("cartData", JSON.stringify(response.cartData));
  //       setCartData(response.cartData);
  //       localStorage.setItem("wishListData", JSON.stringify(response.wishlist));
  //       setWishListData(response.wishlist);
  //       notificationObject.success("Product added to cart successfully");
  //     }
  //   } else {
  //     const wishListData =
  //       JSON.parse(localStorage.getItem("wishListData")) || [];
  //     const updatedWishListData = wishListData.filter(
  //       (item) =>
  //         item.product_id != productItems.product_id ||
  //         item.color != productItems.color
  //     );
  //     localStorage.setItem("wishListData", JSON.stringify(updatedWishListData));
  //     setWishListData(updatedWishListData);
  //     // To update data in cartData localstorage & in context
  //     const cartData = JSON.parse(localStorage.getItem("cartData")) || [];
  //     let itemFound = false;
  //     const updatedCartData = cartData.map((item) => {
  //       if (
  //         item.product == productItems.product_id &&
  //         item.color == productItems.color
  //       ) {
  //         item[size] = (item[size] || 0) + 1;
  //         item.updated_at = Date.now();
  //         itemFound = true;
  //       }
  //       return item;
  //     });
  //     if (!itemFound) {
  //       const newItem = {
  //         L: size == "L" ? 1 : null,
  //         M: size == "M" ? 1 : null,
  //         S: size == "S" ? 1 : null,
  //         XL: size == "XL" ? 1 : null,
  //         XS: size == "XS" ? 1 : null,
  //         XXL: size == "XXL" ? 1 : null,
  //         XXXL: size == "XXXL" ? 1 : null,
  //         color: productItems.color,
  //         created_at: Date.now(),
  //         image1: productItems.image1,
  //         l_embroider: null,
  //         l_patches: false,
  //         m_embroider: false,
  //         m_patches: false,
  //         name: productItems.name,
  //         // product: parseInt(productItems.product_id),
  //         product: productItems.product_id,
  //         s_embroider: false,
  //         s_patches: false,
  //         sales_rate: productItems.sales_rate,
  //         updated_at: Date.now(),
  //         user: null,
  //         xl_embroider: false,
  //         xl_patches: false,
  //         xs_embroider: false,
  //         xs_patches: false,
  //         xxl_embroider: false,
  //         xxl_patches: false,
  //         xxxl_embroider: false,
  //         xxxl_patches: false,
  //       };
  //       updatedCartData.push(newItem);
  //     }

  //     localStorage.setItem("cartData", JSON.stringify(updatedCartData));
  //     setCartData(updatedCartData);
  //   }
  //   // notificationObject.success("Product added to cart successfully");
  //   setIsModalVisible(false);
  //   // Added by - Ashlekh on 09-11-2024
  //   // Reason - To remove last item from UI (when user clicks on move to cart/delete)
  //   if (wishListItems.length == 1) {
  //       setWishListItems([]);
  //       localStorage.setItem("wishListData", JSON.stringify([]));
  //   }
  //   // End of code - Ashlekh on 09-11-2024
  //   // Reason - To remove last item from UI (when user clicks on move to cart/delete)
  // };
  // End of comment - Ashlekh on 04-12-2024
  // Reason - This code was used when we were selecting size. After customization we have set size formData

  const deleteFromWishList = async (item) => {
    if (user.id != null || user.id != undefined) {
      const response = await removeProductFromWishListAPI(
        user?.id,
        item?.product_id,
        item?.color
      );
      localStorage.setItem("wishListData", JSON.stringify(response.wishlist));
      setWishListData(response.wishlist);
      notificationObject.success("Product successfully removed from wishlist");
    }
    // Code commented by - Ashlekh on 04-12-2024
    // Reason - Wishlist is not be displayed for guest user. Below code is for setting wishlist in localstorage
    // else {
    //   const wishListData =
    //     JSON.parse(localStorage.getItem("wishListData")) || [];
    //   const updatedWishListData = wishListData.filter((wishItem) => {
    //     return (
    //       wishItem.product_id != item.product_id || wishItem.color != item.color
    //     );
    //   });

    //   localStorage.setItem("wishListData", JSON.stringify(updatedWishListData));
    //   setWishListData(updatedWishListData);
    //   notificationObject.success("Product successfully removed from wishlist");
    // }
    // End of comment - Ashlekh on 04-12-2024
    // Reason - Wishlist is not be displayed for guest user. Below code is for setting wishlist in localstorage
    // Added by - Ashlekh on 09-11-2024
    // Reason - To remove last item from UI (when user clicks on move to cart/delete)
    if (wishListItems.length == 1) {
      setWishListItems([]);
      localStorage.setItem("wishListData", JSON.stringify([]));
    }
    // End of code - Ashlekh on 09-11-2024
    // Reason - To remove last item from UI (when user clicks on move to cart/delete)
  };
  /**Code added by Unnati on 10-01-2025
   * Reason-To set free size when no size is selected
   */
  useEffect(() => {
    if (selectedProduct?.is_free_size) {
      setFormData((prev) => ({
        ...prev,
        size: "free_size",
      }));
      setSizeSelectionError(""); 
    }
  }, [selectedProduct?.is_free_size]);
    /**End of code addition by Unnati on 10-01-2025
   * Reason-To set free size when no size is selected
   */
  // Added by - Ashlekh on 03-12-2024
  // Reason - To handle checkbox of customization
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // if (type === "checkbox" && checked) {
    //   setValidationMessage("");
    // }
  };
  // End of code - Ashlekh on 03-12-2024
  // Reason - To handle checkbox of customization

  // Added by - Ashlekh on 03-12-2024
  // Reason - To handle customization when user clicks on submit
  const handleCustomizationSubmit = async () => {
    const {
      size,
      customization_comment,
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
    } = formData;
    // Calculation of customization

    /**
     * Modified by - Ashish Dewangan on 16-12-2024
     * Reason - To validate size selection before submit
     */
    // let basePrice = parseFloat(productItems?.sales_rate) || 0;
    //   if (productItems.sale_percentage) {
    //     basePrice =
    //       productItems?.sales_rate -
    //       (productItems?.sales_rate * productItems?.sale_percentage) / 100;
    //   }
    //   if (logo) {
    //     basePrice += parseFloat(productItems.logo_price);
    //   }

    //   if (patches) {
    //     basePrice += parseFloat(productItems.patches_price);
    //   }

    //   if (security_batches) {
    //     basePrice += parseFloat(productItems.security_batches_price);
    //   }

    //   if (embroider) {
    //     basePrice += parseFloat(productItems.embroider_price);
    //   }

    //   let customizationPrice = basePrice;
    //   const formattedCustomizationPrice = isNaN(customizationPrice)
    //     ? "0.00"
    //     : customizationPrice.toFixed(2);
    //   setFormData((prevState) => ({
    //     ...prevState,
    //     after_customization_product_price: formattedCustomizationPrice,
    //     customization_comment,
    //     logo,
    //     patches,
    //     security_batches,
    //     embroider,
    //     logo_price: parseFloat(productItems?.logo_price) || "0.00",
    //     patches_price: parseFloat(productItems?.patches_price) || "0.00",
    //     security_batches_price:
    //       parseFloat(productItems?.security_batches_price) || "0.00",
    //     embroider_price: parseFloat(productItems?.embroider_price) || "0.00",
    //   }));

    //   if (user.id != null || user.id != undefined) {
    //     const response = await addProductInCartAPI(
    //       user?.id,
    //       // productItems?.product_id,
    //       productItems?.id, // This is product row id not product_id
    //       productItems?.color,
    //       size,
    //       1,
    //       (formData.after_customization_product_price =
    //         formattedCustomizationPrice),
    //       formData.customization_comment,
    //       formData.logo,
    //       formData.patches,
    //       formData.security_batches,
    //       formData.embroider
    //     );
    //     setIsModalVisible(false);
    //     setFormData(initialFormData);
    //     if (response.cartData && response.wishlist) {
    //       localStorage.setItem("cartData", JSON.stringify(response.cartData));
    //       setCartData(response.cartData);
    //       localStorage.setItem("wishListData", JSON.stringify(response.wishlist));
    //       setWishListData(response.wishlist);
    //       notificationObject.success("Product added to cart successfully");
    //     }
    //   }
{/**Code added by Unnati on 12-01-2025
  *Reason-Added free size */}
    if(selectedProduct.is_free_size){
      setFormData((prev) => ({
      ...prev,
      size: "free_size",
    }));
    }
    {/**End of code addition by Unnati on 12-01-2025
  *Reason-Added free size */}
  /**Code added by Unnati on 19-01-2025
   * Reason-Added sizes
   */
  const sizes = {
    XS: productItems.XS,
    S: productItems.S,
    M: productItems.M,
    L: productItems.L,
    XL: productItems.XL,
    XXL: productItems.XXL,
    XXXL: productItems.XXXL,
    free_size:productItems.free_size,
  };
  let hasStock = Object.values(sizes).some(stock => stock > 0);
  if (!hasStock) {
    setSizeSelectionError("No stock available.");
    return false;
  }
  /**End of code addition  by Unnati on 19-01-2025
   * Reason-Added sizes
   */
    {/**Code added by Unnati on 10-01-2025
      *Reason-Added condition for free size */}
    if(!selectedProduct.is_free_size && !["XS","S","M","L","XL","XXL","XXXL"].includes(size)){
     {/**End of code addition by Unnati on 10-01-2025
      *Reason-Added condition for free size */}
      setSizeSelectionError("Please select a size")
      
    }else{
      setSizeSelectionError("")
      let basePrice = parseFloat(productItems?.sales_rate) || 0;
      if (productItems.sale_percentage) {
        basePrice =
          productItems?.sales_rate -
          (productItems?.sales_rate * productItems?.sale_percentage) / 100;
      }
      if (logo) {
        basePrice += parseFloat(productItems.logo_price);
      }

      if (patches) {
        basePrice += parseFloat(productItems.patches_price);
      }

      if (security_batches) {
        basePrice += parseFloat(productItems.security_batches_price);
      }

      // Added by - Ashlekh on 20-02-2025
      // Reason - To add customization
      if (security_id_on_back) {
        basePrice += parseFloat(productItems.security_id_on_back_price);
      }
      if (printed_id) {
        basePrice += parseFloat(productItems.printed_id_price);
      }
      // End of code - Ashlekh on 20-02-2025
      // Reason - To add customization

      if (embroider) {
        basePrice += parseFloat(productItems.embroider_price);
      }

      let customizationPrice = basePrice;
      const formattedCustomizationPrice = isNaN(customizationPrice)
        ? "0.00"
        : customizationPrice.toFixed(2);
      setFormData((prevState) => ({
        ...prevState,
        after_customization_product_price: formattedCustomizationPrice,
        customization_comment,
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
        logo_price: parseFloat(productItems?.logo_price) || "0.00",
        patches_price: parseFloat(productItems?.patches_price) || "0.00",
        security_batches_price:
          parseFloat(productItems?.security_batches_price) || "0.00",
          // Added by - Ashlekh on 20-02-2025
          // Reason - To add customization
          security_id_on_back_price: parseFloat(productItems?.security_id_on_back_price) || "0.00",
          printed_id_price: parseFloat(productItems?.printed_id_price) || "0.00",
          // End of code - Ashlekh on 20-02-2025
          // Reason - To add customization
        embroider_price: parseFloat(productItems?.embroider_price) || "0.00",
      }));
      if (user.id != null || user.id != undefined) {
        const response = await addProductInCartAPI(
          user?.id,
          // productItems?.product_id,
          productItems?.id, // This is product row id not product_id
          productItems?.color,
          size,
          1,
          (formData.after_customization_product_price =
            formattedCustomizationPrice),
          formData.customization_comment,
          formData.logo,
          formData.patches,
          formData.security_batches,
          // Added by - Ashlekh on 20-02-2025
          // Reason - To add customization
            formData.security_id_on_back,
            formData.printed_id,
          // End of code - Ashlekh on 20-02-2025
          // Reason - To add customization
          formData.embroider
        );
        setIsModalVisible(false);
        setFormData(initialFormData);
        if (response.cartData && response.wishlist) {
          localStorage.setItem("cartData", JSON.stringify(response.cartData));
          setCartData(response.cartData);
          localStorage.setItem("wishListData", JSON.stringify(response.wishlist));
          setWishListData(response.wishlist);
          notificationObject.success("Product added to cart successfully");
          /**Code added by Unnati on 19-01-2025
           * Reason-To update wishlist as soon as submit button is clicked
           */
          deleteFromWishList(response.matched_products)     
          /**End of code addition by Unnati on 19-01-2025
           * Reason-To update wishlist as soon as submit button is clicked
           */  
         }
      }
    }
    /**
     * End of modification by - Ashish Dewangan on 16-12-2024
     * Reason - To validate size selection before submit
     */

    
  };
  // End of code - Ashlekh on 03-12-2024
  // Reason - To handle customization when user clicks on submit
  return (
    <div className={`${wishListStyle.pageMain}`}>
      <div className={`${wishListStyle.pageContent}`}>
        <NavigationPath navigationPathArray={navigationPath} />
        <div className={`${wishListStyle.title}`}>
          <h2 className={`${wishListStyle.pageHeading}`}>WishList</h2>
        </div>
        {/* Code added by - Ashlekh on 19-11-2024
        Reason - If no data is present in wishList then to display no data found text */}
        {/* Code changed by - Ashlekh on 26-12-2024
        Reason - To change condition */}
        {/* {wishListData?.length > 0 ? ( */}
        {wishListItems?.length > 0 ? (
        // End of code - Ashlekh on 26-12-2024
        // Reason - To change condition
          <div>
            <div className={`${wishListStyle.totalProduct}`}>
              {" "}
              {/* Code changed by - Ashlekh on 26-12-2024
              Reason - To change condition */}
              {/* Total Products: {wishListData?.length} */}
              Total Products: {wishListItems?.length}
              {/* End of code - Ashlekh on 26-12-2024
              Reason - To change condition */}
            </div>
            <div className={`${wishListStyle.tableHeading}`}>
              <div className={`${wishListStyle.productNameHeading}`}>
                Product Detail
              </div>
              <div className={`${wishListStyle.productColorHeading}`}>
                Color
              </div>
              <div className={`${wishListStyle.productPriceHeading}`}>
                Price
              </div>
              {/* Added by - Ashlekh on 29-11-2024
              Reason - To add heading */}
              <div className={`${wishListStyle.buttonHeading}`}> </div>
              {/* End of code - Ashlekh on 29-11-2024
              Reason - To add heading */}
            </div>
            <div className={`${wishListStyle.tableData}`}>
              {wishListItems?.length > 0 && (
                <div className={`${wishListStyle.tableDataContainer}`}>
                  {wishListItems?.map((item, index) => {
                    return (
                      <div key={index}>
                        <div
                          className={`${wishListStyle.tableDataSubContainer}`}
                        >
                          <div
                            className={`${wishListStyle.imageAndNameContainer}`}
                          >
                            {/* Added by - Ashlekh on 20-11-2024
                          Reason - When we click on image then product detail page will open */}
                          <div 
                          className={`${wishListStyle.imageAndButtonContainer}`}
                          // Commented by - Ashlekh on 12-02-2025
                          // Reason - To remove inline css and apply css using class name
                          // style={{display:'flex',flexDirection:'column',alignItems:'center',}}
                          // End of comment - Ashlekh on 12-02-2025
                          // Reason - To remove inline css and apply css using class name
                          >
                            <Link
                              to={
                                item.is_active
                                  ? `/productdetail/${
                                      item.product_id ? item.product_id : ""
                                    }`
                                  : "#"
                              }
                              /**Code added by Unnati on 11-12-2024
                                        *Reason-Send color through state */
                              state={item.color}
                                        /**End of code addition by Unnati on 11-12-2024
                                        *Reason-Send color through state */
                            >
                              {/* End of code - Ashlekh on 20-11-2024
                              Reason - When we click on image then product detail page will open */}
                              <img
                                className={`${wishListStyle.image}`}
                                src={`${config.baseURL}${item.image1}`}
                                alt=""
                              />
                              {/* Added by - Ashlekh on 28-12-2024
                              Reason - If product is inactive then to show message */}
                              {item.is_active ? (
                                ""
                              ):(
                                <p
                                  className={wishListStyle.unavailableMessage}
                                >
                                  Not available
                                </p>
                              )}
                              {/* End of code - Ashlekh on 28-12-2024
                              Reason - If product is inactive then to show message */}
                            </Link>
                            <div className={`${wishListStyle.buttonContainerPhoneView}`}>
                            {/* <div
                              className={`${wishListStyle.deleteButton1}`}
                              onClick={() => deleteFromWishList(item)}
                            >
                              
                            </div> */}

                            <div className={wishListStyle.square}>
                                    <p
                                      className={wishListStyle.squareIcon}
                                      onClick={() => deleteFromWishList(item)}
                                    >
                                      <RiDeleteBin6Fill color="red" />
                                    </p>
                                  </div>
                            <div
                              className={`${wishListStyle.moveToCartContainer1}`}
                              onClick={() => handleMoveToCart(item)}
                            >
                              Move to cart
                            </div>
                          </div> 
                            </div>
                            {/* Added by - Ashlekh on 20-11-2024
                            Reason - When we click on name then product detail page will open */}
                            <Link
                              to={
                                item.is_active
                                  ? `/productdetail/${
                                      item.product_id ? item.product_id : ""
                                    }`
                                  : "#"
                              }
                              /**Code added by Unnati on 11-12-2024
                                        *Reason-Send color through state */
                              state={item.color}
                                        /**End of code addition by Unnati on 11-12-2024
                                        *Reason-Send color through state */
                            >
                              {/* End of code - Ashlekh on 20-11-2024
                              Reason - When we click on name then product detail page will open */}
                              <div
                                className={`${wishListStyle.productNameContainer}`}
                              >
                                {item.name}
                              </div>
                            </Link>
                          </div>
                          <div
                            className={`${wishListStyle.productColorContainer}`}
                          >
                            <div
                              className={`${wishListStyle.productColor}`}
                              style={{ backgroundColor: item.color }}
                            >
                              {/* {item.color} */}
                            </div>
                          </div>
                          <div className={`${wishListStyle.priceContainer}`}>
                            {/* {item.sales_rate} */}
                            {item.sale_percentage ? (
                              <div className={`${wishListStyle.productPrice}`}>
                                $
                                {calculateDiscountFromProduct(
                                  item.sales_rate,
                                  item.sale_percentage
                                )}
                              </div>
                            ) : (
                              <div className={`${wishListStyle.productPrice}`}>
                                ${item.sales_rate}
                              </div>
                            )}
                            <div>
                              {item.sale_percentage ? (
                                <div>
                                  <p className={`${wishListStyle.mrpText}`}>
                                    ${item.sales_rate}
                                  </p>
                                </div>
                              ) : null}
                            </div>
                            <div>
                              {item.sale_percentage ? (
                                <p
                                  className={`${wishListStyle.offerPercentage}`}
                                >
                                  {item.sale_percentage}% off
                                </p>
                              ) : null}
                            </div>
                          </div>
                          {/* Added by - Ashlekh on 29-11-2024
                          Reason - To add remove and move to cart buttons */}
                          <div className={`${wishListStyle.buttonContainer1}`}>
                            <div
                              className={`${wishListStyle.deleteButton1}`}
                              onClick={() => deleteFromWishList(item)}
                            >
                              Remove
                            </div>
                            <div
                              className={`${wishListStyle.moveToCartContainer1}`}
                              onClick={() => handleMoveToCart(item)}
                            >
                              Move to cart
                            </div>
                          </div>
                          {/* End of code - Ashlekh on 29-11-2024
                          Reason - To add remove and move to cart buttons */}
                        </div>
                        {/* Commented by - Ashlekh on 29-11-2024
                        Reason - To hide remove and move to cart button */}
                        {/* <div className={`${wishListStyle.buttonContainer}`}>
                          <div
                            className={`${wishListStyle.deleteButton}`}
                            onClick={() => deleteFromWishList(item)}
                          >
                            Remove
                          </div>
                          <div
                            className={`${wishListStyle.moveToCartContainer}`}
                            onClick={() => handleMoveToCart(item)}
                          >
                            Move to cart
                          </div>
                        </div> */}
                        {/* End of comment - Ashlekh on 29-11-2024
                        Reason - To hide remove and move to cart buttons */}
                        <Modal
                          title=""
                          open={isModalVisible}
                          onCancel={handleModalClose}
                          footer={null}
                        >
                          {selectedProduct && (
                            <div>
                              <div className={wishListStyle.productSizes}>
                                <div className={wishListStyle.sizeMessage}>
                                {/**Code added by Unnati on 10-01-2025
                                *Reason-Added condition for free size */}
                                {!selectedProduct.is_free_size ?
                                  <label htmlFor="sizeBoxes">
                                    Please select size
                                  </label>:null}
                                  {/**End of code addition by Unnati on 10-01-2025
                                *Reason-Added condition for free size */}
                                </div>
                                <form>
                                {/**Code added by Unnati on 10-01-2025
                                *Reason-Added condition for free size */}
                                {!selectedProduct.is_free_size && (
                                  <div className={wishListStyle.sizeBoxes}>
                                    {[
                                      "XS",
                                      "S",
                                      "M",
                                      "L",
                                      "XL",
                                      "XXL",
                                      "XXXL",
                                    ].map((size) => {
                                      // Added by - Ashlekh on 18-11-2024
                                      // Reason - To get quantity of size
                                      const sizeQuantity = productItems[size];
                                      // End of code - Ashlekh on 18-11-2024
                                      // Reason - To get quantity of size
                                      // Added by - Ashlekh on 03-12-2024
                                      // Reason - To check if size is selected or not (If size is selected then will be used for highlighting box)
                                      const isSizeSelected =
                                        formData.size == size;
                                      // End of code - Ashlekh on 03-12-2024
                                      // Reason - To check if size is selected or not (If size is selected then will be used for highlighting box)
                                      return (
                                        <div
                                          key={size}
                                          className={`${
                                            wishListStyle.sizeBox
                                          } ${
                                            sizeQuantity == 0 ||
                                            sizeQuantity == null
                                              ? wishListStyle.disabledSize
                                              : isSizeSelected
                                              ? wishListStyle.selectedSize
                                              : ""
                                          }`}
                                          // Code changed by - Ashlekh on 03-12-2024
                                          // Reason - To set size in formData useState
                                          // onClick={
                                          //   sizeQuantity == 0 || sizeQuantity == null
                                          //     ? null
                                          //     : () => handleSize(size)
                                          // }
                                          onClick={
                                            sizeQuantity == 0 ||
                                            sizeQuantity == null
                                              ? null
                                              : () =>{
                                                  setFormData({
                                                    ...formData,
                                                    size,
                                                  })
                                                  // Added by - Ashish Dewangan on 18-12-2024
                                                  // Reason - To clear validation msg when size is selected
                                                  setSizeSelectionError("")
                                                  // ENd of addition by - Ashish Dewangan on 18-12-2024
                                                  // Reason - To clear validation msg when size is selected
                                                }
                                          }
                                          // End of code - Ashlekh on 03-12-2024
                                          // Reason - To set size in formData useState
                                        >
                                          {size}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                                {/*End of code addition by Unnati on 10-01-2025
                                *Reason-Added condition for free size */}
                                  {/* Added by - Ashish Dewangan on 16-12-2024
                                  * Reason - Added size selection validation message */}
                                  <div className={`${wishListStyle.sizeErrorText}`}>{sizeSelectionError}</div>
                                  {/* End of addition by - Ashish Dewangan on 16-12-2024
                                  * Reason - Added size selection validation message */}
                                  {/* Added by - Ashlekh on 03-12-2024
                                  Reason - To display customization options */}
                                  {selectedProduct.show_patches_and_embroider_on_UI?
                                  <h2
                                    className={`${wishListStyle.popupContent}`}
                                  >
                                    Customization Options
                                  </h2>:null}
                                  {selectedProduct.show_patches_and_embroider_on_UI?
                                  <div className={wishListStyle.checkboxGroup}>
                                    {selectedProduct?.logo_price ? (
                                      <label 
                                        // Added by - Ashlekh on 07-03-2025
                                        // Reason - To add class name
                                        className={`${wishListStyle.reason}`}
                                        // End of code - Ashlekh on 07-03-2025
                                        // Reason - To add class name
                                      >
                                        <input
                                          type="checkbox"
                                          name="logo"
                                          checked={formData.logo}
                                          onChange={handleChange}
                                          // Added by - Ashlekh on 07-03-2025
                                          // Reason - To add class name
                                          className={`${wishListStyle.checkBox}`}
                                          // End of code - Ashlekh on 07-03-2025
                                          // Reason - To add class name
                                        />{" "}
                                        Logo + ${selectedProduct?.logo_price}
                                      </label>
                                    ) : null}
                                    {selectedProduct?.patches_price ? (
                                      <label
                                        // Added by - Ashlekh on 07-03-2025
                                        // Reason - To add class name
                                        className={`${wishListStyle.reason}`}
                                        // End of code - Ashlekh on 07-03-2025
                                        // Reason - To add class name
                                      >
                                        <input
                                          type="checkbox"
                                          name="patches"
                                          checked={formData.patches}
                                          onChange={handleChange}
                                          // Added by - Ashlekh on 07-03-2025
                                          // Reason - To add class name
                                          className={`${wishListStyle.checkBox}`}
                                          // End of code - Ashlekh on 07-03-2025
                                          // Reason - To add class name
                                        />{" "}
                                        Patches / Batches + $
                                        {selectedProduct?.patches_price}
                                      </label>
                                    ) : null}
                                    {selectedProduct?.security_batches_price ? (
                                      <label
                                        // Added by - Ashlekh on 07-03-2025
                                        // Reason - To add class name
                                        className={`${wishListStyle.reason}`}
                                        // End of code - Ashlekh on 07-03-2025
                                        // Reason - To add class name
                                      >
                                        <input
                                          type="checkbox"
                                          name="security_batches"
                                          checked={formData.security_batches}
                                          onChange={handleChange}
                                          // Added by - Ashlekh on 07-03-2025
                                          // Reason - To add class name
                                          className={`${wishListStyle.checkBox}`}
                                          // End of code - Ashlekh on 07-03-2025
                                          // Reason - To add class name
                                        />{" "}
                                        {/* Code changed by - Ashlekh on 18-02-2025
                                        Reason - To change customization name */}
                                        {/* Security id + $ */}
                                        Security ID on Back and Chest + $
                                        {/* End of code - Ashlekh on 18-02-2025
                                        Reason - To change customization name */}
                                        {
                                          selectedProduct?.security_batches_price
                                        }
                                      </label>
                                    ) : null}
                                    {/* Added by - Ashlekh on 20-02-2025
                                    Reason - To add customization */}
                                    {selectedProduct?.security_id_on_back_price ? (
                                      <label
                                        // Added by - Ashlekh on 07-03-2025
                                        // Reason - To add class name
                                        className={`${wishListStyle.reason}`}
                                        // End of code - Ashlekh on 07-03-2025
                                        // Reason - To add class name
                                      >
                                        <input
                                          type="checkbox"
                                          name="security_id_on_back"
                                          checked={formData.security_id_on_back}
                                          onChange={handleChange}
                                          // Added by - Ashlekh on 07-03-2025
                                          // Reason - To add class name
                                          className={`${wishListStyle.checkBox}`}
                                          // End of code - Ashlekh on 07-03-2025
                                          // Reason - To add class name
                                        />{" "}
                                        Security ID on Back + $
                                        {
                                          selectedProduct?.security_id_on_back_price
                                        }
                                      </label>
                                    ) : null}
                                    {selectedProduct?.printed_id_price ? (
                                      <label
                                        // Added by - Ashlekh on 07-03-2025
                                        // Reason - To add class name
                                        className={`${wishListStyle.reason}`}
                                        // End of code - Ashlekh on 07-03-2025
                                        // Reason - To add class name
                                      >
                                        <input
                                          type="checkbox"
                                          name="printed_id"
                                          checked={formData.printed_id}
                                          onChange={handleChange}
                                          // Added by - Ashlekh on 07-03-2025
                                          // Reason - To add class name
                                          className={`${wishListStyle.checkBox}`}
                                          // End of code - Ashlekh on 07-03-2025
                                          // Reason - To add class name
                                        />{" "}
                                        Printed ID + $
                                        {
                                          selectedProduct?.printed_id_price
                                        }
                                      </label>
                                    ) : null}
                                    {/* End of code - Ashlekh on 20-02-2025
                                    Reason - To add customization */}
                                    {selectedProduct?.embroider_price ? (
                                      <label
                                        // Added by - Ashlekh on 07-03-2025
                                        // Reason - To add class name
                                        className={`${wishListStyle.reason}`}
                                        // End of code - Ashlekh on 07-03-2025
                                        // Reason - To add class name
                                      >
                                        <input
                                          type="checkbox"
                                          name="embroider"
                                          checked={formData.embroider}
                                          onChange={handleChange}
                                          // Added by - Ashlekh on 07-03-2025
                                          // Reason - To add class name
                                          className={`${wishListStyle.checkBox}`}
                                          // End of code - Ashlekh on 07-03-2025
                                          // Reason - To add class name
                                        />{" "}
                                        {/* Code changed by - Ashlekh on 13-12-2024
                                          Reason - To change name */}
                                        {/* Embroider / Name + $ */}
                                        Embroider + $
                                        {/* End of code - Ashlekh on 13-12-2024
                                        Reason - To change name */}
                                        {selectedProduct?.embroider_price}
                                      </label>
                                    ) : null}
                                  </div>:null}
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
                                  {selectedProduct.show_patches_and_embroider_on_UI?
                                  <div className={wishListStyle.commentBox}>
                                    <textarea
                                      name="customization_comment"
                                      placeholder="Comment"
                                      className={wishListStyle.commentInput}
                                      value={formData.customization_comment}
                                      onChange={handleChange}
                                    />
                                  </div>:null}
                                  
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <button
                                      type="button"
                                      onClick={handleCustomizationSubmit}
                                      className={wishListStyle.submitButton}
                                    >
                                      Submit
                                    </button>
                                  </div>
                                  {/* End of code - Ashlekh on 03-12-2024
                                    Reason - To display customization options */}
                                </form>
                              </div>
                            </div>
                          )}
                        </Modal>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className={`${wishListStyle.noDataFoundText}`}>
            {" "}
            No items in wishlist
          </p>
        )}
        {/* End of code - Ashlekh on 19-11-2024
        Reason - If no data is present in wishlist then to hide no data found text */}
      </div>
    </div>
  );
};
export default Wishlist;
