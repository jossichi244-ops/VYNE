import React, { useState } from "react";
import "../../assets/styles/VNeIDVerifyModal.scss";
import { verifyIdentityService } from "../../services/identityService";

const VNeIDVerifyModal = ({
  isOpen,
  onClose,
  walletAddress,
  onVerifySuccess,
}) => {
  const [formData, setFormData] = useState({
    id_type: "CCCD",
    id_number: "",
    dob: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id_number || !formData.dob) {
      setError("Vui lòng nhập đầy đủ Số giấy tờ và Ngày sinh.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await verifyIdentityService({
        wallet_address: walletAddress,
        ...formData,
      });

      // Gọi hàm callback để cập nhật trạng thái UserProfile và đóng Modal
      onVerifySuccess(result.user);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Xác minh thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="vneid-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title-neon">VNeID Identity Verification </h3>

        <p className="modal-subtitle">
          Xác minh danh tính để mở khóa vai trò **'individual'**.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Loại Giấy tờ</label>
            <select
              name="id_type"
              value={formData.id_type}
              onChange={handleChange}
              className="cyber-input">
              <option value="CCCD">Căn cước Công dân (CCCD)</option>
              <option value="CMND">Chứng minh Nhân dân (CMND)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="id_number">Số Giấy tờ (*)</label>
            <input
              type="text"
              id="id_number"
              name="id_number"
              value={formData.id_number}
              onChange={handleChange}
              placeholder="Nhập số CCCD/CMND"
              className="cyber-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dob">Ngày sinh (*)</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="cyber-input"
              required
            />
          </div>

          {error && <p className="error-message-neon">{error}</p>}

          <div className="modal-actions">
            <button
              type="submit"
              className="action-button primary-glow verify-button"
              disabled={loading}>
              {loading ? "Đang xác minh..." : "Xác minh ngay"}
            </button>
            <button
              type="button"
              className="action-button tertiary-glow cancel-button"
              onClick={onClose}
              disabled={loading}>
              Hủy
            </button>
          </div>
        </form>

        <p className="note-text">
          Dữ liệu được mã hóa và đối chiếu với hệ thống VNeID.
        </p>
      </div>
    </div>
  );
};

export default VNeIDVerifyModal;
