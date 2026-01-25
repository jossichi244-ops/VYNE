import React from "react";
import { FiLink, FiCheck, FiActivity } from "react-icons/fi";
import "./CarrierERPConnector.scss";

const CarrierERPConnector = () => {
  return (
    <div className="erp-connector-module">
      {/* Hiệu ứng quét sáng chạy dọc viền */}
      <div className="border-glow-flow"></div>

      <div className="connector-content">
        <div className="status-group">
          <div className="icon-bridge">
            <FiLink className="main-icon" />
            <div className="pulse-ring"></div>
          </div>

          <div className="meta-info">
            <div className="label-row">
              <span className="erp-tag">ERP_SYNCHRONIZED</span>
              <FiActivity className="activity-blink" />
            </div>
            <h4 className="erp-name">SAP S/4HANA BRIDGE</h4>
          </div>
        </div>

        <div className="verification-node">
          <div className="check-hex">
            <FiCheck className="check-icon" />
          </div>
          <span className="node-status">SECURE</span>
        </div>
      </div>

      {/* Trang trí nền tảng kỹ thuật số */}
      <div className="data-grid-bg"></div>
    </div>
  );
};

export default CarrierERPConnector;
