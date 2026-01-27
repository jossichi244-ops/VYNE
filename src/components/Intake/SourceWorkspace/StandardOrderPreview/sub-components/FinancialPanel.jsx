import React from "react";
import {
  FiClock,
  FiPercent,
  FiTrendingDown,
  FiShield,
  FiAlertCircle,
} from "react-icons/fi";
import "./FinancialPanel.scss";

const FinancialPanel = ({ data = {}, logic = {} }) => {
  const {
    demStatus = {
      estimatedFee: 0,
      daysLeft: 0,
      totalFreeDays: 7,
      isCritical: false,
    },
  } = logic;
  const timeProgress = (demStatus.daysLeft / demStatus.totalFreeDays) * 100;

  return (
    <div className={`fin-panel ${demStatus.isCritical ? "has-risk" : ""}`}>
      <div className="fin-panel__header">
        <h5>FISCAL OVERSIGHT</h5>
        <FiShield className="shield-icon" title="Audit Verified" />
      </div>

      <div className="fin-cards">
        {/* Card 1: DEM/DET - Focus on Time Pressure */}
        <div
          className={`fin-card ${demStatus.isCritical ? "is-critical" : ""}`}>
          <div className="fin-card__top">
            <FiClock className="icon" />
            <span>DEM / DET</span>
          </div>
          <div className="fin-card__main">
            <div className="price-tag">
              ${demStatus.estimatedFee.toLocaleString()}
            </div>
            <div className="sub-info">{demStatus.daysLeft} Days Left</div>
          </div>
          {/* Visual Time Tracker */}
          <div className="time-tracker">
            <div className="track-bg">
              <div
                className="track-fill"
                style={{ width: `${timeProgress}%` }}></div>
            </div>
          </div>
        </div>

        {/* Card 2: SLA Impact - Focus on Performance */}
        <div className={`fin-card ${logic.isLate ? "is-penalty" : "is-bonus"}`}>
          <div className="fin-card__top">
            <FiPercent className="icon" />
            <span>SLA IMPACT</span>
          </div>
          <div className="fin-card__main">
            <div className="price-tag">
              {logic.slaPenalty > 0 ? `-$${logic.slaPenalty}` : "NO PENALTY"}
            </div>
            <div className="status-label">
              {logic.isLate ? "DELAY PENALTY" : "COMPLIANT"}
            </div>
          </div>
          <FiTrendingDown
            className={`trend-icon ${logic.isLate ? "visible" : ""}`}
          />
        </div>
      </div>

      {/* Tax & Liability Summary */}
      <div className="fin-summary">
        <div className="summary-row">
          <div className="label-group">
            <span className="dot"></span>
            <label>Estimated Duties</label>
          </div>
          <span className="value">{data.dutyValue || "$1,240.00"}</span>
        </div>

        <div className="summary-row">
          <div className="label-group">
            <span className="dot"></span>
            <label>Liability Holder</label>
          </div>
          <span className="value-highlight">
            {logic.incotermRole || "BUYER"}
          </span>
        </div>
      </div>

      {demStatus.isCritical && (
        <div className="fin-footer-alert">
          <FiAlertCircle />
          <span>ACTION REQUIRED: FREE TIME EXPIRING SOON</span>
        </div>
      )}
    </div>
  );
};

export default FinancialPanel;
