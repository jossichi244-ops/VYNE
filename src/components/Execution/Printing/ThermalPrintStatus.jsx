import React from "react";
import { motion } from "framer-motion";
import {
  FiWifi,
  FiFile,
  FiAlertCircle,
  FiRefreshCw,
  FiCpu,
} from "react-icons/fi";
import "./ThermalPrintStatus.scss";

const ThermalPrintStatus = ({
  status = "ready",
  paperLevel = 75,
  ipAddress = "192.168.1.105",
}) => {
  const isError = status === "error";
  const isLowPaper = paperLevel < 20;

  return (
    <div className={`thermal-monitor-shell ${status}`}>
      {/* 1. Header Trạng thái chính */}
      <div className="monitor-header">
        <div className="status-indicator">
          <div className="core-dot"></div>
          <div className="echo-wave"></div>
        </div>
        <div className="title-stack">
          <h4>THERMAL_PRINTER_01</h4>
          <span className="state-text">{status.toUpperCase()}</span>
        </div>
        <FiCpu className="header-icon" />
      </div>

      {/* 2. Chỉ số đo lường (Metrics) */}
      <div className="metrics-console">
        {/* Mức giấy */}
        <div className="metric-row">
          <div className="label-group">
            <FiFile size={12} />
            <span>PAPER_STOCK</span>
          </div>
          <div className="gauge-container">
            <div className="gauge-track">
              <motion.div
                className={`gauge-fill ${isLowPaper ? "warning" : ""}`}
                initial={{ width: 0 }}
                animate={{ width: `${paperLevel}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <span className="percentage">{paperLevel}%</span>
          </div>
        </div>

        {/* Kết nối Network */}
        <div className="metric-row">
          <div className="label-group">
            <FiWifi size={12} />
            <span>CONNECTIVITY</span>
          </div>
          <div className="ip-display">
            <span className="protocol">TCP/IP</span>
            <span className="address">{ipAddress}</span>
          </div>
        </div>
      </div>

      {/* 3. Action / Warning Area */}
      <div className="monitor-footer">
        {isError ? (
          <motion.button whileTap={{ scale: 0.95 }} className="btn-reconnect">
            <FiRefreshCw />
            <span>RE-ESTABLISH CONNECTION</span>
          </motion.button>
        ) : (
          <div className="system-health">
            <FiAlertCircle
              className={isLowPaper ? "text-amber" : "text-slate"}
            />
            <p>
              {isLowPaper
                ? "CẢNH BÁO: SẮP HẾT GIẤY IN"
                : "Hệ thống hoạt động ổn định"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThermalPrintStatus;
