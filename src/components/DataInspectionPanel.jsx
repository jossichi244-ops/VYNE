// src/components/DataInspectionPanel.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import "../assets/styles/inspection-panel.scss";

export default function DataInspectionPanel({ inspection }) {
  if (!inspection) return null;

  const { shape, dtypes, memory, missing_summary, duplicates, columns } =
    inspection;

  const missingData = Object.entries(missing_summary.columns_missing || {}).map(
    ([col, count]) => ({
      column: col,
      missing: count,
      percent: missing_summary.columns_missing_percent[col] * 100,
    })
  );

  const topMissingCols = Object.entries(
    missing_summary.top_missing_columns || {}
  ).map(([col, percent]) => ({
    column: col,
    percent: percent * 100,
  }));

  const duplicateInfo = {
    count: duplicates.duplicate_count,
    sample: duplicates.duplicate_sample,
  };

  return (
    <section className="data-inspection-panel">
      <h2>Step 2: Explore Basic Data (Data Inspection)</h2>
      {/* Overview */}
      <div className="overview-grid">
        <div className="card">
          <h3>Data Size</h3>
          <p>
            <strong>{shape.rows.toLocaleString()}</strong> rows ×{" "}
            <strong>{shape.columns}</strong> columns
          </p>
        </div>
        <div className="card">
          <h3>Memory</h3>
          <p>
            Total:{" "}
            <strong>
              {memory.total ? `${(memory.total / 1024).toFixed(2)} KB` : "N/A"}
            </strong>
          </p>
        </div>
        <div className="card">
          <h3>Duplicate Rows</h3>
          <p>
            <strong>{duplicateInfo.count}</strong> rows
          </p>
        </div>
        <div className="card">
          <h3>Missing Values</h3>
          <p>
            <strong>{missing_summary.total_missing}</strong> ô (
            {(missing_summary.percent_missing * 100).toFixed(2)}%)
          </p>
        </div>
      </div>

      {/* Kiểu dữ liệu */}
      <section className="mt-6">
        <h3>Data type of each column</h3>
        <table className="inspection-table">
          <thead>
            <tr>
              <th>Column</th>
              <th>dtype</th>
              <th>Memory (bytes)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(dtypes).map(([col, dtype]) => (
              <tr key={col}>
                <td>{col}</td>
                <td>{dtype}</td>
                <td>{memory.per_column[col] || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Missing values chart */}
      <section className="mt-6">
        <h3>Top columns with many missing values</h3>
        {topMissingCols.length === 0 ? (
          <p>✔ No columns have significant missing data</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topMissingCols}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="column" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="percent" fill="#f87171" name="% thiếu" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>

      {/* Per-column details */}
      <section className="mt-6">
        <h3>Details of Each Column</h3>
        <table className="inspection-table">
          <thead>
            <tr>
              <th>Column</th>
              <th>Non-null</th>
              <th>Nulls (%)</th>
              <th>Unique (%)</th>
              <th>Top values</th>
              <th>Suggested Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(columns).map((col) => (
              <tr key={col.name}>
                <td>{col.name}</td>
                <td>{col.non_null}</td>
                <td>{(col.null_percent * 100).toFixed(2)}%</td>
                <td>{(col.unique_percent * 100).toFixed(2)}%</td>
                <td>
                  <pre>
                    {JSON.stringify(col.top_values, null, 2).slice(0, 100)}
                  </pre>
                </td>
                <td>
                  <ul>
                    {col.suggested_actions.length === 0 && <li>✔ Ổn định</li>}
                    {col.suggested_actions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="mt-6">
        <h3>Number of Missing Values by Column</h3>
        <table className="inspection-table">
          <thead>
            <tr>
              <th>Column</th>
              <th>Number of Missing Cells</th>
              <th>% Missing</th>
            </tr>
          </thead>
          <tbody>
            {missingData.map((row) => (
              <tr key={row.column}>
                <td>{row.column}</td>
                <td>{row.missing}</td>
                <td>{row.percent.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  );
}
