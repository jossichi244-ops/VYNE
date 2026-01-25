import React from "react";
import { motion } from "framer-motion";
import {
  FiBarChart2,
  FiAlertCircle,
  FiCheckCircle,
  FiSearch,
} from "react-icons/fi";
import "./ReconciliationTable.scss";

const ReconciliationTable = ({ records = [] }) => {
  if (!records || records.length === 0) {
    return (
      <div className="empty-recon-state">
        <FiBarChart2 className="empty-icon" />
        <p>SYSTEM_IDLE: CHỜ DỮ LIỆU ĐỐI SOÁT...</p>
      </div>
    );
  }

  return (
    <div className="recon-matrix-wrapper">
      <header className="matrix-header">
        <div className="title-stack">
          <FiBarChart2 className="icon-accent" />
          <div className="text">
            <h4>FISCAL_RECON_MATRIX</h4>
            <p>ĐỐI SOÁT CHI PHÍ THỰC THI CUỐI CA</p>
          </div>
        </div>

        <div className="control-room">
          <div className="search-box">
            <FiSearch />
            <input type="text" placeholder="Tìm ID chuyến..." />
          </div>
          <div className="filter-pill-group">
            <button className="pill active">ALL</button>
            <button className="pill warning">MISMATCH</button>
          </div>
        </div>
      </header>

      <div className="table-viewport">
        <table className="cyber-table">
          <thead>
            <tr>
              <th>SHIPMENT_ID</th>
              <th>PLANNED_FEE</th>
              <th>ACTUAL_FEE</th>
              <th>VARIANCE</th>
              <th className="text-center">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {records.map((item, idx) => {
              const plan = item.planFee ?? 0;
              const actual = item.actualFee ?? 0;
              const diff = actual - plan;
              const isMismatch = diff !== 0;

              return (
                <motion.tr
                  key={item.id || idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={isMismatch ? "row-error" : "row-sync"}>
                  <td className="id-col">
                    <span className="id-tag">{item.id || "N/A"}</span>
                  </td>
                  <td className="val-col">{plan.toLocaleString()}</td>
                  <td className="val-col actual">{actual.toLocaleString()}</td>
                  <td
                    className={`diff-col ${diff > 0 ? "pos" : diff < 0 ? "neg" : ""}`}>
                    {diff === 0
                      ? "—"
                      : `${diff > 0 ? "+" : ""}${diff.toLocaleString()}`}
                  </td>
                  <td className="status-col">
                    <div
                      className={`status-node ${isMismatch ? "alert" : "match"}`}>
                      {isMismatch ? <FiAlertCircle /> : <FiCheckCircle />}
                      <span>{isMismatch ? "RE-CHECK" : "MATCHED"}</span>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReconciliationTable;
