import React from "react";
import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiArrowUpRight,
} from "react-icons/fi";
import "./CyberStats.scss";

const StatCard = ({ label, value, icon: Icon, color, trend }) => (
  <div className={`cyber-stat-card ${color}`}>
    {/* Hiệu ứng tia sáng chạy ngang card */}
    <div className="card-scanner"></div>

    <div className="card-body">
      <div className="icon-wrapper">
        <Icon className="main-icon" />
        <div className="icon-pulse"></div>
      </div>

      <div className="info-wrapper">
        <p className="stat-label">{label}</p>
        <div className="value-group">
          <h4 className="stat-value">{value}</h4>
          {trend && (
            <div className="trend-badge">
              <FiArrowUpRight size={10} />
              <span>{trend}</span>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Đường kẻ kĩ thuật trang trí bên dưới */}
    <div className="data-trace">
      <div className="trace-line"></div>
      <div className="trace-dot"></div>
    </div>
  </div>
);

const CyberStats = () => {
  const stats = [
    {
      label: "Cost Saving",
      value: "14.2M",
      icon: FiDollarSign,
      color: "emerald",
      trend: "+12%",
    },
    {
      label: "Avg SLA",
      value: "98.8%",
      icon: FiCheckCircle,
      color: "cyan",
      trend: "0.4%",
    },
    {
      label: "Fleet Utility",
      value: "82%",
      icon: FiTrendingUp,
      color: "indigo",
      trend: "+5.2%",
    },
    {
      label: "Lead Time",
      value: "24m",
      icon: FiClock,
      color: "amber",
      trend: "-2m",
    },
  ];

  return (
    <div className="cyber-stats-grid">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: i * 0.1,
          }}>
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
};

export default CyberStats;
