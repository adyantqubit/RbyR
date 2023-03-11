import { CartState } from "../../context";
import { ToWords } from 'to-words';

const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: { // can be used to override defaults for the selected locale
      name: 'Rupee',
      plural: 'Rupees',
      symbol: '₹',
      fractionalUnit: {
        name: 'Paisa',
        plural: 'Paise',
        symbol: '',
      },
    }
  }
});

const toWorduS = new ToWords({
  localeCode: 'en-US',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: { // can be used to override defaults for the selected locale
      name: 'Dollar',
      plural: 'Dollars',
      symbol: '$',
      fractionalUnit: {
        name: 'Cent',
        plural: 'Cents',
        symbol: '',
      },
    }
  }
});


function columnSubtotal(product){

 return 300;
}

function afterColumnTotalOfferAdd(offer,cart,tax){
    var temp=0;

    cart.map(c=>
      temp+=c.quantity*c.price
    )

    var shippingCharges=Math.max(...cart.map(c=>{return c.shipping_charges}))
    
    // var gst=((temp+shippingCharges)/100)*tax
  
    var discountAmount=(temp/100)*offer.discount_percentage;

    if (discountAmount>offer.maximum_discount_price)
    { 
    discountAmount=offer.maximum_discount_price
    }

   var GrandTotal=temp+shippingCharges-discountAmount
  //  +gst
   
    return {subtotal:temp,shipping:shippingCharges,
      // tax:gst ,
      coupon:discountAmount,Grand:GrandTotal}
}



// console.log(price_in_words(1250000000));
// console.log(price_in_words(9999999999));

export {columnSubtotal,afterColumnTotalOfferAdd,toWords,toWorduS}


