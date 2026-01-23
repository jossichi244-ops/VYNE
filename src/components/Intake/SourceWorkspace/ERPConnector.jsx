import React, { useState } from "react";
import {
  FiLink,
  FiActivity,
  FiShield,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";
import "./ERPConnector.scss";

const ERPConnector = () => {
  const [status] = useState("connected"); // connected | syncing | error
  const [isHovered, setIsHovered] = useState(null);

  const diffData = [
    {
      label: "Customer ID",
      erp: "CUS-990",
      std: "990-Global",
      match: true,
      id: "1",
    },
    {
      label: "Address",
      erp: "No. 10, Cat Lai",
      std: "Gate 2, Cat Lai Port",
      match: false,
      id: "2",
    },
    {
      label: "Weight Class",
      erp: "Heavy-Duty",
      std: "HD-900",
      match: false,
      id: "3",
    },
  ];

  return (
    <div className="logistics-dashboard">
      {/* Background Glows */}
      <div className="glow-sphere sphere-1"></div>
      <div className="glow-sphere sphere-2"></div>

      <div className="connector-container">
        {/* Connection Header Card */}
        <header className={`status-card ${status}`}>
          <div className="card-content">
            <div className="node-info">
              <div className="icon-wrapper">
                <FiLink className="main-icon" />
                <div className="pulse-ring"></div>
                {status === "connected" && (
                  <span className="status-dot-active" />
                )}
              </div>
              <div className="text-group">
                <div className="label-row">
                  <span className="node-type">SAP Business One Node</span>
                  <span className="status-tag">Live Feed</span>
                </div>
                <p className="endpoint">https://api.sap-erp.v1/orders</p>
              </div>
            </div>

            <div className="action-group">
              <div className="metrics">
                <FiActivity className="metric-icon" />
                <span>9ms latency</span>
              </div>
              <button className="btn-disconnect">
                <span className="btn-text">DISCONNECT</span>
                <FiShield className="btn-icon" />
              </button>
            </div>
          </div>
        </header>

        {/* Data Diff Engine Section */}
        <section className="diff-viewer-section">
          <div className="viewer-header">
            <div className="title-area">
              <FiRefreshCw
                className={`sync-icon ${status === "syncing" ? "spin" : ""}`}
              />
              <h3>DATA RECONCILIATION</h3>
            </div>
            <div className="conflict-badge">
              <FiAlertCircle />
              <span>3 CONFLICTS</span>
            </div>
          </div>

          <div className="diff-grid">
            {diffData.map((item, i) => (
              <div
                key={item.id}
                className={`diff-row ${isHovered === i ? "focused" : ""}`}
                onMouseEnter={() => setIsHovered(i)}
                onMouseLeave={() => setIsHovered(null)}>
                <div className="row-label">{item.label}</div>
                <div className="comparison-slots">
                  <div className="slot erp">
                    <span className="slot-tag">ERP SOURCE</span>
                    <div className="value-box">{item.erp}</div>
                  </div>

                  <div className="divider-icon">
                    <div className="line"></div>
                    <div
                      className={`status-indicator ${item.match ? "match" : "mismatch"}`}></div>
                    <div className="line"></div>
                  </div>

                  <div className="slot standard">
                    <span className="slot-tag">GLOBAL STD</span>
                    <div className="value-box">{item.std}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ERPConnector;
