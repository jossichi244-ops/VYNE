import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { useEffect, useState } from "react";
import {
  FiRotateCcw,
  FiSave,
  FiSend,
  FiLink,
  FiCheckCircle,
  FiDatabase,
  FiZap,
  FiLayout,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";

import "./ContractBuilder.scss";

const ContractBuilder = ({ template, previewData }) => {
  const [schema, setSchema] = useState(null);
  const [formData, setFormData] = useState({});
  const [mapping, setMapping] = useState({});
  // Thêm vào trong component ContractBuilder
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Mô phỏng API call
    await new Promise((r) => setTimeout(r, 1500));
    setIsSaving(false);
    alert("Draft saved to secure vault.");
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    // Mô phỏng quá trình Deploy/Finalize
    await new Promise((r) => setTimeout(r, 2500));
    setIsPublishing(false);
    alert("Business Process Schema Published!");
  };

  const handleReload = () => {
    if (window.confirm("Reset all mappings? This action cannot be undone.")) {
      setMapping({});
      setFormData({});
    }
  };
  useEffect(() => {
    if (template) setSchema(template);
  }, [template]);

  const uiSchema = {
    "ui:submitButtonOptions": { norender: true },
    kpi_description: {
      "ui:widget": "textarea",
      "ui:placeholder": "Enter performance indicators...",
    },
  };
  const CustomAddButton = (props) => {
    const { onClick, disabled } = props;
    return (
      <div className="custom-add-wrapper">
        <button
          type="button"
          className="btn-add-item"
          onClick={onClick}
          disabled={disabled}>
          <FiPlus /> Add New Entry
        </button>
      </div>
    );
  };

  // 2. Custom các nút icon (như nút Remove)
  const CustomIconButton = (props) => {
    const { icon, onClick, disabled, className } = props;

    // Kiểm tra nếu là nút xóa (Remove)
    if (icon === "remove" || className?.includes("remove")) {
      return (
        <button
          type="button"
          className="btn-remove-item"
          onClick={onClick}
          disabled={disabled}
          title="Remove item">
          <FiTrash2 size={14} />
        </button>
      );
    }

    // Mặc định cho các icon khác nếu có
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={className}>
        {icon}
      </button>
    );
  };
  const handleMappingChange = (businessField, selectedColumn) => {
    const updatedMapping = { ...mapping, [businessField]: selectedColumn };
    setMapping(updatedMapping);

    if (previewData?.length > 0) {
      const sample = previewData[0];
      setFormData((prev) => ({
        ...prev,
        [businessField]: sample[selectedColumn] || "",
      }));
    }
  };

  if (!schema)
    return <div className="loading-state">Initializing Workspace...</div>;

  const businessFields = Object.keys(schema.properties || {});
  const previewColumns =
    previewData?.length > 0 ? Object.keys(previewData[0]) : [];
  const progress = Math.round(
    (Object.keys(mapping).length / businessFields.length) * 100,
  );

  return (
    <div className="workspace-container">
      {/* TOP NAVIGATION BAR */}
      <header className="workspace-navbar">
        <div className="nav-left">
          <div className="app-logo">
            <FiZap className="logo-icon" />
          </div>
          <div className="breadcrumb">
            <span className="root">Contracts</span>
            <span className="separator">/</span>
            <span className="current">Smart Forge Editor</span>
          </div>
        </div>

        <div className="nav-center">
          <div className="status-badge">
            <div className="pulse-dot"></div>
            Draft Mode
          </div>
        </div>

        <div className="nav-right">
          <button
            className="btn-icon"
            onClick={handleReload}
            title="Reset mapping">
            <FiRotateCcw className={isSaving ? "spin" : ""} />
          </button>
          <button
            className={`btn-outline ${isSaving ? "loading" : ""}`}
            onClick={handleSave}>
            {isSaving ? <div className="spinner" /> : <FiSave />} Save Draft
          </button>
          <button
            className={`btn-filled ${isPublishing ? "loading" : ""}`}
            onClick={handlePublish}>
            {isPublishing ? (
              "Deploying..."
            ) : (
              <>
                <FiSend /> Publish Schema
              </>
            )}
          </button>
        </div>
      </header>

      {/* MAIN WORKSPACE AREA */}
      <main className="workspace-main">
        {/* LEFT: CONTROL PANEL (MAPPING) */}
        <section className="workspace-panel control-panel">
          <div className="panel-header">
            <div className="header-title">
              <h3>
                <FiLink /> Data Mapping
              </h3>
              <p>Link your source columns to contract fields</p>
            </div>
            <div className="progress-indicator">
              <span>{progress}%</span>
              <svg className="progress-ring" width="36" height="36">
                <circle className="bg" cx="18" cy="18" r="16" />
                <circle
                  className="fill"
                  cx="18"
                  cy="18"
                  r="16"
                  style={{ strokeDasharray: `${progress * 1}, 100` }}
                />
              </svg>
            </div>
          </div>

          <div className="mapping-list">
            {businessFields.map((field) => {
              const fieldSchema = schema.properties[field];
              const isMapped = !!mapping[field];
              return (
                <div
                  key={field}
                  className={`mapping-item ${isMapped ? "is-mapped" : ""}`}>
                  <div className="field-info">
                    <span className="field-name">
                      {fieldSchema.title || field}
                    </span>
                    <span className="field-type">{fieldSchema.type}</span>
                  </div>
                  <div className="mapping-selector">
                    <FiDatabase className="input-icon" />
                    <select
                      value={mapping[field] || ""}
                      onChange={(e) =>
                        handleMappingChange(field, e.target.value)
                      }>
                      <option value="">Choose source column...</option>
                      {previewColumns.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                    {isMapped && <FiCheckCircle className="success-icon" />}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* RIGHT: LIVE CANVAS (PREVIEW) */}
        <section className="workspace-panel canvas-panel">
          <div className="canvas-toolbar">
            <div className="toolbar-left">
              <FiLayout /> <span>Live Preview</span>
            </div>
            <div className="toolbar-right">
              <span className="zoom-level">100%</span>
            </div>
          </div>

          <div className="canvas-viewport">
            <div className="document-page">
              <div className="document-header">
                <h1>{schema.title || "Standard Agreement"}</h1>
                <p className="doc-id">
                  Reference: #FORGE-{new Date().getFullYear()}
                </p>
              </div>

              <div className="rjsf-wrapper">
                <Form
                  schema={schema}
                  uiSchema={uiSchema}
                  formData={formData}
                  validator={validator}
                  templates={{
                    ButtonTemplates: {
                      AddButton: CustomAddButton,
                    },
                    IconButton: CustomIconButton,
                  }}
                  onChange={(e) => setFormData(e.formData)}
                />
              </div>
              <footer className="canvas-footer">
                <div className="footer-status">
                  <div className="security-tag">
                    <FiCheckCircle /> AES-256 Encrypted
                  </div>
                  <span className="divider">|</span>
                  <span className="last-sync">Last sync: Just now</span>
                </div>
                <button className="btn-finalize" onClick={handlePublish}>
                  <span>Finalize & Commit Process</span>
                  <FiZap />
                </button>
              </footer>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ContractBuilder;
