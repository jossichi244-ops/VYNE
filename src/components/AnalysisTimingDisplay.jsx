import React from "react";
import PropTypes from "prop-types";

import "../assets/styles/AnalysisSummaryDisplay.scss";

import { FiZap, FiLogIn, FiLogOut, FiFile, FiGrid } from "react-icons/fi";

const formatTime = (isoString) => {
  if (!isoString) return "N/A";
  return (
    new Date(isoString).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "UTC",
    }) + " UTC"
  );
};

const StatCard = ({ icon, value, label, className }) => {
  if (!value && value !== 0) return null;
  return (
    <div className={`stat-card ${className || ""}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <p className="stat-value">{value}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
};

StatCard.propTypes = {
  icon: PropTypes.node.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
};

const formatDuration = (seconds) => {
  if (typeof seconds !== "number" || isNaN(seconds)) return "N/A";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
};

const AnalysisSummaryDisplay = ({ timing, metadata }) => {
  if (!timing && !metadata) {
    return null;
  }

  const totalSeconds = timing?.total_seconds;
  const formattedTotalTime =
    typeof totalSeconds === "number" ? formatDuration(totalSeconds) : null;

  const formattedReceived = timing?.time_receive_data
    ? formatTime(timing.time_receive_data)
    : null;
  const formattedDone = timing?.time_done_analysis
    ? formatTime(timing.time_done_analysis)
    : null;

  const fileSize = metadata?.original_file_size_mb;
  const formattedFileSize =
    typeof fileSize === "number" ? `${fileSize.toFixed(2)} MB` : null;
  const finalShape = metadata?.final_shape;
  const formattedShape = Array.isArray(finalShape)
    ? `${finalShape[0].toLocaleString()} rows × ${finalShape[1]} cols`
    : null;

  return (
    <div className="analysis-summary-container">
      <div className="summary-header">
        <h3 className="summary-title">Timeline</h3>
      </div>
      <div className="stats-grid">
        <StatCard
          icon={<FiZap />}
          value={formattedTotalTime}
          label="Total Analysis Time"
          className="highlight"
        />
        <StatCard
          icon={<FiFile />}
          value={formattedFileSize}
          label="Original File Size"
        />
        <StatCard
          icon={<FiGrid />}
          value={formattedShape}
          label="Final Data Shape"
        />
        <StatCard
          icon={<FiLogIn />}
          value={formattedReceived}
          label="Received (UTC)"
        />
        <StatCard
          icon={<FiLogOut />}
          value={formattedDone}
          label="Completed (UTC)"
        />
      </div>
    </div>
  );
};

AnalysisSummaryDisplay.propTypes = {
  timing: PropTypes.shape({
    total_seconds: PropTypes.number,
    time_receive_data: PropTypes.string,
    time_done_analysis: PropTypes.string,
  }),
  metadata: PropTypes.shape({
    original_file_size_mb: PropTypes.number,
    final_shape: PropTypes.arrayOf(PropTypes.number),
  }),
};

export default AnalysisSummaryDisplay;
