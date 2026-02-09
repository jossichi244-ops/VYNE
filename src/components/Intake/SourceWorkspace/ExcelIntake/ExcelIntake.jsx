import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiUpload,
  FiCpu,
  FiFileText,
  FiArrowRight,
  FiCheckCircle,
  FiZap,
} from "react-icons/fi";

import "./ExcelIntake.scss";

// === Enterprise Intelligence Blocks ===
import {
  fileSummary,
  // fieldMappings,
  conflicts,
  costScenarios,
} from "./mockData";

import FileSummary from "./components/FileSummary";
import ConflictDetector from "./components/ConflictDetector";
import CostImpact from "./components/CostImpact";
import OperationalActions from "./components/OperationalActions";
import BulkOperations from "./components/BulkOperations";

const ExcelIntake = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [, setApproved] = useState(false);

  // 🔹 UI Mapping (cinematic layer)
  const mappingData = [
    {
      excel: "Consignee_Name",
      std: "customer_name",
      status: "match",
      confidence: "98%",
    },
    {
      excel: "Dest_Addr_L1",
      std: "delivery_address",
      status: "match",
      confidence: "94%",
    },
    {
      excel: "Weight_KG",
      std: "gross_weight",
      status: "warning",
      confidence: "72%",
    },
  ];

  return (
    <div className="logistics-intake-wrapper">
      {/* ======================================================
          1️⃣ UPLOAD ZONE – FILE INTAKE TERMINAL
      ====================================================== */}
      <motion.div
        onDragOver={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        className={`upload-terminal ${isDragging ? "dragging" : ""}`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}>
        <div className="terminal-inner">
          <div className="scanner-line" />
          <div className="upload-icon-box">
            <FiUpload className="base-icon" />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="floating-glow"
            />
          </div>
          <div className="text-content">
            <h3 className="title">Drop Logistics Manifest</h3>
            <p className="subtitle">XLSX, CSV or EDI formats supported</p>
          </div>
          <div className="file-limit-tag">MAX PAYLOAD: 10MB</div>
        </div>
      </motion.div>

      {/* ======================================================
          2️⃣ FILE INTELLIGENCE SUMMARY (ENTERPRISE)
      ====================================================== */}
      <FileSummary data={fileSummary} />

      {/* ======================================================
          3️⃣ AI FIELD MAPPING ENGINE (CINEMATIC)
      ====================================================== */}
      <div className="mapping-engine-card">
        <div className="engine-header">
          <div className="header-left">
            <div className="ai-orbit">
              <FiCpu className="ai-icon" />
              <div className="orbit-ring" />
            </div>
            <div className="title-stack">
              <span className="eyebrow">Neural Mapping Engine</span>
              <h4 className="main-title">FIELD AUTO-RECONCILIATION</h4>
            </div>
          </div>
          <div className="ai-status">
            <FiZap className="zap-icon" />
            <span>AI SUGGESTION ACTIVE</span>
          </div>
        </div>

        <div className="mapping-grid">
          {mappingData.map((row, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`mapping-row ${row.status}`}>
              <div className="source-col">
                <FiFileText className="file-icon" />
                <span className="field-name">{row.excel}</span>
              </div>

              <div className="connection-path">
                <div className="path-line">
                  <motion.div
                    className="path-pulse"
                    animate={{ left: ["0%", "100%"] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "linear",
                    }}
                  />
                </div>
                <FiArrowRight className="arrow-icon" />
              </div>

              <div className="target-col">
                <div className="target-info">
                  <span className="std-name">{row.std}</span>
                  <span className="confidence-score">
                    {row.confidence} Match
                  </span>
                </div>
                <div className={`status-indicator ${row.status}`}>
                  {row.status === "match" ? (
                    <FiCheckCircle />
                  ) : (
                    <div className="warn-dot" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="engine-footer">
          <button className="btn-confirm-all">APPROVE FIELD MAPPINGS</button>
        </div>
      </div>

      {/* ======================================================
          4️⃣ CONFLICT / DUPLICATE DETECTOR
      ====================================================== */}
      <ConflictDetector issues={conflicts} />

      {/* ======================================================
          5️⃣ COST & RISK IMPACT SIMULATION
      ====================================================== */}
      <CostImpact scenarios={costScenarios} />

      {/* ======================================================
          6️⃣ OPERATIONAL ACTION LAYER
      ====================================================== */}
      <OperationalActions disabledReasons={conflicts} />

      {/* ======================================================
          7️⃣ BULK SMART OPERATIONS
      ====================================================== */}
      <BulkOperations onApprove={() => setApproved(true)} />
    </div>
  );
};

export default ExcelIntake;
