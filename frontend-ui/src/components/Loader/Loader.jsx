// Added by Om Shrivastava on 08-11-23
// Reason : Create the loader
import React from "react";
import { Space, Spin } from "antd";
import "./loader.module.css";
// import loader from '../../images/adyant.jpeg'
import loader from "../../images/adyant.jpeg"

export default function Loader() {
  return (
    <div className="load-wrap" style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}>
      <div className="loading" style={{display:"flex",flexDirection:'column'}}>
        {/* <img src={loader} style={{ width: "200px", height: "200px" }} /> */}

        {/* <p>Adyant</p> */}
        <br />
        <Space size="middle" style={{margin:'0 auto'}}>
          <Spin size="small" />
          <Spin size="large" />
        </Space>
      </div>
      {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src={loader} style={{ width: '200px', height: '50px' }} />
            </div> */}
    </div>
  );
}
// End of addition by Om Shrivastava on 08-11-23
// Reason : Create the loader