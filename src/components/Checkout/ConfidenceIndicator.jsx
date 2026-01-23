import React from "react";
import { motion } from "framer-motion";
import { FiTarget, FiAlertCircle, FiShield } from "react-icons/fi";
import "./ConfidenceIndicator.scss";

const ConfidenceIndicator = ({ level = 3 }) => {
  // Config cho từng cấp độ tin cậy
  const statusConfig = [
    {
      label: "Low Stability",
      color: "#EF4444",
      icon: FiAlertCircle,
      desc: "Manual Review Required",
    },
    {
      label: "System Estimated",
      color: "#F59E0B",
      icon: FiTarget,
      desc: "Based on Historical Data",
    },
    {
      label: "Verified Capacity",
      color: "#2DFF8F",
      icon: FiShield,
      desc: "Real-time Node Confirmed",
    },
  ];

  const current = statusConfig[level - 1] || statusConfig[1];
  const Icon = current.icon;

  return (
    <div
      className="confidence-indicator-module"
      style={{ "--status-color": current.color }}>
      <div className="indicator-header">
        <div className="bars-wrapper">
          {[1, 2, 3].map((step) => (
            <div key={step} className="bar-track">
              {step <= level && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  className="bar-fill"
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="status-badge">
          <Icon className="status-icon" />
          <span className="status-label">{current.label}</span>
        </div>
      </div>

      <div className="status-description">
        <span className="desc-text">{current.desc}</span>
        <div className="signal-waves">
          <span className="wave"></span>
          <span className="wave"></span>
          <span className="wave"></span>
        </div>
      </div>
    </div>
  );
};

export default ConfidenceIndicator;
