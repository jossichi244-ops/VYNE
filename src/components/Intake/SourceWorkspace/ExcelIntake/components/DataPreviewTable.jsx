import React from "react";
import "./DataPreviewTable.scss";

const MAX_PREVIEW_ROWS = 100;

const DataPreviewTable = ({ rows = [], conflicts = [] }) => {
  if (!rows.length) return null;

  const columns = Object.keys(rows[0] || {});
  const previewRows = rows.slice(0, MAX_PREVIEW_ROWS);
  const conflictRowSet = new Set(conflicts.map((c) => c.row));

  return (
    <div className="data-preview-wrapper">
      <div className="preview-header">
        <div className="title-section">
          <h4>DATA PREVIEW</h4>
          <span className="badge">LIVE ENGINE</span>
        </div>
        <div className="meta-section">
          Showing <strong>{previewRows.length}</strong> of{" "}
          <strong>{rows.length}</strong> entries
        </div>
      </div>

      {/* Container chính hỗ trợ scroll 2 chiều */}
      <div className="table-scroll-container">
        <table className="preview-table">
          <thead>
            <tr>
              <th className="col-index">#</th>
              {columns.map((col) => (
                <th key={col} className="col-data">
                  {col.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {previewRows.map((row, idx) => {
              const isConflict = conflictRowSet.has(idx + 1);

              return (
                <tr key={idx} className={isConflict ? "row-conflict" : ""}>
                  <td className="col-index">{idx + 1}</td>
                  {columns.map((col) => {
                    const value = row[col];
                    const displayValue =
                      value !== null && value !== undefined
                        ? String(value)
                        : "—";

                    return (
                      <td key={col} title={displayValue} className="col-data">
                        <div className="cell-content">{displayValue}</div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataPreviewTable;
