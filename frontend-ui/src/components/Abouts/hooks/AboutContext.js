import React, { createContext, useContext, useEffect, useState } from "react";
import { WorldOfRR } from "../../../api/orderApis";

const About = createContext();


const Context2 = ({ children }) => {
  const [response,setResponse]=useState(null)


  useEffect(()=>{
    GetWorldOfRRContent()
   },[])

   async function GetWorldOfRRContent(){
       await WorldOfRR().then(r=>setResponse(r))
   }


  return (
    <About.Provider value={{response,setResponse}}>
      {children}
    </About.Provider>
  );
};

export const AboutState = () => {
  return useContext(About);
};

export default Context2;
