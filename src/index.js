import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux"; // Thêm Provider
import store from "./store"; // Import store (bộ não tập trung)
import AppRoutes from "./routes/index"; // Dùng AppRoutes thay vì App nếu bạn đã cấu hình router
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* Bao bọc toàn bộ ứng dụng để các component bên trong có thể dùng dispatch/selector */}
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  </React.StrictMode>,
);
