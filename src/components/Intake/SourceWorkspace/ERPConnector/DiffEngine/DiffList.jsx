import React, { useState, useMemo } from "react";
import DiffRow from "./DiffRow";
import {
  FiSearch,
  FiAlertOctagon,
  FiAlertTriangle,
  FiList,
  FiDollarSign,
  FiShield,
} from "react-icons/fi";
import "./DiffList.scss";

const DiffList = ({ data, onResolve }) => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  /* ===============================
   * 1. FILTER + SEARCH + RISK LOGIC
   * =============================== */
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const searchLower = searchTerm.toLowerCase();

      const matchesSearch =
        item.id?.toString().toLowerCase().includes(searchLower) ||
        item.seal?.toLowerCase().includes(searchLower) ||
        item.bookingNo?.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      switch (filter) {
        case "critical":
          return item.riskLevel === "critical";
        case "mismatch":
          return item.status !== "match";
        case "financial":
          return item.estimatedCostImpact > 0;
        case "customs":
          return item.blockingCustoms === true;
        default:
          return true;
      }
    });
  }, [data, filter, searchTerm]);

  /* ===============================
   * 2. COUNTERS & COST AGGREGATION
   * =============================== */
  const stats = useMemo(() => {
    return {
      all: data.length,
      mismatch: data.filter((i) => i.status !== "match").length,
      critical: data.filter((i) => i.riskLevel === "critical").length,
      financial: data.filter((i) => i.estimatedCostImpact > 0).length,
      customs: data.filter((i) => i.blockingCustoms).length,
      totalExposure: data.reduce(
        (sum, i) => sum + (i.estimatedCostImpact || 0),
        0,
      ),
    };
  }, [data]);

  return (
    <div className="dl-wrapper">
      {/* ================= HEADER ================= */}
      <div className="dl-toolbar">
        {/* Search */}
        <div className="dl-search-module">
          <div className="search-icon-box">
            <FiSearch />
          </div>
          <input
            type="text"
            placeholder="Search Shipment ID, Booking, Seal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* FILTER TABS */}
        <div className="dl-filter-tabs">
          <button
            className={`tab-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}>
            <FiList />
            ALL
            <span className="badge">{stats.all}</span>
          </button>

          <button
            className={`tab-btn warning ${
              filter === "mismatch" ? "active" : ""
            }`}
            onClick={() => setFilter("mismatch")}>
            <FiAlertTriangle />
            CONFLICTS
            <span className="badge">{stats.mismatch}</span>
          </button>

          <button
            className={`tab-btn danger ${
              filter === "critical" ? "active" : ""
            }`}
            onClick={() => setFilter("critical")}>
            <FiAlertOctagon />
            CRITICAL
            <span className="badge">{stats.critical}</span>
          </button>

          <button
            className={`tab-btn money ${
              filter === "financial" ? "active" : ""
            }`}
            onClick={() => setFilter("financial")}>
            <FiDollarSign />
            FINANCIAL
            <span className="badge">{stats.financial}</span>
          </button>

          <button
            className={`tab-btn customs ${
              filter === "customs" ? "active" : ""
            }`}
            onClick={() => setFilter("customs")}>
            <FiShield />
            CUSTOMS
            <span className="badge">{stats.customs}</span>
          </button>
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div className="dl-viewport">
        {filteredData.length > 0 ? (
          <div className="dl-grid">
            {filteredData.map((item) => (
              <DiffRow key={item.id} item={item} onResolve={onResolve} />
            ))}
          </div>
        ) : (
          <div className="dl-empty-state">
            <span>NO MATCHING RECORDS</span>
          </div>
        )}
      </div>

      {/* ================= FOOTER ================= */}
      <div className="dl-footer">
        <span>Showing {filteredData.length} shipments</span>
        <span className="exposure">
          💰 Estimated Exposure:{" "}
          <strong>${stats.totalExposure.toLocaleString()}</strong>
        </span>
        <span>Last Sync: 2 mins ago</span>
      </div>
    </div>
  );
};

export default DiffList;
