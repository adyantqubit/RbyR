import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Header1 from "./components/Header/Header1.jsx";
import Footer from "./components/Footer/Footer";
import Profile from "./pages/Profile/Profile";
/**Added by - Unnati on 29-05-2024
 * Reason-To import forgot password,contact us,about us
 */
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword.js";
import ContactUs from "./pages/ContactUs/ContactUs.jsx";
import AboutUs from "./pages/AboutUs/AboutUs.jsx";
/**End of code addition by Unnati on 29-05-2024
 * Reason-To import forgot password,contact us,about us
 */
import ProfileEdit from "./pages/Profile/ProfileEdit.jsx";
import Faq from "./pages/Faq/Faq.jsx";
import StoreLocator from "./pages/StoreLocator/StoreLocator.jsx";
import TermsAndConditions from "./pages/TermsAndConditions/TermsAndConditions.jsx";
import OurPolicies from "./pages/OurPolicies/OurPolicies.jsx";
import ProductDetail from "./pages/ProductDetail/ProductDetail.jsx";
import Category from "./pages/Category/Category.jsx";
import ViewCart from "./pages/ViewCart/ViewCart.jsx";
import ReturnsAndExchanges from "./pages/ReturnsAndExchanges/ReturnsAndExchanges.jsx";
import CheckOut from "./pages/CheckOut/CheckOut.jsx";
import MyAccount from "./pages/MyAccount/MyAccount.jsx";
import OrderHistory from "./pages/OrderHistory/OrderHistory.jsx";
import OrderDetail from "./pages/OrderDetail/OrderDetail.jsx";
import Invoice from "./pages/Invoice/Invoice.jsx";
import Shipping from "./pages/Shipping/Shipping.jsx";
import Help from "./pages/Help/Help.jsx";
import BigAndTall from "./pages/BigAndTall/BigAndTall.jsx";
import RequestCatalog from "./pages/RequestCatalog/RequestCatalog.jsx";
import Blog from "./pages/Blog/Blog.jsx";
import BlogDetails from "./pages/BlogDetails/BlogDetails.jsx";
import SearchResult from "./pages/SearchResult/SearchResult.jsx";
import SaleProduct from "./pages/SaleProduct/SaleProduct.jsx";
import PaymentDetail from "./pages/PaymentDetail/PaymentDetail.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy.jsx";
import LeaveFeedback from "./pages/LeaveFeedback/LeaveFeedback.jsx";
import CreditNote from "./pages/CreditNote/CreditNote.jsx";
import Wishlist from "./pages/Wishlist/Wishlist.jsx";
import ComingSoon from "./pages/ComingSoon/ComingSoon.jsx";
import PaymentProcessing from "./pages/PaymentDetail/PaymentProcessing";
import ExchangePaymentProcessing from "./pages/OrderDetail/ExchangePaymentProcessing.jsx";
import ExchangeInvoice from "./pages/ExchangeInvoice/ExchangeInvoice.jsx";
import OrderItems from "./pages/OrderItems/OrderItems.jsx";
function App() {
  return (
    <div>
      {/* 
      Added by - Ashish Dewangan on 24-05-2024
      Reason - To show header */}

      <Header1 />
      {/* 
      End of code addition by - Ashish Dewangan on 24-05-2024
      Reason - To show header */}

      {/* 
      Added by - Ashish Dewangan on 22-05-2024
      Reason - To have routes for different pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* 
      Added by - Unnati Bajaj on 26-05-2024
      Reason - To have route for forgot password */}
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        {/* 
      End of code addition by - Unnati Bajaj on 26-05-2024
      Reason - To have route for forgot password */}
        {/* 
      Added by - Unnati Bajaj on 29-05-2024
      Reason - To have route for contact us */}
        <Route path="/contactus" element={<ContactUs />} />
        {/* 
      End of code addition by - Unnati Bajaj on 29-05-2024
      Reason - To have route for contact us */}
        {/* 
      Added by - Unnati Bajaj on 29-05-2024
      Reason - To have route for about us  */}
        <Route path="/aboutus" element={<AboutUs />} />
        {/* 
      End of code addition by - Unnati Bajaj on 29-05-2024
      Reason - To have route for about us */}
        {/* 
      Added by - Unnati Bajaj on 01-06-2024
      Reason - To have route for profile,profile edit,FAQ,Store Locator,terms and conditions,our policies  */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/profileEdit" element={<ProfileEdit />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/storelocator" element={<StoreLocator />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/ourpolicies" element={<OurPolicies />} />
        {/* 
      End of code addition by Unnati Bajaj on 01-06-2024
      Reason - To have route for profile,profile edit,FAQ,Store Locator,terms and conditions,our policies  */}
        {/**Code added by Unnati Bajaj on 19-06-2024
         *Reason- To have route for product detail */}
        <Route path="/productdetail/:identifier" element={<ProductDetail />} />

        {/**End of code addition by Unnati Bajaj on 19-06-2024
         *Reason- To have route for product detail */}
        {/**Code added by Unnati Bajaj on 20-06-2024
         *Reason- To have route for Category */}
        <Route path="/category" element={<Category />} />
        <Route path="/category/:id" element={<Category />} />
        {/**End of code addition by Unnati Bajaj on 20-06-2024
         *Reason- To have route for Category */}
        {/**Code added by Unnati Bajaj on 13-07-2024
         *Reason- To have route for view cart*/}
        <Route path="/viewcart" element={<ViewCart />} />
        {/**End of code addition by Unnati Bajaj on 13-07-2024
         *Reason- To have route for view cart*/}
        {/**Code added by Unnati Bajaj on 15-07-2024
         *Reason- To have route for return and exchanges*/}
        <Route
          path="/returns-and-exchanges"
          element={<ReturnsAndExchanges />}
        />
        {/**End of code addition by Unnati Bajaj on 15-07-2024
         *Reason- To have route for return and exchanges*/}
        {/**Code added by Unnati Bajaj on 20-07-2024
         *Reason- To have route for Checkout*/}
        <Route path="/checkout" element={<CheckOut />} />
        {/**End of code addition by Unnati Bajaj on 20-07-2024
         *Reason- To have route for Checkout*/}
        {/**Code added by Unnati Bajaj on 02-08-2024
         *Reason- To have route for my account*/}
        <Route path="/myaccount" element={<MyAccount />} />
        {/**End of code addition by Unnati Bajaj on 02-08-2024
         *Reason- To have route for my account*/}
        {/**Code added by Unnati Bajaj on 02-08-2024
         *Reason- To have route for order history*/}
        <Route path="/orderhistory" element={<OrderHistory />} />
        {/**End of code addition by Unnati Bajaj on 02-08-2024
         *Reason- To have route for order history*/}
        {/**Code added by Unnati Bajaj on 02-08-2024
         *Reason- To have route for order history*/}
        <Route path="/orderdetail/:id" element={<OrderDetail />} />
        {/**End of code addition by Unnati Bajaj on 02-08-2024
         *Reason- To have route for order history*/}
        {/**Code added by Unnati Bajaj on 04-08-2024
         *Reason- To have route for invoice*/}
        {/* Modified by jhamman on 23-10-2024
         Reason - changed path with id because we want to fetch ordetail from backend firstly it going from state*/}
        {/* <Route path="/invoice" element={<Invoice />} /> */}
        <Route path="/invoice/:id" element={<Invoice />} />
        {/* End pf modification by jhamman on 23-10-2024
         Reason - changed path with id because we want to fetch ordetail from backend firstly it going from state*/}
        {/**End of code addition by Unnati Bajaj on 04-08-2024
         *Reason- To have route for order history*/}
        {/**Code commented by Unnati Bajaj on 06-10-2024
         *Reason- To have route for brand*/}
        {/* <Route path="/brand/:id" element={<Brand />} /> */}
        {/**End of code commented by Unnati Bajaj on 06-10-2024
         *Reason- To have route for brand*/}
        {/**Code added by Unnati Bajaj on 11-08-2024
         *Reason- To have route for Shipping page*/}
        <Route path="/shipping" element={<Shipping />} />
        {/**End of code addition by Unnati Bajaj on 11-08-2024
         *Reason- To have route for Shipping page*/}
        {/**Code added by Unnati Bajaj on 12-08-2024
         *Reason- To have route for Help page*/}
        <Route path="/help" element={<Help />} />
        {/**End of code addition by Unnati Bajaj on 12-08-2024
         *Reason- To have route for Help  page*/}
        {/**Code added by Unnati Bajaj on 12-08-2024
         *Reason- To have route for big and tall inquiry page*/}
        <Route path="/bigAndTall" element={<BigAndTall />} />
        {/**End of code addition by Unnati Bajaj on 12-08-2024
         *Reason- To have route for big and tall inquiry  page*/}
        {/**Code added by Unnati Bajaj on 18-08-2024
         *Reason- To have route for Request Catalog page*/}
        <Route path="/requestcatalogue" element={<RequestCatalog />} />
        {/**End of code addition by Unnati Bajaj on 18-08-20244
         *Reason- To have route for Request Catalog page*/}
        {/**Code added by Unnati Bajaj on 22-08-2024
         *Reason- To have route for blog page*/}
        <Route path="/blog" element={<Blog />} />
        {/**End of code addition by Unnati Bajaj on 22-08-20244
         *Reason- To have route for blog page*/}
        {/**Code added by Unnati Bajaj on 22-08-2024
         *Reason- To have route for each blog page*/}
        <Route path="/blog/:id" element={<BlogDetails />} />
        {/**End of code addition by Unnati Bajaj on 22-08-2024
         *Reason- To have route for each blog page*/}
        {/**Code added by Unnati Bajaj on 01-09-2024
         *Reason- To have route for search results*/}
        <Route path="/searchresults" element={<SearchResult />} />
        {/**End of code addition by Unnati Bajaj on 01-09-2024
         *Reason- To have route for search results*/}
        {/**Code added by Unnati on 05-10-2024
         *Reason-To have route for sale products */}
        <Route path="/saleproducts" element={<SaleProduct />} />
        {/**End of code addition by Unnati on 05-10-2024
         *Reason-To have route for sale products */}
        {/**Code added by Unnati on 07-10-2024
         *Reason-To have route for payment details */}
        <Route path="/paymentdetail" element={<PaymentDetail />} />
        {/**End of code addition by Unnati on 07-10-2024
         *Reason-To have route for payment details */}
        {/* Added by - Ashlekh on 08-10-2024
         Reason - To have route for privacy policy */}
          <Route path="/privacy_policy" element={<PrivacyPolicy />} />
         {/* End of code - Ashlekh on 08-10-2024
         Reason - To have route for privacy policy */}       
          {/**Code added by Unnati on 23-10-2024
         *Reason-To have route for leave feedback*/}
        <Route path="/leavefeedback" element={<LeaveFeedback />} />
        {/**End of code addition by Unnati on 23-10-2024
         *Reason-To have route for leave feedback */}
        {/**Code added by Unnati on 08-11-2024
         *Reason-To have route for credit note*/}
        <Route path="/creditnote/:id" element={<CreditNote />} />
        {/*End of code addition by Unnati on 08-11-2024
         *Reason-To have route for credit note*/}
        {/* Added by - Ashlekh on 04-11-2024
         Reason - To have route for wishlist */}
        <Route path="/wishlist" element={<Wishlist />} />
        {/* End of code - Ashlekh on 04-11-2024
         Reason - To have route for wishlist */}
        {/* Added by - Unnati on 16-11-2024
         Reason - To have route for coming soon */}
        <Route path="/coming-soon" element={<ComingSoon />} />
        {/*End of code addition by - Unnati on 16-11-2024
         Reason - To have route for coming soon */}
         {/* Added by - Ashish Dewangan on 27-11-2024
         * Reason - Added route for payment processing page */}
        <Route path="/payment_processing" element={<PaymentProcessing />} />
        {/* End of addition by - Ashish Dewangan on 27-11-2024
         * Reason - Added route for payment processing page */}
         {/*Code added by Unnati on 20-12-2024
         *Reason-To have exchange payment processing page and exchange invoice page
         */}
         <Route path="/exchange_payment_processing" element={<ExchangePaymentProcessing />} />
         <Route path="/exchange_invoice/:id" element={<ExchangeInvoice />} />
         {/*End of code addition by Unnati on 20-12-2024
         *Reason-To have exchange payment processing page and exchange invoice page
         */}
         {/**Code added by Unnati on 10-01-2025
         *Reason-Added order item path */}
         <Route path="/order-item" element={<OrderItems />} />
         {/**End of code addition by Unnati on 10-01-2025
         *Reason-Added order item path */}
      </Routes>
      {/* 
      End of code addition by - Ashish Dewangan on 22-05-2024
      Reason - To have routes for different pages */}

      {/* 
      Added by - Ashish Dewangan on 24-05-2024
      Reason - To show footer */}
      <Footer />
      {/* 
      End of code addition by - Ashish Dewangan on 24-05-2024
      Reason - To show footer */}
    </div>
  );
}

export default App;
