import React from "react";
import { FiHexagon, FiMaximize2 } from "react-icons/fi";
import "./SectionCard.scss";

const SectionCard = ({ title, children, status = "Live" }) => {
  return (
    <div className="section-card">
      <div className="card-header">
        <div className="header-left">
          <FiHexagon className="header-icon" />
          <h3>{title}</h3>
        </div>
        <div className="header-right">
          <span className="status-tag">{status}</span>
          <button className="expand-btn">
            <FiMaximize2 />
          </button>
        </div>
      </div>
      <div className="card-content">{children}</div>
    </div>
  );
};

export default SectionCard;
