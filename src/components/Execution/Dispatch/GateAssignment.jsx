import React from "react";
import { motion } from "framer-motion";
import { FiExternalLink, FiUser, FiBox } from "react-icons/fi";
import StatusBadge from "../../Shared/StatusBadge"; // Sử dụng Badge đã thiết kế
import "./GateAssignment.scss";

const GateAssignment = ({
  gates = [
    { id: "G-01", status: "Available", driver: null, eta: "--:--" },
    { id: "G-02", status: "Busy", driver: "Trần Văn B", eta: "14:20" },
    { id: "G-03", status: "Maintenance", driver: null, eta: "N/A" },
  ],
}) => {
  return (
    <div className="gate-matrix-container">
      <div className="matrix-header">
        <div className="title-stack">
          <FiBox className="header-icon" />
          <div className="text-wrap">
            <h4>DOCK_ASSIGNMENT_MATRIX</h4>
            <p>GIÁM SÁT TRẠNG THÁI CỬA NHẬP/XUẤT HÀNG</p>
          </div>
        </div>
        <div className="capacity-indicator">
          <span className="label">UTILIZATION</span>
          <div className="value-bar">
            <div className="fill" style={{ width: "65%" }}></div>
          </div>
        </div>
      </div>

      <div className="gate-grid">
        {gates.map((gate, index) => (
          <motion.div
            key={gate.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`gate-bay ${gate.status.toLowerCase()}`}>
            <div className="bay-id">
              <span className="prefix">BAY</span>
              <span className="num">{gate.id.split("-")[1]}</span>
            </div>

            <div className="bay-content">
              <div className="status-row">
                <StatusBadge
                  type={
                    gate.status === "Available"
                      ? "success"
                      : gate.status === "Busy"
                        ? "info"
                        : "critical"
                  }>
                  {gate.status}
                </StatusBadge>
                <span className="eta-tag">{gate.eta}</span>
              </div>

              <div className="driver-slot">
                <FiUser className="slot-icon" />
                <span className="driver-name">
                  {gate.driver || "UNASSIGNED"}
                </span>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                className="assign-trigger"
                disabled={gate.status !== "Available"}>
                <FiExternalLink />
                <span>
                  {gate.status === "Available" ? "GÁN XE" : "CHI TIẾT"}
                </span>
              </motion.button>
            </div>

            {/* Hiệu ứng đèn tín hiệu ở cạnh card */}
            <div className="side-indicator"></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GateAssignment;
