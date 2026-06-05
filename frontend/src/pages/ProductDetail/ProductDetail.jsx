
import React, { useEffect, useState, useRef, useContext, useMemo } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import ProductDetailStyle from "./ProductDetail.module.css";
import {
  addToCart,
  getProductDetail,
  checkIfProductExistsInCart,
  updateCart,
  addToWishListAPI,
  updateCustomizationCommentAPI,
  removeProductFromWishListAPI,
  postFeedBackDetailsAPI,
  getProductDetails,
} from "../../Api/services";
import config from "../../Api/config";
import parse from "html-react-parser";
import { Swiper, SwiperSlide } from "swiper/react";
import "./swiper.css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Context, { GlobalContext } from "../../context/Context";
import {
  checkIsEmailInvalid,
  checkIsEmpty,
  checkIsNotADigit,
} from "../../utils/validations";
import notificationObject from "../../components/Widgets/Notification/Notification";
import { FaWindowClose } from "react-icons/fa";
import InnerImageZoom from "react-inner-image-zoom";
import "./styles.css";
import { calculateDiscountFromProduct } from "../../utils/discountedPrices";
import { Modal } from "antd";
import { Pagination } from "swiper/modules";
import ReactStars from "react-stars";
import Rating from "../../components/Rating/Rating";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import NavigationPath from "../../components/NavigationPath/NavigationPath";
// import { Autoplay } from "swiper/modules";
import ImageZoom from "react-image-zooom";
import { IoCloseSharp } from "react-icons/io5";
import { Rate } from "antd";
import "antd/dist/reset.css";
import SimpleMagnifier from "./SimpleMagnifier";
import CartDrawer from "./CartDrawer";

const ACCORDION_FIELD_CONFIG = [
  { key: "description", label: "Description" },
  { key: "details", label: "Details", isHtml: true },
  { key: "shipping_days", label: "Shipping Days" },
  { key: "category", label: "Category" },
  { key: "is_ready_to_ship", label: "Shipping Information", isBoolean: true },
];

const hasAccordionFieldValue = (key, value, isBoolean = false) => {
  if (value === null || value === undefined || value === "") return false;
  if (isBoolean && value === false) return false;
  if (typeof value === "string" && value.trim() === "") return false;
  return true;
};

const formatAccordionValue = (key, value, isBoolean = false) => {
  if (isBoolean) {
    if (key === "is_ready_to_ship") return "This product is ready to ship.";
    return String(value);
  }
  if (key === "shipping_days") {
    return `Get it within ${value} days`;
  }
  return value;
};

const getProductAccordionSections = (product) => {
  if (!product || typeof product !== "object") return [];

  return ACCORDION_FIELD_CONFIG.filter(({ key, isBoolean }) =>
    hasAccordionFieldValue(key, product[key], isBoolean)
  ).map(({ key, label, isHtml, isBoolean }) => ({
    key,
    label,
    value: formatAccordionValue(key, product[key], isBoolean),
    isHtml: !!isHtml,
  }));
};

const ProductDetail = () => {
  /**Code added by Unnati Bajaj on 23-06-2024
   * Reason -To scroll to the top when component loads
   */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  /**End of code addition by Unnati Bajaj on 23-06-2024
   * Reason -To scroll to the top when component loads
   */
  const swiperRef = useRef(null);
  const { identifier } = useParams();

  const [isDrawerOpen, setDrawerOpen] = React.useState(false);

  const [products, setProducts] = useState([]);
  // const [selectedColor, setSelectedColor] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [availableSizes, setAvailableSizes] = useState({});
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedProductDetails, setSelectedProductDetails] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [quantityMessage, setQuantityMessage] = useState("");
  const [colorError, setColorError] = useState("");
  const [sizeError, setSizeError] = useState("");
  const [patchSelection, setPatchSelection] = useState("");
  const [embroiderSelection, setEmbroiderSelection] = useState("");
  // Addition by Om Shrivastava on 02-12-2024
  // Reason : Create useState of all customization checkboxes
  const [validationMessage, setValidationMessage] = useState("");
  // End of addition by Om Shrivastava on 02-12-2024
  // Reason : Create useState of all customization checkboxes

  // Added by - Ashlekh on 01-01-2025
  // Reason - Created various useState for feedback
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [feedBackContent, setFeedBackContent] = useState("");
  const [feedBackContentError, setFeedBackContentError] = useState("");
  const [rating, setRating] = useState(4);
  // End of code - Ashlekh on 01-01-2025
  // Reason - Created various useState for feedback
  // Added by - Ashlekh on 02-01-2025
  // Reason - useState to store average rating, feedback data & feedback data count
  const [averageRating, setAverageRating] = useState(0);
  const [feedBackData, setFeedBackData] = useState([]);
  const [feedBackDataCount, setFeedBackDataCount] = useState(0);
  // End of code - Ashlekh on 02-01-2025
  // Reason - useState to store average rating, feedback data & feedback data count
  // Added by - Ashlekh on 04-01-2025
  // Reason - useState to check if feedback is already given (from user)
  const [emailValidationError, setEmailValidationError] = useState("");
  // End of code - Ashlekh on 04-01-2025
  // Reason - useState to check if feedback is already given (from user)
  // Added by - Ashlekh on 14-01-2025
  // Reason - Usestate for storing feedbacks of different star rating
  const [totalFiveStarRating, setTotalFiveStarRating] = useState();
  const [totalFourStarRating, setTotalFourStarRating] = useState();
  const [totalThreeStarRating, setTotalThreeStarRating] = useState();
  const [totalTwoStarRating, setTotalTwoStarRating] = useState();
  const [totalOneStarRating, setTotalOneStarRating] = useState();
  // End of code - Ashlekh on 14-01-2025
  // Reason - Usestate for storing feedbacks of different star rating
  const {
    refreshCartData,
    setCartData,
    // Added by - Ashlekh on 05-10-2024
    // Reason - To use sizeChart variable from context
    sizeChart,
    setSizeChart,
    // End of code - Ashlekh on 05-10-2024
    // Reason - To use sizeChart variable from context
    // Added by - Ashlekh on 04-11-2024
    // Reason - To add wishlist variable from Context
    wishListData,
    setWishListData,
    // End of code - Ashlekh on 04-11-2024
    // Reason - To add wishlist variable from Context
    settingInfo
  } = useContext(GlobalContext);
  const { user } = useContext(GlobalContext);
  const navigate = useNavigate();
  const images = [
    selectedProductDetails.image1,
    selectedProductDetails.image2,
    selectedProductDetails.image3,
    selectedProductDetails.image4,
    selectedProductDetails.image5,
  ].filter(Boolean);

  const accordionSections = useMemo(
    () => getProductAccordionSections(selectedProductDetails),
    [selectedProductDetails]
  );

  const toggleAccordionSection = (key) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    setExpandedSections({});
  }, [selectedProductDetails.id]);

  // Added by - Ashlekh on 05-10-2024
  // Reason - To display size chart in antd modal and to have useState for similar product
  const [similarProduct, setSimilarProduct] = useState([]);
  const [sizeChartVisible, setSizeChartVisible] = useState(false);
  const showSizeChart = () => {
    setSizeChartVisible(true);
  };
  const handleCancel = () => {
    setSizeChartVisible(false);
  };
  // End of code - Ashlekh on 05-10-2024
  // Reason - To display size chart in antd modal and to have useState for similar product
  // Addition by Om Shrivastava on 18-11-2024
  // Reason : Apply the customization popup functinality
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [product, setProduct] = useState([]);
  /**
   * Modified by - Ashish Dewangan on 16-12-2024
   * Reason - To validate size before opening customization popup
   */
  // const openPopup = () => setIsPopupOpen(true);
  const openPopup = () => {
    if (isValidOnSubmit()) setIsPopupOpen(true);
  };
  /**
   * End of modification by - Ashish Dewangan on 16-12-2024
   * Reason - To validate size before opening customization popup
   */

  // const closePopup = () => setIsPopupOpen(false);
  const closePopup = () => {
    setIsPopupOpen(false);
    setFormData((prevState) => ({
      ...prevState,
      logo: false,
      patches: false,
      security_batches: false,
      // Added by - Ashlekh on 19-02-2025
      // Reason - To add customization
      security_id_on_back: false,
      printed_id: false,
      // End of code - Ashlekh on 19-02-2025
      // Reason - To add customization
      embroider: false,
      customization_comment: "",
      logo_price: "",
      patches_price: "",
      security_batches_price: "",
      // Added by - Ashlekh on 19-02-2025
      // Reason - To add customization price
      security_id_on_back_price: "",
      printed_id_price: "",
      // End of code - Ashlekh on 19-02-2025
      // Reason - To add customization price
      embroider_price: "",
      after_customization_product_price: "",
    }));
  };
  /**Code added by Unnati on 28-11-2024
   * Reason-To get color through location
   */
  const location = useLocation();
  const color = location.state;
  /**End of code addition by Unnati on 28-11-2024
   * Reason-To get color through location
   */
  const [showProductModal, setShowProductModal] = useState(false);
  const { showModal, setShowModal } = useContext(GlobalContext);
  // Addition by Om Shrivastava on 20-11-2024
  // Reason : Add the logic for posting the comment and customised price
  const [formData, setFormData] = useState({
    logo: false,
    patches: false,
    security_batches: false,
    // Added by - Ashlekh on 19-02-2025
    // Reason - To add customization
    security_id_on_back: false,
    printed_id: false,
    // End of code - Ashlekh on 19-02-2025
    // Reason - To add customization
    embroider: false,
    customization_comment: "",
    logo_price: "",
    patches_price: "",
    security_batches_price: "",
    // Added by - Ashlekh on 19-02-2025
    // Reason - To add customization price
    security_id_on_back_price: "",
    printed_id_price: "",
    // End of code - Ashlekh on 19-02-2025
    // Reason - To add customization price
    embroider_price: "",
    after_customization_product_price: "",
  });
  // const { comment } = formData;
  /** code addition by Unnati on 06-01-2025
   * Reason-To close modal
   */
  const closeModal = () => {
    // setShowProductModal(false);
  };
  /**End of code addition by Unnati on 06-01-2025
   * Reason-To close modal
   */
  // Handle checkbox and input changes
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Addition by Om Shrivastava on 02-12-2024
    // Reason : Remove validation message if any checkbox is selected
    if (type === "checkbox" && checked) {
      setValidationMessage("");
    }
    // End of addition by Om Shrivastava on 02-12-2024
    // Reason : Remove validation message if any checkbox is selected
  };

  const handleCustomizationSubmit = async () => {
    const {
      customization_comment,
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
    } = formData;

    // if (!logo && !patches && !security_batches && !embroider) {
    if (!logo && !patches && !security_batches && !security_id_on_back && !printed_id && !embroider) {
      setValidationMessage("Please select checkbox to customize");
      return;
    }
    setValidationMessage("");
    // Modification and addition by Om Shrivastava on 21-11-2024
    // Reason : Save the value
    const calculateDiscountFromProduct = (salesRate, salePercentage) => {
      return salesRate - (salesRate * salePercentage) / 100;
    };
    // Addition by Om Shrivastava on 01-12-2024
    // Reason : Add the customization calculation
    let basePrice = parseFloat(selectedProductDetails?.sales_rate) || 0;

    if (selectedProductDetails.sale_percentage) {
      basePrice =
        selectedProductDetails?.sales_rate -
        (selectedProductDetails?.sales_rate *
          selectedProductDetails?.sale_percentage) /
        100;
    }
    if (logo) {
      basePrice += parseFloat(selectedProductDetails.logo_price);
    }

    if (patches) {
      basePrice += parseFloat(selectedProductDetails.patches_price);
    }

    if (security_batches) {
      basePrice += parseFloat(selectedProductDetails.security_batches_price);
    }

    // Added by - Ashlekh on 19-02-2025
    // Reason - To calculate customization field price
    if (security_id_on_back) {
      basePrice += parseFloat(selectedProductDetails.security_id_on_back_price);
    }

    if (printed_id) {
      basePrice += parseFloat(selectedProductDetails.printed_id_price);
    }
    // End of code - Ashlekh on 19-02-2025
    // Reason - To calculate customzation field price
    if (embroider) {
      basePrice += parseFloat(selectedProductDetails.embroider_price);
    }

    // const salesRate = selectedProductDetails?.sale_percentage
    //   ? calculateDiscountFromProduct(
    //       parseFloat(selectedProductDetails.sales_rate),
    //       parseFloat(selectedProductDetails.sale_percentage)
    //     )
    //   : parseFloat(selectedProductDetails?.sales_rate) || 0;

    // const salesRate = selectedProductDetails?.sale_percentage
    //   ? calculateDiscountFromProduct(
    //       basePrice,
    //       parseFloat(selectedProductDetails.sale_percentage)
    //     )
    //   : basePrice;
    // End of addition by Om Shrivastava on 01-12-2024
    // Reason : Add the customization calculation

    let customizationPrice = basePrice;

    // if (logo) {
    //   customizationPrice += parseFloat(selectedProductDetails?.logo_price) || 0;
    // }
    // if (patches) {
    //   customizationPrice += parseFloat(selectedProductDetails?.patches_price) || 0;
    //   console.log(customizationPrice,'patchess')
    // }
    // if (security_batches) {
    //   customizationPrice += parseFloat(selectedProductDetails?.security_batches_price) || 0;
    //   console.log(customizationPrice,'sequirty')

    // }
    // if (embroider) {
    //   customizationPrice += parseFloat(selectedProductDetails?.embroider_price) || 0;
    //   console.log(customizationPrice,'embridere')

    // }

    // customizationPrice = parseFloat(customizationPrice);

    // Force it to be a number

    const formattedCustomizationPrice = isNaN(customizationPrice)
      ? "0.00"
      : customizationPrice.toFixed(2);

    // Modification and addition by Om Shrivastava on 01-12-2024
    // Reason : Remove the API save only state
    // // Prepare the data to be sent
    // const postData = {
    //   id: selectedProductDetails?.id,
    //   customization_comment: comment,
    //   logo,
    //   patches,
    //   security_batches: security_batches,
    //   embroider,
    //   after_customization_product_price: formattedCustomizationPrice,
    // };

    // console.log(postData);

    // try {
    //   const response = await updateCustomizationCommentAPI(postData);
    //   console.log("Customization saved successfully:", response);
    //   notificationObject.success("Customization options saved!");
    //   closePopup();
    // } catch (error) {
    //   console.error("Error saving customization:", error.message);
    //   // alert("Failed to save customization. Please try again.");
    // }
    setFormData((prevState) => ({
      ...prevState,
      after_customization_product_price: formattedCustomizationPrice,
      customization_comment,
      logo,
      patches,
      security_batches,
      // Added by - Ashlekh on 19-02-2025
      // Reason - To set customization in formData
      security_id_on_back,
      printed_id,
      // End of code - Ashlekh on 19-02-2025
      // Reason - To set customization in formData
      embroider,
      logo_price: parseFloat(selectedProductDetails?.logo_price) || "0.00",
      patches_price:
        parseFloat(selectedProductDetails?.patches_price) || "0.00",
      security_batches_price:
        parseFloat(selectedProductDetails?.security_batches_price) || "0.00",
      // Added by - Ashlekh on 19-02-2025
      // Reason - To set customization price in formData
      security_id_on_back_price:
        parseFloat(selectedProductDetails?.security_id_on_back_price) || "0.00",
      printed_id_price:
        parseFloat(selectedProductDetails?.printed_id_price) || "0.00",
      // End of code - Ashlekh on 19-02-2025
      // Reason - To set customization price in formData
      embroider_price:
        parseFloat(selectedProductDetails?.embroider_price) || "0.00",
    }));

    notificationObject.success("Customization details are saved successfully.");
    /**
     * Modified by - Ashish Dewangan on 16-12-2024
     * Reason - To close popup without calling close method
     */
    // closePopup();
    setIsPopupOpen(false);
    /**
     * End of modification by - Ashish Dewangan on 16-12-2024
     * Reason - To close popup without calling close method
     */

    // Added by Om Shrivastava on 03-12-2024
    // Reason : Change the selected size
    /**
     * Commented by - Ashish Dewangan on 06-12-2024
     * Reason - size should not be reset on customization submit
     */
    // setSelectedSize("")
    /**
     * End of comment by - Ashish Dewangan on 06-12-2024
     * Reason - size should not be reset on customization submit
     */
    // End of addition by Om Shrivastava on 03-12-2024
    // Reason : Change the selected size
    // End of modification and addition by Om Shrivastava on 01-12-2024
    // Reason : Remove the API save only state
  };
  // End of modification and addition by Om Shrivastava on 21-11-2024
  // Reason : Save the value
  // End of addition by Om Shrivastava on 20-11-2024
  // Reason : Add the logic for posting the comment and customised price
  // End of addition by Om Shrivastava on 18-11-2024
  // Reason : Apply the customization popup functinality
  /**Code added by Unnati on 06-01-2025
   * Reason-To handle product modal
   */
  const handleProductModal = async (product_id, color) => {
    // setShowProductModal(true);
    setShowModal(true);
    setSelectedItem(product_id);
    // const response = await getProductDetails(product_id, color);
    // setProducts(response.products);
    // const distintColor = [
    //   ...new Set(response.products.map((product) => product.color)),
    // ];

    // if (distintColor.length > 0) {
    //   setSelectedColor(distintColor[0]);
    // }
    // if (response.products.length > 0) {
    //   const sizes = {
    //     XS: response.products[0].XS,
    //     S: response.products[0].S,
    //     M: response.products[0].M,
    //     L: response.products[0].L,
    //     XL: response.products[0].XL,
    //     XXL: response.products[0].XXL,
    //     XXXL: response.products[0].XXXL,
    //     free_size: response.products[0].free_size,
    //   };
    //   setAvailableSizes(sizes);
    //   setSelectedProduct(response.products[0]);
    // }
    // if (selectedProduct?.is_free_size) {
    //   setSelectedSize("free_size");
    //   handleSelectChange("free_size");
    // }
  };
  /**End of code addition by Unnati on 06-01-2025
   * Reason-To handle product modal
   */
  /**Code added by Unnati on 03-04-2024
   * Reason-To handle change when size is selected
   */
  const handleSelectChange = (size) => {
    setSelectedSize(size);
    setQuantityMessage("");
    setQuantity(1);
    const stock = availableSizes[size];
    updateAvailabilityMessage(size, stock);
    /**Code added by Unnati on 25-10-2024
     * Reason-To set error message as empty on change
     */
    setSizeError("");
    /*End of code addition by Unnati on 25-10-2024
     * Reason-To set error message as empty on change
     */

    /**
     * Added by - Ashish Dewangan on 06-12-2024
     * Reason - To reset customization on size change
     */
    setFormData((prev) => ({
      ...prev,
      logo: false,
      patches: false,
      security_batches: false,
      // Added by - Ashlekh on 19-02-2025
      // Reason - To add customization
      security_id_on_back: false,
      printed_id: false,
      // End of code - Ashlekh on 19-02-2025
      // Reason - To add customization
      embroider: false,
      logo_price: "",
      patches_price: "",
      security_batches_price: "",
      // Added by - Ashlekh on 19-02-2025
      // Reason - To add customization price
      security_id_on_back_price: "",
      printed_id_price: "",
      // End of code - Ashlekh on 19-02-2025
      // Reason - To add customization price
      embroider_price: "",
      after_customization_product_price: "",
      customization_comment: "",
    }));
    /**
     * End of addition by - Ashish Dewangan on 06-12-2024
     * Reason - To reset customization on size change
     */
  };

  /**End of code addition by Unnati on 03-04-2024
   * Reason-To handle change when size is selected
   */

  /**Code commented by Unnati on 01-07-2024
   * Reason-To handle previous click in image slider(It is not used currently)
   */
  // const handlePreviousClick = () => {
  //   setCurrentImageIndex(
  //     (prevIndex) => (prevIndex - 1 + images.length) % images.length
  //   );
  // };
  /**End of code addition by Unnati on 01-07-2024
   * Reason-To handle previous click in image slider(It is not used currently)
   */
  /**Code commented by Unnati on 01-07-2024
   * Reason-To handle previous click in image slider(It is not used currently)
   */
  // const handleNextClick = () => {
  //   setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  // };
  /**End of code comment by Unnati on 01-07-2024
   * ReasonTo handle previous click in image slider(It is not used currently)
   */
  /**Code added by Unnati on 01-07-2024
   * Reason-To handle increment while entering quantity
   */
  const handleQtyIncrement = () => {
    /**Code added by Unnati on 02-01-2024
     * Reason-Added one more condition for free size
     */
    // if (!selectedSize) {
    if (!selectedSize && !selectedProductDetails.is_free_size) {
      /**End of code addition by Unnati on 02-01-2024
       * Reason-Added one more condition for free size
       */
      setQuantityMessage("Please select a size before adjusting the quantity.");
      return;
    }
    /**Code added by Unnati on 02-01-2024
     * Reason-Added free size
     */
    if (selectedProductDetails.is_free_size) {
      setSelectedSize("free_size");
    }
    /**End of code addition by Unnati on 02-01-2024
     * Reason-Added free size
     */
    setAvailabilityMessage("");
    const stock = availableSizes[selectedSize];
    if (quantity < stock) {
      setQuantity(quantity + 1);
      setQuantityMessage(" ");
    } else {
      setQuantityMessage(`Only ${stock} items available in ${selectedSize}.`);
    }
  };
  /**End of code addition by Unnati on 01-07-2024
   * Reason-To handle increment while entering quantity
   */
  /**Code added by Unnati on 01-07-2024
   * Reason-To handle decrement while entering quantity
   */
  const handleQtyDecrement = () => {
    if (!selectedSize) {
      setQuantityMessage("Please select a size before selecting the quantity.");
      return;
    }
    setAvailabilityMessage("");
    if (quantity > 1) {
      setQuantity(quantity - 1);
      QuantityMessage(selectedSize, availableSizes[selectedSize]);
    }
    // Added by - Ashlekh on 16-12-2024
    // Reason - To display message, for quantity less than 1
    else {
      setQuantityMessage("Quantity cannot be less than 1");
    }
    // End of code - Ashlekh on 16-12-2024
    // Reason - To display message, for quantity less than 1
  };
  /**End of code addition by Unnati on 01-07-2024
   * Reason-To handle decrement while entering quantity
   */
  /**Code commented by Unnati on 23-06-2024
   * Reason-Previously used to handle thumbnail picture click
   */
  // const handleThumbnailClick = (image) => {
  //   setLargeImage(image);
  //   setActiveThumbnail(image);
  // };
  /**End of code comment by Unnati on 23-06-2024
   * Reason-Previously used to handle thumbnail picture click
   */
  /**Code added by Unnati on 03-04-2024
   * Reason-To add slider functionality
   */
  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(currentImageIndex);
    }
  }, [currentImageIndex]);
  /**End of code addition by Unnati on 03-04-2024
   * Reason-To add slider functionality
   */

  /**Code added by Unnati Bajaj on 23-06-2024
   * Reason -To get products when the component loads
   */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let fetchedProducts;
        const response = await getProductDetail(
          identifier,
          /**Code added by Unnati on 28-11-2024
           * Reason-Added color
           */
          color
        );
        /**End of code addition by Unnati on 28-11-2024
         * Reason-Added color
         */
        /**Code modified by Unnati on 28-11-2024
         * Reason-Modified fetched products
         */
        // fetchedProducts = response.product;
        fetchedProducts = response.product.product_list;
        /**End of code modification by Unnati on 28-11-2024
         * Reason-Modified fetched products
         */

        setProducts(fetchedProducts);
        // Added by - Ashlekh on 05-10-2024
        // Reason - To set similar product
        setSimilarProduct(response?.similar_product);
        // End of code - Ashlekh on 05-10-2024
        // Reason - To set similar product
        /**Code added by Unnati on 23-06-2024
         * Reason-To initialise the fields when redirected to this product detail page
         */
        // Added by - Ashlekh on 02-01-2025
        // Reason - To set average rating, feedback data & feedback data count from response
        setAverageRating(response?.average_rating);
        setFeedBackData(response?.feedback_data);
        setFeedBackDataCount(response?.feedback_data_count);
        // End of code - Ashlekh on 02-01-2025
        // Reason - To set average rating, feedback data & feedback data count from response
        // Added by - Ashlekh on 14-01-2025
        // Reason - To set count of ratings (1 to 5)
        setTotalFiveStarRating(response?.total_five_star_rating);
        setTotalFourStarRating(response?.total_four_star_rating);
        setTotalThreeStarRating(response?.total_three_star_rating);
        setTotalTwoStarRating(response?.total_two_star_rating);
        setTotalOneStarRating(response?.total_one_star_rating);
        // End of code - Ashlekh on 14-01-2025
        // Reason - To set count of ratings (1 to 5)
        if (fetchedProducts?.length > 0) {
          setSelectedColor(fetchedProducts[0].color);
          setSelectedProductDetails(fetchedProducts[0]);
          const sizes = {
            XS: fetchedProducts[0].XS,
            S: fetchedProducts[0].S,
            M: fetchedProducts[0].M,
            L: fetchedProducts[0].L,
            XL: fetchedProducts[0].XL,
            XXL: fetchedProducts[0].XXL,
            XXXL: fetchedProducts[0].XXXL,
            /**Code added by Unnati on 30-12-2024
             * Reason-Added free size
             */
            free_size: fetchedProducts[0].free_size,
            /**End of code addition by Unnati on 30-12-2024
             * Reason-Added free size
             */
          };
          setAvailableSizes(sizes);
          /*Code commented  by Unnati on 23-06-2024
           *Reason-This code is not in use currently
           */
          // setLargeImage(fetchedProducts[0].image1);
          // setActiveThumbnail(fetchedProducts[0].image1);

          // const productThumbnails = fetchedProducts.map((product) => ({
          //   image: product.image1,
          //   color: product.color,
          // }));
          // setThumbnails(productThumbnails);
          /*End of code commented  by Unnati on 23-06-2024
           *Reason-This code is not in use currently
           */
        } else {
          /**
           * Added by - Ashish Dewangan on 19-12-2024
           * Reason - To navigate to home page if product is not available
           */
          navigate("/");
        }
        /**
         * End of addition by - Ashish Dewangan on 19-12-2024
         * Reason - To navigate to home page if product is not available
         */

        /**End of code addition by Unnati on 23-06-2024
         * Reason-To initialise the product when redirected to this product detail page
         */
      } catch (error) {
        console.error("Error fetching product:", error.message);
      }
    };

    fetchProduct();
  }, [
    identifier,
    /**Code added by Unnati on 28-11-2024
     * Reason-To have color
     */
    color,
  ]);
  /**End of code addition by Unnati on 28-11-2024
   * Reason-To have color
   */
  /**End of code addition by Unnati Bajaj on 23-06-2024
   * Reason -To get products when the component loads
   */
  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     try {
  //       // Check if the user came from the View Cart page
  //       if (location.state?.from === 'viewCart') {
  //         const response = await editProductDetail(identifier);
  //         setProducts(response.product)
  //       }
  //     } catch (error) {
  //       console.error("Error fetching product:", error.message);
  //     }
  //   };

  //   fetchProduct();
  // }, [identifier, location.state]);
  /**Code added by Unnati on 23-06-2024
   *Reason-To select color and show the available sizes
   */
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const selectedProduct = products.find((product) => product.color === color);
    setSelectedProductDetails(selectedProduct);
    const sizes = {
      XS: selectedProduct.XS,
      S: selectedProduct.S,
      M: selectedProduct.M,
      L: selectedProduct.L,
      XL: selectedProduct.XL,
      XXL: selectedProduct.XXL,
      XXXL: selectedProduct.XXXL,
      // Added by - Ashlekh on 10-02-2025
      // Reason - To add free_size
      free_size: selectedProduct.free_size,
      // End of code - Ashlekh on 10-02-2025
      // Reason - To add free_size
    };

    setAvailableSizes(sizes);

    if (selectedSize) {
      const stock = sizes[selectedSize];
      updateAvailabilityMessage(selectedSize, stock);
      /**Code added by Unnati on 24-08-2024
       * Reason-Added quantity message
       */
      QuantityMessage(selectedSize, stock);
      /**End of code addition by Unnati on 24-08-2024
       * Reason-Added quantity message
       */
    }

    /**
     * Added by - Ashish Dewangan on 06-12-2024
     * Reason - To unselect size and customization on color change
     */
    // setSelectedSize("");
    setFormData((prev) => ({
      ...prev,
      logo: false,
      patches: false,
      security_batches: false,
      // Added by - Ashlekh on 19-02-2025
      // Reason - To add customization
      security_id_on_back: false,
      printed_id: false,
      // End of code - Ashlekh on 19-02-2025
      // Reason - To add customization
      embroider: false,
      logo_price: "",
      patches_price: "",
      security_batches_price: "",
      // Added by - Ashlekh on 19-02-2025
      // Reason - To add customization price
      security_id_on_back_price: "",
      printed_id_price: "",
      // End of code - Ashlekh on 19-02-2025
      // Reason - To add customization price
      embroider_price: "",
      after_customization_product_price: "",
      customization_comment: "",
    }));
    /**
     * End of addition by - Ashish Dewangan on 06-12-2024
     * Reason - To unselect size and customization on color change
     */
    /**Code added by Unnati on 29-12-2024
     * Reason-To clear availability message and quantity message
     */
    setAvailabilityMessage("");
    setQuantityMessage("");
    /**End of code addition by Unnati on 29-12-2024
     * Reason-To clear availability message and quantity message
     */
    /**Code added by Unnati on 24-01-2025
     * Reason-To clear size error
     */
    setSizeError("");
    /**End of code addition by Unnati on 24-01-2025
     * Reason-To clear size error
     */
  };
  /**End of code addition by Unnati on 23-06-2024
   *Reason-To select color and show the available sizes
   */

  /**Code added by Unnati on 04-07-2024
   * Reason -To check the stock and display the message accordingly
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
  /**End of code addition by Unnati on 04-07-2024
   * Reason -To check the stock and display the message accordingly
   */
  const QuantityMessage = (size, stock) => {
    if (stock === 0) {
      setQuantityMessage(" ");
    } else if (stock < 10) {
      setQuantityMessage(`Only ${stock} left in ${size}`);
    }
  };
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
    if (firstAvailableSize) {
      setSelectedSize(firstAvailableSize);
    }
  }, [availableSizes]);
  /**End of code addition by Unnati on 29-12-2024
   * Reason-To select size by default
   */
  /**Code added by Unnati on 28-08-2024
   * Reason-To check is size is available or not
   */
  const isSizeAvailable = (size) => {
    return availableSizes[size] > 0;
  };
  /**End of code addition  by Unnati on 28-08-2024
   * Reason-To check is size is available or not
   */

  {
    /**Code added by Unnati on 23-06-2024
     *Reason-Created a set of unique colors and maps ieach product to its color*/
  }
  const uniqueColors = [...new Set(products.map((product) => product.color))];
  {
    /**End of code addition by Unnati on 23-06-2024
     *Reason-Created a set of unique colors and maps ieach product to its color*/
  }
  {
    /**Code added by Unnati on 03-07-2024
     *Reason -To validate input on submit */
  }
  /**Code commented by unnati on 19-01-2025
 * Reason-This code is not in use
 */
  // const isValidOnSubmit = () => {
  //   if (checkIsEmpty(selectedColor)) {
  //     setColorError("Please select a color.");
  //     return false;
  //   }
  //   /**Code added by Unnati on 02-01-2025
  //    * Reason-Added one more condition for free size
  //    */
  //   // if (checkIsEmpty(selectedSize)) {
  //   if (!selectedProductDetails.is_free_size && checkIsEmpty(selectedSize)) {
  //     setSizeError("Please select a size.");
  //     return false;
  //   }
  //   /**Code added by Unnati on 02-01-2025
  //    * Reason-Added one more condition for free size
  //    */
  //   /**Code added by Unnati on 02-01-2025
  //    * Reason-To check for stock
  //    */
  //   if (selectedProductDetails.is_free_size) {
  //     if (selectedProductDetails.free_size <= 0) {
  //       setSizeError("No stock available.");
  //       return false;
  //     }
  //   }
  //   /*End of code addition by Unnati on 02-01-2025
  //    * Reason-To check for stock
  //    */
  //   return true;
  // };
  /**End of code commented by unnati on 19-01-2025
   * Reason-This code is not in use
   */
  /**Code added by Unnati on 19-01-2025
   * Reason-Added validations
   */
  const isValidOnSubmit = () => {
    if (checkIsEmpty(selectedColor)) {
      setColorError("Please select a color.");
      return false;
    }

    if (selectedProductDetails.is_free_size) {
      if (selectedProductDetails.free_size <= 0) {
        setSizeError("No stock available.");
        return false;
      }
    } else {
      const sizes = {
        XS: selectedProductDetails.XS,
        S: selectedProductDetails.S,
        M: selectedProductDetails.M,
        L: selectedProductDetails.L,
        XL: selectedProductDetails.XL,
        XXL: selectedProductDetails.XXL,
        XXXL: selectedProductDetails.XXXL,
      };
      let hasStock = Object.values(sizes).some(stock => stock > 0);
      if (!hasStock) {
        setSizeError("No stock available.");
        return false;
      }
      if (checkIsEmpty(selectedSize)) {
        setSizeError("Please select a size.");
        return false;
      }
      const stock = sizes[selectedSize];
      if (stock <= 0) {
        setSizeError("No stock available for the selected size.");
        return false;
      }
      updateAvailabilityMessage(selectedSize, stock);
      QuantityMessage(selectedSize, stock);
    }
    return true;
  };
  /**End of code addition by Unnati on 19-01-2025
 * Reason-Added validations
 */

  /**End of code addition by Unnati on 03-07-2024
   *Reason -To validate input on submit */

  /**Code added by Unnati on 03-07-2024
   *Reason -To post add to cart details */
  /**Code added by Unnati on 30-07-2024
   * Reason-To store current date and time in variable
   */
  let currentTimeAndDate = Date.now();
  /**End of code addition by Unnati on 30-07-2024
   * Reason-To store current date and time in variable
   */
  const addToCartDetails = async (e) => {
    e.preventDefault();
    /**Code added by Unnati on 02-01-2025
     * Reason-Added condition for free size
     */
    if (selectedProductDetails.is_free_size) {
      setSelectedSize("free_size");
    }
    /**End of code addition by Unnati on 02-01-2025
     * Reason-Added condition for free size
     */
    if (isValidOnSubmit()) {
      const data = {
        product: selectedProductDetails.id,
        XS: selectedSize === "XS" ? quantity : null,
        S: selectedSize === "S" ? quantity : null,
        M: selectedSize === "M" ? quantity : null,
        L: selectedSize === "L" ? quantity : null,
        XL: selectedSize === "XL" ? quantity : null,
        XXL: selectedSize === "XXL" ? quantity : null,
        XXXL: selectedSize === "XXXL" ? quantity : null,
        /**Code added by Unnati on 02-01-2025
         * Reason-Added free size
         */
        free_size: selectedSize === "free_size" ? quantity : null,
        /**End of code addition by Unnati on 02-01-2025
         * Reason-Added free size
         */
        user: user && user.id ? user.id : null,
        color: selectedProductDetails.color,

        /* Modified by Jhamman on 08-10-2024
        Reason - Added sale rate that we get after discount*/
        // sales_rate: selectedProductDetails.sales_rate,
        // sales_rate: selectedProductDetails.sale_percentage
        //   ? calculateDiscountFromProduct(
        //       selectedProductDetails.sales_rate,
        //       selectedProductDetails.sale_percentage
        //     )
        //   : selectedProductDetails.sales_rate,
        sales_rate: selectedProductDetails.sales_rate,
        /*End of modification by Jhamman on 08-10-2024
        Reason - Added sale rate that we get after discount*/

        image1: selectedProductDetails.image1,
        name: selectedProductDetails.name,
        /**Code added by Unnati on 30-07-2024
         * Reason-Added updated and created at
         */
        created_at: currentTimeAndDate,
        updated_at: currentTimeAndDate,
        /**End of code addition by Unnati on 30-07-2024
         * Reason-Added updated and created at
         */
        /**Code added by Unnati on 11-09-2024
         * Reason-Added patches and embroider for each sizes
         */
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

        /**End of code addition by Unnati on 12-09-2024
         * Reason-Added patches and embroider
         */
        // Addition by Om Shrivastava on 01-12-2024
        // Reason : Send the customization keys
        after_customization_product_price:
          formData.after_customization_product_price,
        customization_comment: formData.customization_comment,
        logo: formData.logo,
        patches: formData.patches,
        security_batches: formData.security_batches,
        // Added by - Ashlekh on 19-02-2025
        // Reason - To add customization
        security_id_on_back: formData.security_id_on_back,
        printed_id: formData.printed_id,
        // End of code - Ashlekh on 19-02-2025
        // Reason - To add customization
        embroider: formData.embroider,
        logo_price: formData.logo_price,
        patches_price: formData.patches_price,
        security_batches_price: formData.security_batches_price,
        // Added by - Ashlekh on 19-02-2025
        // Reason - To set customization price
        security_id_on_back_price: formData.security_id_on_back_price,
        printed_id_price: formData.printed_id_price,
        // End of code - Ashlekh on 19-02-2025
        // Reason - To set customization price
        embroider_price: formData.embroider_price,
        size: selectedSize,
        quantity: quantity,
        // is_active : selectedProductDetails.is_active,
      };
      // console.log("checkkkkkkkk",data)
      setFormData((prevState) => ({
        ...prevState,
        after_customization_product_price:
          formData.after_customization_product_price,
        customization_comment: formData.customization_comment,
        logo: formData.logo,
        patches: formData.patches,
        security_batches: formData.security_batches,
        // Added by - Ashlekh on 19-02-2025
        // Reason - To add customization
        security_id_on_back: formData.security_id_on_back,
        printed_id: formData.printed_id,
        // End of code - Ashlekh on 19-02-2025
        // Reason - To add customization
        embroider: formData.embroider,
        logo_price: formData.logo_price,
        patches_price: formData.patches_price,
        security_batches_price: formData.security_batches_price,
        // Added by - Ashlekh on 19-02-2025
        // Reason - To set customization price
        security_id_on_back_price: formData.security_id_on_back_price,
        printed_id_price: formData.printed_id_price,
        // End of code - Ashlekh on 19-02-2025
        // Reason - To set customization price
        embroider_price: formData.embroider_price,
      }));
      // End of addition by Om Shrivastava on 01-12-2024
      // Reason : Send the customization keys

      /**Code added by Unnati on 05-07-2024
       *Reason-To check whether user is logged in or not*/

      if (user && user.id) {
        data.user = user.id;
        try {
          /**Code added by Unnati on 10-07-2024
           *Reason-To check if the product exist already or not
           */

          const response = await checkIfProductExistsInCart(
            selectedProductDetails.id,
            user.id,
            data
          );

          /**End of code addition by Unnati on 10-07-2024
           *Reason-To check if the product exist already or not
           */

          /**Code added by Unnati on 10-07-2024
           *Reason-If product exists then update the cart
           */

          if (response.exists === false) {
            /**Code added by Unnati on 02-01-2025
             * Reason=added condition for free size
             */
            if (selectedProductDetails.is_free_size) {
              setSelectedSize("free_size");
            }
            /**End of code addition by Unnati on 02-01-2025
             * Reason=added condition for free size
             */
            const addResponse = await addToCart(data);
            /**Code added by Unnati on 26-07-2024
             * Reason-To store cartdata in local storage
             */
            localStorage.setItem("cartData", JSON.stringify(addResponse));
            /**End of code addition by Unnati on 26-07-2024
             * Reason-To store cartdata in local storage
             */
            /**Code added by Unnati on 26-07-2024
             * Reason-To set cartdata in context
             */
            setCartData(addResponse);
            /**End of code addition by Unnati on 26-07-2024
             * Reason-To set cartdata in context
             */
            if (addResponse.success) {
              notificationObject.success("Product added to cart successfully");
              navigate("/checkout");
            } else if (addResponse.error) {
              notificationObject.error("Failed to add product to cart");
            }

            /**End of code addition by Unnati on 10-07-2024
             *Reason-If product exists then update the cart
             */
          } else {
            /**Code added by Unnati on 04-07-2024
             *Reason-To add products in the cart if it does not exists */
            /**Code added by Unnati on 02-01-2025
             * Reason=added condition for free size
             */
            if (selectedProductDetails.is_free_size) {
              setSelectedSize("free_size");
            }
            /**End of code addition by Unnati on 02-01-2025
             * Reason=added condition for free size
             */
            const updateResponse = await updateCart(data);
            /**Code added by Unnati on 27-07-2024
             * Reason-To update cartdata in local storage
             */
            localStorage.setItem(
              "cartData",
              JSON.stringify(updateResponse.cartData)
            );
            /**End of code addition by Unnati on 27-07-2024
             * Reason-To update cartdata in local storage
             */
            /**Code added by Unnati on 27-07-2024
             * Reason-To set updated cartdata in context
             */
            setCartData(updateResponse.cartData);
            /**End of code addition by Unnati on 27-07-2024
             * Reason-To set updated cartdata in context
             */
            if (updateResponse.success) {
              notificationObject.success("Cart updated successfully");
              navigate("/checkout");
            } else if (updateResponse.error) {
              notificationObject.error("Failed to update cart");
            }
          }
          {
            /**End of Code addition by Unnati on 04-07-2024
             *Reason-To add products in the cart if it does not exists */
          }

          {
            /**End of Code addition by Unnati on 04-07-2024
             *Reason-To add products in the cart if it does not exists */
          }
        } catch (error) {
          notificationObject.error("An error occurred while updating the cart");
        }

        /**End of code addition by Unnati on 05-07-2024
         *Reason-To check whether user is logged in or not*/
      } else {
        /**Code added by Unnati on 05-05-2024
         * Reason-To store details in local storage if user is not logged in
         */
        const productDetail = {
          sale_percentage: selectedProductDetails.sale_percentage,
          is_active: selectedProductDetails.is_active,
          product_id: selectedProductDetails.product_id,
          product: selectedProductDetails.id,
          XS: selectedSize === "XS" ? quantity : null,
          S: selectedSize === "S" ? quantity : null,
          M: selectedSize === "M" ? quantity : null,
          L: selectedSize === "L" ? quantity : null,
          XL: selectedSize === "XL" ? quantity : null,
          XXL: selectedSize === "XXL" ? quantity : null,
          XXXL: selectedSize === "XXXL" ? quantity : null,
          /**Code added by Unnati on 02-01-2025
           * Reason-Added free size
           */
          free_size: selectedSize === "free_size" ? quantity : null,
          /*End of code addition by Unnati on 02-01-2025
           * Reason-Added free size
           */
          user: user && user.id ? user.id : null,
          color: selectedProductDetails.color,
          sales_rate: selectedProductDetails.sales_rate,
          image1: selectedProductDetails.image1,
          name: selectedProductDetails.name,
          /**Code added by Unnati on 30-07-2024
           * Reason-Added updated and created at
           */
          created_at: currentTimeAndDate,
          updated_at: currentTimeAndDate,
          /**End of code addition by Unnati on 30-07-2024
           * Reason-Added updated and created at
           */
          /**Code added by Unnati on 11-09-2024
           * Reason-Added patches and embroider for each sizes
           */
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
          /**End of code addition by Unnati on 12-09-2024
           * Reason-Added patches and embroider
           */

          after_customization_product_price:
            formData.after_customization_product_price,
          customization_comment: formData.customization_comment,
          logo: formData.logo,
          patches: formData.patches,
          security_batches: formData.security_batches,
          // Added by - Ashlekh on 19-02-2025
          // Reason - To add customization
          security_id_on_back: formData.security_id_on_back,
          printed_id: formData.printed_id,
          // End of code - Ashlekh on 19-02-2025
          // Reason - To add customization
          embroider: formData.embroider,
          logo_price: formData.logo_price,
          patches_price: formData.patches_price,
          security_batches_price: formData.security_batches_price,
          // Added by - Ashlekh on 19-02-2025
          // Reason - To set customization price
          security_id_on_back_price: formData.security_id_on_back_price,
          printed_id_price: formData.printed_id_price,
          // End of code - Ashlekh on 19-02-2025
          // Reason - To set customization price
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
              // Added by - Ashlekh on 19-02-2025
              // Reason - To add customization
              cartItem.security_id_on_back === productDetail.security_id_on_back &&
              cartItem.printed_id === productDetail.printed_id &&
              // End of code - Ashlekh on 19-02-2025
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
                // Added by - Ashlekh on 19-02-2025
                // Reason - To add customization
                security_id_on_back: productDetail.security_id_on_back,
                printed_id: productDetail.printed_id,
                // End of code - Ashlekh on 19-02-2025
                // Reason - To add customization
                embroider: productDetail.embroider,
                size: productDetail.size,
                quantity: cartItem.quantity + productDetail.quantity,
                logo_price: productDetail.logo_price,
                patches_price: productDetail.patches_price,
                security_batches_price: productDetail.security_batches_price,
                // Added by - Ashlekh on 19-02-2025
                // Reason - To add customization price
                security_id_on_back_price: productDetail.security_id_on_back_price,
                printed_id_price: productDetail.printed_id_price,
                // End of code - Ashlekh on 19-02-2025
                // Reason - To add customization price
                embroider_price: productDetail.embroider_price,
                after_customization_product_price: parseFloat(
                  cartItem.after_customization_product_price
                ),
                customization_comment: productDetail.customization_comment,
              };
            }
            return cartItem;

            // If no match, return the item as is
          });

          // Log the result for confirmation
          // console.log("Updated cart data:", updatedCartData);

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
      /**End of code addition by Unnati on 05-05-2024
       * Reason-To store details in local storage if user is not logged in
       */

      /**
       * Added by - Ashish Dewangan on 06-12-2024
       * Reason - TO reset size and customization after add to cart is clicked
       */
      /**Code added by Unnati on 02-01-2025
       * Reason-Added condition for free size
       */
      if (!selectedProductDetails.is_free_size) {
        setSelectedSize("");
      }
      /**End of code addition by Unnati on 02-01-2025
       * Reason-Added condition for free size
       */
      setFormData((prev) => ({
        ...prev,
        logo: false,
        patches: false,
        security_batches: false,
        // Added by - Ashlekh on 19-02-2025
        // Reason - To add customization
        security_id_on_back: false,
        printed_id: false,
        // End of code - Ashlekh on 19-02-2025
        // Reason - To add customization
        embroider: false,
        logo_price: "",
        patches_price: "",
        security_batches_price: "",
        embroider_price: "",
        // Added by - Ashlekh on 19-02-2025
        // Reason - To add customization price
        security_id_on_back_price: "",
        printed_id_price: "",
        // End of code - Ashlekh on 19-02-2025
        // Reason - To add customization price
        after_customization_product_price: "",
        customization_comment: "",
      }));
      /**
       * End of addition by - Ashish Dewangan on 06-12-2024
       * Reason - TO reset size and customization after add to cart is clicked
       */
    }
    /**Code added by Unnati on 25-08-2024
     * Reason-Clear form after add to cart button
     */
    setPatchSelection("");
    setEmbroiderSelection("");
    setQuantity(1);
    /**Code added by Unnati on 02-01-2025
     * Reason-Added condition for free size
     */
    if (!selectedProductDetails.is_free_size) {
      setSelectedSize("");
    }
    /**End of code addition by Unnati on 02-01-2025
     * Reason-Added condition for free size
     */
    setAvailabilityMessage("");
    setQuantityMessage("");
    /**End of code additon  by Unnati on 25-08-2024
     * Reason-Clear form after add to cart button
     */
  };
  {
    /**End of code addition by Unnati on 03-07-2024
     *Reason -To post add to cart details */
  }
  {
    /**Code added by Unnati on 03-07-2024
     *Reason-To handle submit when clicked on add to cart button */
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    addToCartDetails(e);
    // setDrawerOpen(true);
  };
  {
    /**End of code addition by Unnati on 03-07-2024
     *Reason-To handle submit when clicked on add to cart button */
  }
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    const stock = availableSizes[selectedSize];
    // Code changed by - Ashlekh on 27-11-2024
    // Reason - To check no negative value are set
    // if (value <= availableSizes[selectedSize]) {
    //   setQuantity(value);
    // } else {
    //   setAvailabilityMessage(`Only ${stock} items left in ${selectedSize}.`);
    // }
    // Added by - Ashlekh on 02-12-2024
    // Reason - To add validation message if size is not selected
    if (!selectedSize) {
      setAvailabilityMessage("Please select a size first.");
      setQuantity(1);
      return;
    }
    // End of code - Ashlekh on 02-12-2024
    // Reason - To add validation message if size is not selected
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
    // End of code - Ashlekh on 27-11-2024
    // Reason - To check no negative value are set
  };

  // Added by - Ashlekh on 30-10-2024
  // Reason - To add products in wishlist
  const handleWishList = async (user, selectedProductDetails) => {
    if (user.id != null || user.id != undefined) {
      const response = await addToWishListAPI(
        user.id,
        selectedProductDetails?.product_id,
        selectedProductDetails?.color
      );
      localStorage.setItem(
        "wishListData",
        JSON.stringify(response?.wishlist_data)
      );
      setWishListData(response?.wishlist_data);
      if (response?.message == "Success") {
        notificationObject.success("Product successfully added in wishlist");
      } else if (response?.message == "Product Already in Wishlist") {
        // Code changed by - Ashlekh on 19-11-2024
        // Reason - To change notification message
        // notificationObject.success("Product already is in wishlist");
        notificationObject.success("Product is already in your wishlist");
        // End of code - Ashlekh on 19-11-2024
        // Reason - To change notification message
      } else {
        notificationObject.error("Failed to add product to cart");
      }
    } else {
      // Code commented by - Ashlekh on 16-11-2024
      // Reason - To navigate in login page if guest user clicks on Add to wishlist
      // const wishListItems = {
      //   user_id: user?.id || null,
      //   product_id: selectedProductDetails?.product_id || null,
      //   color: selectedProductDetails?.color || null,
      // }
      // const existingWishList = JSON.parse(localStorage.getItem("wishListData")) || [];
      // const isItemInWishlist = existingWishList.some(
      //   (item) =>
      //       item.user_id == wishListItems.user_id &&
      //       item.product_id == wishListItems.product_id &&
      //       item.color == wishListItems.color
      // );
      // if (!isItemInWishlist) {
      //   const updatedWishList = [...existingWishList, wishListItems];
      //   localStorage.setItem("wishListData", JSON.stringify(updatedWishList));
      //   setWishListData(updatedWishList);
      // }
      // notificationObject.success("Product successfully added in wishlist");
      navigate("/login");
      // End of code - Ashlekh on 16-11-2024
      // Reason - To navigate in login page if guest user clicks on Add to wishlist
    }
  };
  // End of code - Ashlekh on 30-10-2024
  // Reason - To add products in wishlist

  // Added by - Ashlekh on 19-11-2024
  // Reason - When wishlist icon is clicked then to add/remove product in Wishlist
  const [isWishListed, setIsWishListed] = useState(false);
  useEffect(() => {
    let productInWishlist = false;
    wishListData?.map((item) => {
      if (
        item.product_id == selectedProductDetails?.product_id &&
        item.color == selectedProductDetails?.color
      ) {
        productInWishlist = true;
      }
      return item;
    });

    setIsWishListed(productInWishlist);
  }, [wishListData, selectedProductDetails]);
  const handleToggleWishList = async (user, selectedProductDetails) => {
    if (user.id == null || user.id == undefined) {
      navigate("/login");
      return;
    } else {
      try {
        if (isWishListed) {
          const response = await removeProductFromWishListAPI(
            user.id,
            selectedProductDetails?.product_id,
            selectedProductDetails?.color
          );
          localStorage.setItem(
            "wishListData",
            JSON.stringify(response.wishlist)
          );
          setWishListData(response.wishlist);
          if (response?.message) {
            setIsWishListed(false);
            notificationObject.success(
              "Product successfully removed from wishlist"
            );
          }
        } else {
          const response = await addToWishListAPI(
            user.id,
            selectedProductDetails?.product_id,
            selectedProductDetails?.color
          );
          localStorage.setItem(
            "wishListData",
            JSON.stringify(response?.wishlist_data)
          );
          setWishListData(response?.wishlist_data);
          if (response?.message == "Success") {
            setIsWishListed(true);
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
  // End of code - Ashlekh on 19-11-2024
  // Reason - When wishlist icon is clicked then to add/remove product in Wishlist
  // Added by - Ashlekh on 09-12-2024
  // Reason - To display navigation path
  const { navigationPath, setNavigationPath } = useContext(GlobalContext);
  useEffect(() => {
    setNavigationPath([
      { name: "Home", path: "/" },
      { name: "Product Detail", path: `/productdetail/${identifier}` },
    ]);
    window.scrollTo(0, 0);
  }, [setNavigationPath]);
  // End of code - Ashlekh on 09-12-2024
  // Reason - To display navigation path
  /**Code added by Unnati on 30-12-2024
   * Reason-Added by default size selection for free size
   */
  useEffect(() => {
    if (selectedProductDetails.is_free_size) {
      setSelectedSize("free_size");
      handleSelectChange("free_size");
    }
  }, [selectedProductDetails.is_free_size]);
  /**End of code addition by Unnati on 30-12-2024
   * Reason-Added by default size selection for free size
   */

  // Added by - Ashlekh on 31-12-2024
  // Reason - To open/close feedback modal
  const openReviewModal = () => {
    setIsReviewModalOpen(true);
  };
  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setName("");
    setNameError("");
    setEmail("");
    setEmailError("");
    setFeedBackContent("");
    setFeedBackContentError("");
    setRating(4);
    // Added by - Ashlekh on 04-01-2025
    // Reason - To set email validation message empty
    setEmailValidationError("");
    // End of code - Ashlekh on 04-01-2025
    // Reason - To set email validation message empty
  };
  // End of code - Ashlekh on 31-12-2024
  // Reason - To open/close feedback modal

  // Added by - Ashlekh on 01-01-2025
  // Reason - To validate feedback form
  const isValidateFeedBackOnSubmit = (feedBackDetails) => {
    let isValid = true;
    // Commented by - Ashlekh on 04-01-2025
    // Reason - To hide name from review/feedback input modal
    // if (checkIsEmpty(feedBackDetails.name)) {
    //   setNameError("Please enter name");
    //   isValid = false;
    // } else if (!checkIsNotADigit(feedBackDetails.name)) {
    //   setNameError("Please enter a valid name");
    //   isValid = false;
    // }
    // End of comment - Ashlekh on 04-01-2025
    // Reason - To hide name from review/feedback input modal

    if (checkIsEmpty(feedBackDetails.email)) {
      setEmailError("Please enter email");
      isValid = false;
    } else if (checkIsEmailInvalid(feedBackDetails.email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    if (checkIsEmpty(feedBackDetails.content)) {
      setFeedBackContentError("Please enter content");
      isValid = false;
    }

    return isValid;
  };
  // End of code - Ashlekh on 01-01-2025
  // Reason - To validate feedback form

  // Added by - Ashlekh on 01-01-2025
  // Reason - API to submit feedback form
  const submitFeedback = async (e) => {
    // Added by - Ashlekh on 04-01-2025
    // Reason - To prevent user from submitting feedback from same email
    const emailExists = feedBackData.some((item) => item.email == user.email);
    // const emailExists = feedBackData.map((item) => item.email).includes(user.email);
    if (emailExists) {
      setEmailValidationError(
        "You have already submitted feedback with this email."
      );
      return;
    }
    setEmailValidationError("");
    // End of code - Ashlekh on 04-01-2025
    // Reason - To prevent user from submitting feedback from same email
    const feedBackDetails = {
      rating: rating,
      content: feedBackContent,
      // Commented by - Ashlekh on 04-01-2025
      // Reason - To hide name from review/feedback input modal
      // name:name,
      // End of comment - Ashlekh on 04-01-2025
      // Reason - To hide name from review/feedback input modal
      email: user.email,
      productId: selectedProductDetails?.product_id,
    };
    if (isValidateFeedBackOnSubmit(feedBackDetails)) {
      try {
        const response = await postFeedBackDetailsAPI(feedBackDetails);
        if (response?.message == "Saved successfully") {
          notificationObject.success("Thankyou for your feedback");
          // Added by - Ashlekh on 04-01-2025
          // Reason - To set average rating, feedback data & feedback count
          setAverageRating(response?.average_rating);
          setFeedBackData(response?.feedback_data);
          setFeedBackDataCount(response?.feedback_data_count);
          // End of code - Ashlekh on 04-01-2025
          // Reason - To set average rating, feedback data & feedback count
          // Added by - Ashlekh on 14-01-2025
          // Reason - To set count of ratings (1 to 5)
          setTotalFiveStarRating(response?.total_five_star_rating);
          setTotalFourStarRating(response?.total_four_star_rating);
          setTotalThreeStarRating(response?.total_three_star_rating);
          setTotalTwoStarRating(response?.total_two_star_rating);
          setTotalOneStarRating(response?.total_one_star_rating);
          // End of code - Ashlekh on 14-01-2025
          // Reason - To set count of ratings (1 to 5)
          closeReviewModal();
        }
      } catch (error) {
        console.error("Error in feedback:", error);
      }
    }
  };
  const isValidOnBlur = (input, value) => {
    if (input == "name") {
      if (checkIsEmpty(value)) {
        setNameError("Please enter your name");
        return false;
      }
    }
    if (input == "email") {
      if (checkIsEmpty(value)) {
        setEmailError("Please enter your email");
        return false;
      } else if (checkIsEmailInvalid(value)) {
        setEmailError("Please enter a valid email address");
        return false;
      }
    }
  };
  // End of code - Ashlekh on 01-01-2025
  // Reason - API to submit feedback form


  /**Code added by Unnati on 07-10-2025
   * Reason-Added code for product modal
   */
  const ProductModal = ({ product_id }) => {
    console.log("close cmodal",)
    const [pdistinctColor, setPDistinctColor] = useState([]);
    const [pselectedColor, setPSelectedColor] = useState(null);
    const [pavailableSizes, setPAvailableSizes] = useState({});
    const [pselectedSize, setPSelectedSize] = useState(null);
    const [pquantity, setPQuantity] = useState(1);
    const [pavailabilityMessage, setPAvailabilityMessage] = useState("");
    const [pquantityMessage, setPQuantityMessage] = useState("");
    const [pcolorError, setPColorError] = useState("");
    const [psizeError, setPSizeError] = useState("");
    const [ppatchSelection, setPPatchSelection] = useState("");
    const [pembroiderSelection, setPEmbroiderSelection] = useState("");
    const [pvalidationMessage, setPValidationMessage] = useState("");
    const [pisPopupOpen, setPIsPopupOpen] = useState(false);
    const [pselectedItem, setPSelectedItem] = useState(null);
    const [pselectedProduct, setPSelectedProduct] = useState(null);
    const [pproduct, setPProduct] = useState([]);
    const [pformData, setPFormData] = useState({
      logo: false,
      patches: false,
      security_batches: false,
      // Added by - Ashlekh on 19-02-2025
      // Reason - To add customization
      security_id_on_back: false,
      printed_id: false,
      // End of code - Ashlekh on 19-02-2025
      // Reason - To add customization
      embroider: false,
      customization_comment: "",
      logo_price: "",
      patches_price: "",
      security_batches_price: "",
      // Added by - Ashlekh on 19-02-2025
      // Reason - To add customization price
      security_id_on_back_price: "",
      printed_id_price: "",
      // End of code - Ashlekh on 19-02-2025
      // Reason - To add customization price
      embroider_price: "",
      after_customization_product_price: "",
    });
    let currentTimeAndDate = Date.now();

    // End of addition by Om Shrivastava on 02-12-2024
    // Reason : Create useState of all customization checkboxes
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
      if (firstAvailableSize) {
        setPSelectedSize(firstAvailableSize);
      }
    }, [pavailableSizes]);

    // Added by - Ashlekh on 01-01-2025
    // Reason - Created various useState for feedback

    const handleCheckBoxChange = (e) => {
      const { name, type, value, checked } = e.target;
      setPFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
      if (type === "checkbox" && checked) {
        setPValidationMessage("");
      }
    };
    useEffect(() => {
      /**Code modified by Unnati on 30-12-2024
       * Reason-Added sizes XS and S
       */
      const firstAvailableSize = [
        "M",
        "L",
        "XL",
        "XXL",
        "XXXL",
        "S",
        "XS",
      ].find((size) => isSizeAvailable(size));
      /**End of code addition by Unnati on 30-12-2024
       * Reason-Added sizes XS and S
       */
      if (firstAvailableSize) {
        setPSelectedSize(firstAvailableSize);
      }
    }, [pavailableSizes]);
    const handleQuantitychange = (e) => {
      const value = parseInt(e.target.value, 10);
      const stock = availableSizes[pselectedSize];
      if (!pselectedSize) {
        setPAvailabilityMessage("Please select a size first.");
        setPQuantity(1);
        return;
      }
      if (!isNaN(value) && value > 0) {
        if (value <= stock) {
          setPQuantity(value);
          setPAvailabilityMessage("");
        } else {
          setPAvailabilityMessage(
            `Only ${stock} items left in ${pselectedSize}.`
          );
        }
      } else {
        setPQuantity(1);
        setPAvailabilityMessage("Quantity cannot be less than 1.");
      }
    };
    /**End of code addition by Unnati on 06-01-2025
     * Reason-Added handle quantity change
     */

    /**Code added by Unnati on 06-01-2025
     * Reason-Added isSizeAvailable
     */
    const isSizeAvailable = (size) => {
      return availableSizes[size] > 0;
    };
    const handleSizeSelectChange = (size) => {
      setPSelectedSize(size);
      setPQuantityMessage("");
      setPQuantity(1);
      const stock = availableSizes[size];
      updateAvailabilityMessage(size, stock);
      setPSizeError("");
      // Code changed by - Ashlekh on 08-03-2025
      // Reason - To keep previous data if size is changed
      // setPFormData((prev) => ({
      //   ...prev,
      //   logo: false,
      //   patches: false,
      //   security_batches: false,
      //   // Added by - Ashlekh on 19-02-2025
      //   // Reason - To add customization
      //   security_id_on_back: false,
      //   printed_id: false,
      //   // End of code - Ashlekh on 19-02-2025
      //   // Reason - To add customization
      //   embroider: false,
      //   logo_price: "",
      //   patches_price: "",
      //   security_batches_price: "",
      //   // Added by - Ashlekh on 19-02-2025
      //   // Reason - To add customization price
      //   security_id_on_back_price: "",
      //   printed_id_price: "",
      //   // End of code - Ashlekh on 19-02-2025
      //   // Reason - To add customization price
      //   embroider_price: "",
      //   after_customization_product_price: "",
      //   customization_comment: "",
      // }));
      setPFormData((prev) => ({
        ...prev,
      }));
      // End of code - Ashlekh on 08-03-2025
      // Reason - To keep previous data if size is changed
    };
    const updateAvailabilityMessage = (size, stock) => {
      if (stock === 0) {
        setPAvailabilityMessage(`${size} is not available`);
      } else if (stock < 10) {
        /**Code modified by Unnati on 30-10-2024
         * Reason-Changed the message
         */
        setPAvailabilityMessage(`Only a few quantity left in ${size}`);
        /*End of code modification by Unnati on 30-10-2024
         * Reason-Changed the message
         */
      } else {
        setPAvailabilityMessage("");
      }
    };
    const handleQtyIncrement = () => {
      if (!pselectedSize && !pselectedProduct.is_free_size) {
        setPQuantityMessage(
          "Please select a size before adjusting the quantity."
        );
        return;
      }

      if (pselectedProduct.is_free_size) {
        setPSelectedSize("free_size");
      }

      setPAvailabilityMessage("");
      const stock = availableSizes[pselectedSize];
      if (pquantity < stock) {
        setPQuantity(pquantity + 1);
        setPQuantityMessage(" ");
      } else {
        setPQuantityMessage(`Only ${stock} items available in ${pselectedSize}.`);
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
        setPQuantityMessage(" ");
      } else if (stock < 10) {
        setPQuantityMessage(`Only ${stock} left in ${size}`);
      }
    };
    const handleQtyDecrement = () => {
      if (!pselectedSize) {
        setPQuantityMessage(
          "Please select a size before selecting the quantity."
        );
        return;
      }
      setPAvailabilityMessage("");
      if (pquantity > 1) {
        setPQuantity(pquantity - 1);
        QuantityMessage(pselectedSize, pavailableSizes[pselectedSize]);
      } else {
        setPQuantityMessage("Quantity cannot be less than 1");
      }
    };
    const isValidOnSubmit = () => {
      if (checkIsEmpty(selectedColor)) {
        setPColorError("Please select a color.");
        return false;
      }

      if (!pselectedProduct.is_free_size && checkIsEmpty(pselectedSize)) {
        setPSizeError("Please select a size.");
        return false;
      }

      if (pselectedProduct.is_free_size) {
        if (pselectedProduct.free_size <= 0) {
          setPSizeError("No stock available.");
          return false;
        }
      }

      return true;
    };

    useEffect(() => {
      if (!product_id) return;

      const fetchProductDetails = async () => {
        try {
          const response = await getProductDetails(product_id);

          setPProduct(response.products);

          // const uniqueColors = [...new Set(response.products.map((p) => p.color))];
          // setDistinctColor(uniqueColors);


          const uniqueColors = [...new Set(response.products.map((product) => product.color))];
          if (uniqueColors.length > 0) {
            setPSelectedColor(uniqueColors[0]);
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
            setPAvailableSizes(sizes);
            setPSelectedProduct(response.products[0]);
            console.log("respoonsee>>>>>>>>>>>>", response);
          }
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      };

      fetchProductDetails();
    }, [product_id]);
    const handleModalColorSelect = (color) => {
      setPSelectedColor(color);
      const selectedProduct = pproduct.find((p) => p.color === color);
      setPSelectedProduct(selectedProduct);
      const sizes = {
        XS: pselectedProduct.XS,
        S: pselectedProduct.S,
        M: pselectedProduct.M,
        L: pselectedProduct.L,
        XL: pselectedProduct.XL,
        XXL: pselectedProduct.XXL,
        XXXL: pselectedProduct.XXXL,
      };

      setPAvailableSizes(sizes);

      if (pselectedSize) {
        const stock = sizes[pselectedSize];
        updateAvailabilityMessage(pselectedSize, stock);
        /**Code added by Unnati on 24-08-2024
         * Reason-Added quantity message
         */
        QuantityMessage(pselectedSize, stock);
        /**End of code addition by Unnati on 24-08-2024
         * Reason-Added quantity message
         */
      }

      /**
       * Added by - Ashish Dewangan on 06-12-2024
       * Reason - To unselect size and customization on color change
       */
      setPSelectedSize("");
      setPFormData((prev) => ({
        ...prev,
        logo: false,
        patches: false,
        security_batches: false,
        // Added by - Ashlekh on 19-02-2025
        // Reason - To add customization
        security_id_on_back: false,
        printed_id: false,
        // End of code - Ashlekh on 19-02-2025
        // Reason - To add customization
        embroider: false,
        logo_price: "",
        patches_price: "",
        security_batches_price: "",
        // Added by - Ashlekh on 19-02-2025
        // Reason - To add customization price
        security_id_on_back_price: "",
        printed_id_price: "",
        // End of code - Ashlekh on 19-02-2025
        // Reason - To add customization price
        embroider_price: "",
        after_customization_product_price: "",
        customization_comment: "",
      }));

      setPAvailabilityMessage("");
      setPQuantityMessage("");
    };
    useEffect(() => {
      if (pselectedProduct?.is_free_size) {
        setPSelectedSize("free_size");
        handleSizeSelectChange("free_size");
      }
    }, [pselectedProduct]);
    const addToCartDetails = async (e) => {
      e.preventDefault();
      /**Code added by Unnati on 02-01-2025
       * Reason-Added condition for free size
       */
      if (pselectedProduct.is_free_size) {
        setPSelectedSize("free_size");
      }
      const {
        logo,
        patches,
        security_batches,
        // Added by - Ashlekh on 19-02-2025
        // Reason - To add customization details
        security_id_on_back,
        printed_id,
        // End of code - Ashlekh on 19-02-2025
        // Reason - To add customization details
        embroider,
        customization_comment,
      } = pformData;
      let basePrice = parseFloat(pselectedProduct?.sales_rate) || 0;


      if (pselectedProduct.sale_percentage) {
        basePrice = pselectedProduct?.sales_rate - ((pselectedProduct?.sales_rate * pselectedProduct?.sale_percentage) / 100)


      }
      if (logo) {
        basePrice += parseFloat(pselectedProduct.logo_price);
      }

      if (patches) {
        basePrice += parseFloat(pselectedProduct.patches_price);
      }

      if (security_batches) {
        basePrice += parseFloat(pselectedProduct.security_batches_price);
      }
      // Added by - Ashlekh on 19-02-2025
      // Reason - To calculate customization price
      if (security_id_on_back) {
        basePrice += parseFloat(pselectedProduct.security_id_on_back_price);
      }
      if (printed_id) {
        basePrice += parseFloat(pselectedProduct.printed_id_price);
      }
      // End of code - Ashlekh on 19-02-2025
      // Reason - To calculate customization price

      if (embroider) {
        basePrice += parseFloat(pselectedProduct.embroider_price);
      }
      let customizationPrice = basePrice;
      const formattedCustomizationPrice = isNaN(customizationPrice)
        ? "0.00"
        : customizationPrice.toFixed(2);
      if (isValidOnSubmit()) {
        const data = {
          product: pselectedProduct.id,
          XS: pselectedSize === "XS" ? pquantity : null,
          S: pselectedSize === "S" ? pquantity : null,
          M: pselectedSize === "M" ? pquantity : null,
          L: pselectedSize === "L" ? pquantity : null,
          XL: pselectedSize === "XL" ? pquantity : null,
          XXL: pselectedSize === "XXL" ? pquantity : null,
          XXXL: pselectedSize === "XXXL" ? pquantity : null,

          free_size: pselectedSize === "free_size" ? pquantity : null,

          user: user && user.id ? user.id : null,
          color: pselectedProduct.color,

          sales_rate: pselectedProduct.sales_rate,

          image1: pselectedProduct.image1,
          name: pselectedProduct.name,

          created_at: currentTimeAndDate,
          updated_at: currentTimeAndDate,

          xs_patches:
            pselectedSize === "XS"
              ? ppatchSelection === "Yes"
                ? true
                : false
              : false,
          s_patches:
            pselectedSize === "S"
              ? ppatchSelection === "Yes"
                ? true
                : false
              : false,
          m_patches:
            pselectedSize === "M"
              ? ppatchSelection === "Yes"
                ? true
                : false
              : false,
          l_patches:
            pselectedSize === "L"
              ? ppatchSelection === "Yes"
                ? true
                : false
              : false,
          xl_patches:
            pselectedSize === "XL"
              ? ppatchSelection === "Yes"
                ? true
                : false
              : false,
          xxl_patches:
            pselectedSize === "XXL"
              ? ppatchSelection === "Yes"
                ? true
                : false
              : false,
          xxxl_patches:
            pselectedSize === "XXXL"
              ? ppatchSelection === "Yes"
                ? true
                : false
              : false,

          xs_embroider:
            pselectedSize === "XS"
              ? pembroiderSelection === "Yes"
                ? true
                : false
              : false,
          s_embroider:
            pselectedSize === "S"
              ? pembroiderSelection === "Yes"
                ? true
                : false
              : false,
          m_embroider:
            pselectedSize === "M"
              ? pembroiderSelection === "Yes"
                ? true
                : false
              : false,
          l_embroider:
            pselectedSize === "L"
              ? pembroiderSelection === "Yes"
                ? true
                : false
              : false,
          xl_embroider:
            pselectedSize === "XL"
              ? pembroiderSelection === "Yes"
                ? true
                : false
              : false,
          xxl_embroider:
            pselectedSize === "XXL"
              ? pembroiderSelection === "Yes"
                ? true
                : false
              : false,
          xxxl_embroider:
            pselectedSize === "XXXL"
              ? pembroiderSelection === "Yes"
                ? true
                : false
              : false,

          after_customization_product_price:
            formattedCustomizationPrice,
          customization_comment: pformData.customization_comment,
          logo: pformData.logo,
          patches: pformData.patches,
          security_batches: pformData.security_batches,
          // Added by - Ashlekh on 19-02-2025
          // Reason - To add customization
          security_id_on_back: pformData.security_id_on_back,
          printed_id: pformData.printed_id,
          // End of code - Ashlekh on 19-02-2025
          // Reason - To add customization
          embroider: pformData.embroider,
          logo_price: parseFloat(pselectedProduct?.logo_price) || "0.00",
          patches_price: parseFloat(pselectedProduct?.patches_price) || "0.00",
          security_batches_price: parseFloat(pselectedProduct?.security_batches_price) || "0.00",
          // Added by - Ashlekh on 19-02-2025
          // Reason - To add customization
          security_id_on_back_price: parseFloat(pselectedProduct?.security_id_on_back_price) || "0.00",
          printed_id_price: parseFloat(pselectedProduct?.printed_id_price) || "0.00",
          // End of code - Ashlekh on 19-02-2025
          // Reason - To add customization
          embroider_price: parseFloat(pselectedProduct?.embroider_price) || "0.00",
          size: pselectedSize,
          quantity: pquantity,
          // is_active : selectedProductDetails.is_active,
        };
        setFormData((prevState) => ({
          ...prevState,
          after_customization_product_price:
            pformData.after_customization_product_price,
          customization_comment: pformData.customization_comment,
          logo: pformData.logo,
          patches: pformData.patches,
          security_batches: pformData.security_batches,
          // Added by - Ashlekh on 19-02-2025
          // Reason - To add customization
          security_id_on_back: pformData.security_id_on_back,
          printed_id: pformData.printed_id,
          // End of code - Ashlekh on 19-02-2025
          // Reason - To add customization
          embroider: pformData.embroider,
          logo_price: pformData.logo_price,
          patches_price: pformData.patches_price,
          security_batches_price: pformData.security_batches_price,
          // Added by - Ashlekh on 19-02-2025
          // Reason - To add customization price
          security_id_on_back_price: pformData.security_id_on_back_price,
          printed_id_price: pformData.printed_id_price,
          // End of code - Ashlekh on 19-02-2025
          // Reason - To add customization price
          embroider_price: pformData.embroider_price,
        }));

        if (user && user.id) {
          data.user = user.id;
          try {
            const response = await checkIfProductExistsInCart(
              pselectedProduct.id,
              user.id,
              data
            );

            if (response.exists === false) {
              if (pselectedProduct.is_free_size) {
                setPSelectedSize("free_size");
              }

              const addResponse = await addToCart(data);

              localStorage.setItem("cartData", JSON.stringify(addResponse));

              setCartData(addResponse);

              if (addResponse.success) {
                notificationObject.success(
                  "Product added to cart successfully"
                );
                navigate("/checkout");
              } else if (addResponse.error) {
                notificationObject.error("Failed to add product to cart");
              }

              /**End of code addition by Unnati on 10-07-2024
               *Reason-If product exists then update the cart
               */
            } else {
              if (pselectedProduct.is_free_size) {
                setPSelectedSize("free_size");
              }
              /**End of code addition by Unnati on 02-01-2025
               * Reason=added condition for free size
               */
              const updateResponse = await updateCart(data);
              /**Code added by Unnati on 27-07-2024
               * Reason-To update cartdata in local storage
               */
              localStorage.setItem(
                "cartData",
                JSON.stringify(updateResponse.cartData)
              );
              /**End of code addition by Unnati on 27-07-2024
               * Reason-To update cartdata in local storage
               */
              /**Code added by Unnati on 27-07-2024
               * Reason-To set updated cartdata in context
               */
              setCartData(updateResponse.cartData);
              /**End of code addition by Unnati on 27-07-2024
               * Reason-To set updated cartdata in context
               */
              if (updateResponse.success) {
                notificationObject.success("Cart updated successfully");
                navigate("/checkout");
              } else if (updateResponse.error) {
                notificationObject.error("Failed to update cart");
              }
            }
            {
              /**End of Code addition by Unnati on 04-07-2024
               *Reason-To add products in the cart if it does not exists */
            }

            {
              /**End of Code addition by Unnati on 04-07-2024
               *Reason-To add products in the cart if it does not exists */
            }
          } catch (error) {
            notificationObject.error(
              "An error occurred while updating the cart"
            );
          }

          /**End of code addition by Unnati on 05-07-2024
           *Reason-To check whether user is logged in or not*/
        } else {
          /**Code added by Unnati on 05-05-2024
           * Reason-To store details in local storage if user is not logged in
           */
          const productDetail = {
            sale_percentage: pselectedProduct.sale_percentage,
            is_active: pselectedProduct.is_active,
            product_id: pselectedProduct.product_id,
            product: pselectedProduct.id,
            XS: pselectedSize === "XS" ? pquantity : null,
            S: pselectedSize === "S" ? pquantity : null,
            M: pselectedSize === "M" ? pquantity : null,
            L: pselectedSize === "L" ? pquantity : null,
            XL: pselectedSize === "XL" ? pquantity : null,
            XXL: pselectedSize === "XXL" ? pquantity : null,
            XXXL: pselectedSize === "XXXL" ? pquantity : null,
            /**Code added by Unnati on 02-01-2025
             * Reason-Added free size
             */
            free_size: pselectedSize === "free_size" ? pquantity : null,
            /*End of code addition by Unnati on 02-01-2025
             * Reason-Added free size
             */
            user: user && user.id ? user.id : null,
            color: pselectedProduct.color,
            sales_rate: pselectedProduct.sales_rate,
            image1: pselectedProduct.image1,
            name: pselectedProduct.name,
            /**Code added by Unnati on 30-07-2024
             * Reason-Added updated and created at
             */
            created_at: currentTimeAndDate,
            updated_at: currentTimeAndDate,
            /**End of code addition by Unnati on 30-07-2024
             * Reason-Added updated and created at
             */
            /**Code added by Unnati on 11-09-2024
             * Reason-Added patches and embroider for each sizes
             */
            xs_patches:
              pselectedSize === "XS"
                ? ppatchSelection === "Yes"
                  ? true
                  : false
                : false,
            s_patches:
              pselectedSize === "S"
                ? ppatchSelection === "Yes"
                  ? true
                  : false
                : false,
            m_patches:
              pselectedSize === "M"
                ? ppatchSelection === "Yes"
                  ? true
                  : false
                : false,
            l_patches:
              pselectedSize === "L"
                ? ppatchSelection === "Yes"
                  ? true
                  : false
                : false,
            xl_patches:
              pselectedSize === "XL"
                ? ppatchSelection === "Yes"
                  ? true
                  : false
                : false,
            xxl_patches:
              pselectedSize === "XXL"
                ? ppatchSelection === "Yes"
                  ? true
                  : false
                : false,
            xxxl_patches:
              pselectedSize === "XXXL"
                ? ppatchSelection === "Yes"
                  ? true
                  : false
                : false,

            xs_embroider:
              pselectedSize === "XS"
                ? pembroiderSelection === "Yes"
                  ? true
                  : false
                : false,
            s_embroider:
              pselectedSize === "S"
                ? pembroiderSelection === "Yes"
                  ? true
                  : false
                : false,
            m_embroider:
              pselectedSize === "M"
                ? pembroiderSelection === "Yes"
                  ? true
                  : false
                : false,
            l_embroider:
              pselectedSize === "L"
                ? pembroiderSelection === "Yes"
                  ? true
                  : false
                : null,
            xl_embroider:
              pselectedSize === "XL"
                ? pembroiderSelection === "Yes"
                  ? true
                  : false
                : false,
            xxl_embroider:
              pselectedSize === "XXL"
                ? pembroiderSelection === "Yes"
                  ? true
                  : false
                : false,
            xxxl_embroider:
              pselectedSize === "XXXL"
                ? pembroiderSelection === "Yes"
                  ? true
                  : false
                : false,
            /**End of code addition by Unnati on 12-09-2024
             * Reason-Added patches and embroider
             */

            after_customization_product_price:
              pformData.after_customization_product_price,
            customization_comment: pformData.customization_comment,
            logo: pformData.logo,
            patches: pformData.patches,
            security_batches: pformData.security_batches,
            // Added by - Ashlekh on 19-02-2025
            // Reason - To add customization
            security_id_on_back: pformData.security_id_on_back,
            printed_id: pformData.printed_id,
            // End of code - Ashlekh on 19-02-2025
            // Reason - To add customization
            embroider: pformData.embroider,
            logo_price: pformData.logo_price,
            patches_price: pformData.patches_price,
            security_batches_price: pformData.security_batches_price,
            // Added by - Ashlekh on 19-02-2025
            // Reason - To add customization price
            security_id_on_back_price: pformData.security_id_on_back_price,
            printed_id_price: pformData.printed_id_price,
            // End of code - Ashlekh on 19-02-2025
            // Reason - To add customization price
            embroider_price: pformData.embroider_price,
            size: pselectedSize,
            quantity: pquantity,
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
                // Added by - Ashlekh on 19-02-2025
                // Reason - To add customization details
                cartItem.security_id_on_back === productDetail.security_id_on_back &&
                cartItem.printed_id === productDetail.printed_id &&
                // End of code - Ashlekh on 19-02-2025
                // Reason - To add customization details
                cartItem.embroider === productDetail.embroider &&
                cartItem.color === productDetail.color
              ) {
                doesItemExist = true;
                return {
                  ...cartItem,
                  logo: productDetail.logo,
                  patches: productDetail.patches,
                  security_batches: productDetail.security_batches,
                  // Added by - Ashlekh on 19-02-2025
                  // Reason - To add customization
                  security_id_on_back: productDetail.security_id_on_back,
                  printed_id: productDetail.printed_id,
                  // End of code - Ashlekh on 19-02-2025
                  // Reason - To add customization
                  embroider: productDetail.embroider,
                  size: productDetail.size,
                  quantity: cartItem.quantity + productDetail.quantity,
                  logo_price: productDetail.logo_price,
                  patches_price: productDetail.patches_price,
                  security_batches_price: productDetail.security_batches_price,
                  // Added by - Ashlekh on 19-02-2025
                  // Reason - To add customization price
                  security_id_on_back_price: productDetail.security_id_on_back_price,
                  printed_id_price: productDetail.printed_id_price,
                  // End of code - Ashlekh on 19-02-2025
                  // Reason - To add customization price
                  embroider_price: productDetail.embroider_price,
                  after_customization_product_price: parseFloat(
                    cartItem.after_customization_product_price
                  ),
                  customization_comment: productDetail.customization_comment,
                };
              }
              return cartItem;

              // If no match, return the item as is
            });

            // Log the result for confirmation
            // console.log("Updated cart data:", updatedCartData);

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
        /**End of code addition by Unnati on 05-05-2024
         * Reason-To store details in local storage if user is not logged in
         */

        /**
         * Added by - Ashish Dewangan on 06-12-2024
         * Reason - TO reset size and customization after add to cart is clicked
         */
        /**Code added by Unnati on 02-01-2025
         * Reason-Added condition for free size
         */
        if (!pselectedProduct.is_free_size) {
          setPSelectedSize("");
        }
        /**End of code addition by Unnati on 02-01-2025
         * Reason-Added condition for free size
         */
        setPFormData((prev) => ({
          ...prev,
          logo: false,
          patches: false,
          security_batches: false,
          // Added by - Ashlekh on 19-02-2025
          // Reason - To add customization
          security_id_on_back: false,
          printed_id: false,
          // End of code - Ashlekh on 19-02-2025
          // Reason - To add customization
          embroider: false,
          logo_price: "",
          patches_price: "",
          security_batches_price: "",
          // Added by - Ashlekh on 19-02-2025
          // Reason - To add customization price
          security_id_on_back_price: "",
          printed_id_price: "",
          // End of code - Ashlekh on 19-02-2025
          // Reason - To add customization price
          embroider_price: "",
          after_customization_product_price: "",
          customization_comment: "",
        }));
        /**
         * End of addition by - Ashish Dewangan on 06-12-2024
         * Reason - TO reset size and customization after add to cart is clicked
         */
      }
      /**Code added by Unnati on 25-08-2024
       * Reason-Clear form after add to cart button
       */
      setPPatchSelection("");
      setPEmbroiderSelection("");
      setPQuantity(1);
      /**Code added by Unnati on 02-01-2025
       * Reason-Added condition for free size
       */
      if (!pselectedProduct.is_free_size) {
        setPSelectedSize("");
      }
      /**End of code addition by Unnati on 02-01-2025
       * Reason-Added condition for free size
       */
      setPAvailabilityMessage("");
      setPQuantityMessage("");
      /**End of code additon  by Unnati on 25-08-2024
       * Reason-Clear form after add to cart button
       */
      setShowModal(false)
    };
    const handlePopUpSubmit = (e) => {
      e.preventDefault();
      addToCartDetails(e);
    };
    if (!showModal) return null;
    else {
      return (
        selectedItem == product_id && (
          <div
            className={`${ProductDetailStyle.productModalOverlay}`}

          >
            <div
              className={`${ProductDetailStyle.productModalContent}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={`${ProductDetailStyle.closeButton}`}
                onClick={() => setShowModal(false)}
              >
                <IoCloseSharp />

              </button>
              {/**Code added by Unnati on 23-01-2025
                *Reason-Added classname */}
              {/* {pselectedProduct?.name} */}
              <div className={ProductDetailStyle.modalProductName}> {pselectedProduct?.name}</div>
              {/**End of code addition by Unnati on 23-01-2025
                  *Reason-Added classname */}
              <div className={ProductDetailStyle.saleRate}>
                {pselectedProduct?.sale_percentage ? (
                  <div className={ProductDetailStyle.productPrice}>
                    {config.currency_icon}
                    {calculateDiscountFromProduct(
                      pselectedProduct?.sales_rate,
                      pselectedProduct?.sale_percentage
                    )}
                  </div>
                ) : (
                  <div className={ProductDetailStyle.productPrice}>
                    {config.currency_icon}{pselectedProduct?.sales_rate}
                  </div>
                )}
                {pselectedProduct?.sale_percentage ? (
                  <div className={`${ProductDetailStyle.cardPrice}`}>
                    <p
                      className={ProductDetailStyle.mrpPriceText}
                      style={{
                        textDecoration: "line-through",
                        textDecorationColor: "#000",
                        color: "red",
                      }}
                    >
                      {config.currency_icon}{pselectedProduct?.sales_rate}
                    </p>
                  </div>
                ) : null}
              </div>
              {/* Added by jhamman on 14-10-2024
                            Reason - Added offer percentage*/}
              {pselectedProduct?.sale_percentage ? (
                <div className={ProductDetailStyle.productOfferContainer}>
                  <p className={ProductDetailStyle.productOfferPercentage}>
                    {pselectedProduct?.sale_percentage}% off
                  </p>
                </div>
              ) : null}
              <div className={ProductDetailStyle.productColors}>
                {/**Code added by Unnati on 20-12-2024
                 *Reason-To map product to according to its color*/}
                {uniqueColors.map((color) => (
                  <div
                    key={color}
                    className={`${ProductDetailStyle.colorOption} ${pselectedColor === color
                      ? ProductDetailStyle.activeColorOption
                      : ""
                      }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleModalColorSelect(color)}
                  ></div>
                ))}
                {/**End of code addition by Unnati on 20-12-2024
                 *Reason-To map product to according to its color*/}
              </div>
              {!pselectedProduct?.is_free_size ? (
                <div className={ProductDetailStyle.sizeMessage}>
                  <label htmlFor="sizeBoxes">Size</label>

                  <p className={ProductDetailStyle.availabilityMessage}>
                    {pavailabilityMessage}
                  </p>
                </div>
              ) : null}
              {/**Code added by Unnati on 02-01-2025
               *Reason-Added condition for free size*/}
              {!pselectedProduct?.is_free_size && (
                <div className={ProductDetailStyle.sizeBoxes}>
                  {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
                    <div
                      key={size}
                      className={`${ProductDetailStyle.sizeBox} ${pselectedSize === size
                        ? ProductDetailStyle.selectedSizeBox
                        : ""
                        } ${!isSizeAvailable(size)
                          ? ProductDetailStyle.unavailableSizeBox
                          : ""
                        }`}
                      onClick={() =>
                        isSizeAvailable(size) && handleSizeSelectChange(size)
                      }
                    >
                      {size}
                    </div>
                  ))}
                </div>
              )}
              {/**End of code addition by Unnati on 02-01-2025
               *Reason-Added condition for free size*/}
              {pselectedProduct?.show_patches_and_embroider_on_UI
                // Added by - Ashlekh on 16-01-2025
                // Reason - To check condition for logo patches security embroider
                // Code changed by - Ashlekh on 05-03-2025
                // Reason - To add more customization fields in condition
                // && (pselectedProduct?.logo_price || pselectedProduct?.patches_price || pselectedProduct?.security_batches_price || pselectedProduct?.embroider_price)
                && (pselectedProduct?.logo_price || pselectedProduct?.patches_price || pselectedProduct?.security_batches_price || pselectedProduct?.security_id_on_back_price || pselectedProduct?.printed_id_price || pselectedProduct?.embroider_price)
                // End of code - Ashlekh on 05-03-2025
                // Reason - To add more customization fields in condition
                // End of code - Ashlekh on 16-01-2025
                // Reason - To check condition for logo patches security embroider
                ? (
                  <h5 className={`${ProductDetailStyle.customizationOption}`}>
                    Customization Options
                  </h5>
                ) : null}
              <div className={ProductDetailStyle.checkboxGroup}>
                {/* Added by - Ashlekh on 16-01-2025
                Reason - To check condition for logo */}
                {/* {pselectedProduct?.logo_price  */}
                {pselectedProduct?.show_patches_and_embroider_on_UI
                  && (pselectedProduct.logo_price)
                  // End of code - Ashlekh on 16-01-2025
                  // Reason - To check condition for logo
                  ? (
                    <label className={ProductDetailStyle.reason}>
                      <input
                        type="checkbox"
                        name="logo"
                        checked={pformData.logo}
                        onChange={handleCheckBoxChange}
                        // Added by - Ashlekh on 07-03-2025
                        // Reason - To add class name
                        className={`${ProductDetailStyle.checkBox}`}
                      // End of code - Ashlekh on 07-03-2025
                      // Reason - To add class name
                      />{" "}
                      Logo + ${pselectedProduct?.logo_price}
                    </label>
                  ) : null}
                {/* Added by - Ashlekh on 16-01-2025
                Reason - To check condition for patches */}
                {/* {pselectedProduct?.patches_price  */}
                {pselectedProduct?.show_patches_and_embroider_on_UI
                  && (pselectedProduct.patches_price)
                  // End of code - Ashlekh on 16-01-2025
                  // Reason - To check condition for patches
                  ? (
                    <label className={ProductDetailStyle.reason}>
                      <input
                        type="checkbox"
                        name="patches"
                        checked={pformData.patches}
                        onChange={handleCheckBoxChange}
                        // Added by - Ashlekh on 07-03-2025
                        // Reason - To add class name
                        className={`${ProductDetailStyle.checkBox}`}
                      // End of code - Ashlekh on 07-03-2025
                      // Reason - To add class name
                      />{" "}
                      Patches / Batches + ${pselectedProduct?.patches_price}
                    </label>
                  ) : null}
                {/* Added by - Ashlekh on 16-01-2025
                Reason - To check condition for security batches */}
                {/* {pselectedProduct?.security_batches_price  */}
                {pselectedProduct?.show_patches_and_embroider_on_UI
                  && (pselectedProduct.security_batches_price)
                  // End of code - Ashlekh on 16-01-2025
                  // Reason - To check condition for security batches
                  ? (
                    <label className={ProductDetailStyle.reason}>
                      <input
                        type="checkbox"
                        name="security_batches"
                        checked={pformData.security_batches}
                        onChange={handleCheckBoxChange}
                        // Added by - Ashlekh on 07-03-2025
                        // Reason - To add class name
                        className={`${ProductDetailStyle.checkBox}`}
                      // End of code - Ashlekh on 07-03-2025
                      // Reason - To add class name
                      />{" "}
                      {/* Code changed by - Ashlekh on 18-02-2025
                    Reason - To change customization name */}
                      {/* Security id + ${pselectedProduct?.security_batches_price} */}
                      Security ID on Back and Chest + ${pselectedProduct?.security_batches_price}
                      {/* End of code - Ashlekh on 18-02-2025
                    Reason - To change customization name */}
                    </label>
                  ) : null}

                {/* Added by - Ashlekh on 19-02-2025
                Reason - To add customization options */}
                {pselectedProduct?.show_patches_and_embroider_on_UI
                  && (pselectedProduct.security_id_on_back_price)
                  ? (
                    <label className={ProductDetailStyle.reason}>
                      <input
                        type="checkbox"
                        name="security_id_on_back"
                        checked={pformData.security_id_on_back}
                        onChange={handleCheckBoxChange}
                        // Added by - Ashlekh on 07-03-2025
                        // Reason - To add class name
                        className={`${ProductDetailStyle.checkBox}`}
                      // End of code - Ashlekh on 07-03-2025
                      // Reason - To add class name
                      />{" "}
                      Security ID on Back + ${pselectedProduct?.security_id_on_back_price}
                    </label>
                  ) : null}

                {pselectedProduct?.show_patches_and_embroider_on_UI
                  && (pselectedProduct.printed_id_price)
                  ? (
                    <label className={ProductDetailStyle.reason}>
                      <input
                        type="checkbox"
                        name="printed_id"
                        checked={pformData.printed_id}
                        onChange={handleCheckBoxChange}
                        // Added by - Ashlekh on 07-03-2025
                        // Reason - To add class name
                        className={`${ProductDetailStyle.checkBox}`}
                      // End of code - Ashlekh on 07-03-2025
                      // Reason - To add class name
                      />{" "}
                      Printed ID + ${pselectedProduct?.printed_id_price}
                    </label>
                  ) : null}
                {/* End of code - Ashlekh on 19-02-2025
                Reason - To add customization options */}
                {/* Code changed by - Ashlekh on 16-01-2025
                Reason - To check condition for embroider */}
                {/* {pselectedProduct?.embroider_price  */}
                {pselectedProduct?.show_patches_and_embroider_on_UI
                  && (pselectedProduct.embroider_price)
                  // End of code - Ashlekh on 16-01-2025
                  // Reason - To check condition for embroider
                  ? (
                    <label className={ProductDetailStyle.reason}>
                      <input
                        type="checkbox"
                        name="embroider"
                        checked={pformData.embroider}
                        onChange={handleCheckBoxChange}
                        // Added by - Ashlekh on 07-03-2025
                        // Reason - To add class name
                        className={`${ProductDetailStyle.checkBox}`}
                      // End of code - Ashlekh on 07-03-2025
                      // Reason - To add class name
                      />{" "}
                      Embroider + ${pselectedProduct?.embroider_price}
                    </label>
                  ) : null}
              </div>
              {pvalidationMessage && (
                <div
                  style={{
                    color: "red",
                    marginBottom: "10px",
                  }}
                >
                  {pvalidationMessage}
                </div>
              )}
              {pselectedProduct?.show_patches_and_embroider_on_UI
                // Added by - Ashlekh on 16-01-2025
                // Reason - To check condition for logo patches security embroider
                // Added by - Ashlekh on 05-03-2025
                // Reason - To add more customization fields in condition
                // && (pselectedProduct?.logo_price || pselectedProduct?.patches_price || pselectedProduct?.security_batches_price || pselectedProduct?.embroider_price)
                && (pselectedProduct?.logo_price || pselectedProduct?.patches_price || pselectedProduct?.security_batches_price || pselectedProduct?.security_id_on_back_price || pselectedProduct?.printed_id_price || pselectedProduct?.embroider_price)
                // End of code - Ashlekh on 05-03-2025
                // Reason - To add more customization fields in condition
                // End of code - Ashlekh on 16-01-2025
                // Reason - To check condition for logo patches security embroider
                ? (
                  <div className={ProductDetailStyle.commentBox}>
                    <textarea
                      name="customization_comment"
                      placeholder="Comment"
                      className={ProductDetailStyle.commentInput}
                      value={pformData.customization_comment}
                      onChange={handleCheckBoxChange}
                    />
                  </div>
                ) : null}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              ></div>
              <div className={ProductDetailStyle.quantityContainer}>
                {/* Addition by Om Shrivastava on 18-12-2024
                          Reason : Add div section  */}
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <div className={ProductDetailStyle.quantity}>
                    <label>Qty</label>
                  </div>
                  <div
                    className={ProductDetailStyle.quantityInput}
                    onClick={QuantityMessage}
                  >
                    <p
                      className={ProductDetailStyle.quantityButton}
                      onClick={handleQtyDecrement}
                    >
                      -
                    </p>
                    <input
                      type="number"
                      inputMode="numeric"
                      className={ProductDetailStyle.quantityNumber}
                      value={pquantity}
                      onChange={handleQuantitychange}
                      onPaste={(e) => e.preventDefault()}
                      onCopy={(e) => e.preventDefault()}
                      // Added by - Ashlekh on 27-11-2024
                      // Reason - To prevent '-'/'e'/'+' from quantity
                      onKeyDown={(e) => {
                        if (e.key == "+" || e.key == "e" || e.key == "-") {
                          e.preventDefault();
                        }
                      }}
                    // End of code - Ashlekh on 27-11-2024
                    // Reason - To prevent '-'/'e'/'+' from quantity
                    />
                    <p
                      className={ProductDetailStyle.quantityButton}
                      onClick={handleQtyIncrement}
                    >
                      +
                    </p>
                  </div>
                  {/* End of addition by Om Shrivastava on 18-12-2024
                               Reason : Add div section  */}
                </div>
                {/* Addition  by Om Shrivastava on 18-12-2024
                            Reason : Add add to cart section and wishlist in phone view  */}
                <div className={ProductDetailStyle.addToCart}>
                  <button
                    // Code changed by - Ashlekh on 18-01-2025
                    // Reason - To add multiple class name
                    // className={ProductDetailStyle.addToCartButton}
                    className={`${ProductDetailStyle.addToCartButton} ${ProductDetailStyle.addToCartButtonPopup}`}
                    // End of code - Ashlekh on 18-01-2025
                    // Reason - To add multiple class name
                    onClick={handlePopUpSubmit}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      );
    }
  };
  /**End of code addition by Unnati on 07-10-2025
 * Reason-Added code for product modal
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

  // useEffect(()=>{
  //   if(showModal){

  //     console.log("...........show modal",showModal)
  //     openProductModal()
  //   }
  // },[showModal])
  return (
    <div className={ProductDetailStyle.pageFrame}>
      <div className={ProductDetailStyle.pageContainer}>

        {showModal && (
          <ProductModal
            product_id={selectedItem}

          />
        )}

        <NavigationPath navigationPathArray={navigationPath} />

        <div className={ProductDetailStyle.product}>
          <div className={ProductDetailStyle.imageContainer}>

            <Swiper
              navigation={true}
              modules={[Navigation]}
              className={ProductDetailStyle.mySwiper}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              onSlideChange={(swiper) =>
                setCurrentImageIndex(swiper.activeIndex)
              }
            >
              {images.map((image, index) => (
                <SwiperSlide key={index}>
                  <SimpleMagnifier
                    src={image ? `${config.baseURL}${image}` : 'https://via.placeholder.com/400'}
                    className={ProductDetailStyle.largeImage}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className={ProductDetailStyle.thumbnailContainer}>
              {images.map((image, index) => (
                <img
                  key={index}
                  src={
                    image
                      ? `${config.baseURL}${image}`
                      : "https://via.placeholder.com/100"
                  }
                  alt={`Thumbnail ${index + 1}`}
                  className={`${ProductDetailStyle.thumbnailImage} ${index === currentImageIndex
                    ? ProductDetailStyle.activeThumbnail
                    : ""
                    }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>

          <div className={ProductDetailStyle.productInfo}>
            <h1 className={ProductDetailStyle.productName}>
              {selectedProductDetails.name}
            </h1>

            <div className={ProductDetailStyle.priceBlock}>
            <div className={ProductDetailStyle.title}>
              {selectedProductDetails.sale_percentage ? (
                <div className={ProductDetailStyle.productPrice}>
                  {config.currency_icon}
                  {calculateDiscountFromProduct(
                    selectedProductDetails.sales_rate,
                    selectedProductDetails.sale_percentage
                  )}
                </div>
              ) : (
                <div className={ProductDetailStyle.productPrice}>
                  {config.currency_icon}{selectedProductDetails.sales_rate}
                </div>
              )}
              {selectedProductDetails.sale_percentage ? (
                <div className={`${ProductDetailStyle.cardPrice}`}>
                  <p
                    className={ProductDetailStyle.mrpPriceText}
                    style={{
                      textDecoration: "line-through",
                      textDecorationColor: "#000",
                      color: "red",
                    }}
                  >
                    ${selectedProductDetails.sales_rate}
                  </p>
                </div>
              ) : null}
            </div>
            {/* Added by jhamman on 14-10-2024
              Reason - Added offer percentage*/}
            {selectedProductDetails.sale_percentage ? (
              <div className={ProductDetailStyle.productOfferContainer}>
                <p className={ProductDetailStyle.productOfferPercentage}>
                  {selectedProductDetails.sale_percentage}% off
                </p>
              </div>
            ) : null}
            </div>

            <div className={ProductDetailStyle.productRating}>
              {selectedProductDetails.rating > 0 && (
                <Rating value={selectedProductDetails.rating} />
              )}
            </div>

            <div className={ProductDetailStyle.productOptions}>
              <div className={ProductDetailStyle.optionSection}>
                <div className={ProductDetailStyle.optionHeader}>
                  <span className={ProductDetailStyle.optionLabel}>Size</span>
                  {(!selectedProductDetails.is_free_size && sizeChart != null) ? (
                    <button
                      type="button"
                      className={ProductDetailStyle.sizeChartLink}
                      onClick={showSizeChart}
                    >
                      Size chart
                    </button>
                  ) : null}
                </div>
                <div className={ProductDetailStyle.productSizes}>
                {/**Code added by Unnati on 02-1-2025
                 *Reson-Added condition for free size*/}
                {!selectedProductDetails.is_free_size ? (
                  <div className={ProductDetailStyle.sizeMessage}>
                    <p className={ProductDetailStyle.availabilityMessage}>
                      {availabilityMessage}
                    </p>
                  </div>
                ) : null}
                {/**End of code addition by Unnati on 02-1-2025
                 *Reson-Added condition for free size*/}

                {/**Code added by Unnati on 28-08-2024
                 * Reason-Changed the UI for size display
                 */}
                {/**Code added by Unnati on 02-1-2025
                 *Reson-Added condition for free size*/}
                {!selectedProductDetails.is_free_size && (
                  <div className={ProductDetailStyle.sizeBoxes}>
                    {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
                      <div
                        key={size}
                        className={`${ProductDetailStyle.sizeBox} ${selectedSize === size
                          ? ProductDetailStyle.selectedSizeBox
                          : ""
                          } ${!isSizeAvailable(size)
                            ? ProductDetailStyle.unavailableSizeBox
                            : ""
                          }`}
                        onClick={() =>
                          isSizeAvailable(size) && handleSelectChange(size)
                        }
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                )}

                {selectedProductDetails.is_free_size && (
                  <div className={ProductDetailStyle.sizeBoxes}>
                    <div
                      className={`${ProductDetailStyle.sizeBox} ${ProductDetailStyle.selectedSizeBox}`}
                    >
                      OS
                    </div>
                  </div>
                )}

                {sizeError && (
                  <p className={ProductDetailStyle.formInputError}>
                    {sizeError}
                  </p>
                )}
                {/**End of code addition by Unnati on 02-01-2025
                 *Reason-Added condition for free size*/}
                {/* Code changed by - Ashlekh on 12-12-2024
                Reason - To remove size chart from antd and to show it using div (using custom modal) */}
                {/* <Modal
                  title=""
                  // visible={sizeChartVisible}
                  open={sizeChartVisible}
                  onCancel={handleCancel}
                  footer={null}
                  className={`${ProductDetailStyle.sizeChartModal}`}
                >
                  <img
                    className={`${ProductDetailStyle.sizeChartImage}`}
                    src={config.baseURL + sizeChart}
                    alt=""
                  />
                </Modal> */}
                {sizeChartVisible && (
                  <div
                    className={`${ProductDetailStyle.sizeChartOverlay}`}
                    onClick={handleCancel}
                  >
                    <div className={`${ProductDetailStyle.sizeChartModal}`}>
                      <span
                        className={`${ProductDetailStyle.closeButton}`}
                        onClick={handleCancel}
                      >
                        &times;
                      </span>
                      <img
                        className={`${ProductDetailStyle.sizeChartImage}`}
                        src={config.baseURL + sizeChart}
                        alt="Size Chart"
                      />
                    </div>
                  </div>
                )}
                {/* End of code - Ashlekh on 12-12-2024
                Reason - To remove size chart from antd and to show it using div (custom modal) */}
                {/* End of code - Ashlekh on 05-10-2024
                 Reason - To add size chart */}
              </div>
              </div>

              <div className={ProductDetailStyle.optionSection}>
                <div className={ProductDetailStyle.optionHeader}>
                  <span className={ProductDetailStyle.optionLabel}>Color</span>
                </div>
                <div className={ProductDetailStyle.productColors}>
                  <div className={ProductDetailStyle.colorSwatchGroup}>
                    {uniqueColors.map((color) => (
                      <div
                        key={color}
                        className={`${ProductDetailStyle.colorOption} ${selectedColor === color
                          ? ProductDetailStyle.activeColorOption
                          : ""
                          }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorSelect(color)}
                        title={color}
                      ></div>
                    ))}
                  </div>
                </div>
                {colorError && (
                  <p className={ProductDetailStyle.formInputError}>
                    {colorError}
                  </p>
                )}
              </div>

              {/**Code added by Unnati on 12-09-2024
               *Reason-Modified the sequence */}
              <div className={ProductDetailStyle.quantityContainer}>
                {/* Addition by Om Shrivastava on 18-12-2024
              Reason : Add div section  */}
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <div className={ProductDetailStyle.quantity}>
                    <label>Qty</label>
                  </div>
                  <div
                    className={ProductDetailStyle.quantityInput}
                    onClick={QuantityMessage}
                  >
                    <p
                      className={ProductDetailStyle.quantityButton}
                      onClick={handleQtyDecrement}
                    >
                      -
                    </p>
                    <input
                      type="number"
                      inputMode="numeric"
                      className={ProductDetailStyle.quantityNumber}
                      value={quantity}
                      onChange={handleQuantityChange}
                      onPaste={(e) => e.preventDefault()}
                      onCopy={(e) => e.preventDefault()}
                      // Added by - Ashlekh on 27-11-2024
                      // Reason - To prevent '-'/'e'/'+' from quantity
                      onKeyDown={(e) => {
                        if (e.key == "+" || e.key == "e" || e.key == "-") {
                          e.preventDefault();
                        }
                      }}
                    // End of code - Ashlekh on 27-11-2024
                    // Reason - To prevent '-'/'e'/'+' from quantity
                    />
                    <p
                      className={ProductDetailStyle.quantityButton}
                      onClick={handleQtyIncrement}
                    >
                      +
                    </p>
                  </div>
                  {/* End of addition by Om Shrivastava on 18-12-2024
              Reason : Add div section  */}
                </div>
                {/* Addition  by Om Shrivastava on 18-12-2024
                Reason : Add add to cart section and wishlist in phone view  */}
                <div className={ProductDetailStyle.addToCartPhoneView}>
                  <button
                    className={ProductDetailStyle.addToCartButton}
                    onClick={handleSubmit}
                  >
                    Add to Cart
                  </button>
                  {user.id != undefined && (
                    <div
                      className={`${ProductDetailStyle.wishListIconContainer}`}
                    >
                      {isWishListed ? (
                        <MdFavorite
                          onClick={() =>
                            handleToggleWishList(user, selectedProductDetails)
                          }
                          className={`${ProductDetailStyle.wishListIcon1}`}
                          title="Remove From WishList"
                        />
                      ) : (
                        <MdFavoriteBorder
                          onClick={() =>
                            handleToggleWishList(user, selectedProductDetails)
                          }
                          className={`${ProductDetailStyle.wishListIcon2}`}
                          title="Add to WishList"
                        />
                      )}
                    </div>
                  )}
                </div>
                {/* End of addition  by Om Shrivastava on 18-12-2024
                Reason : Add add to cart section and wishlist in phone view  */}
              </div>
              {/**Code added by Unnati on 25-08-2024
               * Reason-To display quantity message
               */}
              <p className={ProductDetailStyle.availabilityMessage}>
                {quantityMessage}
              </p>
              {/**End of code addition by Unnati on 25-08-2024
               * Reason-To display quantity message
               */}
              {/**End of code addition by Unnati on 12-09-2024
               *Reason-Modified the sequence */}
              {/* Added by jhamman on 14-10-2024
               Reason - added a condition to render patches */}
              {selectedProductDetails?.show_patches_and_embroider_on_UI ? (
                <>

                  <>
                    {/* Commented by Om Shrivastava on 09-11-2025
                  Reason : Comment the customised feature */}
                    <span
                      className={`${ProductDetailStyle.sizeChartBox}`}
                      // onClick={openPopup}
                      onClick={() => {
                        const phone = `1${settingInfo.contact_number}`; // your dynamic phone
                        const message = encodeURIComponent(`Hi! I want to customize my product ${selectedProductDetails.name}`);
                        const whatsappURL = `https://api.whatsapp.com/send?phone=${phone}&text=${message}`;
                        window.open(whatsappURL, "_blank");
                      }}
                    >
                      Customization
                    </span>
                    {/* End of commented by Om Shrivastava on 09-11-2025
                  Reason : Comment the customised feature */}
                    {/* Added by - Ashlekh on 14-01-2025
                    Reason - To add text */}
                    <p
                      style={{ paddingTop: "1%" }}
                      className={ProductDetailStyle.productDescription}
                    >
                      <span style={{ color: "red" }}>*{" "}</span>
                      Click on "Add to Cart" after choosing customization details
                    </p>
                    {/* End of code - Ashlekh on 14-01-2025
                    Reason - To add text */}
                    <p
                      style={{ paddingTop: "1%" }}
                      className={ProductDetailStyle.productDescription}
                    >
                      <span style={{ color: "red" }}>*</span> On Customization
                      price will be updated and updated price will be reflected
                      in cart
                    </p>

                    {isPopupOpen && (
                      <div
                        onClick={(e) => {
                          if (e.target === e.currentTarget) closePopup();
                        }}
                        className={ProductDetailStyle.popupOverlay}
                      >
                        <div className={ProductDetailStyle.popupContent}>
                          <button
                            className={ProductDetailStyle.closeButton}
                            onClick={closePopup}
                          >
                            <FaWindowClose />
                          </button>
                          <h2>Customization Options</h2>
                          {/* Addition by Om Shrivastava on 23-12-2024
                          Reason : Show the text  */}
                          <h6
                            style={{
                              fontSize: "var(--page-content-font-size)",
                              paddingTop: "2%",
                            }}
                          >
                            Please click on submit button to save your
                            customization details.
                          </h6>
                          {/* End of addition by Om Shrivastava on 23-12-2024
                          Reason : Show the text  */}
                          <form>
                            <div className={ProductDetailStyle.checkboxGroup}>
                              {selectedProductDetails?.logo_price ? (
                                <label className={`${ProductDetailStyle.reason}`}>
                                  <input
                                    type="checkbox"
                                    name="logo"
                                    checked={formData.logo}
                                    onChange={handleChange}
                                    // Added by - Ashlekh on 07-03-2025
                                    // Reason - To add class name
                                    className={`${ProductDetailStyle.checkBox}`}
                                  // End of code - Ashlekh on 07-03-2025
                                  // Reason - To add class name
                                  />{" "}
                                  {/* Modification and addition by Om Shrivastava on 28-11-2024
                                Reason : Change the name  */}
                                  Logo + $
                                  {/* End of modification and addition by Om Shrivastava on 28-11-2024
                                Reason : Change the name  */}
                                  {selectedProductDetails?.logo_price}
                                </label>
                              ) : null}
                              {selectedProductDetails?.patches_price ? (
                                <label className={`${ProductDetailStyle.reason}`}>
                                  <input
                                    type="checkbox"
                                    name="patches"
                                    checked={formData.patches}
                                    onChange={handleChange}
                                    // Added by - Ashlekh on 07-03-2025
                                    // Reason - To add class name
                                    className={`${ProductDetailStyle.checkBox}`}
                                  // End of code - Ashlekh on 07-03-2025
                                  // Reason - To add class name
                                  />{" "}
                                  {/* Modification and addition by Om Shrivastava on 28-11-2024
                                Reason : Change the name  */}
                                  Patches / Batches + $
                                  {/* Modification and addition by Om Shrivastava on 28-11-2024
                                Reason : Change the name  */}
                                  {selectedProductDetails?.patches_price}
                                </label>
                              ) : null}
                              {selectedProductDetails?.security_batches_price ? (
                                <label className={`${ProductDetailStyle.reason}`}>
                                  <input
                                    type="checkbox"
                                    name="security_batches"
                                    checked={formData.security_batches}
                                    onChange={handleChange}
                                    // Added by - Ashlekh on 07-03-2025
                                    // Reason - To add class name
                                    className={`${ProductDetailStyle.checkBox}`}
                                  // End of code - Ashlekh on 07-03-2025
                                  // Reason - To add class name
                                  />{" "}
                                  {/* Modification and addition by Om Shrivastava on 28-11-2024
                                Reason : Change the name  */}
                                  {/* Code changed by - Ashlekh on 18-02-2025
                                Reason - To change customization name */}
                                  {/* Security id + $ */}
                                  Security ID on Back and Chest + $
                                  {/* End of code - Ashlekh on 18-02-2025
                                  Reason - To change customization name */}
                                  {/* Modification and addition by Om Shrivastava on 28-11-2024
                                Reason : Change the name  */}
                                  {
                                    selectedProductDetails?.security_batches_price
                                  }
                                </label>
                              ) : null}
                              {/* Added by - Ashlekh on 19-02-2025
                              Reason - To add customization */}
                              {selectedProductDetails?.security_id_on_back_price ? (
                                <label className={`${ProductDetailStyle.reason}`}>
                                  <input
                                    type="checkbox"
                                    name="security_id_on_back"
                                    checked={formData.security_id_on_back}
                                    onChange={handleChange}
                                    // Added by - Ashlekh on 07-03-2025
                                    // Reason - To add class name
                                    className={`${ProductDetailStyle.checkBox}`}
                                  // End of code - Ashlekh on 07-03-2025
                                  // Reason - To add class name
                                  />{" "}
                                  Security ID on Back + $
                                  {
                                    selectedProductDetails?.security_id_on_back_price
                                  }
                                </label>
                              ) : null}
                              {selectedProductDetails?.printed_id_price ? (
                                <label className={`${ProductDetailStyle.reason}`}>
                                  <input
                                    type="checkbox"
                                    name="printed_id"
                                    checked={formData.printed_id}
                                    onChange={handleChange}
                                    // Added by - Ashlekh on 07-03-2025
                                    // Reason - To add class name
                                    className={`${ProductDetailStyle.checkBox}`}
                                  // End of code - Ashlekh on 07-03-2025
                                  // Reason - To add class name
                                  />{" "}
                                  Printed Id + $
                                  {
                                    selectedProductDetails?.printed_id_price
                                  }
                                </label>
                              ) : null}
                              {/* End of code - Ashlekh on 19-02-2025
                              Reason - To add customization */}

                              {selectedProductDetails?.embroider_price ? (
                                <label className={`${ProductDetailStyle.reason}`}>
                                  <input
                                    type="checkbox"
                                    name="embroider"
                                    checked={formData.embroider}
                                    onChange={handleChange}
                                    // Added by - Ashlekh on 07-03-2025
                                    // Reason - To add class name
                                    className={`${ProductDetailStyle.checkBox}`}
                                  // End of code - Ashlekh on 07-03-2025
                                  // Reason - To add class name
                                  />{" "}
                                  {/* Modification and addition by Om Shrivastava on 28-11-2024
                                Reason : Change the name  */}
                                  {/* Code changed by - Ashlekh on 13-12-2024
                                Reason - To change name */}
                                  {/* Embroider / Name + $ */}
                                  Embroider + $
                                  {/* End of code - Ashlekh on 13-12-2024
                                  Reason - To change name */}
                                  {/* Modification and addition by Om Shrivastava on 28-11-2024
                                Reason : Change the name  */}
                                  {selectedProductDetails?.embroider_price}
                                </label>
                              ) : null}
                            </div>
                            {validationMessage && (
                              <div
                                style={{ color: "red", marginBottom: "10px" }}
                              >
                                {validationMessage}
                              </div>
                            )}
                            <div className={ProductDetailStyle.commentBox}>
                              <textarea
                                name="customization_comment"
                                placeholder="Comment"
                                className={ProductDetailStyle.commentInput}
                                value={formData.customization_comment}
                                onChange={handleChange}
                              />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <button
                                type="button"
                                onClick={handleCustomizationSubmit}
                                className={ProductDetailStyle.submitButton}
                              >
                                Submit
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </>
                  {/* End of modification and addition by Om Shrivastava on 18-11-2024
                 Reason : Show the customization text and show the popup */}
                </>
              ) : null}
            </div>
            <div className={ProductDetailStyle.addToCart}>
              <button
                className={ProductDetailStyle.addToCartButton}
                onClick={handleSubmit}
              >
                Add to Cart
              </button>
              {/* End of code - Ashlekh on 30-10-2024
            Reason - To add WishList button */}
              {/* Added by - Ashlekh on 20-11-2024
                    Reason - To display wishlist icon */}
              {/* Added by - Ashlekh on 28-11-2024
                    Reason - To hide wishlist icon for guest user */}
              {user.id != undefined && (
                // End of code - Ashlekh on 28-11-2024
                // Reason - To hide wishlist icon for guest user
                <div className={`${ProductDetailStyle.wishListIconContainer}`}>
                  {isWishListed ? (
                    <MdFavorite
                      onClick={() =>
                        handleToggleWishList(user, selectedProductDetails)
                      }
                      className={`${ProductDetailStyle.wishListIcon1}`}
                      title="Remove From WishList"
                    />
                  ) : (
                    <MdFavoriteBorder
                      onClick={() =>
                        handleToggleWishList(user, selectedProductDetails)
                      }
                      className={`${ProductDetailStyle.wishListIcon2}`}
                      title="Add to WishList"
                    />
                  )}
                </div>
              )}
              {/* End of code - Ashlekh on 20-11-2024
                    Reason - To display wishlist icon */}
            </div>
            {/* Added by - Ashlekh on 30-10-2024
            Reason - To add WishList button */}
            {/* <div className={ProductDetailStyle.addToWishList}>
              <button
                className={ProductDetailStyle.addToWishListButton}
                onClick={() => handleWishList(user, selectedProductDetails)}
              >
                Add to WishList
              </button>
            </div> */}
            {/* End of code - Ashlekh on 30-10-2024
            Reason - To add WishList button */}

            {accordionSections.length > 0 && (
              <div className={ProductDetailStyle.accordionContainer}>
                {accordionSections.map((section) => {
                  const isExpanded = !!expandedSections[section.key];
                  return (
                    <div
                      key={section.key}
                      className={ProductDetailStyle.accordionItem}
                    >
                      <button
                        type="button"
                        className={ProductDetailStyle.accordionHeader}
                        onClick={() => toggleAccordionSection(section.key)}
                        aria-expanded={isExpanded}
                      >
                        <span>{section.label}</span>
                        <span className={ProductDetailStyle.accordionIcon}>
                          {isExpanded ? "−" : "+"}
                        </span>
                      </button>
                      {isExpanded && (
                        <div className={ProductDetailStyle.accordionBody}>
                          {section.isHtml ? (
                            <div className={ProductDetailStyle.accordionContent}>
                              {parse(String(section.value))}
                            </div>
                          ) : (
                            <p className={ProductDetailStyle.accordionText}>
                              {section.value}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Added by - Ashlekh on 04-01-2025
        Reason - To add feedback */}
        <div className={`${ProductDetailStyle.reviewContainer}`}>
          {/* Added by - Ashlekh on 11-01-2025
          Reason - To add condition (To hide title if no feedback is present and user is a guest) */}
          {(feedBackDataCount > 0 || user.id != undefined) && (
            // End of code - Ashlekh on 11-01-2025
            // Reason - To add condition (To hide title if no feedback is present and user is a guest)
            // <div className={`${ProductDetailStyle.reviewTitle}`}>Customer Reviews</div>
            <h2 className={`${ProductDetailStyle.reviewTitle}`}>Customer Reviews</h2>
          )}
          {/* Added by - Ashlekh on 13-02-2025
          Reason - To add review button below Customer Reviews title. also to add condition if review is already then this button will not show */}
          {(user.id != undefined && feedBackDataCount == 0) && (
            <div
              className={`${ProductDetailStyle.reviewButton} ${ProductDetailStyle.reviewButton2}`}
              onClick={openReviewModal}
            >
              Write a review
            </div>
          )}
          {/* End of code - Ashlekh on 13-02-2025
          Reason - To add review button below Customer Reviews title. also to add condition if review is already then this button will not show */}
          {feedBackDataCount > 0 && (
            <div className={`${ProductDetailStyle.reviewButtonContainer}`}>
              {/* Added by - Ashlekh on 07-01-2025
            Reason - To add condition (if no feedback is present then to hide average rating container) */}
              {feedBackDataCount > 0 && (
                // End of code - Ashlekh on 07-01-2025
                // Reason - To add condition (if no feedback is present then to hide average rating container)
                <div className={`${ProductDetailStyle.averageRatingContainer}`}>
                  <div className={`${ProductDetailStyle.averageRating}`}>
                    {averageRating}
                  </div>
                  <div className={`${ProductDetailStyle.averageRatingText}`}>
                    Based on {feedBackDataCount} review(s)
                  </div>
                </div>
              )}
              {/* Added by - Ashlekh on 14-01-2025
            Reason - To show no of star ratings */}
              {feedBackDataCount > 0 && (
                <div className={`${ProductDetailStyle.productRatingContainer}`}>
                  <div className={`${ProductDetailStyle.fiveStarRating}`}>
                    <Rate disabled value={5} className={`${ProductDetailStyle.starRatingCount}`} />
                    <div className={`${ProductDetailStyle.ratingBarContainer}`}>
                      <div
                        className={`${ProductDetailStyle.ratingBar}`}
                        style={{
                          width: `${(totalFiveStarRating / feedBackDataCount) * 100}%`,
                        }}
                      />
                    </div>
                    <span className={`${ProductDetailStyle.starRatingCountText}`}>{totalFiveStarRating}</span>
                  </div>
                  <div className={`${ProductDetailStyle.fourStarRating}`}>
                    <Rate className={`${ProductDetailStyle.starRatingCount}`} disabled value={4} />
                    <div className={`${ProductDetailStyle.ratingBarContainer}`}>
                      <div
                        className={`${ProductDetailStyle.ratingBar}`}
                        style={{
                          width: `${(totalFourStarRating / feedBackDataCount) * 100}%`,
                        }}
                      />
                    </div>
                    <span className={`${ProductDetailStyle.starRatingCountText}`}>{totalFourStarRating}</span>
                  </div>
                  <div className={`${ProductDetailStyle.threeStarRating}`}>
                    <Rate className={`${ProductDetailStyle.starRatingCount}`} disabled value={3} />
                    <div className={`${ProductDetailStyle.ratingBarContainer}`}>
                      <div
                        className={`${ProductDetailStyle.ratingBar}`}
                        style={{
                          width: `${(totalThreeStarRating / feedBackDataCount) * 100}%`,
                        }}
                      />
                    </div>
                    <span className={`${ProductDetailStyle.starRatingCountText}`}>{totalThreeStarRating}</span>
                  </div>
                  <div className={`${ProductDetailStyle.twoStarRating}`}>
                    <Rate className={`${ProductDetailStyle.starRatingCount}`} disabled value={2} />
                    <div className={`${ProductDetailStyle.ratingBarContainer}`}>
                      <div
                        className={`${ProductDetailStyle.ratingBar}`}
                        style={{
                          width: `${(totalTwoStarRating / feedBackDataCount) * 100}%`,
                        }}
                      />
                    </div>
                    <span className={`${ProductDetailStyle.starRatingCountText}`}>{totalTwoStarRating}</span>
                  </div>
                  <div className={`${ProductDetailStyle.oneStarRating}`}>
                    <Rate className={`${ProductDetailStyle.starRatingCount}`} disabled value={1} />
                    <div className={`${ProductDetailStyle.ratingBarContainer}`}>
                      <div
                        className={`${ProductDetailStyle.ratingBar}`}
                        style={{
                          width: `${(totalOneStarRating / feedBackDataCount) * 100}%`,
                        }}
                      />
                    </div>
                    <span className={`${ProductDetailStyle.starRatingCountText}`}>{totalOneStarRating}</span>
                  </div>
                </div>
              )}
              {/* End of code - Ashlekh on 14-01-2025
            Reason - To show no of star ratings */}
              {user.id != undefined && (
                <div
                  className={`${ProductDetailStyle.reviewButton}`}
                  onClick={openReviewModal}
                >
                  Write a review
                </div>
              )}
            </div>
          )}
          <div className={`${ProductDetailStyle.feedBackDetailContainer}`}>
            {feedBackData?.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`${ProductDetailStyle.feedBackItem}`}
                >
                  {/* Commented by - Ashlekh on 04-01-2025
                  Reason - To hide name from feedback */}
                  {/* <p className={`${ProductDetailStyle.name}`}>{item?.name}</p> */}
                  {/* End of comment - Ashlekh on 04-01-2025
                  Reason - To hide name from feedback */}
                  {/* Added by - Ashlekh on 13-02-2025
                  Reason - To show email and created_at date */}
                  <div className={`${ProductDetailStyle.emailTextAndDateContainer}`}>
                    <p className={`${ProductDetailStyle.emailText}`}>
                      {item?.email}
                    </p>
                    <p className={`${ProductDetailStyle.emailText}`}>
                      {/* {item?.created_at} */}
                      {item?.created_at ? new Date(item.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : ''}
                    </p>
                  </div>
                  {/* End of code - Ashlekh on 13-02-2025
                  Reason - To show email and created_at date */}
                  <Rate allowHalf disabled value={item?.rating} />
                  <p className={`${ProductDetailStyle.content}`}>
                    {item?.content}
                  </p>
                  {/* Added by - Ashlekh on 12-01-2025
                  Reason - To show email in review */}
                  {/* Commented by - Ashlekh on 13-02-2025
                  Reason - To show email above rating/star */}
                  {/* <p className={`${ProductDetailStyle.emailText}`}>
                    {item?.email}
                  </p> */}
                  {/* End of comment - Ashlekh on 13-02-2025
                  Reason - To show email above rating/star */}
                  {/* End of code - Ashlekh on 12-01-2025
                  Reason - To show email in review */}
                  {/* Code commented by - Ashlekh on 11-01-2025
                  Reason - To remove horizontal line */}
                  {/* <hr className={`${ProductDetailStyle.horizontalLine}`} /> */}
                  {/* End of comment - Ashlekh on 11-01-2025
                  Reason - To remove horizontal line */}
                </div>
              );
            })}
          </div>
          {isReviewModalOpen && (
            <div className={ProductDetailStyle.modalOverlay}>
              <div className={ProductDetailStyle.modalContainer}>
                <div className={ProductDetailStyle.modalHeader}>
                  <h2>Write a review</h2>
                  <div className="closeButton" onClick={closeReviewModal}>
                    &times;
                  </div>
                </div>

                <div className={`${ProductDetailStyle.ratingHeading}`}>
                  Please give us your rating
                </div>
                <div className={`${ProductDetailStyle.ratingContainer}`}>
                  <Rate
                    // allowHalf
                    value={rating}
                    onChange={(value) => setRating(value)}
                    className={`${ProductDetailStyle.rating}`}
                  />
                </div>
                <div className={ProductDetailStyle.modalBody}>
                  {/* Commented by - Ashlekh on 14-02-2025
                  Reason - To keep content input below email */}
                  {/* <div className={ProductDetailStyle.rowContainer}>
                    <input
                      className={ProductDetailStyle.inputShipping}
                      type="text"
                      name="content"
                      // Code changed by - Ashlekh on 04-01-2025
                      // Reason - To change name
                      // placeholder="Content"
                      placeholder="Description"
                      // End of code - Ashlekh on 04-01-2025
                      // Reason - To change name
                      value={feedBackContent}
                      onChange={(e) => {
                        setFeedBackContent(e.target.value);
                        setFeedBackContentError("");
                      }}
                      onBlur={(e) => isValidOnBlur("content", e.target.value)}
                    />
                    {feedBackContentError && (
                      <div className={ProductDetailStyle.formInputError}>
                        {feedBackContentError}
                      </div>
                    )}
                  </div> */}
                  {/* End of code - Ashlekh on 13-02-2025
                  Reason - To keep content input below email */}
                  {/* Commented by - Ashlekh on 04-01-2025
                  Reason - To remove name */}
                  {/* <div className={ProductDetailStyle.rowContainer}>
                    <input
                      className={ProductDetailStyle.inputShipping}
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setNameError("");
                      }}
                      onBlur={(e) =>
                        isValidOnBlur("name", e.target.value)
                      }
                    />
                    {nameError && (
                      <div className={ProductDetailStyle.formInputError}>
                        {nameError}
                      </div>
                    )}
                  </div> */}
                  {/* End of comment - Ashlekh on 04-01-2025
                  Reason - To remove name */}
                  <div className={ProductDetailStyle.rowContainer}>
                    <input
                      className={`${ProductDetailStyle.inputShipping} ${ProductDetailStyle.feedBackEmail}`}
                      type="text"
                      name="email"
                      value={user.email}
                      placeholder={user.email}
                      disabled={true}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError("");
                      }}
                      onBlur={(e) => isValidOnBlur("email", e.target.value)}
                    />
                    {emailError && (
                      <div className={ProductDetailStyle.formInputError}>
                        {emailError}
                      </div>
                    )}
                    {/* Added by - Ashlekh on 04-01-2025
                    Reason - To add validation message if user submits feedback from same email */}
                    {emailValidationError && (
                      <div className={ProductDetailStyle.formInputError}>
                        {emailValidationError}
                      </div>
                    )}
                    {/* End of code - Ashlekh on 04-01-2025
                    Reason - To add validation message if user submits feedback from same email */}
                  </div>
                  {/* Added by - Ashlekh on 13-02-2025
                  Reason - To add description (for review) */}
                  <div className={ProductDetailStyle.rowContainer}>
                    <input
                      className={ProductDetailStyle.inputShipping}
                      type="text"
                      name="content"
                      // placeholder="Description"
                      placeholder="Write your Feedback"
                      value={feedBackContent}
                      onChange={(e) => {
                        setFeedBackContent(e.target.value);
                        setFeedBackContentError("");
                      }}
                      onBlur={(e) => isValidOnBlur("content", e.target.value)}
                    />
                    {feedBackContentError && (
                      <div className={ProductDetailStyle.formInputError}>
                        {feedBackContentError}
                      </div>
                    )}
                  </div>
                  {/* End of code - Ashlekh on 13-02-2025
                  Reason - To add description (for review) */}
                  <div className={ProductDetailStyle.buttonContainer}>
                    <button
                      className={ProductDetailStyle.shippingSubmitButton}
                      onClick={submitFeedback}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* End of code - Ashlekh on 04-01-2025
        Reason - To add feedback */}
        {/* Added by - Ashlekh on 05-10-2024
         Reason - To display similar product */}
        <div className={`${ProductDetailStyle.similarProductContainer}`}>
          {/* Added by - Ashlekh on 07-10-2024
          Reason - To add Similar Product heading */}
          {similarProduct.length > 0 ? (
            <h2 className={ProductDetailStyle.similarProductSubHeading}>
              Similar Product
            </h2>
          ) : (
            <div></div>
          )}
          {/* End of code - Ashlekh on 07-10-2024
          Reason - To add Similar Product heading */}
          <div className={`${ProductDetailStyle.swiperContainer}`}>
            <Swiper
              slidesPerView={4}
              spaceBetween={50}
              pagination={{
                clickable: true,
              }}
              modules={[Pagination, Navigation]}
              // autoplay={{
              //   delay: 1000,
              //   disableOnInteraction: false,
              // }}
              navigation={true}
              // className="mySwiper"
              className={`${ProductDetailStyle.similarProductSwiperContainer}`}
              // Added by - Ashlekh on 27-11-2024
              // Reason - To add breakpoints of swiper for mobile view
              breakpoints={{
                0: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                721: {
                  slidesPerView: 4,
                  spaceBetween: 50,
                },
              }}
            // End of code - Ashlekh on 27-11-2024
            // Reason - To add breakpoints of swiper for mobile view
            >
              {similarProduct?.map((item, index) => {
                return (
                  <SwiperSlide key={index}>
                    <div
                      key={item.id}
                      className={`${ProductDetailStyle.gridCard}`}
                    >
                      <Link
                        to={`/productdetail/${item.product_id}`}
                        className={`${ProductDetailStyle.similarProductSubContainer}`}
                        // Added by - Ashlekh on 07-10-2024
                        // Reason - To scroll on top
                        // onClick={() => window.scrollTo(0, 0)}
                        onClick={() =>
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                      // End of code - Ashlekh on 07-10-2024
                      // Reason - To scroll on top
                      >
                        {/* Commented by jhamman on 14-10-2024
                        Reason - Added full detail below*/}
                        {/* <img
                        src={config.baseURL + item.image1}
                        className={`${ProductDetailStyle.similarProductImage}`}
                        alt=""
                      />
                      <div
                        className={`${ProductDetailStyle.similarProductName}`}>
                        {item.name}
                      </div>
                      <div
                        className={`${ProductDetailStyle.similarProductDescription}`}>
                        {item.description
                          ? item.description.substring(0, 50) + "..."
                          : ""}
                      </div> */}
                        {/* End of commentation by jhamman on 14-10-2024
                    Reason - Added full detail below*/}

                        {/* Added by jhamman on 14-10-2024
                        Reason - added card to display similer product*/}
                        <div
                          className={`${ProductDetailStyle.gridImageContainer}`}
                        >
                          <div
                            className={`${ProductDetailStyle.imageAndOfferLogoContainer}`}
                          >
                            {item.sale_percentage ? (
                              <div
                                className={ProductDetailStyle.offerContainer}
                              >
                                <p
                                  className={ProductDetailStyle.offerPercentage}
                                >
                                  {item.sale_percentage}% off
                                </p>
                              </div>
                            ) : null}
                          </div>
                          <Link
                            to={`/productdetail/${item.product_id}`}
                            className={`${ProductDetailStyle.similarProductSubContainer}`}
                            // Added by - Ashlekh on 07-10-2024
                            // Reason - To scroll on top
                            // onClick={() => window.scrollTo(0, 0)}
                            onClick={() =>
                              window.scrollTo({ top: 0, behavior: "smooth" })
                            }
                          // End of code - Ashlekh on 07-10-2024
                          // Reason - To scroll on top
                          >
                            <img
                              src={`${config.baseURL}${item.image1}`}
                              alt={item.name}
                              className={`${ProductDetailStyle.gridImage}`}
                            />
                          </Link>
                          <button
                            className={`${ProductDetailStyle.similerProductAddToCartButton}`}
                            /**Code added by Unnati on 06-01-2025
                             *Reason-Added on click functionaity */
                            onClick={
                              () =>
                                handleProductModal(
                                  item.product_id
                                  // item.color
                                )
                              // setShowModal(true)
                            }
                          /**End of code addition by Unnati on 06-01-2025
                           *Reason-Added on click functionaity */
                          >
                            Add to Cart
                          </button>
                        </div>
                        {/**Code added by Unnati on 06-01-2025
                         *Reason-Added product modal */}

                        <div className={`${ProductDetailStyle.gridContent}`}>
                          <h3 className={`${ProductDetailStyle.brandName}`}>
                            {item.name.length > 50
                              ? `${item.name.substring(0, 50)}...`
                              : item.name}
                          </h3>
                          {/* Code commented by - Ashlekh on 28-11-2024
                          Reason - To remove description */}
                          {/* <h2 className={`${ProductDetailStyle.cardTitle}`}>
                            {item.description.length > 50
                              ? `${item.description.substring(0, 50)}...`
                              : item.description}
                          </h2> */}
                          {/* End of comment - Ashlekh on 28-11-2024
                          Reason - To remove description */}
                          {/* Added by - Ashlekh on 28-11-2024
                          Reason - To display rating */}
                          <div
                            className={
                              ProductDetailStyle.productDetailContainer
                            }
                          >
                            {item.rating > 0 && <Rating value={item.rating} />}
                          </div>
                          {/* End of code - Ashlekh on 28-11-2024
                          Reason - To display rating */}
                          <div className={ProductDetailStyle.priceContainer}>
                            {item.sale_percentage ? (
                              <div
                                className={
                                  ProductDetailStyle.similerProductCardPrice
                                }
                              >
                                <p
                                  className={
                                    ProductDetailStyle.similarProductDiscountedPriceText
                                  }
                                >
                                  $
                                  {calculateDiscountFromProduct(
                                    item.sales_rate,
                                    item.sale_percentage
                                  )}
                                </p>
                              </div>
                            ) : null}
                            <div
                              className={`${ProductDetailStyle.similerProductCardPrice}`}
                            >
                              <p
                                className={
                                  ProductDetailStyle.similerProductMrpPriceText
                                }
                                style={
                                  item.sale_percentage
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
                                ${item.sales_rate}
                              </p>
                            </div>
                          </div>
                          {/**Code added by Unnati on 17-10-2024
                           *Reason-Added star rating */}
                          {/* Commented by - Ashlekh on 28-11-2024
                           Reason - To remove rating  */}
                          {/* <div
                            className={
                              ProductDetailStyle.productDetailContainer
                            }
                          >
                            {item.rating > 0 && (
                              <Rating value={item.rating} />
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
                          {/**End of code addition by Unnati on 17-10-2024
                           *Reason-Added star rating */}
                          {/* End of comment - Ashlekh on 28-11-2024
                          Reason - To remove rating */}
                        </div>
                      </Link>
                      {/* End of addition by jhamman on 14-10-2024
                        Reason - added card to display similer product*/}
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>

          </div>


        </div>
        {/* End of code - Ashlekh on 05-10-2024
         Reason - To display similar product */}

        {/* Commented by - Ashlekh on 04-01-2024
        Reason - To display feedback/review form above similar products */}
        {/* Added by - Ashlekh on 31-12-2024
        Reason - To add feedback/Review form */}
        {/* <div className={`${ProductDetailStyle.reviewContainer}`}>
          <div className={`${ProductDetailStyle.reviewTitle}`}>Customer Reviews</div>
          <div className={`${ProductDetailStyle.reviewButtonContainer}`}>
            <div className={`${ProductDetailStyle.averageRatingContainer}`}>
              <div className={`${ProductDetailStyle.averageRating}`}>{averageRating}</div>
              <div className={`${ProductDetailStyle.averageRatingText}`}>Based on {feedBackDataCount} review(s)</div>
            </div>
            {user.id != undefined && (
              <div className={`${ProductDetailStyle.reviewButton}`} onClick={openReviewModal}>
                Write a review
              </div>
            )}
          </div>
          <div className={`${ProductDetailStyle.feedBackDetailContainer}`}>
            {feedBackData?.map((item, index) => {
              return (
                <div key={index} className={`${ProductDetailStyle.feedBackItem}`}>
                  <p className={`${ProductDetailStyle.name}`}>{item?.name}</p>
                  <Rate allowHalf disabled value={item?.rating} />
                  <p className={`${ProductDetailStyle.content}`}>{item?.content}</p>
                  <hr className={`${ProductDetailStyle.horizontalLine}`}/>
                </div>
              );
            })}
          </div>
          {isReviewModalOpen && (
            <div className={ProductDetailStyle.modalOverlay}>
              <div className={ProductDetailStyle.modalContainer}>
                <div className={ProductDetailStyle.modalHeader}>
                  <h2>Write a review</h2>
                  <div className="closeButton" onClick={closeReviewModal}>
                    &times;
                  </div>
                </div>

                <div className={`${ProductDetailStyle.ratingHeading}`}>Please give us your rating</div>
                <div className={`${ProductDetailStyle.ratingContainer}`}>
                  <Rate
                    allowHalf
                    value={rating}
                    onChange={(value) => setRating(value)}
                    className={`${ProductDetailStyle.rating}`}
                  />
                </div>
                <div className={ProductDetailStyle.modalBody}>
                  <div className={ProductDetailStyle.rowContainer}>
                    <input
                      className={ProductDetailStyle.inputShipping}
                      type="text"
                      name="content"
                      placeholder="Content"
                      value={feedBackContent}
                      onChange={(e) => {
                        setFeedBackContent(e.target.value);
                        setFeedBackContentError("");
                      }}
                      onBlur={(e) =>
                        isValidOnBlur("content", e.target.value)
                      }
                    />
                    {feedBackContentError && (
                      <div className={ProductDetailStyle.formInputError}>
                        {feedBackContentError}
                      </div>
                    )}
                  </div>
                  <div className={ProductDetailStyle.rowContainer}>
                    <input
                      className={ProductDetailStyle.inputShipping}
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setNameError("");
                      }}
                      onBlur={(e) =>
                        isValidOnBlur("name", e.target.value)
                      }
                    />
                    {nameError && (
                      <div className={ProductDetailStyle.formInputError}>
                        {nameError}
                      </div>
                    )}
                  </div>
                  <div className={ProductDetailStyle.rowContainer}>
                    <input
                      className={`${ProductDetailStyle.inputShipping} ${ProductDetailStyle.feedBackEmail}`}
                      type="text"
                      name="email"
                      value={user.email}
                      placeholder={user.email}
                      disabled={true}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError("");
                      }}
                      onBlur={(e) =>
                        isValidOnBlur("email", e.target.value)
                      }
                    />
                    {emailError && (
                      <div className={ProductDetailStyle.formInputError}>
                        {emailError}
                      </div>
                    )}
                  </div>

                  <div className={ProductDetailStyle.buttonContainer}>
                    <button
                      className={ProductDetailStyle.shippingSubmitButton}
                      onClick={submitFeedback}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div> */}
        {/* End of code - Ashlekh on 31-12-2024
        Reason - To add feedback/Review form */}
        {/* End of comment - Ashlekh on 04-01-2025
        Reason - To display feedback/Review form above similar products */}
      </div>
      {/* <CartDrawer
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
      // Add more handlers as needed
      /> */}


    </div>
  );
};

export default ProductDetail;
/**End of code addition by Unnati on 23-06-2024
 * Reason-To have Product detail page
 */
