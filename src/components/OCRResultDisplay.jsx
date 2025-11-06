import React, { useMemo } from "react";
import FilePreview from "./OCR/FilePreview";
import OCRTextOutput from "./OCR/OCRTextOutput";
import OCRVisualDetails from "./OCR/OCRVisualDetails";
import "../assets/styles/OCRResultDisplay.scss";

const OCRResultDisplay = ({ result, uploadedFile }) => {
  // Sử dụng ocr làm tên biến thống nhất, tránh nhiều cấp truy cập
  const ocr = result?.ocr_result || result?.ocr || result;

  // useMemo để tránh tạo lại URL không cần thiết mỗi lần render
  const annotatedImageURL = useMemo(() => {
    if (ocr?.annotated_image) {
      return `data:image/jpeg;base64,${ocr.annotated_image}`;
    }
    return null;
  }, [ocr?.annotated_image]);

  if (!ocr || (!ocr.text && !ocr.details)) {
    return (
      <div className="result-placeholder">
        Không có kết quả nào để hiển thị.
      </div>
    );
  }

  return (
    <div className="ocr-result-grid">
      {/* Cột 1: Hiển thị tệp nguồn */}
      <div className="file-source-box">
        <h3 className="section-title">📂 Tệp Nguồn Đã Tải Lên</h3>
        <FilePreview file={uploadedFile} />
      </div>

      {/* Cột 2: Hiển thị văn bản thô */}
      <div className="text-output-column">
        <h3 className="section-title">🧠 Văn Bản Trích Xuất (Thô)</h3>
        <OCRTextOutput text={ocr.text} />
      </div>

      {/* Cột 3: Hình ảnh chú thích và bảng chi tiết */}
      <div className="visual-details-column">
        <OCRVisualDetails imageUrl={annotatedImageURL} details={ocr.details} />
      </div>
    </div>
  );
};

export default OCRResultDisplay;
