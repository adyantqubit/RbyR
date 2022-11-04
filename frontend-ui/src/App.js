import React from 'react';
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


function App() {
  
  const {access_token}=getToken();
  
  return (
    <>
    <Routes>
    <Route path="/" element={ <Home/>} />
    <Route path="/Listing/:category" element={<Listing/>} />
    <Route path="/login" element={!access_token?<Login/>:<Navigate to="/"/>} />
    <Route path="/changePass" element={access_token?<ChngPass/>:<Navigate to="/login"/>}/>
    <Route path="/logout" element={access_token?"":<Navigate to="/login"/>} />
    <Route path="/sendemail" element={!access_token?<SentEmail/>:<Navigate to="/"/>}/>
    <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
    <Route path="/like" element={<Liked/>} />
    <Route path='/listing/:category/detail/:id' element={<Details/>} />


    <Route path='/custom' element={<Contact/>} />
    <Route path='/terms' element={<Terms/>} />
  
    <Route path='/cart' element={<CartSItem/>} />
  
    <Route path='/placeorder' element={access_token?<Orderpage/>:<Navigate to='/'/>}/>
    <Route path='/billing' element={<Billing/>}/>
    </Routes>
    </>
  );
}

export default App;
