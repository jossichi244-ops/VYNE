/* eslint-disable no-unused-vars */
import { useState } from "react";
import CompanyForm from "../../components/company/CompanyForm";
import { createCompany } from "../../services/companyService";

const RegisterCompany = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleCreateCompany = async (payload) => {
    try {
      setLoading(true);
      setMessage("");

      const res = await createCompany(payload);

      setMessage("Đăng ký thành công! Công ty của bạn đang chờ duyệt.");
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-company-page">
      <h1>Đăng ký công ty</h1>

      <CompanyForm onSubmit={handleCreateCompany} loading={loading} />

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default RegisterCompany;
