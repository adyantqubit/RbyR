import { CartState } from "../../context";


function columnSubtotal(product){

 return 300;
}

function afterColumnTotalOfferAdd(offer,cart,tax){
    var temp=0;

    cart.map(c=>
      temp+=c.quantity*c.price
    )

    var shippingCharges=Math.max(...cart.map(c=>{return c.shipping_charges}))
    
    var gst=((temp+shippingCharges)/100)*tax
  
    var discountAmount=(temp/100)*offer.discount_percentage;

    if (discountAmount>offer.maximum_discount_price)
    { 
    discountAmount=offer.maximum_discount_price
    }

   var GrandTotal=temp+gst+shippingCharges-discountAmount

    return {subtotal:temp,shipping:shippingCharges,tax:gst,coupon:discountAmount,Grand:GrandTotal}
}

export {columnSubtotal,afterColumnTotalOfferAdd}