import React from "react";
import { FiTruck, FiZap, FiActivity } from "react-icons/fi";
import { motion } from "framer-motion";
import "./CapacityPulse.scss";

const CapacityPulse = ({ carrierName, capacity = 3 }) => {
  // Tính toán mức độ tải trọng: low, mid, high
  const getIntensity = () =>
    capacity <= 2 ? "low" : capacity <= 4 ? "mid" : "high";

  return (
    <div className={`capacity-pulse-card ${getIntensity()}`}>
      <div className="carrier-identity">
        <div className="icon-vortex">
          <FiTruck className="truck-icon" />
          <div className="ping-nucleus"></div>
          <div className="ping-wave"></div>
        </div>
        <div className="info">
          <span className="name">{carrierName}</span>
          <div className="status-label">
            <FiActivity size={8} />
            <span>REAL_TIME_AVAILABILITY</span>
          </div>
        </div>
      </div>

      <div className="energy-cells">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.3 }}
            animate={{
              opacity: i < capacity ? 1 : 0.1,
              scaleY: i < capacity ? [1, 1.2, 1] : 1,
            }}
            transition={{
              repeat: i < capacity ? Infinity : 0,
              duration: 2,
              delay: i * 0.1,
            }}
            className={`cell ${i < capacity ? "active" : "empty"}`}>
            {i < capacity && <div className="cell-glow"></div>}
          </motion.div>
        ))}
        <div className="capacity-value">
          <FiZap className="zap-icon" />
          {capacity * 20}%
        </div>
      </div>
    </div>
  );
};

export default CapacityPulse;
