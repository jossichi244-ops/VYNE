import React, { useState } from "react";
import {
  FiAlertOctagon,
  FiAlertTriangle,
  FiHash,
  FiArrowRight,
  FiTarget,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion"; // Thêm animation cho mượt
import "./ConflictDetector.scss";

const ConflictDetector = ({ issues = [] }) => {
  const [filter, setFilter] = useState("ALL");
  console.log("ConflictDetector issues:", issues);
  if (!issues.length) return null;

  const filteredIssues =
    filter === "ALL"
      ? issues
      : issues.filter((i) => i.type?.toUpperCase() === filter);

  const stats = {
    CRITICAL: issues.filter((i) => i.type?.toUpperCase() === "CRITICAL").length,
    WARNING: issues.filter((i) => i.type?.toUpperCase() === "WARNING").length,
  };

  return (
    <div className="conflict-detector-enterprise">
      {/* Header với HUD Style */}
      <div className="detector-header">
        <div className="title-section">
          <div className="icon-badge">
            <FiAlertOctagon />
          </div>
          <div className="text-group">
            <h4>Integrity Analysis</h4>
            <p>{issues.length} potential conflicts detected</p>
          </div>
        </div>

        <div className="filter-actions">
          <button
            className={`filter-btn ${filter === "ALL" ? "active" : ""}`}
            onClick={() => setFilter("ALL")}>
            All <span>{issues.length}</span>
          </button>
          <button
            className={`filter-btn critical ${filter === "CRITICAL" ? "active" : ""}`}
            onClick={() => setFilter("CRITICAL")}>
            Critical <span>{stats.CRITICAL}</span>
          </button>
          <button
            className={`filter-btn warning ${filter === "WARNING" ? "active" : ""}`}
            onClick={() => setFilter("WARNING")}>
            Warning <span>{stats.WARNING}</span>
          </button>
        </div>
      </div>

      {/* List Container với scroll riêng */}
      <div className="conflict-viewport">
        <AnimatePresence mode="popLayout">
          {filteredIssues.map((issue, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={idx}
              className={`conflict-card ${issue.type?.toLowerCase()}`}>
              <div className="card-indicator" />

              <div className="card-body">
                <div className="row-info">
                  <span className="hash-icon">
                    <FiHash />
                  </span>
                  <span className="row-number">ROW {issue.row || "N/A"}</span>
                </div>

                <div className="main-message">
                  <p>{issue.message}</p>
                  {issue.column && (
                    <div className="column-info">
                      <FiTarget className="small-icon" />
                      <span>Target Field:</span>
                      <code>{issue.column}</code>
                    </div>
                  )}
                </div>

                <div className="type-badge">
                  {issue.type?.toUpperCase() === "CRITICAL" ? (
                    <FiAlertOctagon />
                  ) : (
                    <FiAlertTriangle />
                  )}
                  <span>{issue.type}</span>
                </div>
              </div>

              <button className="fix-action-btn">
                GO TO ROW <FiArrowRight />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ConflictDetector;
