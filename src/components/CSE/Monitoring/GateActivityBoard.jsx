import React from "react";
import { FiTruck, FiArrowRight, FiMapPin } from "react-icons/fi";
import "./GateActivityBoard.scss";

const GateActivityBoard = ({ activities = [] }) => {
  return (
    <div className="gate-activity-terminal">
      <div className="terminal-top">
        <div className="title-area">
          <div className="icon-pulse">
            <FiTruck className="truck-icon" />
          </div>
          <div className="text">
            <h3>GATE_ACTIVITY_FEED</h3>
            <div className="live-indicator">
              <span className="dot"></span>
              <span className="label">LIVE_CONNECT</span>
            </div>
          </div>
        </div>
        <div className="location-tag">
          <FiMapPin size={10} />
          <span>SGN_WH_A</span>
        </div>
      </div>

      <div className="activity-stream">
        {activities.map((act, index) => (
          <div key={index} className={`stream-item ${act.type.toLowerCase()}`}>
            <div className="time-col">
              <span className="time-code">{act.time}</span>
              <div className="flow-line"></div>
            </div>

            <div className="data-core">
              <div className="identity">
                <span className="plate-id">{act.plate}</span>
                <span className="carrier-code">{act.carrier}</span>
              </div>

              <div className={`status-node ${act.type}`}>
                <div className="node-glow"></div>
                <span className="type-label">{act.type}</span>
              </div>
            </div>

            <div className="action-visual">
              <FiArrowRight className={`arrow-anim ${act.type}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Footer trang trí mô phỏng luồng dữ liệu */}
      <div className="data-stream-footer">
        <div className="wave-bar"></div>
        <div className="wave-bar delay-1"></div>
        <div className="wave-bar delay-2"></div>
      </div>
    </div>
  );
};

export default GateActivityBoard;
