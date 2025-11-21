// UploadSchemaPage.jsx
import React, { useState } from "react";
import FileUploader from "../components/FileUploader.jsx";
// import SchemaEditor from "../components/SchemaEditor.jsx";
import DataInspectionPanel from "../components/DataInspectionPanel.jsx";
import DataCleaningPanel from "../components/DataCleaningPanel.jsx";
import DescriptivePanel from "../components/DescriptivePanel.jsx";
import VisualizationPanel from "../components/VisualizationPanel.jsx";
import RelationshipsPanel from "../components/RelationshipsPanel.jsx";
import AdvancedAnalysisPanel from "../components/AdvancedAnalysisPanel.jsx";
import MongoDBPreview from "../components/MongoDBPreview.jsx";
import Tabs from "../components/Tabs.jsx";
import InsightCard from "../components/InsightCard.jsx";
import ReportVisualizer from "../components/ReportVisualizer.jsx";
import "../assets/styles/upload.scss";
import PredictionResultPanel from "../components/PredictionResultPanel.jsx";
import BeyondEDAViewer from "../components/BeyondEDAViewer.jsx";
import AnalysisTimingDisplay from "../components/AnalysisTimingDisplay.jsx";

export default function UploadSchemaPage() {
  // --- STATE VARIABLES ---
  // const [schema, setSchema] = React.useState(null);
  // const [uiSchema, setUiSchema] = React.useState({});
  const [rawPreviewRows, setRawPreviewRows] = React.useState([]);
  const [understanding, setUnderstanding] = React.useState([]);
  const [inspection, setInspection] = React.useState(null);
  const [cleaning, setCleaning] = React.useState(null);
  const [descriptive, setDescriptive] = React.useState(null);
  const [visualizations, setVisualizations] = React.useState(null);
  const [relationships, setRelationships] = React.useState(null);
  const [advanced, setAdvanced] = React.useState(null);
  const [insights, setInsights] = React.useState([]);
  const [businessReport, setBusinessReport] = React.useState(null);
  const [predictionResult, setPredictionResult] = React.useState(null);
  const [beyondEDAData, setBeyondEDAData] = React.useState(null);
  const [analysisTiming, setAnalysisTiming] = useState(null);

  // KHẮC PHỤC LỖI: Thêm state isDataLoaded
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // KHẮC PHỤC LỖI: Định nghĩa hàm handleDataLoad
  const handleDataLoad = (
    generatedSchema,
    previewRows,
    analysis,
    inspectionResult,
    cleaningResult,
    descriptiveResult,
    visualizationResult,
    relationshipsResult,
    advancedResult,
    insightsResult,
    businessReportResult,
    predictionResultData,
    beyondEDAResult,
    timingData
  ) => {
    // setSchema(generatedSchema);
    setRawPreviewRows(previewRows || []);
    setUnderstanding(analysis || []);
    setInspection(inspectionResult || null);
    setCleaning(cleaningResult || null);
    setDescriptive(descriptiveResult || null);
    setVisualizations(visualizationResult || null);
    setRelationships(relationshipsResult || null);
    setAdvanced(advancedResult || null);
    setInsights(insightsResult || []);
    setBusinessReport(businessReportResult || null);
    setPredictionResult(predictionResultData);
    setBeyondEDAData(beyondEDAResult || null);
    setAnalysisTiming(timingData || null);

    // Đặt cờ báo hiệu dữ liệu đã tải xong
    setIsDataLoaded(true);
  };

  const tabs = React.useMemo(() => {
    // ... (Giữ nguyên logic tạo tabs)
    const panels = [];

    if (understanding?.length > 0) {
      panels.push({
        id: "understanding",
        title: "Data Understanding",
        content: (
          <section className="data-understanding-section">
            <table className="data-understanding">
              <thead>
                <tr>
                  <th>Column</th>
                  <th>Data Type</th>
                  <th>Example</th>
                  <th>Statistics</th>
                </tr>
              </thead>
              <tbody>
                {understanding.map((col, idx) => (
                  <tr key={idx}>
                    <td>{col.name}</td>
                    <td>{col.inferred_type}</td>
                    <td>{col.example?.join(", ")}</td>
                    <td>
                      <pre>{JSON.stringify(col.stats, null, 2)}</pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ),
      });
    }

    if (rawPreviewRows?.length > 0) {
      panels.push({
        id: "sample-data",
        title: "Sample Data",
        content: <MongoDBPreview data={rawPreviewRows} />,
      });
    }

    if (inspection) {
      panels.push({
        id: "inspection",
        title: "Data Inspection",
        content: <DataInspectionPanel inspection={inspection} />,
      });
    }

    if (cleaning) {
      panels.push({
        id: "cleaning",
        title: "Data Cleaning",
        content: <DataCleaningPanel cleaning={cleaning} />,
      });
    }

    if (descriptive) {
      console.log("DescriptivePanel data:", descriptive);

      panels.push({
        id: "descriptive",
        title: "Descriptive Statistics",
        content: <DescriptivePanel descriptive={descriptive} />,
      });
    }

    if (visualizations) {
      panels.push({
        id: "visualizations",
        title: "Visualizations",
        content: <VisualizationPanel visualizations={visualizations} />,
      });
    }

    if (relationships) {
      panels.push({
        id: "relationships",
        title: "Relationships",
        content: <RelationshipsPanel relationships={relationships} />,
      });
    }

    if (advanced) {
      panels.push({
        id: "advanced",
        title: "Advanced Analysis",
        content: <AdvancedAnalysisPanel advanced={advanced} />,
      });
    }

    if (insights?.length > 0) {
      panels.push({
        id: "insights",
        title: "Insights",
        content: (
          <section className="insights-section">
            {insights.map((ins, idx) => {
              let type = "info";
              if (ins.includes("❗") || ins.includes("⚠️")) type = "warning";
              if (ins.includes("✅")) type = "success";
              if (ins.includes("🚨")) type = "error";
              return (
                <InsightCard
                  key={idx}
                  type={type}
                  title={`Insight ${idx + 1}`}
                  message={ins}
                />
              );
            })}
          </section>
        ),
      });
    }
    if (businessReport) {
      panels.push({
        id: "business-report",
        title: "Business Report",
        content: <ReportVisualizer report={businessReport} />,
      });
    }

    if (beyondEDAData) {
      panels.push({
        id: "beyond-eda",
        title: "Beyond EDA",
        content: <BeyondEDAViewer apiData={beyondEDAData} />,
      });
    }

    if (predictionResult) {
      panels.push({
        id: "prediction",
        title: "Prediction Result",
        content: <PredictionResultPanel data={predictionResult} />,
      });
    }

    return panels;
  }, [
    understanding,
    rawPreviewRows,
    inspection,
    cleaning,
    descriptive,
    visualizations,
    relationships,
    advanced,
    insights,
    businessReport,
    predictionResult,
    beyondEDAData,
  ]);

  console.log("Data being passed to SchemaEditor:", rawPreviewRows);

  return (
    <div className="page-upload-schema analysis-dashboard">
      <header className="upload-header dashboard-header">
        <h1>📊 Tự động Phân tích Dữ liệu (Auto EDA)</h1>
        <p>Dữ liệu đã được tải thành công từ API và sẵn sàng cho phân tích.</p>
        {analysisTiming && <AnalysisTimingDisplay timing={analysisTiming} />}
      </header>

      {/* Ẩn FileUploader, chỉ sử dụng để kích hoạt tải dữ liệu từ API */}
      <div style={{ display: "none" }}>
        {/* Lỗi 'handleDataLoad' is not defined đã được khắc phục ở trên */}
        <FileUploader onSchema={handleDataLoad} />
      </div>

      {/* Lỗi 'isDataLoaded' is not defined đã được khắc phục ở trên */}
      {isDataLoaded && (
        <div className="dashboard-content">
          <div className="top-section">
            {/* <div className="schema-editor-panel">
              <h2>⚙️ Metadata & Chỉnh sửa Schema</h2>
              <SchemaEditor
                schema={schema}
                setSchema={setSchema}
                uiSchema={uiSchema}
                data={rawPreviewRows}
                setData={setRawPreviewRows}
                setUiSchema={setUiSchema}
              />
            </div> */}
          </div>

          {tabs.length > 0 ? (
            <div className="analysis-tabs">
              <Tabs tabs={tabs} />
            </div>
          ) : (
            <div className="loading-placeholder">
              {/* Hiển thị thông báo nếu dữ liệu đã tải nhưng chưa có kết quả phân tích */}
              <p>Chờ đợi kết quả phân tích...</p>
            </div>
          )}
        </div>
      )}

      {/* Lỗi 'isDataLoaded' is not defined đã được khắc phục ở trên */}
      {!isDataLoaded && (
        <div className="initial-loading-state">
          {/* Nội dung loading của FileUploader sẽ được hiển thị nếu bạn bỏ style={{ display: "none" }} */}
        </div>
      )}
    </div>
  );
}
