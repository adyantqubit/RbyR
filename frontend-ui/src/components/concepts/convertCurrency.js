import { useEffect, useState } from 'react';
import Axios from 'axios';
import Dropdown from 'react-dropdown';
import { HiSwitchHorizontal } from 'react-icons/hi';
import 'react-dropdown/style.css';
import './styles.css';
import { CartState } from '../../context';

function Converter() {

// Initializing all the state variables
const [info, setInfo] = useState([]);
const [options, setOptions] = useState([]);

const {currency,setCurrency,to,setTo}=CartState()
  
// Calling the api whenever the dependency changes
useEffect(() => {
	Axios.get(
`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/inr.json`)
.then((res) => {
	const data={
		'INR':[res.data["inr"].inr,"₹"],
		'USD':[res.data["inr"].usd,"$"],
		'GBP':[res.data['inr'].gbp,"£"]
	}
	setInfo(data);
	
	})
}, []);

// Calling the convert function whenever
// a user switches the currency
useEffect(() => {
    console.log(info)
	setOptions(Object.keys(info));
}, [info])

useEffect(()=>{
  
},[])

function curencyvalue(e){
	const data={
		value:info[e][0],
		sign:info[e][1]
	}
	console.log(data)
    setCurrency(data)	
}

return (
        <>
		<div className="right">
		<Dropdown options={options}
					onChange={(e) => {curencyvalue(e.value);setTo(e.value)}}
		value={to} placeholder="To" />
		</div>
	
	</>
);
}

export default Converter;
