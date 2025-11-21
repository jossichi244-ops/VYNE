// src/components/FileUploader.jsx
import React, { useEffect, useState } from "react";
import { fetchAutoEDA } from "../services/trackingService";
import "../assets/styles/fileUploader.scss";

export default function FileUploader({ onSchema }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAutoEDA(); // gọi API backend
        // Giả sử dữ liệu trả về đã giống với cấu trúc trước
        onSchema(
          data.results.schema,
          data.results.preview,
          data.results.understanding,
          data.results.inspection,
          data.results.cleaning,
          data.results.descriptive,
          data.results.visualizations,
          data.results.relationships,
          data.results.advanced,
          data.results.insights,
          data.results.business_report,
          data.results.prediction_result,
          data.results.advanced_analysis,
          data.results.analysis_timing
        );
      } catch (err) {
        console.error("Lỗi tải dữ liệu Auto EDA:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [onSchema]);

  return (
    <div className={`file-uploader ${isLoading ? "loading" : ""}`}>
      {isLoading ? (
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Loading Auto EDA data...</p>
        </div>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <p>Data loaded successfully.</p>
      )}
    </div>
  );
}
