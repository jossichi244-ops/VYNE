import React from "react";
import { FiAlertCircle, FiSettings, FiCheck, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import "./ConstraintBuilder.scss";

const ConstraintBuilder = () => {
  const constraints = [
    { label: "Max Weight", value: "5.0 Tons", active: true },
    { label: "Urban Entry", value: "Nội đô 24/7", active: true },
    { label: "Cold Chain", value: "Required", active: false },
  ];

  return (
    <div className="logic-constraint-engine">
      <div className="engine-header">
        <div className="title-group">
          <FiSettings className="gear-spin" />
          <h3>ROUTING_LOGIC_CORE</h3>
        </div>
        <div className="engine-status">ACTIVE_FILTERS</div>
      </div>

      <div className="constraints-stack">
        {constraints.map((item, idx) => (
          <div
            key={idx}
            className={`constraint-node ${item.active ? "on" : "off"}`}>
            <div className="node-pathway"></div>

            <div className="node-content">
              <div className="label-section">
                <span className="node-id">0{idx + 1}</span>
                <span className="node-label">{item.label}</span>
              </div>

              <div className="value-section">
                <code className="node-value">{item.value}</code>
                <div className="toggle-indicator">
                  {item.active ? <FiCheck size={10} /> : <FiX size={10} />}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="impact-analysis">
        <div className="impact-header">
          <FiAlertCircle className="pulse-icon" />
          <span>AVAILABILITY_IMPACT_ANALYSIS</span>
        </div>
        <div className="impact-bar-container">
          <motion.div
            className="impact-fill"
            initial={{ width: 0 }}
            animate={{ width: "40%" }}
            transition={{ duration: 1, ease: "circOut" }}
          />
        </div>
        <p className="impact-note">
          Ràng buộc hiện tại giới hạn <strong>40%</strong> đối tác vận chuyển
          phù hợp.
        </p>
      </div>
    </div>
  );
};

export default ConstraintBuilder;
