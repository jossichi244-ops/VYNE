import React from "react";
import { FiMapPin, FiBox, FiFilter } from "react-icons/fi";
import "./DispatchQueue.scss";

const DispatchQueue = ({ orders = [], selectedIds = [], onToggleOrder }) => {
  // Hàm giả lập check trạng thái selected
  const isSelected = (id) => selectedIds.includes(id);

  return (
    <div className="dq-wrapper">
      {/* Mini Toolbar: Stats & Filter */}
      <div className="dq-toolbar">
        <div className="dq-stat">
          <span className="label">READY</span>
          <span className="value">{orders.length}</span>
        </div>
        <button className="dq-filter-btn">
          <FiFilter /> Filter
        </button>
      </div>

      {/* Main Queue List */}
      <div className="dq-list-container">
        <ul className="dq-list">
          {orders.map((order) => (
            <li
              key={order.id}
              className={`dq-item ${isSelected(order.id) ? "is-selected" : ""}`}
              onClick={() => onToggleOrder && onToggleOrder(order.id)}>
              {/* Left: Status Line & Checkbox */}
              <div
                className="dq-item__status-line"
                data-status={order.status}
              />

              <div className="dq-item__checkbox">
                <input
                  type="checkbox"
                  checked={isSelected(order.id)}
                  readOnly
                  className="hidden-checkbox"
                />
                <span className="custom-check-box" />
              </div>

              {/* Center: Order Info */}
              <div className="dq-item__info">
                <div className="dq-item__id">
                  <FiBox className="icon-tiny" />
                  <span>{order.id}</span>
                </div>
                <div className="dq-item__route">
                  <FiMapPin className="icon-tiny muted" />
                  <span className="text-truncate">{order.route}</span>
                </div>
              </div>

              {/* Right: Meta (Carrier) */}
              <div className="dq-item__meta">
                <span className="dq-tag carrier-tag">{order.carrier}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DispatchQueue;
