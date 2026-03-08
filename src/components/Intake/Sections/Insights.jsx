import React from "react";
import "./insight.scss";
import { FiTrendingUp, FiAlertCircle, FiZap, FiInfo } from "react-icons/fi";

const Insights = ({ dataset }) => {
  const { insights } = dataset;

  // Hàm để render icon ngẫu nhiên hoặc dựa trên nội dung (tùy bạn cấu trúc data)
  const getIcon = (index) => {
    const icons = [<FiZap />, <FiTrendingUp />, <FiAlertCircle />, <FiInfo />];
    return icons[index % icons.length];
  };

  return (
    <div className="insights-container">
      <ul className="insights-list">
        {insights?.map((item, i) => (
          <li key={i} className="insight-item">
            <div className="insight-icon-wrapper">{getIcon(i)}</div>
            <div className="insight-content">
              <span className="insight-text">{item}</span>
              <div className="insight-scanline" /> {/* Hiệu ứng quét dòng */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Insights;
