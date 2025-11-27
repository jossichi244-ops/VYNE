// components/company/CompanyDetails.jsx
import React, { useState, useEffect } from "react";
import { XCircle, CheckCircle, Loader, QrCode } from "lucide-react";
import {
  getCompanyById,
  approveCompany,
  getCompanyQRs,
  //   rejectCompany, // giả sử bạn có API reject
} from "../../services/companyService";

import styles from "../../assets/styles/companyDetails.module.scss";

const CompanyDetails = ({ companyId, onClose, onUpdate }) => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [qrCodes, setQrCodes] = useState([]);
  const [qrLoading, setQrLoading] = useState(false);

  useEffect(() => {
    if (!companyId) return;
    const fetchCompany = async () => {
      setLoading(true);
      try {
        const res = await getCompanyById(companyId);
        setCompany(res.data);
      } catch (err) {
        console.error(err);
        setError("Không tải được thông tin công ty");
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [companyId]);

  useEffect(() => {
    if (!company || company.status !== "approved") return;

    const fetchQrCodes = async () => {
      setQrLoading(true);
      try {
        const res = await getCompanyQRs(company.company_id);

        // Log toàn bộ response từ backend
        console.log("GET /qr/:company_id response:", res.data);

        // Truy cập đúng trường qrList
        setQrCodes(Array.isArray(res.data.qrList) ? res.data.qrList : []);
      } catch (err) {
        console.error("Lỗi khi fetch QR codes:", err);
      } finally {
        setQrLoading(false);
      }
    };

    fetchQrCodes();
  }, [company]);

  const handleApprove = async () => {
    if (!company) return;
    setActionLoading(true);
    setError(null);
    try {
      const res = await approveCompany(company.company_id);
      setSuccessMsg(res.data.message || "Đã approve công ty!");
      onUpdate && onUpdate(); // callback reload table nếu cần
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Approve thất bại");
    } finally {
      setActionLoading(false);
    }
  };

  //   const handleReject = async () => {
  //     if (!company) return;
  //     setActionLoading(true);
  //     setError(null);
  //     try {
  //       const res = await rejectCompany(company.company_id); // Nếu API reject có
  //       setSuccessMsg(res.data.message || "Đã reject công ty!");
  //       onUpdate && onUpdate();
  //     } catch (err) {
  //       console.error(err);
  //       setError(err.response?.data?.message || "Reject thất bại");
  //     } finally {
  //       setActionLoading(false);
  //     }
  //   };

  if (!companyId) return null;

  return (
    <div className={styles.detailsOverlay}>
      <div className={styles.detailsCard}>
        <header className={styles.header}>
          <h2>Chi tiết công ty</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <XCircle size={24} />
          </button>
        </header>
        {loading ? (
          <div className={styles.loading}>
            <Loader size={32} /> Đang tải...
          </div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <div className={styles.content}>
            <p>
              <strong>Tên doanh nghiệp:</strong> {company.business_name}
            </p>
            <p>
              <strong>Mã số thuế:</strong> {company.tax_code}
            </p>
            <p>
              <strong>Loại hình:</strong> {company.type || "Không xác định"}
            </p>
            <p>
              <strong>Trạng thái:</strong> {company.status}
            </p>
            <p>
              <strong>Ngày đăng ký:</strong>
              {new Date(company.created_at).toLocaleString()}
            </p>
            <div className={styles.actions}>
              <button
                className={styles.approveBtn}
                onClick={handleApprove}
                disabled={actionLoading || company.status === "approved"}>
                <CheckCircle size={18} /> Approve
              </button>
              <button
                className={styles.rejectBtn}
                disabled={actionLoading || company.status === "rejected"}>
                <XCircle size={18} /> Reject
              </button>
            </div>
            {actionLoading && (
              <p className={styles.loadingText}>Đang xử lý...</p>
            )}
            {successMsg && <p className={styles.success}>{successMsg}</p>}
            {/* Hiển thị QR codes */}
            {company.status === "approved" && (
              <div className={styles.qrSection}>
                <h3>
                  <QrCode size={20} className={styles.qrIcon} /> QR Codes của
                  công ty
                </h3>
                {qrLoading ? (
                  <div className={styles.qrLoading}>
                    <Loader size={24} /> Đang tải dữ liệu QR...
                  </div>
                ) : qrCodes.length === 0 ? (
                  <p className={styles.noQrCodes}>
                    Chưa có QR code nào được tạo cho công ty này.
                  </p>
                ) : (
                  <div className={styles.qrGrid}>
                    {qrCodes.map((qr) => (
                      <div key={qr._id} className={styles.qrItem}>
                        <p>{qr.user_alias}</p>
                        <img
                          src={qr.qr_image}
                          alt={`QR Code for ${qr.user_alias}`}
                        />
                        <span
                          className={`${styles.qrStatus} ${
                            qr.status === "active"
                              ? styles.active
                              : styles.inactive
                          }`}>
                          {qr.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetails;
