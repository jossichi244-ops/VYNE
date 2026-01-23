import { configureStore } from "@reduxjs/toolkit";
import intakeReducer from "./slices/intakeSlice";
import promiseReducer from "./slices/promiseSlice";
const store = configureStore({
  reducer: {
    intake: intakeReducer,
    promise: promiseReducer,
  },
  // Middleware có thể thêm logger để debug trong môi trường dev
});

export default store;
