import React from "react";
import { motion } from "framer-motion";
import { FiShield, FiCheckCircle, FiLock, FiInfo } from "react-icons/fi";
import "./ContractMoment.scss";

const ContractMoment = ({ selected, eta }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="contract-moment-wrapper">
      {/* Hiệu ứng nền Holographic */}
      <div className="hologram-bg" />

      <div className="assurance-container">
        <div className="assurance-header">
          <div className="shield-icon-wrapper">
            <motion.div
              animate={{ rotateY: [0, 180, 360] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
              <FiShield size={28} className="shield-icon" />
            </motion.div>
            <div className="glow-flare" />
          </div>
          <div className="contract-title">
            <div className="verified-tag">
              <FiCheckCircle size={10} />
              <span>SECURED BY VYNE-CORE</span>
            </div>
            <h4>SMART LOGISTICS GUARANTEE</h4>
          </div>
        </div>

        <div className="contract-body">
          <p className="agreement-text">
            Hệ thống xác nhận cam kết bàn giao vào:
            <span className="eta-highlight">{eta || "N/A"}</span>
          </p>
          <p className="penalty-clause">
            <FiInfo className="info-icon" />
            Mọi sự chậm trễ ngoài điều kiện bất khả kháng sẽ được tự động bồi
            hoàn phí vận chuyển trực tiếp vào ví điện tử của bạn.
          </p>
        </div>

        <div className="contract-footer">
          <div className="security-lock">
            <FiLock size={12} />
            <span>End-to-End Encrypted</span>
          </div>
          <div className="contract-id">VERIFY_ID: 88-X-0922</div>
        </div>
      </div>

      {/* Trang trí họa tiết kỹ thuật */}
      <div className="tech-accents">
        <div className="line-y" />
        <div className="dots-x" />
      </div>
    </motion.div>
  );
};

export default ContractMoment;
