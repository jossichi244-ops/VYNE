import React from "react";
import {
  FiDatabase,
  FiHash,
  FiCalendar,
  FiType,
  FiShield,
  FiList,
} from "react-icons/fi";
import "./SchemaViewer.scss";

const getDataTypeIcon = (prop) => {
  if (prop.format === "date-time") return <FiCalendar className="t-date" />;
  if (prop.type === "number" || prop.type === "integer")
    return <FiHash className="t-num" />;
  if (prop.enum) return <FiList className="t-enum" />;
  if (prop.type === "string") return <FiType className="t-str" />;
  return <FiDatabase className="t-def" />;
};

const SchemaViewer = ({ schema }) => {
  if (!schema?.properties) return null;

  return (
    <div className="json-schema-inspector">
      <header className="inspector-header">
        <div className="header-left">
          <FiShield className="shield-icon" />
          <div className="title-stack">
            <h3>{schema.title || "Schema Definition"}</h3>
            <span className="schema-version">JSON Schema Draft 7</span>
          </div>
        </div>
        <div className="header-actions">
          <span className="prop-count">
            {Object.keys(schema.properties).length} Properties
          </span>
        </div>
      </header>

      <div className="inspector-viewport">
        <table className="schema-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Type / Format</th>
              <th>Constraints</th>
              <th>Preview / Enum</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(schema.properties).map(([field, prop]) => (
              <tr key={field} className="schema-row">
                <td className="field-cell">
                  <div className="field-id">
                    {getDataTypeIcon(prop)}
                    <span className="field-name">{field}</span>
                    {schema.required?.includes(field) && (
                      <span className="req-star">*</span>
                    )}
                  </div>
                </td>

                <td className="type-cell">
                  <div className="type-pill">
                    <span className={`type-text ${prop.type}`}>
                      {prop.type}
                    </span>
                    {prop.format && (
                      <span className="format-text">({prop.format})</span>
                    )}
                  </div>
                </td>

                <td className="constraint-cell">
                  <div className="constraint-stack">
                    {prop.minimum !== undefined && (
                      <span className="limit-tag">
                        Range: {prop.minimum}…{prop.maximum}
                      </span>
                    )}
                    {prop.unique_count !== undefined && (
                      <span className="limit-tag">
                        Unique: {prop.unique_count}
                      </span>
                    )}
                    {prop.nulls === 0 && (
                      <span className="limit-tag non-nullable">No-Null</span>
                    )}
                  </div>
                </td>

                <td className="preview-cell">
                  {prop.enum ? (
                    <div className="enum-tags">
                      {prop.enum.slice(0, 3).map((v) => (
                        <span key={v} className="e-tag">
                          {v}
                        </span>
                      ))}
                      {prop.enum.length > 3 && (
                        <span className="e-more">+{prop.enum.length - 3}</span>
                      )}
                    </div>
                  ) : (
                    <div className="example-text">
                      {prop.examples
                        ? prop.examples.slice(0, 2).join(", ")
                        : "—"}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SchemaViewer;
