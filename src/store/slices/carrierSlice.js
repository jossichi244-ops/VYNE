import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Đồng bộ hóa cấu trúc dữ liệu nhà xe
  candidates: [
    {
      id: "C-001",
      name: "Giao Hàng Nhanh (GHN)",
      type: "3PL",
      basePrice: 45000,
      sla: 0.98,
      riskLevel: "Low",
      status: "Available",
      tags: ["Fast", "API-Enabled"],
    },
    {
      id: "C-002",
      name: "Ninja Van",
      type: "Express",
      basePrice: 38000,
      sla: 0.92,
      riskLevel: "Medium",
      status: "Busy",
      tags: ["Economy", "Rural-Reach"],
    },
    {
      id: "C-003",
      name: "Internal Fleet",
      type: "Last Mile",
      basePrice: 0,
      sla: 0.99,
      riskLevel: "Low",
      status: "Available",
      tags: ["High-Priority", "Secure"],
    },
  ],
  selectedCarrierId: null,
  activeShipment: {
    id: "SHIP-880922",
    destination: "Quận 9, TP. Thủ Đức",
    weight: "2.5kg",
  },
};

const carrierSlice = createSlice({
  name: "carrier",
  initialState,
  reducers: {
    selectCarrier: (state, action) => {
      state.selectedCarrierId = action.payload;
    },
    updateCarrierStatus: (state, action) => {
      const { id, status } = action.payload;
      const carrier = state.candidates.find((c) => c.id === id);
      if (carrier) carrier.status = status;
    },
  },
});

export const { selectCarrier, updateCarrierStatus } = carrierSlice.actions;
export default carrierSlice.reducer;
