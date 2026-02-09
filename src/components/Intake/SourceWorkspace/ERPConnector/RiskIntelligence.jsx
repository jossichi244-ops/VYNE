import React, { useMemo } from "react";
import "./RiskIntelligence.scss";
import { mockRiskData } from "../mock/mockRiskData.js";

/**
 * Normalize Risk Data
 * (Mock risk data đã đúng schema → chỉ cần safety layer)
 */
const normalizeRiskData = (rawData = []) =>
  rawData.map((d) => ({
    id: d.id,
    factory: d.factory,
    carrier: d.carrier,
    delayDays: Number(d.delayDays ?? 0),
    riskType: d.riskType,
    riskLevel: d.riskLevel,
    financialImpact: Number(d.financialImpact ?? 0),
    slaBreachProbability: Number(d.slaBreachProbability ?? 0),
  }));

const RiskIntelligence = () => {
  // ❗ FIX QUAN TRỌNG:
  // LUÔN DÙNG mockRiskData
  // KHÔNG NHẬN data từ component cha
  const safeData = useMemo(() => normalizeRiskData(mockRiskData), []);

  // ===== Executive Summary =====
  const critical = safeData.filter((d) => d.riskLevel === "critical");

  const high = safeData.filter((d) => d.riskLevel === "high");

  const totalImpact = safeData.reduce((sum, d) => sum + d.financialImpact, 0);

  const avgDelay =
    safeData.length > 0
      ? (
          safeData.reduce((sum, d) => sum + d.delayDays, 0) / safeData.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="risk-module">
      <h2>AI Predictive Risk Intelligence Engine</h2>

      {/* ================= EXEC SUMMARY ================= */}
      <div className="risk-executive-grid">
        <div className="risk-card critical">
          <span>Critical Shipments</span>
          <strong>{critical.length}</strong>
        </div>

        <div className="risk-card high">
          <span>High Risk Shipments</span>
          <strong>{high.length}</strong>
        </div>

        <div className="risk-card">
          <span>Average Delay (Days)</span>
          <strong>{avgDelay}</strong>
        </div>

        <div className="risk-card financial">
          <span>Total Financial Exposure</span>
          <strong>${totalImpact.toLocaleString()}</strong>
        </div>
      </div>

      {/* ================= DETAIL TABLE ================= */}
      <div className="risk-table">
        <table>
          <thead>
            <tr>
              <th>Shipment</th>
              <th>Factory</th>
              <th>Carrier</th>
              <th>Delay</th>
              <th>Risk Type</th>
              <th>Financial Impact</th>
              <th>SLA Risk</th>
            </tr>
          </thead>
          <tbody>
            {safeData.map((shipment) => (
              <tr
                key={shipment.id}
                className={`risk-row ${shipment.riskLevel}`}>
                <td>{shipment.id}</td>
                <td>{shipment.factory}</td>
                <td>{shipment.carrier}</td>
                <td>{shipment.delayDays}d</td>
                <td>{shipment.riskType}</td>
                <td>${shipment.financialImpact.toLocaleString()}</td>
                <td>{(shipment.slaBreachProbability * 100).toFixed(0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiskIntelligence;
