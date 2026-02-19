import {
  FiDatabase,
  FiColumns,
  FiShield,
  FiAlertCircle,
  FiCpu,
  FiHash,
} from "react-icons/fi";
import "./FileSummary.scss";

// Sub-component cho các chỉ số quan trọng (Kpis)
const StatCard = ({ icon: Icon, label, value, colorClass }) => (
  <div className={`file-summary__stat-item ${colorClass}`}>
    <div className="icon-box">
      <Icon />
    </div>
    <div className="stat-info">
      <span className="label">{label}</span>
      <strong className="value">{value}</strong>
    </div>
  </div>
);

// Sub-component hiển thị tag/pill cho Schema
const MetaPill = ({ label, value }) => (
  <div className="meta-pill">
    <span className="meta-pill__label">{label}:</span>
    <span className="meta-pill__value">{value}</span>
  </div>
);

const FileSummary = ({ analysis }) => {
  if (!analysis) return null;

  const { file_summary, schema, inspection, understanding } = analysis;
  const missing = inspection?.missing_summary;

  return (
    <div className="file-summary">
      {/* 1. HEADER HUD */}
      <header className="file-summary__header">
        <div className="title-group">
          <FiShield className="main-icon" />
          <div>
            <h4>DATA INTELLIGENCE REPORT</h4>
            <p>
              System-level inspection of `{file_summary.all_columns.length}`
              dimensions
            </p>
          </div>
        </div>
        <div className="memory-badge">
          <FiCpu /> {Math.round((inspection?.memory?.total || 0) / 1024)} KB
        </div>
      </header>

      {/* 2. KPI GRID */}
      <section className="file-summary__kpi-grid">
        <StatCard
          icon={FiHash}
          label="Total Records"
          value={file_summary.row_count.toLocaleString()}
        />
        <StatCard
          icon={FiColumns}
          label="Dimensions"
          value={file_summary.column_count}
        />
        <StatCard
          icon={FiAlertCircle}
          label="Duplicates"
          value={inspection?.duplicates?.duplicate_count || 0}
          colorClass="warning"
        />
        <StatCard
          icon={FiDatabase}
          label="Data Integrity"
          value={`${100 - Math.round((missing?.percent_missing || 0) * 100)}%`}
          colorClass="success"
        />
      </section>

      {/* 3. DIMENSIONAL INTELLIGENCE (Sự kết hợp giữa Schema & Understanding) */}
      <section className="file-summary__section">
        <div className="section-header">
          <h5>Dimensional Intelligence</h5>
          <span className="badge">Deep Analysis</span>
        </div>

        <div className="column-grid">
          {understanding.map((col) => {
            const meta = schema.properties[col.name];
            return (
              <div key={col.name} className="dim-card">
                <div className="dim-card__head">
                  <h6>{col.name}</h6>
                  <span className={`type-tag ${meta?.type}`}>
                    {col.inferred_type}
                  </span>
                </div>

                <div className="dim-card__body">
                  <div className="stats-row">
                    <MetaPill label="Nulls" value={col.nulls} />
                    <MetaPill label="Unique" value={meta?.unique_count} />
                  </div>

                  {meta?.minimum !== undefined && (
                    <div className="range-bar">
                      <div className="range-label">
                        Range: {meta.minimum} — {meta.maximum}
                      </div>
                      <div className="range-track" />
                    </div>
                  )}

                  {col.stats?.top_values && (
                    <div className="top-values">
                      <label>Frequency Distribution:</label>
                      <div className="values-cloud">
                        {Object.keys(col.stats.top_values)
                          .slice(0, 3)
                          .map((v) => (
                            <span key={v} className="v-pill">
                              {v}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default FileSummary;
