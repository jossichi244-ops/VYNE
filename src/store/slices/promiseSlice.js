import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedOption: "NEXT-DAY",
  isComputing: false,
  promiseDetails: {
    "SAME-DAY": {
      cost: 55000,
      confidence: 3,
      sla: "99.2%",
      carrier: "GrabExpress",
    },
    "NEXT-DAY": { cost: 25000, confidence: 3, sla: "99.8%", carrier: "SPX" },
    SCHEDULED: {
      cost: 15000,
      confidence: 2,
      sla: "95.0%",
      carrier: "Internal Fleet",
    },
  },
  riskFactors: [
    { type: "Weather", impact: "High", msg: "Dự báo mưa lớn lúc 16:00" },
    {
      type: "Traffic",
      impact: "Medium",
      msg: "Kẹt xe giờ cao điểm tại cầu Kênh Tẻ",
    },
  ],
};

const promiseSlice = createSlice({
  name: "promise",
  initialState,
  reducers: {
    selectOption: (state, action) => {
      state.selectedOption = action.payload;
    },
    setComputing: (state, action) => {
      state.isComputing = action.payload;
    },
  },
});

export const { selectOption, setComputing } = promiseSlice.actions;
export default promiseSlice.reducer;
