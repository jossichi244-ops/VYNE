import React from "react";
import { FiActivity, FiPieChart, FiInfo } from "react-icons/fi";
import { motion } from "framer-motion";
import "./DescriptiveStats.scss";

const GenericDashboard = ({ dataset }) => {
  const { numeric = {}, categorical = {} } = dataset?.descriptive || {};

  // Lấy 4 key numeric đầu tiên để làm KPI nổi bật
  const kpiKeys = Object.keys(numeric).slice(0, 4);

  return (
    <div className="generic-powerbi">
      {/* --- ZONE 1: AUTOMATIC KPI CARDS --- */}
      <div className="kpi-grid">
        {kpiKeys.map((key, idx) => (
          <motion.div
            key={key}
            className={`kpi-card color-${idx % 4}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}>
            <div className="kpi-header">
              <span className="label">{key.replace(/_/g, " ")}</span>
              <FiInfo size={14} />
            </div>
            <div className="kpi-value">
              {numeric[key].mean > 1000
                ? (numeric[key].mean / 1000).toFixed(1) + "K"
                : numeric[key].mean.toFixed(2)}
            </div>
            <div className="kpi-footer">
              Avg. value based on {numeric[key].count} records
            </div>
          </motion.div>
        ))}
      </div>

      <div className="main-layout">
        {/* --- ZONE 2: NUMERIC COMPARISON TABLE --- */}
        <div className="content-box numeric-table">
          <div className="box-header">
            <FiActivity /> <span>Detailed Numeric Profiles</span>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Metric Name</th>
                  <th>Median</th>
                  <th>Std Dev</th>
                  <th>Outliers</th>
                  <th>Distribution</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(numeric).map(([key, stats]) => (
                  <tr key={key}>
                    <td className="font-bold">{key}</td>
                    <td>{stats.median.toLocaleString()}</td>
                    <td>{stats.std.toFixed(2)}</td>
                    <td className={stats.outliers > 0 ? "text-warn" : ""}>
                      {stats.outliers}
                    </td>
                    <td>
                      <div className="mini-dist-track">
                        <div
                          className="mini-dist-fill"
                          style={{
                            width: `${Math.min(100, (stats.mean / stats.max) * 100)}%`,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- ZONE 3: CATEGORICAL RANKING --- */}
        <div className="content-box categorical-grid">
          <div className="box-header">
            <FiPieChart /> <span>Categorical Breakdown</span>
          </div>
          <div className="cat-cards-container">
            {Object.entries(categorical).map(([key, stats]) => (
              <div key={key} className="cat-mini-card">
                <div className="cat-title">
                  <span>{key}</span>
                  <small>{stats.unique} unique</small>
                </div>
                <div className="bar-stack">
                  {stats.top_values.slice(0, 3).map((v, i) => (
                    <div key={i} className="bar-group">
                      <div className="bar-info">
                        <span className="name">{v.value}</span>
                        <span className="pct">{v.percent}%</span>
                      </div>
                      <div className="bar-bg">
                        <motion.div
                          className="bar-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${v.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericDashboard;
