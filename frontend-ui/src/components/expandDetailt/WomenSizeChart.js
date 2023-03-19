import config from "../../api/config";

function WomenSizeChart(props) {
  return (
    <img
      style={{ width: "100%", height: "100%" }}
      src={
        props.womenSizeChart.length > 0
          ? config.staticBaseURL + props.womenSizeChart
          : "/women_size_chart.jpg"
      }
    />
  );
}
export default WomenSizeChart;
