import { createSlice } from "@reduxjs/toolkit";
import { STANDARD_ORDER_SCHEMA } from "../../constants/orderSchema";

const initialState = {
  activeSource: "excel",
  rawOrder: null, // Dữ liệu thô từ Excel/ERP
  normalizedOrder: STANDARD_ORDER_SCHEMA, // Dữ liệu sau khi map
  errors: [], // Danh sách lỗi nghiệp vụ
  isMapping: false,
};

const intakeSlice = createSlice({
  name: "intake",
  initialState,
  reducers: {
    // 1. Tiếp nhận dữ liệu thô (Mock upload)
    receiveRawOrder: (state, action) => {
      state.rawOrder = action.payload;
      state.isMapping = true;
    },
    // 2. Mapping thủ công hoặc tự động
    updateField: (state, action) => {
      const { field, value } = action.payload;
      // Update lồng ghép (nested object) nếu cần
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        state.normalizedOrder[parent][child] = value;
      } else {
        state.normalizedOrder[field] = value;
      }
    },
    // 3. Ghi nhận lỗi từ Validation Engine
    setValidationResults: (state, action) => {
      state.errors = action.payload;
    },
    resetIntake: () => initialState,
  },
});

export const {
  receiveRawOrder,
  updateField,
  setValidationResults,
  resetIntake,
} = intakeSlice.actions;
export default intakeSlice.reducer;
