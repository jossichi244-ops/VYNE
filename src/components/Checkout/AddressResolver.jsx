import React from "react";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiNavigation,
  FiAlertTriangle,
  FiClock,
  FiActivity,
} from "react-icons/fi";
import "./AddressResolver.scss";

const AddressResolver = ({ address }) => {
  return (
    <div className="address-resolver-card">
      {/* Header với hiệu ứng quét Radar */}
      <div className="card-header">
        <div className="header-left">
          <div className="geo-icon-box">
            <FiMapPin className="geo-icon" />
            <div className="pulse-ring"></div>
          </div>
          <div className="title-stack">
            <span className="eyebrow">Geospatial Intelligence</span>
            <h4 className="main-title">ADDRESS RESOLVER</h4>
          </div>
        </div>
        <div className="zone-tag">
          <FiActivity className="tag-icon" />
          <span>ZONE: HCMC_INTERNAL</span>
        </div>
      </div>

      {/* Input Section */}
      <div className="input-container">
        <div className="input-wrapper">
          <input
            type="text"
            defaultValue={address}
            className="geo-input"
            placeholder="Search delivery destination..."
          />
          <div className="input-actions">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="btn-locate">
              <FiNavigation />
            </motion.button>
          </div>
        </div>
        <div className="input-glow"></div>
      </div>

      {/* Traffic Intelligence & Metrics */}
      <div className="geo-metadata">
        <div className="meta-item warning">
          <div className="icon-wrapper">
            <FiAlertTriangle />
          </div>
          <div className="text-wrapper">
            <span className="label">TRAFFIC ALERT</span>
            <p className="value">Congestion risk: 17:00 - 19:00 (Peak Hour)</p>
          </div>
        </div>

        <div className="meta-grid">
          <div className="mini-stat">
            <FiClock className="mini-icon" />
            <span>EST: 45 MINS</span>
          </div>
          <div className="divider"></div>
          <div className="mini-stat">
            <FiMapPin className="mini-icon" />
            <span>DIST: 8.2 KM</span>
          </div>
        </div>
      </div>

      {/* Border trang trí kiểu công nghiệp */}
      <div className="card-foot-ui">
        <div className="corner-tl"></div>
        <div className="corner-br"></div>
      </div>
    </div>
  );
};

export default AddressResolver;
