import config from "../../api/config";

function WomenSizeChart(props) {
  return (
    <img
      style={{ width: "100%", height: "100%" }}
      src={
        props.womenSizeChart.length > 0
        /**
         * Modified by - Ashish Dewangan on 17-12-2023
         * Reason - To give correct path for image
         */
        // ? config.staticBaseURL + props.womenSizeChart
          ? config.staticBaseURL +"media/"+ props.womenSizeChart
        /**
         * End of modification by - Ashish Dewangan on 17-12-2023
         * Reason - To give correct path for image
         */
          : "/women_size_chart.jpg"
      }
    />
  );
}
export default WomenSizeChart;
