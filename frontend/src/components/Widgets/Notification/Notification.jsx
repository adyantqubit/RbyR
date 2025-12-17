/**
 * Added by - Ashish Dewangan on 24-05-2024
 * Reason - Added configuration for notification
 */
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notificationObject = new Notyf({
  duration: 2000,
  position: {
    x: "right",
    y: "top",
  },
  types: [
    {
      type: "success",
      background: '#4AB516',
    },
    /**Code added by Unnati on 13-06-2024
     * Reason-Added notification colour to error type
     */
    {
      type:"error",
      background: '#009fe3',
    },
     /**End of code addition by Unnati on 13-06-2024
     * Reason-Added notification colour to error type
     */
    // Added by - Ashlekh on 14-02-2025
    // Reason - Added notification color for warning
     {
      type: "warning",
      background: '#d42222',
    },
    // End of code - Ashlekh on 14-02-2025
    // Reason - Added notification color for warning
  ],
});

export default notificationObject;
