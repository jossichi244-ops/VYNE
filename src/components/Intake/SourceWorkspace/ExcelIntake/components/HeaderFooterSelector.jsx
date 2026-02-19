import { useState } from "react";
import { FiFlag, FiAnchor, FiInfo, FiAlertCircle } from "react-icons/fi";
import "./HeaderFooterSelector.scss";

const HeaderFooterSelector = ({
  rows,
  startRow,
  endRow,
  onSelectStart,
  onSelectEnd,
}) => {
  const isValid = startRow !== null && endRow !== null && startRow < endRow;

  return (
    <div className="selector-container">
      {/* HUD Info Panel */}
      <div className="selector-hud">
        <div className="info-card">
          <FiInfo className="icon-main" />
          <div className="text">
            <h4>Data Range Selection</h4>
            <p>Define the boundaries of your logistics dataset.</p>
          </div>
        </div>

        <div className="status-grid">
          <div
            className={`status-item ${startRow !== null ? "active-start" : ""}`}>
            <span className="label">
              <FiFlag /> Start Row
            </span>
            <span className="value">
              {startRow !== null ? `#${startRow + 1}` : "---"}
            </span>
          </div>
          <div className="status-separator">➔</div>
          <div className={`status-item ${endRow !== null ? "active-end" : ""}`}>
            <span className="label">
              <FiAnchor /> End Row
            </span>
            <span className="value">
              {endRow !== null ? `#${endRow + 1}` : "---"}
            </span>
          </div>
        </div>

        {!isValid && startRow !== null && endRow !== null && (
          <div className="error-badge">
            <FiAlertCircle />
            <span>Invalid Range: End row must be below Start.</span>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="table-viewport">
        <table className="selector-table">
          <thead>
            <tr>
              <th className="sticky-col">ACTIONS</th>
              {rows[0]?.map((_, i) => (
                <th key={i}>COL {i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const isStart = idx === startRow;
              const isEnd = idx === endRow;
              const isInside =
                startRow !== null &&
                endRow !== null &&
                idx > startRow &&
                idx < endRow;

              return (
                <tr
                  key={idx}
                  className={`
                    ${isStart ? "row-start" : ""} 
                    ${isEnd ? "row-end" : ""} 
                    ${isInside ? "row-in-range" : ""}
                  `}>
                  <td className="sticky-col controls">
                    <button
                      className={`btn-ctrl start ${isStart ? "active" : ""}`}
                      onClick={() => onSelectStart(idx)}
                      title="Set as Start (Headers)">
                      S
                    </button>
                    <button
                      className={`btn-ctrl end ${isEnd ? "active" : ""}`}
                      onClick={() => onSelectEnd(idx)}
                      title="Set as End (Footer)">
                      E
                    </button>
                  </td>
                  {row.map((cell, i) => (
                    <td key={i} className="cell-data">
                      {String(cell || "")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HeaderFooterSelector;
