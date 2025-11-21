import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  AlertTriangle,
  CheckCircle,
  Target,
  HelpCircle,
  BarChart3,
  Users,
  BarChart,
} from "lucide-react";

import "../assets/styles/BeyondEDAViewer.scss";
import ImpactAssessmentTerminal from "./BeyondEDAViewer/ImpactAssessmentTerminal";
import ScenarioAnalysis from "./BeyondEDAViewer/ScenarioAnalysis";
import GenericAnalysis from "./BeyondEDAViewer/GenericAnalysis";
import CohortAnalysisCard from "./BeyondEDAViewer/CohortAnalysisCard";

// --- Helper: MetricCard Component (Giữ nguyên) ---
const MetricCard = ({ icon, title, value, subtext, className }) => (
  <div className={`metric-card ${className || ""}`}>
    <div className="metric-card-header">
      <span className="metric-card-icon">{icon}</span>
      <span className="metric-card-title">{title}</span>
    </div>
    <p className="metric-card-value">{value}</p>
    {subtext && <p className="metric-card-subtext">{subtext}</p>}
  </div>
);

// --- Specialized: DiDAnalysisCard Component (Giữ nguyên) ---
const DiDAnalysisCard = ({ data }) => {
  if (!data || data.error) {
    return (
      <div className="did-error-card">
        <div className="did-error-header">
          <AlertTriangle className="did-error-icon" />
          <h3 className="did-error-title">DiD Analysis Error</h3>
        </div>
        <p className="did-error-message">
          {data?.error || "An unknown error occurred."}
        </p>
      </div>
    );
  }

  const {
    did_coef,
    did_pvalue,
    n_obs,
    r_squared,
    ci_95,
    interpretation,
    pre_trends_warning,
    pre_trends,
    post_trends,
  } = data;

  // Logic xử lý dữ liệu biểu đồ
  const chartData =
    !pre_trends || !post_trends
      ? []
      : [...pre_trends, ...post_trends].map((d) => ({
          ...d,
          // Format ngày tháng cho trục X
          time: new Date(d.time).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        }));

  const treatmentTime =
    pre_trends && pre_trends.length > 0
      ? new Date(pre_trends[pre_trends.length - 1].time).toLocaleDateString(
          "en-US",
          { month: "short", day: "numeric", year: "numeric" }
        )
      : null;

  const isSignificant = did_pvalue <= 0.05;

  return (
    <div className="analysis-card did-card">
      <div className="card-header">
        <h2 className="card-title">Difference-in-Differences Analysis (DiD)</h2>
        <p className="card-subtitle">
          Evaluating the Causal Impact of the Intervention.
        </p>
      </div>

      {/* Metric Grid */}
      <div className="metric-grid">
        <MetricCard
          icon={<Target size={18} />}
          title="ATT Estimate"
          value={did_coef?.toFixed(4) ?? "N/A"}
          subtext="Avg. Treatment Effect on Treated"
        />
        <MetricCard
          icon={
            isSignificant ? <CheckCircle size={18} /> : <HelpCircle size={18} />
          }
          title="P-value"
          value={did_pvalue?.toFixed(4) ?? "N/A"}
          subtext={
            isSignificant
              ? "Statistically Significant (p < 0.05)"
              : "Not Significant"
          }
          className={
            isSignificant ? "card-status-success" : "card-status-warning"
          }
        />
        <MetricCard
          icon={<BarChart3 size={18} />}
          title="95% Confidence Interval"
          value={
            `[${ci_95?.[0]?.toFixed(3)}, ${ci_95?.[1]?.toFixed(3)}]` ?? "[N/A]"
          }
          subtext="Plausible Range for True Effect"
        />
        <MetricCard
          icon={<Users size={18} />}
          title="Observations (N)"
          value={n_obs?.toLocaleString() ?? "N/A"}
          subtext={`Model R²: ${r_squared?.toFixed(3) ?? "N/A"}`}
        />
      </div>

      {/* Interpretation Box */}
      <div
        className={`interpretation-box ${
          pre_trends_warning
            ? "interpretation-warning"
            : "interpretation-success"
        }`}>
        <div className="interpretation-header">
          {pre_trends_warning ? (
            <AlertTriangle className="interpretation-icon" />
          ) : (
            <CheckCircle className="interpretation-icon" />
          )}
          <h4 className="interpretation-title">
            Model Interpretation & Pre-Trend Check
          </h4>
        </div>
        <p className="interpretation-narrative">{interpretation}</p>
        {pre_trends_warning && (
          <p className="pre-trend-sub-warning">
            <BarChart className="sub-warning-icon" /> **Warning:** The
            assumption of **Parallel Trends** might be violated. Interpret with
            caution.
          </p>
        )}
      </div>

      {/* Chart Section */}
      <div className="chart-section">
        <h4 className="chart-title">Observed Trends: Treatment vs. Control</h4>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="chart-grid" />
              <XAxis
                dataKey="time"
                className="chart-axis"
                tickLine={false}
                axisLine={false}
              />
              <YAxis className="chart-axis" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--tooltip-bg)",
                  border: "1px solid var(--tooltip-border)",
                  color: "var(--tooltip-text)",
                }}
                labelStyle={{
                  fontWeight: "bold",
                  color: "var(--accent-color)",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "13px", paddingTop: "10px" }}
                align="right"
                verticalAlign="top"
              />
              <Line
                type="monotone"
                dataKey="treatment_mean"
                name="Treatment Group Mean"
                className="line-treatment"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="control_mean"
                name="Control Group Mean (Counterfactual)"
                className="line-control"
                strokeWidth={3}
              />
              {treatmentTime && (
                <ReferenceLine
                  x={treatmentTime}
                  className="reference-line-treatment"
                  strokeDasharray="6 6"
                  label={{
                    value: "Treatment Start",
                    position: "insideTopRight",
                    fill: "var(--warning-color)",
                    fontSize: 11,
                    fontWeight: "bold",
                  }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export default function BeyondEDAViewer({ apiData }) {
  // Logic ánh xạ dữ liệu
  const { analysisItems, scenarioCount } = useMemo(() => {
    if (!apiData || !apiData.results) {
      return { analysisItems: [], scenarioCount: 0, genericCount: 0 };
    }

    const results = apiData.results;
    const analysisKeys = Object.keys(results);

    let items = [];
    let scenariosFound = 0;
    let specializedFound = 0;

    analysisKeys.forEach((key) => {
      const data = results[key];

      const isDiD = key === "did";
      const isCohort = key === "cohort";
      const isImpactAssessment =
        key === "impact_assessment" ||
        key === "effect_to_business" ||
        (typeof data === "object" &&
          data !== null &&
          (data.used_cols || data.all_candidates));

      if (isDiD || isCohort || isImpactAssessment) {
        items.push({
          uniqueKey: key,
          title: isDiD
            ? "DiD Analysis"
            : isCohort
            ? "Cohort Analysis"
            : "Impact Assessment",
          data: data,
          isSpecialized: true,
          isDiD: isDiD,
          isCohort: isCohort,
          isImpact: isImpactAssessment, // Đã thêm biến isImpact vào item
          isScenario: false,
        });
        specializedFound++;
      } else if (
        key === "scenario" &&
        typeof data === "object" &&
        data !== null &&
        !data.error
      ) {
        Object.keys(data).forEach((outcomeKey) => {
          items.push({
            uniqueKey: `scenario-${outcomeKey}`,
            title: `Scenario for: ${outcomeKey}`,
            data: data[outcomeKey],
            isSpecialized: false,
            isDiD: false,
            isCohort: false,
            isImpact: false,
            isScenario: true,
          });
          scenariosFound++;
        });
      } else {
        items.push({
          uniqueKey: key,
          title: key.toUpperCase().replace(/_/g, " "),
          data: data,
          isSpecialized: false,
          isDiD: false,
          isCohort: false,
          isImpact: false,
          isScenario: false,
        });
      }
    });

    // Sort: DiD/Cohort/Impact -> Scenario -> Generic
    items.sort((a, b) => {
      if (a.isDiD && !b.isDiD) return -1;
      if (!a.isDiD && b.isDiD) return 1;
      if (a.isCohort && !b.isCohort) return -1;
      if (!a.isCohort && b.isCohort) return 1;
      if (a.isImpact && !b.isImpact) return -1;
      if (!a.isImpact && b.isImpact) return 1;
      if (a.isScenario && !b.isScenario) return 1;
      if (!a.isScenario && b.isScenario) return -1;
      return 0;
    });

    return {
      analysisItems: items,
      scenarioCount: scenariosFound,
      genericCount: items.length - scenariosFound - specializedFound,
    };
  }, [apiData]);

  if (!apiData || !analysisItems.length) {
    return (
      <div className="initial-loading-state">
        <p className="loading">Initializing Analysis Engine...</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="beyond-eda-viewer" // Class SCSS chính
      variants={containerVariants}
      initial="hidden"
      animate="visible">
      <motion.header className="viewer-header" variants={itemVariants}>
        <h2 className="main-title">Analysis Command Center</h2>
        <p className="summary">
          <span className="badge-status">Analysis Complete</span>
          Found <span className="highlight">{scenarioCount}</span> Major
          Scenario(s) and{" "}
          <span className="highlight">
            {analysisItems.length - scenarioCount}
          </span>{" "}
          Supporting Analyses.
        </p>
      </motion.header>

      <div className="analysis-grid">
        {/* ĐÃ SỬA LỖI: Thêm 'isImpact' vào destructure */}
        {analysisItems.map(
          ({
            uniqueKey,
            title,
            data,
            isScenario,
            isDiD,
            isCohort,
            isImpact,
          }) => (
            <motion.div
              key={uniqueKey}
              className={`analysis-item ${
                isScenario || isDiD || isCohort || isImpact
                  ? "full-width-card"
                  : "half-width-card"
              }`}
              variants={itemVariants}>
              {isDiD ? (
                <DiDAnalysisCard data={data} />
              ) : isCohort ? (
                <CohortAnalysisCard data={data} />
              ) : isImpact ? ( // Lỗi đã được sửa, giờ biến này đã được định nghĩa
                <ImpactAssessmentTerminal data={data} />
              ) : isScenario ? (
                <ScenarioAnalysis title={title} data={data} />
              ) : (
                <GenericAnalysis title={title} data={data} />
              )}
            </motion.div>
          )
        )}
      </div>
    </motion.div>
  );
}
