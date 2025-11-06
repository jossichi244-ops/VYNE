// src/pages/UserProfilePage.jsx
import React, { useEffect, useState } from "react";
import UserProfile from "../components/UserProfile/UserProfile";
import { fetchUserProfile } from "../services/user";

const UserProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        const user = await fetchUserProfile();
        console.log("✅ User profile loaded:", user);
        setUserData({
          walletAddress: user.wallet_address,
          balance: user.balance,
          transactions: user.transactions,
          joined: user.created_at
            ? new Date(user.created_at).toLocaleDateString()
            : "N/A",
        });
      } catch (err) {
        console.error("❌ Lỗi khi tải user:", err);
        setError("Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="error">{error}</div>;

  return <UserProfile userData={userData} />;
};

export default UserProfilePage;
