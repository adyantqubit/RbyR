import React, { useContext, useEffect, useState, useRef } from "react";
import { addToWishListAPI, getHomePageDetails, removeProductFromWishListAPI, getProductDetails, checkIfProductExistsInCart, updateCart, addToCart, getBanners } from "../../Api/services";
import homeStyle from "./Home.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import config from "../../Api/config";
import "./carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { calculateDiscountFromProduct } from "../../utils/discountedPrices";
import ReactStars from "react-stars";
import Rating from "../../components/Rating/Rating";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { GlobalContext } from "../../context/Context";
import notificationObject from "../../components/Widgets/Notification/Notification";
import { checkIsEmpty } from "../../utils/validations";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const Home = () => {
  const [homePage, setHomePage] = useState([]);
  const location = useLocation();
  const [selectedWishListIcon, setSelectedWishListIcon] = useState(false);
  const { user, wishListData, setWishListData } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [isWishListed, setIsWishListed] = useState(false);
  const [homePageBestSellingProducts, setHomePageBestSellingProducts] = useState([]);
  const [wishlistStatus, setWishlistStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [availableSizes, setAvailableSizes] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("free_size");
  const [notAvaible, setNotAvaible] = useState("");
  const [quantityMessage, setQuantityMessage] = useState("");
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [validationMessage, setValidationMessage] = useState("");
  const [sizeError, setSizeError] = useState("");
  const [patchSelection, setPatchSelection] = useState("");
  const [embroiderSelection, setEmbroiderSelection] = useState("");
  const [colorError, setColorError] = useState("");
  const [showMoreBestseller, setShowMoreBestseller] = useState(false);
  const [showMoreFeatured, setShowMoreFeatured] = useState(false);
  const featuredproductsContainerRef = useRef(null);
  const featuredtopRef = useRef(null);
  const bestsellerproductsContainerRef = useRef(null);
  const bestsellertopRef = useRef(null);
  const { refreshCartData, setCartData } = useContext(GlobalContext);

  const [banners, setBanners] = useState([]);
  const [formData, setFormData] = useState({
    logo: false,
    patches: false,
    security_batches: false,
    security_id_on_back: false,
    printed_id: false,
    embroider: false,
    customization_comment: "",
    logo_price: "",
    patches_price: "",
    security_batches_price: "",
    security_id_on_back_price: "",
    printed_id_price: "",
    embroider_price: "",
    after_customization_product_price: "",
  });
  let currentTimeAndDate = Date.now();

  const handleFeaturedProductsViewMoreClick = () => {
    setShowMoreFeatured(!showMoreFeatured);
    if (showMoreFeatured && featuredtopRef.current) {
      featuredtopRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (!showMoreFeatured && featuredproductsContainerRef.current) {
      featuredproductsContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBestsellerProductsViewMoreClick = () => {
    setShowMoreBestseller(!showMoreBestseller);
    if (showMoreBestseller && bestsellertopRef.current) {
      bestsellertopRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (!showMoreBestseller && bestsellerproductsContainerRef.current) {
      bestsellerproductsContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

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

  useEffect(() => {
    const firstAvailableSize = ["M", "L", "XL", "XXL", "XXXL", "S", "XS"].find(
      (size) => isSizeAvailable(size)
    );
    if (selectedProduct?.is_free_size) {
      setSelectedSize("free_size");
    }
    if (!selectedProduct?.is_free_size) {
      setSelectedSize(null);
    }
    if (firstAvailableSize) {
      setSelectedSize(firstAvailableSize);
    }
  }, [availableSizes]);

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
      security_id_on_back: false,
      printed_id: false,
      embroider: false,
      logo_price: "",
      patches_price: "",
      security_batches_price: "",
      security_id_on_back_price: "",
      printed_id_price: "",
      embroider_price: "",
      after_customization_product_price: "",
      customization_comment: "",
    }));
    setAvailabilityMessage("");
    setQuantityMessage("");
  };

  const isSizeAvailable = (size) => {
    return availableSizes[size] > 0;
  };

  const handleSelectChange = (size) => {
    setSelectedSize(size);
    setQuantityMessage("");
    setQuantity(1);
    const stock = availableSizes[size];
    updateAvailabilityMessage(size, stock);
    setSizeError("");
    setFormData((prev) => ({ ...prev }));
  };

  useEffect(() => {
    const fetchHomePageDetails = async () => {
      try {
        const data = await getHomePageDetails();
        setHomePage(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchHomePageDetails();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  }, [location]);

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

  const handleProductModal = async (product_id, color) => {
    setShowProductModal(true);
    setSelectedItem(product_id);
    const response = await getProductDetails(product_id, color);
    setProducts(response.products);
    const distintColor = [...new Set(response.products.map((product) => product.color))];
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

  const updateAvailabilityMessage = (size, stock) => {
    if (stock === 0) {
      setAvailabilityMessage(`${size} is not available`);
    } else if (stock < 10) {
      setAvailabilityMessage(`Only a few quantity left in ${size}`);
    } else {
      setAvailabilityMessage("");
    }
  };

  const uniqueColors = [...new Set(products.map((product) => product.color))];
  useEffect(() => {
    if (!selectedColor && uniqueColors.length > 0) {
      setSelectedColor(uniqueColors[0]);
    }
  }, [uniqueColors, selectedColor]);

  const closeModal = () => {
    setShowProductModal(false);
    setNotAvaible("");
  };

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
      if (selectedProduct.is_free_size) {
        setQuantityMessage('No Stock available for this item')
      } else {
        setQuantityMessage(`Only ${stock} items available in ${selectedSize}.`);
      }
    }
  };

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

  const addToCartDetails = async (e) => {
    e.preventDefault();
    const { logo, patches, security_batches, security_id_on_back, printed_id, embroider, customization_comment } = formData;
    let basePrice = parseFloat(selectedProduct?.sales_rate) || 0;
    if (selectedProduct.sale_percentage) {
      basePrice = selectedProduct?.sales_rate - ((selectedProduct?.sales_rate * selectedProduct?.sale_percentage) / 100)
    }
    if (logo) basePrice += parseFloat(selectedProduct.logo_price);
    if (patches) basePrice += parseFloat(selectedProduct.patches_price);
    if (security_batches) basePrice += parseFloat(selectedProduct.security_batches_price);
    if (printed_id) basePrice += parseFloat(selectedProduct.printed_id_price);
    if (security_id_on_back) basePrice += parseFloat(selectedProduct.security_id_on_back_price);
    if (embroider) basePrice += parseFloat(selectedProduct.embroider_price);

    let customizationPrice = basePrice;
    const formattedCustomizationPrice = isNaN(customizationPrice) ? "0.00" : customizationPrice.toFixed(2);

    if (selectedSize == null || selectedSize === undefined) {
      setNotAvaible("Product not available");
    }
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
        xs_patches: selectedSize === "XS" ? patchSelection === "Yes" ? true : false : false,
        s_patches: selectedSize === "S" ? patchSelection === "Yes" ? true : false : false,
        m_patches: selectedSize === "M" ? patchSelection === "Yes" ? true : false : false,
        l_patches: selectedSize === "L" ? patchSelection === "Yes" ? true : false : false,
        xl_patches: selectedSize === "XL" ? patchSelection === "Yes" ? true : false : false,
        xxl_patches: selectedSize === "XXL" ? patchSelection === "Yes" ? true : false : false,
        xxxl_patches: selectedSize === "XXXL" ? patchSelection === "Yes" ? true : false : false,
        xs_embroider: selectedSize === "XS" ? embroiderSelection === "Yes" ? true : false : false,
        s_embroider: selectedSize === "S" ? embroiderSelection === "Yes" ? true : false : false,
        m_embroider: selectedSize === "M" ? embroiderSelection === "Yes" ? true : false : false,
        l_embroider: selectedSize === "L" ? embroiderSelection === "Yes" ? true : false : false,
        xl_embroider: selectedSize === "XL" ? embroiderSelection === "Yes" ? true : false : false,
        xxl_embroider: selectedSize === "XXL" ? embroiderSelection === "Yes" ? true : false : false,
        xxxl_embroider: selectedSize === "XXXL" ? embroiderSelection === "Yes" ? true : false : false,
        after_customization_product_price: formattedCustomizationPrice,
        customization_comment: formData.customization_comment,
        logo: formData.logo,
        patches: formData.patches,
        security_batches: formData.security_batches,
        security_id_on_back: formData.security_id_on_back,
        printed_id: formData.printed_id,
        embroider: formData.embroider,
        logo_price: parseFloat(selectedProduct?.logo_price) || "0.00",
        patches_price: parseFloat(selectedProduct?.patches_price) || "0.00",
        security_batches_price: parseFloat(selectedProduct?.security_batches_price) || "0.00",
        security_id_on_back_price: parseFloat(selectedProduct?.security_id_on_back_price) || "0.00",
        printed_id_price: parseFloat(selectedProduct?.printed_id_price) || "0.00",
        embroider_price: parseFloat(selectedProduct?.embroider_price) || "0.00",
        size: selectedSize,
        quantity: quantity,
      };
      setFormData((prevState) => ({
        ...prevState,
        after_customization_product_price: formData.after_customization_product_price,
        customization_comment: formData.customization_comment,
        logo: formData.logo,
        patches: formData.patches,
        security_batches: formData.security_batches,
        security_id_on_back: formData.security_id_on_back,
        printed_id: formData.printed_id,
        embroider: formData.embroider,
        logo_price: formData.logo_price,
        patches_price: formData.patches_price,
        security_batches_price: formData.security_batches_price,
        security_id_on_back_price: formData.security_id_on_back_price,
        printed_id_price: formData.printed_id_price,
        embroider_price: formData.embroider_price,
      }));

      if (user && user.id) {
        data.user = user.id;
        try {
          const response = await checkIfProductExistsInCart(selectedProduct.id, user.id, data);
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
            localStorage.setItem("cartData", JSON.stringify(updateResponse.cartData));
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
          xs_patches: selectedSize === "XS" ? patchSelection === "Yes" ? true : false : false,
          s_patches: selectedSize === "S" ? patchSelection === "Yes" ? true : false : false,
          m_patches: selectedSize === "M" ? patchSelection === "Yes" ? true : false : false,
          l_patches: selectedSize === "L" ? patchSelection === "Yes" ? true : false : false,
          xl_patches: selectedSize === "XL" ? patchSelection === "Yes" ? true : false : false,
          xxl_patches: selectedSize === "XXL" ? patchSelection === "Yes" ? true : false : false,
          xxxl_patches: selectedSize === "XXXL" ? patchSelection === "Yes" ? true : false : false,
          xs_embroider: selectedSize === "XS" ? embroiderSelection === "Yes" ? true : false : false,
          s_embroider: selectedSize === "S" ? embroiderSelection === "Yes" ? true : false : false,
          m_embroider: selectedSize === "M" ? embroiderSelection === "Yes" ? true : false : false,
          l_embroider: selectedSize === "L" ? embroiderSelection === "Yes" ? true : false : null,
          xl_embroider: selectedSize === "XL" ? embroiderSelection === "Yes" ? true : false : false,
          xxl_embroider: selectedSize === "XXL" ? embroiderSelection === "Yes" ? true : false : false,
          xxxl_embroider: selectedSize === "XXXL" ? embroiderSelection === "Yes" ? true : false : false,
          after_customization_product_price: formData.after_customization_product_price,
          customization_comment: formData.customization_comment,
          logo: formData.logo,
          patches: formData.patches,
          security_batches: formData.security_batches,
          security_id_on_back: formData.security_id_on_back,
          printed_id: formData.printed_id,
          embroider: formData.embroider,
          logo_price: formData.logo_price,
          patches_price: formData.patches_price,
          security_batches_price: formData.security_batches_price,
          security_id_on_back_price: formData.security_id_on_back_price,
          printed_id_price: formData.printed_id_price,
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
              cartItem.security_id_on_back === productDetail.security_id_on_back &&
              cartItem.printed_id === productDetail.printed_id &&
              cartItem.embroider === productDetail.embroider &&
              cartItem.color === productDetail.color
            ) {
              doesItemExist = true;
              return {
                ...cartItem,
                logo: productDetail.logo,
                patches: productDetail.patches,
                security_batches: productDetail.security_batches,
                security_id_on_back: productDetail.security_id_on_back,
                printed_id: productDetail.printed_id,
                embroider: productDetail.embroider,
                size: productDetail.size,
                quantity: cartItem.quantity + productDetail.quantity,
                logo_price: productDetail.logo_price,
                patches_price: productDetail.patches_price,
                security_batches_price: productDetail.security_batches_price,
                security_id_on_back_price: productDetail.security_id_on_back_price,
                printed_id_price: productDetail.printed_id_price,
                embroider_price: productDetail.embroider_price,
                after_customization_product_price: parseFloat(cartItem.after_customization_product_price),
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
        security_id_on_back: false,
        printed_id: false,
        embroider: false,
        logo_price: "",
        patches_price: "",
        security_batches_price: "",
        security_id_on_back_price: "",
        printed_id_price: "",
        embroider_price: "",
        after_customization_product_price: "",
        customization_comment: "",
      }));
      setShowProductModal(false);
      setNotAvaible("");
    }
    setPatchSelection("");
    setEmbroiderSelection("");
    setQuantity(1);
    if (!selectedProduct.is_free_size) {
      setSelectedSize("");
    }
    setAvailabilityMessage("");
    setQuantityMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addToCartDetails(e);
  };

  useEffect(() => {
    if (selectedItem && selectedProduct?.is_free_size) {
      setSelectedSize("free_size");
      handleSelectChange("free_size");
    }
  }, [selectedProduct?.is_free_size, selectedItem]);

  // const banners = [
  //   {
  //     src: "https://manishmalhotra.in/cdn/shop/files/MM-Home-Slideshow-Video-Main-Desktop-Slider-07-Final-Updated.webp?v=1758811597&width=1920",
  //     title: "EVARA 2024",
  //     subtitle: "Embracing Opulence and Artistry",
  //   },
  //   {
  //     src: "https://manishmalhotra.in/cdn/shop/files/MM-Home-Slideshow-Video-Main-Desktop-Slider-02-Final-Updated.webp?v=1758811521&width=1920",
  //     title: "THE GOLD EDIT",
  //     subtitle: "Where Tradition Meets Modern Glamour",
  //   },

  // ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 1200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true,
    arrows: false,
    pauseOnHover: false,
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await getBanners();
        if (data && Array.isArray(data)) {
          setBanners(data);
        }
      } catch (err) {
        console.error("Error fetching banners:", err);
      }
    };

    fetchBanners();
  }, []);

  return (
    <div className={`${homeStyle.pageFrame}`}>
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "30vh" }}>
          <img style={{ height: "30vh" }} src="adyant_loader.gif" />
        </div>
      ) : (
        <div>


            {banners.length > 0 ? (
        <div className={homeStyle.pageFrameBanner}>
          <Slider {...settings}>
            {banners.map((item, index) => (
              <div key={index} className={homeStyle.bannerSlide}>
                <img
                  src={
                    item.banner_image?.startsWith("http")
                      ? item.banner_image
                      : `${config.baseURL}${item.banner_image}`
                  }
                  alt={`Banner ${index}`}
                  className={homeStyle.bannerImage}
                />
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <div style={{ marginTop: "6%" }}></div>
      )}
          <div className={`${homeStyle.banners}`}>
            <div className={`${homeStyle.detailBox}`}>
              <Carousel
                showThumbs={false}
                showStatus={false}
                useKeyboardArrows={true}
                autoPlay={true}
                stopOnHover={true}
                swipeable={true}
                dynamicHeight={true}
                emulateTouch={true}
                showIndicators={true}
                showArrows={true}
              >
                {homePage.banner &&
                  homePage.banner
                    .filter((item) => item.banner_options === "Medium")
                    .map((item) => (
                      <Link to="/saleproducts" state={item.id} key={item.id}>
                        <div className={`${homeStyle.banner}`}>
                          <img
                            src={`${config.baseURL}${item.banner_image}`}
                            alt={`Banner ${item.id}`}
                            className={`${homeStyle.bannerImage}`}
                          />
                        </div>
                      </Link>
                    ))}
              </Carousel>
            </div>
            {homePage.banner &&
              homePage.banner.some(
                (item) => item.banner_options === "Small"
              ) && (
                <div className={`${homeStyle.FourBanners}`}>
                  {homePage.banner
                    .filter((item) => item.banner_options === "Small")
                    .map((item) => (
                      <div key={item.id} className={`${homeStyle.bannerContainer}`}>
                        <Link to="/saleproducts" state={item.id} key={item.id}>
                          <div>
                            <img src={`${config.baseURL}${item.banner_image}`} alt={`Banner ${item.id}`} className={`${homeStyle.bannerImage}`} />
                          </div>
                        </Link>
                      </div>
                    ))}
                </div>
              )}
          </div>
          <div className={`${homeStyle.page}`}>
            <div className={`${homeStyle.coloredBackground}`}>
              {homePage.best_selling_products?.length > 0 ? (
                <div className={`${homeStyle.title}`}>
                  <h3 className={`${homeStyle.heading}`}>Bestsellers</h3>
                </div>
              ) : ("")}
              {homePage.banner &&
                homePage.banner
                  .filter((item) => item.banner_type === "Bestseller" && item.banner_options === "Large")
                  .map((item) => (
                    <Link to="/saleproducts" state={item.id} key={item.id}>
                      <div key={item.id} className={`${homeStyle.featuredBanner}`}>
                        <img src={`${config.baseURL}${item.banner_image}`} alt={`Banner ${item.id}`} className={`${homeStyle.featuredBannerImage}`} />
                      </div>
                    </Link>
                  ))}
              <div ref={bestsellertopRef}></div>
              {homePage.best_selling_products?.length > 4 && (
                <div className={`${homeStyle.viewMoreContainer}`}>
                  <div className={`${homeStyle.viewMoreButton}`} onClick={handleBestsellerProductsViewMoreClick}>
                    {showMoreBestseller ? (
                      <p className={homeStyle.icon}>View Less <FaChevronUp /></p>
                    ) : (
                      <p className={homeStyle.icon}>View More <FaChevronDown /></p>
                    )}
                  </div>
                </div>
              )}
              <div className={`${homeStyle.gridContainer}`} ref={bestsellerproductsContainerRef}>
                {homePage.best_selling_products &&
                  homePage.best_selling_products.slice(0, showMoreBestseller ? homePage.best_selling_products.length : 4).map((product) => (
                    <div key={product.id} className={`${homeStyle.gridCard}`}>
                      <div className={`${homeStyle.gridImageContainer}`}>
                        <Link to={`/productdetail/${product.product_id}`} state={product.color}>
                          <div className={`${homeStyle.imageAndOfferLogoContainer}`}>
                            {product.sale_percentage ? (
                              <div className={homeStyle.offerContainer}>
                                <p className={homeStyle.offerPercentage}>
                                  {product.sale_percentage}% off
                                </p>
                              </div>
                            ) : null}
                            <div className={homeStyle.imageWrapper}>
                              <img src={`${config.baseURL}${product.image1}`} alt={product.name} className={`${homeStyle.gridImage}`} />
                              <img
                                src={`${config.baseURL}${product.image2}`}
                                alt={product.name}
                                className={`${homeStyle.gridImage} ${homeStyle.image2}`}
                              />
                            </div>
                          </div>
                        </Link>
                        <button className={`${homeStyle.addToCartButton}`} onClick={() => handleProductModal(product.product_id, product.color)}>Add to Cart</button>
                      </div>
                      {showProductModal && selectedItem == product.product_id && (
                        <div className={`${homeStyle.productModalOverlay}`} onClick={closeModal}>
                          <div className={`${homeStyle.productModalContent}`} onClick={(e) => e.stopPropagation()}>
                            <button className={`${homeStyle.closeButton}`} onClick={closeModal}><IoCloseSharp /></button>
                            <div className={homeStyle.name}> {selectedProduct?.name}</div>
                            <div className={homeStyle.saleRate}>
                              {selectedProduct?.sale_percentage ? (
                                <div className={homeStyle.productPrice}>
                                  {config.currency_icon}{calculateDiscountFromProduct(selectedProduct?.sales_rate, selectedProduct?.sale_percentage)}
                                </div>
                              ) : (
                                <div className={homeStyle.productPrice}>
                                  {config.currency_icon}{selectedProduct?.sales_rate}
                                </div>
                              )}
                              {selectedProduct?.sale_percentage ? (
                                <div className={`${homeStyle.cardPrice}`}>
                                  <p className={homeStyle.mrpPriceText} style={{ textDecoration: "line-through", textDecorationColor: "#000", color: "red" }}>
                                    {config.currency_icon}{selectedProduct?.sales_rate}
                                  </p>
                                </div>
                              ) : null}
                            </div>
                            {selectedProduct?.sale_percentage ? (
                              <div className={homeStyle.productOfferContainer}>
                                <p className={homeStyle.productOfferPercentage}>
                                  {selectedProduct?.sale_percentage}% off
                                </p>
                              </div>
                            ) : null}
                            <div className={homeStyle.productColors}>
                              {uniqueColors.map((color) => (
                                <div
                                  key={color}
                                  className={`${homeStyle.colorOption} ${selectedColor === color ? homeStyle.activeColorOption : ""}`}
                                  style={{ backgroundColor: color }}
                                  onClick={() => handleColorSelect(color)}
                                ></div>
                              ))}
                            </div>
                            {!selectedProduct?.is_free_size ? (
                              <div className={homeStyle.sizeMessage}>
                                <label htmlFor="sizeBoxes">Size</label>
                                <p className={homeStyle.availabilityMessage}>{availabilityMessage}</p>
                              </div>
                            ) : null}
                            {!selectedProduct?.is_free_size && (
                              <div className={homeStyle.sizeBoxes}>
                                {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
                                  <div
                                    key={size}
                                    className={`${homeStyle.sizeBox} ${selectedSize === size ? homeStyle.selectedSizeBox : ""} ${!isSizeAvailable(size) ? homeStyle.unavailableSizeBox : ""}`}
                                    onClick={() => isSizeAvailable(size) && handleSelectChange(size)}
                                  >{size}</div>
                                ))}
                              </div>
                            )}
                            {/* {selectedProduct?.show_patches_and_embroider_on_UI &&
                              (selectedProduct?.logo_price || selectedProduct?.patches_price || selectedProduct?.security_batches_price || selectedProduct?.embroider_price || selectedProduct?.security_id_on_back_price || selectedProduct?.printed_id_price) ? (
                              <h5 className={`${homeStyle.popupContent}`}>Customization Options</h5>
                            ) : null} */}
                            {/* <div className={homeStyle.checkboxGroup}>
                              {selectedProduct?.show_patches_and_embroider_on_UI && (selectedProduct.logo_price) ? (
                                <label className={homeStyle.reason}>
                                  <input type="checkbox" name="logo" checked={formData.logo} onChange={handleChange} className={`${homeStyle.checkBox}`} />{" "}Logo + ${selectedProduct?.logo_price}
                                </label>
                              ) : null}
                              {selectedProduct?.show_patches_and_embroider_on_UI && (selectedProduct.patches_price) ? (
                                <label className={homeStyle.reason}>
                                  <input type="checkbox" name="patches" checked={formData.patches} onChange={handleChange} className={`${homeStyle.checkBox}`} />{" "}Patches / Batches + ${selectedProduct?.patches_price}
                                </label>
                              ) : null}
                              {selectedProduct?.show_patches_and_embroider_on_UI && (selectedProduct.security_batches_price) ? (
                                <label className={homeStyle.reason}>
                                  <input type="checkbox" name="security_batches" checked={formData.security_batches} onChange={handleChange} className={`${homeStyle.checkBox}`} />{" "}Security ID on Back and Chest + ${selectedProduct?.security_batches_price}
                                </label>
                              ) : null}
                              {selectedProduct?.show_patches_and_embroider_on_UI && (selectedProduct.security_id_on_back_price) ? (
                                <label className={homeStyle.reason}>
                                  <input type="checkbox" name="security_id_on_back" checked={formData.security_id_on_back} onChange={handleChange} className={`${homeStyle.checkBox}`} />{" "}Security ID on Back + ${selectedProduct?.security_id_on_back_price}
                                </label>
                              ) : null}
                              {selectedProduct?.show_patches_and_embroider_on_UI && (selectedProduct.printed_id_price) ? (
                                <label className={homeStyle.reason}>
                                  <input type="checkbox" name="printed_id" checked={formData.printed_id} onChange={handleChange} className={`${homeStyle.checkBox}`} />{" "}Printed ID + ${selectedProduct?.printed_id_price}
                                </label>
                              ) : null}
                              {selectedProduct?.show_patches_and_embroider_on_UI && (selectedProduct.embroider_price) ? (
                                <label className={homeStyle.reason}>
                                  <input type="checkbox" name="embroider" checked={formData.embroider} onChange={handleChange} className={`${homeStyle.checkBox}`} />{" "}Embroider + ${selectedProduct?.embroider_price}
                                </label>
                              ) : null}
                            </div> */}
                            {validationMessage && (
                              <div style={{ color: "red", marginBottom: "10px" }}>
                                {validationMessage}
                              </div>
                            )}
                            {selectedProduct?.show_patches_and_embroider_on_UI &&
                              (selectedProduct?.logo_price || selectedProduct?.patches_price || selectedProduct?.security_batches_price || selectedProduct?.embroider_price || selectedProduct?.security_id_on_back_price || selectedProduct?.printed_id_price) ? (
                              <div className={homeStyle.commentBox}>
                                <textarea name="customization_comment" placeholder="Comment" className={homeStyle.commentInput} value={formData.customization_comment} onChange={handleChange} />
                              </div>
                            ) : null}
                            <p className={homeStyle.availabilityMessage}>{notAvaible}</p>
                            <div style={{ display: "flex", justifyContent: "center" }}></div>
                            <div className={homeStyle.quantityContainer}>
                              <div style={{ display: "flex", gap: "8px", alignItems: "center" }} >
                                <div className={homeStyle.quantity}>
                                  <label>Qty</label>
                                </div>
                                <div className={homeStyle.quantityInput} onClick={QuantityMessage}>
                                  <p className={homeStyle.quantityButton} onClick={handleDecrement}>-</p>
                                  <input type="number" inputMode="numeric" className={homeStyle.quantityNumber} value={quantity} onChange={handleQuantityChange} onPaste={(e) => e.preventDefault()} onCopy={(e) => e.preventDefault()} onKeyDown={(e) => { if (e.key == "+" || e.key == "e" || e.key == "-") { e.preventDefault(); } }} />
                                  <p className={homeStyle.quantityButton} onClick={handleIncrement}>+</p>
                                </div>
                              </div>
                              <div className={homeStyle.addToCartPhoneView}>
                                <button className={`${homeStyle.addToCartButton} ${homeStyle.addToCartButtonPopup}`} onClick={handleSubmit}>Add to Cart</button>
                              </div>
                              <p className={homeStyle.availabilityMessage}>{quantityMessage}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className={`${homeStyle.gridContent}`}>
                        <Link to={`/productdetail/${product.product_id}`}>
                          <div className={`${homeStyle.brandName}`}>
                            {product.name.length > 50 ? `${product.name.substring(0, 50)}...` : product.name}
                          </div>
                        </Link>
                        <div className={`${homeStyle.rating}`}>
                          {product.rating > 0 && (<Rating value={product.rating} />)}
                        </div>
                        <Link to={`/productdetail/${product.product_id}`}>
                          <div className={homeStyle.priceContainer}>
                            {product.sale_percentage ? (
                              <div className={homeStyle.cardPrice}>
                                <p className={homeStyle.discountedPriceText}>{config.currency_icon}{calculateDiscountFromProduct(product.sales_rate, product.sale_percentage)}</p>
                              </div>
                            ) : null}
                            <div className={`${homeStyle.cardPrice}`}>
                              <p className={homeStyle.mrpPriceText} style={product.sale_percentage ? { textDecoration: "line-through", textDecorationColor: "#888888", color: "#888888" } : { color: "red" }}>{config.currency_icon}{product.sales_rate}</p>
                            </div>
                          </div>
                        </Link>
                        <div className={homeStyle.productDetailContainer}>
                          {user.id != undefined && (
                            <div className={`${homeStyle.wishListIconContainer}`}>
                              {wishlistStatus[`${product.product_id}-${product.color}`] ? (
                                <MdFavorite onClick={() => handleToggleWishList(user, product)} className={`${homeStyle.wishListIcon1}`} />
                              ) : (
                                <MdFavoriteBorder onClick={() => handleToggleWishList(user, product)} className={`${homeStyle.wishListIcon2}`} />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className={`${homeStyle.featuredContainer}`}>
              {(homePage?.banner?.some((banner) => banner.banner_options === "Large") || homePage?.featured_products?.length > 0) && (
                <div className={`${homeStyle.title}`}>
                  <h3 className={`${homeStyle.heading}`}>Featured Products</h3>
                </div>
              )}
              {homePage.banner &&
                homePage.banner
                  .filter((item) => item.banner_type === "Featured" && item.banner_options === "Large")
                  .map((item) => (
                    <Link to="/saleproducts" state={item.id} key={item.id}>
                      <div key={item.id} className={`${homeStyle.featuredBanner}`}>
                        <img src={`${config.baseURL}${item.banner_image}`} alt={`Banner ${item.id}`} className={`${homeStyle.featuredBannerImage}`} />
                      </div>
                    </Link>
                  ))}
              <div ref={featuredtopRef}></div>
              {homePage.featured_products?.length > 4 && (
                <div className={`${homeStyle.viewMoreContainer}`}>
                  <div className={`${homeStyle.viewMoreButton}`} onClick={handleFeaturedProductsViewMoreClick}>
                    {showMoreFeatured ? (
                      <p className={homeStyle.icon}>View Less <FaChevronUp /></p>
                    ) : (
                      <p className={homeStyle.icon}>View More <FaChevronDown /></p>
                    )}
                  </div>
                </div>
              )}
              <div className={`${homeStyle.gridContainer}`} ref={featuredproductsContainerRef}>
                {homePage.featured_products &&
                  homePage.featured_products.slice(0, showMoreFeatured ? homePage.featured_products.length : 4).map((product) => (
                    <div key={product.id} className={`${homeStyle.gridCard}`}>
                      <div className={`${homeStyle.gridImageContainer}`}>
                        <Link to={`/productdetail/${product.product_id}`} state={product.color}>
                          <div className={`${homeStyle.imageAndOfferLogoContainer}`}>
                            {product.sale_percentage ? (
                              <div className={homeStyle.offerContainer}>
                                <p className={homeStyle.offerPercentage}>{product.sale_percentage}% off</p>
                              </div>
                            ) : null}
                            <div className={homeStyle.imageWrapper}>
                              <img src={`${config.baseURL}${product.image1}`} alt={product.name} className={`${homeStyle.gridImage}`} />
                              <img
                                src={`${config.baseURL}${product.image2}`}
                                alt={product.name}
                                className={`${homeStyle.gridImage} ${homeStyle.image2}`}
                              />
                            </div>
                          </div>

                        </Link>
                        <button className={`${homeStyle.addToCartButton}`} onClick={() => handleProductModal(product.product_id, product.color)}>Add to Cart</button>
                      </div>
                      <div className={`${homeStyle.gridContent}`}>
                        <Link to={`/productdetail/${product.product_id}`}>
                          <div className={`${homeStyle.brandName}`}>
                            {product.name.length > 50 ? `${product.name.substring(0, 50)}...` : product.name}
                          </div>
                        </Link>
                        <div className={`${homeStyle.rating}`}>
                          {product.rating > 0 && (<Rating value={product.rating} />)}
                        </div>
                        <Link to={`/productdetail/${product.product_id}`}>
                          <div className={homeStyle.priceContainer}>
                            {product.sale_percentage ? (
                              <div className={homeStyle.cardPrice}>
                                <p className={homeStyle.discountedPriceText}>{config.currency_icon}{calculateDiscountFromProduct(product.sales_rate, product.sale_percentage)}</p>
                              </div>
                            ) : null}
                            <div className={`${homeStyle.cardPrice}`}>
                              <p className={homeStyle.mrpPriceText} style={product.sale_percentage ? { textDecoration: "line-through", textDecorationColor: "#888888", color: "#888888" } : { color: "red" }}>{config.currency_icon}{product.sales_rate}</p>
                            </div>
                          </div>
                        </Link>
                        <div className={homeStyle.productDetailContainer}>
                          {user.id != undefined && (
                            <div className={`${homeStyle.wishListIconContainer}`}>
                              {wishlistStatus[`${product.product_id}-${product.color}`] ? (
                                <MdFavorite onClick={() => handleToggleWishList(user, product)} className={`${homeStyle.wishListIcon1}`} />
                              ) : (
                                <MdFavoriteBorder onClick={() => handleToggleWishList(user, product)} className={`${homeStyle.wishListIcon2}`} />
                              )}
                            </div>
                          )}
                          <dic></dic>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Home;
