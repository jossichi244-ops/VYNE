import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFolder, FiCheck, FiInfo } from "react-icons/fi";
import "./PODCaptureModule.scss";

const PODCaptureModule = ({ orderId = "ORD-2026-X9" }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPreview, setHasPreview] = useState(false);

  const triggerCapture = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setHasPreview(true);
    }, 1500);
  };

  return (
    <div className="pod-terminal">
      <div className="terminal-top">
        <div className="status-badge">
          <div className="pulse-red"></div>
          <span>LIVE_VIEWPORT</span>
        </div>
        <div className="order-tag">ID: {orderId}</div>
      </div>

      <div className="scanner-viewport">
        {/* Khung ngắm AR */}
        <div className="scanner-frame">
          <div className="corner tl"></div>
          <div className="corner tr"></div>
          <div className="corner bl"></div>
          <div className="corner br"></div>

          <AnimatePresence>
            {isScanning && (
              <motion.div
                className="laser-line"
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                exit={{ opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            )}
          </AnimatePresence>
        </div>

        <div className="viewport-overlay">
          <FiInfo size={12} />
          <span>Căn chỉnh biên bản khớp với khung nhận diện</span>
        </div>

        {/* Giả lập ảnh đã chụp */}
        {hasPreview && <div className="captured-preview"></div>}
      </div>

      <div className="scanner-controls">
        <button className="side-btn">
          <FiFolder />
          <span>ALBUM</span>
        </button>

        <motion.button
          className="shutter-trigger"
          whileTap={{ scale: 0.9 }}
          onClick={triggerCapture}>
          <div className="outer-ring">
            <div className="inner-core"></div>
          </div>
        </motion.button>

        <button className={`side-btn confirm ${hasPreview ? "active" : ""}`}>
          <FiCheck />
          <span>UPLOAD</span>
        </button>
      </div>

      <div className="terminal-id">LOGI-SCAN PRO v4.2</div>
    </div>
  );
};

export default PODCaptureModule;
