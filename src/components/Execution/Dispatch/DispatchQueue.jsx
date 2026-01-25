import React from "react";
import "./Execution.scss";

const DispatchQueue = ({ orders }) => {
  return (
    <div className="dispatch-queue">
      <h3 className="section-title">📦 LỆNH PHÁT HÀNG CHỜ (READY)</h3>
      <div className="queue-grid">
        {orders.map((order) => (
          <div key={order.id} className="neon-card queue-item">
            <div className="status-indicator" data-status={order.status}></div>
            <div className="order-info">
              <span className="id">#{order.id}</span>
              <span className="route">{order.route}</span>
            </div>
            <div className="carrier-tag">{order.carrier}</div>
            <input type="checkbox" className="custom-checkbox" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DispatchQueue;
