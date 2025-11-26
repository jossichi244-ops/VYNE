// src/components/OrderList.js

import React from "react";
import moment from "moment";
import styles from "../../assets/styles/OrderList.module.scss";
const OrderList = ({ orders = [], pagination = {}, onPaginationChange }) => {
  // Thêm giá trị mặc định an toàn để tránh lỗi destructure
  const {
    page = 1,
    limit = 10,
    sortField = "created_at",
    sortOrder = "desc",
    statusFilter = "",
    totalPages = 1,
    totalItems = orders.length,
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
      return sortOrder === "asc" ? " \u25B2" : " \u25BC"; // ▲ hoặc ▼
    }
    return "";
  };

  // --- Render ---
  return (
    <div className={styles["order-list-container"]}>
      <div className={styles.controls}>
        <h3>🗄️ Nhật Ký Giao Dịch</h3>
        <div className={styles["filter-group"]}>
          <label htmlFor="status-filter">Lọc Trạng thái:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={handleStatusFilterChange}>
            <option value="">-- Tất cả --</option>
            <option value="pending">Đang chờ (Pending)</option>
            <option value="in-transit">Đang Xử lý (Processing)</option>
            <option value="completed">Hoàn thành (Completed)</option>
            <option value="failed">Thất bại (Failed)</option>
          </select>
        </div>
      </div>

      {/* Responsive Table Wrapper */}
      <div className={styles["table-wrapper"]}>
        <table className={styles["order-table"]}>
          <thead>
            <tr>
              <th
                onClick={() => handleSortChange("created_at")}
                className={
                  sortField === "created_at"
                    ? styles[`sorted-${sortOrder}`]
                    : ""
                }>
                Thời gian tạo {getSortIcon("created_at")}
              </th>
              <th>Từ Ví</th>
              <th>Đến Ví</th>
              <th>Trạng thái {getSortIcon("status")}</th>
              <th
                onClick={() => handleSortChange("balance")}
                className={
                  sortField === "balance" ? styles[`sorted-${sortOrder}`] : ""
                }>
                Giá trị {getSortIcon("balance")}
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{moment(order.created_at).format("DD/MM/YYYY HH:mm")}</td>
                  <td
                    className={styles["wallet-address"]}
                    title={order.from_wallet}>
                    {order.from_wallet?.substring(0, 6)}...
                    {order.from_wallet?.substring(order.from_wallet.length - 4)}
                  </td>
                  <td
                    className={styles["wallet-address"]}
                    title={order.to_wallet}>
                    {order.to_wallet?.substring(0, 6)}...
                    {order.to_wallet?.substring(order.to_wallet.length - 4)}
                  </td>
                  <td>
                    <span
                      className={`${styles["status-badge"]} ${
                        styles[
                          `status-${order.status
                            ?.toLowerCase()
                            .replace(/ /g, "-")}`
                        ]
                      }`}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ color: "#0f0" }}>{order.balance} USD</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className={styles["empty-row"]}>
                  Không tìm thấy giao dịch nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={styles["pagination-controls"]}>
        <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
          « Trang trước
        </button>

        <span>
          Phạm vi: {page}/{totalPages} ({totalItems} mục)
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