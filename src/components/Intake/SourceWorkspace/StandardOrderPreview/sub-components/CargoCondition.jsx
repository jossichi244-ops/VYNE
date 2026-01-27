import React from "react";
import { FiThermometer, FiDroplet, FiBox, FiAlertCircle } from "react-icons/fi";
import "./CargoCondition.scss";

const CargoCondition = ({ data = {} }) => {
  const temp = data.temp ?? -20.5;
  const humidity = data.humidity ?? 82;
  const shock = data.shock ?? 0.2;

  const isTempAlert = temp < -22 || temp > -18;
  const isShockAlert = shock > 1.5;

  return (
    <div className="cargo-monitor">
      <div className="cargo-monitor__header">
        <div className="title-group">
          <h5>SENSORY TELEMETRY</h5>
          <span className="live-indicator">ACTIVE FEED</span>
        </div>
        {isTempAlert && (
          <div className="global-alert">
            <FiAlertCircle /> OUT OF RANGE
          </div>
        )}
      </div>

      <div className="cargo-monitor__grid">
        {/* TEMPERATURE */}
        <div className={`sensor-card ${isTempAlert ? "is-alert" : ""}`}>
          <div className="sensor-card__icon">
            <FiThermometer />
          </div>
          <div className="sensor-card__data">
            <label>Internal Temp</label>
            <div className="value-group">
              <span className="value">{temp}</span>
              <span className="unit">°C</span>
            </div>
          </div>
          <div className="sensor-card__graph">
            <div className="wave-container">
              <div className="wave"></div>
            </div>
          </div>
        </div>

        {/* HUMIDITY */}
        <div className="sensor-card">
          <div className="sensor-card__icon">
            <FiDroplet />
          </div>
          <div className="sensor-card__data">
            <label>Rel. Humidity</label>
            <div className="value-group">
              <span className="value">{humidity}</span>
              <span className="unit">%</span>
            </div>
          </div>
          <div className="sensor-card__bar">
            <div className="fill" style={{ width: `${humidity}%` }}></div>
          </div>
        </div>

        {/* SHOCK / G-FORCE */}
        <div className={`sensor-card ${isShockAlert ? "is-alert" : ""}`}>
          <div className="sensor-card__icon">
            <FiBox />
          </div>
          <div className="sensor-card__data">
            <label>Impact Force</label>
            <div className="value-group">
              <span className="value">{shock}</span>
              <span className="unit">G</span>
            </div>
          </div>
          <div className="sensor-card__impact-dots">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`dot ${shock > i * 0.5 ? "active" : ""}`}></span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CargoCondition;
