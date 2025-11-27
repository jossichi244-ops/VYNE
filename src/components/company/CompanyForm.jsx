import React, { useState, useMemo } from "react";

import { Building, Hash, Tag, Send, XCircle } from "lucide-react";

import "../../assets/styles/company/CompanyForm.scss";

const COMPANY_TYPE_OPTIONS = {
  manufacturer: "Nhà sản xuất",
  supplier: "Nhà cung cấp",
  distributor: "Nhà phân phối",
  logistics_provider: "Nhà cung cấp Logistics (3PL)",
  carrier: "Hãng vận chuyển (Carrier)",
  warehouse: "Kho bãi (Warehouse)",
  retailer: "Nhà bán lẻ",
  customs_broker: "Đại lý Hải quan",
  financial_institution: "Tổ chức Tài chính",
  other: "Khác",
};

const InputField = ({
  label,
  value,
  onChange,
  icon: Icon,
  name,
  required,
  placeholder,
  className = "",
}) => (
  <div className={`form-group ${className}`}>
    <label className="input-label">
      {Icon && <Icon size={16} className="icon-prefix" />}
      {label} {required && <span className="required-star">*</span>}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder || label}
      className="input-field"
      aria-label={label}
      autoComplete="off"
    />
  </div>
);

// =======================
// 🏭 Component Form Chính
// =======================

const CompanyForm = ({ onSubmit, loading }) => {
  // Khởi tạo state với cấu trúc rõ ràng hơn
  const [formData, setFormData] = useState({
    business_name: "",
    tax_code: "",
    type: "", // Mongoose schema ghi là required: false (nhưng nên có giá trị mặc định/null)
  });

  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.business_name.trim() || !formData.tax_code.trim()) {
      setError("Vui lòng điền đầy đủ Tên doanh nghiệp và Mã số thuế.");
      return;
    }

    // Tax code validation (Basic check)
    if (formData.tax_code.length < 8) {
      setError("Mã số thuế phải có ít nhất 8 ký tự.");
      return;
    }

    // Gửi dữ liệu đã được làm sạch (trim)
    onSubmit({
      business_name: formData.business_name.trim(),
      tax_code: formData.tax_code.trim(),
      type: formData.type || null, // Gửi null nếu không chọn gì, tương thích với required: false
    });
  };

  const companyTypeKeys = useMemo(() => Object.keys(COMPANY_TYPE_OPTIONS), []);

  return (
    <form className="company-form" onSubmit={handleSubmit}>
      <header className="form-header">
        <Building size={28} className="header-icon" />
        <h2>Đăng ký Doanh nghiệp</h2>
      </header>

      {/* Hiển thị lỗi (nếu có) */}
      {error && (
        <div className="alert-error">
          <XCircle size={18} /> {error}
        </div>
      )}

      {/* 1. Tên doanh nghiệp (required) */}
      <InputField
        label="Tên doanh nghiệp"
        name="business_name"
        value={formData.business_name}
        onChange={handleInputChange}
        required={true}
        icon={Building}
        placeholder="VD: Công ty TNHH Vận tải X"
      />

      {/* 2. Mã số thuế (required, unique) */}
      <InputField
        label="Mã số thuế"
        name="tax_code"
        value={formData.tax_code}
        onChange={handleInputChange}
        required={true}
        icon={Hash}
        placeholder="VD: 0100xxxxxx"
      />

      {/* 3. Loại hình doanh nghiệp (enum, optional) */}
      <div className="form-group select-group">
        <label className="input-label">
          <Tag size={16} className="icon-prefix" />
          Loại hình doanh nghiệp
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          className="select-field"
          aria-label="Loại hình doanh nghiệp">
          {/* Giá trị rỗng cho trường optional */}
          <option value="">-- Chọn loại hình (Tùy chọn) --</option>
          {companyTypeKeys.map((t) => (
            <option key={t} value={t}>
              {COMPANY_TYPE_OPTIONS[t]} ({t})
            </option>
          ))}
        </select>
      </div>

      <button type="submit" disabled={loading} className="submit-button">
        <Send size={18} />{" "}
        {loading ? "Đang gửi hồ sơ..." : "Đăng ký Doanh nghiệp"}
      </button>

      <p className="form-note">
        <span className="required-star">*</span> Trường bắt buộc
      </p>
    </form>
  );
};

export default CompanyForm;
