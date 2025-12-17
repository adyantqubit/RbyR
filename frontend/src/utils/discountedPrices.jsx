/* Added by - Jhamman on 05-10-2024
  Reason - added a function to calculate sale price after added percentage*/
export const calculateDiscountFromProduct = (
  price,
  discountPercentage
) => {
  const discountPrice = price * (discountPercentage / 100);
  const priceAfterDiscount = price - discountPrice;
  return Math.round(priceAfterDiscount * 1e2) / 1e2;
};

// export const calculateDiscountedPriceInAmount = (price, discountAmount) => {
//   const discount = discountAmount;
//   const discountPrice = price - discount;
//   return discountPrice.toFixed(2);
// };

// export const convertDiscountAmountInPercentage = (price, discountAmount) => {
//   const percentage = (discountAmount / price) * 100;
//   console.log(Math.trunc(percentage));
//   return Math.trunc(percentage);
// };
/* End of addition by - Jhamman on 05-10-2024
  Reason - added a function to calculate sale price after added percentage*/

// export const checkWhichOfferToApply = (
//   bannerPercentage,
//   categoryBannerPercentage
// ) => {
//   if (bannerPercentage && categoryBannerPercentage) {
//     if (bannerPercentage <= categoryBannerPercentage) {
//       return bannerPercentage;
//     } else {
//       return categoryBannerPercentage;
//     }
//   } else {
//     if (bannerPercentage) {
//       return bannerPercentage;
//     } else {
//       return categoryBannerPercentage;
//     }
//   }
// };

// export const calculateDiscountFromBanner = (
//   price,
//   bannerPercentage,
//   categoryBannerPercentage
// ) => {
//   const offerDiscount = checkWhichOfferToApply(
//     bannerPercentage,
//     categoryBannerPercentage
//   );
//   const discountPrice = price * (offerDiscount / 100);
//   const priceAfterDiscount = price - discountPrice;
//   return Math.round(priceAfterDiscount * 1e2) / 1e2;
// };
