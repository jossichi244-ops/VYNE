// 🔐 Tiện ích quản lý localStorage cho auth

const TOKEN_KEY = "token";
const WALLET_KEY = "wallet_address";

export const saveAuthData = (token, walletAddress) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (walletAddress) localStorage.setItem(WALLET_KEY, walletAddress);
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getWalletAddress = () => localStorage.getItem(WALLET_KEY);

export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(WALLET_KEY);
};
