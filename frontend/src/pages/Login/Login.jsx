/**
 * Created by - Ashish Dewangan on 22-05-2024
 * Reason - Created login page
 */
import { useContext, useEffect, useState } from "react";
import { useNavigate, Link, useLocation, useHistory } from "react-router-dom";
import loginStyle from "./Login.module.css";
import { login, updateBackendCart, updateWishListAPI } from "../../Api/services";
import {
  checkIfMinimumThanMinValue,
  checkIsEmailInvalid,
  checkIsEmpty,
} from "../../utils/validations";
import { GlobalContext } from "../../context/Context";
import notificationObject from "../../components/Widgets/Notification/Notification";

/**Code commented by -Unnati on 26-05-2024
 * Reason -To add logo
 */
// import adyant from './adyant.png';
/**End of code comment by -Unnati on 26-05-2024
 * Reason -To add logo
 */

const Login = () => {
  const { setUser, setCartData,
    // Added by - Ashlekh on 05-11-2024
    // Reason - To import context variable
    wishListData,
    setWishListData,
    // End of code - Ashlekh on 05-11-2024
    // Reason - To import context variable
   } = useContext(GlobalContext);
  const navigate = useNavigate();
  const location = useLocation();
  /**Code added by Unnati on 30-10-2024
   * Reason-To get flag value from state
   */
  const { loginWithCheckoutButton } = location?.state || {};
  /**End of code addition by Unnati on 30-10-2024
   * Reason-To get flag value from state
   */
  const loginLocation = useLocation();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  /**Code commented by Unnati on 17-06-2024
   * Reason -As flickering issue between pages occured
   */
  // const [isSubmitting, setIsSubmitting] = useState(false);
  /**End of code comment by Unnati on 17-06-2024
   * Reason -As flickering issue between pages occured
   */
  const [password, setPassword] = useState("");

  /**
   * Added by - Ashish Dewangan on 22-05-2024
   * Reason - To navigate to home page if token does not exist
   */
  useEffect(() => {
    if (localStorage.getItem("access") && location.pathname === "/login") {
      navigate("/");
    }
  }, [navigate, location]);
  /**
   * End of addition by - Ashish Dewangan on 22-05-2024
   * Reason - To navigate to home page if token does not exist
   */

  /**
   * Added by - Ashish Dewangan on 22-05-2024
   * Reason - To validate input on blur
   */
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value.replace(/\s/g, "");
    setPassword(newPassword);
    setPasswordError("");
  };
  const isValidOnBlur = (input, value) => {
    if (input === "email") {
      if (checkIsEmpty(value)) {
        setEmailError("Please enter email address");
        return false;
      } else {
        if (checkIsEmailInvalid(value)) {
          /* Addedby jhamman on 18-10-2024
          Reason - change validation message*/
          // setEmailError("Please type correct email format");
          setEmailError("Please enter a valid email address");
          /* End of addition by jhamman on 18-10-2024
          Reason - change validation message*/
          return false;
        }
      }
    }
    if (input === "password") {
      if (checkIsEmpty(value)) {
        setPasswordError("Please enter password");
        return false;
      } else {
        if (checkIfMinimumThanMinValue(value, 8)) {
          setPasswordError("Password must contain 8 characters");
        }
      }
    }
  };
  /**
   * End of code by - Ashish Dewangan on 22-05-2024
   * Reason - To validate input on blur
   */

  /**
   * Added by - Ashish Dewangan on 22-05-2024
   * Reason - To validate input on form submit
   */
  const isValidOnSubmit = (data) => {
    if (checkIsEmpty(data.email)) {
      setEmailError("Please enter email address");
      return false;
    } else {
      if (checkIsEmailInvalid(data.email)) {
        setEmailError("Please type correct email format");
        return false;
      }
    }

    if (checkIsEmpty(data.password)) {
      setPasswordError("Please enter password");
      return false;
    } else {
      if (checkIfMinimumThanMinValue(data.password, 8)) {
        setPasswordError("Password must contain 8 characters");
      }
    }
    return true;
  };
  /**
   * End of code addition by - Ashish Dewangan on 22-05-2024
   * Reason - To validate input on form submit
   */

  /**Code added by Unnati on 28-07-2024
   * Reason-To get local storage cart data
   */
  // const fetchLocalStorageCartData = () => {

  //   return JSON.parse(cartData);
  // };
  /**End of code addition by Unnati on 28-07-2024
   * Reason-To get local storage cart data
   */
  /**Code modified by Unnati on 31-07-2024
   * Reason-To syncCartData with backend and local storage
   */
  const syncCartData = async (user) => {
    const localStorageCartData =
      JSON.parse(localStorage.getItem("cartData")) || [];
    var data = {
      user: user.id,
      cart: localStorageCartData,
    };
    const response = await updateBackendCart(data);
    const backendCartData = response.cartData;
    if (!backendCartData || backendCartData.length === 0) {
    } else {
      localStorage.setItem("cartData", JSON.stringify(backendCartData));
      setCartData(backendCartData);
    }
  };
  /**End of code modification by Unnati on 31-07-2024
   * Reason-To syncCartData with backend and local storage
   */
  /**End of code addition by Unnati on 28-07-2024
   * Reason-To get local storage cart data
   */
  /**
   * Added by - Ashish Dewangan on 22-05-2024
   * Reason - To post login details when user submits the form
   */
  const postLoginDetails = async (e) => {
    const data = {
      email: e.target.email.value,
      password: e.target.password.value,
    };
    if (isValidOnSubmit(data)) {
      const response = await login(data);
      if (response.success) {
        /**Code modified by Unnati on 12-10-2024
         * Reason-Added notification message
         */
        notificationObject.success("Logged in Successfully");
        /**End of code modification by Unnati on 12-10-2024
         * Reason-Added notification message
         */
        localStorage.setItem("access", response.access);
        localStorage.setItem("refresh", response.refresh);
        setUser(response.user);
        /**Code added by Unnati on 31-07-2024
         * Reason- Call syncCartData when logged in
         */
        await syncCartData(response.user);
        /**End of code addition by Unnati on 31-07-2024
         * Reason- Call syncCartData when logged in
         */

        /**
         * Added by - Ashlekh on 05-11-2024
         * Reason - To sync data of wishlist (in backend when user log in)
         */
        await syncWishListData(response.user);
        /**
         * End of code - Ashlekh on 05-11-2024
         * Reason - To sync data of wishlist (in backend when user log in)
         */
        /**Code added by Unnati on 30-10-2024
         * Reason-Added condition
         */
        if (loginWithCheckoutButton) {
          navigate("/checkout");
        } else {
          /**End of code addition by Unnati on 30-10-2024
           * Reason-Added condition
           */
          const redirectTo = location.state?.from || "/";
          navigate(redirectTo);
        }
      } else {
        notificationObject.error(response.error);
      }

      /**Code added by Unnati on 13-06-2024
       * Reason -To avoid repetative notification
       */
      // setTimeout(() => {
      //   setIsSubmitting(false);
      // }, 5000);

      /**End of code addition by Unnati on 13-06-2024
       * Reason -To avoid repetative notification
       */
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    postLoginDetails(e);
  };
  /**
   * End of code addition by - Ashish Dewangan on 22-05-2024
   * Reason - To post login details when user submits the form
   */
  /**
   * Added by - Ashlekh on 05-11-2024
   * Reason - To save wishlist data when user login
   */
  const syncWishListData = async (user) => {
    const localStorageWishListData =
      JSON.parse(localStorage.getItem("wishListData")) || [];
    var data = {
      userId: user.id,
      wishList: localStorageWishListData,
    };
    const response = await updateWishListAPI(data);
    if(response?.wishList) {
      localStorage.setItem("wishListData", JSON.stringify(response?.wishList));
      setWishListData(response?.wishList);
    }
  };
  /**
   * End of code - Ashlekh on 05-11-2024
   * Reason - To save wishlist data when user login
   */
  return (
    /**Code added by Unnati on 25-05-2024
     * Reason -to make changes in login form
     */
    <div className={`${loginStyle.pageFrame}`}>
      <div className={`${loginStyle.pageContainer}`}>
        {/**Code added by Unnati on 08-08-2024
         *Reason-Modified heading*/}
        <div className={`${loginStyle.loginTitle}`}>
          <h2>Customer Login</h2>
          {/**End of code addition by Unnati on 08-08-2024
           *Reason-Modified heading */}
        </div>
        <div className={`${loginStyle.loginContainer}`}>
          <div className={`${loginStyle.formContainer}`}>
            <form onSubmit={handleSubmit}>
              {/**Code added by Unnati on 08-08-2024
               *Reason-adding subtitle and description*/}
              <div className={`${loginStyle.subTitleColor}`}>
                Registered Customers
              </div>
              <div className={`${loginStyle.description}`}>
                If you have an account, sign in with your email address.
              </div>
              {/**End of code addition by Unnati on 08-08-2024
               *Reason-adding subtitle and description*/}
              <div className={`${loginStyle.formInputContainer}`}>
                <div
                  className={`${loginStyle.labelField}`}
                  style={{ display: "flex", width: "40%" }}
                >
                  <div className={`${loginStyle.mandatoryLabel}`}>
                    {/**Code added by Unnati on 08-08-2024
                     *Reason-Adding email*/}
                    <label className={`${loginStyle.subTitleColor}`}>
                      Email
                    </label>
                    {/**End of code addition by Unnati on 08-08-2024
                     *Reason-Adding email*/}
                    <span className={`${loginStyle.mandatoryField}`}>* </span>
                  </div>
                </div>
                <div className={`${loginStyle.InputError}`}>
                  <input
                    className={`${loginStyle.formInput}`}
                    type="text"
                    name="email"
                    placeholder="Email"
                    maxLength={50}
                    onChange={(e) => setEmailError("")}
                    onBlur={(e) => isValidOnBlur("email", e.target.value)}
                  />
                  <div className={`${loginStyle.formInputError}`}>
                    {emailError}
                  </div>
                </div>
              </div>
              <div className={`${loginStyle.formInputContainer}`}>
                <div
                  className={`${loginStyle.labelField}`}
                  style={{ display: "flex", width: "40%" }}
                >
                  {/**Code added by Unnati on 08-08-2024
                   *Reason-Adding Password*/}
                  <label className={`${loginStyle.subTitleColor}`}>
                    Password
                  </label>
                  {/**End of code addition by Unnati on 08-08-2024
                   *Reason-Adding Password*/}
                  <span className={`${loginStyle.mandatoryField}`}>*</span>
                </div>
                <div className={`${loginStyle.InputError}`}>
                  <input
                    className={`${loginStyle.formInput}`}
                    type="password"
                    placeholder="Password"
                    autoComplete="new-password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    maxLength={16}
                    onBlur={(e) => isValidOnBlur("password", e.target.value)}
                    onPaste={(e) => e.preventDefault()}
                    onCopy={(e) => e.preventDefault()}
                  />
                  <div className={`${loginStyle.formInputError}`}>
                    {passwordError}
                  </div>
                </div>
              </div>
              {/**Code added by Unnati on 26-05-2024
               * Reason - To add submit button,forgotpassword and create account link
               */}
              <div className={`${loginStyle.buttonContainer}`}>
                <div className={`${loginStyle.formButtonContainer}`}>
                  <input
                    type="submit"
                    value={"Submit"}
                    // disabled={isSubmitting}
                    className={`${loginStyle.loginButton}`}
                  />
                  {/**Code added by Unnati on 08-08-2024
                   *Reason-Adding forgot password link*/}
                </div>
                <Link
                  style={{ fontSize: "15px", textAlign: "right" }}
                  to="/forgotPassword"
                >
                  Forgot Password?
                </Link>
              </div>
              {/**End of code addition by Unnati on 08-08-2024
               *Reason-Adding forgot password link*/}
              <span className={`${loginStyle.mandatoryField}`}>
                * Required Fields
              </span>
              {/**End of code addition by Unnati on 26-05-2024
               * Reason - To add submit button,forgotpassword and create account link
               */}
            </form>
          </div>
          {/**Code added by Unnati on 08-08-2024
           *Reason-Adding description*/}
          <div className={`${loginStyle.registeredCustomer}`}>
            <div className={`${loginStyle.subTitleColor}`}>New Customers</div>
            <div className={`${loginStyle.description}`}>
              Creating an account has many benefits: check out faster, keep more
              than one address, track orders and more.
            </div>
            {/**End of code addition by Unnati on 08-08-2024
             *Reason-Adding description*/}
            <div className={`${loginStyle.forgotPassword}`}>
              <div>
                <Link
                  // style={{ fontSize: "15px", color: "black" }}
                  to="/signup"
                >
                  <button className={`${loginStyle.createAccountButton}`}>
                    Create an account
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
/**End of code addition by Unnati on 25-05-2024
 * Reason -to make changes in login form
 */
