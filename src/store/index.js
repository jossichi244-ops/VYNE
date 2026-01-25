import { configureStore } from "@reduxjs/toolkit";
import intakeReducer from "./slices/intakeSlice";
import promiseReducer from "./slices/promiseSlice";
import carrierReducer from "./slices/carrierSlice";
import scoringReducer from "./slices/scoringSlice";
import routeReducer from "./slices/routeSlice";
import executionReducer from "./slices/executionSlice";
const store = configureStore({
  reducer: {
    intake: intakeReducer,
    promise: promiseReducer,
    carrier: carrierReducer,
    execution: executionReducer,
    scoring: scoringReducer,
    route: routeReducer,
  },
  // Middleware có thể thêm logger để debug trong môi trường dev
});

export default store;
