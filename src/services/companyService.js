import axios from "axios";
import { API_BASE } from "../constants/api";

const api = axios.create({
  baseURL: `${API_BASE}/api/comp`,
});

// 1. Đăng ký công ty
export const createCompany = (payload) => api.post("/reg_comp", payload);

// 2. Lấy tất cả công ty
export const getCompanies = () => api.get("/reg_comp");

// 3. Lấy công ty theo _id
export const getCompanyById = (id) => api.get(`/${id}`);

// 4. Approve theo URL params (PATCH)
export const approveCompanyById = (id) => api.patch(`/${id}/approve`);

// 5. Approve theo body (POST)
export const approveCompany = (company_id) =>
  api.post("/approve", { company_id });

// 6. Lấy token của công ty
export const getCompanyTokens = (company_id) =>
  api.get(`/tokens/${company_id}`);

// 7. Reset dữ liệu
export const resetAllData = () => api.delete("/reset");

// 8. Lấy QR codes của công ty
export const getCompanyQRs = (company_id) => api.get(`/qr/${company_id}`);
