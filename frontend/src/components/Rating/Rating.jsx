/**Code added by Unnati on 18-10-2024
 * Reason-To make rating component
 */
import React from "react";
import ReactStars from "react-stars";

const Rating = ({ value }) => {
  return (
    <>
      <ReactStars
        count={5}
        value={value}
        size={12}
        color2={"#ffd700"}
        edit={false}
      />
    </>
  );
};

export default Rating;

/**End of code addition by Unnati on 18-10-2024
 * Reason-To make rating component
 */
