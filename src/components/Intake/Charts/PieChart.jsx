import React from "react";
import {
  PieChart as RePieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PieChart = ({ data, config }) => {
  const { nameKey, valueKey } = config;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RePieChart>
        <Pie data={data} dataKey={valueKey} nameKey={nameKey} outerRadius={100} />
        <Tooltip />
      </RePieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;