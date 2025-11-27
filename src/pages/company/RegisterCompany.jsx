import { useState } from "react";
import CompanyForm from "../../components/company/CompanyForm";
import CompanyTable from "../../components/company/CompanyTable";
import CompanyDetails from "../../components/company/CompanyDetails";
import { createCompany } from "../../services/companyService";

const RegisterCompany = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // 🔹 State để lưu công ty được chọn
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  const handleCreateCompany = async (payload) => {
    try {
      setLoading(true);
      setMessage("");
      await createCompany(payload);
      setMessage("Đăng ký thành công! Công ty của bạn đang chờ duyệt.");
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-company-page">
      {/* ------------------------------------- */}
      {/* PHẦN ĐĂNG KÝ */}
      {/* ------------------------------------- */}
      <section className="registration-section">
        <h1 className="web3-title">
          Đăng ký Doanh nghiệp (Blockchain Registry)
        </h1>

        <CompanyForm onSubmit={handleCreateCompany} loading={loading} />

        {message && (
          <p
            className={`message ${
              message.includes("thành công") ? "success" : "error"
            }`}>
            {message}
          </p>
        )}
      </section>

      {/* ------------------------------------- */}
      {/* BẢNG DANH SÁCH CÔNG TY */}
      {/* ------------------------------------- */}
      <section className="table-section">
        <h2 className="web3-subtitle">Danh sách Công ty Đã Đăng ký</h2>

        <CompanyTable
          key={refreshKey}
          onRowClick={(companyId) => setSelectedCompanyId(companyId)}
        />
      </section>

      {/* ------------------------------------- */}
      {/* MODAL CHI TIẾT CÔNG TY */}
      {/* ------------------------------------- */}
      {selectedCompanyId && (
        <CompanyDetails
          companyId={selectedCompanyId}
          onClose={() => setSelectedCompanyId(null)}
          onUpdate={() => setRefreshKey((prev) => prev + 1)}
        />
      )}
    </div>
  );
};

export default RegisterCompany;
