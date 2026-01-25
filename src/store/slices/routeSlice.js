import { createSlice } from "@reduxjs/toolkit";

const routeSlice = createSlice({
  name: "route",
  initialState: {
    activeRoute: {
      origin: "Warehouse A - HCM",
      segments: ["Hub 1", "Hub 2", "Last Mile"],
      constraints: ["No-Liquid", "Max-Height: 2m"],
    },
    consolidationCandidates: [
      { id: "ORD-101", weight: "50kg", savings: "5%" },
      { id: "ORD-105", weight: "120kg", savings: "8%" },
    ],
  },
  reducers: {
    addConstraint: (state, action) => {
      state.activeRoute.constraints.push(action.payload);
    },
  },
});

export const { addConstraint } = routeSlice.actions;
export default routeSlice.reducer;
