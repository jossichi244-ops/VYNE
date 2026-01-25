import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMaximize2, FiPrinter, FiZap } from "react-icons/fi";
import "./LabelPreviewer.scss";

const LabelPreviewer = ({ activeOrder }) => {
  return (
    <div className="label-preview-console">
      <div className="console-header">
        <div className="title-stack">
          <FiMaximize2 size={12} className="text-cyan" />
          <span>LABEL_VIRTUAL_RENDER</span>
        </div>
        {activeOrder && <div className="live-status">READY_TO_PRINT</div>}
      </div>

      <div className="printer-chassis">
        <div className="output-slot"></div>

        <AnimatePresence mode="wait">
          {!activeOrder ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="preview-placeholder">
              <FiPrinter className="placeholder-icon" />
              <p>CHỜ DỮ LIỆU ĐẦU VÀO...</p>
            </motion.div>
          ) : (
            <motion.div
              key={activeOrder.id}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="thermal-label-sheet">
              <div className="label-content">
                <div className="header-row">
                  <h5 className="brand-id">LOGI_EXEC_247</h5>
                  <div
                    className={`priority-pill ${activeOrder.priority?.toLowerCase()}`}>
                    {activeOrder.priority}
                  </div>
                </div>

                <div className="barcode-container">
                  <div className="barcode-bars"></div>
                  <span className="id-text">{activeOrder.id}</span>
                </div>

                <div className="info-grid">
                  <div className="info-block">
                    <label>CONSIGNEE</label>
                    <p>{activeOrder.receiverName}</p>
                  </div>
                  <div className="info-block">
                    <label>DESTINATION</label>
                    <p className="route-text">{activeOrder.route}</p>
                  </div>
                </div>

                <div className="footer-meta">
                  <div className="qr-box">
                    <div className="qr-pixel-grid"></div>
                  </div>
                  <div className="meta-text">
                    <p className="bold">SCAN TO CONFIRM</p>
                    <p>ELECTRONIC_POD_ENABLED</p>
                  </div>
                  <FiZap className="zap-mini" />
                </div>
              </div>
              <div className="tear-edge"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="chassis-footer">
        <div className="screw"></div>
        <div className="vent-holes"></div>
        <div className="screw"></div>
      </div>
    </div>
  );
};

export default LabelPreviewer;
