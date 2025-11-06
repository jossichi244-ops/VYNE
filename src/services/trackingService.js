import axios from "axios";
import { PYTHON_BASE } from "../constants/api";

export const fetchAutoEDA = async () => {
  try {
    const res = await axios.get(`${PYTHON_BASE}/api/auto-parse`);

    const apiResponse = res.data;

    console.log("MongoDB data raw response:", apiResponse);

    // Nếu backend trả về trực tiếp object EDA (không có key 'results')
    if (apiResponse && apiResponse.results) {
      return { results: apiResponse.results };
    } else if (typeof apiResponse === "object" && apiResponse !== null) {
      console.warn(
        "Backend response is missing 'results' key. Wrapping data under 'results' key."
      );
      return { results: apiResponse };
    }

    console.error(
      "Dữ liệu trả về từ API không hợp lệ hoặc trống:",
      apiResponse
    );
    return { results: {} };
  } catch (err) {
    console.error("Lỗi tải dữ liệu MongoDB:", err);
    return { results: { error: err.message || "Unknown API error." } };
  }
};
