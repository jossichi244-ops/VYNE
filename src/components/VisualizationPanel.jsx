import React, { useState } from "react";
import Plot from "react-plotly.js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "../assets/styles/VisualizationPanel.scss";
const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#00c49f",
  "#0088fe",
  "#d0ed57",
  "#a4de6c",
];

export default function VisualizationPanel({ visualizations }) {
  const [mode3D, setMode3D] = useState(false);

  if (!visualizations) {
    return (
      <p className="text-gray-500">No data available for visualization.</p>
    );
  }

  return (
    <div className="visualization-panel space-y-10">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Step 5: Data Visualization</h2>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={mode3D}
            onChange={(e) => setMode3D(e.target.checked)}
          />
          Hiển thị 3D
        </label>
      </div>

      {/* 🔢 Numeric columns */}
      {Object.entries(visualizations.numeric || {}).map(([col, data]) => (
        <div key={col} className="card p-4 rounded-xl shadow-md">
          <h3 className="font-semibold mb-2">Numeric: {col}</h3>

          <Plot
            data={[
              {
                x: data.histogram.bins,
                y: data.histogram.counts,
                type: "bar",
                name: "Histogram",
              },
            ]}
            layout={{
              title: data.histogram.description,
              xaxis: {
                title: {
                  text: data.histogram.x_label, // ✅ hiển thị tên trục X
                  font: { size: 14 },
                },
                showticklabels: true,
              },
              yaxis: {
                title: {
                  text: data.histogram.y_label, // ✅ hiển thị tên trục Y
                  font: { size: 14 },
                },
                showticklabels: true,
              },
              autosize: true,
              height: 400,
            }}
            style={{ width: "100%" }}
          />

          {/* Boxplot */}
          <Plot
            data={[
              {
                y: data.kde,
                type: "box",
                name: col,
                boxpoints: "outliers",
              },
            ]}
            layout={{
              title: data.boxplot.description, // ✅
              yaxis: { title: data.boxplot.y_label },
              autosize: true,
              height: 300,
            }}
            style={{ width: "100%" }}
          />
        </div>
      ))}

      {/* 🔠 Categorical columns */}
      {Object.entries(visualizations.categorical || {}).map(([col, data]) => (
        <div key={col} className="card p-4 rounded-xl shadow-md">
          <h3 className="font-semibold mb-2">Categorical: {col}</h3>

          <div className="grid grid-cols-2 gap-6">
            {/* Bar chart */}
            <BarChart width={400} height={300} data={data.bar}>
              <XAxis
                dataKey="value"
                label={{
                  value: data.x_label,
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                label={{
                  value: data.y_label,
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
            {/* Pie chart */}
            <PieChart width={400} height={300}>
              <Pie
                data={data.pie}
                dataKey="percent"
                nameKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label>
                {data.pie.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
            <p className="text-sm text-gray-500">{data.description}</p>{" "}
            {/* ✅ hiển thị mô tả */}
          </div>
        </div>
      ))}
    </div>
  );
}
