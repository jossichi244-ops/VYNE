// src/components/MongoDBPreview.jsx
import React from "react";
import "../assets/styles/mongodbPreview.scss";

const MongoDBPreview = ({ data, limit = 50 }) => {
  // Chỉ hiển thị tối đa `limit` bản ghi
  const displayed = data.slice(0, limit);

  // Render một document
  const renderValue = (value) => {
    if (value === null) {
      return <span className="mongo-null">null</span>;
    }

    if (typeof value === "string") {
      return <span className="mongo-string">"{value}"</span>;
    }

    if (typeof value === "number" || typeof value === "boolean") {
      return <span className="mongo-number">{String(value)}</span>;
    }

    if (Array.isArray(value)) {
      return (
        <span className="mongo-array">
          [
          {value.map((item, idx) => (
            <span key={idx}>
              {renderValue(item)}
              {idx < value.length - 1 && ", "}
            </span>
          ))}
          ]
        </span>
      );
    }

    if (typeof value === "object") {
      return <MongoObject obj={value} />;
    }

    return <span className="mongo-unknown">{String(value)}</span>;
  };

  const MongoObject = ({ obj, depth = 0 }) => {
    const indent = depth * 16;
    const entries = Object.entries(obj);
    return (
      <div className="mongo-object">
        <span className="mongo-brace-start" style={{ marginLeft: indent }}>
          {"{"}
        </span>
        {entries.map(([key, value], idx) => (
          <div
            key={key}
            className="mongo-field"
            style={{ marginLeft: indent + 16 }}>
            <span className="mongo-key">"{key}"</span>: {renderValue(value)}
            {idx < entries.length - 1 && <span className="mongo-comma">,</span>}
          </div>
        ))}
        <span className="mongo-brace-end" style={{ marginLeft: indent }}>
          {"}"}
        </span>
      </div>
    );
  };

  return (
    <div className="mongodb-preview-container">
      {displayed.map((doc, idx) => (
        <div key={idx} className="mongo-document">
          <span className="mongo-index">[{idx + 1}]</span>
          <MongoObject obj={doc} />
        </div>
      ))}
      {data.length > limit && (
        <p className="text-muted">... và {data.length - limit} bản ghi khác.</p>
      )}
    </div>
  );
};

export default MongoDBPreview;
