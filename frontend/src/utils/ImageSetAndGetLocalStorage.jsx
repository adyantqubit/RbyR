/**Code added by Unnati on 19-01-2025
 * Reason-To store image in local storage and get image in local storage  
 */
export function saveImageToLocalStorage(file, key) {
  /**Code modified by unnati on 25-01-2025
   * Reason-Modified code for save image 
   */
  return new Promise((resolve, reject) => {
    if (!file || !(file instanceof Blob)) {
      resolve("No file provided, skipping storage.");
      return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
      const base64Image = event.target.result;
      localStorage.setItem(key, base64Image);
      resolve("Image saved to localStorage.");
    };
    reader.onerror = function (error) {
      reject("Error occurred while reading the file.");
    };
    reader.readAsDataURL(file);
  });
}
/**End of code modification by unnati on 25-01-2025
   * Reason-Modified code for save image 
   */
  export function getImageFromLocalStorage(key) {
    const base64Image = localStorage.getItem(key) || null;
    if (base64Image) {
      return base64Image;
    } else {
      console.warn("No image found in localStorage.");
      return null;
    }
  }
  /**End of code addition by Unnati on 19-01-2025
 * Reason-To store image in local storage and get image in local storage  
 */