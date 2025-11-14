import React from "react";
import TransportOrderForm from "../components/TransportOrderForm.jsx";
import { getToken, getWalletAddress } from "../store/storage";

const CreateOrderPage = () => {
  const token = getToken();
  const wallet = getWalletAddress();

  if (!token || !wallet) {
    return (
      <div className="p-4 text-red-600 font-semibold">
        Bạn chưa đăng nhập hoặc chưa kết nối ví Web3.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tạo Đơn Vận Chuyển</h1>

      <TransportOrderForm token={token} senderWallet={wallet} />
    </div>
  );
};

export default CreateOrderPage;
