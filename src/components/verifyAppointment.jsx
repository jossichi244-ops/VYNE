import React, { useState } from "react";
import { verifyAppointmentService } from "../services/identityService";
import "../assets/styles/verifyAppointment.scss";

const VerifyAppointment = ({ isOpen, onClose, userData, onVerifySuccess }) => {
  const [form, setForm] = useState({
    id_type: "CCCD",
    id_number: "",
    full_name: userData?.full_name || "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVerify = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await verifyAppointmentService({
        wallet_address: userData?.walletAddress,
        id_type: form.id_type,
        id_number: form.id_number,
        full_name: form.full_name,
      });

      setResult({ success: res.success, message: res.message });
      if (res.success) onVerifySuccess?.(res.user);
    } catch (err) {
      setResult({
        success: false,
        message: err.message || "Không thể xác minh bổ nhiệm.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="verify-modal">
        <h3>📄 Xác minh bổ nhiệm Owner</h3>
        <p className="modal-desc">
          Hệ thống sẽ đối chiếu thông tin cá nhân của bạn với dữ liệu VNeID và
          quyết định bổ nhiệm trong cơ sở dữ liệu.
        </p>

        <div className="form-group">
          <label>Loại giấy tờ</label>
          <select
            name="id_type"
            value={form.id_type}
            onChange={handleChange}
            className="input-field">
            <option value="CCCD">CCCD</option>
            <option value="CMND">CMND</option>
            <option value="Hộ chiếu">Hộ chiếu</option>
          </select>
        </div>

        <div className="form-group">
          <label>Số giấy tờ</label>
          <input
            type="text"
            name="id_number"
            value={form.id_number}
            onChange={handleChange}
            className="input-field"
            placeholder="Nhập số CCCD hoặc CMND"
          />
        </div>

        <div className="form-group">
          <label>Họ và tên</label>
          <input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            className="input-field"
            placeholder="Nhập họ tên đầy đủ"
          />
        </div>

        {result && (
          <div
            className={`result-message ${
              result.success ? "success" : "error"
            }`}>
            {result.message}
          </div>
        )}

        <div className="modal-actions">
          <button
            className="btn-secondary"
            onClick={onClose}
            disabled={loading}>
            Đóng
          </button>
          <button
            className="btn-primary"
            onClick={handleVerify}
            disabled={loading}>
            {loading ? "Đang xác minh..." : "Xác minh bổ nhiệm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyAppointment;
