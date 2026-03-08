// ChartFactory.js

import BarChart from "./BarChart";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import Heatmap from "./Heatmap";

const ChartFactory = (type) => {
  switch (type) {
    case "bar":
      return BarChart;
    case "line":
      return LineChart;
    case "pie":
      return PieChart;
    case "heatmap":
      return Heatmap;
    default:
      return null;
  }
};

export default ChartFactory;
