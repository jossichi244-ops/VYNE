import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiUpload, FiFileText, FiDatabase } from "react-icons/fi";

import "./ExcelIntake.scss";

// import { parseFile } from "../ExcelIntake/utils/fileParser";
import {
  previewExcelFull,
  previewFileLocal,
} from "../ExcelIntake/utils/previewParser";
import { autoMapFields } from "../ExcelIntake/utils/mappingEngine";
import { detectConflicts } from "../ExcelIntake/utils/conflictDetector";
import { useFileStore } from "../ExcelIntake/state/useFileStore";

import ReportContainer from "../../ReportEngine/ReportContainer";
import ReportLayout from "../../../../layouts/ReportLayout";
import FileSummary from "./components/FileSummary";
import ConflictDetector from "./components/ConflictDetector";
import CostImpact from "./components/CostImpact";
import OperationalActions from "./components/OperationalActions";
import BulkOperations from "./components/BulkOperations";
import DataPreviewTable from "./components/DataPreviewTable";
import HeaderFooterSelector from "./components/HeaderFooterSelector";
import SchemaViewer from "./components/SchemaViewer";
import { parseCleanData } from "../ExcelIntake/utils/fileParser";
import ContractBuilder from "./components/ContractBuilder";
import { generateBusinessTemplate } from "../ExcelIntake/services/contractService";
import { ReportProvider } from "../../ReportUpload/ReportContext";
const ExcelIntake = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [businessTemplate, setBusinessTemplate] = useState(null);
  const [activeTab, setActiveTab] = useState("intake");
  const [step, setStep] = useState("upload");
  const [rawPreview, setRawPreview] = useState([]);
  const [headerRowIndex, setHeaderRowIndex] = useState(null);
  const [footerRowIndex, setFooterRowIndex] = useState(null);
  // const [setReportDataset] = useState(null);
  // NEW
  const [allSheets, setAllSheets] = useState({});
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const {
    setFile,
    setRows,
    setMappings,
    setConflicts,
    reset,
    rows,

    conflicts,
  } = useFileStore();

  const handleUpload = async (file) => {
    if (!file) return;

    setError(null);
    setLoading(true);
    reset();

    try {
      setFile(file);

      const ext = file.name.split(".").pop().toLowerCase();

      if (ext === "xlsx" || ext === "xls") {
        const result = await previewExcelFull(file);

        setAllSheets(result.sheets);
        setSheetNames(result.sheetNames);

        const firstSheet = result.sheetNames[0];
        setSelectedSheet(firstSheet);
        setRawPreview(result.sheets[firstSheet]);
      } else {
        const previewRows = await previewFileLocal(file, 1000);
        setRawPreview(previewRows);
      }

      setStep("preview");
    } catch (err) {
      console.error(err);
      setError("Failed to preview file");
    } finally {
      setLoading(false);
    }
  };

  const confirmStructure = async () => {
    if (headerRowIndex === null) {
      setError("Please select a header row");
      return;
    }

    try {
      setLoading(true);

      const start = headerRowIndex;
      const end = footerRowIndex !== null ? footerRowIndex : rawPreview.length;

      if (start >= end) {
        setError("Start row must be before end row");
        return;
      }

      // ✅ CẮT DỮ LIỆU
      const cleanedRows = rawPreview.slice(start, end);

      const headers = cleanedRows[0];
      const dataRows = cleanedRows.slice(1);

      // ✅ CHUYỂN THÀNH OBJECT RECORDS
      const records = dataRows.map((row) =>
        Object.fromEntries(headers.map((h, i) => [h, row[i]])),
      );

      console.log("Sending cleaned records:", records);

      // ✅ GỬI JSON SẠCH
      const result = await parseCleanData(records);
      setAnalysisResult(result);
      setRows(result.preview || []);
      console.log("Received analysis result:", result);
      if (result.schema) {
        const template = await generateBusinessTemplate(result.schema);
        setBusinessTemplate(template);
      }

      if (result.preview?.length > 0) {
        const columns = Object.keys(result.preview[0]);
        setMappings(autoMapFields(columns));
        setConflicts(detectConflicts(result.preview));
      }

      setStep("processing");
    } catch (err) {
      console.error(err);
      setError("Failed to process data");
    } finally {
      setLoading(false);
    }
  };

  // ================= DRAG & DROP =================
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleUpload(file);
  };

  const handleTabChange = (tab) => {
    if (tab === "report" && !analysisResult) return;

    setActiveTab(tab);
  };
  const buildReportDataset = (analysis) => {
    if (!analysis) return null;

    return {
      data: analysis.preview,
      schema: analysis.schema,
      summary: analysis.file_summary,
      insights: analysis.insights,
      relationships: analysis.relationships,
      descriptive: analysis.descriptive,
      visualizations: analysis.visualizations,
      advanced: analysis.advanced_analysis,
      businessReport: analysis.business_report,
    };
  };
  return (
    <div className="logistics-intake-wrapper">
      <div className="tab-navigation-wrapper">
        <div className="tab-group">
          <button
            className={`tab-item ${activeTab === "intake" ? "active" : ""}`}
            onClick={() => handleTabChange("intake")}>
            <FiDatabase className="tab-icon" />
            <span>Logistics Intake</span>
          </button>

          {analysisResult && (
            <button
              className={`tab-item ${activeTab === "report" ? "active" : ""}`}
              onClick={() => handleTabChange("report")}>
              <FiFileText className="tab-icon" />
              <span>Self Reporting</span>
              <span className="badge-new">New</span>
            </button>
          )}
        </div>
      </div>
      {/* ================= UPLOAD ZONE ================= */}
      {activeTab === "intake" && (
        <motion.div
          className={`upload-terminal ${isDragging ? "dragging" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          whileHover={{ scale: 1.01 }}>
          <div className="terminal-inner">
            <FiUpload size={40} />
            <h3>Drop Logistics Manifest</h3>
            <p>XLSX, CSV, JSON supported</p>

            <input
              type="file"
              accept=".xlsx,.xls,.csv,.json"
              onChange={(e) => handleUpload(e.target.files[0])}
            />

            {loading && <p>Processing...</p>}
            {error && <p className="error">{error}</p>}
          </div>
        </motion.div>
      )}
      {activeTab === "report" && analysisResult && (
        <ReportProvider initialDataset={buildReportDataset(analysisResult)}>
          <ReportLayout>
            <ReportContainer dataset={buildReportDataset(analysisResult)} />
          </ReportLayout>
        </ReportProvider>
      )}
      {/* ================= PREVIEW STEP ================= */}
      {activeTab === "intake" &&
        step === "preview" &&
        rawPreview.length > 0 && (
          <div className="preview-step">
            {/* ===== SHEET TABS ===== */}
            {sheetNames.length > 0 && (
              <div className="sheet-tabs">
                {sheetNames.map((name) => (
                  <button
                    key={name}
                    className={selectedSheet === name ? "active" : ""}
                    onClick={() => {
                      setSelectedSheet(name);
                      setRawPreview(allSheets[name]);
                      setHeaderRowIndex(null);
                      setFooterRowIndex(null);
                    }}>
                    {name}
                  </button>
                ))}
              </div>
            )}

            <h4>Select Data Region</h4>

            <div className="table-scroll-wrapper">
              <HeaderFooterSelector
                rows={rawPreview}
                startRow={headerRowIndex}
                endRow={footerRowIndex}
                onSelectStart={setHeaderRowIndex}
                onSelectEnd={setFooterRowIndex}
              />
            </div>

            <button className="confirm-btn" onClick={confirmStructure}>
              Confirm & Analyze
            </button>
          </div>
        )}

      {/* ================= ANALYSIS STEP ================= */}
      {activeTab === "intake" && step === "processing" && rows.length > 0 && (
        <>
          {analysisResult?.file_summary && (
            <FileSummary analysis={analysisResult} />
          )}

          {/* 🔹 EDA Schema Viewer */}
          {analysisResult?.schema && (
            <SchemaViewer schema={analysisResult.schema} />
          )}

          {/* 🔥 Business Contract Builder */}
          {businessTemplate && (
            <ContractBuilder template={businessTemplate} previewData={rows} />
          )}

          <DataPreviewTable rows={rows} conflicts={conflicts} />
          {conflicts.length > 0 && <ConflictDetector issues={conflicts} />}
          <CostImpact rows={rows} />
          <OperationalActions disabledReasons={conflicts} />
          <BulkOperations />
        </>
      )}
    </div>
  );
};

export default ExcelIntake;
