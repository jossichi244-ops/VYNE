import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrendingUp, FiDollarSign, FiCpu } from "react-icons/fi";
import "./CarrierRankCard.scss";

const CarrierRankCard = ({ carrier, isActive, onSelect }) => {
  // Giả lập dữ liệu scoring từ hook
  const scoring = { total: 94, breakdown: {} };

  return (
    <motion.div
      layout
      onClick={() => onSelect(carrier.id)}
      className={`carrier-rank-wrapper ${isActive ? "active-protocol" : ""}`}>
      {/* Hiệu ứng tia sáng quét qua khi Active */}
      {isActive && <div className="active-glow-scan"></div>}

      <div className="card-inner">
        <div className="header-section">
          <div className="carrier-info">
            <div className="id-badge">#{carrier.id.split("-")[0]}</div>
            <h4 className="carrier-name">{carrier.name}</h4>
            <div className={`status-dot ${carrier.status.toLowerCase()}`}>
              <span>{carrier.status}</span>
            </div>
          </div>

          <div className="score-radial">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path
                className="circle-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <motion.path
                className="circle"
                strokeDasharray={`${scoring.total}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="score-text">
              <span className="num">{scoring.total}</span>
            </div>
          </div>
        </div>

        <div className="quick-metrics">
          <div className="metric-box">
            <div className="m-label">
              <FiDollarSign /> BASE_COST
            </div>
            <div className="m-value">
              {carrier.basePrice === 0
                ? "INTERNAL"
                : `${carrier.basePrice.toLocaleString()}đ`}
            </div>
          </div>
          <div className="metric-box highlight">
            <div className="m-label">
              <FiTrendingUp /> RELIABILITY
            </div>
            <div className="m-value">{(carrier.sla * 100).toFixed(0)}%</div>
          </div>
        </div>

        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="expanded-analytics">
              <div className="divider"></div>
              <div className="ai-insight">
                <FiCpu className="ai-icon" />
                <p>
                  Hệ thống đề xuất dựa trên hiệu suất tuyến đường 7 ngày qua.
                </p>
              </div>
              {/* Component breakdown của bạn sẽ render ở đây */}
              <div className="breakdown-placeholder">
                <div className="bar">
                  <div className="fill" style={{ width: "90%" }}></div>
                </div>
                <div className="bar">
                  <div className="fill" style={{ width: "75%" }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CarrierRankCard;
