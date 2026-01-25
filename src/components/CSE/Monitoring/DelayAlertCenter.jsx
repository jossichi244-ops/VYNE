import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  // eslint-disable-next-line no-unused-vars
  FiAlertTriangle,
  FiClock,
  FiCornerUpRight,
  FiXCircle,
  FiRadio,
} from "react-icons/fi";
import "./DelayAlertCenter.scss";

const DelayAlertCenter = ({ alerts = [] }) => {
  return (
    <div className="hazard-alert-system">
      <div className="system-header">
        <div className="status-indicator">
          <FiRadio className="broadcast-icon" />
          <h4 className="title">CRITICAL_DELAY_PROTOCOL</h4>
        </div>
        <div className="active-count">
          <span className="count-pulse"></span>
          <span className="text">{alerts.length} ACTIVE_ISSUES</span>
        </div>
      </div>

      <div className="alert-scroll-area">
        <AnimatePresence mode="popLayout">
          {alerts.map((alert, idx) => (
            <motion.div
              key={alert.id || idx}
              initial={{ opacity: 0, x: 30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className={`hazard-card ${alert.severity || "medium"}`}>
              <div className="hazard-stripe"></div>

              <div className="card-body">
                <div className="icon-column">
                  <div className="alert-icon-hex">
                    <FiClock size={16} />
                  </div>
                  <div className="time-stamp">
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div className="content-column">
                  <div className="text-content">
                    <h5 className="alert-title">{alert.title}</h5>
                    <p className="alert-msg">{alert.message}</p>
                  </div>

                  <div className="action-row">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-reroute">
                      <FiCornerUpRight /> <span>RE-ROUTE</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ opacity: 1 }}
                      className="btn-dismiss">
                      <FiXCircle /> <span>IGNORE</span>
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Hiệu ứng quét radar chìm */}
              <div className="scan-overlay"></div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DelayAlertCenter;
