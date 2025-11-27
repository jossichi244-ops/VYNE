// utils/authCookies.js

const TOKEN_KEY = "token";
const WALLET_KEY = "wallet_address";

// Set cookie — tự động hết hạn sau 1 ngày (hoặc bạn chỉnh lại)
export const saveAuthData = (token, walletAddress) => {
  if (token) document.cookie = `${TOKEN_KEY}=${token}; path=/; SameSite=Strict`;

  if (walletAddress)
    document.cookie = `${WALLET_KEY}=${walletAddress}; path=/; SameSite=Strict`;
};

// Lấy cookie
export const getCookie = (key) => {
  const match = document.cookie.match(new RegExp(`(^| )${key}=([^;]+)`));
  return match ? match[2] : null;
};

export const getToken = () => getCookie(TOKEN_KEY);
export const getWalletAddress = () => getCookie(WALLET_KEY);

// Xóa cookie
export const clearAuthData = () => {
  document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
  document.cookie = `${WALLET_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
};
