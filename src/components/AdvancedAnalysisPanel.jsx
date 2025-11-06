// src/components/AdvancedAnalysisPanel.jsx
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import Plot from "react-plotly.js";
import "../assets/styles/advancedAnalysis.scss";

const AdvancedAnalysisPanel = ({ advanced }) => {
  if (!advanced || Object.keys(advanced).length === 0) return null;

  const {
    multiselect,
    clustering,
    highdimensional,
    significance,
    patterns,
    correlation,
  } = advanced;

  const Section = ({ title, children, data, icon = "" }) => {
    const hasData =
      data &&
      ((Array.isArray(data) && data.length > 0) ||
        (typeof data === "object" && Object.keys(data).length > 0));
    return (
      <div className="advanced-section">
        <div className="section-header">
          <h3>
            {icon} {title}
          </h3>
        </div>
        {hasData ? children : <p className="text-muted">Không có dữ liệu.</p>}
      </div>
    );
  };

  // === 1. Multiselect ===
  const renderMultiselect = () =>
    Object.entries(multiselect || {})
      .filter(([col, freq]) => Array.isArray(freq))
      .map(([col, freq]) => {
        const diversity = multiselect[`${col}_diversity`];
        return (
          <div key={col} className="chart-card">
            <h4> {col}</h4>
            {diversity && (
              <p className="text-muted">
                Entropy (đa dạng): {diversity.entropy.toFixed(2)}
              </p>
            )}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={freq} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey={col} type="category" width={150} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      });

  // === 2. Clustering ===
  const renderClustering = () => {
    if (!clustering?.centroids) return null;
    const centroids = clustering.centroids;
    const numFields = Object.keys(centroids[0] || {});

    // const distribution = Object.entries(
    //   (clustering.assignments || []).reduce((acc, { cluster }) => {
    //     acc[cluster] = (acc[cluster] || 0) + 1;
    //     return acc;
    //   }, {})
    // ).map(([k, v]) => ({ cluster: `C${k}`, count: v }));

    return (
      <div>
        <div className="chart-card">
          <h4>🧩 K-Means (K={centroids.length})</h4>
          {clustering.silhouette_score && (
            <p className="text-muted">
              📏 Silhouette score: {clustering.silhouette_score.toFixed(3)}
            </p>
          )}
          <table className="data-table">
            <thead>
              <tr>
                <th>Cụm</th>
                {numFields.map((f) => (
                  <th key={f}>{f}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {centroids.map((center, idx) => (
                <tr key={idx}>
                  <td>
                    <strong className="cluster-badge">C{idx}</strong>
                  </td>
                  {numFields.map((f) => (
                    <td key={f}>{center[f]?.toFixed?.(2) ?? "–"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* <div className="chart-card">
          <h4>📊 Phân bố điểm theo cụm</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={distribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="cluster" type="category" width={60} />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div> */}

        {clustering.pca && (
          <div className="chart-card">
            <h4>🌀 PCA Scatter 2D</h4>
            <Plot
              data={clustering.pca.map((row, i) => ({
                x: [row.x],
                y: [row.y],
                type: "scatter",
                mode: "markers",
                marker: { color: row.cluster, colorscale: "Viridis", size: 6 },
                name: `C${row.cluster}`,
              }))}
              layout={{
                height: 400,
                xaxis: { title: "PCA1" },
                yaxis: { title: "PCA2" },
                margin: { l: 60, r: 20, t: 30, b: 60 },
              }}
              config={{ responsive: true }}
            />
          </div>
        )}
      </div>
    );
  };

  // === 3. High-dimensional ===
  const renderHighDimensional = () => {
    if (!highdimensional?.sampled) return null;
    const { sampled, top3 } = highdimensional;

    return (
      <div>
        <div className="chart-card">
          <h4>High-Dimensional Sample</h4>
          {top3 && (
            <p className="text-muted">Top 3 variables: {top3.join(", ")}</p>
          )}
          <table className="data-table">
            <thead>
              <tr>
                {Object.keys(sampled[0]).map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampled.slice(0, 20).map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((val, i) => (
                    <td key={i}>
                      {typeof val === "number" ? val.toFixed(2) : String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {top3 && (
          <div className="chart-card">
            <h4>Scatter3D (Top 3 variables)</h4>
            <Plot
              data={[
                {
                  type: "scatter3d",
                  mode: "markers",
                  x: sampled.map((r) => r[top3[0]]),
                  y: sampled.map((r) => r[top3[1]]),
                  z: sampled.map((r) => r[top3[2]]),
                  marker: { size: 3, color: "#3b82f6" },
                },
              ]}
              layout={{ height: 400, margin: { l: 0, r: 0, t: 30, b: 0 } }}
            />
          </div>
        )}
      </div>
    );
  };

  // === 4. Significance (Chi2, ANOVA) ===
  const renderSignificance = () => {
    const { chi2, anova } = significance || {};

    // ✅ Hàm format an toàn
    const formatNumber = (value, digits = 3) => {
      if (value == null || !isFinite(value)) return "–";
      return parseFloat(value).toFixed(digits);
    };

    const SigBadge = ({ p }) => (
      <span className={`badge ${p < 0.05 ? "sig" : "not-sig"}`}>
        {p < 0.05 ? "It has meaning" : "Meaningless"}
      </span>
    );

    return (
      <div>
        {chi2 && (
          <div className="chart-card">
            <h4>Chi-squared + Cramér’s V</h4>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Variable Pair</th>
                  <th>Chi²</th>
                  <th>p-value</th>
                  <th>Cramér’s V</th>
                  <th>Conclusion</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(chi2).map(([pair, r]) => (
                  <tr key={pair}>
                    <td>{pair.replace("__vs__", " ↔ ")}</td>
                    <td>{formatNumber(r.chi2)}</td>
                    <td>{formatNumber(r.p_value, 3)}</td>
                    <td>{formatNumber(r.cramers_v, 3)}</td>
                    <td>
                      <SigBadge p={r.p_value} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {anova && (
          <div className="chart-card">
            <h4>ANOVA + Eta²</h4>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Variable Pair</th>
                  <th>F-stat</th>
                  <th>p-value</th>
                  <th>Eta²</th>
                  <th>Conclusion</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(anova).map(([pair, r]) => (
                  <tr key={pair}>
                    <td>{pair.replace("__vs__", " → ")}</td>
                    <td>{formatNumber(r.f_stat)}</td>
                    <td>{formatNumber(r.p_value, 3)}</td>
                    <td>{formatNumber(r.eta_squared, 3)}</td>
                    <td>
                      <SigBadge p={r.p_value} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // === 5. Patterns ===
  const renderPatterns = () => {
    const { anomalies, feature_importance } = patterns || {};
    const values =
      highdimensional?.sampled?.map((row) => {
        const k = Object.keys(row)[0];
        return typeof row[k] === "number" ? row[k] : null;
      }) ?? [];

    return (
      <div>
        {anomalies && (
          <>
            <div className="chart-card">
              <h4>Bất thường (Isolation Forest)</h4>
              <Plot
                data={[
                  {
                    x: anomalies.outlier_flags.map((_, i) => i),
                    y: values,
                    mode: "markers",
                    type: "scatter",
                    marker: {
                      color: anomalies.outlier_flags.map((f) =>
                        f === -1 ? "red" : "green"
                      ),
                    },
                  },
                ]}
                layout={{ height: 400 }}
              />
            </div>

            <div className="chart-card">
              <h4>Boxplot + Outliers</h4>
              <Plot
                data={[
                  { y: values, type: "box", name: "Phân bố" },
                  {
                    y: anomalies.outlier_flags
                      .map((f, i) => (f === -1 ? values[i] : null))
                      .filter((v) => v !== null),
                    mode: "markers",
                    type: "scatter",
                    name: "Bất thường",
                    marker: { color: "red", size: 8, symbol: "x" },
                  },
                ]}
                layout={{ height: 400 }}
              />
            </div>
          </>
        )}

        {feature_importance && (
          <div className="chart-card">
            <h4>Độ quan trọng biến</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={Object.entries(feature_importance)
                  .sort((a, b) => b[1] - a[1])
                  .map(([k, v]) => ({ feature: k, importance: v }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="feature" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="importance" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  };

  // === 6. Correlation heatmap numeric ===
  const renderCorrelation = () => {
    if (!correlation) return null;
    const { matrix, columns } = correlation;
    return (
      <div className="chart-card">
        <h4>🔗 Tương quan Pearson (numeric)</h4>
        <Plot
          data={[
            {
              z: matrix,
              x: columns,
              y: columns,
              type: "heatmap",
              colorscale: "RdBu",
              zmin: -1,
              zmax: 1,
            },
          ]}
          layout={{
            height: 400,
            margin: { l: 120, r: 20, t: 30, b: 120 },
            xaxis: { tickangle: -45 },
          }}
        />
      </div>
    );
  };

  // === 7. Redundancy Detection ===
  const renderRedundancy = () => {
    if (!advanced.redundancy) return null;
    const { vif, correlation_clusters } = advanced.redundancy;

    return (
      <div>
        {vif && (
          <div className="chart-card">
            <h4>📏 Multicollinearity (VIF)</h4>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Biến</th>
                  <th>VIF</th>
                </tr>
              </thead>
              <tbody>
                {vif.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.feature}</td>
                    <td>{row.vif.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-muted">⚠️ VIF &gt; 5 gợi ý đa cộng tuyến mạnh</p>
          </div>
        )}

        {correlation_clusters && (
          <div className="chart-card">
            <h4>Highly correlated group</h4>
            <ul>
              {correlation_clusters.map((group, idx) => (
                <li key={idx}>
                  Cluster {idx + 1}: {group.join(", ")}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  // const renderTimeSeries = () => {
  //   const ts = advanced.timeseries;
  //   if (!ts || !ts.aggregated) return null;

  //   return (
  //     <div>
  //       <div className="chart-card">
  //         <h4>📈 Tổng hợp theo thời gian</h4>
  //         <Plot
  //           data={[
  //             {
  //               x: ts.aggregated.map((r) => r.date),
  //               y: ts.aggregated.map((r) => r.value),
  //               type: "scatter",
  //               mode: "lines+markers",
  //               name: "Daily Value",
  //             },
  //             {
  //               x: ts.trend?.map((r) => r.date),
  //               y: ts.trend?.map((r) => r.value),
  //               type: "scatter",
  //               mode: "lines",
  //               name: "Trend",
  //               line: { color: "red", width: 2 },
  //             },
  //           ]}
  //           layout={{
  //             height: 400,
  //             xaxis: { title: "Date" },
  //             yaxis: { title: "Value" },
  //           }}
  //         />
  //       </div>

  //       <div className="chart-card">
  //         <h4>🔄 Seasonality</h4>
  //         <Plot
  //           data={[
  //             {
  //               x: ts.seasonal?.map((r) => r.date),
  //               y: ts.seasonal?.map((r) => r.value),
  //               type: "scatter",
  //               mode: "lines",
  //               line: { color: "orange" },
  //             },
  //           ]}
  //           layout={{ height: 300 }}
  //         />
  //       </div>

  //       <div className="chart-card">
  //         <h4>🚨 Outliers theo thời gian</h4>
  //         <Plot
  //           data={[
  //             {
  //               x: ts.aggregated.map((r) => r.date),
  //               y: ts.aggregated.map((r) => r.value),
  //               type: "scatter",
  //               mode: "lines",
  //               name: "Data",
  //             },
  //             {
  //               x: ts.outliers?.map((r) => r.date),
  //               y: ts.outliers?.map((r) => r.value),
  //               type: "scatter",
  //               mode: "markers",
  //               marker: { color: "red", size: 8, symbol: "x" },
  //               name: "Outliers",
  //             },
  //           ]}
  //           layout={{ height: 300 }}
  //         />
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <div className="advanced-analysis-panel">
      <h2>Step 7: Advanced analysis</h2>
      <Section title="Multiselect Data" data={multiselect}>
        {" "}
        {renderMultiselect()}{" "}
      </Section>{" "}
      <Section title="Clustering" data={clustering}>
        {" "}
        {renderClustering()}{" "}
      </Section>{" "}
      <Section title="High-Dimensional Data" data={highdimensional}>
        {" "}
        {renderHighDimensional()}{" "}
      </Section>{" "}
      <Section title="Statistical Testing" data={significance}>
        {" "}
        {renderSignificance()}{" "}
      </Section>{" "}
      <Section title="Patterns & Anomalies" data={patterns}>
        {" "}
        {renderPatterns()}{" "}
      </Section>{" "}
      <Section title="Correlation" data={correlation}>
        {" "}
        {renderCorrelation()}{" "}
      </Section>{" "}
      <Section title="Variable Redundancy" data={advanced.redundancy}>
        {" "}
        {renderRedundancy()}{" "}
      </Section>
      {/* <Section title="Chuỗi thời gian" data={advanced.timeseries} icon="⏳">
        {renderTimeSeries()}
      </Section> */}
    </div>
  );
};

export default AdvancedAnalysisPanel;
