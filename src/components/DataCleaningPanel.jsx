// src/components/DataCleaningPanel.jsx
import React from "react";
import MissingValueChart from "./MissingValueChart.jsx";
import "../assets/styles/dataCleaningPanel.scss";

export default function DataCleaningPanel({ cleaning }) {
  // Hiển thị một giao diện thân thiện nếu không có dữ liệu
  if (!cleaning || !cleaning.summary) {
    return (
      <section className="data-cleaning-section empty-state">
        <div className="empty-state-content">
          <span className="empty-icon">✨</span>
          <h3>Không có vấn đề cần làm sạch</h3>
          <p>Dữ liệu của bạn đã sạch! Không cần thao tác gì thêm.</p>
        </div>
      </section>
    );
  }

  const { summary, cleaned_preview } = cleaning;

  return (
    <section className="data-cleaning-section">
      <h2 className="panel-title">Data Cleaning Summary</h2>

      {/* Tóm tắt trực quan */}
      <div className="cleaning-cards-summary">
        <div className="card">
          <h4>Kích thước dữ liệu gốc</h4>
          <p className="card-value">{summary.before_shape?.join(" × ")}</p>
        </div>
        <div className="card">
          <h4>Kích thước sau khi làm sạch</h4>
          <p className="card-value">{summary.after_shape?.join(" × ")}</p>
        </div>
        <div className="card">
          <h4>Cột được đổi tên</h4>
          <p className="card-value">
            {Object.keys(summary.renamed_columns).length}
          </p>
        </div>
        {summary.expanded_columns &&
          Object.keys(summary.expanded_columns).length > 0 && (
            <div className="card">
              <h4>Cột được tách</h4>
              <p className="card-value">
                {Object.keys(summary.expanded_columns).length}
              </p>
            </div>
          )}
      </div>

      {/* Biểu đồ giá trị thiếu */}
      <div className="cleaning-visuals-section mt-6">
        <div className="chart-container">
          <h3>Biểu đồ giá trị thiếu</h3>
          {summary && <MissingValueChart summary={summary} />}
        </div>
      </div>

      {/* Xem trước dữ liệu sau khi làm sạch */}
      <div className="cleaning-preview-section mt-6">
        <h3>Xem trước dữ liệu đã làm sạch</h3>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                {cleaned_preview.length > 0 &&
                  Object.keys(cleaned_preview[0]).map((col) => (
                    <th key={col}>{col}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {cleaned_preview.map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((val, i) => (
                    <td key={i}>
                      {typeof val === "object"
                        ? JSON.stringify(val)
                        : String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
