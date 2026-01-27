import React from "react";
import { FiAlertTriangle, FiCheck, FiMapPin, FiClock } from "react-icons/fi";
import "./LogisticsTimeline.scss";

const LogisticsTimeline = ({ data, logic }) => {
  const milestones = data.milestones || [
    { name: "Pickup Success", time: "08:30 AM", completed: true },
    { name: "Arrived at Port", time: "14:20 PM", completed: true },
    { name: "Customs Clearance", time: "16:45 PM", completed: false },
    { name: "Final Delivery", time: null, completed: false },
  ];

  return (
    <div className={`tl-wrapper ${logic.isStuck ? "is-stuck-mode" : ""}`}>
      {/* 1. Header: Live Status & Warning */}
      <div className="tl-header">
        <div className="tl-status">
          <div className="pulse-container">
            <div className="pulse-ring"></div>
            <div className="pulse-dot"></div>
          </div>
          <span className="status-text">
            {data.currentStatus || "IN-TRANSIT"}
          </span>
        </div>

        {logic.isStuck && (
          <div className="tl-alert">
            <FiAlertTriangle className="alert-icon" />
            <div className="alert-meta">
              <span className="alert-label">STUCK DURATION</span>
              <span className="alert-val">{logic.stuckDuration}H</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Vertical Steps */}
      <div className="tl-body">
        {milestones.map((step, index) => {
          const isCurrent =
            !step.completed && (index === 0 || milestones[index - 1].completed);

          return (
            <div
              key={index}
              className={`tl-item ${step.completed ? "is-done" : ""} ${isCurrent ? "is-active" : ""}`}>
              {/* Timeline Spine */}
              <div className="tl-spine">
                <div className="tl-node">
                  {step.completed ? (
                    <FiCheck />
                  ) : isCurrent ? (
                    <FiMapPin />
                  ) : (
                    <FiClock />
                  )}
                </div>
                {index !== milestones.length - 1 && (
                  <div className="tl-line"></div>
                )}
              </div>

              {/* Content */}
              <div className="tl-content">
                <div className="tl-main-info">
                  <p className="tl-name">{step.name}</p>
                  <span className="tl-time">{step.time || "PENDING"}</span>
                </div>
                {isCurrent && <div className="tl-active-bar"></div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LogisticsTimeline;
