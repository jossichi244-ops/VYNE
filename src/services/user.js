// src/utils/fetchUserProfile.js
import { API_BASE } from "../constants/api";
import { getWalletAddress, getToken } from "../store/storage";
import axios from "axios";

/**
 * 📡 Lấy thông tin cá nhân user dựa vào wallet_address trong localStorage
 */
export const fetchUserProfile = async () => {
  const walletAddress = getWalletAddress();
  console.log("📜 walletAddress từ localStorage:", walletAddress);
  if (!walletAddress)
    throw new Error("Không tìm thấy wallet trong localStorage!");

  try {
    const token = getToken();
    const res = await axios.get(`${API_BASE}/api/auth/user/${walletAddress}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data.user; // { wallet_address, created_at, ... }
  } catch (err) {
    console.error("❌ Lỗi khi tải thông tin user:", err);
    throw err;
  }
};
export const fetchAllUsers = async () => {
  try {
    const token = getToken();
    const res = await axios.get(`${API_BASE}/api/auth/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("📡 API response:", res.data);
    return res.data.users;
  } catch (err) {
    console.error("❌ Lỗi khi tải danh sách users:", err);
    throw err;
  }
};
