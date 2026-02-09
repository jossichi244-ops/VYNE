import React, { useMemo } from "react";
import "./FinancialExposure.scss";
import { mockFinancialData } from "../mock/mockFinancialData.js";

const normalizeFinancialData = (rawData = []) =>
  rawData.map((d) => ({
    id: d.id,
    factory: d.factory,
    carrier: d.carrier,

    currentExposure: Number(d.currentExposure ?? 0),
    forecastExposure: Number(d.forecastExposure ?? 0),
    exposureIfDelayed3Days: Number(d.exposureIfDelayed3Days ?? 0),

    riskLevel: d.riskLevel ?? "low",
    reason: d.reason,

    costBreakdown: Object.entries(d.costBreakdown ?? {}).reduce(
      (acc, [k, v]) => {
        acc[k] = Number(v ?? 0);
        return acc;
      },
      {},
    ),
  }));

const FinancialExposure = () => {
  // 🔒 ALWAYS use mock (no ERP override)
  const safeData = useMemo(() => normalizeFinancialData(mockFinancialData), []);

  // ===== Summary Metrics =====
  const totalCurrent = safeData.reduce((sum, d) => sum + d.currentExposure, 0);

  const totalForecast = safeData.reduce(
    (sum, d) => sum + d.forecastExposure,
    0,
  );

  const totalDelayed3Days = safeData.reduce(
    (sum, d) => sum + d.exposureIfDelayed3Days,
    0,
  );

  return (
    <div className="financial-module">
      <h2>Financial Exposure Intelligence</h2>

      {/* ================= SNAPSHOT ================= */}
      <div className="financial-summary-grid">
        <div className="summary-card critical">
          <span>Current Exposure</span>
          <strong>${totalCurrent.toLocaleString()}</strong>
        </div>

        <div className="summary-card warning">
          <span>Forecast Exposure</span>
          <strong>${totalForecast.toLocaleString()}</strong>
        </div>

        <div className="summary-card danger">
          <span>If Delayed +3 Days</span>
          <strong>${totalDelayed3Days.toLocaleString()}</strong>
        </div>
      </div>

      {/* ================= DETAIL TABLE ================= */}
      <div className="financial-table">
        <table>
          <thead>
            <tr>
              <th>Shipment</th>
              <th>Factory</th>
              <th>Carrier</th>
              <th>Current</th>
              <th>Forecast</th>
              <th>+3 Days</th>
              <th>Risk</th>
              <th>Root Cause</th>
            </tr>
          </thead>
          <tbody>
            {safeData.map((s) => (
              <tr key={s.id} className={s.riskLevel}>
                <td>{s.id}</td>
                <td>{s.factory}</td>
                <td>{s.carrier}</td>
                <td>${s.currentExposure.toLocaleString()}</td>
                <td>${s.forecastExposure.toLocaleString()}</td>
                <td>${s.exposureIfDelayed3Days.toLocaleString()}</td>
                <td>{s.riskLevel.toUpperCase()}</td>
                <td>{s.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= COST BREAKDOWN ================= */}
      <div className="cost-breakdown">
        <h4>Cost Composition</h4>

        {safeData.map((s) => (
          <div key={s.id} className="breakdown-card">
            <strong>{s.id}</strong>
            <ul>
              {Object.entries(s.costBreakdown).map(([k, v]) => (
                <li key={k}>
                  {k}: <span>${v.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialExposure;
