// src/components/OrderList.jsx
import React from "react";
import moment from "moment";
import styles from "../../assets/styles/OrderList.module.scss";

const OrderList = ({ orders = [], pagination = {}, onPaginationChange }) => {
  // --- Destructure pagination với giá trị mặc định ---
  const {
    page = 1,
    sortField = "created_at",
    sortOrder = "desc",
    statusFilter = "",
    totalPages = 1,
    totalItems = orders.length,
    limit = 10,
  } = pagination;

  // --- Event handlers ---
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      onPaginationChange({ newPage });
    }
  };

  const handleSortChange = (field) => {
    const newOrder =
      field === sortField && sortOrder === "desc" ? "asc" : "desc";
    onPaginationChange({ newPage: 1, newSort: field, newOrder });
  };

  const handleStatusFilterChange = (e) => {
    onPaginationChange({ newPage: 1, newStatus: e.target.value });
  };

  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortOrder === "asc" ? "▲" : "▼";
    }
    return "";
  };

  // --- Render ---
  return (
    <div className={styles.orderList}>
      <div className={styles.header}>
        <h3>🗄️ Nhật ký giao dịch</h3>
        <div className={styles.filters}>
          <label htmlFor="status-filter">Trạng thái:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={handleStatusFilterChange}>
            <option value="">-- Tất cả --</option>
            <option value="pending">Đang chờ</option>
            <option value="in-transit">Đang xử lý</option>
            <option value="completed">Hoàn thành</option>
            <option value="failed">Thất bại</option>
          </select>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.orderTable}>
          <thead>
            <tr>
              <th onClick={() => handleSortChange("created_at")}>
                Thời gian tạo {getSortIcon("created_at")}
              </th>
              <th>Từ ví</th>
              <th>Đến ví</th>
              <th onClick={() => handleSortChange("status")}>
                Trạng thái {getSortIcon("status")}
              </th>
              <th onClick={() => handleSortChange("balance")}>
                Giá trị {getSortIcon("balance")}
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{moment(order.created_at).format("DD/MM/YYYY HH:mm")}</td>
                  <td title={order.from_wallet} className={styles.wallet}>
                    {order.from_wallet?.slice(0, 6)}...
                    {order.from_wallet?.slice(-4)}
                  </td>
                  <td title={order.to_wallet} className={styles.wallet}>
                    {order.to_wallet?.slice(0, 6)}...
                    {order.to_wallet?.slice(-4)}
                  </td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        styles[
                          `status-${order.status
                            ?.toLowerCase()
                            .replace(/ /g, "-")}`
                        ]
                      }`}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ color: "#0f0" }}>{order.balance || 0} USD</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className={styles.emptyRow}>
                  Không tìm thấy giao dịch nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Pagination Binance style --- */}
      <div className={styles.pagination}>
        <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
          « Trang trước
        </button>
        <span>
          Trang {page}/{totalPages} ({totalItems} mục, {limit} / trang)
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}>
          Trang sau »
        </button>
      </div>
    </div>
  );
};

export default OrderList;
