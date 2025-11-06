import { API_BASE } from "../constants/api";
import { getWalletAddress } from "../store/storage";

export const verifyIdentityService = async ({
  wallet_address,
  id_type,
  id_number,
  dob,
}) => {
  const response = await fetch(`${API_BASE}/api/verify-vneid`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ wallet_address, id_type, id_number, dob }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Lỗi xác minh danh tính từ server.");
  }

  return data; // { success: true, message, user }
};

export const verifyAppointmentService = async ({
  wallet_address,
  id_type,
  id_number,
  full_name,
}) => {
  // --- Lấy wallet từ localStorage nếu chưa có ---
  const finalWalletAddress = wallet_address || getWalletAddress();

  // --- Debug log ---
  console.group("🔍 verifyAppointmentService Debug");
  console.log("API Endpoint:", `${API_BASE}/api/verify-appointment`);
  console.log("Payload gửi đi:", {
    wallet_address: finalWalletAddress,
    id_type,
    id_number,
    full_name,
  });
  console.groupEnd();

  try {
    const response = await fetch(`${API_BASE}/api/verify-appointment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({
        wallet_address: finalWalletAddress,
        id_type,
        id_number,
        full_name,
      }),
    });

    const data = await response.json();

    // --- Debug response ---
    console.log("📩 Server response:", response.status, data);

    if (!response.ok) {
      throw new Error(data.message || "Lỗi xác minh bổ nhiệm từ server.");
    }

    return data; // { success: true, message, user }
  } catch (err) {
    console.error("❌ verifyAppointmentService Error:", err);
    throw err;
  }
};
