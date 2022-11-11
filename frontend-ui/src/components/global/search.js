import { style } from '@mui/system';
import { Button, Drawer } from 'antd';
import React, { useState } from 'react';
import {BsSearch} from 'react-icons/bs'
import { useNavigate } from 'react-router-dom';
import config from '../../api/config';
import { CartState } from '../../context';
import styles from './search.module.css'

const Search= () => {
  const [open, setOpen] = useState(false);
  const {product}=CartState()
  const [searchField, setSearchField] = useState("");


  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };


  const filteredPersons = product.filter(
    person => {
      if(
        person
        .title
        .toLowerCase()
        .includes(searchField.toLowerCase())&&searchField.length>0
      ){
        return person;
      }
    }
  );

  const handleChange = e => {
    setSearchField(e.target.value);
  };

  const nav=useNavigate()
  function openDetail(id){
    // nav(`/listing/${id.category}/detail/${id.id}`)
  }

  return (
    <>
      <BsSearch style={{fontSize:"22px",marginTop:"10px",color:"#7c7c7c"}} type="primary" onClick={showDrawer} />
        
     
      <Drawer width="50%" headerStyle={{height:"200px",backgroundColor:"white"}} placement="right" onClose={onClose} open={open} style={{display:"flex",justifyContent:"center"}}>
         <div style={{width:"100%",height:"auto",display:"flex",justifyContent:"center"}}>
          <div style={{width:"90%",height:"52px",borderBottom:"1px solid black"}}>
          <BsSearch style={{marginRight:"20px",fontSize:"20px",color:"#7c7c7c"}}/><input type="text" style={{outline:"0px",height:"50px",border:"none",fontFamily:"Arial, FontAwesome",fontSize:"18px",color:"#7c7c7c",width:"80%"}}  placeholder="Type what you are looking for..." onChange={e=>handleChange(e)}></input>
          </div>
          </div>

          <div className={styles.slab}>

            {filteredPersons?filteredPersons.map((p,i)=>(

              <div className={styles.item}>
               <a href={`/listing/${p.category}/detail/${p.id}`}><img src={config.apiBaseURL+p.img_main} onClick={e=>openDetail(p)}></img></a> 
                <div className={styles.title} ><span>{p.title}</span></div>  
                <div className={styles.price} >₹ {p.price}</div>
              </div>

            )):""}
            </div>
          
          {/* {filteredPersons.length>0?
            filteredPersons.map(r=>{
                <div>{r.title}</div>
            }):<div>empty</div>
          } */}
      </Drawer>
    </>
  );
};

export default Search;