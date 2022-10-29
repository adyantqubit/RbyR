import React from 'react'
import NavHeader from '../global/NavHeader'
import Slideshow from '../global/slideshow'
import Card from './card'
import Autocard from './Autocard'
import Footer from '../global/footer'
import Video from './video'
import Below from '../global/below'
import CArd2 from './card2'
import Chat from '../expandDetailt/chat'
import Footer2 from '../global/footer2'

export const Home = () => {
  return (
    <>
    <NavHeader/>
    <Slideshow />
    
    <Card/>
    <CArd2/>
    <Video/>
    <Footer2/>
    <Below/>
    {/* <Chat/> */}
    </>
  )
}
