import { createSlice } from "@reduxjs/toolkit";

const executionSlice = createSlice({
  name: "execution",
  initialState: {
    gateActivities: [
      {
        plate: "51C-888.22",
        carrier: "Giao Hàng Nhanh",
        time: "10:45",
        type: "IN",
      },
      {
        plate: "60A-123.45",
        carrier: "Internal Fleet",
        time: "11:02",
        type: "OUT",
      },
    ],
    shipmentStatus: "PLANNING", // PLANNING -> EXECUTING -> DELIVERED
    logs: [],
  },
  reducers: {
    logActivity: (state, action) => {
      state.gateActivities.unshift(action.payload);
    },
    setShipmentStatus: (state, action) => {
      state.shipmentStatus = action.payload;
    },
  },
});

export const { logActivity, setShipmentStatus } = executionSlice.actions;
export default executionSlice.reducer;
