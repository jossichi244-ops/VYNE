import { createSlice } from "@reduxjs/toolkit";

const intakeSlice = createSlice({
  name: "intake",
  initialState: {
    rawOrder: null, // Dữ liệu thô từ ERP/Excel
    normalizedOrder: {}, // Dữ liệu sau khi qua adapter
    validationErrors: [],
    syncStatus: "idle", // idle | connecting | success | failed
  },
  reducers: {
    setRawOrder: (state, action) => {
      state.rawOrder = action.payload;
    },
    updateNormalizedField: (state, action) => {
      const { field, value } = action.payload;
      state.normalizedOrder[field] = value;
    },
    setValidationErrors: (state, action) => {
      state.validationErrors = action.payload;
    },
  },
});

export const { setRawOrder, updateNormalizedField } = intakeSlice.actions;
export default intakeSlice.reducer;
