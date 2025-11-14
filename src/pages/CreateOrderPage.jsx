// File: src/pages/CreateOrderPage_Web3.jsx (Cập nhật)

import React from "react";
import TransportOrderForm from "../components/TransportOrderForm.jsx";
import { getToken, getWalletAddress } from "../store/storage";
import "./CreateOrderPage.scss"; // 💡 Import SCSS mới

const CreateOrderPage = () => {
  const token = getToken();
  const wallet = getWalletAddress();

  if (!token || !wallet) {
    return (
      <div className="auth-required-message">
        ⚠️ Bạn chưa đăng nhập hoặc chưa kết nối ví Web3. Vui lòng kết nối để tạo
        đơn.{" "}
      </div>
    );
  }

  return (
    <div className="create-order-container">
      {" "}
      <h1 className="page-header-title">
        <span className="neon-glow-text">✨ Mở Hợp Đồng Vận Chuyển Mới</span>
      </h1>{" "}
      <div className="form-wrapper-card">
        <TransportOrderForm token={token} senderWallet={wallet} />{" "}
      </div>{" "}
    </div>
  );
};

export default CreateOrderPage;
