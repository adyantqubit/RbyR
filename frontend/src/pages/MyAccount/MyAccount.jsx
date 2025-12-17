/**Code added by Unnati on 02-08-2024
 * Reason-To have my account page
 */
import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Styles from "./MyAccount.module.css";
import { GlobalContext } from "../../context/Context";
import ProfileEdit from "../Profile/ProfileEdit";
import OrderHistory from "../OrderHistory/OrderHistory";
import NavigationPath from "../../components/NavigationPath/NavigationPath";
import { DateFormatter } from "../../utils/DateFormat";
import {
  getUserAddress,
  updateUserAddress,
  removeAddress,
  UpdateShippingAddress,
  UserAddress,
} from "../../Api/services";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import {
  checkIsPhoneNoInvalid,
  checkIsNotADigit,
  checkIsEmpty,
} from "../../utils/validations";
import { State } from "country-state-city";
import { useRef } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import OrderItems from "../OrderItems/OrderItems";
const MyAccount = () => {
  const [activeTab, setActiveTab] = useState("account");
  const { user } = useContext(GlobalContext);
  const [shippingAddress, setShippingAddress] = useState([]);
  const [contactNumberError, setContactNumberError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [cityError, setCityError] = useState("");
  const [stateError, setStateError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [zipCodeError, setZipCodeError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [shippingChoosenState, setShippingChoosenState] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [formData, setFormData] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    company: "",
    address: "",
    city: "",
    country: "United States",
    state: "",
    zipcode: "",
    contact_number: "",
  });
  const scrollDoc = () => {
    window.scrollTo(0, 0);
  };
  /**Code added by Unnati on 07-10-2024
   * Reason-To navigate to address through location
   */
  const location = useLocation();

  /* Added by jhamman on 18-10-2024
  Reason - we want to set orders active tab when come back from orderDetails page*/
  // Added by - Ashlekh on 02-12-2024
  // Reason - To get value from Header1.jsx 
  const { myOrder } = location?.state || {};
  // End of code - Ashlekh on 02-12-2024
  // Reason - To get value from Header1.jsx
  // Added by - Ashlekh on 12-12-2024
  // Reason - To get value from Footer
  const { myAccount } = location?.state || {};
  // End of code - Ashlekh on 12-12-2024
  // Reason - To get value from footer
  // Added by - Ashlekh on 17-12-2024
  // Reason - useState for storing validation message 
  const [addressValidationMessageId, setAddressValidationMessageId] = useState(null);
  // End of code - Ashlekh on 17-12-2024
  // Reason - useState for storing validation message
  // Added by - Ashlekh on 30-12-2024
  // Reason - Usestate to handle open/close address form
  const [isShippingAddressModalOpen, setIsShippingAddressModalOpen] = useState(false);
  // End of code - Ashlekh on 30-12-2024
  // Reason - Usestate to handle open/close address form
  // Added by - Ashlekh on 31-12-2024
  // Reason - To use various useState (used in saving shipping address)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [choosenState, setChoosenState] = useState("");
  const [states, setStates] = useState([]);
  const [userAddress, setUserAddress] = useState([]);
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState(0);
  // End of code - Ashlekh on 31-12-2024
  // Reason - To use various useState (used in saving shipping address)
  useEffect(() => {
    const path = sessionStorage.getItem("path");

    const orderDetailRegex = /\/orderdetail\/\d+/;

    if (orderDetailRegex.test(path)) {
      setActiveTab("orders");
    }
  }, [location.pathname]);
  /* End of addition by jhamman on 18-10-2024
  Reason - we want to set orders active tab when come back from orderDetails page*/

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
    // Added by - Ashlekh on 12-12-2024
    // Reason - To add condition (if user clicks on {My account} or {My Order} then to open {My Account} tab or {My Order} tab)
    else if (myOrder == "orders"){
      setActiveTab("orders");
    }
    else if (myAccount == "account"){
      setActiveTab("account");
    }
    // End of code - Ashlekh on 12-12-2024
    // Reason - To add condition (if user clicks on {My account} or {My Order} then to open {My Account} tab or {My Order} tab)
  }, [location.state]);
  /**End of code addition by Unnati on 07-10-2024
   * Reason-To navigate to address through location
   */

  /**Code added by Unnati on 23-09-2024
   * Reason-To check whether user is there or not
   */
  useEffect(() => {
    if (!localStorage.getItem("access")) {
      navigate("/login");
    }
  }, [user]);
  /**End of code addition by Unnati on 23-09-2024
   * Reason-To check whether user is there or not
   */

  /**Code added by Unnati on 16-09-2024
   * Reason-To add valid on blur
   */
  const isValidOnBlur = (input, value) => {
    if (input === "first_name") {
      if (checkIsEmpty(value)) {
        setFirstNameError("Please enter first name");
        return false;
      }
    }
    if (input === "address") {
      if (checkIsEmpty(value)) {
        setAddressError("Please enter address");
        return false;
      }
    }
    if (input === "city") {
      if (checkIsEmpty(value)) {
        setCityError("Please enter city");
        return false;
      }
    }

    if (input === "state") {
      if (checkIsEmpty(value)) {
        setStateError("Please enter state");
        return false;
      }
    }
    if (input === "zipcode") {
      if (checkIsEmpty(value)) {
        setZipCodeError("Please enter zipcode");
        return false;
      }
    }
    if (input === "contact_number") {
      if (checkIsEmpty(value)) {
        setContactNumberError("Please enter contact number");
        return false;
      } 
      // Commented by - Ashlekh on 28-12-2024
      // Reason - Contact number can be alpha-numeric
      // else {
      //   if (!checkIsPhoneNoInvalid(value)) {
      //     setContactNumberError("Please enter a valid contact number");
      //     return false;
      //   }
      // }
      // End of comment - Ashlekh on 28-12-2024
      // Reason - Contact number can be alpha-numeric
    }
  };
  /**End of code addition by Unnati on 16-09-2024
   * Reason-To add valid on blur
   */
  /**Code added by Unnati on 16-09-2024
   * Reason-To add valid on submit
   */
  const isValidOnSubmit = (data) => {
    let isValid = true;
    if (checkIsEmpty(data.shippingAddress.first_name)) {
      setFirstNameError("Please enter first name");
      isValid = false;
    } else if (!checkIsNotADigit(data.shippingAddress.first_name)) {
      setFirstNameError("Please enter a valid first name");
      isValid = false;
    }

    if (checkIsEmpty(data.shippingAddress.address)) {
      setAddressError("Please enter address");
      isValid = false;
    }

    if (checkIsEmpty(data.shippingAddress.city)) {
      setCityError("Please enter city");
      isValid = false;
    }

    if (checkIsEmpty(data.shippingAddress.state)) {
      setStateError("Please enter state");
      isValid = false;
    }

    if (checkIsEmpty(data.shippingAddress.zipcode)) {
      setZipCodeError("Please enter zipcode");
      isValid = false;
    }

    if (checkIsEmpty(data.shippingAddress.contact_number)) {
      setContactNumberError("Please enter contact number");
      isValid = false;
    } else if (!checkIsPhoneNoInvalid(data.shippingAddress.contact_number)) {
      setContactNumberError("Please enter a valid contact number");
      isValid = false;
    }

    return isValid;
  };
  /**End of code addition by Unnati on 16-09-2024
   * Reason-To add valid on blur
   */
  {
    /**Code added by Unnati on 28-08-2024
     * Reason-Added navigation link path
     */
  }
  const { navigationPath, setNavigationPath } = useContext(GlobalContext);
  const navigate = useNavigate();

  useEffect(() => {
    setNavigationPath([
      { name: "Home", path: "/" },
      { name: "My Account", path: "/myaccount" },
    ]);
    window.scrollTo(0, 0);
  }, [setNavigationPath]);

  {
    /**End of coe addition by Unnati on 28-08-2024
     * Reason-Added navigation link path
     */
  }
  /**Code added by Unnati on 24-08-2024
   * Reason-To scroll to the top
   */
  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, [activeTab]);
  /**End of code addition by Unnati on 24-08-2024
   * Reason-To scroll to the top
   */

  /**Code added by Unnati on 17-08-2024
   * Reason-To handle tab click
   */
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    /**Code added by Unnati on 27-10-2024
     * Reason-To set active tab in local storage
     */
    localStorage.setItem("activeTab", tab);
    /**End of code addition by Unnati on 27-10-2024
     * Reason-To set active tab in local storage
     */
  };
  /**End of code addition by Unnati on 17-08-2024
   * Reason-To handle tab click
   */
  /**Code added by Unnati on 27-10-2024
   * Reason-To get active tab from local storage
   */
  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");

    const pathname = sessionStorage.getItem("path");

    if (pathname == "/myaccount") {
      if (savedTab) {
        setActiveTab(savedTab);
      }
    } else {
      localStorage.removeItem("activeTab");
      setActiveTab("account");
    }
    // Added by - Ashlekh on 02-12-2024
    // Reason - When we click on MyOrder from header then to open My Order tab
    if (myOrder == "orders"){
      setActiveTab("orders");
    }
    // End of code - Ashlekh on 02-12-2024
    // Reason - When we click on MyOrder from header then to open My Order tab
    // Added by - Ashlekh on 12-12-2024
    // Reason - To add condition (if user clicks on My account then to open My Account tab
    else if (myAccount == "account"){
      setActiveTab("account");
    }
    // End of code - Ashlekh on 12-12-2024
    // Reason - To add condition (if user clicks on My account then to open My Account tab)

    // Added by - Ashlekh on 31-12-2024
    // Reason - function to display various states
    const options = State.getStatesOfCountry("US").map((state) => ({
      value: state.isoCode,
      name: state.name,
    }));
    setStates(options);
    // End of code - Ashlekh on 31-12-2024
    // Reason - function to display various states
  }, []);
  /**End of code addition by Unnati on 27-10-2024
   * Reason-To get active tab from local storage
   */
  /**Code added by Unnati Bajaj on 13-09-2024
   * Reason -To get shipping address when the component loads
   */
  useEffect(() => {
    const fetchShippingAddress = async () => {
      try {
        const data = await getUserAddress(user.id);
        setShippingAddress(data.userAddress);
      } catch (error) {
        console.error("Error fetching shipping address:", error.message);
      }
    };

    if (user?.id) {
      fetchShippingAddress();
    }
  }, [user.id]);
  /**End of code addition by Unnati Bajaj on 10-06-2024
   * Reason -To get shipping address when the component loads
   */
  /**Code added by Unnati on 16-09-2024
   * Reason-To handle open modal
   */
  const openModal = () => {
    setIsModalOpen(true);
  };
  /*End of code addition by Unnati on 16-09-2024
   * Reason-To handle open modal
   */
  /**Code added by Unnati on 16-09-2024
   * Reason-To handle close modal
   */
  const closeModal = () => {
    // Added by - Ashlekh on 25-01-2025
    // Reason - When modal is closed then to clear validation message
    setFirstNameError("");
    setAddressError("");
    setCityError("");
    setStateError("");
    setZipCodeError("");
    setContactNumberError("");
    // End of code - Ashlekh on 25-01-2025
    // Reason - When modal is closed then to clear validation message
    setIsModalOpen(false);
  };
  /**End of code by Unnati on 16-09-2024
   * Reason-To handle close modal
   */

  /**Code added by Unnati on 15-09-2024
   * Reason-To handle primary address
   */
  const handleSetPrimary = async (addressId) => {
    const userId = user.id;

    // Optimistically update the state to reflect the new primary address
    const updatedAddresses = shippingAddress.map((address) =>
      address.id === addressId
        ? { ...address, is_primary: true }
        : { ...address, is_primary: false }
    );

    setShippingAddress(updatedAddresses);

    try {
      // Make the API call to update the primary address on the server
      const response = await updateUserAddress(addressId, userId);

      // After the API call, ensure that we update the state with the server response if needed
      if (response && response.updatedAddress) {
        // Update the state with the response from the server
        const finalAddresses = updatedAddresses.map((address) =>
          address.id === addressId
            ? { ...address, ...response.updatedAddress }
            : address
        );
        setShippingAddress(finalAddresses);
      }
    } catch (error) {
      console.error("Error updating address on server:", error);

      // Revert state back in case of an error (optional)
      setShippingAddress(shippingAddress); // revert to original state in case of failure
    }
  };

  /**End of code addition by Unnati on 15-09-2024
   * Reason-To handle primary address
   */
  /**Code added by Unnati on 16-09-2024
   * Reason-To handle edit address
   */
  const handleEdit = (addressId) => {
    setSelectedAddressId(addressId);

    const selectedAddress = shippingAddress.find(
      (address) => address.id === addressId
    );

    setFormData({
      first_name: selectedAddress.first_name || "",
      last_name: selectedAddress.last_name || "",
      company: selectedAddress.company || "",
      address: selectedAddress.address || "",
      city: selectedAddress.city || "",
      state: selectedAddress.state || formData.state,
      zipcode: selectedAddress.zipcode || "",
      contact_number: selectedAddress.contact_number || "",
    });

    setIsModalOpen(true);
  };
  /**End of code addition by Unnati on 16-09-2024
   * Reason-To handle edit address
   */
  /**Code added by Unnati on 13-10-2024
   * Reason-To handle delete click
   */
  // Code changed by - Ashlekh on 17-12-2024
  // Reason - If address is selected as primary address then to show validation message
  // const handleDeleteClick = async (addressId) => {
  const handleDeleteClick = async (address) => {
    console.log(address)
    if(address.is_primary){
      setAddressValidationMessageId(address.id);
    } else{
      // setItemToDelete(addressId);
      setItemToDelete(address.id);
      // End of code - Ashlekh on 17-12-2024
      // Reason - If address is selected as primary address then to show validation message
      setIsModalVisible(true);
    }
  };
  /*End of code addition by Unnati on 13-10-2024
   * Reason-To handle delete click
   */
  /**Code added by Unnati on 13-10-2024
   * Reason-To handle delete address
   */
  const confirmDelete = async (addressId) => {
    if (itemToDelete) {
      const response = await removeAddress(addressId, user.id);
      setItemToDelete(null);
      setShippingAddress(response.remainingAddresses);
    }
    setIsModalVisible(false);
  };
  /**End of code addition by Unnati on 13-10-2024
   * Reason-To handle delete address
   */
  /**Code added by Unnati on 13-10-2024
   * Reason-To handle cancel delete
   */
  const cancelDelete = () => {
    setItemToDelete(null);
    setIsModalVisible(false);
  };
  /**End of code addition by Unnati on 13-10-2024
   * Reason-To handle cancel delete
   */
  /**Code added by Unnati on 15-09-2024
   * Reason-To handle input change for billing address form
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  /**End of code addition by Unnati on 15-09-2024
   * Reason-To handle input change for billing address form
   */
  /**Code added by Unnati on 16-08-2024
   * Reason-To handle modal submit
   */
  const handleModalSubmit = async (addressId) => {
    const data = {
      first_name: formData.first_name || "",
      last_name: formData.last_name || "",
      company: formData.company || "",
      address: formData.address || "",
      city: formData.city || "",
      state: shippingChoosenState,
      country: "United States",
      zipcode: formData.zipcode || "",
      contact_number: formData.contact_number || "",
    };
    // Added by - Ashlekh on 24-01-2025
    // Reason - To validate address
    if (!isValidateOnSubmitShippingAddress(data)) {
      return;
    }
    // End of code - Ashlekh on 24-01-2025
    // Reason - To validate address
    try {
      const response = await UpdateShippingAddress(data, addressId, user.id);

      if (response && response.updatedUserAddress) {
        setShippingAddress(response.updatedUserAddress || []);
      } else {
        console.error("Unexpected response format", response);
      }
    } catch (error) {
      console.error("Error updating shipping address", error);
    }
    setIsModalOpen(false);
  };
  /**End of code addition by Unnati on 16-08-2024
   * Reason-To handle modal submit
   */
  // Added by - Ashlekh on 24-01-2025
  // Reason - To add Validation function 
  const isValidateOnSubmitShippingAddress = (data) => {
    let isValid = true;
    if (checkIsEmpty(data.first_name)) {
      setFirstNameError("Please enter first name");
      isValid = false;
    } else if (!checkIsNotADigit(data.first_name)) {
      setFirstNameError("Please enter a valid first name");
      isValid = false;
    } else{
      setFirstNameError("");
    }
    if (checkIsEmpty(data.address)) {
      setAddressError("Please enter address");
      isValid = false;
    } else{
      setAddressError("");
    }
    if (checkIsEmpty(data.city)) {
      setCityError("Please enter city");
      isValid = false;
    } else {
      setCityError("");
    }
    if (checkIsEmpty(data.zipcode)) {
      setZipCodeError("Please enter zipcode");
      isValid = false;
    } else{
      setZipCodeError("");
    }
    if (checkIsEmpty(data.contact_number)) {
      setContactNumberError("Please enter contact number");
      isValid = false;
    } else {
      setContactNumberError("");
    }
    return isValid; 
  };
  // End of code - Ashlekh on 24-01-2025
  // Reason - To add Validation function 
  /**
   * Added by - Ashlekh on 17-12-2024
   * Reason - To add ref container & to clear validation message
   */
  const messageContainerRef = useRef(null);
  const clearMessage = () => {
    setAddressValidationMessageId(null);
  };
  /**
   * End of code - Ashlekh on 17-12-2024
   * Reason - To add ref container & to clear validation message
   */
  const [shippingStates, setShippingStates] = useState([]);
  useEffect(() => {
    const options = State.getStatesOfCountry("US").map((state) => ({
      value: state.isoCode,
      /**Code added by Unnati on 15-09-2024
       * Reason-To add state name in state dropdown
       */
      name: state.name,
      /**End of code addition by Unnati on 15-09-2024
       * Reason-To add state name in state dropdown
       */
    }));
    setShippingStates(options);
    /**
     * Added by - Ashlekh on 17-12-2024
     * Reason - To clear message when user clicks outside div
     */
    const handleClickOutside = (event) => {
      if (
        messageContainerRef.current &&
        !messageContainerRef.current.contains(event.target)
      ) {
        clearMessage();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    /**
     * End of code - Ashlekh on 17-12-2024
     * Reason - To clear message when user clicks outside div
     */
  }, []);
  const handleShippingStateChange = (e) => {
    setShippingChoosenState(e.target.value);
  };

  const handleProfileEditSuccess = () => {
    setActiveTab("account");
  };
  /**
   * Added by - Ashlekh on 30-12-2024
   * Reason - When the user clicks Add Shipping Address open the modal. Clear validation messages when the modal is closed.
   */
  const openShippingAddress = () => {
    setIsShippingAddressModalOpen(true);
  };
  const resetFormFields = () => {
    setFirstName("");
    setLastName("");
    setCompany("");
    setAddress("");
    setCity("");
    setChoosenState("");
    setZipcode("");
    setContactNumber("");
  };
  const closeShippingAddressModal = () => {
    setIsShippingAddressModalOpen(false);
    setFirstNameError("");
    setAddressError("");
    setCityError("");
    setStateError("");
    setZipCodeError("");
    setContactNumberError("");
  };
  /**
   * End of code - Ashlekh on 30-12-2024
   * Reason - When the user clicks Add Shipping Address open the modal. Clear validation messages when the modal is closed.
   */
  /**
   * Added by - Ashlekh on 31-12-2024
   * Reason - API to submit shipping address
   */
  const submitAddress = async(e) => {
    const newShippingAddress = {
      first_name: firstName,
      last_name: lastName,
      company: company,
      address: address,
      city: city,
      country: "United States",
      state: choosenState,
      zipcode: zipcode,
      contact_number: contactNumber,
      user: user.id,
    }
    if (isValidOnSubmitShippingAddress(newShippingAddress)) {
      try{
        const response = await UserAddress(newShippingAddress, user.id);
        if (response && response.userAddress) {
          setShippingAddress(response.userAddress)
          resetFormFields();
        }
      } catch (error) {
        console.error("Error updating shipping address", error);
      }
      closeShippingAddressModal();
    }
  };
  /**
   * End of code - Ashlekh on 31-12-2024
   * Reason - API to submit shipping address
   */
  /**
   * Added by - Ashlekh on 31-12-2024
   * Reason - To check address details, when user add shipping address
   */
  const isValidOnSubmitShippingAddress = (newShippingAddress) => {
    let isValid = true;
    if (checkIsEmpty(newShippingAddress.first_name)) {
      setFirstNameError("Please enter first name");
      isValid = false;
    } else if (!checkIsNotADigit(newShippingAddress.first_name)) {
      setFirstNameError("Please enter a valid first name");
      isValid = false;
    }
    if (checkIsEmpty(newShippingAddress.address)) {
      setAddressError("Please enter address");
      isValid = false;
    }
    if (checkIsEmpty(newShippingAddress.city)) {
      setCityError("Please enter city");
      isValid = false;
    }
    if (checkIsEmpty(newShippingAddress.state)) {
      setStateError("Please enter state");
      isValid = false;
    }
    if (checkIsEmpty(newShippingAddress.zipcode)) {
      setZipCodeError("Please enter zipcode");
      isValid = false;
    }
    if (checkIsEmpty(newShippingAddress.contact_number)) {
      setContactNumberError("Please enter contact number");
      isValid = false;
    }  
    return isValid; 
  };
  /**
   * End of code - Ashlekh on 31-12-2024
   * Reason - To check address details, when user add shipping address
   */
  return (
    <div className={Styles.pageFrame}>
      <div className={Styles.pageContainer}>
        {/**Code added by Unnati on 28-08-2024
         * Reason-Added navigation link path
         */}
        <NavigationPath navigationPathArray={navigationPath} />
        {/**End of code addition by Unnati on 28-08-2024
         * Reason-Added navigation link path
         */}
        <div className={Styles.myAccount}>
          <div className={Styles.sidebar}>
            <ul>
              {/**Code added by Unnati on 17-08-2024
               *Reason-Created side bar with all the options*/}
              <li
                className={activeTab === "account" ? Styles.active : ""}
                onClick={() => handleTabClick("account")}
              >
                My Account
              </li>
              <li
                className={activeTab === "orders" ? Styles.active : ""}
                onClick={() => handleTabClick("orders")}
              >
              {/**Code added by Unnati on 18-11-2024
                 *Reason-Modified heading */}
                {/* Your Orders */}
                My Orders
                {/**End of code addition by Unnati on 18-11-2024
                 *Reason-Modified heading */}
              </li>
              <li
                className={activeTab === "address" ? Styles.active : ""}
                onClick={() => handleTabClick("address")}
              >
                Address Book
              </li>
              {/**Code commented by Unnati on 25-11-2024
              *Reason- To hide account information tab */}
              {/* <li
                className={activeTab === "info" ? Styles.active : ""}
                onClick={() => handleTabClick("info")}
              >
                Account Information
              </li> */}
              {/**End of code comment by Unnati on 25-11-2024
              *Reason- To hide account information tab */}
              {/* Commented by jhamman on 13-10-2024
              Reason - have to remove these options*/}
              {/* <li
                className={activeTab === "payment" ? Styles.active : ""}
                onClick={() => handleTabClick("payment")}>
                Stored Payment Methods
              </li>
              <li
                className={activeTab === "newsletter" ? Styles.active : ""}
                onClick={() => handleTabClick("newsletter")}>
                Newsletter Subscriptions
              </li>
              <li
                className={activeTab === "options" ? Styles.active : ""}
                onClick={() => handleTabClick("options")}>
                My Payment Options
              </li> */}
              {/* End of commentation by jhamman on 13-10-2024
              Reason - have to remove these options*/}
              {/**End of code addition by Unnati on 17-08-2024
               *Reason-Created side bar with all the options*/}
            </ul>
          </div>
          <div className={Styles.content}>
            {/**Code added by Unnati on 17-08-2024
             *Reason-Added my account page details*/}
            {activeTab === "account" && (
              /* Modified by jhamman on 14-10-2024
              Reason - Added classname*/
              /* <div> */
              <div className={Styles.container}>
                {/* End of modification by jhamman on 14-10-2024
                Reason - Added classname*/}
                <div className={Styles.mainHeading}>
                  <h2 className={Styles.pageHeading}>My Account</h2>
                </div>
                <div className={Styles.card}>
                  {/* Modified by jhamman on 13-10-2024
                Reason - change the title*/}
                  {/* <p className={Styles.title}>Account Information</p> */}
                  {/* <h4 className={Styles.subtitle}>Contact Information</h4> */}
                  {/**Code added by Unnati on 18-10-2024
                   *Reason-Changed to h3 */}
                  <h3 className={Styles.subtitle}>Profile Details</h3>
                  {/**End of code addition by Unnati on 18-10-2024
                   *Reason-Changed to h3 */}
                  {/* End of modification by jhamman on 13-10-2024
                  Reason - change the title*/}
                  <div className={Styles.row}>
                    <h4 className={Styles.subtitle}>Name: </h4>
                    <p className={Styles.value}>
                      {user.first_name} {user.last_name}
                    </p>
                  </div>
                  <div className={Styles.row}>
                    <h4 className={Styles.subtitle}>Email:</h4>
                    <p className={Styles.value}>{user.email}</p>
                  </div>
                  {/**Code added by Unnati on 27-10-2024
                   *Reason-Added cntact number,date of birth and gender */}
                  {/* Added by - Ashlekh on 22-01-2025
                  Reason - To check null condition in contact number */}
                  {user.contact_number != null && (
                  // End of code - Ashlekh on 22-01-2025
                  // Reason - To check null condition in contact number
                  <div className={Styles.row}>
                    <h4 className={Styles.subtitle}>Contact Number:</h4>
                    <p className={Styles.value}>{user.contact_number}</p>
                  </div>
                  )}
                  <div className={Styles.row}>
                    <h4 className={Styles.subtitle}>Date of Birth:</h4>
                    <p className={Styles.value}>
                      {/* Code changed by - Ashlekh on 20-11-2024
                      Reason - To apply condition in date of birth */}
                      {/* {DateFormatter(user.date_of_birth)} */}
                      {user.date_of_birth ? DateFormatter(user.date_of_birth) : "--/--/----"}
                      {/* End of code - Ashlekh on 20-11-2024
                      Reason - To apply condition in date of birth */}
                    </p>
                  </div>
                  <div className={Styles.row}>
                    <h4 className={Styles.subtitle}>Gender:</h4>
                    <p className={Styles.value}>{user.gender}</p>
                  </div>
                  {/**End of code addition by Unnati on 27-10-2024
                   *Reason-Added cntact number,date of birth and gender */}
                  <button
                    className={Styles.Edit}
                    onClick={() => handleTabClick("info")}
                  >
                    Edit Account Information
                  </button>
                </div>
                {/* <div className={Styles.card}>
                  <div className={Styles.address}>
                    <div className={Styles.addressBook}>
                      <p className={Styles.title}>Address Book</p>
                    </div>
                    <div className={Styles.addresses}>
                      <div className={Styles.billingAddress}>
                        <h4 className={Styles.subtitle}>
                          Default Billing Address
                        </h4>

                        <Link>
                          <div className={Styles.Edit}>Edit Address</div>
                        </Link>
                      </div>
                      <div className={Styles.shippingAddress}>
                        <h4 className={Styles.subtitle}>
                          Default Shipping Address
                        </h4>

                        <Link>
                          <div className={Styles.Edit}>Edit Address</div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            )}
            {/**End of code addition by Unnati on 17-08-2024
             *Reason-Added my account page details*/}
            {activeTab === "orders" && (
              /* Modified by jhamman on 14-10-2024
              Reason - Added classname*/
              /* <div> */
              <div className={Styles.container}>
                {/* End of modification by jhamman on 14-10-2024
              Reason - Added classname*/}
                {/**Code added by Unnati on 03-10-2024
                 *Reason-Modified heading */}
                <div className={Styles.mainHeading}>
                {/**Code added by Unnati on 18-11-2024
                 *Reason-Modified heading */}
                  <h2 className={Styles.pageHeading}>My Orders</h2>
                  {/**End of code addition by Unnati on 18-11-2024
                 *Reason-Modified heading */}
                </div>
                {/**End of code addition by Unnati on 03-10-2024
                 *Reason-Modified heading */}
                 {/**Code modified by Unnati on 10-01-2024
                 *Reson-Added orderitems */}
                {/* <OrderHistory /> */}
                <OrderItems />
                {/**End of code modification by Unnati on 10-01-2024
                 *Reson-Added orderitems */}
              </div>
            )}
            {activeTab === "address" && (
              <div className={Styles.addressBook}>
                <h2 className={Styles.mainHeading}>Address Book</h2>
                  {/* Added by - Ashlekh on 30-12-2024
                  Reason - To save shipping address */}
                  <div className={`${Styles.shippingAddressButtonContainer}`}>
                    <div className={`${Styles.shippingAddressButton}`} onClick={openShippingAddress}>
                      <IoIosAddCircleOutline className={`${Styles.addIcon}`} />
                        Shipping Address
                    </div>
                  </div>
                  {isShippingAddressModalOpen && (
                    <div className={Styles.modalOverlay}>
                      <div className={Styles.modalContainer}>
                        <div className={Styles.modalHeader}>
                          <h2>Add Addres</h2>
                          {/* Code changed by - Ashlekh on 21-01-2025
                          Reason - To add multiple classname */}
                          {/* <div className="closeButton" onClick={closeShippingAddressModal}> */}
                          <div className={`${Styles.closeButton}`} onClick={closeShippingAddressModal}>
                          {/* End of code - Ashlekh on 21-01-2025
                          Reason - To add multiple classname */}
                            &times;
                          </div>
                        </div>

                        <div className={Styles.modalBody}>
                          <div className={Styles.rowContainer}>
                            <div className={Styles.fieldName}>
                              <label>First Name</label>
                              <span className={Styles.mandatory}>*</span>
                            </div>
                            <input
                              className={Styles.inputShipping}
                              type="text"
                              name="first_name"
                              value={firstName}
                              onChange={(e) => {
                                setFirstName(e.target.value);
                                setFirstNameError("");
                              }}
                              onBlur={(e) =>
                                isValidOnBlur("first_name", e.target.value)
                              }
                            />
                            <div className={Styles.formInputError}>
                              {firstNameError}
                            </div>
                          </div>

                          <div className={Styles.rowContainer}>
                            <div className={Styles.fieldName}>
                              <label>Last Name</label>
                            </div>
                            <input
                              className={Styles.inputShipping}
                              type="text"
                              name="last_name"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                            />
                          </div>

                          {/* <div className={Styles.rowContainer}>
                            <div className={Styles.fieldName}>
                              <label>Company</label>
                            </div>
                            <input
                              type="text"
                              name="company"
                              value={company}
                              onChange={handleInputChange}
                              onBlur={(e) =>
                                isValidOnBlur("company", e.target.value)
                              }
                              className={Styles.inputShipping}
                            />
                          </div> */}

                          <div className={Styles.rowContainer}>
                            <div className={Styles.fieldName}>
                              <label>Address</label>
                              <span className={Styles.mandatory}>*</span>
                            </div>
                            <input
                              type="text"
                              name="address"
                              value={address}
                              onChange={(e) => {
                                setAddress(e.target.value);
                                setAddressError("");
                              }}
                              onBlur={(e) =>
                                isValidOnBlur("address", e.target.value)
                              }
                              className={Styles.inputShipping}
                            />
                            <div className={Styles.formInputError}>
                              {addressError}
                            </div>
                          </div>

                          <div className={Styles.rowContainer}>
                            <div className={Styles.fieldName}>
                              <label>City</label>
                              <span className={Styles.mandatory}>*</span>
                            </div>
                            <input
                              type="text"
                              name="city"
                              value={city}
                              onChange={(e) => {
                                setCity(e.target.value);
                                setCityError("");
                              }}
                              onBlur={(e) =>
                                isValidOnBlur("city", e.target.value)
                              }
                              className={Styles.inputShipping}
                            />
                            <div className={Styles.formInputError}>
                              {cityError}
                            </div>
                          </div>
                          <div className={Styles.rowContainer}>
                            <div className={Styles.fieldName}>
                              <label>Country</label>
                              <span className={Styles.mandatory}
                                style={{display: "none"}}
                              >*</span>
                            </div>
                            <input
                              type="text"
                              value="United States"
                              className={Styles.inputShipping}
                              readOnly
                              disabled={true}
                            />
                            <div className={Styles.formInputError}>
                              {countryError}
                            </div>
                          </div>
                          <div className={Styles.rowContainer}>
                            <div className={Styles.fieldName}>
                              <label>State</label>
                              <span className={Styles.mandatory}>*</span>
                            </div>
                            <select
                              value={choosenState}
                              className={Styles.inputShipping}
                              onChange={(e) => {
                                setChoosenState(e.target.value);
                                setStateError("");
                              }}
                            >
                              <option value="" disabled>
                                Select a state
                              </option>
                              {states.map((option, index) => (
                                <option key={index} value={option.name}>
                                  {option.name} - {option.value}
                                </option>
                              ))}
                            </select>
                            <div className={Styles.formInputError}>
                              {stateError}
                            </div>
                          </div>
                          <div className={Styles.rowContainer}>
                            <div className={Styles.fieldName}>
                              <label>Zip Code</label>
                              <span className={Styles.mandatory}>*</span>
                            </div>
                            <input
                              className={Styles.inputShipping}
                              type="text"
                              name="zipcode"
                              value={zipcode}
                              onChange={(e) => {
                                setZipcode(e.target.value);
                                setZipCodeError("");
                              }}
                              onBlur={(e) =>
                                isValidOnBlur("zipcode", e.target.value)
                              }
                            />
                            <div className={Styles.formInputError}>
                              {zipCodeError}
                            </div>
                          </div>

                          <div className={Styles.rowContainer}>
                            <div className={Styles.fieldName}>
                              <label>Phone Number</label>
                              <span className={Styles.mandatory}>*</span>
                            </div>
                            <input
                              className={Styles.inputShipping}
                              type="text"
                              name="contact_number"
                              value={contactNumber}
                              onChange={(e) => {
                                setContactNumber(e.target.value);
                                setContactNumberError("");
                              }}
                              onBlur={(e) =>
                                isValidOnBlur("contact_number", e.target.value)
                              }
                            />
                            <div className={Styles.formInputError}>
                              {contactNumberError}
                            </div>
                          </div>

                          <div className={Styles.buttonContainer}>
                            <button
                              className={Styles.shippingSubmitButton}
                              onClick={submitAddress}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                {/* End of code - Ashlekh on 30-12-2024
                Reason - To save shipping address */}
                {/**Code added by Unnati on 13-09-2024
                 *Reason-Added shipping addresses */}
                {shippingAddress && shippingAddress.length > 0 ? (
                  <div className={Styles.addressListContainer}>
                    <ul className={Styles.addressList}>
                      {(() => {
                        const primaryAddresses = shippingAddress.filter(
                          (address) => address.is_primary
                        );
                        const nonPrimaryAddresses = shippingAddress.filter(
                          (address) => !address.is_primary
                        );

                        const sortedAddresses = [
                          ...primaryAddresses,
                          ...nonPrimaryAddresses,
                        ];

                        return sortedAddresses.map((address, index) => (
                          <li
                            key={address.id}
                            className={`${Styles.addressItem} ${
                              index % 2 === 0 ? Styles.even : Styles.odd
                            }`}
                          >
                            <div className={Styles.addressContent}>
                              <div className={Styles.addressInfo}>
                                <p className={Styles.name}>
                                  {address.first_name} {address.last_name}
                                </p>
                                {address.company && (
                                  <p className={Styles.company}>
                                    {address.company}
                                  </p>
                                )}
                                <p>
                                  {address.address}, {address.city},{" "}
                                  {address.state} {address.zipcode},{" "}
                                  {address.country}
                                </p>
                                {/* Code changed by - Ashlekh on 14-12-2024
                                Reason - To display contact number */}
                                {/* <p>{address.phone_number}</p> */}
                                <p>{address.contact_number}</p>
                                {/* End of code - Ashlekh on 14-12-2024
                                Reason - To display contact number */}
                              </div>
                              <div className={Styles.addressActions}>
                                {/**Code commented by Unnati on 17-10-2024
                                 *Reason-To remove primary */}
                                {/* {address.is_primary && (
                                  <span className={Styles.primaryTag}>
                                    Primary
                                  </span>
                                )} */}
                                {/**End of code comment by Unnati on 17-10-2024
                                 *Reason-To remove primary */}
                                <label className={Styles.primaryRadio}>
                                  <input
                                    type="radio"
                                    name="primaryAddress"
                                    checked={address.is_primary}
                                    onChange={() =>
                                      handleSetPrimary(address.id)
                                    }
                                  />
                                  <span>Set as Primary</span>
                                </label>
                                <div
                                  className={Styles.editButton}
                                  onClick={() => handleEdit(address.id)}
                                >
                                  <MdEdit color="blue" />
                                </div>
                                {/* Added by - Ashlekh on 12-12-2024
                                Reason - To hide delete icon from primary address */}
                                {/* {!address.is_primary && ( */}
                                {/* // End of code - Ashlekh on 12-12-2024
                                // Reason - To hide delete icon from primary address */}
                                <div
                                  className={Styles.deleteButton}
                                  // Code changed by - Ashlekh on 17-12-2024
                                  // Reason - To pass address
                                  // onClick={() => handleDeleteClick(address.id)}
                                  onClick={() => handleDeleteClick(address)}
                                  // End of code - Ashlekh on 17-12-2024
                                  // Reason - To pass address
                                >
                                  <MdDelete color="red" />
                                </div>
                                {/* )} */}
                                {/**Code added by Unnati on 13-10-2024
                                 *Reason-To show modal when clicked on delete button  */}
                                {isModalVisible && (
                                  <div className={Styles.modalOverlay}>
                                    <div className={Styles.modalContent}>
                                    {/**Code modified by Unnati on 18-11-2024
                                    *Reason-Change message */}
                                      <p>
                                        Are you sure you want to remove this
                                        address?
                                      </p>
                                       {/**End of code addition by Unnati on 18-11-2024
                                    *Reason-Change message */}
                                      <button
                                        className={Styles.buttonYesOrNo}
                                        onClick={() =>
                                          confirmDelete(itemToDelete)
                                        }
                                      >
                                        Yes
                                      </button>
                                      <button
                                        className={Styles.buttonYesOrNo}
                                        onClick={cancelDelete}
                                      >
                                        No
                                      </button>
                                    </div>
                                  </div>
                                )}
                                {/**End of code addition  Unnati on 13-10-2024
                                 *Reason-To show modal when clicked on deleet button  */}
                              </div>
                            </div>
                            {/* Added by - Ashlekh on 17-12-2024
                            Reason - To add validation message */}
                            {addressValidationMessageId == address.id && (
                              <div ref={messageContainerRef} className={`${Styles.addressValidationMessageContainer}`}>
                                Please choose another address as primary address before deleting this one.
                              </div>
                            )}
                            {/* End of code - Ashlekh on 17-12-2024
                            Reason - To add validation message */}
                          </li>
                        ));
                      })()}
                    </ul>
                  </div>
                ) : (
                  <p>No addresses saved.</p>
                )}

                {/**Code added by Unnati on 16-09-2024
                 *Reason-Added modal form for editing address */}
                {isModalOpen && (
                  <div className={Styles.modalOverlay}>
                    <div className={Styles.modalContainer}>
                      <div className={Styles.modalHeader}>
                        <h2>Edit Addresssss</h2>
                        <div className="closeButton" onClick={closeModal}>
                          &times;
                        </div>
                      </div>

                      <div className={Styles.modalBody}>
                        <div className={Styles.rowContainer}>
                          <div className={Styles.fieldName}>
                            <label>First Name</label>
                            <span className={Styles.mandatory}>*</span>
                          </div>
                          <input
                            className={Styles.inputShipping}
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            onBlur={(e) =>
                              isValidOnBlur("first_name", e.target.value)
                            }
                          />
                          <div className={Styles.formInputError}>
                            {firstNameError}
                          </div>
                        </div>

                        <div className={Styles.rowContainer}>
                          <div className={Styles.fieldName}>
                            <label>Last Name</label>
                          </div>
                          <input
                            className={Styles.inputShipping}
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                          />
                        </div>
                        {/* Commented by - Ashlekh on 24-01-2025
                        Reason - To remove company name */}
                        {/* <div className={Styles.rowContainer}>
                          <div className={Styles.fieldName}>
                            <label>Company</label>
                          </div>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            onBlur={(e) =>
                              isValidOnBlur("company", e.target.value)
                            }
                            className={Styles.inputShipping}
                          />
                        </div> */}
                        {/* End of code - Ashlekh on 24-01-2025
                        Reason - To remove company name */}

                        <div className={Styles.rowContainer}>
                          <div className={Styles.fieldName}>
                            <label>Address</label>
                            <span className={Styles.mandatory}>*</span>
                          </div>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            onBlur={(e) =>
                              isValidOnBlur("address", e.target.value)
                            }
                            className={Styles.inputShipping}
                          />
                          <div className={Styles.formInputError}>
                            {addressError}
                          </div>
                        </div>

                        <div className={Styles.rowContainer}>
                          <div className={Styles.fieldName}>
                            <label>City</label>
                            <span className={Styles.mandatory}>*</span>
                          </div>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            onBlur={(e) =>
                              isValidOnBlur("city", e.target.value)
                            }
                            className={Styles.inputShipping}
                          />
                          <div className={Styles.formInputError}>
                            {cityError}
                          </div>
                        </div>
                        <div className={Styles.rowContainer}>
                          <div className={Styles.fieldName}>
                            <label>Country</label>
                            <span className={Styles.mandatory}
                              // Added by - Ashlekh on 13-12-2024
                              // Reason - To remove mandatory from Country
                              style={{display: "none"}}
                              // End of code - Ashlekh on 13-12-2024
                              // Reason - To remove mandatory from Country
                            >*</span>
                          </div>
                          <input
                            type="text"
                            value="United States"
                            className={Styles.inputShipping}
                            readOnly
                            // Added by - Ashlekh on 13-12-2024
                            // Reason - To disable Country input field
                            disabled={true}
                            // End of code - Ashlekh on 13-12-2024
                            // Reason - To disable Country input field
                          />
                          <div className={Styles.formInputError}>
                            {countryError}
                          </div>
                        </div>
                        <div className={Styles.rowContainer}>
                          <div className={Styles.fieldName}>
                            <label>State</label>
                            <span className={Styles.mandatory}>*</span>
                          </div>
                          <select
                            className={Styles.inputShipping}
                            onChange={handleShippingStateChange}
                            value={shippingChoosenState || formData.state || ""}
                            // value={shippingAddress.state}
                          >
                            {shippingStates.map((option, index) => (
                              <option key={index} value={option.value}>
                                {option.name} - {option.value}
                              </option>
                            ))}
                          </select>
                          <div className={Styles.formInputError}>
                            {stateError}
                          </div>
                        </div>
                        <div className={Styles.rowContainer}>
                          <div className={Styles.fieldName}>
                            <label>Zip Code</label>
                            <span className={Styles.mandatory}>*</span>
                          </div>
                          <input
                            className={Styles.inputShipping}
                            type="text"
                            name="zipcode"
                            value={formData.zipcode}
                            onChange={handleInputChange}
                            onBlur={(e) =>
                              isValidOnBlur("zipcode", e.target.value)
                            }
                          />
                          <div className={Styles.formInputError}>
                            {zipCodeError}
                          </div>
                        </div>

                        <div className={Styles.rowContainer}>
                          <div className={Styles.fieldName}>
                            <label>Phone Number</label>
                            <span className={Styles.mandatory}>*</span>
                          </div>
                          <input
                            className={Styles.inputShipping}
                            // Modification and addition by Om shrivastava on 21-12-2024
                            // Reason : Remove text field to integer field 
                            type="text"
                            // type="number"
                            // End of modification and addition by Om shrivastava on 21-12-2024
                            // Reason : Remove text field to integer field 
                            name="contact_number"
                            value={formData.contact_number}
                            // Modification and addition by Om shrivastava on 21-12-2024
                            // Reason : Remove text field to integer field
                            // onChange={handleInputChange}
                            onChange={(e) => {
                            // Prevent invalid input like "e" or "-"
                            const value = e.target.value;
                            // Commented by - Ashlekh on 28-12-2024
                            // Reason - Contact number can be alpha-numeric
                            // if (/^\d*$/.test(value)&& value.length <= 10) {
                            // End of comment - Ashlekh on 28-12-2024
                            // Reason - Contact number can be alpha-numeric
                              handleInputChange(e);
                              setContactNumberError("");
                              // }
                            }}
                            // Code commented by - Ashlekh on 28-12-2024
                            // Reason - Contact number can be alpha-numeric
                            // onKeyDown={(e) => {
                            //   // Prevent typing "e", ".", "-", etc.
                            //   if (e.key === "e" || e.key === "." || e.key === "-" || e.key === "+") {
                            //     e.preventDefault();
                            //   }
                            // }}
                            // End of comment - Ashlekh on 28-12-2024
                            // Reason - Contact number can be alpha-numeric
                            // End of modification and addition by Om shrivastava on 21-12-2024
                            // Reason : Remove text field to integer field
                            onBlur={(e) =>
                              isValidOnBlur("contact_number", e.target.value)
                            }
                          />
                          <div className={Styles.formInputError}>
                            {contactNumberError}
                          </div>
                        </div>

                        <div className={Styles.buttonContainer}>
                          <button
                            className={Styles.shippingSubmitButton}
                            onClick={(e) =>
                              handleModalSubmit(selectedAddressId)
                            }
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/**End of code addition by Unnati on 16-09-2024
                 *Reason-Added modal form for editing address */}
                {/** End of code addition by Unnati on 13-09-2024
                 * Reason-Added shipping address of the user and set one as primary address */}
              </div>
            )}

            {activeTab === "info" && (
              /* Modified by jhamman on 14-10-2024
              Reason - Added classname*/
              /* <div> */
              <div className={Styles.container} 
              // Commented by Om Shrivastava on 13-12-2024
              // Reason : Remove inline css 
              // style={{ width: "50%" }}
              // End of commented by Om Shrivastava on 13-12-2024
              // Reason : Remove inline css 
              >
                {/* End of modification by jhamman on 14-10-2024
              Reason - Added classname*/}
                {/**Code added by Unnati on 03-10-2024
                 *Reason-Modified heading */}
                <div className={Styles.mainHeading}>
                  <h2 className={Styles.pageHeading}>
                    Edit Account Information
                  </h2>
                </div>
                {/**End of code addition by Unnati on 03-10-2024
                 *Reason-Modified heading */}
                <ProfileEdit onProfileEditSuccess={handleProfileEditSuccess} />
              </div>
            )}

            {/* Commented by Jhamman on 13-10-2024
            Reason - Have to remove these option*/}
            {/* {activeTab === "payment" && (
              //Code added by Unnati on 03-10-2024
              //Reason-Modified heading
              <div className={Styles.mainHeading}>
                <h2 className={Styles.pageHeading}>Stored Payment Method</h2>
              </div>
              //End of code addition by Unnati on 03-10-2024
              //Reason-Modified heading
            )}
            {activeTab === "newsletter" && (
              //Code added by Unnati on 03-10-2024
              //Reason-Modified heading
              <div className={Styles.mainHeading}>
                <h2 className={Styles.pageHeading}>Newsletter Subscriptions</h2>
              </div>
              //End of code addition by Unnati on 03-10-2024
              //Reason-Modified heading
            )}
            {activeTab === "options" && (
              //Code added by Unnati on 03-10-2024
              //Reason-Modified heading
              <div className={Styles.mainHeading}>
                <h2 className={Styles.pageHeading}>My Payment Options</h2>
              </div>
              //End of code addition by Unnati on 03-10-2024
              //Reason-Modified heading
            )} */}
            {/* End of commentation by Jhamman on 13-10-2024
            Reason - Have to remove these option*/}
          </div>
        </div>
      </div>
      {scrollDoc()}
    </div>
  );
};

export default MyAccount;
/**End of code addition by Unnati on 02-08-2024
 * Reason-To have my account page
 */
