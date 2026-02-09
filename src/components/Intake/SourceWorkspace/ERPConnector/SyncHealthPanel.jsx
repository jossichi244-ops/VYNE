import React from "react";
import {
  FiClock,
  FiAlertCircle,
  FiActivity,
  FiRefreshCcw,
} from "react-icons/fi";
import "./SyncHealthPanel.scss";

const SyncHealthPanel = () => {
  return (
    <section className="sync-health grid-item-glass">
      <h4>Sync Health Monitor</h4>

      <div className="health-item">
        <FiClock />
        <span>Last Full Sync:</span>
        <strong>2026-02-08 10:22</strong>
      </div>

      <div className="health-item">
        <FiAlertCircle />
        <span>Failed Transactions:</span>
        <strong className="danger">2</strong>
      </div>

      <div className="health-item">
        <FiActivity />
        <span>API Latency:</span>
        <strong>220ms</strong>
      </div>

      <div className="health-item">
        <FiRefreshCcw />
        <span>Retry Queue:</span>
        <strong>3 pending</strong>
      </div>
    </section>
  );
};

export default SyncHealthPanel;
