import React, { useEffect, useState } from "react";
import UserDashboardTable from "../components/UserProfile/UserDashboardTable";
import { fetchAllUsers } from "../services/user";

const UserDashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await fetchAllUsers();
        console.log("✅ Danh sách users:", data);
        setUsers(data);
      } catch (err) {
        setError("Không thể tải danh sách người dùng");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading)
    return <div className="loading">Đang tải danh sách users...</div>;
  if (error) return <div className="error">{error}</div>;

  return <UserDashboardTable usersData={users} />;
};

export default UserDashboardPage;
