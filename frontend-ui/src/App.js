import React, { useEffect } from 'react';
import './App.css';
import {Routes,Route,Navigate} from 'react-router-dom'
import { Home } from './components/home/home';
import { Listing } from './components/listing/listing';
import Login from './components/authPages/login';
import ChngPass from './components/authPages/chngPass';
import ResetPassword from './components/authPages/resetPassword';

import { getToken } from './Redux-manage/services/localStorageService';
import SentEmail from './components/authPages/sentEmail';
import Liked from './components/global/liked';
import Details from './components/expandDetailt/details';
import Contact from './components/footer pages/contact';
import Terms from './components/footer pages/tac';
import CartSItem from './components/Cart/cart';
import Converter from './components/concepts/convertCurrency';
import Orderpage from './components/placeOrder/orderpage';
import Billing from './components/placeOrder/billing';
import { Profile } from './components/global/profile';
import MyOrders from './components/profile/profile';
import InsideOrder from './components/profile/insidevieworder';
import ShippingProfile from './components/profile/shipping';
import UserProfile from './components/profile/userPRofile';
import PrivacyPolicy from './components/footer pages/PrivacyPolicy';
import DeliveryPolicy from './components/footer pages/DeliveryPolicy';
import RefundPolicy from './components/footer pages/RefundPolicy';
import CancellationPolicy from './components/footer pages/CancellationPolicy';
import StoreLocator from './components/footer pages/StoreLocator';
import FAQ from './components/footer pages/FAQ';
import Bridal from './components/footer pages/bridal';
import { height } from '@mui/system';
import { notification } from 'antd';
import Chat from './components/expandDetailt/chat';
import ItDesign from './components/Abouts/ItDesign';
import Context2, { AboutState } from './components/Abouts/hooks/AboutContext';
import Celebrities from './components/Abouts/Celebrities';
import Features from './components/Abouts/Features';
import About from './components/Abouts/blankpages/about';
import Celebrity from './components/Abouts/blankpages/celebrity';
import Feature from './components/Abouts/blankpages/features';
import Editorial from './components/Abouts/blankpages/editorial';
import AboutUs from './components/Abouts/AboutUs';

function App() {
  // notification.destroy()
  var access_token=0;
  useEffect(()=>{
     access_token=localStorage.getItem("access_token")

  },[localStorage.getItem("access_token")])

  
  return (
    <>
    
    <Routes>
      
    <Route path="/" element={ <Home />} />
    <Route path="/Listing/:parent/:category" element={<Listing/>} />
    
    <Route path="/login" element={!access_token?<Login/>:<Navigate to="/"/>} />
    <Route path="/changePass" element={access_token?<ChngPass/>:<Navigate to="/login"/>}/>
    <Route path="/logout" element={access_token?"":<Navigate to="/login"/>} />
    <Route path="/sendemail" element={!access_token?<SentEmail/>:<Navigate to="/"/>}/>
    <Route path="/reset-password/:id/:token" element={<ResetPassword  />} />
    <Route path="/like" element={<Liked/>} />
    <Route path='/listing/:parent/:category/detail/:id' element={<Details/>} />


    <Route path='/custom' element={<Contact/>} />
    <Route path='/terms' element={<Terms/>} />
    <Route path='/profile' element={<MyOrders/>} />
    <Route path='/insideorder/:orderid' element={<InsideOrder/>} />

    <Route path='/cart' element={<CartSItem/>} />
 

    <Route path='/placeorder' element={<Orderpage />}/>
    <Route path='/billing' element={<Billing/>}/>
    <Route path='/shippindprofile' element={<ShippingProfile/>}/>
    <Route path='/userprofile' element={<UserProfile/>}/>

    <Route path='/privacy-policy' element={<PrivacyPolicy/>}/>
    <Route path='/delivery-policy' element={<DeliveryPolicy/>}/>
    <Route path='/refund-policy' element={<RefundPolicy/>}/>
    <Route path='/cancellation-policy' element={<CancellationPolicy/>}/>
    <Route path='/store-locator' element={<StoreLocator/>}/>
    <Route path='/FAQ' element={<FAQ/>}/>
    <Route path='/bridal' element={<Bridal/>} />

    {/* Added by Rohan -30/12/22 */}
    
        <Route path='/RRDesign' element={<ItDesign/>}/>
        {/* <Route path='/celebRR' element={<Celebrity/>}/>
        <Route path="/features" element={<Feature/>}/>
        <Route path="/aboutRR" element={<About/>} />
        <Route path="/editorial" element={<Editorial/>} /> */}
        <Route path='/celebRR' element={<Celebrities/>}/>
        <Route path="/features" element={<Features/>}/>
        <Route path="/aboutRR" element={<AboutUs/>} />
        <Route path="/editorial" element={<Editorial/>} />
    
    
    {/* End of code. */}
    
    </Routes>
    <Chat/>
    </>
  );
}

export default App;
