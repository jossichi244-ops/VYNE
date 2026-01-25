import React from "react";
import { motion } from "framer-motion";
import { FiTrendingUp, FiShield, FiTag } from "react-icons/fi";
import "./ScoringBreakdown.scss";

const ScoringBreakdown = ({ breakdown }) => {
  const { priceScore, slaScore, riskScore } = breakdown;

  const MetricBar = ({ label, score, color, icon: Icon }) => (
    <div className="metric-channel">
      <div className="channel-header">
        <div className="label-group">
          <Icon className="channel-icon" />
          <span>{label}</span>
        </div>
        <div className="percentage-reading font-mono">
          <span className="value">{score.toFixed(0)}</span>
          <span className="unit">%</span>
        </div>
      </div>

      <div className="gauge-container">
        {/* Vạch chia grid nền */}
        <div className="gauge-grid">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid-line" />
          ))}
        </div>

        <div className="gauge-track">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1.2, ease: "circOut" }}
            className={`gauge-fill ${color}`}>
            <div className="energy-flow"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="diagnostic-breakdown">
      <div className="terminal-label">ALGORITHM_BREAKDOWN_v2.0</div>

      <div className="metrics-stack">
        <MetricBar
          label="Price Efficiency"
          score={priceScore}
          color="cyan"
          icon={FiTag}
        />
        <MetricBar
          label="SLA Reliability"
          score={slaScore}
          color="emerald"
          icon={FiTrendingUp}
        />
        <MetricBar
          label="Risk Mitigation"
          score={riskScore}
          color="amber"
          icon={FiShield}
        />
      </div>
    </div>
  );
};

export default ScoringBreakdown;
