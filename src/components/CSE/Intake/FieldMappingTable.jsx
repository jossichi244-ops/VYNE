import React from "react";
import { FiLink, FiArrowRight, FiActivity, FiZap } from "react-icons/fi";
import "./FieldMappingTable.scss";

const FieldMappingTable = () => {
  const mappings = [
    {
      system: "basePrice",
      excel: "Unit_Rate_VND",
      status: "mapped",
      confidence: "100%",
    },
    { system: "sla", excel: "SLA_Target", status: "mapped", confidence: "98%" },
    {
      system: "riskLevel",
      excel: "Compliance_Grade",
      status: "auto-infer",
      confidence: "85%",
    },
  ];

  return (
    <div className="neural-mapping-container">
      <div className="table-header-info">
        <FiActivity className="header-icon" />
        <span>DATA_ALIGNMENT_PROTOCOL ACTIVE</span>
      </div>

      <div className="table-wrapper">
        <table className="neural-table">
          <thead>
            <tr>
              <th>
                <div className="th-content">SYSTEM_ATTRIBUTE</div>
              </th>
              <th>
                <div className="th-content">SOURCE_STREAM (EXCEL)</div>
              </th>
              <th>
                <div className="th-content text-right">MAPPING_ENGINE</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {mappings.map((m, i) => (
              <tr key={i} className={`mapping-row ${m.status}`}>
                <td className="system-cell">
                  <div className="attr-wrapper">
                    <span className="dot"></span>
                    <code className="attr-name">{m.system}</code>
                  </div>
                </td>

                <td className="source-cell">
                  <div className="link-indicator">
                    <FiArrowRight className="arrow" />
                    <span className="excel-name">{m.excel}</span>
                  </div>
                </td>

                <td className="status-cell">
                  <div className="status-badge-group">
                    <div className={`status-pill ${m.status}`}>
                      {m.status === "mapped" ? (
                        <FiLink size={10} />
                      ) : (
                        <FiZap size={10} />
                      )}
                      <span>{m.status.replace("-", "_").toUpperCase()}</span>
                    </div>
                    <span className="confidence-index">{m.confidence}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <p>
          Hệ thống tự động đồng bộ hóa dựa trên thuật toán Neural-Match v2.1
        </p>
      </div>
    </div>
  );
};

export default FieldMappingTable;
