import React, { useEffect, useState } from 'react'
import { Widget ,addResponseMessage} from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';
import { getWhatsappContactDetail } from '../../api/service';

const Chat = () => {
  const [whatsappContactNumber, setWhatsappContactNumber] = useState(false);

  const getWhatsappContactNumber = async () => {
    const whatsappContactNumberData = await getWhatsappContactDetail();
    if (whatsappContactNumberData) {
      setWhatsappContactNumber(whatsappContactNumberData[0].whatsappNmber);
    }
  };


  useEffect(()=>{
    addResponseMessage('Welcome to the RBYR exclusite site.')
    getWhatsappContactNumber()
  },[])


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
    <div className="App" >
    <Widget  title="Inbox"
          subtitle="Typically replies within 20 minutes"
            handleNewUserMessage={handleNewUserMessage}
            />
  </div>
  )
}

export default Chat