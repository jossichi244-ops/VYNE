import { useState } from "react";

const CompanyForm = ({ onSubmit, loading }) => {
  const [businessName, setBusinessName] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const [type, setType] = useState("");

  const companyTypes = [
    "manufacturer",
    "supplier",
    "distributor",
    "logistics_provider",
    "carrier",
    "warehouse",
    "retailer",
    "customs_broker",
    "financial_institution",
    "other",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      business_name: businessName,
      tax_code: taxCode,
      type,
    });
  };

  return (
    <form className="company-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Tên doanh nghiệp *</label>
        <input
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Mã số thuế *</label>
        <input
          type="text"
          value={taxCode}
          onChange={(e) => setTaxCode(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Loại hình doanh nghiệp</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">-- Chọn loại hình --</option>
          {companyTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Đang gửi..." : "Đăng ký"}
      </button>
    </form>
  );
};

export default CompanyForm;
