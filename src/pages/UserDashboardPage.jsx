import React, { useEffect, useState } from "react";
import UserDashboardTable from "../components/UserProfile/UserDashboardTable";
import { fetchAllUsers } from "../services/user";
import OrdersList from "./OrdersList";

import OrderDetailWeb3 from "./OrderDetail";
import { getAllOrders } from "../services/orderService";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import styles from ".././assets/styles/UserDashboardPage.scss";
const UserDashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        // Giả định fetchAllUsers trả về dữ liệu (mocking)
        const data = await fetchAllUsers();
        setUsers(data);
      } catch (err) {
        setError("Không thể tải danh sách người dùng.");
        console.error("Lỗi tải người dùng:", err);
      } finally {
        // Chỉ đặt loading = false sau khi cả users và orders đều tải xong,
        // nhưng tôi sẽ tách biệt để xử lý lỗi dễ dàng hơn.
      }
    };
    loadUsers();
  }, []);

  // Load orders
  useEffect(() => {
    const loadOrders = async () => {
      try {
        // Giả định getAllOrders trả về dữ liệu (mocking)
        const data = await getAllOrders();
        setOrders(data);
      } catch (err) {
        console.error("❌ Lỗi khi tải danh sách đơn hàng:", err);
      } finally {
        // Đây là điểm đặt loading chung khi cả 2 request đã chạy xong
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  if (loading)
    return (
      <div className={styles.loadingState}>
        <RefreshCw className={styles.loadingIcon} /> Đang đồng bộ hóa dữ liệu
        On-Chain...
      </div>
    );
  if (error)
    return (
      <div className={styles.errorState}>
        <AlertTriangle className={styles.errorIcon} /> {error}
      </div>
    );

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1 className={styles.h1}>Decentralized Logistics Dashboard</h1>
        <p className={styles.subtext}>
          Tổng quan về người dùng và các giao dịch hợp đồng thông minh.
        </p>
      </header>

      <div className={styles.contentGrid}>
        {/* Users Table */}
        <div className={styles.userSection}>
          <div className={`${styles.glassCard} ${styles.usersCard}`}>
            <h2 className={styles.cardHeader}>User Registry</h2>
            <UserDashboardTable usersData={users} />
          </div>
        </div>

        {/* Orders List / Detail */}
        <div className={styles.orderSection}>
          <div className={`${styles.glassCard} ${styles.ordersCard}`}>
            {!selectedOrderId ? (
              <>
                <h2 className={styles.cardHeader}>
                  Order Contracts List ({orders.length})
                </h2>
                <OrdersList
                  orders={orders}
                  onSelectOrder={(id) => setSelectedOrderId(id)}
                />
              </>
            ) : (
              // Order Detail View
              <div className={styles.detailView}>
                <button
                  onClick={() => setSelectedOrderId(null)}
                  className={styles.backButton}
                  title="Quay lại danh sách đơn hàng">
                  <ArrowLeft size={20} />{" "}
                  <span className={styles.backText}>Quay lại</span>
                </button>
                {/* Sử dụng component Web3 đã tái thiết kế */}
                <OrderDetailWeb3 orderId={selectedOrderId} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
