import { useEffect, useState } from 'react';
import Axios from 'axios';
import Dropdown from 'react-dropdown';
import { HiSwitchHorizontal } from 'react-icons/hi';
import 'react-dropdown/style.css';
import './styles.css';
import { CartState } from '../../context';
import { CurrencySaver, CurrencySaverGetter } from '../../api/orderApis';

function Converter() {

	// Initializing all the state variables
	const [info, setInfo] = useState([]);
	const [options, setOptions] = useState([]);

	const { currency, setCurrency, to, setTo } = CartState()

	// Calling the api whenever the dependency changes
	useEffect(() => {
		Axios.get(
			`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/inr.json`)
			.then((res) => {

				const data = {
					'INR': [res.data["inr"].inr, "₹", "INR"],
					'USD': [res.data["inr"].usd, "$", "USD"],
					/*
						Commented by - Ashish Dewangan on 15-02-2023
						Reason - To show only INR and USD
					*/
					// 'GBP': [res.data['inr'].gbp, "£", "GBP"]
					/**
					 * End of comment
					 */
				}
				setInfo(data);

			})
	}, []);

	// Calling the convert function whenever
	// a user switches the currency
	useEffect(() => {
		setOptions(Object.keys(info));

		if (localStorage.getItem('access_token'))
			CurrencySaverGet()
            
            // var value=info
			// 	console.log("............................",value)

			 if(info.INR)
	         if(localStorage.getItem("currency") && !localStorage.getItem("access_token")){
				var value=info[`${localStorage.getItem("currency")}`]
				setCurrency({name: value[2], value: value[0], sign: value[1] })		

			 }

	}, [info])


	async function CurrencySaverGet() {
		await CurrencySaverGetter().then(r => {
			{/* Modification and addition by Om Shrivastava on 29-10-23
            Reason : When data is null then I need to add the condition */}
			// if (r)
			// 	setCurrency({ name: r?.currency, sign: r?.currency_sign, value: info[r?.currency][0] })
			// else
			// 	setCurrency({ name: "INR", value: info[r?.currency][0], sign: "₹" })
			if (r!=null && r!=undefined)
				setCurrency({ name: r.currency?r.currency:"INR", sign: r.currency_sign?r.currency_sign:"₹" , value:r.currency && info[r.currency]? info[r?.currency][0]:"inr" })
			else
				setCurrency({ name: "INR", value: "inr", sign: "₹" })
			// End of Modification and addition by Om Shrivastava on 29-10-23
            // Reason : When data is null then I need to add the condition
		})
	}

	async function currencySave(e, d) {
		const data = {
			name: info[e][2],
			value: info[e][0],
			sign: info[e][1]
		}
		// setCurrency(data)
		await CurrencySaver(data).then(r => {
			setCurrency({ name: r.name, sign: r.sign, value: r.value })
		})
	}



	function curencyvalue(e) {
		const data = {
			name: info[e][2],
			value: info[e][0],
			sign: info[e][1]
		}
		setCurrency(data)
	}

	return (

		<div className="right" >
			<Dropdown options={options} 
				onChange={(e) => {
					curencyvalue(e.value); setTo(e.value);
					if (localStorage.getItem('access_token')) {
						currencySave(e.value, e.data); CurrencySaverGet()
					}
					else{
						var data=info[e.value][2]
						localStorage.setItem("currency",data)
					}
				}}
				value={currency.name} placeholder="To"
				
				/>
		</div>

	);
}

export default Converter;
