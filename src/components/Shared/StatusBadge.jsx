import React from "react";
import { motion } from "framer-motion";
import "./StatusBadge.scss";

const StatusBadge = ({ type = "info", children, pulse = false }) => {
  const config = {
    success: { label: "OPERATIONAL", color: "#2DFF8F" },
    warning: { label: "ATTENTION", color: "#FFB000" },
    critical: { label: "CRITICAL", color: "#FF4D4D" },
    info: { label: "PROCESSING", color: "#00E5FF" },
  };

  const activeConfig = config[type] || config.info;

  return (
    <div className={`status-badge-wrapper ${type}`}>
      {/* Hạt nhân trạng thái với hiệu ứng Pulse nếu cần */}
      <div className="status-indicator">
        <div className="dot"></div>
        {(pulse || type === "critical") && (
          <motion.div
            className="pulse-ring"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        )}
      </div>

      <span className="badge-text">{children || activeConfig.label}</span>

      {/* Hiệu ứng góc kĩ thuật (Corner bracket) */}
      <div className="corner-accent"></div>
    </div>
  );
};

export default StatusBadge;
