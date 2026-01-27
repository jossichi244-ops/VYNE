import React from "react";
import { FiAnchor, FiFileText, FiGlobe, FiChevronRight } from "react-icons/fi";
import "./ComplianceHeader.scss";

const ComplianceHeader = ({ data = {}, logic = { complianceRisk: "LOW" } }) => {
  const isCritical = logic.complianceRisk === "CRITICAL";

  return (
    <div
      className={`compliance-card ${isCritical ? "risk-critical" : "risk-safe"}`}>
      {/* Header Bar: ID & Incoterm */}
      <div className="compliance-card__top">
        <div className="id-identity">
          <div className="mawb-label">MASTER AWB</div>
          <h4 className="mawb-number">{data.awb || "MAWB-882-9901"}</h4>
        </div>
        <div className="incoterm-badge">
          <span>{data.incoterm || "DAP"}</span>
        </div>
      </div>

      <div className="compliance-card__content">
        {/* Logistics Route Visualizer */}
        <div className="route-visualizer">
          <div className="port-node">
            <FiGlobe className="node-icon" />
            <div className="node-text">
              <label>Origin</label>
              <p>{data.originPort || "Shanghai, CN"}</p>
            </div>
          </div>

          <div className="transit-path">
            <div className="dot"></div>
            <div className="line"></div>
            <FiChevronRight className="arrow" />
          </div>

          <div className="port-node">
            <FiAnchor className="node-icon" />
            <div className="node-text">
              <label>Discharge</label>
              <p>{data.dischargePort || "Cat Lai, VN"}</p>
            </div>
          </div>
        </div>

        {/* Customs Status Stamping */}
        <div
          className={`customs-status ${isCritical ? "is-missing" : "is-cleared"}`}>
          <div className="status-box">
            <FiFileText className="status-icon" />
            <div className="status-info">
              <label>Customs Compliance</label>
              <p>{isCritical ? "MISSING HS CODE" : "DOCUMENT CLEARED"}</p>
            </div>
          </div>
          {/* Một hiệu ứng "Dấu mộc" điện tử nếu đã cleared */}
          {!isCritical && <div className="verified-seal">VERIFIED</div>}
        </div>
      </div>
    </div>
  );
};

export default ComplianceHeader;
