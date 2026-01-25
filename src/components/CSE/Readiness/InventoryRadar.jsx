import React from "react";
import { motion } from "framer-motion";
import { FiTarget, FiLayers } from "react-icons/fi";
import "./InventoryRadar.scss";

const InventoryRadar = ({ status = "Ready", stockLevel = 85 }) => {
  const isAlert = stockLevel < 20;
  // eslint-disable-next-line no-unused-vars
  const themeColor = isAlert ? "#ff4d4d" : "#00f0ff";

  return (
    <div className={`inventory-radar-terminal ${isAlert ? "alert-mode" : ""}`}>
      {/* Lớp nền Radar ảo */}
      <div className="radar-grid">
        <div className="circle c1"></div>
        <div className="circle c2"></div>
        <div className="axis x"></div>
        <div className="axis y"></div>
      </div>

      <div className="content-overlay">
        <header className="terminal-meta">
          <div className="brand">
            <FiTarget className="icon-spin" />
            <span>INV_SCAN_V4</span>
          </div>
          <div className={`status-pill ${isAlert ? "critical" : "nominal"}`}>
            {status.toUpperCase()}
          </div>
        </header>

        <main className="data-core">
          <div className="numeric-display">
            <span className="unit">AVAILABILITY</span>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glitch-value">
              {stockLevel}
              <small>%</small>
            </motion.h2>
          </div>

          <div className="visual-indicator">
            <div className="progress-track">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${stockLevel}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              {/* Điểm quét Laser */}
              <motion.div
                className="laser-head"
                animate={{ left: [`0%`, `${stockLevel}%`, `0%`] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          </div>
        </main>

        <footer className="footer-specs">
          <div className="spec-item">
            <FiLayers />
            <span>LAYER_01_SECURED</span>
          </div>
          <div className="telemetry-wave">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </footer>
      </div>

      {/* Hiệu ứng quét tròn (Radar Sweep) */}
      <div className="radar-sweep"></div>
    </div>
  );
};

export default InventoryRadar;
