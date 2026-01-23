import React from "react";
import { motion, LayoutGroup } from "framer-motion";
import {
  FiDatabase,
  FiFileText,
  FiMessageSquare,
  FiShoppingCart,
  FiActivity,
} from "react-icons/fi";
import "./SourceTabs.scss";

const tabs = [
  { id: "erp", label: "ERP API", icon: FiDatabase, color: "#00F0FF" },
  { id: "excel", label: "EXCEL", icon: FiFileText, color: "#10B981" },
  { id: "zalo", label: "ZALO/CHAT", icon: FiMessageSquare, color: "#3B82F6" },
  { id: "ecom", label: "E-COM", icon: FiShoppingCart, color: "#F59E0B" },
];

const SourceTabs = ({ activeTab, onTabChange }) => {
  return (
    <nav className="logistics-source-nav">
      <LayoutGroup>
        <div className="tabs-container">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`tab-item ${isActive ? "is-active" : ""}`}
                style={{ "--active-color": tab.color }}>
                <div className="tab-content">
                  <div className="icon-slot">
                    <Icon className="main-icon" />
                    {isActive && (
                      <motion.div
                        layoutId="icon-glow"
                        className="icon-glow-ring"
                      />
                    )}
                  </div>

                  <div className="label-group">
                    <span className="tab-label">{tab.label}</span>
                    <div className="active-indicator-text">
                      <FiActivity className="pulse-mini" />
                      <span>SOURCE LINKED</span>
                    </div>
                  </div>
                </div>

                {isActive && (
                  <motion.div
                    layoutId="tab-highlight"
                    className="tab-bg-highlight"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}>
                    <div className="shimmer-effect" />
                  </motion.div>
                )}

                <div className="bottom-border" />
              </button>
            );
          })}
        </div>
      </LayoutGroup>
    </nav>
  );
};

export default SourceTabs;
