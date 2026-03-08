import React, { useMemo } from "react";
import {
  FiZap,
  FiActivity,
  FiArrowUp,
  FiArrowDown,
  FiMessageSquare,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";
import "./Scenario.scss";

const Scenario = ({ dataset }) => {
  const scenarioData = dataset?.advanced?.results;

  const processedScenarios = useMemo(() => {
    const rawData = scenarioData?.scenario || scenarioData;

    if (!rawData || typeof rawData !== "object") return [];

    console.log("Raw Scenario Data:", rawData);

    return Object.entries(rawData)
      .filter(([key, value]) => {
        // Loại bỏ các key không phải outcome (ví dụ các log hệ thống)
        return value && typeof value === "object" && !value.error;
      })
      .map(([outcome, value]) => ({
        outcome,
        importance: value.ml_importances || {},
        coefficients: value.ml_coefficients || {},
        hypotheses: value.hypotheses || [],
        narratives: value.narratives || [],
        topImpacts: value.ảnh_hưởng || {},
      }));
  }, [scenarioData]);

  if (!processedScenarios.length)
    return <div className="empty-viz">Analyzing scenarios...</div>;

  return (
    <div className="intelligence-suite">
      <header className="suite-header">
        <div className="brand-icon">
          <FiZap />
        </div>
        <div className="brand-text">
          <h2>Predictive Intelligence</h2>
          <p>
            AI-driven simulation and hypothesis validation for key outcomes.
          </p>
        </div>
      </header>

      <div className="scenarios-wrapper">
        {processedScenarios.map((item) => (
          <article key={item.outcome} className="intel-card">
            {/* PHẦN 1: OUTCOME TARGET */}
            <div className="intel-section-header">
              <span className="kpi-label">Target Outcome</span>
              <h3 className="kpi-title">{item.outcome.replace(/_/g, " ")}</h3>
            </div>

            <div className="intel-grid">
              {/* CỘT TRÁI: HYPOTHESES & PROBABILITY (Sử dụng dữ liệu hypotheses từ Backend) */}
              <div className="intel-col">
                <div className="sub-label">
                  <FiShield /> Validated Hypotheses
                </div>
                <div className="hypothesis-list">
                  {item.hypotheses.slice(0, 4).map((h, idx) => (
                    <div key={idx} className="h-item">
                      <div className="h-content">
                        <p>{h.giả_thuyết}</p>
                        <div className="probability-bar">
                          <div
                            className="prob-fill"
                            style={{
                              width: `${h["xác suất xảy ra"] || h["xác_suất"]}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="h-status">
                        <span className="pct">
                          {h["xác suất xảy ra"] || h["xác_suất"]}%
                        </span>
                        <span className="desc">Confidence</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CỘT PHẢI: DRIVERS & IMPACT DIRECTION */}
              <div className="intel-col">
                <div className="sub-label">
                  <FiActivity /> Key Drivers & Direction
                </div>
                <div className="driver-list">
                  {Object.entries(item.importance)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 4)
                    .map(([key, importance]) => {
                      const coef = item.coefficients[key] || 0;
                      const isPos = coef >= 0;
                      return (
                        <div
                          key={key}
                          className={`driver-pill ${isPos ? "pos" : "neg"}`}>
                          <div className="driver-icon">
                            {isPos ? <FiArrowUp /> : <FiArrowDown />}
                          </div>
                          <div className="driver-info">
                            <span className="name">{key}</span>
                            <span className="effect">
                              {isPos ? "Positive Impact" : "Negative Impact"}
                            </span>
                          </div>
                          <div className="driver-weight">
                            {(importance * 100).toFixed(1)}%
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* PHẦN 3: AI NARRATIVES (Đọc trực tiếp từ Backend) */}
            <div className="intel-footer">
              <div className="narrative-box">
                <div className="n-header">
                  <FiMessageSquare /> AI Insights Extract
                </div>
                <div className="n-content">
                  {item.narratives.slice(0, 2).map((text, i) => (
                    <div key={i} className="n-bubble">
                      <FiCheckCircle className="check" />
                      <p>{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Scenario;
