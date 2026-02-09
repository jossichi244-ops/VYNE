import React, { useMemo } from "react";
import "./CustomsCompliance.scss";
import { mockCustomsData } from "../mock/mockCustomsData.js";

/**
 * Normalize Customs Compliance data
 * Protect UI from undefined / null values
 */
const normalizeCustomsData = (rawData = []) =>
  rawData.map((d) => ({
    id: d.id,
    factory: d.factory,
    destination: d.destination,
    hsCode: d.hsCode,
    commodity: d.commodity,

    complianceStatus: d.complianceStatus.toLowerCase(),
    inspectionType: d.inspectionType,
    authority: d.authority,

    estimatedPenalty: Number(d.estimatedPenalty ?? 0),
    delayDays: Number(d.delayDays ?? 0),
    riskLevel: d.riskLevel,

    missingDocs: Array.isArray(d.missingDocs) ? d.missingDocs : [],
    actionRequired: d.actionRequired,
  }));

const CustomsCompliance = () => {
  // 🔒 ALWAYS use mock (no external override)
  const safeData = useMemo(() => normalizeCustomsData(mockCustomsData), []);

  // ===== Summary Metrics =====
  const blocked = safeData.filter((d) => d.complianceStatus === "blocked");

  const review = safeData.filter((d) => d.complianceStatus === "review");

  const totalPenalty = blocked.reduce((sum, d) => sum + d.estimatedPenalty, 0);

  return (
    <div className="customs-module">
      <h2>Customs & Trade Compliance Intelligence</h2>

      {/* ================= SUMMARY ================= */}
      <div className="compliance-summary">
        <div className="summary-card danger">
          <span>Blocked Shipments</span>
          <strong>{blocked.length}</strong>
        </div>

        <div className="summary-card warning">
          <span>Under Review</span>
          <strong>{review.length}</strong>
        </div>

        <div className="summary-card critical">
          <span>Potential Penalty Exposure</span>
          <strong>${totalPenalty.toLocaleString()}</strong>
        </div>
      </div>

      {/* ================= DETAIL TABLE ================= */}
      <div className="compliance-table">
        <table>
          <thead>
            <tr>
              <th>Shipment</th>
              <th>Factory</th>
              <th>Destination</th>
              <th>HS Code</th>
              <th>Status</th>
              <th>Inspection</th>
              <th>Delay</th>
              <th>Penalty</th>
              <th>Action Required</th>
            </tr>
          </thead>
          <tbody>
            {safeData.map((item) => (
              <tr key={item.id} className={item.riskLevel}>
                <td>{item.id}</td>
                <td>{item.factory}</td>
                <td>{item.destination}</td>
                <td>{item.hsCode}</td>
                <td>{item.complianceStatus.toUpperCase()}</td>
                <td>{item.inspectionType}</td>
                <td>{item.delayDays} days</td>
                <td>${item.estimatedPenalty.toLocaleString()}</td>
                <td>{item.actionRequired}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= DOCUMENT ALERT ================= */}
      {blocked.map((item) => (
        <div key={item.id} className="doc-alert-card">
          <h4>{item.id} – Missing Documentation</h4>
          {item.missingDocs.length > 0 ? (
            <ul>
              {item.missingDocs.map((doc, idx) => (
                <li key={idx}>{doc}</li>
              ))}
            </ul>
          ) : (
            <span>No missing documents</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default CustomsCompliance;
