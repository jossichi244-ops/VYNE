import React from "react";
import { FiDatabase, FiAlertCircle, FiZap, FiActivity } from "react-icons/fi";
import "./StatsFrame.scss";

const StatsFrame = ({ stats }) => {
  const matchRate = (
    ((stats.total - stats.conflicts) / stats.total) *
    100
  ).toFixed(1);

  return (
    <div className="stats-glass-frame">
      {/* 1. Group Chỉ số chính */}
      <div className="stats-grid">
        <div className="stat-node">
          <div className="node-icon">
            <FiDatabase />
          </div>
          <div className="node-content">
            <span className="node-value">{stats.total.toLocaleString()}</span>
            <span className="node-label">TOTAL FIELDS</span>
          </div>
        </div>

        <div className="stat-node warning">
          <div className="node-icon">
            <FiAlertCircle />
          </div>
          <div className="node-content">
            <span className="node-value">{stats.conflicts}</span>
            <span className="node-label">DISCREPANCIES</span>
          </div>
          <div className="glow-line"></div>
        </div>

        <div className="stat-node critical">
          <div className="node-icon">
            <FiZap />
          </div>
          <div className="node-content">
            <span className="node-value">{stats.critical}</span>
            <span className="node-label">CRITICAL ISSUES</span>
          </div>
          <div className="glow-line"></div>
        </div>
      </div>

      {/* 2. Health Monitor (Vùng hiển thị tỷ lệ khớp) */}
      <div className="health-monitor">
        <div className="health-info">
          <div className="health-title">
            <FiActivity className="pulse-icon" />
            <span>DATA INTEGRITY SCORE</span>
          </div>
          <div className="health-percentage">{matchRate}%</div>
        </div>

        <div className="progress-engine">
          <div className="track-bg">
            <div className="track-fill" style={{ width: `${matchRate}%` }}>
              <div className="shimmer-effect"></div>
            </div>
          </div>
          {/* Các vạch thước đo công nghiệp */}
          <div className="ruler-markers">
            {[...Array(11)].map((_, i) => (
              <span key={i} className="marker"></span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsFrame;
