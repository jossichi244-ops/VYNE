// File: src/components/OrdersList.jsx - Phiên bản Table View

import React from "react";
import "./OrdersList.scss"; // Vẫn sử dụng SCSS

// Helper để format wallet (chỉ lấy 6 ký tự đầu và 4 ký tự cuối)
const formatWallet = (wallet) =>
  wallet ? `${wallet.substring(0, 6)}...${wallet.slice(-4)}` : "—";

// Hàm tiện ích lấy thông tin chi phí/thời gian
const getOrderDetails = (order) => {
  if (order.is_matched && order.selected_recommendation) {
    return {
      price: order.selected_recommendation.estimated_price_usd,
      source: "🤖 Auto",
    };
  }
  if (!order.is_matched && order.manual_selection) {
    return {
      price: order.manual_selection.price_usd,
      source: "✍️ Manual",
    };
  }
  return { price: null, source: "N/A" };
};

// Định dạng ngày
const formatDateTime = (dateString) => {
  if (!dateString) return "...";
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Biểu tượng trạng thái đơn
const StatusIcon = ({ status }) => {
  if (!status) status = "unknown";

  let icon = "📦";
  let className = "status-unknown";
  let text = status.toUpperCase().replace("_", " ");

  switch (status.toLowerCase()) {
    case "pending_payment":
      icon = "💰";
      className = "status-pending-payment";
      break;
    case "paid":
      icon = "🛡️";
      className = "status-paid";
      break;
    case "in_transit":
      icon = "🚚";
      className = "status-in-transit";
      break;
    case "delivered":
      icon = "✅";
      className = "status-delivered";
      break;
    case "completed":
      icon = "⭐";
      className = "status-completed";
      break;
    case "disputed":
      icon = "🚨";
      className = "status-disputed";
      break;
    case "cancelled":
      icon = "❌";
      className = "status-cancelled";
      break;
    default:
      icon = "❓";
      className = "status-unknown";
  }

  return (
    <span className={`order-status ${className}`} title={text}>
      {icon} {text}
    </span>
  );
};

const OrdersList = ({ orders, onSelectOrder }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="web3-table-container">
        <p className="empty-message">
          ⚠️ Chưa tìm thấy giao dịch nào trong sổ cái.
        </p>
      </div>
    );
  }

  return (
    <div className="web3-table-container">
      <h2 className="list-title">
        <span className="glow-text">📊 Sổ Cái Giao Dịch Web3</span>
        <span className="order-count">({orders.length} Đơn vị)</span>
      </h2>

      <div className="table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>REF/ID</th>
              <th className="hide-on-mobile">Khách hàng (From)</th>
              <th className="hide-on-mobile">Vận chuyển (To)</th>
              <th>Chi phí (USD)</th>
              <th>Trạng thái</th>
              <th className="hide-on-tablet">Nguồn</th>
              <th>Tạo lúc</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const details = getOrderDetails(order);
              const customerWallet = order.from_wallet || "";
              const carrierWallet = order.to_wallet || "";

              return (
                <tr
                  key={order._id}
                  onClick={() => onSelectOrder(order._id)}
                  className={order.is_matched ? "is-matched" : "is-manual"}>
                  <td className="order-ref-cell">{order.order_ref || "—"}</td>
                  <td className="hide-on-mobile">
                    {formatWallet(customerWallet)}
                  </td>
                  <td className="hide-on-mobile">
                    {carrierWallet
                      ? formatWallet(carrierWallet)
                      : "Chưa gán 🔒"}
                  </td>
                  <td className="price-cell">
                    {details.price != null
                      ? `$${details.price.toFixed(2)}`
                      : "—"}
                  </td>
                  <td className="status-cell">
                    <StatusIcon status={order.status} />
                  </td>
                  <td className="source-cell hide-on-tablet">
                    {details.source}
                  </td>
                  <td>
                    <span className="date-time-compact">
                      {formatDateTime(order.created_at)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersList;
