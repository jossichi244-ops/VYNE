import React from "react";
import { motion } from "framer-motion";
import { FiClock, FiMapPin, FiNavigation, FiCheckCircle } from "react-icons/fi";
import "./VisibilityTimeline.scss";

const VisibilityTimeline = ({ events = [] }) => {
  return (
    <div className="logi-timeline-shell">
      <header className="timeline-header">
        <div className="header-left">
          <FiNavigation className="nav-icon" />
          <h4>LIVE_VISIBILITY_LOG</h4>
        </div>
        <div className="status-indicator">RECORDING</div>
      </header>

      <div className="timeline-v-line"></div>

      <div className="nodes-wrapper">
        {events.map((event, index) => {
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`event-node ${event.isCurrent ? "current" : "past"}`}>
              <div className="node-marker">
                <div className="marker-core">
                  {event.isCurrent ? <FiClock /> : <FiCheckCircle />}
                </div>
                {event.isCurrent && <div className="marker-pulse"></div>}
              </div>

              <div className="node-info">
                <div className="time-stamp">{event.time}</div>
                <div className="desc-box">
                  <p className="main-desc">{event.desc}</p>
                  {event.location && (
                    <div className="loc-tag">
                      <FiMapPin size={10} />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default VisibilityTimeline;
