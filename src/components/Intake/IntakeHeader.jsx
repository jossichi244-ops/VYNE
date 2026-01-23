import React from "react";
import { motion } from "framer-motion";
import { FiTarget, FiActivity, FiBox, FiSlash, FiZap } from "react-icons/fi";
import "./IntakeHeader.scss";

const StatItem = ({ label, value, color, icon: Icon, trend }) => (
  <div className={`stat-box ${color}`}>
    <div className="stat-label">
      <Icon className="label-icon" />
      <span>{label}</span>
    </div>
    <div className="stat-content">
      <span className="stat-value">{value}</span>
      {trend && <span className="stat-trend">{trend}</span>}
    </div>
    <div className="stat-bar-bg">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "70%" }}
        className="stat-bar-fill"
      />
    </div>
  </div>
);

const IntakeHeader = () => {
  return (
    <div className="control-tower-header">
      {/* Background Decorative Elements */}
      <div className="grid-overlay"></div>
      <div className="radar-sweep"></div>

      <div className="header-main-content">
        <div className="brand-section">
          <div className="logo-glitch-container">
            <FiZap className="logo-bolt" />
            <h2 className="brand-name">
              CONTROL TOWER <span className="lite-tag">LITE</span>
            </h2>
          </div>
          <div className="system-status">
            <div className="status-blinker"></div>
            <span className="status-text">SYSTEM OPERATIONAL // PORT 8080</span>
          </div>
        </div>

        <div className="stats-dashboard">
          <StatItem
            label="Received"
            value="2,840"
            color="blue"
            icon={FiBox}
            trend="+12%"
          />
          <StatItem
            label="Valid"
            value="2,102"
            color="emerald"
            icon={FiTarget}
            trend="94%"
          />
          <StatItem
            label="Missing"
            value="128"
            color="amber"
            icon={FiActivity}
            trend="-2%"
          />
          <StatItem
            label="Blocked"
            value="12"
            color="red"
            icon={FiSlash}
            trend="ALERT"
          />
        </div>
      </div>

      {/* Cyberpunk Decorative Line */}
      <div className="bottom-scanner">
        <motion.div
          initial={{ left: "-100%" }}
          animate={{ left: "100%" }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="scanner-glimmer"
        />
      </div>
    </div>
  );
};

export default IntakeHeader;
