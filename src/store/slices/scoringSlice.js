import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "scoring",
  initialState: {
    weights: {
      price: 0.4,
      sla: 0.3,
      risk: 0.2,
      experience: 0.1,
    },
    history: [],
    thresholds: {
      minSLA: 0.85,
      maxRiskScore: 70,
    },
  },
  reducers: {
    updateWeights: (state, action) => {
      state.weights = { ...state.weights, ...action.payload };
    },
  },
};
const scoringSlice = createSlice({
  name: "scoring",
  initialState,
  reducers: {
    updateWeights: (state, action) => {
      state.weights = { ...state.weights, ...action.payload };
    },
  },
});

export const { updateWeights } = scoringSlice.actions;
export default scoringSlice.reducer;
