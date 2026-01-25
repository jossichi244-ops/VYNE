import React from "react";
import { motion } from "framer-motion";
import {
  FiBox,
  FiPrinter,
  FiTruck,
  FiCheckCircle,
  FiChevronRight,
} from "react-icons/fi";
import "./ExecutionStatusBoard.scss";

const ExecutionStatusBoard = ({
  stats = { created: 0, printed: 0, inTransit: 0, delivered: 0 },
}) => {
  const metrics = [
    { label: "CREATED", value: stats.created, color: "cyan", icon: FiBox },
    {
      label: "PRINTED",
      value: stats.printed,
      color: "emerald",
      icon: FiPrinter,
    },
    {
      label: "IN_TRANSIT",
      value: stats.inTransit,
      color: "amber",
      icon: FiTruck,
    },
    {
      label: "DELIVERED",
      value: stats.delivered,
      color: "success",
      icon: FiCheckCircle,
    },
  ];

  return (
    <div className="execution-board-container">
      <div className="board-header">
        <div className="live-tag">
          <div className="dot"></div>
          <span>LIVE_MONITORING</span>
        </div>
        <div className="timestamp">{new Date().toLocaleTimeString()}</div>
      </div>

      <div className="metrics-pipeline">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <React.Fragment key={i}>
              <motion.div
                className={`status-segment ${m.color}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}>
                <div className="icon-box">
                  <Icon />
                </div>
                <div className="data-box">
                  <span className="label">{m.label}</span>
                  <motion.span
                    className="value"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}>
                    {m.value.toLocaleString()}
                  </motion.span>
                </div>
                <div className="segment-bg"></div>
              </motion.div>

              {i < metrics.length - 1 && (
                <div className="pipeline-connector">
                  <FiChevronRight className="arrow-pulse" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ExecutionStatusBoard;
