import axios from "axios";
import { API_BASE } from "../constants/api";
export const getAllOrders = async () => {
  const res = await axios.get(`${API_BASE}/api/transport-orders`);
  return res.data;
};

export const getOrderById = async (id) => {
  const res = await axios.get(`${API_BASE}/api/transport-orders/${id}`);
  return res.data;
};
// Named export
export const createOrder = async (data, token, isFormData = false) => {
  const headers = { Authorization: `Bearer ${token}` };
  if (isFormData) headers["Content-Type"] = "multipart/form-data";

  const res = await axios.post(`${API_BASE}/api/transport-orders`, data, {
    headers,
  });
  return res.data;
};
