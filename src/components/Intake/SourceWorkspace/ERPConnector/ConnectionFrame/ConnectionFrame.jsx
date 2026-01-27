import React from "react";
import { FiServer, FiActivity, FiShield, FiWifi, FiCpu } from "react-icons/fi";
import "./ConnectionFrame.scss";

const ConnectionFrame = ({ provider = "SAP S/4HANA", status = "stable" }) => {
  return (
    <div className={`conn-module ${status}`}>
      {/* Background Decor - Circuit Pattern */}
      <div className="conn-circuit-bg"></div>

      <div className="conn-main">
        {/* Left: Hardware Identity */}
        <div className="conn-hardware">
          <div className="icon-wrapper">
            <FiServer className="icon-server" />
            <div className="status-glow"></div>
          </div>
          <div className="status-badge">
            <span className="dot"></span>
            {status.toUpperCase()}
          </div>
        </div>

        {/* Center: Logic Details */}
        <div className="conn-info">
          <div className="info-header">
            <span className="label">GATEWAY PROTOCOL</span>
            <div className="protocol-tag">v2.4-TLS</div>
          </div>
          <h4 className="provider-name">{provider}</h4>

          <div className="conn-metrics">
            <div className="metric-item">
              <FiActivity className="m-icon" />
              <span className="m-val">12ms</span>
              <span className="m-lbl">LATENCY</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <FiShield className="m-icon secure" />
              <span className="m-val">SSL</span>
              <span className="m-lbl">VERIFIED</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <FiCpu className="m-icon" />
              <span className="m-val">98%</span>
              <span className="m-lbl">UPTIME</span>
            </div>
          </div>
        </div>

        {/* Right: Live Signal Visualizer */}
        <div className="conn-visualizer">
          <div className="signal-bar"></div>
          <div className="signal-bar"></div>
          <div className="signal-bar"></div>
          <div className="signal-bar"></div>
          <FiWifi className="wifi-icon" />
        </div>
      </div>
    </div>
  );
};

export default ConnectionFrame;
