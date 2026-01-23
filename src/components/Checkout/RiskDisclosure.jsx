import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCloudRain,
  FiAlertTriangle,
  FiWind,
  FiAlertOctagon,
} from "react-icons/fi";
import "./RiskDisclosure.scss";

const RiskDisclosure = ({ risks = [] }) => {
  if (risks.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="risk-disclosure-panel">
      {/* Risk Header - Tactical Style */}
      <div className="risk-banner">
        <div className="banner-content">
          <div className="status-blink"></div>
          <FiAlertTriangle className="warning-icon" />
          <span className="banner-text">RISK ADJUSTMENT LAYER ACTIVE</span>
        </div>
        <div className="risk-count">{risks.length} ACTIVE THREATS</div>
      </div>

      <div className="risk-list">
        <AnimatePresence>
          {risks.map((risk, idx) => (
            <motion.div
              key={idx}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="risk-item">
              <div className="risk-icon-column">
                <div
                  className={`icon-container ${risk.type === "Weather" ? "weather" : "general"}`}>
                  {risk.type === "Weather" ? (
                    <FiCloudRain size={16} />
                  ) : risk.type === "Traffic" ? (
                    <FiWind size={16} />
                  ) : (
                    <FiAlertOctagon size={16} />
                  )}
                </div>
                <div className="connector-line"></div>
              </div>

              <div className="risk-content">
                <div className="risk-header-row">
                  <span className="risk-type">
                    {risk.type || "Operational"} Risk
                  </span>
                  <div className="impact-badge">{risk.impact || "Minor"}</div>
                </div>
                <p className="risk-msg">{risk.msg}</p>
                <div className="system-note">
                  <span className="blink-text">▲</span> IMPACT: DELIVERY WINDOW
                  MAY SHIFT BY {risk.impact === "High" ? "2-4H" : "30-60M"}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Decorative scanning pattern */}
      <div className="scanning-grid"></div>
    </motion.div>
  );
};

export default RiskDisclosure;
