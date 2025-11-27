// src/services/authTrackingService.js

const TOKEN_KEY = "token";
const WALLET_KEY = "wallet_address";

let isTracking = false; // tránh đăng ký event nhiều lần

// Xóa cookie
function clearAuthCookies() {
  document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
  document.cookie = `${WALLET_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
}

// Theo dõi reload / F5 / rời trang
export const startUnloadTracking = () => {
  if (isTracking) return; // tránh đăng ký lại

  isTracking = true;

  window.addEventListener("beforeunload", () => {
    clearAuthCookies();
  });

  console.log(
    "🔄 unload tracking enabled: Cookies sẽ tự xoá khi reload/tab close."
  );
};

// Tắt tracking nếu cần
export const stopUnloadTracking = () => {
  if (!isTracking) return;

  window.removeEventListener("beforeunload", clearAuthCookies);
  isTracking = false;

  console.log("🛑 unload tracking disabled.");
};
