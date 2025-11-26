// src/utils/fetchUserProfile.js
import { API_BASE } from "../constants/api";
import { getWalletAddress, getToken } from "../store/storage";
import axios from "axios";

export const fetchUserProfile = async (queryParams = {}) => {
  const walletAddress = getWalletAddress();
  if (!walletAddress)
    throw new Error("Không tìm thấy wallet trong localStorage!");

  const token = getToken();

  try {
    const res = await axios.get(`${API_BASE}/api/auth/user/${walletAddress}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: queryParams, // page, limit, status, sort, order
    });

    console.log("📌 API fetchUserProfile() trả về:", res.data);

    // Trả về object chuẩn cho UI
    return {
      user: res.data.user || {},
      orders: res.data.orders || [], // danh sách đơn hàng
      stats: res.data.stats || {}, // thống kê tổng quan
      pagination: res.data.pagination || {
        page: queryParams.page || 1,
        limit: queryParams.limit || 10,
        totalItems: res.data.orders?.length || 0,
        totalPages: 1,
      },
    };
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
