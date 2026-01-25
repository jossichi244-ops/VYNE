import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [
    {
      id: "SOC-8812",
      route: "Kho HN - Quận Hoàn Kiếm",
      carrier: "GHTK",
      status: "READY",
      priority: "HIGH",
      actualFee: 0,
      planFee: 15000,
    },
    {
      id: "SOC-8813",
      route: "Kho HN - Quận Ba Đình",
      carrier: "GHN",
      status: "READY",
      priority: "NORMAL",
      actualFee: 0,
      planFee: 12000,
    },
    {
      id: "SOC-8814",
      route: "Nội thành HCM",
      carrier: "Internal Fleet",
      status: "READY",
      priority: "HIGH",
      actualFee: 0,
      planFee: 25000,
    },
  ],
  selectedOrderIds: [],
};

const executionFlowSlice = createSlice({
  name: "executionFlow",
  initialState,
  reducers: {
    toggleSelectOrder: (state, action) => {
      const id = action.payload;
      if (state.selectedOrderIds.includes(id)) {
        state.selectedOrderIds = state.selectedOrderIds.filter((i) => i !== id);
      } else {
        state.selectedOrderIds.push(id);
      }
    },
    dispatchOrders: (state) => {
      state.orders.forEach((order) => {
        if (state.selectedOrderIds.includes(order.id)) {
          order.status = "IN_TRANSIT";
        }
      });
      state.selectedOrderIds = [];
    },
    confirmPOD: (state, action) => {
      const order = state.orders.find((o) => o.id === action.payload);
      if (order) {
        order.status = "DELIVERED";
        order.actualFee = order.planFee; // Giả lập khớp phí khi xong
      }
    },
  },
});

export const { toggleSelectOrder, dispatchOrders, confirmPOD } =
  executionFlowSlice.actions;
export default executionFlowSlice.reducer;
