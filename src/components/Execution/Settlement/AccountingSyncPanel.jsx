import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiRefreshCw,
  FiAlertTriangle,
  FiShield,
  FiDatabase,
  FiArrowRight,
} from "react-icons/fi";
import "./AccountingSyncPanel.scss";

const AccountingSyncPanel = ({ syncData = { mismatch: false } }) => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div
      className={`accounting-shell ${syncData.mismatch ? "has-mismatch" : "synchronized"}`}>
      <div className="ledger-header">
        <div className="title-group">
          <FiDatabase className="header-icon" />
          <div className="text-wrap">
            <h4>ERP_FINANCE_BRIDGE</h4>
            <p>ĐỒNG BỘ CHỨNG TỪ KẾ TOÁN</p>
          </div>
        </div>
        <div className="verification-badge">
          {syncData.mismatch ? (
            <FiAlertTriangle className="text-amber animate-pulse" />
          ) : (
            <FiShield className="text-emerald" />
          )}
        </div>
      </div>

      <div className="settlement-summary">
        <div className="data-node">
          <span className="node-label">OPERATING_EXPENSE</span>
          <div className="value-group">
            <span className="currency">VNĐ</span>
            <span className="amount">24.500.000</span>
          </div>
        </div>

        <div className="sync-path">
          <div className="line"></div>
          <FiArrowRight className="arrow" />
        </div>

        <div className="erp-target">
          <span className="node-label">SAP_INTEGRATION</span>
          <div
            className={`status-pill ${syncData.mismatch ? "warning" : "success"}`}>
            {syncData.mismatch ? "DATA_MISMATCH" : "VERIFIED"}
          </div>
        </div>
      </div>

      <motion.button
        className={`sync-trigger-btn ${isSyncing ? "syncing" : ""}`}
        onClick={handleSync}
        disabled={isSyncing}
        whileTap={{ scale: 0.98 }}>
        <div className="btn-glow"></div>
        <div className="content">
          <motion.div
            animate={isSyncing ? { rotate: 360 } : { rotate: 0 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
            <FiRefreshCw />
          </motion.div>
          <span>
            {isSyncing ? "TRANSMITTING_DATA..." : "ĐẨY DỮ LIỆU SANG ERP"}
          </span>
        </div>
      </motion.button>

      <div className="footer-log">
        <p>LAST_SYNC: 2026-01-25 19:45 // AUTH: ADMIN_01</p>
      </div>
    </div>
  );
};

export default AccountingSyncPanel;
