import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiZap, FiAlertTriangle, FiSend, FiLoader } from "react-icons/fi";
import "./DispatchActionCard.scss";

const DispatchActionCard = ({
  selectedCount = 0,
  onDispatch,
  isProcessing = false,
}) => {
  return (
    <div
      className={`dispatch-container ${selectedCount > 0 ? "ready" : "standby"}`}>
      <div className="hazard-bar"></div>

      <div className="content-wrap">
        <header className="action-header">
          <div className="title-zone">
            <FiZap className="zap-icon" />
            <div className="text-group">
              <h4>BULK_DISPATCH_PROTOCOL</h4>
              <p>XÁC NHẬN THỰC THI HÀNG LOẠT</p>
            </div>
          </div>
          <div className="selection-counter">
            <span className="label">SELECTED</span>
            <span className="count">
              {selectedCount.toString().padStart(2, "0")}
            </span>
          </div>
        </header>

        <div className="interaction-zone">
          <motion.button
            whileHover={selectedCount > 0 ? { scale: 1.02 } : {}}
            whileTap={selectedCount > 0 ? { scale: 0.98 } : {}}
            className="master-dispatch-trigger"
            disabled={selectedCount === 0 || isProcessing}
            onClick={onDispatch}>
            <div className="glow-edge"></div>
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="btn-content">
                  <FiLoader className="animate-spin" />
                  <span>TRANSMITTING...</span>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="btn-content">
                  <FiSend />
                  <span>PHÁT LỆNH NGAY</span>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="shimmer-sweep"></div>
          </motion.button>
        </div>

        <footer className="warning-footer">
          <FiAlertTriangle className="warn-icon" />
          <p>
            Hệ thống sẽ đồng bộ hóa dữ liệu thời gian thực tới Mobile App của
            tài xế.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default DispatchActionCard;
