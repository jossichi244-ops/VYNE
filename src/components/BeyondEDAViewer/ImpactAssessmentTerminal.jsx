import React from "react";
import { motion } from "framer-motion";
import { 
  Sigma, TrendingUp, Link, List, AlertTriangle, CheckCircle, Search 
} from "lucide-react";
import "../../assets/styles/ImpactAssessmentTerminal.scss";
import IntelliTraceViewer from "./IntelliTraceViewer";

// 🔹 Subcomponent hiển thị từng chỉ số
const TerminalMetric = ({ icon: Icon, title, value, subtext, className, glowColor = 'var(--accent-blue-neon)' }) => (
  <motion.div 
    className={`terminal-metric-card ${className || ''}`}
    whileHover={{ scale: 1.02, boxShadow: `0 0 15px ${glowColor}` }}
    transition={{ type: "spring", stiffness: 300, damping: 10 }}
  >
    <div className="metric-header-line">
      <span className="metric-icon-glow" style={{ color: glowColor }}>
        <Icon size={20} />
      </span>
      <span className="metric-title">{title}</span>
    </div>
    <p className="metric-value" style={{ textShadow: `0 0 5px ${glowColor}` }}>
      {value}
    </p>
    {subtext && <p className="metric-subtext">{subtext}</p>}
  </motion.div>
);

const ImpactAssessmentTerminal = ({ data }) => {
  // ----------------- CASE: ERROR OR MISSING DATA -----------------
  if (!data || data.error) {
    const candidates = data?.all_candidates || data?.candidates || null; 
    const significantPairs = candidates?.significant_pairs || [];
    const hasHeuristicCandidates = (
      candidates?.effect_candidates?.length > 0 || 
      candidates?.base_candidates?.length > 0
    );
    const heuristicNote = candidates?.note || "Không có ghi chú heuristic được trả về từ backend.";
    const isAutoDetected = data?.used_cols?.is_auto_detected ?? true;

    return (
      <motion.div 
        className="analysis-card terminal-error-card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="card-header error-header">
          <AlertTriangle size={24} className="error-icon" />
          <h3 className="card-title">Impact Assessment: Failure</h3>
        </div>

        <p className="error-message">
          {data?.error || "Không thể tính toán business impact. Base/Effect columns chưa được xác định hoặc không có tương quan mạnh."}
        </p>

        <div className="error-details">
          <p className="error-detail-line">
            🧠 <strong>Detection Mode:</strong> {isAutoDetected ? "AUTO-DETECTED" : "MANUAL"}
          </p>
          <p className="error-detail-line">
            🧩 <strong>Heuristic Note:</strong> {heuristicNote}
          </p>
        </div>

        {(significantPairs.length > 0 || hasHeuristicCandidates) && (
          <div className="candidate-list-summary">
            <p>
              <List size={16} /> <strong>CANDIDATE LOG:</strong> Hệ thống đã thử phát hiện cột Effect/Base, nhưng thất bại ở bước tương quan.
            </p>

            {significantPairs.length > 0 && (
              <ul className="significant-pairs-list">
                <li className="list-title">📊 Cặp có tương quan (chưa đạt ngưỡng ý nghĩa p &lt; 0.05):</li>
                {significantPairs.map((p, i) => (
                  <li key={i}>
                    <strong>E:</strong> {p.col ?? 'N/A'} → <strong>B:</strong> {p.base_col ?? 'N/A'} | 
                    R={p.correlation != null ? p.correlation.toFixed(4) : 'N/A'} | 
                    p-value: {p.p_value != null ? p.p_value.toExponential(2) : 'N/A'} | 
                    Confidence: {p.confidence != null ? p.confidence.toFixed(2) : 'N/A'}
                  </li>
                ))}
              </ul>
            )}

            {hasHeuristicCandidates && (
              <ul className="heuristic-candidates-list">
                <li className="list-title">🧮 Heuristic Candidates (Bước 1):</li>
                {candidates?.effect_candidates?.map((c, i) => {
                  const skewObj = candidates?.base_candidates?.find(b => b.col === c.col);
                  const skewVal = skewObj?.skew ?? 'N/A';
                  return (
                    <li key={`eff-${i}`}>
                      <strong>Effect:</strong> {c.col ?? 'N/A'} 
                      &nbsp;| Skew: {typeof skewVal === 'number' ? skewVal.toFixed(2) : 'N/A'} 
                      | Mean: {c.mean != null ? c.mean.toFixed(2) : 'N/A'} 
                      <span className="text-faded"> — {c.reason ?? 'N/A'}</span>
                    </li>
                  )
                })}
                {candidates?.base_candidates?.map((c, i) => (
                  <li key={`base-${i}`}>
                    <strong>Base:</strong> {c.col ?? 'N/A'} 
                    &nbsp;| Mean: {c.mean != null ? c.mean.toFixed(2) : 'N/A'} 
                    | Skew: {c.skew != null ? c.skew.toFixed(2) : 'N/A'} 
                    <span className="text-faded"> — {c.reason ?? 'N/A'}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {candidates && <IntelliTraceViewer data={candidates} />}
      </motion.div>
    );
  }

  // ----------------- CASE: SUCCESS DATA -----------------
  const { used_cols, summary, correlation_check, note, all_candidates, sample } = data;

  const totalImpact = summary?.total_impact ?? 0;
  const meanROI = summary?.mean_roi ?? 0;
  const isPositiveImpact = totalImpact >= 0;

  const isAutoDetected = used_cols?.is_auto_detected ?? false;
  const impactGlow = isPositiveImpact ? 'var(--success-neon)' : 'var(--warning-neon)';
  const statusGlow = isAutoDetected ? 'var(--warning-neon)' : impactGlow;

  // Lấy correlation chính xác từ backend
  const mainPair = correlation_check?.[0] ?? {};

  return (
    <motion.div 
      className="analysis-card impact-assessment-terminal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card-header">
        <h2 className="card-title">
          Impact Assessment: <strong>{used_cols?.effect_col ?? 'N/A'}</strong> vs. <strong>{used_cols?.base_col ?? 'N/A'}</strong>
        </h2>
        <p className="card-subtitle">Quantifying the effect based on correlation analysis.</p>
      </div>

      {/* ---- METRIC CARDS ---- */}
      <div className="terminal-metric-grid">
        <TerminalMetric 
          icon={Sigma}
          title="Total Absolute Impact"
          value={totalImpact != null ? totalImpact.toLocaleString('en-US', { maximumFractionDigits: 2 }) : 'N/A'}
          subtext={`Sum of (${used_cols?.base_col ?? 'N/A'} × ${used_cols?.effect_col ?? 'N/A'} × Scale)`}
          glowColor={impactGlow}
          className={isPositiveImpact ? "status-success" : "status-warning"}
        />
        <TerminalMetric 
          icon={TrendingUp}
          title="Avg. Percentage Impact (ROI)"
          value={meanROI != null ? (meanROI * 100).toFixed(2) + '%' : 'N/A'}
          subtext="Average Return Per Unit of Base Value"
          glowColor="var(--accent-purple-neon)"
        />
        <TerminalMetric 
          icon={Link}
          title="Correlation"
          value={mainPair?.correlation != null ? mainPair.correlation.toFixed(4) : 'N/A'}
          subtext={`Confidence: ${mainPair?.confidence != null ? mainPair.confidence.toFixed(2) : 'N/A'}, p-value: ${mainPair?.p_value != null ? mainPair.p_value.toExponential(2) : 'N/A'}`}
          glowColor="var(--accent-blue-neon)"
        />
        <TerminalMetric 
          icon={isAutoDetected ? Search : List}
          title="Columns Origin"
          value={isAutoDetected ? "AUTO-DETECTED PAIR" : "USER-DEFINED PAIR"}
          subtext={`Effect: ${used_cols?.effect_col ?? 'N/A'} | Base: ${used_cols?.base_col ?? 'N/A'}`}
          glowColor={statusGlow}
          className={isAutoDetected ? "status-warning" : "status-success"}
        />
      </div>

      <hr className="terminal-divider" />

      {/* ---- DETECTION LOGIC BREAKDOWN ---- */}
      {isAutoDetected && all_candidates && (
        <motion.div 
          className="detection-logic-breakdown"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h3 className="section-title-neon"> Detection Logic Breakdown</h3>
          {/* <p className="logic-note">{all_candidates.note ?? 'N/A'}</p> */}

          <div className="logic-grid">
            {/* Effect Candidates */}
            <div className="logic-candidate-box effect-box">
              <h4>Potential EFFECT Columns</h4>
              <ul>
                {all_candidates.effect_candidates?.map((c, i) => {
                  const skewObj = all_candidates.base_candidates?.find(b => b.col === c.col);
                  const skewVal = skewObj?.skew ?? 'N/A';
                  return (
                    <li key={i} className={c.col === used_cols?.effect_col ? 'selected-candidate' : ''}>
                      <strong>{c.col ?? 'N/A'}</strong> 
                      &nbsp;(Skew: {typeof skewVal === 'number' ? skewVal.toFixed(2) : 'N/A'}) 
                      <span className="reason-text">| {c.reason ?? 'N/A'}</span>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Base Candidates */}
            <div className="logic-candidate-box base-box">
              <h4>Potential BASE Columns</h4>
              <ul>
                {all_candidates.base_candidates?.map((c, i) => (
                  <li key={i} className={c.col === used_cols?.base_col ? 'selected-candidate' : ''}>
                    <strong>{c.col ?? 'N/A'}</strong> 
                    &nbsp;| Mean: {c.mean != null ? c.mean.toFixed(2) : 'N/A'} 
                    | Skew: {c.skew != null ? c.skew.toFixed(2) : 'N/A'} 
                    <span className="reason-text">| {c.reason ?? 'N/A'}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Significant Pairs */}
            <div className="logic-candidate-box pair-box grid-full">
              <h4>Statistically SIGNIFICANT PAIRS</h4>
              <ul>
                {all_candidates.significant_pairs?.map((p, i) => (
                  <li key={i} className={p.col === used_cols?.effect_col && p.base_col === used_cols?.base_col ? 'selected-pair' : ''}>
                    E: {p.col ?? 'N/A'} ➡️ B: {p.base_col ?? 'N/A'} | 
                    R: {p.correlation != null ? p.correlation.toFixed(4) : 'N/A'} | 
                    p-value: {p.p_value != null ? p.p_value.toExponential(2) : 'N/A'} | 
                    Confidence: {p.confidence != null ? p.confidence.toFixed(2) : 'N/A'}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* ---- SAMPLE PREVIEW ---- */}
      {sample && Array.isArray(sample) && sample.length > 0 && (
        <motion.div 
          className="sample-preview-table"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="section-title-neon"> Sample Calculated Data</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {Object.keys(sample[0]).map((key) => <th key={key}>{key}</th>)}
                </tr>
              </thead>
              <tbody>
                {sample.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((v, j) => (
                      <td key={j}>{typeof v === "number" ? v.toFixed(4) : String(v ?? 'N/A')}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      <hr className="terminal-divider" />

      {/* ---- INTERPRETATION BOX ---- */}
      <motion.div 
        className={`terminal-interpretation-box impact-note-box ${isAutoDetected ? 'pre-trend-warning' : 'pre-trend-ok'}`}
        initial={{ opacity: 0, scaleY: 0.8 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        style={{ borderColor: statusGlow, boxShadow: `0 0 10px ${statusGlow}40` }}
      >
        <div className="interpretation-header">
          {isAutoDetected ? <AlertTriangle className="interpretation-icon" /> : <CheckCircle className="interpretation-icon" />}
          <h4 className="interpretation-title">Model Selection & Validation Status</h4>
        </div>
        <p className="interpretation-narrative">{note ?? 'N/A'}</p>
        {isAutoDetected && (
          <p className="pre-trend-sub-warning">
            <Search className="sub-warning-icon"/> 
            CẢNH BÁO: Hệ thống đã tự động phát hiện cặp cột. 
            Hãy xác nhận rằng <strong>{used_cols?.effect_col ?? 'N/A'}</strong> là biến Effect và 
            <strong> {used_cols?.base_col ?? 'N/A'}</strong> là biến Base trong ngữ cảnh kinh doanh.
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ImpactAssessmentTerminal;
