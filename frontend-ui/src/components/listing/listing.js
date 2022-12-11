import React from 'react'
import Below from '../global/below'
import Footer from '../global/footer'
import ListPage from './listPage'
import {BsFillChatTextFill} from'react-icons/bs'
import Chat from '../expandDetailt/chat'
import Footer2 from '../global/footer2'
import { notification } from 'antd';

export const Listing  = () => {
  notification.destroy()
  return (
    <>
    {/* <NavHeader/> */}
    <ListPage />
    {/* <Footer/>
    <Below/> */}
{/* <Chat/>     */}
</>
  )
}
