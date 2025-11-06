import React, { useState, useContext } from "react";
import "../../styles/userProfile.scss";
import VNeIDVerifyModal from "../VNeIDVerifyModal/VNeIDVerifyModal";
import VerifyAppointment from "../verifyAppointment";
import { AuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const UserProfile = ({ userData: initialUserData }) => {
  const [userData, setUserData] = useState(initialUserData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [flowStep, setFlowStep] = useState("identity"); // "identity" | "appointment" | "done"

  const { wallet: currentWalletAddress } = useContext(AuthContext);

  if (!userData) {
    return <div className="loading">Đang tải thông tin người dùng...</div>;
  }

  const handleVerifySuccess = (updatedUser) => {
    setUserData(updatedUser);
    setIsModalOpen(false);

    // Nếu user được xác minh danh tính thành công, mở giai đoạn kế tiếp
    setTimeout(() => {
      setIsAppointmentOpen(true);
      setFlowStep("appointment");
    }, 600);
  };

  const handleAppointmentSuccess = (updatedUser) => {
    setUserData(updatedUser);
    setIsAppointmentOpen(false);
    setFlowStep("done");
  };

  const isVerified =
    userData.roles && Array.isArray(userData.roles)
      ? userData.roles.includes("individual")
      : false;

  const isAppointed =
    userData.roles && Array.isArray(userData.roles)
      ? userData.roles.includes("owner")
      : false;

  return (
    <div className="cyber-profile-card">
      <div className="profile-header">
        <div className="avatar-container">
          <motion.img
            src={userData.avatarUrl || "/default-avatar.png"}
            alt="User Avatar"
            className="profile-avatar"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          />
        </div>

        {/* Nút hành động tuỳ theo flow */}
        <AnimatePresence mode="wait">
          {!isVerified && flowStep === "identity" && (
            <motion.button
              key="verify-id"
              className="action-button verify-identity-glow"
              onClick={() => setIsModalOpen(true)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}>
              Verify Identity (VNeID)
            </motion.button>
          )}

          {isVerified && !isAppointed && (
            <motion.button
              key="verify-appointment"
              className="action-button schedule-verify-glow"
              onClick={() => setIsAppointmentOpen(true)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}>
              Verify Appointment
            </motion.button>
          )}

          {isAppointed && (
            <motion.div
              key="verified"
              className="verified-status"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}>
              🎉 Đã xác minh bổ nhiệm thành công
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trạng thái xác minh */}
        <p
          className={`verification-status ${
            isVerified ? "verified" : "unverified"
          }`}>
          {isAppointed
            ? "👑 Owner Verified"
            : isVerified
            ? "✅ Identity Verified"
            : "⚠️ Unverified Identity"}
        </p>

        <div
          className="wallet-info"
          onClick={() =>
            navigator.clipboard.writeText(
              userData.walletAddress || currentWalletAddress || ""
            )
          }>
          <span className="wallet-address">
            {userData.walletAddress || currentWalletAddress || "Không rõ"}
          </span>
          <span className="copy-icon">📋</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="profile-metrics-grid">
        <div className="metric-item">
          <span className="metric-label">Token Balance</span>
          <span className="metric-value">{userData.balance || "0 ETH"}</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Transactions</span>
          <span className="metric-value">{userData.transactions || 0}</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Member Since</span>
          <span className="metric-value">
            {userData.joined || "Chưa xác định"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="profile-actions-bar">
        <button className="action-button primary-glow">Send</button>
        <button className="action-button secondary-glow">Swap</button>
        <button className="action-button tertiary-glow">Settings</button>
      </div>

      <div className="status-indicator">
        <span className="status-dot"></span>
        <span className="status-text">Connected to Mainnet</span>
      </div>

      {/* Modal xác minh danh tính */}
      <VNeIDVerifyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        walletAddress={userData.walletAddress || currentWalletAddress}
        onVerifySuccess={handleVerifySuccess}
      />

      {/* Modal đặt lịch xác minh bổ nhiệm */}
      <VerifyAppointment
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
        userData={userData}
        onVerifySuccess={handleAppointmentSuccess}
      />
    </div>
  );
};

export default UserProfile;
