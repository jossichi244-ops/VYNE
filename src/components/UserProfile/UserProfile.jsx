import React from "react";
import moment from "moment";
import {
  FaWallet,
  FaUserCog,
  FaCoins,
  FaExchangeAlt,
  FaCalendarAlt,
  FaSignInAlt,
  FaRedoAlt,
} from "react-icons/fa"; // Cần cài đặt react-icons: npm install react-icons
import "../../assets/styles/UserInfoCard.scss";
const UserInfoCard = ({ user }) => {
  if (!user || Object.keys(user).length === 0) {
    return (
      <div className="user-info-card-container fallback">
        <div className="card-content">
          <p className="loading-text">Đang chờ dữ liệu người dùng...</p>
        </div>
      </div>
    );
  }

  // Định dạng thời gian
  const formatDate = (dateString) => {
    return dateString ? moment(dateString).format("HH:mm DD/MM/YYYY") : "N/A";
  };

  // Định dạng số dư
  const formatBalance = (balance) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(balance);
  };

  return (
    <div className="user-info-card-container">
      <div className="card-content">
        <div className="info-grid">
          <div className="info-item">
            <FaWallet className="info-icon" />
            <span className="info-label">Địa chỉ Ví:</span>
            <span
              className="info-value wallet-address"
              title={user.walletAddress}>
              {user.walletAddress
                ? `${user.walletAddress.substring(
                    0,
                    8
                  )}...${user.walletAddress.substring(
                    user.walletAddress.length - 6
                  )}`
                : "N/A"}
            </span>
          </div>

          <div className="info-item">
            <FaUserCog className="info-icon" />
            <span className="info-label">Vai trò:</span>
            <span className="info-value">
              {(user.roles && user.roles.join(", ")) || "Người dùng"}
            </span>
          </div>

          <div className="info-item">
            <FaCoins className="info-icon" />
            <span className="info-label">Số dư:</span>
            <span className="info-value balance-value">
              {formatBalance(user.balance ?? 0)}
            </span>
          </div>

          <div className="info-item">
            <FaExchangeAlt className="info-icon" />
            <span className="info-label">Giao dịch thành công:</span>
            <span className="info-value">{user.transactions ?? 0}</span>
          </div>

          <div className="info-item">
            <FaCalendarAlt className="info-icon" />
            <span className="info-label">Ngày tham gia:</span>
            <span className="info-value">{formatDate(user.createdAt)}</span>
          </div>

          <div className="info-item">
            <FaSignInAlt className="info-icon" />
            <span className="info-label">Đăng nhập cuối:</span>
            <span className="info-value">{formatDate(user.lastLoginAt)}</span>
          </div>

          <div className="info-item">
            <FaRedoAlt className="info-icon" />
            <span className="info-label">Cập nhật cuối:</span>
            <span className="info-value">{formatDate(user.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;
