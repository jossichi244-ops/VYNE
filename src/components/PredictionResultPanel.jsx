import React, { useState } from "react";

export default function PredictionResultPanel({ data, onTargetSelect }) {
  const [selectedTarget, setSelectedTarget] = useState("");

  if (!data) return <p>No prediction data available.</p>;

  const {
    detected_types,
    preprocessing_log,
    feature_engineering_log,
    feature_selection_log,
    processed_data_preview,
    model_selection_log,
  } = data;

  // Gợi ý target candidates (bỏ cluster)
  const candidateTargets = Object.keys(detected_types).filter(
    (col) => !col.toLowerCase().includes("cluster")
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedTarget(value);
    if (onTargetSelect) {
      onTargetSelect(value);
    }
  };

  return (
    <div className="prediction-result-panel">
      <h2>🎯 Select Target Column</h2>
      <select
        value={selectedTarget || data.target_col || ""}
        onChange={handleChange}>
        <option value="">-- Auto Detect --</option>
        {candidateTargets.map((col) => (
          <option key={col} value={col}>
            {col}
          </option>
        ))}
      </select>

      <h2>Detected Data Types</h2>
      <pre>{JSON.stringify(detected_types, null, 2)}</pre>

      <h2>Preprocessing Log</h2>
      <pre>{JSON.stringify(preprocessing_log, null, 2)}</pre>

      <h2>Processed Data Preview</h2>
      {processed_data_preview && processed_data_preview.length > 0 ? (
        <table
          border="1"
          cellPadding="5"
          style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {Object.keys(processed_data_preview[0]).map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processed_data_preview.map((row, idx) => (
              <tr key={idx}>
                {Object.values(row).map((val, i) => (
                  <td key={i}>{val?.toString()}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No processed data preview available.</p>
      )}

      <h2>Feature Engineering Log</h2>
      <pre>{JSON.stringify(feature_engineering_log, null, 2)}</pre>

      <h2>Feature Selection Log</h2>
      <pre>{JSON.stringify(feature_selection_log, null, 2)}</pre>

      <h2>Model Selection Log</h2>
      <pre>{JSON.stringify(model_selection_log, null, 2)}</pre>
    </div>
  );
}
