import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiPrinter,
  FiFileText,
  FiTruck,
  FiClipboard,
  FiLayers,
} from "react-icons/fi";
import "./BatchPrintPanel.scss";

const BatchPrintPanel = ({ selectedOrders = [] }) => {
  const [docType, setDocType] = useState("shipping_label");

  const docTypes = [
    { id: "shipping_label", label: "NHÃN VẬN CHUYỂN", icon: FiTruck },
    { id: "delivery_note", label: "PHIẾU XUẤT KHO", icon: FiFileText },
    { id: "internal_invoice", label: "HÓA ĐƠN NỘI BỘ", icon: FiClipboard },
  ];

  return (
    <div className="print-terminal-container">
      <div className="terminal-header">
        <div className="title-area">
          <div className="print-icon-bg">
            <FiPrinter className="icon-main" />
            <div className="signal-ring"></div>
          </div>
          <div className="text-stack">
            <h4>PRINT_QUEUE_MANAGER</h4>
            <p>HỆ THỐNG IN ẤN TỰ ĐỘNG V2</p>
          </div>
        </div>
        <div className="queue-status">
          <span className="label">QUEUE</span>
          <motion.span
            key={selectedOrders.length}
            initial={{ scale: 1.5, color: "#00E5FF" }}
            animate={{ scale: 1, color: "#94a3b8" }}
            className="count">
            {selectedOrders.length.toString().padStart(2, "0")}
          </motion.span>
        </div>
      </div>

      <div className="document-matrix">
        {docTypes.map((type) => {
          const Icon = type.icon;
          const isActive = docType === type.id;
          return (
            <button
              key={type.id}
              className={`matrix-item ${isActive ? "active" : ""}`}
              onClick={() => setDocType(type.id)}>
              <div className="selection-indicator"></div>
              <Icon className="item-icon" />
              <span className="item-label">{type.label}</span>
              {isActive && (
                <motion.div layoutId="active-glow" className="active-bg-glow" />
              )}
            </button>
          );
        })}
      </div>

      <div className="terminal-footer">
        <div className="printer-status-line">
          <FiLayers size={10} />
          <span>PRINTER_STATE: ONLINE // READY_TO_BATCH</span>
        </div>

        <button
          className="master-print-trigger"
          disabled={selectedOrders.length === 0}>
          <div className="btn-glitch-layer"></div>
          <span className="text">BẮT ĐẦU IN LOẠT</span>
          <div className="stripe-shimmer"></div>
        </button>
      </div>
    </div>
  );
};

export default BatchPrintPanel;
