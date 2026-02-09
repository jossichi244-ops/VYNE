import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiAlertTriangle,
  FiTrendingUp,
  FiSend,
  FiTruck,
  FiFileText,
  FiDollarSign,
  FiActivity,
  FiX,
  FiCheckCircle,
} from "react-icons/fi";
import { operationalMockEngine } from "../../mock/mockOperationalEngine";
import "./OperationalActions.scss";

const OperationalActions = ({ disabledReasons = [] }) => {
  const [result, setResult] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);

  const criticalIssues = disabledReasons.filter(
    (i) => i.severity === "CRITICAL",
  );
  const warningIssues = disabledReasons.filter((i) => i.severity === "WARNING");

  const readinessScore = useMemo(() => {
    const penalty = criticalIssues.length * 30 + warningIssues.length * 10;
    return Math.max(0, 100 - penalty);
  }, [criticalIssues.length, warningIssues.length]);

  const executeAction = (type) => {
    setLoadingAction(type);
    setResult(null); // Reset kết quả cũ để tạo hiệu ứng mới

    setTimeout(() => {
      const engine = operationalMockEngine[type];
      if (!engine) return;

      const blocked = criticalIssues.length > 0;
      let scenario =
        (type === "booking" || type === "customs") && blocked
          ? engine.scenarios.hold || engine.scenarios.error
          : engine.scenarios.success || Object.values(engine.scenarios)[0];

      setResult({
        action: type,
        status: scenario?.status || "info",
        message: scenario?.message || "Action executed",
        payload: scenario || {},
      });
      setLoadingAction(null);
    }, 900);
  };

  return (
    <div className="op-intel-container">
      <div className="op-header">
        <h2>Operational Intelligence Layer</h2>
        <div className="readiness-badge">
          <div className="gauge-bar" style={{ width: `${readinessScore}%` }} />
          <span>System Readiness: {readinessScore}%</span>
        </div>
      </div>

      <div className="action-grid">
        {[
          {
            id: "booking",
            icon: <FiTruck />,
            title: "Generate Booking",
            desc: "Create carrier booking from manifest.",
          },
          {
            id: "tms",
            icon: <FiSend />,
            title: "Push to TMS",
            desc: "Sync shipment with transport system.",
          },
          {
            id: "warehouse",
            icon: <FiActivity />,
            title: "Warehouse Job",
            desc: "Auto-generate WMS picking tasks.",
          },
          {
            id: "customs",
            icon: <FiFileText />,
            title: "Customs Draft",
            desc: "Prepare regulatory declarations.",
          },
          {
            id: "freight",
            icon: <FiDollarSign />,
            title: "Freight Calc",
            desc: "Compare multi-carrier rates.",
          },
          {
            id: "demdet",
            icon: <FiTrendingUp />,
            title: "Simulate DEM/DET",
            desc: "Predict detention exposure.",
          },
        ].map((item) => (
          <ActionCard
            key={item.id}
            {...item}
            onClick={() => executeAction(item.id)}
            loading={loadingAction === item.id}
          />
        ))}
      </div>

      {/* MODAL RESULT OVERLAY */}
      <AnimatePresence>
        {result && (
          <div className="result-overlay">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`result-modal ${result.status}`}>
              <button className="close-btn" onClick={() => setResult(null)}>
                <FiX />
              </button>

              <div className="modal-header">
                <div className="status-icon">
                  {result.status === "success" ? (
                    <FiCheckCircle />
                  ) : (
                    <FiAlertTriangle />
                  )}
                </div>
                <h3>{result.message}</h3>
              </div>

              <div className="modal-body">
                <div className="data-scanner" />
                {Object.entries(result.payload).map(
                  ([key, value]) =>
                    key !== "message" &&
                    key !== "status" && (
                      <div key={key} className="data-row">
                        <span className="label">{key.replace(/_/g, " ")}</span>
                        <span className="value">{String(value)}</span>
                      </div>
                    ),
                )}
              </div>

              <div className="modal-footer">
                <button onClick={() => setResult(null)}>Acknowledge</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ActionCard = ({ icon, title, desc, onClick, loading }) => (
  <div className={`op-card ${loading ? "is-loading" : ""}`}>
    <div className="card-icon">{icon}</div>
    <div className="card-info">
      <h4>{title}</h4>
      <p>{desc}</p>
    </div>
    <button className="exec-btn" onClick={onClick} disabled={loading}>
      {loading ? <div className="loader" /> : "Execute"}
    </button>
  </div>
);

export default OperationalActions;
