import React, { useState } from "react";
import {
  FiCamera,
  FiCheckCircle,
  FiUploadCloud,
  FiShield,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import "./PODCapture.scss";

const PODCapture = () => {
  const [status, setStatus] = useState("idle"); // idle | capturing | secured

  const handleCapture = () => {
    setStatus("capturing");
    setTimeout(() => setStatus("secured"), 2000);
  };

  return (
    <div className={`pod-capture-module ${status}`}>
      <div className="module-header">
        <FiShield className="shield-icon" />
        <span className="protocol-text">SECURE_EVIDENCE_PROTOCOL</span>
      </div>

      <div className="viewfinder-container">
        {/* Bốn góc của ống kính */}
        <div className="corner top-left"></div>
        <div className="corner top-right"></div>
        <div className="corner bottom-left"></div>
        <div className="corner bottom-right"></div>

        <div className="scanner-line"></div>

        <div className="visual-core">
          <AnimatePresence mode="wait">
            {status === "secured" ? (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="success-display">
                <FiCheckCircle className="check-icon" />
                <div className="lock-animation"></div>
              </motion.div>
            ) : (
              <div className="camera-trigger">
                <FiCamera className="cam-icon" />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="meta-content">
        <h4 className="title">POD Documentation</h4>
        <p className="subtitle">
          Mã hóa hình ảnh thực tế vào đối soát thanh toán
        </p>
      </div>

      <div className="action-footer">
        {status !== "secured" ? (
          <button
            className="capture-btn"
            onClick={handleCapture}
            disabled={status === "capturing"}>
            <div className="btn-bg"></div>
            <span className="btn-text">
              {status === "capturing" ? "ENCRYPTING..." : "UPLOAD EVIDENCE"}
            </span>
            <FiUploadCloud className="upload-icon" />
          </button>
        ) : (
          <div className="secured-badge">
            <span className="glitch-text" data-text="HASH_VERIFIED">
              HASH_VERIFIED
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PODCapture;
