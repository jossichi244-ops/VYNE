import axios from "axios";

import { API_BASE } from "../../../../../constants/api";
export const fetchContractTemplate = async () => {
  const res = await axios.get(`${API_BASE}/api/contracts/template`);
  return res.data;
};

// Lưu Smart Contract
export const createContract = async (data) => {
  const res = await axios.post(`${API_BASE}/api/contracts`, data);
  return res.data;
};
export const generateBusinessTemplate = async (edaSchema) => {
  const res = await axios.post(`${API_BASE}/api/contracts/generate`, {
    edaSchema,
  });
  return res.data;
};
