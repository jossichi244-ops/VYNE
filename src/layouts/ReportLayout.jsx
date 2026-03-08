import React from "react";
import {
  FiDownload,
  FiShare2,
  FiFilter,
  FiClock,
  FiLayout,
  FiBox,
  FiTrendingUp,
  FiMaximize2,
} from "react-icons/fi";
import "./ReportLayout.scss";

const ReportLayout = ({
  children,
  title = "Supply Chain Analysis",
  timestamp = "Updated 2 mins ago",
  currentTemplate = "logistics",
  onTemplateChange,
}) => {
  const templates = [
    { id: "logistics", label: "Logistics", icon: <FiLayout /> },
    { id: "inventory", label: "Inventory", icon: <FiBox /> }, // Giả định có import FiBox
    { id: "procurement", label: "Procurement", icon: <FiTrendingUp /> },
  ];

  return (
    <div className="report-container">
      {/* 1. SMART TOOLBAR */}
      <nav className="report-toolbar">
        <div className="toolbar-left">
          {/* Thay thế Select bằng Segmented Control */}
          <div className="segmented-control">
            {templates.map((t) => (
              <button
                key={t.id}
                className={`segment-btn ${currentTemplate === t.id ? "active" : ""}`}
                onClick={() => onTemplateChange?.(t.id)}>
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          <span className="divider-v" />

          <div className="live-status">
            <div className="status-indicator">
              <span className="pulse-dot" />
              <span className="status-text">Live Sync</span>
            </div>
            <span className="timestamp">
              <FiClock /> {timestamp}
            </span>
          </div>
        </div>

        <div className="toolbar-right">
          <div className="action-group">
            <button className="btn-icon-text">
              <FiFilter /> <span>Filter</span>
            </button>
            <button className="btn-icon-text">
              <FiShare2 /> <span>Share</span>
            </button>
          </div>
          <button className="btn-primary-gradient">
            <FiDownload /> <span>Export Report</span>
          </button>
        </div>
      </nav>

      {/* 2. DYNAMIC CONTENT AREA */}
      <main className="report-content-canvas">
        <header className="content-header">
          <div className="title-block">
            <nav className="breadcrumb">Analytics / Supply Chain</nav>
            <h1>
              {title} <span className="badge">v2.4</span>
            </h1>
          </div>
          <div className="header-actions">
            <button className="btn-outline-sq" title="Expand">
              <FiMaximize2 />
            </button>
          </div>
        </header>

        <div className="content-grid-system">{children}</div>
      </main>
    </div>
  );
};

export default ReportLayout;
