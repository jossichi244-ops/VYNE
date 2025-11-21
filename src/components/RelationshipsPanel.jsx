// src/components/RelationshipsPanel.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";

const RelationshipsPanel = ({ relationships }) => {
  if (!relationships) return null;

  const { categorical_vs_categorical, numeric_vs_numeric, mixed } =
    relationships;

  const Section = ({ title, children, data }) => (
    <div className="relationships-section">
      <h3>{title}</h3>
      {data && Object.keys(data).length > 0 ? (
        children
      ) : (
        <p className="text-muted">No data available to display.</p>
      )}
    </div>
  );

  // --- 1. Categorical vs Categorical: Cross-tab + Heatmap ---
  const renderCategoricalVsCategorical = () => {
    return Object.entries(categorical_vs_categorical).map(([key, data]) => {
      const [col1, col2] = key.split("__vs__");

      // Pivot lại dữ liệu để tạo bảng kiểu cross-tab
      const pivot = {};
      const categories1 = [...new Set(data.map((d) => d[col1]))];
      const categories2 = [...new Set(data.map((d) => d[col2]))];

      data.forEach((d) => {
        if (!pivot[d[col1]]) pivot[d[col1]] = {};
        pivot[d[col1]][d[col2]] = parseFloat((d.percentage * 100).toFixed(1));
      });

      return (
        <div key={key} className="chart-card">
          <h4>
            {col1} ↔ {col2} (Cross-tab với Heatmap)
          </h4>
          <div className="heatmap-table-container">
            <table className="heatmap-table">
              <thead>
                <tr>
                  <th>
                    {col1} \ {col2}
                  </th>
                  {categories2.map((cat2) => (
                    <th key={cat2}>{cat2}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories1.map((cat1) => (
                  <tr key={cat1}>
                    <th>{cat1}</th>
                    {categories2.map((cat2) => {
                      const value = pivot[cat1]?.[cat2] || 0;
                      const intensity = value / 100; // 0–1
                      const bg = `rgba(79, 70, 229, ${intensity})`;
                      return (
                        <td
                          key={cat2}
                          style={{
                            backgroundColor: bg,
                            color: intensity > 0.5 ? "white" : "black",
                            fontWeight: "500",
                          }}>
                          {value}%
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted">
            <small>Bold color = Higher ratio in the group {col1}.</small>
          </p>
        </div>
      );
    });
  };

  // --- 2. Numeric vs Numeric: Correlation Heatmap + Mini Pair Grid ---
  const renderNumericVsNumeric = () => {
    const corr = numeric_vs_numeric?.correlation;
    const pairs = numeric_vs_numeric?.pairs || [];

    const numFields = corr ? Object.keys(corr) : [];

    return (
      <div>
        {/* Correlation Heatmap */}
        {corr && (
          <div className="chart-card">
            <h4>Correlation coefficient </h4>
            <div className="heatmap-table-container">
              <table className="heatmap-table">
                <thead>
                  <tr>
                    <th></th>
                    {numFields.map((col) => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {numFields.map((row) => (
                    <tr key={row}>
                      <th>{row}</th>
                      {numFields.map((col) => {
                        const val = corr[row][col];
                        const absVal = Math.abs(val);
                        const bg =
                          val > 0
                            ? `rgba(79, 70, 229, ${absVal})`
                            : `rgba(220, 38, 38, ${absVal})`;
                        return (
                          <td
                            key={col}
                            style={{
                              backgroundColor: bg,
                              color: "white",
                              fontWeight: "bold",
                            }}>
                            {val.toFixed(2)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mini Scatter Matrix (Pair Plot) */}
        {pairs.length > 0 && (
          <div className="chart-card">
            <h4>Scatter Matrix (some pairs of variables)</h4>
            <div className="scatter-grid">
              {pairs.slice(0, 6).map((pair, idx) => (
                <div key={idx} className="scatter-grid-item">
                  <h5>
                    {pair.x} vs {pair.y}
                  </h5>
                  <ResponsiveContainer width="100%" height={120}>
                    <ScatterChart
                      margin={{ top: 5, right: 5, bottom: 15, left: 15 }}>
                      <XAxis dataKey={pair.x} hide />
                      <YAxis dataKey={pair.y} hide />
                      <Scatter
                        data={pair.data}
                        fill="#059669"
                        stroke="#047857"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- 3. Mixed: Categorical vs Numeric ---
  const renderMixed = () => {
    return Object.entries(mixed).map(([key, data]) => {
      const [cat, num] = key.split("__vs__");
      return (
        <div key={key} className="chart-card">
          <h4>
            {cat} → {num} (Trung bình & Trung vị)
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={cat}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip formatter={(value) => value.toFixed(2)} />
              <Legend />
              <Bar dataKey="mean" name="Trung bình" fill="#4f46e5" />
              <Bar dataKey="median" name="Trung vị" fill="#ec4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    });
  };

  return (
    <div className="relationships-panel">
      <h2>Step 6: Analyzing the Relationship Among Variables</h2>

      <Section
        title="Categorical vs Categorical (Cross-tab + Heatmap)"
        data={categorical_vs_categorical}>
        {renderCategoricalVsCategorical()}
      </Section>

      <Section
        title="Number vs Number (Correlation & Scatter Matrix)"
        data={numeric_vs_numeric}>
        {renderNumericVsNumeric()}
      </Section>
      <Section
        title="Mixed (Classification affecting the variables)"
        data={mixed}>
        {renderMixed()}
      </Section>
    </div>
  );
};

export default RelationshipsPanel;
