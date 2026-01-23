import { configureStore } from "@reduxjs/toolkit";
import intakeReducer from "./slices/intakeSlice";

const store = configureStore({
  reducer: {
    intake: intakeReducer,
    // Sau này bạn sẽ thêm: auth: authReducer, logistics: logisticsReducer...
  },
  // Middleware có thể thêm logger để debug trong môi trường dev
});

export default store;
