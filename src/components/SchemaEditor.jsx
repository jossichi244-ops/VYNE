// src/components/SchemaEditor.jsx
import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import ReactJson from "react-json-view";
import "../assets/styles/schema-editor.scss";

// === Helper: detect datatype ===
const inferTypeFromValues = (values) => {
  const nonNull = values.filter(
    (v) => v !== null && v !== undefined && v !== ""
  );
  if (nonNull.length === 0) return "string";

  // Helper: thử parse datetime theo nhiều định dạng

  const isInteger = (v) => /^-?\d+$/.test(v);
  const isFloat = (v) => /^-?\d+(\.\d+)?$/.test(v);
  const isBool = (v) =>
    ["true", "false", "True", "False", true, false].includes(v);

  // Helper: detect date by multiple formats
  const looksLikeDate = (v) => {
    if (typeof v !== "string") return false;
    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
      /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY or MM/DD/YYYY
      /^\d{4}\/\d{2}\/\d{2}$/, // YYYY/MM/DD
      /^\d{2}-\d{2}-\d{4}$/, // DD-MM-YYYY
      /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/, // YYYY-MM-DD HH:mm(:ss)
      /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}(:\d{2})?$/, // DD/MM/YYYY HH:mm(:ss)
      /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}$/, // YYYY/MM/DD HH:mm
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(Z|([+-]\d{2}:?\d{2}))?$/, // ISO8601
    ];
    return datePatterns.some((p) => p.test(v));
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
    return {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
      properties: {},
    };
  const cols = Object.keys(rows[0]);
  const properties = {};
  cols.forEach((col) => {
    const vals = rows.map((r) => r[col]);
    const t = inferTypeFromValues(vals);
    if (t === "enum") {
      properties[col] = {
        type: "string",
        enum: [...new Set(vals.filter(Boolean))],
      };
    } else if (t === "datetime") {
      properties[col] = { type: "string", format: "date-time" };
    } else {
      properties[col] = { type: t };
    }
  });
  return {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "GeneratedSchema",
    type: "object",
    properties,
  };
};

export default function SchemaEditor({
  schema,
  setSchema,
  data = [],
  setData,
}) {
  const [localData, setLocalData] = useState([]);
  const [originalSchema, setOriginalSchema] = useState(schema || {});
  const [excludedFields, setExcludedFields] = useState({});
  const [isCopied, setIsCopied] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // ✅ Load data from prop & auto infer schema if needed
  useEffect(() => {
    const sourceData = Array.isArray(data) && data.length > 0 ? data : [];
    if (sourceData.length > 0) {
      const limitedData = sourceData.slice(0, 5);
      setLocalData(limitedData);
      setIsDataLoaded(true);

      if (
        !schema ||
        Object.keys(schema).length === 0 ||
        !schema.properties ||
        Object.keys(schema.properties).length === 0
      ) {
        const inferred = buildSchemaFromData(limitedData);
        setSchema?.(inferred);
        setOriginalSchema(inferred);
      }
    } else {
      setLocalData([]);
      setIsDataLoaded(false);
    }
  }, [data, schema, setSchema]);

  // ✅ Sync khi schema từ backend thay đổi
  useEffect(() => {
    if (schema && Object.keys(schema).length > 0) {
      setOriginalSchema(schema);
      setExcludedFields({});
    }
  }, [schema]);

  // ✅ Giữ nguyên data khi schema thay đổi (thêm/xoá field)
  useEffect(() => {
    if (!schema?.properties) return;

    const schemaCols = Object.keys(schema.properties);
    const currentCols = Object.keys(localData[0] || {});

    if (localData.length === 0) return;

    const addedCols = schemaCols.filter((c) => !currentCols.includes(c));
    const removedCols = currentCols.filter((c) => !schemaCols.includes(c));

    if (addedCols.length === 0 && removedCols.length === 0) return;

    console.log(
      "Schema changed: addedCols=",
      addedCols,
      "removedCols=",
      removedCols
    );

    const updatedData = localData.map((row) => {
      const r = { ...row };
      addedCols.forEach((col) => {
        r[col] = "";
      });
      removedCols.forEach((col) => {
        delete r[col];
      });
      return r;
    });

    setLocalData(updatedData);
    setData?.(updatedData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema]);

  // ✅ Khi sửa dữ liệu trong bảng → cập nhật schema động
  const handleCellChange = (rowIdx, key, value) => {
    const updated = localData.map((r, i) =>
      i === rowIdx ? { ...r, [key]: value } : r
    );
    setLocalData(updated);
    setData?.(updated);

    const newSchema = buildSchemaFromData(updated);
    setSchema?.(newSchema);
  };

  const onToggleField = (k) => {
    setExcludedFields((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  const displayedSchema = {
    ...originalSchema,
    properties: Object.fromEntries(
      Object.entries(originalSchema?.properties || {}).filter(
        ([k]) => !excludedFields[k]
      )
    ),
  };

  const onExport = (filtered = false) => {
    const s = filtered ? displayedSchema : schema;
    const blob = new Blob([JSON.stringify(s, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    saveAs(blob, "generated-schema.json");
  };

  const onCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(schema, null, 2)).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="schema-editor">
      <div className="schema-top">
        <h3>RJFS Schema Playground</h3>
        <div className="actions">
          <button onClick={onCopy} disabled={isCopied}>
            {isCopied ? "Copied!" : "Copy Schema"}
          </button>
          <button onClick={() => onExport(false)}>Export full</button>
          <button onClick={() => onExport(true)}>Export filtered</button>
        </div>
      </div>

      <div className="schema-body">
        {/* ✅ Left: Field toggles */}
        <div className="left-panel">
          <h4>Fields (remove/keep)</h4>
          <ul className="field-list">
            {originalSchema?.properties &&
              Object.keys(originalSchema.properties).map((k) => (
                <li key={k}>
                  <label>
                    <input
                      type="checkbox"
                      checked={!excludedFields[k]}
                      onChange={() => onToggleField(k)}
                    />
                    <span className="field-name">{k}</span>
                    <small className="field-type">
                      {originalSchema.properties[k]?.type || "unknown"}
                    </small>
                  </label>
                </li>
              ))}
          </ul>
        </div>

        {/* ✅ Right: JSON view */}
        <div className="right-panel">
          <h4>Schema JSON (Filtered & Editable)</h4>
          <div className="json-view">
            <ReactJson
              src={displayedSchema}
              name={false}
              collapsed={2}
              enableClipboard={false}
              theme="monokai"
              onEdit={(e) => setSchema(e.updated_src)}
              onAdd={(e) => setSchema(e.updated_src)}
              onDelete={(e) => setSchema(e.updated_src)}
            />
          </div>
        </div>
      </div>

      {/* ✅ Data Sample Preview */}
      <div className="data-preview">
        <div className="data-header">
          <h4>Data Sample Preview (Auto Type Detection)</h4>
        </div>
        {isDataLoaded && localData.length > 0 ? (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  {Object.keys(localData[0] || {}).map((key) => (
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
                          onChange={(e) =>
                            handleCellChange(i, key, e.target.value)
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-data-msg">
            ⚠️ No data preview available. Please upload a dataset first.
          </p>
        )}
      </div>
    </div>
  );
}
