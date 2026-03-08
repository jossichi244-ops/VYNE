import React, { useState } from "react";
import {
  FiLayers,
  FiBarChart2,
  FiPieChart,
  FiTrendingUp,
  FiGrid,
} from "react-icons/fi";
import ChartRenderer from "../Charts/ChartRenderer";
import "./Visualizations.scss";

const VisualizerCard = ({ title, data, initialType, desc }) => {
  // Cho phép người dùng thay đổi loại chart tại chỗ
  const [chartType, setChartType] = useState(initialType);

  const availableTypes = [
    { id: "bar", icon: <FiBarChart2 /> },
    { id: "line", icon: <FiTrendingUp /> },
    { id: "pie", icon: <FiPieChart /> },
    { id: "heatmap", icon: <FiGrid /> },
  ];

  return (
    <div className="viz-card">
      <div className="viz-card-header">
        <div className="info">
          <h5>{title}</h5>
          {desc && <p>{desc}</p>}
        </div>
        <div className="chart-selector">
          {availableTypes.map((t) => (
            <button
              key={t.id}
              className={chartType === t.id ? "active" : ""}
              onClick={() => setChartType(t.id)}
              title={`Switch to ${t.id}`}>
              {t.icon}
            </button>
          ))}
        </div>
      </div>
      <div className="chart-content">
        <ChartRenderer type={chartType} data={data} />
      </div>
    </div>
  );
};

const Visualizations = ({ dataset }) => {
  const advancedResults = dataset?.advanced?.results;

  // Logic tự động đoán Chart phù hợp nếu không có initialType
  const autoDetectType = (data) => {
    if (!data) return "bar";
    // Nếu dữ liệu có dạng ma trận (nhiều hơn 2 cột định danh) -> Heatmap
    if (data.some((d) => Object.keys(d).length > 3)) return "heatmap";
    // Nếu có key liên quan đến thời gian -> Line
    if (data.some((d) => d.date || d.month || d.year)) return "line";
    return "bar";
  };

  if (!advancedResults)
    return <div className="empty-viz">No Data available</div>;

  return (
    <div className="advanced-viz-container">
      <header className="viz-main-header">
        <FiLayers /> <h2>Intelligence Insights</h2>
      </header>

      <div className="visual-grid">
        {Object.entries(advancedResults)
          .filter(([key]) => !["scenario", "storytelling"].includes(key)) // 🔥 loại bỏ 2 block này
          .map(([key, value]) => {
            if (!value || value.error) return null;

            /* ================================
         1️⃣ COHORT (special case)
      ================================= */
            if (key === "cohort") {
              return (
                <VisualizerCard
                  key={key}
                  title="Cohort Retention"
                  desc="Customer health and stickiness over time"
                  data={value.retention_matrix}
                  initialType="heatmap"
                />
              );
            }

            /* ================================
         2️⃣ ROOT CAUSE (nếu có factors)
      ================================= */
            if (key === "root_cause" && value.factors) {
              const rootData = Object.entries(value.factors).map(([k, v]) => ({
                name: k,
                value: typeof v === "number" ? v : Number(v || 0),
              }));

              return (
                <VisualizerCard
                  key={key}
                  title="Root Cause Drivers"
                  desc="Key contributing factors"
                  data={rootData}
                  initialType="bar"
                />
              );
            }

            /* ================================
         3️⃣ Generic ML blocks
      ================================= */
            const chartData =
              value.ml_importances || value.ml_coefficients || value.data;

            if (!chartData) return null;

            const formattedData = Array.isArray(chartData)
              ? chartData
              : Object.entries(chartData).map(([k, v]) => ({
                  name: k,
                  value:
                    typeof v === "number" ? v : Number(v?.$numberDouble || 0),
                }));

            return (
              <VisualizerCard
                key={key}
                title={`Analysis: ${key}`}
                data={formattedData}
                initialType={autoDetectType(formattedData)}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Visualizations;
