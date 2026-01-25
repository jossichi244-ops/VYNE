import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  printerStatus: "online", // 'online', 'error', 'offline'
  paperLevel: 75,
  isPrinting: false,
};

const printSlice = createSlice({
  name: "print",
  initialState,
  reducers: {
    startPrinting: (state) => {
      state.isPrinting = true;
    },
    stopPrinting: (state) => {
      state.isPrinting = false;
      state.paperLevel -= 5; // In xong trừ bớt giấy giả lập
    },
    setPrinterError: (state) => {
      state.printerStatus = "error";
    },
  },
});

export const { startPrinting, stopPrinting, setPrinterError } =
  printSlice.actions;
export default printSlice.reducer;
