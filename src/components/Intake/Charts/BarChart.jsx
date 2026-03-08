import React from "react";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const BarChart = ({ data, config }) => {
  const { xKey, yKey } = config;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Bar dataKey={yKey} />
      </ReBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
