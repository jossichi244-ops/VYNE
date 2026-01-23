import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiZap, FiTruck, FiCalendar, FiShield } from "react-icons/fi";
import "./PromiseOptionCard.scss";

const PromiseOptionCard = ({
  type,
  eta,
  cost,
  active,
  confidence,
  onClick,
}) => {
  const configs = {
    "SAME-DAY": {
      icon: FiZap,
      theme: "neon-green",
      desc: "Instant Dispatch",
    },
    "NEXT-DAY": {
      icon: FiTruck,
      theme: "neon-blue",
      desc: "Standard Transit",
    },
    SCHEDULED: {
      icon: FiCalendar,
      theme: "neon-purple",
      desc: "Planned Slot",
    },
  };

  const config = configs[type] || configs["NEXT-DAY"];
  const Icon = config.icon;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`promise-pod ${config.theme} ${active ? "is-active" : ""}`}>
      {/* Hiệu ứng tia sáng quét qua khi Active */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pod-active-overlay">
            <div className="scan-line" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pod-inner">
        <div className="header-row">
          <div className="service-icon-box">
            <Icon className="main-icon" />
          </div>
          <div className="price-tag">
            {cost === 0 ? (
              <span className="free-label">COMPLIMENTARY</span>
            ) : (
              <span className="price-value">{cost.toLocaleString()}đ</span>
            )}
          </div>
        </div>

        <div className="service-info">
          <div className="type-meta">
            <h4 className="service-type">{type}</h4>
            <span className="service-desc">{config.desc}</span>
          </div>
          <p className="eta-text">{eta}</p>
        </div>

        <div className="confidence-meter">
          <div className="meter-label">
            <FiShield className="shield-icon" />
            <span>RELIABILITY SCORE</span>
          </div>
          <div className="meter-bars">
            {[1, 2, 3].map((lvl) => (
              <div
                key={lvl}
                className={`bar ${lvl <= confidence ? "filled" : ""}`}
              />
            ))}
            <span className="confidence-text">
              {confidence === 3 ? "OPTIMAL" : "STABLE"}
            </span>
          </div>
        </div>
      </div>

      {/* Trang trí góc thẻ */}
      <div className="pod-decoration">
        <div className="dot-grid"></div>
      </div>
    </motion.div>
  );
};

export default PromiseOptionCard;
