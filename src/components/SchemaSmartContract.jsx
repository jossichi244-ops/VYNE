import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import ReactJson from "react-json-view";
import "../assets/styles/schema-editor.scss";

// === Helper: detect datatype ===
const inferTypeFromValues = (values) => {
  const nonNull = values.filter((v) => v !== null && v !== undefined && v !== "");
  if (nonNull.length === 0) return "string";

  const isInteger = (v) => /^-?\d+$/.test(v);
  const isFloat = (v) => /^-?\d+(\.\d+)?$/.test(v);
  const isBool = (v) => ["true", "false", "True", "False", true, false].includes(v);
  const looksLikeDate = (v) => {
    if (typeof v !== "string") return false;
    const patterns = [
      /^\d{4}-\d{2}-\d{2}$/,
      /^\d{2}\/\d{2}\/\d{4}$/,
      /^\d{4}\/\d{2}\/\d{2}$/,
      /^\d{2}-\d{2}-\d{4}$/,
      /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/,
      /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}(:\d{2})?$/,
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(Z|([+-]\d{2}:?\d{2}))?$/
    ];
    return patterns.some((p) => p.test(v));
  };

  if (nonNull.every(isInteger)) return "integer";
  if (nonNull.every(isFloat)) return "number";
  if (nonNull.every(isBool)) return "boolean";

  const validDates = nonNull.filter(looksLikeDate);
  if (validDates.length / nonNull.length > 0.5) return "datetime";

  const unique = [...new Set(nonNull)];
  if (unique.length <= 20) return "enum";

  return "string";
};

// === Helper: build schema from data ===
const buildSchemaFromData = (rows) => {
  if (!rows || rows.length === 0)
    return { $schema: "http://json-schema.org/draft-07/schema#", type: "object", properties: {} };

  const cols = Object.keys(rows[0]);
  const properties = {};
  cols.forEach((col) => {
    const vals = rows.map((r) => r[col]);
    const t = inferTypeFromValues(vals);
    if (t === "enum") {
      properties[col] = { type: "string", enum: [...new Set(vals.filter(Boolean))] };
    } else if (t === "datetime") {
      properties[col] = { type: "string", format: "date-time" };
    } else {
      properties[col] = { type: t };
    }
  });

  return {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "SmartGeneratedSchema",
    type: "object",
    properties,
    required: Object.keys(properties)
  };
};

export default function SchemaSmartContract({
  schema = {},
  setSchema = () => {},
  data = [],
  setData = () => {}
}) {
  const [localSchema, setLocalSchema] = useState(schema);
  const [localData, setLocalData] = useState([]);
  const [excludedFields, setExcludedFields] = useState({});
  const [isCopied, setIsCopied] = useState(false);

  // ✅ Khi schema từ backend thay đổi
  useEffect(() => {
    if (schema && Object.keys(schema).length > 0) {
      setLocalSchema(schema);
      setExcludedFields({});
    }
  }, [schema]);

  // ✅ Khi data thay đổi → tự detect schema nếu chưa có
  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      const sample = data.slice(0, 5);
      setLocalData(sample);
      if (!schema?.properties || Object.keys(schema.properties).length === 0) {
        const inferred = buildSchemaFromData(sample);
        setLocalSchema(inferred);
        setSchema(inferred);
      }
    }
  }, [data]);

  const handleSchemaChange = (updated) => {
    setLocalSchema(updated);
    setSchema(updated);
  };

  const toggleField = (key) => {
    setExcludedFields((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleRequired = (field) => {
    const currentReq = localSchema.required || [];
    const isReq = currentReq.includes(field);
    const newReq = isReq ? currentReq.filter((f) => f !== field) : [...currentReq, field];
    const updated = { ...localSchema, required: newReq };
    setLocalSchema(updated);
    setSchema(updated);
  };

  const displayedSchema = {
    ...localSchema,
    properties: Object.fromEntries(
      Object.entries(localSchema?.properties || {}).filter(([key]) => !excludedFields[key])
    ),
  };

  const onExport = () => {
    const blob = new Blob([JSON.stringify(displayedSchema, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    saveAs(blob, "smart-schema.json");
  };

  const onCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(displayedSchema, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCellChange = (rowIndex, key, value) => {
    const updated = localData.map((row, i) => (i === rowIndex ? { ...row, [key]: value } : row));
    setLocalData(updated);
    setData(updated);
    const newSchema = buildSchemaFromData(updated);
    setLocalSchema(newSchema);
    setSchema(newSchema);
  };

  // ✅ Đồng bộ cột khi schema thay đổi
  useEffect(() => {
    if (!schema?.properties || localData.length === 0) return;
    const schemaCols = Object.keys(schema.properties);
    const dataCols = Object.keys(localData[0]);
    const added = schemaCols.filter((c) => !dataCols.includes(c));
    const removed = dataCols.filter((c) => !schemaCols.includes(c));

    if (added.length === 0 && removed.length === 0) return;

    const updated = localData.map((r) => {
      const row = { ...r };
      added.forEach((c) => (row[c] = ""));
      removed.forEach((c) => delete row[c]);
      return row;
    });
    setLocalData(updated);
    setData(updated);
  }, [schema]);

  return (
    <div className="schema-editor">
      <div className="schema-top">
        <h3>Smart Contract Schema (Auto Type Detection)</h3>
        <div className="actions">
          <button onClick={onCopy}>{isCopied ? "Copied!" : "Copy Schema"}</button>
          <button onClick={onExport}>Export JSON</button>
        </div>
      </div>

      <div className="schema-body">
        {/* Left panel: Fields */}
        <div className="left-panel">
          <h4>Fields</h4>
          <ul className="field-list">
            {localSchema?.properties &&
              Object.keys(localSchema.properties).map((key) => (
                <li key={key}>
                  <label>
                    <input
                      type="checkbox"
                      checked={!excludedFields[key]}
                      onChange={() => toggleField(key)}
                    />
                    <span className="field-name">{key}</span>
                    <small className="field-type">
                      {localSchema.properties[key]?.type ||
                        (localSchema.properties[key]?.format === "date-time"
                          ? "datetime"
                          : "string")}
                    </small>
                  </label>
                </li>
              ))}
          </ul>
        </div>

        {/* Right panel: JSON view */}
        <div className="right-panel">
          <h4>Schema JSON (Editable)</h4>
          <div className="json-view">
            <ReactJson
              src={displayedSchema}
              name={false}
              collapsed={2}
              theme="monokai"
              enableClipboard={false}
              displayDataTypes={false}
              onEdit={(e) => handleSchemaChange(e.updated_src)}
              onAdd={(e) => handleSchemaChange(e.updated_src)}
              onDelete={(e) => handleSchemaChange(e.updated_src)}
            />
          </div>
        </div>
      </div>

      {/* Data preview */}
      <div className="data-preview">
        <h4>Data / Schema Preview (Editable)</h4>

        {localData.length > 0 ? (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  {Object.keys(localData[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {localData.map((row, i) => (
                  <tr key={i}>
                    {Object.entries(row).map(([key, val]) => (
                      <td key={key}>
                        <input
                          value={val ?? ""}
                          onChange={(e) => handleCellChange(i, key, e.target.value)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Type</th>
                  <th>Required</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(localSchema?.properties || {}).map(([key, val]) => {
                  const safeVal = val || {};
                  const isRequired = (localSchema.required || []).includes(key);
                  const type =
                    safeVal.type ||
                    (safeVal.format === "date-time" ? "datetime" : "string");
                  return (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{type}</td>
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={isRequired}
                          onChange={() => toggleRequired(key)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
