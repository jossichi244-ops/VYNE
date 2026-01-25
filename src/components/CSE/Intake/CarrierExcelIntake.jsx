import React, { useState } from "react";
import {
  FiFileText,
  FiUpload,
  FiCheckCircle,
  FiLoader,
  FiZap,
} from "react-icons/fi";
import "./CarrierExcelIntake.scss";

const CarrierExcelIntake = () => {
  const [status, setStatus] = useState("idle"); // idle | uploading | success

  const handleUpload = () => {
    setStatus("uploading");
    setTimeout(() => setStatus("success"), 2500);
  };

  return (
    <div className={`excel-intake-portal ${status}`}>
      <div className="portal-inner">
        {/* Lớp nền hiệu ứng */}
        <div className="energy-wave"></div>

        <div className="content-core">
          <div className="icon-mainframe">
            <div className="aura"></div>
            <div className="icon-wrapper">
              {status === "success" ? (
                <FiCheckCircle className="icon success-icon" />
              ) : status === "uploading" ? (
                <FiLoader className="icon spin-icon" />
              ) : (
                <FiFileText className="icon idle-icon" />
              )}
            </div>
          </div>

          <div className="text-display">
            <div className="status-tag">
              <FiZap className="zap" />
              <span>
                {status === "success" ? "DATA_SYNCED" : "MASTER_DATA_INTAKE"}
              </span>
            </div>
            <h3 className="title">Carrier Rate Card</h3>
            <p className="description">
              Upload Master Excel để đồng bộ hóa bảng giá vận chuyển và vùng phủ
              sóng toàn cầu.
            </p>
          </div>

          <button
            onClick={handleUpload}
            disabled={status === "uploading"}
            className="intake-button">
            <div className="btn-glare"></div>
            <span className="btn-content">
              {status === "uploading" ? (
                "ĐANG XỬ LÝ DỮ LIỆU..."
              ) : status === "success" ? (
                "CẬP NHẬT THÀNH CÔNG"
              ) : (
                <>
                  <FiUpload /> UPLOAD MASTER DATA
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarrierExcelIntake;
