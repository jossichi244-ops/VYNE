import React from "react";
import { motion } from "framer-motion";
import { FiActivity, FiShield, FiTrendingUp, FiCpu } from "react-icons/fi";
import "./SLAIntelligence.scss";

const SLAIntelligence = ({ details = {} }) => {
  return (
    <div className="sla-intelligence-report">
      {/* AI Header Section */}
      <div className="report-header">
        <div className="header-label">
          <div className="icon-orbit">
            <FiCpu className="cpu-icon" />
          </div>
          <div className="text-stack">
            <span className="eyebrow">NEURAL ENGINE ANALYSIS</span>
            <h5 className="title">SLA INTELLIGENCE REPORT</h5>
          </div>
        </div>
        <div className="pulse-indicator">
          <span className="pulse-text">LIVE ANALYSIS</span>
          <div className="dot"></div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="card-inner">
            <span className="label">PRIMARY CARRIER</span>
            <div className="value-group">
              <FiShield className="sub-icon" />
              <p className="value">{details.carrier || "Vyne Express"}</p>
            </div>
          </div>
        </div>

        <div className="stat-card success-rate">
          <div className="card-inner">
            <span className="label">HISTORICAL SUCCESS</span>
            <div className="value-group">
              <FiTrendingUp className="sub-icon" />
              <p className="value success">{details.sla || "99.8%"}</p>
            </div>
            {/* Thanh hiển thị hiệu suất nhỏ */}
            <div className="mini-progress-track">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: details.sla || "99.8%" }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Diagnostic */}
      <div className="diagnostic-footer">
        <FiActivity className="footer-icon" />
        <span className="diagnostic-text">
          Confidence Interval: High | Routing optimized via Core-V1
        </span>
      </div>
    </div>
  );
};

export default SLAIntelligence;
