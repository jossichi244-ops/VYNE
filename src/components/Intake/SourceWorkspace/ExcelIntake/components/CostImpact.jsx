import React, { useMemo } from "react";
import { FiAnchor, FiDollarSign, FiAlertCircle } from "react-icons/fi";
import "./CostImpact.scss";

// Tách cấu hình ra ngoài để dễ dàng thay đổi mà không cần sửa logic component
const CONFIG = {
  COST_PER_KG: 0.5,
  THRESHOLDS: {
    HIGH: 50000,
    MEDIUM: 20000,
  },
};

const CostImpact = ({ rows = [] }) => {
  // ✅ Quy tắc Hook: Luôn gọi ở trên cùng
  const costStats = useMemo(() => {
    if (!rows.length) return null;

    let totalWeight = 0;
    rows.forEach((row) => {
      // Senior tip: Sử dụng Optional Chaining hoặc danh sách các key tiềm năng
      const weight = Number(
        row.Weight_KG ?? row.weight ?? row.gross_weight ?? 0,
      );
      totalWeight += isNaN(weight) ? 0 : weight;
    });

    const totalCost = totalWeight * CONFIG.COST_PER_KG;

    let riskLevel = "LOW";
    if (totalWeight > CONFIG.THRESHOLDS.HIGH) riskLevel = "HIGH";
    else if (totalWeight > CONFIG.THRESHOLDS.MEDIUM) riskLevel = "MEDIUM";

    return {
      totalWeight,
      estimatedCost: totalCost,
      riskLevel,
    };
  }, [rows]);

  // Early return sau khi khai báo Hook
  if (!rows.length || !costStats) return null;

  return (
    <div className="cost-impact-enterprise">
      <div className="card-header">
        <div className="title-area">
          <FiAlertCircle className="header-icon" />
          <h4>COST & RISK IMPACT</h4>
        </div>
        <div className={`status-pill ${costStats.riskLevel.toLowerCase()}`}>
          {costStats.riskLevel} RISK
        </div>
      </div>

      <div className="impact-grid">
        <div className="impact-item">
          <div className="icon-wrapper">
            <FiAnchor />
          </div>
          <div className="data-content">
            <span className="label">Total Payload</span>
            <span className="value">
              {costStats.totalWeight.toLocaleString()} <small>kg</small>
            </span>
          </div>
        </div>

        <div className="impact-item">
          <div className="icon-wrapper">
            <FiDollarSign />
          </div>
          <div className="data-content">
            <span className="label">Estimated Logistics Cost</span>
            <span className="value">
              $
              {costStats.estimatedCost.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="visual-indicator">
        <div
          className={`progress-bar ${costStats.riskLevel.toLowerCase()}`}
          style={{
            width: `${Math.min((costStats.totalWeight / (CONFIG.THRESHOLDS.HIGH * 1.2)) * 100, 100)}%`,
          }}
        />
      </div>
    </div>
  );
};

export default CostImpact;
