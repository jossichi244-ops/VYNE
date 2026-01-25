import React from "react";
import { FiChevronRight, FiNavigation, FiClock } from "react-icons/fi";
import { motion } from "framer-motion";
import "./RouteTimeline.scss";

const RouteTimeline = ({
  stops = [
    { name: "Kho Tổng", eta: "08:00", status: "completed" },
    { name: "Hub Trung Chuyển", eta: "13:30", status: "current" },
    { name: "Điểm Giao", eta: "17:00", status: "pending" },
  ],
}) => {
  return (
    <div className="route-nav-container">
      <div className="header-nav">
        <FiNavigation className="nav-icon" />
        <span className="label">ACTIVE_ROUTE_PROJECTION</span>
      </div>

      <div className="timeline-stream">
        {stops.map((stop, index) => (
          <React.Fragment key={index}>
            <div className={`waypoint-node ${stop.status}`}>
              <div className="node-outer">
                <div className="node-inner">
                  {stop.status === "current" ? (
                    <motion.div
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="pulse-core"
                    />
                  ) : (
                    <span className="index">0{index + 1}</span>
                  )}
                </div>
              </div>

              <div className="node-info">
                <p className="stop-name">{stop.name}</p>
                <div className="eta-badge">
                  <FiClock size={8} />
                  <span>{stop.eta}</span>
                </div>
              </div>
            </div>

            {index < stops.length - 1 && (
              <div className="connector-path">
                <div
                  className={`line-fill ${stops[index + 1].status !== "pending" ? "active" : ""}`}></div>
                <FiChevronRight className="path-arrow" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="timeline-footer">
        <div className="distance-trace"></div>
        <span>TOTAL_ESTIMATED_TIME: 9H 00M</span>
      </div>
    </div>
  );
};

export default RouteTimeline;
