import React, { useEffect,useState } from 'react'
import { Widget ,addResponseMessage} from 'react-chat-widget';
import { FloatingWhatsApp } from 'react-floating-whatsapp'
import logo from "../../assets/photos/Screenshot.png"

import 'react-chat-widget/lib/styles.css';
import { getWhatsappContactDetail } from '../../api/service';

import logoavatar from "../../assets/photos/rbyr_logo2.jpg"
import config from '../../api/config';

const Chat = () => {
  const [whatsappContactNumber, setWhatsappContactNumber] = useState(false);
  const [logo,setLogo]=useState(null)
  const getWhatsappContactNumber = async () => {
    const whatsappContactNumberData = await getWhatsappContactDetail();
    if (whatsappContactNumberData) {
      setWhatsappContactNumber(whatsappContactNumberData[0]?.whatsappNmber);
      setLogo(whatsappContactNumberData[0]?.logo)
    }
  };

 
  useEffect(()=>{
    addResponseMessage('Welcome to the RBYR exclusite site.')
    getWhatsappContactNumber()
  },[])


  // var img=document.getElementsByClassName('rcw-open-launcher')[0]
  // img.src=logo

    const handleNewUserMessage = (newMessage) => {
        // Now send the message throught the backend API
        // if(containsOnlyNumbers(newMessage)){
        // const client = require('twilio')
        window.open(`https://wa.me/+91${whatsappContactNumber}?text=${newMessage}`, '_blank');
        // client.messages.create({
        //   from: 'whatsapp:+14155238886',
        //   body: 'Ahoy world!',
        //   to: 'whatsapp:+15555555555'
        // }).then(message => console.log(message.sid));
      }
      //  else{
      //   addResponseMessage()
      //   addResponseMessage('Please send your valid whatsapp number. Our customer care service contact you soon.')
      //  }
      //   // addResponseMessage(response)
      // };

      function containsOnlyNumbers(str) {
        return /^\d+$/.test(str);
      }


  return (
  //   <div className="App" >
  //   <Widget launcherOpenImg={logo}
  //    title={<div style={{textAlign:"start",paddingLeft:"15px"}}>Inbox</div>}
  //         subtitle={<div style={{textAlign:"start",paddingLeft:"15px"}}>Typically replies within 20 minutes</div>}
  //           handleNewUserMessage={handleNewUserMessage}
  //           />
  // </div>
  <div onLoad={e=>{
  //  console.log(document.getElementsByClassName('floating-whatsapp-button')[0].childNodes[0].style.animation)
  }}>
  <FloatingWhatsApp
  avatar={logo?config.staticBaseURL+"media/"+ logo:logoavatar}
  phoneNumber={`+91 ${whatsappContactNumber}`} 
  onSubmit	={e=>handleNewUserMessage(e)}
  accountName="RBYR Exclusive"
  />
</div>
  )
}

export default Chat