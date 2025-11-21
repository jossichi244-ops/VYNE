import axios from "axios";
import { API_BASE } from "../constants/api";
export const createCompany = async (payload) => {
  return axios.post(`${API_BASE}/api/comp/reg_comp`, payload);
};

export const getCompanies = async () => {
  return axios.get(`${API_BASE}/api/comp/reg_comp`);
};

export const getCompanyById = async (id) => {
  return axios.get(`${API_BASE}/api/comp/${id}`);
};
