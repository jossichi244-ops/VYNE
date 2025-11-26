// src/pages/UserProfilePage.jsx
import React, { useState, useEffect, useCallback } from "react";
import UserInfoCard from "../components/UserProfile/UserProfile";
import OrderList from "../components/UserProfile/OrderList";
import { fetchUserProfile } from "../services/user";

function UserProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
    status: "",
    sort: "created_at",
    order: "desc",
  });

  const loadProfileData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchUserProfile(queryParams);
      console.log("📌 profileData chuẩn để UI dùng:", data);

      setProfileData(data);
    } catch (err) {
      console.error("❌ Lỗi khi tải hồ sơ:", err);
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const handlePaginationChange = ({
    newPage,
    newLimit,
    newStatus,
    newSort,
    newOrder,
  }) => {
    setQueryParams((prev) => ({
      ...prev,
      page: newPage ?? prev.page,
      limit: newLimit ?? prev.limit,
      status: newStatus ?? prev.status,
      sort: newSort ?? prev.sort,
      order: newOrder ?? prev.order,
    }));
  };

  if (loading) return <div>Đang tải hồ sơ và đơn hàng...</div>;
  if (!profileData) return <div>Không thể tải dữ liệu hồ sơ.</div>;

  const { user, orders, pagination } = profileData;

  return (
    <div className="user-profile-page">
      <h2> Hồ Sơ Người Dùng</h2>
      <UserInfoCard user={user} />

      <hr />

      <hr />

      <h2>Danh Sách Đơn Hàng</h2>
      <OrderList
        orders={orders}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
      />
    </div>
  );
}

export default UserProfilePage;
