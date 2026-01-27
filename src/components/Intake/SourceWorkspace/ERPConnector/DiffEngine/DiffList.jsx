import React, { useState, useMemo } from "react";
import DiffRow from "./DiffRow";
import {
  FiSearch,
  FiAlertOctagon,
  FiAlertTriangle,
  FiList,
} from "react-icons/fi";
import "./DiffList.scss"; // Dùng chung file SCSS hoặc tách ra DiffList.scss

const DiffList = ({ data, onResolve }) => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Tính toán Filter & Search
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Logic Search
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        item.id.toString().toLowerCase().includes(searchLower) ||
        (item.seal && item.seal.toLowerCase().includes(searchLower));

      if (!matchesSearch) return false;

      // Logic Filter Tab
      if (filter === "critical")
        return item.severity === "high" && item.status !== "match";
      if (filter === "mismatch") return item.status !== "match";
      return true;
    });
  }, [data, filter, searchTerm]);

  // 2. Tính toán số lượng cho Badges
  const counts = useMemo(() => {
    return {
      all: data.length,
      critical: data.filter(
        (i) => i.severity === "high" && i.status !== "match",
      ).length,
      mismatch: data.filter((i) => i.status !== "match").length,
    };
  }, [data]);

  return (
    <div className="dl-wrapper">
      {/* HEADER: TOOLBAR & CONTROLS */}
      <div className="dl-toolbar">
        {/* Search Input - Terminal Style */}
        <div className="dl-search-module">
          <div className="search-icon-box">
            <FiSearch />
          </div>
          <input
            type="text"
            placeholder="Search ID, Order Ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Tabs - Segmented Control Style */}
        <div className="dl-filter-tabs">
          <button
            className={`tab-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}>
            <FiList className="tab-icon" />
            <span>ALL</span>
            <span className="badge">{counts.all}</span>
          </button>

          <button
            className={`tab-btn warning ${filter === "mismatch" ? "active" : ""}`}
            onClick={() => setFilter("mismatch")}>
            <FiAlertTriangle className="tab-icon" />
            <span>CONFLICTS</span>
            {counts.mismatch > 0 && (
              <span className="badge">{counts.mismatch}</span>
            )}
          </button>

          <button
            className={`tab-btn danger ${filter === "critical" ? "active" : ""}`}
            onClick={() => setFilter("critical")}>
            <FiAlertOctagon className="tab-icon" />
            <span>CRITICAL</span>
            {counts.critical > 0 && (
              <span className="badge">{counts.critical}</span>
            )}
          </button>
        </div>
      </div>

      {/* BODY: SCROLLABLE LIST */}
      <div className="dl-viewport">
        {filteredData.length > 0 ? (
          <div className="dl-grid">
            {filteredData.map((item) => (
              <DiffRow key={item.id} item={item} onResolve={onResolve} />
            ))}
          </div>
        ) : (
          <div className="dl-empty-state">
            <span>NO RECORDS FOUND</span>
          </div>
        )}
      </div>

      {/* FOOTER: MINI STATS */}
      <div className="dl-footer">
        Showing {filteredData.length} records • System Synced: 2 mins ago
      </div>
    </div>
  );
};

export default DiffList;
