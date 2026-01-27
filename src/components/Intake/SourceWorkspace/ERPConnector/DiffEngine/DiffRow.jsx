import React from "react";
import {
  FiAlertTriangle,
  FiArrowRight,
  FiCheck,
  FiDatabase,
  FiActivity,
} from "react-icons/fi";
import "./DiffRow.scss";

const DiffRow = ({ item, onResolve }) => {
  const isMatch = item.status === "match";

  return (
    <div
      className={`diff-row ${item.status} severity-${item.severity || "low"}`}>
      {/* 1. Field Identifier */}
      <div className="diff-col field-info">
        <span className="severity-bar"></span>
        <div className="meta-group">
          <span className="field-label">{item.field}</span>
          <span className="field-id">ID: {item.id}</span>
        </div>
      </div>

      {/* 2. Comparison Engine */}
      <div className="diff-col comparison-engine">
        {/* Left: ERP Record (Static) */}
        <div className="data-node erp-node">
          <div className="node-label">
            <FiDatabase /> ERP
          </div>
          <div className="value-display">{item.erp}</div>
        </div>

        {/* Center: Status Connector */}
        <div className="status-bridge">
          <div className="connector-line"></div>
          <div className="status-indicator">
            {isMatch ? <FiCheck /> : <FiAlertTriangle />}
          </div>
        </div>

        {/* Right: Ops Record (Live) */}
        <div className="data-node ops-node">
          <div className="node-label">
            <FiActivity /> ACTUAL
          </div>
          <div className={`value-display ${!isMatch ? "highlight-diff" : ""}`}>
            {item.ops}
          </div>
        </div>
      </div>

      {/* 3. Action Trigger */}
      <div className="diff-col action-zone">
        {!isMatch && (
          <button
            onClick={() => onResolve(item.id, item.ops)}
            className="btn-sync"
            title="Overwrite ERP with Actual data">
            <span>SYNC</span>
            <FiArrowRight />
          </button>
        )}
        {isMatch && <span className="match-badge">SYNCED</span>}
      </div>
    </div>
  );
};

export default DiffRow;
