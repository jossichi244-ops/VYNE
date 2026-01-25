import React from "react";
import { FiLayers, FiTrendingDown, FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import "./LTLConsolidator.scss";

const LTLConsolidator = ({ currentLoad = 65 }) => {
  return (
    <div className="ltl-engine-card">
      <div className="card-header">
        <div className="brand-zone">
          <div className="icon-cube">
            <FiLayers />
          </div>
          <div className="titles">
            <h3>LTL_CONSOLIDATOR</h3>
            <p>VIRTUAL_LOAD_MASTER</p>
          </div>
        </div>
        <div className="efficiency-tag">
          <FiTrendingDown />
          <span>-12% OPEX</span>
        </div>
      </div>

      <div className="visualizer-space">
        {/* Mô phỏng các kiện hàng trong thùng xe */}
        <div className="truck-bed-proxy">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`cargo-block ${i < currentLoad / 12 ? "filled" : ""}`}
            />
          ))}
        </div>
      </div>

      <div className="utilization-metrics">
        <div className="label-row">
          <span className="label">CAPACITY_UTILIZATION</span>
          <span className="value">{currentLoad}%</span>
        </div>

        <div className="progress-container">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${currentLoad}%` }}
            transition={{ duration: 1, ease: "easeOut" }}>
            <div className="shimmer-effect"></div>
          </motion.div>
        </div>
      </div>

      <footer className="action-zone">
        <p className="hint-text">
          Cần thêm ~1.2 tons để tối ưu lộ trình SGN-HAN
        </p>
        <button className="match-button">
          <FiSearch />
          <span>FIND_MATCHING_PARCELS</span>
        </button>
      </footer>
    </div>
  );
};

export default LTLConsolidator;
