import React from "react";
import { motion } from "framer-motion";
import { FiZap, FiActivity } from "react-icons/fi";

// Import các sub-components đã triển khai
import ComplianceHeader from "../Intake/SourceWorkspace/StandardOrderPreview/sub-components/ComplianceHeader";
import CargoCondition from "../Intake/SourceWorkspace/StandardOrderPreview/sub-components/CargoCondition";
import LogisticsTimeline from "../Intake/SourceWorkspace/StandardOrderPreview/sub-components/LogisticsTimeline";
import FinancialPanel from "../Intake/SourceWorkspace/StandardOrderPreview/sub-components/FinancialPanel";
import { dhlExpressOrder } from "../Intake/SourceWorkspace/StandardOrderPreview/mocks/orders";

import { useTrackingLogic } from "../Intake/SourceWorkspace/StandardOrderPreview/hooks/useTrackingLogic";

import "./StandardOrderPreview.scss";

const StandardOrderPreview = () => {
  const orderData = dhlExpressOrder;
  const logic = useTrackingLogic(orderData);

  if (!orderData)
    return <div className="loading-state">Initializing Node...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="standard-order-preview">
      {/* 1. Header & Compliance Area: AWB, Incoterms, HS Code */}
      <header className="preview-section header-area">
        <ComplianceHeader data={orderData} logic={logic} />
      </header>

      <div className="main-bento-grid">
        {/* 2. Timeline & Operation Area: Hàng đang ở đâu? Có bị stuck không? */}
        <section className="preview-section timeline-area">
          <div className="section-label">
            <FiActivity /> OPERATION VISIBILITY
          </div>
          <LogisticsTimeline data={orderData} logic={logic} />
        </section>

        {/* 3. Sensory Data Area: Nhiệt độ, Độ ẩm (Cold Chain / High-tech) */}
        <section className="preview-section condition-area">
          <CargoCondition data={orderData} />
        </section>

        {/* 4. Finance & Risk Area: Thuế, Phí lưu bãi, Phạt SLA */}
        <section className="preview-section financial-area">
          <FinancialPanel data={orderData} logic={logic} />
        </section>
      </div>

      {/* 5. Footer: AI Insights (Dự đoán tương lai theo phong cách FarEye) */}
      <footer className="preview-footer">
        <div className="ai-insight-card">
          <div className="zap-wrapper">
            <FiZap className="zap-icon" />
          </div>
          <div className="insight-text">
            <span className="label">AI PREDICTIVE ANALYSIS</span>
            <p>
              Probability of <strong>Demurrage</strong> in next 24h:
              <span
                className={
                  logic.demStatus.isCritical ? "text-red" : "text-green"
                }>
                {logic.demStatus.isCritical
                  ? " 85% (High Risk)"
                  : " 12% (Low Risk)"}
              </span>
            </p>
          </div>
        </div>
        <div className="last-sync">
          Last Radar Sync: {new Date().toLocaleTimeString()}
        </div>
      </footer>
    </motion.div>
  );
};

export default StandardOrderPreview;
