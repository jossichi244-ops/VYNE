import React, { createContext, useState } from "react";
import { ethers } from "ethers";
import { requestNonce, verifySignature } from "../services/authService";
import { saveAuthData } from "../store/storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

  // Đăng nhập bằng MetaMask
  const loginWithMetaMask = async () => {
    try {
      if (!window.ethereum) return alert("Vui lòng cài MetaMask!");
      setLoading(true);

      // ✅ Dành cho ethers v4
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const walletAddress = await signer.getAddress();

      // B1: Lấy nonce từ backend
      const { nonce } = await requestNonce(walletAddress);

      // B2: Ký thông điệp
      const message = `Login to System: ${nonce}`;
      const signature = await signer.signMessage(message);

      // B3: Gửi chữ ký để xác minh
      const { token } = await verifySignature(walletAddress, signature);
      // localStorage.setItem("token", token);
      saveAuthData(token, walletAddress);
      setWallet(walletAddress);
      setToken(token);
      alert("✅ Đăng nhập thành công!");
    } catch (err) {
      console.error(err);
      alert("Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setWallet(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ wallet, token, loginWithMetaMask, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
