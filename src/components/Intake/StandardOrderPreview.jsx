import React from "react";
import { motion } from "framer-motion";
import { FiPackage, FiMapPin, FiUser, FiZap, FiTarget } from "react-icons/fi";
import "./StandardOrderPreview.scss";

const OrderField = ({ icon: Icon, label, value, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="manifest-field">
    <div className="field-icon-wrapper">
      <Icon size={16} />
    </div>
    <div className="field-body">
      <span className="field-label">{label}</span>
      <p className="field-value">{value || "---"}</p>
    </div>
    <div className="field-status-dot" />
  </motion.div>
);

const StandardOrderPreview = ({ data = {} }) => {
  return (
    <div className="order-preview-container">
      {/* Kỹ thuật: Sử dụng pseudo-elements để tạo hiệu ứng quét ánh sáng */}
      <div className="order-manifest-card">
        <div className="card-header">
          <div className="title-stack">
            <h3 className="glitch-text">ORDER OBJECT</h3>
            <span className="serial-no">ID: #ORD-2026-X99</span>
          </div>
          <div className="tag-normalized">
            <FiTarget className="tag-icon" />
            <span>NORMALIZED</span>
          </div>
        </div>

        <div className="manifest-body">
          <div className="barcode-simulation">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="barcode-line"
                style={{ width: Math.random() * 4 + 1 + "px" }}
              />
            ))}
          </div>

          <div className="fields-grid">
            <OrderField
              icon={FiUser}
              label="Consignee"
              value="Logistics Solution JSC"
              delay={0.1}
            />
            <OrderField
              icon={FiMapPin}
              label="Destination Hub"
              value="Kho 02, Cảng Cát Lái, HCM"
              delay={0.2}
            />
            <OrderField
              icon={FiPackage}
              label="Cargo Payload"
              value="12 pallets | 1,200kg"
              delay={0.3}
            />
          </div>
        </div>

        <div className="orchestration-footer">
          <div className="footer-meta">
            <div className="status-badge">
              <FiZap className="zap-icon" />
              <span>READY FOR ORCHESTRATION</span>
            </div>
            <span className="sla-value">SLA: 100%</span>
          </div>

          <div className="progress-track">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <div className="progress-glow" />
          </div>

          <p className="timestamp">DATA VALIDATED BY AI CORE • 23:54:03</p>
        </div>
      </div>
    </div>
  );
};

export default StandardOrderPreview;
