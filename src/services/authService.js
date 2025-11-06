import axios from "axios";
import { API_BASE } from "../constants/api";

export const requestNonce = async (walletAddress) => {
  const res = await axios.post(`${API_BASE}/api/auth/request-nonce`, {
    wallet_address: walletAddress,
  });
  return res.data;
};

export const verifySignature = async (walletAddress, signature) => {
  const res = await axios.post(`${API_BASE}/api/auth/verify-signature`, {
    wallet_address: walletAddress,
    signature,
  });
  return res.data;
};
